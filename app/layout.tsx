// app/layout.jsx
export const metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web experiences",
};

import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web experiences",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
