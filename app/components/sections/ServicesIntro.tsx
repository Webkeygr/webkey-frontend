"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;

const LOTTIE_OFFSET = 180;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // scroll tracking
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ---------------- ΤΙΤΛΟΣ ---------------- */
  const reveal = useTransform(scrollYProgress, [0.08, 0.55], [0, 1]);
  const scrubOpacity = useTransform(scrollYProgress, [0.52, 0.62], [1, 0]);
  const fullOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.62, 0.8, 0.95],
    [0, 1, 1, 0]
  );
  const fullY = useTransform(scrollYProgress, [0.82, 1.0], [0, -80]);

  /* ---------------- BLUR & DIM ---------------- */
  // ξεκινά σταδιακά με τον τίτλο και ΜΕΝΕΙ μέχρι το τέλος των καρτών
  const blurOpacity = useTransform(scrollYProgress, [0.06, 0.18, 1], [0, 1, 1]);
  const dimOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 1],
    [0, 0.12, 0.12]
  );

  /* ---------------- LOTTIE ---------------- */
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        let r = await fetch("/lottie/scroll-down.json");
        if (!r.ok) r = await fetch("/lottie/scroll%20down.json");
        if (r.ok) setLottieData(await r.json());
      } catch {
        setLottieData(null);
      }
    })();
  }, []);

  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.58, 0.65],
    [0, 1, 0]
  );

  return (
    <section ref={wrapRef} className="relative h-[900vh]">
      <div className="sticky top-0 h-screen overflow-hidden isolate">
        {/* === BLUR πάνω από το hero και ΟΛΗ ΤΗΝ ΕΝΟΤΗΤΑ === */}
        <motion.div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ opacity: blurOpacity }}
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              background: "rgba(255,255,255,0.18)",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ opacity: dimOpacity }}
          />
        </motion.div>

        {/* === CONTENT === */}
        <div className="relative z-10 h-full">
          {/* Scrub title */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6"
            style={{ opacity: scrubOpacity }}
            aria-hidden="true"
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
                       text-center px-6
                       font-[900] leading-[0.95] tracking-[-0.02em]
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
              top: `calc(50% + ${LOTTIE_OFFSET}px)`,
              transform: "translateX(-50%)",
            }}
          >
            {lottieData ? (
              <Lottie animationData={lottieData} loop autoplay />
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* === ΚΑΡΤΕΣ === */}
      <ServicesCards />
    </section>
  );
}
