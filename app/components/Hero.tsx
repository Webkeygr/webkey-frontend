// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Iridescence from "./Iridescence";
import TitleReveal from "./ui/title-reveal";

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
          delay: 0.5,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden">
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

      {/* === HERO CONTENT === */}
      <div
        className="
          relative z-10
          flex min-h-[90vh]
          items-center justify-center
          px-6 md:px-16
        "
      >
        {/* Outer frame μέχρι 1900px */}
        <div className="w-full max-w-[1900px] mx-auto">
          {/* Inner box στο κέντρο (σαν poster) */}
          <div className="w-full max-w-[1300px] mx-auto">
            <div
              className="
                grid
                grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]
                gap-10
                items-start
              "
            >
              {/* ΤΙΤΛΟΣ – πολύ μεγάλος, τρεις γραμμές όπως στο mock */}
              <h1
                className="
                  hero-title
                  text-left
                  leading-[0.72]
                  font-normal
                  select-none
                "
                style={{
                  fontFamily: '"Bosch", system-ui, sans-serif',
                  // ΠΟΛΥ μεγαλύτερος τίτλος
                  fontSize: "clamp(6rem, 10vw, 15rem)",
                }}
              >
                <TitleReveal
                  lines={["Το Κλειδί", "για το Ψηφιακό", "Μέλλον"]}
                  delay={0.1}
                  lineStagger={0.12}
                />
              </h1>

              {/* Κείμενο + CTA – χαμηλά δίπλα στη λέξη «Μέλλον» */}
              <div
                ref={blockRef}
                className="
                  text-black
                  text-sm md:text-base
                  space-y-4
                  max-w-md
                  self-center
                  md:self-end
                  md:translate-y-6
                "
              >
                <p>
                  Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο.
                  Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν
                  ακολουθούν τάσεις — τις ξεκινούν. Για brands που δεν ψάχνουν
                  απλώς την παρουσία στο web, αλλά μία θέση στο μέλλον.
                </p>

                <Link
                  href="/contact"
                  className="
                    inline-flex items-center justify-center
                    px-8 py-3
                    rounded-full
                    bg-white
                    text-black text-sm md:text-base font-medium
                    backdrop-blur
                    transition
                    hover:-translate-y-0.5
                  "
                  style={{
                    boxShadow: "0 0 32px rgba(0,0,0,0.24)",
                  }}
                >
                  Ξεκλείδωσε το project σου
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
