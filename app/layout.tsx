import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Building and Delivering Intelligent Systems`,
  },
  description:
    "PG Ventures is a technology-driven company with two divisions: PG Technologies builds scalable software and intelligent systems, while PG Consulting designs and implements them for businesses.",
  keywords: [
    "PG Ventures",
    "PG Technologies",
    "PG Consulting",
    "software development",
    "business systems",
    "automation",
    "AI systems",
    "CRM ERP",
    "data pipelines",
  ],
  authors: [{ name: "PG Ventures LLC" }],
  creator: "PG Ventures LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Building and Delivering Intelligent Systems`,
    description:
      "Two specialized arms. One integrated approach. We design, build, and implement systems that help businesses operate smarter, faster, and at scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Building and Delivering Intelligent Systems`,
    description:
      "Two specialized arms. One integrated approach. We design, build, and implement systems that help businesses operate smarter, faster, and at scale.",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
