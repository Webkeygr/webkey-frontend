"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import BackdropBlurOverlay from "@/app/components/BackdropBlurOverlay";

type LottieData = Record<string, any>;
const LOTTIE_OFFSET = 120;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ---------------- ΤΙΤΛΟΣ ---------------- */
  const reveal = useTransform(scrollYProgress, [0.08, 0.48], [0, 1]);
  const scrubOpacity = useTransform(scrollYProgress, [0.46, 0.6], [1, 0]);
  // full τίτλος: “κάθεται” και ΜΕΝΕΙ ως το ΤΕΛΟΣ του intro
  const fullOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.66, 0.998, 0.999], // κρατάει γεμάτος μέχρι να φύγουμε από το section
    [0, 1, 1, 0]
  );
  const fullY = useTransform(scrollYProgress, [0.998, 1.0], [0, -80]);

  /* ---------------- BLUR (PORTAL στο <body>) ---------------- */
  const blurOpacity = useTransform(scrollYProgress, [0.06, 0.18, 1], [0, 1, 1]);

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
  // ξεκινά ΜΑΖΙ με τον τίτλο, σβήνει λίγο πριν τελειώσει το intro
  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.12, 0.95],
    [0, 1, 0]
  );

  return (
    <section ref={wrapRef} className="relative h-[1200vh]">
      {/* ΠΡΑΓΜΑΤΙΚΟ background blur σαν overlay, με portal */}
      <BackdropBlurOverlay opacity={blurOpacity} zIndex={50} />

      <div className="sticky top-0 h-screen overflow-hidden">
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
            className="absolute w-[126px] md:w-[144px] pointer-events-none z-[12] will-change-[opacity,transform]"
            style={{
              opacity: lottieOpacity,
              left: "50%",
              top: `calc(50% + ${LOTTIE_OFFSET}px)`,
              transform: "translateX(-50%)",
            }}
            aria-hidden="true"
          >
            {lottieData ? (
              <Lottie
                animationData={lottieData}
                loop
                autoplay
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
