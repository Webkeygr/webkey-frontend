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

  // Ελαφρύ spring για ομαλότητα
  const raw = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  // 1) REVEAL progress του τίτλου (0→1) με "ανάσα" για να προλάβει να ολοκληρωθεί
  const reveal = useTransform(raw, [0.05, 0.80], [0, 1], { clamp: true });

  // 2) BLUR layers (σταδιακό εμφανισμα)
  const blurOpacity = useTransform(raw, [0.05, 0.25], [0, 1], { clamp: true });
  const dimOpacity  = useTransform(raw, [0.12, 0.40], [0, 0.12], { clamp: true });

  // 3) OUTRO του τίτλου (fade + ελαφρύ up) προς το τέλος της ενότητας
  const titleContainerOpacity = useTransform(raw, [0, 0.82, 0.96, 1], [1, 1, 0, 0], { clamp: true });
  const titleContainerY       = useTransform(raw, [0.84, 0.98], [0, -60], { clamp: true });

  // Lottie load (με fallback για πιθανό κενό στο όνομα)
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
    // Μεγαλύτερο "runway" για να ολοκληρώνεται το reveal + outro
    <section ref={wrapRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === BLUR πάνω από το fixed Hero === */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl" style={{ opacity: blurOpacity }} />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimOpacity }} />

        {/* === Τίτλος + Lottie (με outro στο τέλος) === */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: titleContainerOpacity, y: titleContainerY }}
        >
          <TextScrub
            as="h1"
            per="word"
            progress={reveal}
            window={0.085}
            // ⬇️ Μείωση ~50% στη γραμματοσειρά (από τα προηγούμενα clamp)
            className="font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          >
            Οι υπηρεσίες μας
          </TextScrub>

          {/* Lottie: +60% περίπου */}
          <div className="mt-8 md:mt-10 w-[148px] md:w-[168px] opacity-80 relative z-20">
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
