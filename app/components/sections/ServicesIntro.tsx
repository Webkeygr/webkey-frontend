"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;

/* ---- Tunables ---- */
const GAP_AFTER_TITLE_VH = 90; // ~1–2 scrolls πριν ξεκινήσουν οι κάρτες
const TITLE_REVEAL_START = 0.02; // πότε ξεκινά το λέξη-λέξη
const BLUR_FADEIN_LEN = 0.1; // πόσο “απαλά” μπαίνει το blur από τον τίτλο
const END_FADE_LEN = 0.08; // πόσο “απαλά” θα σβήσει στο τέλος των καρτών

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Sentinel για ΤΕΛΟΣ καρτών (θα το βάλουμε μετά το <ServicesCards/>)
  const cardsEndRef = useRef<HTMLDivElement | null>(null);

  /* Progress του intro section (για τίτλο & αρχικό fade-in) */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const raw = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 16,
    mass: 0.12,
  });

  /* Progress του τέλους καρτών — 0: μακριά, 1: έφτασε near-top (ήμαστε στο τέλος) */
  const { scrollYProgress: cardsEnd } = useScroll({
    target: cardsEndRef,
    offset: ["start 100%", "start 55%"], // fine-tune: το δεύτερο ρυθμίζει το “πότε” θα αρχίσει να σβήνει
  });

  /* ------------------ ΤΙΤΛΟΣ ------------------ */
  const reveal = useTransform(
    raw,
    [TITLE_REVEAL_START, TITLE_REVEAL_START + 0.22],
    [0, 1],
    { clamp: true }
  );
  const scrubOpacity = useTransform(
    raw,
    [TITLE_REVEAL_START + 0.24, TITLE_REVEAL_START + 0.36],
    [1, 0],
    { clamp: true }
  );
  const fullOpacity = useTransform(
    raw,
    [
      TITLE_REVEAL_START + 0.28,
      TITLE_REVEAL_START + 0.4,
      TITLE_REVEAL_START + 0.48,
      TITLE_REVEAL_START + 0.56,
    ],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const fullY = useTransform(
    raw,
    [TITLE_REVEAL_START + 0.48, TITLE_REVEAL_START + 0.64],
    [0, -40],
    { clamp: true }
  );

  /* ------------------ BLUR / DIM ------------------
     ✳️ Ένα ΚΑΙ ΜΟΝΟ fixed overlay:
     - fade-in με τον τίτλο
     - μένει 1 σε όλη τη διάρκεια των καρτών
     - fade-out μόνο όταν φτάσουμε στο cardsEnd
  -------------------------------------------------- */
  const startFade = useTransform(
    raw,
    [TITLE_REVEAL_START, TITLE_REVEAL_START + BLUR_FADEIN_LEN],
    [0, 1],
    { clamp: true }
  );

  // κάνουμε ήπιο fade-out κοντά στο τέλος των καρτών
  const endFade = useTransform(cardsEnd, [0, 1 - END_FADE_LEN, 1], [1, 1, 0], {
    clamp: true,
  });

  // τελικό opacity = startFade * endFade
  const blurOpacity = useTransform(() => startFade.get() * endFade.get());
  const dimOpacity = useTransform(() => startFade.get() * endFade.get() * 0.12);

  /* ------------------ LOTTIE ------------------
     Ορατό με τον τίτλο, fade-out πριν τις κάρτες (μέσα στο timing του intro).
  -------------------------------------------------- */
  const lottieOpacity = useTransform(
    raw,
    // in           hold         out (λίγο πριν αρχίσουν οι κάρτες)
    [
      TITLE_REVEAL_START + 0.02,
      TITLE_REVEAL_START + 0.2,
      TITLE_REVEAL_START + 0.36,
      TITLE_REVEAL_START + 0.46,
    ],
    [0, 1, 1, 0],
    { clamp: true }
  );

  /* Lottie data */
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
    <section ref={wrapRef} className="relative h-[680vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === FIXED BLUR/DIM overlay — ενιαίο για intro+cards === */}
        <motion.div
          className="fixed inset-0 z-[5] pointer-events-none"
          style={{ opacity: blurOpacity }}
        >
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.12 }}
          />
        </motion.div>

        {/* === CONTENT === */}
        <div className="relative z-10 h-full">
          {/* Scrub layer (λέξη-λέξη) */}
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

          {/* Full layer */}
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

          {/* Lottie: χαμηλά στο κέντρο, 15% μικρότερο */}
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

      {/* +1–2 scrolls κενό ώστε ο τίτλος να φαίνεται πλήρως πριν τις κάρτες */}
      <div style={{ height: `${GAP_AFTER_TITLE_VH}vh` }} />

      {/* Κάρτες */}
      <ServicesCards />

      {/* Sentinel: ΤΕΛΟΣ καρτών — για fade-out του global overlay */}
      <div ref={cardsEndRef} className="h-px" />
    </section>
  );
}
