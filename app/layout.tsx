// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web experiences",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {/* ΧΩΡΙΣ padding-top -> το header κάνει overlap πάνω στο hero */}
        <main>{children}</main>
      </body>
    </html>
  );
}
