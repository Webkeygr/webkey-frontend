// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Fixed header */}
        <Header />

        {/* Push content below the 72px header */}
        <main style={{ paddingTop: "72px" }}>{children}</main>
      </body>
    </html>
  );
}
