// app/components/sections/ServicesIntro.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress για ΟΛΗ την ενότητα
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // Λίγο spring για ομαλότητα
  const raw = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  // Δίνουμε “ανάσα” ώστε να ξεκινά/τελειώνει λίγο αργότερα -> προλαβαίνει να ολοκληρωθεί ο τίτλος
  const progress = useTransform(raw, [0.05, 0.95], [0, 1], { clamp: true });

  // Smooth blur: από 0 → 1 στην αρχή του scroll
  const blurOpacity = useTransform(progress, [0, 0.2], [0, 1], { clamp: true });
  // Προαιρετικό ελαφρύ dim για ανάγνωση τίτλου
  const dimOpacity = useTransform(progress, [0.1, 0.4], [0, 0.12], { clamp: true });

  // Lottie: δοκίμασε δύο πιθανά paths (με/χωρίς κενό στο filename)
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        let r = await fetch('/lottie/scroll-down.json');
        if (!r.ok) r = await fetch('/lottie/scroll%20down.json');
        if (r.ok) {
          const json = await r.json();
          setLottieData(json);
        }
      } catch {
        setLottieData(null);
      }
    })();
  }, []);

  return (
    // Μεγαλύτερο runway για πλήρες scrub
    <section ref={wrapRef} className="relative h-[300vh]">
      {/* Sticky viewport panel */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* === BLUR LAYERS που “κάθονται” πάνω από το fixed Hero === */}
        <motion.div
          className="absolute inset-0 backdrop-blur-3xl"
          style={{ opacity: blurOpacity }}
        />
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: dimOpacity }}
        />

        {/* === Περιεχόμενο === */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <TextScrub
            as="h1"
            per="word"
            progress={progress}
            window={0.085} // πιο “σφιχτό” – βοηθά να ολοκληρώνει το τελευταίο word
            className="font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(44px,8vw,140px)] md:text-[clamp(64px,10vw,180px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          >
            Οι υπηρεσίες μας
          </TextScrub>

          {/* Lottie κάτω από τον τίτλο */}
          <div className="mt-8 md:mt-10 w-[92px] md:w-[104px] opacity-80 relative z-20">
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
