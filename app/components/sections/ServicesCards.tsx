// app/components/sections/ServicesCards.tsx
'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

export default function ServicesCards({
  parentProgress,
}: {
  parentProgress: MotionValue<number>;
}) {
  // Τοπικό progress της ενότητας για όσα μικρο-animations θες (δεν επηρεάζει το gate)
  const secRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ['start end', 'end start'],
  });
  const local = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // ✅ Gate: άναψε/σβήσε την κάρτα με καθαρό κατώφλι, για να φαίνεται πάντα 100% όταν πρέπει
  const gateOpacity = useTransform(parentProgress, (v) => (v >= 0.82 ? 1 : 0));

  return (
    <section ref={secRef} className="relative w-full min-h-[200vh]">
      {/* Sticky wrapper της κάρτας — περνάει από πάνω όταν έρθει η ώρα της */}
      <motion.div
        className="sticky top-0 z-[40] pointer-events-auto h-screen overflow-hidden flex items-center justify-center"
        style={{ opacity: gateOpacity }}
      >
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <Card progress={local} />
        </div>
      </motion.div>
    </section>
  );
}

function Card({ progress }: { progress: MotionValue<number> }) {
  // ήπια κίνηση όσο είναι sticky
  const y = useTransform(
    progress,
    [0.0, 0.25, 0.85, 1.0],
    [160, 0, 0, -120],
    { clamp: true }
  );
  const bodyOpacity = useTransform(
    progress,
    [0.0, 0.07, 0.9, 1.0],
    [0, 1, 1, 0],
    { clamp: true }
  );

  return (
    <motion.article
      className="relative h-[78vh] sm:h-[76vh] lg:h-[74vh]"
      style={{ y, opacity: bodyOpacity }}
    >
      <div className="absolute inset-0 rounded-[28px] bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white/60" />

      <div className="relative z-[1] h-full grid grid-cols-12 gap-6 p-6 sm:p-8 lg:p-12">
        {/* Left meta / tags */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-black/90 text-white text-xs tracking-wide">
              Core Service
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-900/80 text-white text-xs tracking-wide">
              Next.js 16
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-800/80 text-white text-xs tracking-wide">
              Headless WP
            </span>
          </div>

          <div className="mt-6">
            <FlowButton text="Start your project" />
          </div>
        </div>

        {/* Right content */}
        <div className="lg:col-span-8">
          <h3 className="text-[clamp(32px,6vw,78px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-neutral-900">
            Web development
          </h3>
          <p className="mt-4 max-w-3xl text-[clamp(14px,1.4vw,20px)] leading-relaxed text-neutral-700">
            Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες
            και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.
          </p>
        </div>
      </div>
    </motion.article>
  );
}
