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
  // Local progress (κρατιέται για επόμενες κάρτες/stacking – δεν μετακινεί την 1η)
  const secRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ['start end', 'end start'],
  });
  const local = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  /**
   * SLIDE-IN Είσοδος της κάρτας ΜΕΤΑ τον τίτλο.
   * - Δεν αλλάζουμε opacity (καθόλου fade).
   * - Το y ζωντανεύει από 160px → 0px στο στενό παράθυρο 0.88 → 0.96.
   *   Αν χρειαστεί πιο αργά/νωρίς, πείραξε μόνο αυτά τα δύο thresholds.
   */
  const entryY = useTransform(parentProgress, [0.88, 0.96], [160, 0], {
    clamp: true,
  });

  return (
    <section ref={secRef} className="relative w-full min-h-[200vh]">
      {/* Sticky wrapper – το αφήνουμε ΑΚΙΝΗΤΟ (δεν του δίνουμε y/opacity) */}
      <div className="sticky top-0 z-[40] h-screen flex items-center justify-center">
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <Card progress={local} entryY={entryY} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Card ---------------- */

function Card({
  progress,
  entryY,
}: {
  progress: MotionValue<number>;
  entryY: MotionValue<number>;
}) {
  /**
   * Κρατάμε την κάρτα σταθερή όσο είναι sticky (y από local = 0).
   * Η ΜΟΝΑΔΙΚΗ μετατόπιση είναι το entryY (slide-in) που έρχεται από το parentProgress.
   */
  const yStable = useTransform(progress, [0, 1], [0, 0], { clamp: true });

  return (
    <motion.article
      className="group/card relative h-[78vh] sm:h-[76vh] lg:h-[74vh] will-change-transform"
      style={{ y: entryY /* slide-in */ }}
    >
      {/* Γυάλινο υπόστρωμα */}
      <div className="absolute inset-0 rounded-[28px] bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white/60" />

      {/* Hover-buttons (εμφανίζονται στο hover της κάρτας) */}
      <div className="pointer-events-none absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
        <button className="pointer-events-auto px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-900 text-white/90 hover:text-white hover:bg-black/90">
          Details
        </button>
        <button className="pointer-events-auto px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur hover:bg-white">
          Save
        </button>
      </div>

      {/* Περιεχόμενο */}
      <div className="relative z-[1] h-full grid grid-cols-12 gap-6 p-6 sm:p-8 lg:p-12">
        {/* Αριστερό meta / actions */}
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

        {/* Δεξί περιεχόμενο */}
        <div className="lg:col-span-8">
          <h3 className="text-[clamp(32px,6vw,78px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-neutral-900">
            Web development
          </h3>
          <p className="mt-4 max-w-3xl text-[clamp(14px,1.4vw,20px)] leading-relaxed text-neutral-700">
            Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες
            και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.
          </p>

          {/* Γυάλινο θολωτό patch με video */}
          <div className="relative mt-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/40 backdrop-blur-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/30 via-transparent to-white/40" />
              <video
                className="block w-full h-[220px] object-cover"
                autoPlay
                loop
                muted
                playsInline
                src="/media/intro-loop.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
