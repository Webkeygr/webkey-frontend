// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import StructuredData from "./components/StructuredData";
import PageTransition from "./components/PageTransition";
import HistoryTransitionBridge from "./components/HistoryTransitionBridge"; // ✅ ΝΕΟ import

export const metadata: Metadata = {
  metadataBase: new URL("https://webkey.gr"),
  title: {
    default: "Webkey — Dare Against Normal",
    template: "%s | Webkey",
  },
  description: "Creative web experiences",
  keywords: [
    "web design",
    "web development",
    "eshop",
    "branding",
    "digital marketing",
    "Next.js",
    "WordPress headless",
  ],
  alternates: {
    canonical: "https://webkey.gr/",
    languages: {
      el: "https://webkey.gr/",
      en: "https://webkey.gr/en/",
    },
  },
  openGraph: {
    type: "website",
    url: "https://webkey.gr/",
    siteName: "Webkey",
    title: "Webkey — The Key to the Future",
    description: "Creative web experiences",
    images: [{ url: "/og/webkey-og.jpg", width: 1200, height: 630 }],
    locale: "el_GR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@webkey",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <head>
        <link
          rel="preload"
          href="/fonts/ITC-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <PageTransition>
          {/* 🔥 Bridge για back/forward του browser */}
          <HistoryTransitionBridge />

          <Header />
          <main>{children}</main>
          <StructuredData />
        </PageTransition>
      </body>
    </html>
  );
}
