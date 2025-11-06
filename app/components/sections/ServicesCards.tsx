'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

type Service = {
  id: string;
  title: string;
  description: string;
  videoSrc: string; // /public/videos/*.mp4|webm
  ctas?: { text: string }[];
};

const SERVICES: Service[] = [
  {
    id: 'web-dev',
    title: 'Web development',
    description:
      'Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.',
    videoSrc: '/videos/demo.webm',
    ctas: [{ text: 'See details' }, { text: 'Get a quote' }],
  },
  {
    id: 'web-apps',
    title: 'Web Applications',
    description:
      'Από ιδέα σε production—robust αρχιτεκτονική, καθαρό DX, zero-friction UX.',
    videoSrc: '/videos/demo.webm',
    ctas: [{ text: 'Case studies' }, { text: 'Start project' }],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description:
      'Headless, performance, conversion. Καταστήματα που πουλάνε και πετάνε.',
    videoSrc: '/videos/demo.webm',
    ctas: [{ text: 'Platform options' }, { text: 'Book a call' }],
  },
  {
    id: 'performance-seo',
    title: 'Performance & SEO',
    description:
      'Ταχύτητα, Core Web Vitals, technical SEO—το site σου πρώτα και γρήγορα.',
    videoSrc: '/videos/demo.webm',
    ctas: [{ text: 'Audit my site' }, { text: 'Improve score' }],
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Το section που ελέγχει ΟΛΗ τη ροή των καρτών
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });

  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.35 });

  const N = SERVICES.length;
  const per = 1 / N;

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      // αρκετό runway: κάθε κάρτα ~140vh ώστε να “κάθεται” (sticky-feel) στο κέντρο
      style={{ height: `calc(${N} * 140vh)` }}
    >
      {/* Sticky viewport: το «παράθυρο» μέσα στο οποίο κουμπώνει η εκάστοτε κάρτα */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* container: max 1900px, με 60px side + 50px top/bottom (στο desktop) */}
        <div className="w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          {/* Μεγαλύτερη κάρτα, τύπου KOTA */}
          <div className="relative h-[78vh] sm:h-[76vh] lg:h-[74vh]">
            {SERVICES.map((s, i) => (
              <CardLayer
                key={s.id}
                index={i}
                total={N}
                progress={prog}
                service={s}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardLayer({
  index,
  total,
  progress,
  service,
}: {
  index: number;
  total: number;
  progress: any;
  service: Service;
}) {
  // Το “κομμάτι” προόδου που ανήκει στην κάρτα
  const start = useMemo(() => index / total, [index, total]);
  const end = useMemo(() => (index + 1) / total, [index, total]);

  // Φάσεις για sticky αίσθηση:
  // Μπαίνει από κάτω -> ΚΑΘΕΤΑΙ στο κέντρο (hold) -> φεύγει προς τα πάνω με fade
  const enter = start + (end - start) * 0.20; // πότε φτάνει στο κέντρο
  const leave = start + (end - start) * 0.80; // πότε αρχίζει να φεύγει

  const y = useTransform(
    progress,
    [start, enter, leave, end],
    [120, 0, -10, -120],
    { clamp: true }
  );

  // Μεγάλο hold στο κέντρο για “sticky” αίσθηση
  const opacity = useTransform(
    progress,
    [start, start + 0.06 * (end - start), leave, end],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // ενεργή κάρτα να είναι “πάνω”
  const zIndex = useTransform(progress, (t: number) =>
    t >= start && t < end ? 20 : 10
  );

  return (
    <motion.article
      className="absolute inset-0 mx-auto flex items-center justify-center"
      style={{ y, opacity, zIndex }}
    >
      <ServiceCard service={service} />
    </motion.article>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className="
        group relative w-full h-full
        rounded-[30px] sm:rounded-[36px] lg:rounded-[42px]
        bg-white/80 backdrop-blur-lg
        shadow-[0_40px_140px_-40px_rgba(0,0,0,0.4)]
        overflow-hidden
      "
    >
      {/* VIDEO AREA (πάνω μέρος) — εδώ βάζεις το video αρχείο σου στο /public/videos */}
      <div className="relative h-[58%] sm:h-[58%] lg:h-[60%] overflow-hidden rounded-t-[54px]">
        {/* το video εμφανίζεται μόνο εδώ */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={service.videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* overlay ΜΟΝΟ πάνω στο video (στο hover) */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />

        {/* κουμπιά στο overlay (όχι ξεχωριστές κάρτες) */}
        <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {(service.ctas ?? []).map((c) => (
            <FlowButton key={c.text} text={c.text} />
          ))}
        </div>
      </div>

      {/* Κείμενα (τίτλος / περιγραφή) */}
      <div className="px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14 text-left lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Σε μεγάλα, δίνουμε αίσθηση “KOTA”: κείμενο αριστερά, media πάνω να «γεμίζει» */}
        <div className="lg:col-span-8">
          <h3 className="text-[clamp(32px,6vw,78px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-neutral-900">
            {service.title}
          </h3>
          <p className="mt-4 max-w-3xl text-[clamp(14px,1.4vw,20px)] leading-relaxed text-neutral-700">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}
