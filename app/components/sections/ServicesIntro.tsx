'use client';

import { useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { TextScrub } from '@/components/ui/text-scrub';
import Lottie from 'lottie-react';

import scrollDown from '@/public/lottie/scroll-down.json'; // προσαρμόσ’ το στο path σου

/**
 * ΣΤΟΙΧΕΙΟ ΘΕΜΑΤΙΚΟ:
 * - Wrapper ύψους ~200vh για να έχουμε χώρο scroll
 * - Μέσα του ένα sticky 100vh “panel”
 * - Στο sticky panel: blurred φόντο (ίδιο με του hero) + τίτλος με scroll scrub + lottie κάτω από τον τίτλο
 *
 * Σημείωση για BLUR:
 * Αν ο hero είναι ακριβώς από πάνω στη στοίβα DOM, το backdrop-blur δουλεύει άψογα.
 * Αν όχι, μπορείς να περάσεις εδώ το ίδιο background του hero (π.χ. gradient/καμβά) και να βάλεις filter: blur().
 */

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // progress από 0..1 όσο κάνουμε scroll το wrapper
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'], // 0 όταν η ενότητα μπαίνει, 1 όταν “τελειώσει”
  });

  // λίγο spring για ομαλότητα
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  return (
    <section ref={wrapRef} className="relative h-[200vh]">
      {/* Sticky panel */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Φόντο: είτε backdrop-blur πάνω από τον hero, είτε ίδιο background με blur */}
        <div className="absolute inset-0">
          {/* Αν ο hero είναι ακριβώς από κάτω, αυτό αρκεί: */}
          <div className="absolute inset-0 backdrop-blur-2xl" />
          {/* Προαιρετικό dim ώστε να διαβάζεται καλά ο τίτλος */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Περιεχόμενο */}
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

          {/* Lottie κάτω από τον τίτλο */}
          <div className="mt-8 md:mt-10 w-[84px] md:w-[96px] opacity-80">
            <Lottie animationData={scrollDown} loop autoplay />
          </div>
        </div>
      </div>
    </section>
  );
}
