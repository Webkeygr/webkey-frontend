// app/components/sections/ServicesCards.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Προόδος ΤΗΣ ΕΝΟΤΗΤΑΣ (0→1 καθώς το section διασχίζει το viewport)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.35 });

  // SLIDE-IN ΑΠΟ ΚΑΤΩ (ΧΩΡΙΣ FADING):
  // Πολύ «ασφαλές» παράθυρο ώστε να μπει σίγουρα.
  // Αν τη βλέπεις νωρίς, ΑΥΞΗΣΕ αυτά τα νούμερα (π.χ. [0.08, 0.20]).
  const y = useTransform(prog, [0.02, 0.14], [240, 0], { clamp: true });

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      // αρκετό ύψος για να κρατάει το sticky στο κέντρο μέχρι το τέλος
      style={{ minHeight: '300vh' }}
    >
      {/* Κεντράρισμα με sticky — δεν κουνάμε τον wrapper, μόνο την κάρτα */}
      <div className="sticky top-1/2 -translate-y-1/2 h-screen z-[60]">
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <Card y={y} />
        </div>
      </div>
    </section>
  );
}

function Card({ y }: { y: any }) {
  return (
    <motion.article className="relative h-[78vh] sm:h-[76vh] lg:h-[74vh]" style={{ y }}>
      <div
        className="
          group relative w-full h-full
          rounded-[30px] sm:rounded-[36px] lg:rounded-[42px]
          bg-white/80 backdrop-blur-lg
          shadow-[0_40px_140px_-40px_rgba(0,0,0,0.4)]
          overflow-hidden
        "
      >
        {/* VIDEO AREA (αν δεν υπάρχει asset, απλά δεν θα παίξει — δεν σπάει τίποτα) */}
        <div className="relative h-[60%] overflow-hidden rounded-t-[54px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/web-dev.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />
          <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <FlowButton text="See details" />
            <FlowButton text="Get a quote" />
          </div>
        </div>

        {/* Κείμενο */}
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
