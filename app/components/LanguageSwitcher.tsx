"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// EL = χωρίς /en, EN = με /en
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

// Ίδιο hook με του Header – βλέπει αν ο μαύρος κύκλος γεμίζει την οθόνη
function useAboutDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      const circle = document.querySelector<HTMLElement>(".about-black-circle");
      if (!circle) {
        setIsDark(false);
        return;
      }

      const rect = circle.getBoundingClientRect();
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;

      const coversScreen =
        rect.width >= vw * 0.9 &&
        rect.height >= vh * 0.9 &&
        rect.top <= 0.1 * vh &&
        rect.bottom >= 0.9 * vh;

      setIsDark(coversScreen);
    };

    check();
    window.addEventListener("scroll", check);
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return isDark;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const isEnglish = pathname.startsWith("/en");
  const greekHref = toggleLocale(pathname, "el");
  const englishHref = toggleLocale(pathname, "en");

  const isAboutDark = useAboutDark();

  // Μαύρο background => λευκά γράμματα, αλλιώς μαύρα
  const activeColor = isAboutDark ? "#ffffff" : "#000000";
  const inactiveColor = isAboutDark
    ? "rgba(255,255,255,0.65)"
    : "rgba(0,0,0,0.6)";

  const labelBase =
    "lang-label text-[11px] md:text-xs tracking-[0.16em] uppercase transition-colors";
  const activeLabel = "font-semibold";
  const inactiveLabel = "font-medium";

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* GR */}
      <Link
        href={greekHref}
        aria-label="Switch language to Greek"
        className="flex items-center gap-1"
      >
        <span
          className={`${labelBase} ${!isEnglish ? activeLabel : inactiveLabel}`}
          style={{ color: !isEnglish ? activeColor : inactiveColor }}
        >
          GR
        </span>
      </Link>

      {/* Switch pill */}
      <div className="relative h-4 w-8 rounded-full bg-neutral-200">
        <div
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-neutral-900 transition-transform duration-200 ${
            isEnglish ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </div>

      {/* EN */}
      <Link
        href={englishHref}
        aria-label="Switch language to English"
        className="flex items-center gap-1"
      >
        <span
          className={`${labelBase} ${isEnglish ? activeLabel : inactiveLabel}`}
          style={{ color: isEnglish ? activeColor : inactiveColor }}
        >
          EN
        </span>
      </Link>
    </div>
  );
}
