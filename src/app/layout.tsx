import type { Metadata } from "next";
import * as Sentry from '@sentry/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import {Toaster} from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Next.js Boilerplate",
    description: "Boilerplate for Next.js projects with TypeScript, Sentry, Tailwind CSS, and more.",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const gtmId = process.env.GTM_ID;
    if (!gtmId) {
        Sentry.captureMessage("GTM_ID is not defined in environment variables");
    }

    return (
        <html lang="en" suppressHydrationWarning>
        <GoogleTagManager gtmId={process.env.GTM_ID || ""} />
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster/>
        </ThemeProvider>

        </body>
        </html>
    );
}
