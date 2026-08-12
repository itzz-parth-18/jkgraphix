import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import Footer from "@/components/Footer";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import Script from "next/script";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat"; // Naya WhatsApp floating button import kiya

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jkgraphix.com'),
  title: {
    default: "JK Graphix — Custom Printing & Design Solutions",
    template: "%s | JK Graphix",
  },
  description: "Professional custom printing, business branding, and design solutions by JK Graphix.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "JK Graphix",
    title: "JK Graphix — Custom Printing & Design Solutions",
    description: "Professional custom printing, business branding, and design solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JK Graphix — Custom Printing & Design Solutions",
    description: "Professional custom printing, business branding, and design solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between">
        <AuthSessionProvider>
          <div className="flex-grow">{children}</div>

          <Footer />

          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
        </AuthSessionProvider>

        {/* Global Floating WhatsApp Button */}
        <WhatsAppFloat />

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}