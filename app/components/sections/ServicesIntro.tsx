// app/components/sections/ServicesIntro.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // 0 → 1 σε μεγαλύτερο "runway" ώστε να ολοκληρώνεται το animation
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    // start όταν η ενότητα μπει, end όταν όλο το wrapper έχει διαβαστεί
    offset: ['start start', 'end end'],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    fetch('/lottie/scroll-down.json')
      .then((r) => r.json())
      .then(setLottieData)
      .catch(() => setLottieData(null));
  }, []);

  return (
    // Μεγαλύτερο ύψος για πλήρες scrub (αν θες πιο αργό, πήγαινέ το 280vh)
    <section ref={wrapRef} className="relative h-[260vh]">
      {/* Sticky panel που κάθεται πάνω από το HERO */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* BACKDROP BLUR ΠΑΝΩ ΑΠΟ ΤΟ HERO (που είναι sticky πιο κάτω) */}
        <div className="absolute inset-0">
          {/* Το backdrop-blur θολώνει Ο,ΤΙ ΥΠΑΡΧΕΙ ΠΙΣΩ (δηλ. το Hero) */}
          <div className="absolute inset-0 backdrop-blur-3xl" />
          {/* Ήπιο dim για αντίθεση κειμένου */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Περιεχόμενο */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <TextScrub
            as="h1"
            per="word"
            progress={progress}
            window={0.09} // λίγο πιο "σφιχτό" για να προλαβαίνει το τελευταίο word
            className="font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(44px,8vw,140px)] md:text-[clamp(64px,10vw,180px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          >
            Οι υπηρεσίες μας
          </TextScrub>

          <div className="mt-8 md:mt-10 w-[84px] md:w-[96px] opacity-80">
            {lottieData ? <Lottie animationData={lottieData} loop autoplay /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
