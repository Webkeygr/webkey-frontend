'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

type CardTiming = {
  enterFrom?: number;
  enterTo?: number;
  holdTo?: number;
  offsetPx?: number;
  overlapNext?: number;
  instantOpacity?: boolean;
};

type CardContent = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  tags: string[];
  timing?: CardTiming;
};

const CARDS_DATA: CardContent[] = [
  {
    id: 'card-1',
    title: 'Web development',
    description:
      'Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.',
    videoSrc: '/videos/web-dev.mp4',
    tags: ['Websites & Platforms', 'Web Applications', 'E-Commerce', 'Performance & SEO'],
    timing: {
      enterFrom: 0.28,
      enterTo:   0.50,
      holdTo:    0.84,
      offsetPx:  110,
      overlapNext: 0.30,
    },
  },
  {
    id: 'card-2',
    title: 'UI / UX design',
    description:
      'Σχεδιάζουμε εμπειρίες που ρέουν, micro-interactions που χαμογελούν και flows που μετατρέπουν.',
    videoSrc: '/videos/ui-ux.mp4',
    tags: ['Research', 'Wireframes', 'Prototyping', 'Design Systems'],
    timing: {
      enterFrom: 0.05,
      enterTo:   0.32,
      holdTo:    0.88,
      offsetPx:  1000,
      instantOpacity: true,
    },
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const prog = useSpring(scrollYProgress, { stiffness: 200, damping: 18, mass: 0.18 });
  // ή: const prog = scrollYProgress;

  // Λιγότερα sticky scrolls ανά κάρτα
  const PER_CARD_VH = 380;

  // Overlay των καρτών: fade-in νωρίς και μένει full ως το τέλος
  const overlayOpacity = useTransform(prog, [0.00, 0.08, 0.20, 1.00], [0, 0, 1, 1]);

  return (
    <section
      ref={wrapRef}
      className="relative w-full mt-0"   // ✳️ καταργήθηκε το μεγάλο mt για να συνεχίσει το blur αδιάκοπα
      style={{ height: `${CARDS_DATA.length * PER_CARD_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* BLUR/DIM overlay — πλήρης διάρκεια */}
        <motion.div className="fixed inset-0 z-[5] pointer-events-none" style={{ opacity: overlayOpacity }}>
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        {/* Περιεχόμενο καρτών */}
        <div className="relative z-[10] h-full flex items-center justify-center">
          <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
            <div className="relative w-full h-[74vh]">
              {CARDS_DATA.map((data, i) => (
                <CardLayer
                  key={data.id}
                  index={i}
                  total={CARDS_DATA.length}
                  progress={prog}
                  data={data}
                  nextTiming={CARDS_DATA[i + 1]?.timing}
                />
              ))}
            </div>
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
  data,
  nextTiming,
}: {
  index: number;
  total: number;
  progress: any;
  data: CardContent;
  nextTiming?: CardTiming;
}) {
  const SEG = 1 / total;
  const segStart = index * SEG;
  const segEnd = (index + 1) * SEG;

  const DEFAULTS: Required<CardTiming> = {
    enterFrom: 0.40,
    enterTo: 0.70,
    holdTo: 0.95,
    offsetPx: 140,
    overlapNext: 0.18,
    instantOpacity: false,
  };
  const t = { ...DEFAULTS, ...(data.timing || {}) };

  const overlapNext = Math.max(0, Math.min(t.overlapNext ?? 0, 0.4));
  const enterStart = segStart + SEG * t.enterFrom;
  const enterEnd   = segStart + SEG * t.enterTo;
  const holdEnd    = segStart + SEG * t.holdTo;

  // Fade της τωρινής ΜΟΝΟ όταν η επόμενη “κάτσει”
  const next = nextTiming ? { ...DEFAULTS, ...nextTiming } : null;
  const nextEnterEndAbs = next ? ((index + 1) * SEG) + SEG * next.enterTo : null;

  const fadeStart = Math.min(
    Math.max(holdEnd, nextEnterEndAbs ?? holdEnd),
    segEnd + SEG * overlapNext
  );
  const fadeEnd = Math.min(segEnd + SEG * overlapNext, 1);

  const y = useTransform(progress, [enterStart, enterEnd, fadeEnd], [t.offsetPx, 0, 0], { clamp: true });

  const opacity = t.instantOpacity
    ? useTransform(progress, [enterStart, fadeStart, fadeEnd], [1, 1, 0], { clamp: true })
    : useTransform(progress, [enterStart, enterEnd, fadeStart, fadeEnd], [0, 1, 1, 0], { clamp: true });

  const zIndex = useTransform(progress, (tt: number) =>
    tt >= segStart && tt < segEnd ? 40 + index : 20 + index
  );

  return (
    <motion.article className="absolute inset-0" style={{ y, opacity, zIndex }}>
      <CardBody data={data} />
    </motion.article>
  );
}

function CardBody({ data }: { data: CardContent }) {
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
      {/* VIDEO */}
      <div className="relative h-[60%] overflow-hidden rounded-t-[54px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={data.videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {data.tags.map((t) => (
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
      </div>

      {/* TEXT */}
      <div className="px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14 text-left lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <h3 className="text-[clamp(32px,6vw,78px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-neutral-900">
            {data.title}
          </h3>
          <p className="mt-4 max-w-3xl text-[clamp(14px,1.4vw,20px)] leading-relaxed text-neutral-700">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
