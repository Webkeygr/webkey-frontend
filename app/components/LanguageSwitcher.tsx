"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

// Κανόνας: EL = χωρίς prefix, EN = /en
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
    "inline-flex items-center justify-center rounded-2xl px-3 py-1.5 text-xs sm:text-sm font-medium text-black transition-all bg-white/80 shadow-md border border-black/10 backdrop-blur";

  const active = "shadow-lg border-black/40 scale-[1.03] opacity-100";
  const inactive =
    "opacity-60 hover:opacity-100 hover:shadow-lg hover:border-black/30";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        href={elHref}
        aria-label="Greek"
        aria-current={current === "el" ? "page" : undefined}
        className={`${base} ${current === "el" ? active : inactive}`}
      >
        EL
      </Link>

      <span className="opacity-40 text-xs">/</span>

      <Link
        href={enHref}
        aria-label="English"
        aria-current={current === "en" ? "page" : undefined}
        className={`${base} ${current === "en" ? active : inactive}`}
      >
        EN
      </Link>
    </div>
  );
}
