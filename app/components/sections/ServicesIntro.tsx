'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';
import ServicesCards from '@/app/components/sections/ServicesCards';

type LottieData = Record<string, any>;

/* ---- Tunables ---- */
const GAP_AFTER_TITLE_VH = 90;      // ~1–2 scrolls πριν ξεκινήσουν οι κάρτες
const TITLE_REVEAL_START = 0.02;    // πότε ξεκινά το λέξη-λέξη
const BLUR_FADEIN_LEN   = 0.10;     // πόσο “απαλά” μπαίνει το blur από τον τίτλο

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardsStartRef = useRef<HTMLDivElement | null>(null); // sentinel: ακριβώς πριν τις κάρτες

  /* Progress του intro section */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const raw = useSpring(scrollYProgress, { stiffness: 200, damping: 16, mass: 0.12 });

  /* Progress του σημείου έναρξης καρτών (sentinel) */
  const { scrollYProgress: cardsStart } = useScroll({
    target: cardsStartRef,
    offset: ['start 90%', 'start 50%'], // 0 -> μακριά από top, 1 -> έφτασε ψηλά (ξεκινούν κάρτες)
  });

  /* ------------------ ΤΙΤΛΟΣ ------------------ */
  const reveal       = useTransform(raw, [TITLE_REVEAL_START, TITLE_REVEAL_START + 0.22], [0, 1], { clamp: true });
  const scrubOpacity = useTransform(raw, [TITLE_REVEAL_START + 0.24, TITLE_REVEAL_START + 0.36], [1, 0], { clamp: true });
  const fullOpacity  = useTransform(raw, [TITLE_REVEAL_START + 0.28, TITLE_REVEAL_START + 0.40, TITLE_REVEAL_START + 0.48, TITLE_REVEAL_START + 0.56], [0, 1, 1, 0], { clamp: true });
  const fullY        = useTransform(raw, [TITLE_REVEAL_START + 0.48, TITLE_REVEAL_START + 0.64], [0, -40], { clamp: true });

  /* ------------------ BLUR / DIM ------------------
     Μπαίνει μόνο όταν ξεκινά ο τίτλος και, μέσω cross-fade με cardsStart,
     παραμένει ορατό μέχρι να ξεκινήσουν οι κάρτες.
  -------------------------------------------------- */
  const introBlurBase = useTransform(
    raw,
    [TITLE_REVEAL_START, TITLE_REVEAL_START + BLUR_FADEIN_LEN],
    [0, 1],
    { clamp: true }
  );
  const introDimBase = useTransform(
    raw,
    [TITLE_REVEAL_START + 0.02, TITLE_REVEAL_START + BLUR_FADEIN_LEN + 0.02],
    [0, 0.12],
    { clamp: true }
  );

  // Cross-fade: όσο πλησιάζουν οι κάρτες (cardsStart→1), το intro overlay σβήνει.
  const blurOpacity = useTransform(
    [introBlurBase, cardsStart],
    ([b, cs]: [number, number]) => b * (1 - cs)
  );
  const dimOpacity = useTransform(
    [introDimBase, cardsStart],
    ([d, cs]: [number, number]) => d * (1 - cs)
  );

  /* ------------------ LOTTIE ------------------
     Δεν φαίνεται πριν τον τίτλο. Κάνει fade-in καθώς αποκαλύπτεται ο τίτλος,
     και fade-out όσο πλησιάζουν οι κάρτες.
  -------------------------------------------------- */
  const lottieIn = useTransform(
    raw,
    [TITLE_REVEAL_START + 0.02, TITLE_REVEAL_START + 0.20],
    [0, 1],
    { clamp: true }
  );
  const lottieOpacity = useTransform(
    [lottieIn, cardsStart],
    ([lin, cs]: [number, number]) => lin * (1 - cs)
  );

  /* Lottie data */
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        let r = await fetch('/lottie/scroll-down.json');
        if (!r.ok) r = await fetch('/lottie/scroll%20down.json');
        if (r.ok) setLottieData(await r.json());
      } catch {
        setLottieData(null);
      }
    })();
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[680vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === BLUR / DIM (intro) — ξεκινά με τον τίτλο και σβήνει όταν ξεκινούν οι κάρτες === */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl z-[5]" style={{ opacity: blurOpacity }} />
        <motion.div className="absolute inset-0 bg-black z-[4]" style={{ opacity: dimOpacity }} />

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

          {/* Lottie: χαμηλά στο κέντρο, 15% μικρότερο, fade-in/out όπως ορίστηκε */}
          <motion.div
            className="absolute w-[126px] md:w-[144px] pointer-events-none z-[3]"
            style={{
              opacity: lottieOpacity,
              left: '50%',
              bottom: '14vh',
              transform: 'translateX(-50%)',
            }}
          >
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </motion.div>
        </div>
      </div>

      {/* +1–2 scrolls κενό ώστε ο τίτλος να φαίνεται πλήρως πριν τις κάρτες */}
      <div style={{ height: `${GAP_AFTER_TITLE_VH}vh` }} />

      {/* Sentinel: το βλέπει το cardsStart για το cross-fade & lottie fade-out */}
      <div ref={cardsStartRef} className="h-px" />

      {/* Κάρτες */}
      <ServicesCards />
    </section>
  );
}
