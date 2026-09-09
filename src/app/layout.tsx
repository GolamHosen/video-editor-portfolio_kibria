import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LenisProvider } from "@/components/providers/LenisProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VisualCraft — Video Editor & Motion Designer",
    template: "%s | VisualCraft",
  },
  description:
    "Premium creative portfolio of a Video Editor, Motion Graphics Designer, and Visual Artist. Cinematic storytelling through creative visuals.",
  keywords: [
    "video editor",
    "motion graphics",
    "graphic designer",
    "creative portfolio",
    "visual artist",
    "brand film",
    "animation",
  ],
  authors: [{ name: "VisualCraft" }],
  creator: "VisualCraft",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL
      ? (process.env.NEXT_PUBLIC_APP_URL.startsWith("http") ? process.env.NEXT_PUBLIC_APP_URL : `https://${process.env.NEXT_PUBLIC_APP_URL}`)
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL
      ? (process.env.NEXT_PUBLIC_APP_URL.startsWith("http") ? process.env.NEXT_PUBLIC_APP_URL : `https://${process.env.NEXT_PUBLIC_APP_URL}`)
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000",
    title: "VisualCraft — Video Editor & Motion Designer",
    description:
      "Premium creative portfolio showcasing cinematic video editing, motion graphics, and graphic design.",
    siteName: "VisualCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisualCraft — Video Editor & Motion Designer",
    description:
      "Premium creative portfolio showcasing cinematic video editing, motion graphics, and graphic design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="bg-[#0a0a0a] text-white antialiased grain"
        suppressHydrationWarning
      >
        <CustomCursor />
        <LenisProvider>
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
