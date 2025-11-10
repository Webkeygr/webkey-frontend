"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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

// ΜΙΚΡΟ κενό: να μπει αμέσως μετά τον τίτλο
const CARDS_OFFSET_VH = 40;

const CARDS_DATA: CardContent[] = [
  {
    id: "card-1",
    title: "Web development",
    description:
      "Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.",
    videoSrc: "/videos/web-dev.mp4",
    tags: [
      "Websites & Platforms",
      "Web Applications",
      "E-Commerce",
      "Performance & SEO",
    ],
    timing: {
      enterFrom: 0.18, // Μπαίνει νωρίς στο πρώτο segment
      enterTo: 0.36,
      holdTo: 0.8,
      offsetPx: 120,
      overlapNext: 0.18,
    },
  },
  {
    id: "card-2",
    title: "UI / UX design",
    description:
      "Σχεδιάζουμε εμπειρίες που ρέουν, micro-interactions που χαμογελούν και flows που μετατρέπουν.",
    videoSrc: "/videos/ui-ux.mp4",
    tags: ["Research", "Wireframes", "Prototyping", "Design Systems"],
    timing: {
      enterFrom: 0.06,
      enterTo: 0.3,
      holdTo: 0.88,
      offsetPx: 900,
      instantOpacity: true,
    },
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const prog = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 18,
    mass: 0.18,
  });

  const PER_CARD_VH = 360;

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      style={{
        height: `calc(${CARDS_OFFSET_VH}vh + ${
          CARDS_DATA.length * PER_CARD_VH
        }vh)`,
      }}
    >
      <div style={{ height: `${CARDS_OFFSET_VH}vh` }} />

      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 h-full flex items-center justify-center">
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

/* ------------------------------ Card Layer ------------------------------ */
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
    enterFrom: 0.22,
    enterTo: 0.42,
    holdTo: 0.9,
    offsetPx: 120,
    overlapNext: 0.18,
    instantOpacity: true,
  };
  const t = { ...DEFAULTS, ...(data.timing || {}) };

  const enterStart = segStart + SEG * t.enterFrom;
  const enterEnd = segStart + SEG * t.enterTo;

  // Kίνηση μόνο (ΧΩΡΙΣ opacity fades)
  const y = useTransform(progress, [enterStart, enterEnd], [t.offsetPx, 0], {
    clamp: true,
  });

  // ΠΑΝΤΑ πλήρης αδιαφάνεια
  const opacity = 1;

  // Ελαφρύ scale κατά την άφιξη και μένει σταθερό
  const scale = useTransform(progress, [enterStart, enterEnd], [0.98, 1], {
    clamp: true,
  });

  const zIndex = useTransform(progress, (tt: number) =>
    tt >= segStart && tt < segEnd ? 40 + index : 20 + index
  );

  return (
    <motion.article
      className="absolute inset-0"
      style={{ y, scale, zIndex, opacity }}
    >
      <CardBody data={data} />
    </motion.article>
  );
}

/* ------------------------------- Card Body ------------------------------- */
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
        {/* καμία αλλαγή στο hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />
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
