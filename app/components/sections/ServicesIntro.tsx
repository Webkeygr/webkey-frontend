'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';
import ServicesCards from '@/app/components/sections/ServicesCards';

type LottieData = Record<string, any>;
const LOTTIE_OFFSET = 180;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const raw = useSpring(scrollYProgress, { stiffness: 200, damping: 16, mass: 0.12 });
  // ή ultra-snappy: const raw = scrollYProgress;

  // ΤΙΤΛΟΣ: fast windows με overlap για μηδενικό flicker
  const reveal       = useTransform(raw, [0.02, 0.24], [0, 1], { clamp: true });
  const scrubOpacity = useTransform(raw, [0.26, 0.38], [1, 0], { clamp: true });
  const fullOpacity  = useTransform(raw, [0.30, 0.42, 0.50, 0.58], [0, 1, 1, 0], { clamp: true });
  const fullY        = useTransform(raw, [0.50, 0.66], [0, -40], { clamp: true });

  // BLUR/DIM: κρατά 1 μέχρι το ΤΕΛΟΣ του section της εισαγωγής
  const blurOpacity = useTransform(raw, [0.00, 0.08, 1.00], [0, 1, 1], { clamp: true });
  const dimOpacity  = useTransform(raw, [0.04, 0.14, 1.00], [0, 0.12, 0.12], { clamp: true });

  // Lottie: ανεβαίνει σταδιακά πριν ολοκληρωθεί το scrub
  const lottieOpacity = useTransform(raw, [0.22, 0.30, 0.42, 0.58], [0, 0.6, 1, 1], { clamp: true });

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
    // ✳️ Μεγαλώνω το συνολικό ύψος ώστε να καλύψω το παλιό κενό (αντί για mt στις κάρτες)
    <section ref={wrapRef} className="relative h-[680vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === BLUR / DIM (hero) — μένει full μέχρι το τέλος του section === */}
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

          {/* Lottie */}
          <motion.div
            className="absolute w-[126px] md:w-[144px] pointer-events-none"
            style={{
              opacity: lottieOpacity,
              left: '50%',
              bottome: '14vh'
              transform: 'translateX(-50%)',
            }}
          >
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </motion.div>
        </div>
      </div>

      {/* Κάρτες */}
      <ServicesCards />
    </section>
  );
}
