// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
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
          -translate-y-6 md:-translate-y-10
          pl-6 md:pl-16 pr-6
        "
      >
        {/* Title with true masked reveal (μόνο στον τίτλο) */}
        <h1 className="hero-title">
          <TitleReveal
            lines={["Το κλειδί", "για το Ψηφιακό", "Μέλλον"]}
            delay={0.1}
            lineStagger={0.12}
            /* className εδώ αν θες extra κλάσεις στον wrapper του τίτλου */
          />
        </h1>

        {/* Κάτω-αριστερά, μαύρο */}
        <p
          ref={subtitleRef}
          className="
            hero-text text-black
            absolute left-6 md:left-16 bottom-8
          "
        >
          Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο. Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν ακολουθούν τάσεις — τις ξεκινούν.
Για brands που δεν ψάχνουν απλώς παρουσία στο web, αλλά μια θέση στο μέλλον.
        </p>
      </div>
    </section>
  );
}
