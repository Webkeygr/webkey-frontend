// app/components/HistoryTransitionBridge.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";

function getLabelFromPath(pathname: string): string {
  if (pathname === "/" || pathname === "/en" || pathname === "/en/") {
    return "Home";
  }
  if (pathname === "/contact" || pathname === "/en/contact") {
    return "Contact";
  }

  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function HistoryTransitionBridge() {
  const { startTransition } = usePageTransition();
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  // Κρατάμε πάντα το τελευταίο γνωστό pathname
  useEffect(() => {
    lastPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname;
      const lastPath = lastPathRef.current;

      // Αν για κάποιο λόγο είναι το ίδιο, δεν κάνουμε τίποτα
      if (newPath === lastPath) return;

      lastPathRef.current = newPath;

      const label = getLabelFromPath(newPath);

      // 🔥 Παίζουμε ΜΟΝΟ animation – δεν κάνουμε navigate γιατί το έκανε ήδη ο browser
      startTransition(label, () => {});
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [startTransition]);

  return null;
}
