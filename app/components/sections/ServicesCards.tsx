"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FlowButton } from "../ui/FlowButton";

type CardContent = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  tags: string[];
  timing?: {
    enterFrom?: number; // 0..1 μέσα στο segment της κάρτας
    enterTo?: number; // 0..1 (> enterFrom)
    holdTo?: number; // 0..1 (>= enterTo)
    offsetPx?: number; // px: από πόσο κάτω ξεκινά το slide-in
  };
};

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
      // Fast είσοδος + ικανό hold για να προλάβει ο χρήστης να δει
      enterFrom: 0.3,
      enterTo: 0.52,
      holdTo: 0.9,
      offsetPx: 120,
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
      enterFrom: 0.32,
      enterTo: 0.56,
      holdTo: 0.92,
      offsetPx: 140,
    },
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Snappy αλλά smooth (ίδιο feeling με τον τίτλο)
  const prog = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 18,
    mass: 0.18,
  });
  // ή: const prog = scrollYProgress;

  // Fast: λιγότερο runway ανά κάρτα
  const PER_CARD_VH = 520;

  return (
    <section
      ref={wrapRef}
      // Λιγότερη καθυστέρηση πριν μπουν οι κάρτες (από 500vh → 260vh)
      className="relative w-full mt-[260vh]"
      style={{ height: `${CARDS_DATA.length * PER_CARD_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          <div className="relative w-full h-[78vh] sm:h-[76vh] lg:h-[74vh]">
            {CARDS_DATA.map((data, i) => (
              <CardLayer
                key={data.id}
                index={i}
                total={CARDS_DATA.length}
                progress={prog}
                data={data}
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
  data,
}: {
  index: number;
  total: number;
  progress: any;
  data: CardContent;
}) {
  const SEG = 1 / total;
  const segStart = index * SEG;
  const segEnd = (index + 1) * SEG;

  const DEFAULTS = {
    enterFrom: 0.4,
    enterTo: 0.7,
    holdTo: 0.95,
    offsetPx: 140,
  };
  const t = { ...DEFAULTS, ...(data as any).timing };

  const enterStart = segStart + SEG * t.enterFrom;
  const enterEnd = segStart + SEG * t.enterTo;
  const holdEnd = segStart + SEG * t.holdTo;
  const fadeEnd = segEnd;

  const y = useTransform(
    progress,
    [enterStart, enterEnd, fadeEnd],
    [t.offsetPx, 0, 0],
    { clamp: true }
  );

  const opacity = useTransform(
    progress,
    [enterStart, enterEnd, holdEnd, fadeEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );

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
      {/* VIDEO AREA */}
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
