import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "DigitalMenu | Premium QR-Based Menu Management SaaS",
  description: "Transform your restaurant dining experience with a luxury QR-based digital menu. Edit categories, update items, customize themes, and print premium table tent templates instantly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full dark antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white font-sans selection:bg-[#D4A437]/30 selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
