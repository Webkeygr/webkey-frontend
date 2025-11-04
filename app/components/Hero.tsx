"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Iridescence from "./Iridescence";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);

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
    <section ref={heroRef} className="hero">
      {/* Minimal, low-lag wallpaper */}
      <Iridescence
        className="hero-iridescence"
  mouseReact={true}       // on/off το "cut"
  speed={0.6}
  amplitude={0.08}
  opacity={0.9}           // 0..1 πόσο έντονο πάνω από λευκό
  scale={1.1}             // 0.9 πιο "γεμάτο", 1.2 πιο αραιό
  cutRadius={130}         // μεγαλύτερο κενό γύρω από mouse
  cutFeather={90}         // πιο "σκληρό" κόψιμο => μικρότερο feather
  cutStrength={0.012}     // 0..0.02 πόσο σπρώχνει το flow γύρω από mouse
  colorA="#FF00F2"
  colorB="#0090FF"
      />

      <div className="hero-inner">
        <h1 ref={titleRef} className="hero-title">
          Dare to
          <br />
          Differ
        </h1>
        <p ref={subtitleRef} className="hero-text">
          Websites, experiences and brands that refuse to blend in.
        </p>
      </div>
    </section>
  );
}
