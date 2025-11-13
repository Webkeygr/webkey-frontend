// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Iridescence from "./Iridescence";
import TitleReveal from "./ui/title-reveal";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.5,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero relative overflow-hidden">
      {/* === FIXED BACKGROUND === */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Iridescence
          className="hero-iridescence w-full h-full"
          mouseReact={true}
          speed={1.9}
          amplitude={0.1}
          opacity={0.9}
          scale={1.1}
          cutRadius={130}
          cutFeather={90}
          cutStrength={0.012}
          waveWidth={58}
          waveOpacity={0.95}
          colorA="#FF00F2"
          colorB="#0090FF"
          bandTopPct={0.22}
          bandBottomPct={0.7}
          bandFeatherPx={90}
          ampMainFactor={0.34}
          ampSubFactor={0.16}
          yOffsetPct={0.1}
        />
      </div>

      {/* === Hero content === */}
      <div
        className="
          hero-inner relative z-10 flex min-h-[90vh] flex-col
          justify-center
          px-6 md:px-16
        "
      >
        {/* Τίτλος – responsive μέγεθος */}
        <div className="hero-title leading-[0.85] text-[clamp(3rem,7vw,7rem)]">
          <TitleReveal
            lines={["Το κλειδί", "για το Ψηφιακό", "Μέλλον"]}
            delay={0.1}
            lineStagger={0.12}
          />
        </div>

        {/* Block: κείμενο + CTA */}
        <div
          ref={subtitleRef}
          className="
            mt-6 max-w-md
            text-black text-sm md:text-base
            space-y-4

            xl:absolute
            xl:top-[64%]
            xl:right-[12%]
            xl:mt-0
          "
        >
          <p>
            Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο.
            Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν
            ακολουθούν τάσεις — τις ξεκινούν. Για brands που δεν ψάχνουν
            απλώς παρουσία στο web, αλλά μια θέση στο μέλλον.
          </p>

          <Link
            href="/contact"
            className="
              inline-flex items-center justify-center
              px-8 py-3
              rounded-full
              bg-white
              text-black text-sm md:text-base font-medium
              shadow-lg shadow-black/25
              backdrop-blur
              transition
              hover:shadow-xl
              hover:-translate-y-0.5
            "
          >
            Ξεκλείδωσε το project σου
          </Link>
        </div>
      </div>
    </section>
  );
}
