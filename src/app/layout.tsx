import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "CampusPulse — Event Discovery & Feedback Platform",
  description:
    "Centralized campus event discovery, Google-Forms-like feedback engine, media galleries, and automated report generation for campus communities.",
  keywords: ["campus events", "feedback", "RSVP", "QR tickets", "event management"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsentBanner />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
