// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import StructuredData from "./components/StructuredData";

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
    title: "Webkey — Dare Against Normal",
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
      <body>
        <Header />
        {/* ΧΩΡΙΣ padding-top -> το header κάνει overlap πάνω στο hero */}
        <main>{children}</main>

        {/* JSON-LD Organization (αόρατο, μόνο SEO) */}
        <StructuredData />
      </body>
    </html>
  );
}
