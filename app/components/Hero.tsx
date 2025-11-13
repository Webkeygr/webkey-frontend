// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Iridescence from "./Iridescence";
import TitleReveal from "./ui/title-reveal";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

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
    <section ref={heroRef} className="hero relative">
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
          hero-inner relative z-10 flex h-full flex-col
          items-start justify-center text-left
          -translate-y-2 md:-translate-y-4
          pl-6 md:pl-16 pr-6
        "
      >
        {/* Τίτλος */}
        <h1 className="hero-title">
          <TitleReveal
            lines={["Το κλειδί", "για το Ψηφιακό", "Μέλλον"]}
            delay={0.1}
            lineStagger={0.12}
          />
        </h1>

        {/* Κείμενο – πιο χαμηλά και λίγο πιο αριστερά */}
        <p
          ref={subtitleRef}
          className="
            hero-text text-black
            absolute
            top-[60%]
            right-[12%] md:right-[18%]
            max-w-md
          "
        >
          Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο. Δημιουργούμε
          εμπειρίες, ταυτότητες και ιστοσελίδες που δεν ακολουθούν τάσεις — τις
          ξεκινούν. Για brands που δεν ψάχνουν απλώς παρουσία στο web, αλλά μια
          θέση στο μέλλον.
        </p>

        {/* CTA pill στο κέντρο */}
        <div
          className="
            absolute
            inset-x-0 bottom-10
            flex justify-center
          "
        >
          <Link
            href="/contact"
            className="
              inline-flex items-center justify-center
              px-8 py-3
              rounded-full
              bg-black/85
              text-white text-sm md:text-base font-medium
              shadow-lg shadow-black/30
              backdrop-blur
              transition
              hover:bg-black
              hover:shadow-xl
            "
          >
            Ξεκλείδωσε το project σου
          </Link>
        </div>
      </div>
    </section>
  );
}
