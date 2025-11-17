// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Iridescence from "./Iridescence";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (blockRef.current) {
        gsap.from(blockRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.7,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-wrapper">
      {/* FIXED BACKGROUND */}
      <div className="hero-bg">
        <Iridescence
          className="hero-iridescence"
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

      {/* HERO CONTENT */}
      <div className="hero-inner">
        {/* Γραμμή 1 */}
        <div className="hero-line hero-line-1">
          <h1 className="hero-title font-bosch">Το κλειδί</h1>
        </div>

        {/* Γραμμή 2 */}
        <div className="hero-line hero-line-2">
          <h1 className="hero-title font-bosch">για το Ψηφιακό</h1>
        </div>

        {/* Γραμμή 3 + Text block */}
        <div className="hero-bottom-row">
          <div className="hero-line hero-line-3">
            <h1 className="hero-title font-bosch">Μέλλον</h1>
          </div>

          <div ref={blockRef} className="hero-text-block">
            <p>
              Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο.
              Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν
              ακολουθούν τάσεις — τις ξεκινούν. Για brands που δεν ψάχνουν απλώς
              παρουσία στο web, αλλά μια θέση στο μέλλον.
            </p>

            <Link href="/contact" className="hero-cta">
              Ξεκλείδωσε το project σου
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
