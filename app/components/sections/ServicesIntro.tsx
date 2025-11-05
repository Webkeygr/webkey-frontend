// app/components/sections/ServicesIntro.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Προοδευτικό scroll για ΟΛΗ την ενότητα
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const raw = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  /**
   * ΤΡΕΙΣ ΦΑΣΕΙΣ:
   * 1) REVEAL (0.06 → 0.60): γράφει ο τίτλος με scrub
   * 2) HOLD   (0.60 → 0.78): μένει πλήρως λευκός/καθαρός
   * 3) OUTRO  (0.78 → 1.00): fade-out + μικρό drift προς τα πάνω
   */
  const reveal = useTransform(raw, [0.06, 0.60], [0, 1], { clamp: true });
  const titleOpacity = useTransform(raw, [0.60, 0.78, 0.95], [1, 1, 0], { clamp: true });
  const titleY = useTransform(raw, [0.80, 1.00], [0, -80], { clamp: true });
  const titleScale = useTransform(raw, [0.06, 0.60], [0.98, 1.0], { clamp: true }); // ελαφρύ “κάθισμα” στο reveal

  // Blur/Dim layers να έρχονται σταδιακά (smooth)
  const blurOpacity = useTransform(raw, [0.02, 0.22], [0, 1], { clamp: true });
  const dimOpacity  = useTransform(raw, [0.10, 0.35], [0, 0.12], { clamp: true });

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
    // Μεγαλύτερο runway ώστε να προλαβαίνουν όλες οι φάσεις
    <section ref={wrapRef} className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ΣΤΑΔΙΑΚΟ BLUR πάνω από το fixed Hero */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl" style={{ opacity: blurOpacity }} />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimOpacity }} />

        {/* Τίτλος + Lottie (reveal → hold → outro) */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
        >
          <TextScrub
            as="h1"
            per="word"          // αν θες ακόμη πιο “λεπτό”, άλλαξέ το σε 'char'
            progress={reveal}   // μόνο στη φάση 1
            window={0.08}       // πόσο “πλατύ” το reveal ανά λέξη
            // ↓ Τίτλος ~50% μικρότερος όπως ζήτησες
            className="font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          >
            Οι υπηρεσίες μας
          </TextScrub>

          {/* Lottie ~+60% μεγαλύτερο */}
          <div className="mt-8 md:mt-10 w-[148px] md:w-[168px] opacity-80 relative z-20">
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
