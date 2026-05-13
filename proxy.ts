import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthProviderMode, getOAuthRedirectPath, isEmulatorAuthProvider } from "@/lib/auth/provider";
import { getSupabaseCookieOptions } from "@/lib/supabase/cookies";

export async function proxy(request: NextRequest) {
    const providerMode = getAuthProviderMode();
    const isEmulatorProvider = isEmulatorAuthProvider(providerMode);

    // Dev mode bypass: skip auth on port 3090 from internal hosts
    const host = request.headers.get("host") || "";
    const [hostname, port] = host.split(":");
    const isDevMode =
        port === "3090" &&
        (hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "10.1.1.11" ||
            hostname.startsWith("192.168.") ||
            hostname.startsWith("10."));
    if (isDevMode) {
        // Redirect away from /login in dev mode so we land on home
        if (request.nextUrl.pathname === "/login") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return NextResponse.next({ request: { headers: request.headers } });
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Server-side needs a full URL; NEXT_PUBLIC_SUPABASE_URL may be a relative path
    const supabaseUrl = process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase = createServerClient(
        supabaseUrl,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookieOptions: getSupabaseCookieOptions(),
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users to login
    // Exclude login page, API routes, and static assets
    const isLoginPage = request.nextUrl.pathname === "/login";
    const isAuthCallbackPage = request.nextUrl.pathname === getOAuthRedirectPath();

    const isApiRoute = request.nextUrl.pathname.startsWith("/api");
    // Proxy routes: Supabase, Entra emulator, and Elysia backend APIs
    // These bypass Next.js middleware auth checks (Elysia handles its own auth or was previously accessed directly)
    const isProxyRoute =
        request.nextUrl.pathname.startsWith("/supabase") ||
        request.nextUrl.pathname.startsWith("/n8n") ||
        (isEmulatorProvider && request.nextUrl.pathname.startsWith("/entra")) ||
        (isEmulatorProvider && request.nextUrl.pathname.startsWith("/common")) ||
        // Elysia backend routes
        request.nextUrl.pathname.startsWith("/init") ||
        request.nextUrl.pathname.startsWith("/user") ||
        request.nextUrl.pathname.startsWith("/collections") ||
        request.nextUrl.pathname.startsWith("/db") ||
        request.nextUrl.pathname.startsWith("/tree") ||
        request.nextUrl.pathname.startsWith("/feedback") ||
        request.nextUrl.pathname.startsWith("/util") ||
        request.nextUrl.pathname.startsWith("/ws");
    const isStaticAsset =
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.includes(".");

    if (
        !user &&
        !isLoginPage &&
        !isAuthCallbackPage &&
        !isApiRoute &&
        !isProxyRoute &&
        !isStaticAsset
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from login page
    if (user && isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
