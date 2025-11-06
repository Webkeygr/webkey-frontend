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

<<<<<<< HEAD
export default function ServicesCards({
  parentProgress,
}: {
  parentProgress: MotionValue<number>;
}) {
  // local progress (κρατιέται για επόμενες κάρτες – δεν σπρώχνει την 1η)
  const secRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ['start end', 'end start'],
=======
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
<<<<<<< HEAD
>>>>>>> parent of d0bb65e (services cards fix v1)
=======
>>>>>>> parent of d0bb65e (services cards fix v1)
  });
  const local = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

<<<<<<< HEAD
<<<<<<< HEAD
  // 1) Ανοίγουμε ορατότητα λίγο ΠΡΙΝ την κίνηση για να μη «σκάει» ξαφνικά
  const visible = useTransform(parentProgress, (v) =>
    v >= 0.88 ? 'visible' : 'hidden'
  );

  // 2) Καθαρό slide-in από κάτω, ΧΩΡΙΣ fade
  //    Στενό παράθυρο ώστε να φαίνεται «γλίστρημα»
  const entryYRaw = useTransform(parentProgress, [0.88, 0.96], [260, 0], {
    clamp: true,
  });
  const entryY = useSpring(entryYRaw, { stiffness: 170, damping: 22, mass: 0.7 });

  return (
    // Μεγάλο ύψος για να κρατάει το sticky στο κέντρο ως το τέλος
    <section ref={secRef} className="relative w-full min-h-[460vh]">
      {/* Κεντράρισμα με sticky top-1/2 -translate-y-1/2 (δεν «σκαρφαλώνει» προς τα πάνω) */}
      <div className="sticky top-1/2 -translate-y-1/2 z-[70] h-screen will-change-transform">
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <Card progress={local} entryY={entryY} visible={visible} />
=======
  // ελαφρύ spring για buttery κίνηση
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });

=======
  // ελαφρύ spring για buttery κίνηση
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });

>>>>>>> parent of d0bb65e (services cards fix v1)
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
>>>>>>> parent of d0bb65e (services cards fix v1)
        </div>
      </div>
    </section>
  );
}

function Card({
  progress,
  entryY,
  visible,
}: {
  progress: MotionValue<number>;
  entryY: MotionValue<number>;
  visible: MotionValue<'visible' | 'hidden'>;
}) {
<<<<<<< HEAD
<<<<<<< HEAD
  // δεν προσθέτουμε άλλο y όσο είναι sticky
  // (κρατάμε το hook για μελλοντικές κάρτες)
  useTransform(progress, [0, 1], [0, 0]);

  return (
    <motion.article
      className="group/card relative h-[78vh] sm:h-[76vh] lg:h-[74vh]"
      style={{
        y: entryY,            // μόνο slide-in
        visibility: visible,  // hard gate: δεν φαίνεται πριν την ώρα της
        willChange: 'transform',
      }}
=======
=======
>>>>>>> parent of d0bb65e (services cards fix v1)
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
<<<<<<< HEAD
>>>>>>> parent of d0bb65e (services cards fix v1)
=======
>>>>>>> parent of d0bb65e (services cards fix v1)
    >
      {/* glass υπόστρωμα */}
      <div className="absolute inset-0 rounded-[28px] bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-white/60" />

      {/* hover actions */}
      <div className="pointer-events-none absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
        <button className="pointer-events-auto px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-900 text-white/90 hover:text-white hover:bg-black/90">
          Details
        </button>
        <button className="pointer-events-auto px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur hover:bg-white">
          Save
        </button>
      </div>

      {/* περιεχόμενο */}
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

          {/* glass panel με video */}
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
<<<<<<< HEAD
=======

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
>>>>>>> parent of d0bb65e (services cards fix v1)
