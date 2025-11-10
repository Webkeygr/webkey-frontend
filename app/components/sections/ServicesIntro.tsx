"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ====================== TITLE ====================== */
  const reveal = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const scrubOpacity = useTransform(scrollYProgress, [0.28, 0.35], [1, 0]);
  const fullOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.4, 0.45, 0.55],
    [0, 1, 1, 0]
  );
  const fullY = useTransform(scrollYProgress, [0.45, 0.6], [0, -40]);

  /* ====================== BLUR BACKGROUND ====================== */
  // Μπαίνει σταδιακά με τον τίτλο και μένει μέχρι το τέλος (χωρίς fade-out)
  const blurOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const dimOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 0.12]);

  /* ====================== LOTTIE ====================== */
  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.2, 0.35],
    [0, 1, 0]
  );

  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/lottie/scroll-down.json");
        if (r.ok) setLottieData(await r.json());
      } catch {}
    })();
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[680vh]">
      {/* === BACKDROP BLUR & DIM === */}
      {/* Σημαντικό: βρίσκεται ΠΙΣΩ από το περιεχόμενο, όχι fixed μπροστά */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ opacity: blurOpacity }}
      >
        {/* Blur layer */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />
        {/* Dim layer */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: dimOpacity }}
        />
      </motion.div>

      {/* === CONTENT === */}
      <div className="sticky top-0 h-screen overflow-hidden z-[5]">
        <div className="relative h-full">
          {/* Scrub (word by word) */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6"
            style={{ opacity: scrubOpacity }}
          >
            <TextScrub
              as="h1"
              per="word"
              progress={reveal}
              window={0.08}
              className="font-[900] leading-[0.95] tracking-[-0.02em]
                         text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                         text-white/90"
            >
              Οι υπηρεσίες μας
            </TextScrub>
          </motion.div>

          {/* Full title */}
          <motion.h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none
                       text-center px-6 font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            style={{ opacity: fullOpacity, y: fullY }}
          >
            Οι υπηρεσίες μας
          </motion.h1>

          {/* Lottie */}
          <motion.div
            className="absolute w-[126px] md:w-[144px] pointer-events-none z-[6]"
            style={{
              opacity: lottieOpacity,
              left: "50%",
              bottom: "14vh",
              transform: "translateX(-50%)",
            }}
          >
            {lottieData ? (
              <Lottie animationData={lottieData} loop autoplay />
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Gap ώστε ο τίτλος να μείνει λίγο παραπάνω πριν τις κάρτες */}
      <div style={{ height: `${90}vh` }} />
      <ServicesCards />
    </section>
  );
}
