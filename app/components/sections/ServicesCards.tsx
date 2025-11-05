'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

type Service = {
  id: string;
  title: string;
  description: string;
  videoSrc: string; // /public/videos/*.mp4
};

const SERVICES: Service[] = [
  {
    id: 'web-dev',
    title: 'Web development',
    description:
      'Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.',
    videoSrc: '/videos/demo.webm', // βάλε το δικό σου .mp4/.webm στο public/videos
  },
  {
    id: 'web-apps',
    title: 'Web Applications',
    description:
      'Από ιδέα σε production—robust αρχιτεκτονική, καθαρό DX, zero friction UX.',
    videoSrc: '/videos/demo.webm',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description:
      'Headless, performance, conversion. Καταστήματα που πουλάνε και πετάνε.',
    videoSrc: '/videos/demo.webm',
  },
  {
    id: 'performance-seo',
    title: 'Performance & SEO',
    description:
      'Ταχύτητα, Core Web Vitals, technical SEO—το site σου πρώτα και γρήγορα.',
    videoSrc: '/videos/demo.webm',
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'], // ξεκίνα λίγο πριν «τελειώσει» ο τίτλος
  });

  // ελαφρύ spring για buttery κίνηση
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });

  // πόσα «κομμάτια» προόδου αναλογούν σε κάθε κάρτα
  const N = SERVICES.length;
  const per = 1 / N;

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      // ύψος: αρκετό runway για glide κάθε κάρτας
      style={{ height: `calc(${N} * 120vh)` }} // ~120vh ανά κάρτα για ομαλό fade/slide
    >
      {/* sticky viewport ώστε οι κάρτες να «στοιβάζονται» */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* container με max 1900px + margins 60px x + 50px y σε 1080p */}
        <div className="w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <div className="relative h-[72vh] sm:h-[70vh] lg:h-[66vh]">
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
  // εύρος προόδου που «ανήκει» σε αυτή την κάρτα
  const start = useMemo(() => index / total, [index, total]);
  const end = useMemo(() => (index + 1) / total, [index, total]);
  const midEnter = start + (end - start) * 0.35; // φτάνει κέντρο
  const midExit = start + (end - start) * 0.75;  // αρχίζει να φεύγει

  // slide από κάτω -> κέντρο -> πάνω
  const y = useTransform(
    progress,
    [start, midEnter, midExit, end],
    [120, 0, -20, -100],
    { clamp: true }
  );

  // fade in -> hold -> fade out
  const opacity = useTransform(
    progress,
    [start, start + 0.05 * (end - start), midExit, end],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // ελαφρύ scale για βάθος
  const scale = useTransform(progress, [start, midEnter], [0.98, 1], { clamp: true });

  return (
    <motion.article
      className="absolute inset-0 mx-auto flex items-center justify-center"
      style={{ y, opacity, scale, pointerEvents: index === 0 ? 'auto' : 'none' }}
    >
      <ServiceCard service={service} />
    </motion.article>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className="
        group/card relative w-full h-full
        rounded-[28px] sm:rounded-[32px] lg:rounded-[36px]
        bg-white/70 backdrop-blur-md
        shadow-[0_30px_120px_-30px_rgba(0,0,0,0.35)]
        overflow-hidden
      "
    >
      {/* VIDEO AREA with rounded top only */}
      <div className="relative h-[46%] sm:h-[48%] lg:h-[50%] overflow-hidden rounded-t-[40px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={service.videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* hover overlay ΜΟΝΟ στο video area */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover/card:bg-black/30" />
        {/* buttons εμφανίζονται στο hover */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:translate-y-0">
          <FlowButton text="See details" />
          <FlowButton text="Get a quote" />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 text-center">
        <h3 className="text-[clamp(24px,4vw,48px)] font-extrabold tracking-[-0.01em] text-neutral-900">
          {service.title}
        </h3>
        <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-[clamp(14px,1.6vw,18px)] leading-relaxed text-neutral-700">
          {service.description}
        </p>
      </div>
    </div>
  );
}
