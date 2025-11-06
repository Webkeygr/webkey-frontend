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
  /**
   * Τοπικό progress της ενότητας (όσο η κάρτα είναι sticky)
   */
  const secRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ['start end', 'end start'],
  });
  const local = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  /**
   * ΕΙΣΟΔΟΣ ΚΑΡΤΑΣ (από κάτω προς τα πάνω) ακριβώς όταν φύγει ο τίτλος:
   * - Μικρό παράθυρο 0.78 → 0.86 για ομαλό fade & slide.
   * - Μετά μένει πλήρως ορατή (sticky) όσο χρειάζεται για stacking.
   */
  const introOpacity = useTransform(parentProgress, [0.78, 0.86], [0, 1], { clamp: true });
  const introY       = useTransform(parentProgress, [0.78, 0.86], [80, 0], { clamp: true });

  return (
    <section ref={secRef} className="relative w-full min-h-[200vh]">
      {/* Sticky layer της κάρτας */}
      <motion.div
        className="sticky top-0 z-[40] pointer-events-auto h-screen overflow-hidden flex items-center justify-center"
        style={{ opacity: introOpacity, y: introY }}
      >
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <Card progress={local} />
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Card ---------------- */

function Card({ progress }: { progress: MotionValue<number> }) {
  /**
   * Ήπια κίνηση όσο η κάρτα είναι sticky για «ζωντάνια»
   */
  const y = useTransform(progress, [0.0, 0.25, 0.85, 1.0], [160, 0, 0, -120], { clamp: true });
  const bodyOpacity = useTransform(progress, [0.0, 0.07, 0.9, 1.0], [0, 1, 1, 0], { clamp: true });

  return (
    <motion.article
      className="group/card relative h-[78vh] sm:h-[76vh] lg:h-[74vh]"
      style={{ y, opacity: bodyOpacity }}
    >
      {/* Γυάλινο υπόστρωμα */}
      <div className="absolute inset-0 rounded-[28px] bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white/60" />

      {/* Hover-buttons (αποκαλύπτονται στο hover της κάρτας) */}
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

          {/* Γυάλινο θολωτό patch με video (ξαναμπαίνει όπως πριν ως visual accent) */}
          <div className="relative mt-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/40 backdrop-blur-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/30 via-transparent to-white/40" />
              <video
                className="block w-full h-[220px] object-cover"
                autoPlay
                loop
                muted
                playsInline
                // Βάλε εδώ το δικό σου video (ή άφησέ το — δεν σπάει τίποτα αν λείπει το asset)
                src="/media/intro-loop.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
