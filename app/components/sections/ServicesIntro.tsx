"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import BackdropBlurOverlay from "../BackdropBlurOverlay"; // relative

type LottieData = Record<string, any>;
const LOTTIE_OFFSET = 110;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ---- ΤΙΤΛΟΣ: πολύ λιγότερα scrolls ---- */
  const reveal = useTransform(scrollYProgress, [0.06, 0.26], [0, 1]); // γρήγορο scrub
  const scrubOpacity = useTransform(scrollYProgress, [0.24, 0.3], [1, 0]); // σβήνει νωρίς
  const fullOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.36, 0.44, 0.46], // μικρό “hold”, αμέσως μετά θα μπει η 1η κάρτα
    [0, 1, 1, 0]
  );
  const fullY = useTransform(scrollYProgress, [0.44, 0.46], [0, -60]); // ελαφρύ lift out

  /* ---- BLUR (background overlay) ---- */
  const blurOpacity = useTransform(scrollYProgress, [0.04, 0.12, 1], [0, 1, 1]);

  /* ---- LOTTIE μαζί με τον τίτλο ---- */
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
    [0.06, 0.1, 0.34],
    [0, 1, 0]
  );

  return (
    <section ref={wrapRef} className="relative h-[360vh]">
      {/* Πίσω από το περιεχόμενο, μπροστά από το hero */}
      <BackdropBlurOverlay opacity={blurOpacity} zIndex={1} />

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
            className="absolute w-[120px] md:w-[140px] pointer-events-none z-[12] will-change-[opacity,transform]"
            style={{
              opacity: lottieOpacity,
              left: "50%",
              top: `calc(50% + ${LOTTIE_OFFSET}px)`,
              transform: "translateX(-50%)",
            }}
            aria-hidden="true"
          >
            {lottieData ? (
              <Lottie animationData={lottieData} loop autoplay />
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
