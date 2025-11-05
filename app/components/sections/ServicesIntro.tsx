// app/components/sections/ServicesIntro.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';

type LottieData = Record<string, any>;

// πόσο κάτω από το κέντρο να κάτσει το Lottie (px)
const LOTTIE_OFFSET = 180; // ↑ άλλαξέ το αν θες πιο πάνω/κάτω

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress για όλη την ενότητα
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const raw = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  /**
   * Φάσεις:
   * REVEAL (scrub): 0.08 → 0.55
   * CROSS-FADE:      0.52 → 0.62  (scrub σβήνει, full ανάβει)
   * HOLD (full):     0.62 → 0.80
   * OUTRO (full):    0.80 → 1.00  (fade-out + up)
   */
  const reveal = useTransform(raw, [0.08, 0.55], [0, 1], { clamp: true });
  const scrubOpacity = useTransform(raw, [0.52, 0.62], [1, 0], { clamp: true });
  const fullOpacity  = useTransform(raw, [0.52, 0.62, 0.80, 0.95], [0, 1, 1, 0], { clamp: true });
  const fullY        = useTransform(raw, [0.82, 1.00], [0, -80], { clamp: true });

  // smooth blur/dim
  const blurOpacity = useTransform(raw, [0.02, 0.22], [0, 1], { clamp: true });
  const dimOpacity  = useTransform(raw, [0.10, 0.35], [0, 0.12], { clamp: true });

  // Lottie load (με fallback αν το όνομα έχει κενό)
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
    <section ref={wrapRef} className="relative h-[360vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === Smooth BLUR πάνω από το fixed Hero === */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl" style={{ opacity: blurOpacity }} />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimOpacity }} />

        {/* === CONTENT (όλα στοιχισμένα στο κέντρο) === */}
        <div className="relative z-10 h-full">
          {/* Scrub layer — absolute CENTER */}
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

          {/* Full layer — absolute CENTER, κάνει hold + outro */}
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

          {/* Lottie — στο σημείο του κόκκινου τετραγώνου (κάτω από το κέντρο) */}
          <motion.div
            className="absolute w-[148px] md:w-[168px] opacity-80 pointer-events-none"
            style={{
              opacity: fullOpacity,
              left: '50%',
              top: `calc(50% + ${LOTTIE_OFFSET}px)`,
              transform: 'translateX(-50%)',
            }}
          >
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
