"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

// EL = χωρίς /en, EN = με /en
function toggleLocale(pathname: string, to: "el" | "en") {
  if (to === "el") {
    return pathname.startsWith("/en")
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname || "/";
  }

  return pathname.startsWith("/en") ? pathname : `/en${pathname === "/" ? "/" : pathname}`;
}

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const isEnglish = pathname.startsWith("/en");

  const elHref = useMemo(() => toggleLocale(pathname, "el"), [pathname]);
  const enHref = useMemo(() => toggleLocale(pathname, "en"), [pathname]);

  // Το switch σε πάει στην ΑΛΛΗ γλώσσα
  const targetHref = isEnglish ? elHref : enHref;
  const ariaLabel = isEnglish ? "Switch to Greek" : "Switch to English";

  // Track: ασπρόμαυρο flag της γλώσσας που ΘΑ εμφανιστεί αν μεταβείς;
  // Στο mockup σου: όταν είσαι EN -> UK στο track, όταν είσαι GR -> GR στο track.
  const trackFlag = isEnglish
    ? "url('/images/flags/uk-track.png')" // EN active (πάνω mockup)
    : "url('/images/flags/gr-track.png')"; // GR active (κάτω mockup)

  const labelBase = "text-xs sm:text-sm tracking-wide";
  const activeLabel = "font-semibold text-black";
  const inactiveLabel = "font-normal text-black/60";

  return (
    <Link
      href={targetHref}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}
    >
      {/* GR label */}
      <span className={`${labelBase} ${!isEnglish ? activeLabel : inactiveLabel}`}>GR</span>

      {/* Slider */}
      <div
        className="
          relative h-7 w-16 sm:h-8 sm:w-20
          rounded-full
          bg-white
          shadow-[0_10px_25px_rgba(0,0,0,0.18)]
          overflow-hidden
          transition-shadow
          hover:shadow-[0_14px_32px_rgba(0,0,0,0.25)]
        "
      >
        {/* Track με flag σε grayscale */}
        <div
          className="
            absolute inset-0
            bg-center bg-cover
            grayscale
          "
          style={{ backgroundImage: trackFlag }}
        />

        {/* Λευκό κυκλάκι */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            h-7 w-7 sm:h-[2.1rem] sm:w-[2.1rem]
            rounded-full
            bg-white
            border border-neutral-300
            shadow-[0_6px_14px_rgba(0,0,0,0.35)]
            transition-transform duration-250 ease-out
            ${isEnglish ? "right-0.5" : "left-0.5"}
          `}
        />
      </div>

      {/* EN label */}
      <span className={`${labelBase} ${isEnglish ? activeLabel : inactiveLabel}`}>EN</span>
    </Link>
  );
}
