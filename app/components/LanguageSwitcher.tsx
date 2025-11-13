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

  // target = η άλλη γλώσσα
  const targetHref = isEnglish ? elHref : enHref;
  const ariaLabel = isEnglish ? "Switch to Greek" : "Switch to English";

  // Κύκλος (full color)
  const knobFlag = isEnglish
    ? "url('/images/flags/uk-circle.png')"
    : "url('/images/flags/gr-circle.png')";

  // Track (ξεχωριστά PNG, γκρι)
  const trackFlag = isEnglish
    ? "url('/images/flags/gr-track.png')" // EL inactive στη μπάρα
    : "url('/images/flags/uk-track.png')"; // EN inactive στη μπάρα

  return (
    <Link
      href={targetHref}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className="
          relative h-9 w-22 sm:h-10 sm:w-28
          rounded-full
          bg-white/60
          shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          backdrop-blur
          overflow-hidden
          transition-shadow
          hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]
        "
      >
        {/* Track με ασπρόμαυρη σημαία της ΜΗ ενεργής γλώσσας */}
        <div className="absolute inset-0">
          <div
            className="
              absolute inset-0
              bg-center bg-cover
              grayscale
            "
            style={{ backgroundImage: trackFlag }}
          />
          {/* Gradient κοντά στο knob για να ηρεμεί το pattern */}
          {isEnglish ? (
            <div className="absolute inset-y-0 left-7 sm:left-9 w-8 sm:w-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
          ) : (
            <div className="absolute inset-y-0 right-7 sm:right-9 w-8 sm:w-10 bg-gradient-to-l from-white via-white/80 to-transparent" />
          )}
        </div>

        {/* Κυκλάκι με ενεργή σημαία */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            h-10 w-10
            rounded-full
            bg-center bg-cover
            shadow-[0_10px_25px_rgba(0,0,0,0.4)]
            border border-white/70
            transition-transform duration-300 ease-out
            ${isEnglish ? "left-[-2px] sm:left-[-4px]" : "right-[-2px] sm:right-[-4px]"}
          `}
          style={{ backgroundImage: knobFlag }}
        />
      </div>
    </Link>
  );
}
