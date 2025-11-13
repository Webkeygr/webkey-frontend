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
    <section
      ref={heroRef}
      className="
        relative
        h-[100vh]
        overflow-hidden
      "
    >
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

      {/* === CANVAS === */}
      <div className="relative z-10 h-full w-full">
        {/* ΤΙΤΛΟΣ – πολύ μεγάλος, poster-style, scale με το πλάτος */}
        <h1
          className="hero-title font-normal leading-[0.8]"
          style={{
            fontSize: "min(11vw, 9.5rem)", // ΠΟΛΥ μεγάλο αλλά πάντα να χωράει
          }}
        >
          <div
            className="
              absolute
              left-[6vw]
              top-[12vh]
              space-y-[0.12em]
            "
          >
            <TitleReveal
              // 3 ξεκάθαρες γραμμές, χωρίς περίεργο break
              lines={["Το κλειδί", "για το Ψηφιακό", "Μέλλον"]}
              delay={0.1}
              lineStagger={0.12}
            />
          </div>
        </h1>

        {/* Κείμενο + CTA κάτω δεξιά, δίπλα στο "Μέλλον" */}
        <div
          ref={blockRef}
          className="
            absolute
            right-[8vw]
            bottom-[12vh]
            max-w-[32vw]
            text-black
            space-y-[2vh]
          "
          style={{
            fontSize: "min(1.1vw, 1rem)", // scale με το πλάτος
          }}
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
              rounded-full
              bg-white
              text-black font-medium
              shadow-lg shadow-black/25
              backdrop-blur
              transition
              hover:shadow-xl
              hover:-translate-y-0.5
            "
            style={{
              padding: "0.9rem 2.8rem",
              fontSize: "min(1.05vw, 0.95rem)",
            }}
          >
            Ξεκλείδωσε το project σου
          </Link>
        </div>
      </div>
    </section>
  );
}
