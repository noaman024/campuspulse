import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";

export const viewport: Viewport = {
  themeColor: "#08090D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.startsWith("http")
  ? process.env.NEXTAUTH_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CampusPulse — Campus Event Discovery, Feedback & Media Hub",
    template: "%s | CampusPulse",
  },
  description:
    "Centralized campus event discovery, dynamic feedback surveys, live Q&A forums, media showcases, and institutional report generation for modern university communities.",
  keywords: [
    "CampusPulse",
    "Campus Events",
    "University Event Discovery",
    "College Fest Registration",
    "Student Feedback Survey",
    "Live Event Q&A",
    "Campus Passes",
    "QR Ticket Verification",
    "College Hackathons",
    "Campus Community",
  ],
  authors: [{ name: "CampusPulse Team" }],
  creator: "CampusPulse",
  publisher: "CampusPulse Platform",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CampusPulse",
    title: "CampusPulse — Campus Event Discovery & Feedback Platform",
    description:
      "Discover college events, register with instant scannable QR tickets, submit feedback, and join live campus discussions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusPulse — Campus Event Discovery & Feedback Platform",
    description:
      "Centralized campus event discovery, feedback surveys, and instant QR passes for students.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CampusPulse",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/events?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
