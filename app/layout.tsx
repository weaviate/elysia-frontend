import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Manrope, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "./components/contexts/SessionContext";
import SidebarComponent from "./components/navigation/SidebarComponent";
import { CollectionProvider } from "./components/contexts/CollectionContext";
import { ConversationProvider } from "./components/contexts/ConversationContext";
import { RouterProvider } from "./components/contexts/RouterContext";
import { SocketProvider } from "./components/contexts/SocketContext";
import { EvaluationProvider } from "./components/contexts/EvaluationContext";
import StartDialog from "./components/dialog/StartDialog";
import { NewsletterProvider } from "./components/contexts/NewsletterContext";
import NewsletterDialog from "./components/navigation/NewsletterDialog";

import { GoogleAnalytics } from "@next/third-parties/google";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Elysia",
  description: "Your AI Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_G_KEY || ""} />
      <body
        className={`bg-background ${space_grotesk.variable} ${manrope.variable} font-text antialiased flex`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SessionProvider>
            <CollectionProvider>
              <ConversationProvider>
                <RouterProvider>
                  <SocketProvider>
                    <EvaluationProvider>
                      <NewsletterProvider>
                        <SidebarProvider>
                          <SidebarComponent />
                          <main className="flex flex-col md:flex-row w-full gap-2 md:gap-6 items-start justify-start p-2 md:p-6">
                            <img
                              referrerPolicy="no-referrer-when-downgrade"
                              className="absolute bottom-0 right-0"
                              src="https://pixel.weaviate.cloud/a.png?x-pxid=32943cfc-5ae4-4f43-9f12-0c057a0b0df9"
                            />
                            <SidebarTrigger className="text-secondary hover:text-primary hover:bg-foreground_alt z-50" />
                            <StartDialog />
                            <NewsletterDialog />
                            {children}
                          </main>
                        </SidebarProvider>
                      </NewsletterProvider>
                    </EvaluationProvider>
                  </SocketProvider>
                </RouterProvider>
              </ConversationProvider>
            </CollectionProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
