import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Trip Planner",
  description: "Modern Japan trip planning application with comprehensive itinerary management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
