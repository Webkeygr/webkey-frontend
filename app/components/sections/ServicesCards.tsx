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
  // ✅ το prop είναι ΠΡΟΑΙΡΕΤΙΚΟ. Αν δεν σταλεί από το ServicesIntro, κάνουμε fallback.
  parentProgress?: MotionValue<number>;
}) {
  // Τοπικό progress του section για fallback/stacking
  const secRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ['start end', 'end start'],
  });
  const localSpring = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // ✅ Αν δώσεις parentProgress από το ServicesIntro θα χρησιμοποιηθεί.
  //    Αλλιώς, χρησιμοποιούμε το τοπικό localSpring για να δουλεύει κανονικά.
  const drive = parentProgress ?? localSpring;

  // ── GATE με visibility (όχι fade) για να μην «πατάει» πάνω στον τίτλο ──
  // Ρύθμισε τα thresholds αν τη θες πιο αργά/νωρίς.
  const visible = useTransform(drive, (v) => (v >= 0.935 ? 'visible' : 'hidden'));

  // ── SLIDE-IN από κάτω, χωρίς opacity changes ──
  const entryYRaw = useTransform(drive, [0.935, 0.985], [260, 0], { clamp: true });
  const entryY = useSpring(entryYRaw, { stiffness: 170, damping: 22, mass: 0.7 });

  return (
    // Μεγάλο runway ώστε να παραμένει κεντραρισμένη ως το τέλος του section
    <section ref={secRef} className="relative w-full min-h-[360vh]">
      {/* Sticky centered: δεν κουνάμε τον wrapper, μόνο την κάρτα */}
      <div className="sticky top-1/2 -translate-y-1/2 z-[70] h-screen will-change-transform">
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <Card entryY={entryY} visible={visible} />
        </div>
      </div>
    </section>
  );
}

function Card({
  entryY,
  visible,
}: {
  entryY: MotionValue<number>;
  visible: MotionValue<'visible' | 'hidden'>;
}) {
  return (
    <motion.article
      className="group/card relative h-[78vh] sm:h-[76vh] lg:h-[74vh]"
      style={{ y: entryY, visibility: visible }}
    >
      {/* Γυάλινο υπόστρωμα */}
      <div className="absolute inset-0 rounded-[28px] bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white/60" />

      {/* Hover actions */}
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
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-black/90 text-white text-xs">Core Service</span>
            <span className="px-3 py-1 rounded-full bg-neutral-900/80 text-white text-xs">Next.js 16</span>
            <span className="px-3 py-1 rounded-full bg-neutral-800/80 text-white text-xs">Headless WP</span>
          </div>
          <div className="mt-6">
            <FlowButton text="Start your project" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <h3 className="text-[clamp(32px,6vw,78px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-neutral-900">
            Web development
          </h3>
          <p className="mt-4 max-w-3xl text-[clamp(14px,1.4vw,20px)] leading-relaxed text-neutral-700">
            Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες
            και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.
          </p>

          {/* Glass panel με video (προσαρμόζεις src κατά βούληση) */}
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
