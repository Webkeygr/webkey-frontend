"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

// Κανόνας: EL=χωρίς prefix, EN=/en
function toggleLocale(pathname: string, to: "el" | "en") {
  if (to === "el") {
    return pathname.startsWith("/en")
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname || "/";
  }
  return pathname.startsWith("/en")
    ? pathname
    : `/en${pathname === "/" ? "/" : pathname}`;
}

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const current = pathname.startsWith("/en") ? "en" : "el";

  const elHref = useMemo(() => toggleLocale(pathname, "el"), [pathname]);
  const enHref = useMemo(() => toggleLocale(pathname, "en"), [pathname]);

  const base =
    "inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm transition";
  const active = "opacity-100 shadow-sm";
  const inactive = "opacity-60 hover:opacity-100";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        className={`${base} ${current === "el" ? active : inactive}`}
        href={elHref}
        aria-label="Greek"
      >
        EL
      </Link>
      <span className="opacity-40">/</span>
      <Link
        className={`${base} ${current === "en" ? active : inactive}`}
        href={enHref}
        aria-label="English"
      >
        EN
      </Link>
    </div>
  );
}
