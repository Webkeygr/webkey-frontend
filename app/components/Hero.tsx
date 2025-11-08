// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Iridescence from "./Iridescence";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          delay: 0.1,
        });
      }
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
    <section ref={heroRef} className="hero relative min-h-screen">
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
          hero-inner relative z-10 flex min-h-screen flex-col
          items-start justify-center text-left
          pl-6 md:pl-16 pr-6
        "
      >
        <h1 ref={titleRef} className="hero-title">
          The Key
          <br />
          to the Future
        </h1>

        {/* Κάτω-αριστερά, μαύρο */}
        <p
          ref={subtitleRef}
          className="
            hero-text text-black
            absolute left-6 md:left-16 bottom-8
          "
        >
          Websites, experiences and brands that refuse to blend in.
        </p>
      </div>
    </section>
  );
}
