// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { auth } from "@/lib/auth";
import { MainLayout } from "@/components/layout/MainLayout";

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
                            {children}
                        </MainLayout>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}