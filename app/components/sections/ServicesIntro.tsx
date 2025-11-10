"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;

const LOTTIE_OFFSET = 120; // μικρότερο, να μένει στο οπτικό πεδίο

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // scroll tracking
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ---------------- ΤΙΤΛΟΣ ---------------- */
  // αποκαλύπτεται νωρίς…
  const reveal = useTransform(scrollYProgress, [0.08, 0.5], [0, 1]);
  // …μένει “scrubbed” μέχρι να κάτσει full
  const scrubOpacity = useTransform(scrollYProgress, [0.48, 0.6], [1, 0]);
  // full opacity, κρατάει αρκετά πριν αρχίσουν οι κάρτες
  const fullOpacity = useTransform(
    scrollYProgress,
    [0.58, 0.68, 0.86, 0.96],
    [0, 1, 1, 0]
  );
  const fullY = useTransform(scrollYProgress, [0.86, 1.0], [0, -80]);

  /* ---------------- ΜΟΝΟ BLUR ---------------- */
  // ξεκινά σταδιακά με τον τίτλο και ΜΕΝΕΙ
  const blurOpacity = useTransform(scrollYProgress, [0.06, 0.18, 1], [0, 1, 1]);

  /* ---------------- LOTTIE ---------------- */
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        // δοκίμασε 2 ονόματα αρχείων (με και χωρίς κενό)
        let r = await fetch("/lottie/scroll-down.json");
        if (!r.ok) r = await fetch("/lottie/scroll%20down.json");
        if (r.ok) setLottieData(await r.json());
      } catch {
        setLottieData(null);
      }
    })();
  }, []);

  // πιο φαρδύ παράθυρο εμφάνισης ώστε να “προλάβει” να φανεί
  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.56, 0.72],
    [0, 1, 0]
  );

  return (
    <section ref={wrapRef} className="relative h-[900vh]">
      <div className="sticky top-0 h-screen overflow-hidden isolate">
        {/* === ΜΟΝΟ BLUR layer (ΚΑΘΟΛΟΥ σκοτείνιασμα) === */}
        <motion.div
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{ opacity: blurOpacity }}
        >
          <div
            className="absolute inset-0"
            style={{
              // ισχυρότερο blur ώστε να "γράφει"
              backdropFilter: "blur(50px)",
              WebkitBackdropFilter: "blur(50px)",
              // ελαφρύ ανοιχτό φιλτράρισμα για να ενεργοποιεί το backdrop
              background: "rgba(255,255,255,0.12)",
            }}
          />
          {/* ΔΕΝ βάζουμε πια dim/darken layer */}
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

      {/* === ΚΑΡΤΕΣ === */}
      {/* Δες στο ServicesCards: προσθέτουμε μεγάλο top offset ώστε να
          ολοκληρωθεί ο τίτλος ΠΡΙΝ ξεκινήσει το πρώτο segment καρτών */}
      <ServicesCards />
    </section>
  );
}
