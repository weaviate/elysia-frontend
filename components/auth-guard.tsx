"use client";

import { createClient } from "@/lib/supabase/client";
import { isStaticMode } from "@/app/components/host";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();
    const nextPathname = usePathname();

    // In static mode, usePathname() may not reflect the real URL.
    const pathname = typeof window !== "undefined"
        ? window.location.pathname
        : nextPathname;

    // Skip auth on dev mode (localhost:3090 or internal network IPs like 10.1.1.11:3090)
    const isDevMode = typeof window !== "undefined" &&
        window.location.port === "3090" &&
        (window.location.hostname === "localhost" ||
         window.location.hostname === "10.1.1.11" ||
         window.location.hostname.startsWith("192.168.") ||
         window.location.hostname.startsWith("10."));

    const loginPage = pathname === "/login";
    const callbackPage = pathname === "/auth/callback";

    // Public pages (login + callback) render immediately without auth check.
    // Also skip auth on dev mode (localhost:3090)
    const publicPage = loginPage || callbackPage || isDevMode;

    // Start unauthorized until session is confirmed (both modes).
    // On public pages, start authorized so content renders immediately.
    const [authorized, setAuthorized] = useState<boolean>(publicPage);

    useEffect(() => {
        if (isDevMode) {
            setAuthorized(true);
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AuthGuard: Auth state change:", event, "session:", !!session);
            if (event === "SIGNED_OUT") {
                setAuthorized(false);
                if (isStaticMode) {
                    window.location.replace("/login");
                } else {
                    router.replace("/login");
                }
            } else if (
                event === "SIGNED_IN" ||
                event === "INITIAL_SESSION" ||
                event === "TOKEN_REFRESHED"
            ) {
                if (session) {
                    setAuthorized(true);
                    if (loginPage) {
                        if (isStaticMode) {
                            window.location.replace("/");
                        } else {
                            router.replace("/");
                        }
                    }
                } else if (event === "INITIAL_SESSION" && !publicPage) {
                    // No session on a protected page — redirect to login.
                    // Skip if URL hash has access_token (Supabase is processing it).
                    const hash = typeof window !== "undefined" ? window.location.hash : "";
                    if (!hash.includes("access_token=")) {
                        setAuthorized(false);
                        if (isStaticMode) {
                            window.location.replace("/login");
                        } else {
                            router.replace("/login");
                        }
                    }
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase.auth, publicPage, loginPage, isDevMode]);

    // On public pages (login, callback), render children directly without app shell
    if (publicPage) {
        return <>{children}</>;
    }

    if (!authorized) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-primary gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>Loading application...</p>
            </div>
        );
    }

    return <>{children}</>;
}
