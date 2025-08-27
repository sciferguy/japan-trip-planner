// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import HttpLogger from './providers/HttpLogger'
import { auth } from "@/lib/auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: { default: "Japan Trip Planner", template: "%s | Japan Trip Planner" },
    description: "Plan your perfect trip to Japan"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <ThemeProvider>
                        <MainLayout>
                            <HttpLogger />
                            {children}
                        </MainLayout>
                        <Toaster
                            position="top-center"
                            richColors
                            closeButton
                            theme="light"
                        />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}