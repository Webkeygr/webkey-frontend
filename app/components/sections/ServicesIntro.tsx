// app/components/sections/ServicesIntro.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { TextScrub } from '../ui/text-scrub';
import Lottie from 'lottie-react';

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
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
    <section ref={wrapRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Blurred background πάνω από το hero */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <TextScrub
            as="h1"
            per="word"
            progress={progress}
            window={0.1}
            className="font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(44px,8vw,140px)] md:text-[clamp(64px,10vw,180px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
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
