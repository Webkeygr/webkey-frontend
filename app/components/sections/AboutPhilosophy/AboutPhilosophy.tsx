"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutPhilosophy() {
  const ref = useRef<HTMLDivElement | null>(null);

  // sticky tracking
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // ◉ Circle animation
  const circleScale = useTransform(scrollYProgress, [0.15, 0.75], [0, 6]);
  const circleOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  // Title animation
  const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.20], [0, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.08], [40, 0]);

  return (
    <section ref={ref} className="aboutP-wrapper">

      {/* --- STICKY STAGE --- */}
      <div className="aboutP-sticky">

        {/* CIRCLE */}
        <motion.div
          className="aboutP-circle"
          style={{ scale: circleScale, opacity: circleOpacity }}
        />

        {/* TITLE */}
        <motion.h1
          className="aboutP-title"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          ΠΟΙΟΙ ΕΙΜΑΣΤΕ
        </motion.h1>

      </div>
    </section>
  );
}
