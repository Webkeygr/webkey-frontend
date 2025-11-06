'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, vh } from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

/* -------------------------------------------------------------------------- */
/*  ΠΕΡΙΕΧΟΜΕΝΟ ΚΑΡΤΩΝ (μόνο εδώ πειράζεις για τίτλο/κείμενο/video/tags)       */
/* -------------------------------------------------------------------------- */
type CardContent = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  tags: string[];
  timing?: {
    enterFrom?: number; // 0..1 (μέσα στο segment)
    enterTo?: number;   // 0..1 (> enterFrom)
    holdTo?: number;    // 0..1 (> enterTo)
    offsetPx?: number;  // πόσο κάτω ξεκινά (px)
  };
};

// 👉 Η 1η κάρτα είναι όπως την είχες.
// 👉 Η 2η κάρτα: άλλαξε απλώς τις τιμές στο δεύτερο object.
const CARDS_DATA: CardContent[] = [
  {
    id: 'card-1',
    title: 'Web development',
    description:
      'Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.',
    videoSrc: '/videos/web-dev.mp4', // public/videos/web-dev.mp4
    tags: ['Websites & Platforms', 'Web Applications', 'E-Commerce', 'Performance & SEO'],
    timing: {
      enterFrom: 0.65,
      enterTo:   0.88,
      holdTo:    2.0,
      offsetPx:  160,
    },
  },
  {
    id: 'card-2',
    title: 'UI / UX design', // ← ΒΑΛΕ εδώ τον τίτλο της 2ης κάρτας
    description:
      'Σχεδιάζουμε εμπειρίες που ρέουν, micro-interactions που χαμογελούν και flows που μετατρέπουν.', // ← περιγραφή 2ης κάρτας
    videoSrc: '/videos/ui-ux.mp4', // ← path video 2ης κάρτας
    tags: ['Research', 'Wireframes', 'Prototyping', 'Design Systems'], // ← κουμπιά/ετικέτες 2ης κάρτας
    timing: {
      // π.χ. να μπαίνει πιο αργά και να «κάθεται» περισσότερο
      enterFrom: 0.55,
      enterTo:   0.90,
      holdTo:    2.0,
      offsetPx:  200,
    },
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.35 });

  // Κάθε κάρτα «καταναλώνει» 300vh runway (ίδιο με πριν).
  const PER_CARD_VH = 800;

  return (
    <section
      ref={wrapRef}
      className="relative w-full mt-[500vh]"   // ΔΕΝ αλλάζω αυτό που έχεις
      style={{ height: `${CARDS_DATA.length * PER_CARD_VH}vh` }} // 300vh * πλήθος καρτών
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          {/* Wrapper με ίδιο ύψος κάρτας όπως πριν */}
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

/* -------------------------------------------------------------------------- */
/*  Layer ανά κάρτα: ίδιο layout, δικό της timing (slide-in, hold, fade-out)   */
/* -------------------------------------------------------------------------- */
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
  // Μοίρασμα progress 0..1 σε segments ανά κάρτα
  const SEG = 1 / total;
  const segStart = index * SEG;
  const segEnd = (index + 1) * SEG;

  // ✅ Per-card timings με defaults (αν δεν δοθούν στο data.timing)
  const DEFAULTS = { enterFrom: 0.70, enterTo: 0.92, holdTo: 0.96, offsetPx: 160 };
  const t = { ...DEFAULTS, ...(data as any).timing };

  // Από "σχετικό" (0..1 του segment) σε "απόλυτο" (0..1 όλης της ενότητας)
  const enterStart = segStart + SEG * t.enterFrom;
  const enterEnd   = segStart + SEG * t.enterTo;
  const holdEnd    = segStart + SEG * t.holdTo;
  const fadeEnd    = segEnd;

  // y: καθαρό slide-in από κάτω → 0 και μένει κεντραρισμένη
  const y = useTransform(
    progress,
    [enterStart, enterEnd, fadeEnd],
    [t.offsetPx, 0, 0],
    { clamp: true }
  );

  // opacity: 0→1 όσο μπαίνει, κρατάει 1, μετά σβήνει μέχρι το τέλος του segment
  const opacity = useTransform(
    progress,
    [enterStart, enterEnd, holdEnd, fadeEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Η ενεργή κάρτα "πάνω" για ομαλό overlap
  const zIndex = useTransform(progress, (tt: number) =>
    tt >= segStart && tt < segEnd ? 40 + index : 20 + index
  );

  return (
    <motion.article className="absolute inset-0" style={{ y, opacity, zIndex }}>
      <CardBody data={data} />
    </motion.article>
  );
}


/* -------------------------------------------------------------------------- */
/*  ΙΔΙΟ layout/κλάσεις με την 1η κάρτα — απλώς περνάμε data                  */
/* -------------------------------------------------------------------------- */
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
        {/* overlay & κουμπιά ΜΟΝΟ πάνω στο video */}
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

      {/* ΚΕΙΜΕΝΟ */}
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
