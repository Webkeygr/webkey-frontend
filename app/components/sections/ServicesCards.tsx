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
  titleFullOpacity,
}: {
  parentProgress?: MotionValue<number>;
  titleFullOpacity?: MotionValue<number>;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Το τοπικό progress για το sticky/κίνηση της κάρτας
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const local = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.35 });

  /**
   * GATE ορατότητας: βασίζεται ΑΠΕΥΘΕΙΑΣ στο opacity του full τίτλου.
   * - Όταν full title opacity ~0.15 ➜ 0.00, ανοίγουμε την κάρτα 0 ➜ 1.
   * - Έτσι σε όλα τα viewports η κάρτα έρχεται αμέσως ΜΕΤΑ το fade-out του τίτλου.
   */
  const gateOpacity = titleFullOpacity
    ? useTransform(titleFullOpacity, [0.15, 0.02], [0, 1], { clamp: true })
    : useTransform(parentProgress ?? 0 as any, [0.88, 0.94], [0, 1], { clamp: true });

  return (
    <section
      ref={wrapRef}
      className="relative w-full -mt-[34vh]"   // ξεκινά νωρίτερα ώστε να υπάρχει χώρος για sticky
      style={{ height: '240vh' }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
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
  // Κίνηση/διάρκεια όσο είναι sticky
  const y           = useTransform(progress, [0.0, 0.25, 0.85, 1.0], [160, 0, 0, -120], { clamp: true });
  const bodyOpacity = useTransform(progress, [0.0, 0.07, 0.9, 1.0], [0, 1, 1, 0], { clamp: true });

  return (
    <motion.article className="relative h-[78vh] sm:h-[76vh] lg:h-[74vh]" style={{ y, opacity: bodyOpacity }}>
      <div
        className="
          group relative w-full h-full
          rounded-[30px] sm:rounded-[36px] lg:rounded-[42px]
          bg-white/80 backdrop-blur-lg
          shadow-[0_40px_140px_-40px_rgba(0,0,0,0.4)]
          overflow-hidden
        "
      >
        {/* VIDEO AREA (masked top) */}
        <div className="relative h-[60%] overflow-hidden rounded-t-[54px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/web-dev.mp4"     // βάλε το αρχείο στο public/videos/web-dev.mp4
            autoPlay
            loop
            muted
            playsInline
          />

          {/* overlay μόνο πάνω στο video + κουμπιά */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {['Websites & Platforms', 'Web Applications', 'E-Commerce', 'Performance & SEO'].map((t) => (
                <button
                  key={t}
                  className="
                    px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl
                    bg-white text-neutral-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]
                    font-medium text-[clamp(12px,1.2vw,16px)]
                    transition-transform duration-300 hover:-translate-y-0.5
                  "
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* CTA κάτω από το video */}
          <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <FlowButton text="See details" />
            <FlowButton text="Get a quote" />
          </div>
        </div>

        {/* ΚΕΙΜΕΝΟ */}
        <div className="px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14 text-left lg:grid lg:grid-cols-12 lg:gap-10">
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
      </div>
    </motion.article>
  );
}
