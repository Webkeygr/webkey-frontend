// app/components/sections/ServicesIntro.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Progress για όλη την ενότητα
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const raw = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  /**
   * Χωρίζουμε σε φάσεις, πιο «αυστηρά» για να πετύχουμε 100% το εφέ:
   *  - REVEAL (0.06 → 0.55): γράφει λέξη–λέξη
   *  - HOLD   (0.55 → 0.78): πλήρως λευκός (full layer)
   *  - OUTRO  (0.78 → 1.00): fade–out + upward drift (full layer)
   */
  const reveal = useTransform(raw, [0.06, 0.55], [0, 1], { clamp: true });

  // Blur/Dim layers (σταδιακά, smooth)
  const blurOpacity = useTransform(raw, [0.02, 0.22], [0, 1], { clamp: true });
  const dimOpacity  = useTransform(raw, [0.10, 0.35], [0, 0.12], { clamp: true });

  // FULL LAYER visibility (κρατάει ολόλευκο κείμενο μετά το reveal)
  const fullOpacity = useTransform(raw, [0.50, 0.78, 0.95], [0, 1, 0], { clamp: true });
  const fullY       = useTransform(raw, [0.80, 1.00], [0, -80], { clamp: true });

  // Lottie (με fallback αν το όνομα έχει κενό)
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
    // Μεγάλο runway για να προλαβαίνουν όλες οι φάσεις
    <section ref={wrapRef} className="relative h-[360vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === Smooth BLUR πάνω από το fixed Hero === */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl" style={{ opacity: blurOpacity }} />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimOpacity }} />

        {/* === Περιεχόμενο === */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Layer A: SCRUB reveal (γράφει λέξη-λέξη) */}
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

          {/* Layer B: FULL λευκό, κάνει hold και μετά outro */}
          <motion.h1
            className="absolute left-1/2 -translate-x-1/2 select-none
                       font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            style={{ opacity: fullOpacity, y: fullY }}
            aria-hidden="true"
          >
            Οι υπηρεσίες μας
          </motion.h1>

          {/* Lottie (μεγαλωμένο ~60%) */}
          <motion.div
            className="mt-8 md:mt-10 w-[148px] md:w-[168px] opacity-80 relative z-20"
            style={{ opacity: fullOpacity }} // εμφανίζεται κυρίως στη φάση hold
          >
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
