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
      {/* ΝΕΟ BACKGROUND */}
      <Iridescence
        className="hero-iridescence"
        color={[1, 1, 1]}
        mouseReact={true}
        amplitude={0.2}
        speed={1.0}
      />

      <div className="hero-inner">
        <div ref={subtitleRef} className="hero-pill">
          Creative Digital Studio
        </div>
        <h1 ref={titleRef} className="hero-title">
          Dare Against Normal
        </h1>
        <p className="hero-text">
          Websites, experiences and brands that refuse to blend in.
        </p>
      </div>
    </section>
  );
}
