"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRANDING } from "@/app/config/branding";
import {
    getAuthProviderMode,
    getOAuthRedirectPath,
    isEmulatorAuthProvider,
} from "@/lib/auth/provider";
import { useThemeLogo } from "@/hooks/useThemeLogo";

const supabase = createClient();

export default function LoginPage() {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const themeLogo = useThemeLogo();

    useEffect(() => {
        // Dev mode: skip login and go directly to home
        const isDevMode =
            window.location.port === "3090" &&
            (window.location.hostname === "localhost" ||
                window.location.hostname === "10.1.1.11" ||
                window.location.hostname.startsWith("192.168.") ||
                window.location.hostname.startsWith("10."));
        if (isDevMode && !window.location.hash.includes("access_token")) {
            window.location.replace("/");
            return;
        }

        const handleHashTokens = async () => {
            const hash = window.location.hash;
            if (hash && hash.includes("access_token")) {
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get("access_token");
                const refreshToken = params.get("refresh_token");

                if (accessToken && refreshToken) {
                    try {
                        const serverSessionResponse = await fetch("/api/auth/session", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                            }),
                        });

                        if (serverSessionResponse.ok) {
                            window.history.replaceState(null, "", "/login");
                            window.location.assign("/");
                            return;
                        }
                    } catch (e) {
                        console.error("LoginPage: /api/auth/session request failed", e);
                    }

                    // Fallback to browser-side setSession if server session endpoint is unavailable.
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (!error) {
                        window.history.replaceState(null, "", "/login");
                        window.location.assign("/");
                        return;
                    }
                    console.error("LoginPage: setSession error", error);
                }
            }
        };

        handleHashTokens();
        return () => undefined;
    }, [supabase.auth]);

    const handleLogin = async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setLoginError(null);
        setLoading(true);

        const appOrigin = window.location.origin;

        try {
            const providerMode = getAuthProviderMode();
            const redirectPath = getOAuthRedirectPath();
            const redirectTo = `${appOrigin}${redirectPath}`;

            if (isEmulatorAuthProvider(providerMode)) {
                // Emulator: route through proxy to rewrite Docker-internal URLs
                const params = new URLSearchParams({
                    provider: "azure",
                    scopes: "openid profile email",
                    redirect_to: redirectTo,
                });
                window.location.assign(`/api/auth/authorize?${params.toString()}`);
                return;
            }

            // Entra ID: use signInWithOAuth which handles PKCE + redirect
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "azure",
                options: {
                    scopes: "openid profile email",
                    redirectTo,
                    skipBrowserRedirect: true,
                },
            });
            if (error) {
                console.error("LoginPage: signInWithOAuth error", error);
                setLoginError(`Errore OAuth: ${error.message}`);
                setLoading(false);
                return;
            }
            if (data?.url) {
                window.location.assign(data.url);
            } else {
                console.error("LoginPage: no URL returned from signInWithOAuth");
                setLoginError("Nessun URL di redirect ricevuto");
                setLoading(false);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("LoginPage: OAuth error:", message, error);
            setLoginError(`Errore di autenticazione: ${message}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6">
            {/* Logo with shine animation */}
            <div className="mb-8 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-background_alt flex items-center justify-center border border-border">
                    <img
                        src={themeLogo}
                        alt={BRANDING.appName}
                        width={48}
                        height={48}
                        className="w-12 h-12"
                    />
                </div>
                <h1 className="text-4xl font-heading font-bold text-primary shine">
                    {BRANDING.appName}
                </h1>
                <p className="text-secondary text-lg">Your AI Platform</p>
            </div>

            {/* Login card */}
            <div className="w-full max-w-md bg-background_alt rounded-xl border border-border p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-2">
                        Benvenuta/o
                    </h2>
                    <p className="text-secondary text-sm">
                        Accedi con il tuo account aziendale per continuare
                    </p>
                </div>

                {/* Error display */}
                {loginError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {loginError}
                    </div>
                )}

                {/* Microsoft login button */}
                <a
                    href="#"
                    onClick={handleLogin}
                    className={`w-full flex items-center justify-center gap-3 bg-[#0078D4] hover:bg-[#006cbd] text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${loading ? "opacity-70 pointer-events-none" : ""}`}
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 21 21"
                        >
                            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                        </svg>
                    )}
                    {loading ? "Reindirizzamento..." : "Accedi con Microsoft"}
                </a>

                {/* Footer hint */}
                <p className="mt-6 text-center text-xs text-secondary">
                    Utilizzando questo servizio accetti i termini di utilizzo della
                    piattaforma.
                </p>
            </div>

            {/* Version/branding footer */}
            <div className="mt-8 text-xs text-secondary">
                Powered by Supabase &amp; Entra ID
            </div>
        </div>
    );
}
