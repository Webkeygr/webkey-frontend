// app/components/ui/title-reveal.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type TitleRevealProps = {
  lines: string[];
  delay?: number;
  lineStagger?: number;
  className?: string;
};

export default function TitleReveal({
  lines,
  delay = 0,
  lineStagger = 0.1,
  className = "",
}: TitleRevealProps) {
  const lineRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({ delay });

    tl.from(lineRefs.current, {
      yPercent: 110,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: lineStagger,
    });

    return () => {
      tl.kill();
    };
  }, [delay, lineStagger]);

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <div key={index}>
          {/* ΔΕΝ έχουμε πια overflow-hidden εδώ,
              για να μην κόβεται η λέξη στα πλάγια */}
          <div
            ref={(el) => {
              if (el) lineRefs.current[index] = el;
            }}
            className="block whitespace-nowrap"
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
}
