"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;
const LOTTIE_OFFSET = 180;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Πιο “snappy” αίσθηση αλλά όχι απότομα (fast)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Snappy spring (ή βάλε κατευθείαν scrollYProgress αν θες ultra-snappy)
  const raw = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 16,
    mass: 0.12,
  });
  // const raw = scrollYProgress; // εναλλακτικά ultra-snappy

  // Fast: ο τίτλος αποκαλύπτεται νωρίς, κρατάει λίγο “πλατό”, μετά φεύγει
  const reveal = useTransform(raw, [0.02, 0.28], [0, 1], { clamp: true });
  const scrubOpacity = useTransform(raw, [0.3, 0.38], [1, 0], { clamp: true });
  //        in     →   hold plateau  ←    → out
  const fullOpacity = useTransform(
    raw,
    [0.38, 0.48, 0.64, 0.72],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const fullY = useTransform(raw, [0.62, 0.78], [0, -50], { clamp: true });

  // Blur/Dim νωρίς και γρήγορα (για να “μπαίνει” η σκηνή)
  const blurOpacity = useTransform(raw, [0.0, 0.1], [0, 1], { clamp: true });
  const dimOpacity = useTransform(raw, [0.05, 0.16], [0, 0.12], {
    clamp: true,
  });

  // Lottie
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

  return (
    // Κόβουμε το συνολικό ύψος της εισαγωγής για λιγότερα scrolls (από 900 → 620vh)
    <section ref={wrapRef} className="relative h-[620vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === BLUR / DIM === */}
        <motion.div
          className="absolute inset-0 backdrop-blur-3xl z-[5]"
          style={{ opacity: blurOpacity }}
        />
        <motion.div
          className="absolute inset-0 bg-black z-[4]"
          style={{ opacity: dimOpacity }}
        />

        {/* === CONTENT === */}
        <div className="relative z-10 h-full">
          {/* Scrub layer */}
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

          {/* Full layer (hold + outro) */}
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

          {/* Lottie κάτω από το κέντρο */}
          <motion.div
            className="absolute w-[148px] md:w-[168px] opacity-80 pointer-events-none"
            style={{
              opacity: fullOpacity,
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

      {/* Οι κάρτες ακολουθούν */}
      <ServicesCards />
    </section>
  );
}
