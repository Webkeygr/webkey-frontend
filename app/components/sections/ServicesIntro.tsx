'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';
import ServicesCards from '@/app/components/sections/ServicesCards';

type LottieData = Record<string, any>;
const GAP_AFTER_TITLE_VH = 90; // ~1–2 scrolls πριν ξεκινήσουν οι κάρτες

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardsStartRef = useRef<HTMLDivElement | null>(null); // sentinel: ακριβώς πριν τις κάρτες

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const raw = useSpring(scrollYProgress, { stiffness: 200, damping: 16, mass: 0.12 });

  // progress του "σημείου έναρξης καρτών": όταν το sentinel πλησιάζει το επάνω μέρος
  const { scrollYProgress: cardsStart } = useScroll({
    target: cardsStartRef,
    // 0 => sentinel ακόμα χαμηλά, 1 => sentinel έφτασε ψηλά (ξεκινούν οι κάρτες)
    offset: ['start 90%', 'start 50%'],
  });

  /* ------------------ ΤΙΤΛΟΣ ------------------ */
  const reveal       = useTransform(raw, [0.02, 0.24], [0, 1], { clamp: true });
  const scrubOpacity = useTransform(raw, [0.26, 0.38], [1, 0], { clamp: true });
  const fullOpacity  = useTransform(raw, [0.30, 0.42, 0.50, 0.58], [0, 1, 1, 0], { clamp: true });
  const fullY        = useTransform(raw, [0.50, 0.66], [0, -40], { clamp: true });

  /* ------------------ BLUR / DIM ------------------
     1) introBlurBase: μπαίνει σταδιακά όταν μπαίνει ο τίτλος
     2) cross-fade με τις κάρτες: όσο cardsStart → 1, το intro blur σβήνει
  -------------------------------------------------- */
  const introBlurBase = useTransform(raw, [0.00, 0.08], [0, 1], { clamp: true });
  const introDimBase  = useTransform(raw, [0.04, 0.14], [0, 0.12], { clamp: true });
  const blurOpacity   = useTransform([introBlurBase, cardsStart], ([b, cs]) => b * (1 - cs));
  const dimOpacity    = useTransform([introDimBase,  cardsStart], ([d, cs]) => d * (1 - cs));

  /* ------------------ LOTTIE ------------------
     Fade-in νωρίς, και fade-out καθώς πλησιάζουν οι κάρτες (με cardsStart)
  -------------------------------------------------- */
  const lottieOpacity = useTransform(cardsStart, [0, 0.3, 0.6, 1], [1, 0.6, 0.2, 0], { clamp: true });

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
        {/* === BLUR / DIM (intro) — ξεκινά με τίτλο και σβήνει καθώς ξεκινούν οι κάρτες === */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl z-[5]" style={{ opacity: blurOpacity }} />
        <motion.div className="absolute inset-0 bg-black z-[4]" style={{ opacity: dimOpacity }} />

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

          {/* Lottie: χαμηλά στο κέντρο, fade-out πριν τις κάρτες */}
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

      {/* Spacer: 1–2 scrolls για να φαίνεται ο τίτλος πλήρως */}
      <div style={{ height: `${GAP_AFTER_TITLE_VH}vh` }} />

      {/* Sentinel: ακριβώς πριν ξεκινήσουν οι κάρτες (το βλέπει το cardsStart) */}
      <div ref={cardsStartRef} className="h-px" />

      {/* Κάρτες */}
      <ServicesCards />
    </section>
  );
}
