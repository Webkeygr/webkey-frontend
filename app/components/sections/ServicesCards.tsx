"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePathname } from "next/navigation";

type CardTiming = {
  enterFrom?: number;
  enterTo?: number;
  offsetPx?: number;
  overlapNext?: number;
};

type Pill = string | { label: string; href?: string; onClick?: () => void };

type CardContent = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  tags: Pill[];
  timing?: CardTiming;
};

const CARDS_OFFSET_VH = 0;
const PER_CARD_VH = 160;

/* ============================================================
   🔵 ΕΛΛΗΝΙΚΑ ΚΕΙΜΕΝΑ
============================================================ */
const CARDS_DATA_GR: CardContent[] = [
  {
    id: "card-1",
    title: "Web development",
    description:
      "Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.",
    videoSrc: "/videos/web-dev.mp4",
    tags: [
      "Custom Websites",
      "E-Commerce",
      "Web Applications",
      "Maintenance & Optimization",
    ],
    timing: {
      enterFrom: 0.0,
      enterTo: 0.06,
      offsetPx: 60,
      overlapNext: 0.12,
    },
  },
  {
    id: "card-2",
    title: "Branding",
    description:
      "Δημιουργούμε ταυτότητες που ξεχωρίζουν, συνδυάζοντας στρατηγική, αισθητική και συναίσθημα σε κάθε brand.",
    videoSrc: "/videos/webkey-logo-srv.mp4",
    tags: [
      "Logo Design",
      "Visual Web Identity",
      "UI Style Guide",
      "Content & Brand Voice",
    ],
    timing: {
      enterFrom: 0.02,
      enterTo: 0.36,
      offsetPx: 1000,
      overlapNext: 0.14,
    },
  },
  {
    id: "card-3",
    title: "Digital Marketing",
    description:
      "Αναπτύσσουμε έξυπνες καμπάνιες που αυξάνουν την προβολή, τη δέσμευση και τις πωλήσεις της επιχείρησής σου.",
    videoSrc: "/videos/webkey-marketing-srv.mp4",
    tags: [
      "SEO Optimization",
      "Google Ads & PPC",
      "Social Media Marketing",
      "Email & Content Marketing",
    ],
    timing: {
      enterFrom: 0.02,
      enterTo: 0.36,
      offsetPx: 1000,
      overlapNext: 0.14,
    },
  },
];

/* ============================================================
   🔵 ΑΓΓΛΙΚΑ ΚΕΙΜΕΝΑ
============================================================ */
const CARDS_DATA_EN: CardContent[] = [
  {
    id: "card-1",
    title: "Web Development",
    description:
      "Code that pulses. Platforms that breathe. We transform pixels into experiences and every scroll into a small journey of imagination.",
    videoSrc: "/videos/web-dev.mp4",
    tags: [
      "Custom Websites",
      "E-Commerce",
      "Web Applications",
      "Maintenance & Optimization",
    ],
    timing: {
      enterFrom: 0.0,
      enterTo: 0.06,
      offsetPx: 60,
      overlapNext: 0.12,
    },
  },
  {
    id: "card-2",
    title: "Branding",
    description:
      "We create identities that stand out, combining strategy, aesthetics, and emotion in every brand.",
    videoSrc: "/videos/webkey-logo-srv.mp4",
    tags: [
      "Logo Design",
      "Visual Web Identity",
      "UI Style Guide",
      "Content & Brand Voice",
    ],
    timing: {
      enterFrom: 0.02,
      enterTo: 0.36,
      offsetPx: 1000,
      overlapNext: 0.14,
    },
  },
  {
    id: "card-3",
    title: "Digital Marketing",
    description:
      "We develop smart campaigns that boost visibility, engagement, and sales for your business.",
    videoSrc: "/videos/webkey-marketing-srv.mp4",
    tags: [
      "SEO Optimization",
      "Google Ads & PPC",
      "Social Media Marketing",
      "Email & Content Marketing",
    ],
    timing: {
      enterFrom: 0.02,
      enterTo: 0.36,
      offsetPx: 1000,
      overlapNext: 0.14,
    },
  },
];

/* ============================================================
   COMPONENT
============================================================ */

export default function ServicesCards() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const CARDS_DATA = isEnglish ? CARDS_DATA_EN : CARDS_DATA_GR;

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

  // ✅ NEW: active card index so only its video plays
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(prog, "change", (v) => {
    const total = CARDS_DATA.length;
    const idx = Math.max(0, Math.min(total - 1, Math.floor(v * total)));
    setActiveIndex(idx);
  });

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

      <div className="sticky top-0 h-screen overflow-visible">
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
            <div className="relative w-full h-[68vh]">
              {CARDS_DATA.map((data, i) => (
                <CardLayer
                  key={data.id}
                  index={i}
                  total={CARDS_DATA.length}
                  progress={prog}
                  data={data}
                  isActive={i === activeIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CARD LAYER (same animation)
============================================================ */

function CardLayer({
  index,
  total,
  progress,
  data,
  isActive,
}: {
  index: number;
  total: number;
  progress: any;
  data: CardContent;
  isActive: boolean;
}) {
  const SEG = 1 / total;
  const segStart = index * SEG;

  const t = {
    enterFrom: 0.18,
    enterTo: 0.32,
    offsetPx: 90,
    overlapNext: 0.12,
    ...(data.timing || {}),
  };

  const enterStart = segStart + SEG * t.enterFrom;
  const enterEnd = segStart + SEG * t.enterTo;

  const y = useTransform(progress, [enterStart, enterEnd], [t.offsetPx, 0], {
    clamp: true,
  });
  const scale = useTransform(progress, [enterStart, enterEnd], [0.985, 1], {
    clamp: true,
  });

  const opacity = 1;

  const zIndex = useTransform(progress, (tt: number) =>
    tt >= segStart && tt < segStart + SEG ? 40 + index : 20 + index
  );

  return (
    <motion.article
      className="absolute inset-0"
      style={{ y, scale, opacity, zIndex }}
    >
      <CardBody data={data} isActive={isActive} />
    </motion.article>
  );
}

/* ============================================================
   CARD BODY
   ✅ ONLY CHANGE: play/pause based on isActive
============================================================ */

function CardBody({ data, isActive }: { data: CardContent; isActive: boolean }) {
  const vRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;

    // keep inline on iOS/Safari
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    if (isActive) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

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
      <div className="relative h-[52%] overflow-hidden rounded-t-[54px]">
        <video
          ref={vRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={data.videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>

      <div className="px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 lg:pt-10 pb-24 sm:pb-28 lg:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-[clamp(32px,6vw,78px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-neutral-900">
            {data.title}
          </h3>

          <p className="mt-4 text-[clamp(14px,1.4vw,20px)] leading-relaxed text-neutral-700">
            {data.description}
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {data.tags.map((pill, i) => {
              const p = typeof pill === "string" ? { label: pill } : pill;
              const base =
                "w-full h-12 md:h-12 rounded-full border border-black/5 bg-white/90 text-neutral-900 " +
                "shadow-[0_6px_18px_-10px_rgba(0,0,0,0.25)] " +
                "transition-transform duration-200 will-change-transform " +
                "hover:scale-[1.04] hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.35)] " +
                "px-4 inline-flex items-center justify-center text-center " +
                "text-[clamp(12px,1.1vw,16px)] font-medium leading-tight whitespace-normal break-words";

              if (p.href) {
                return (
                  <a key={i} href={p.href} className={base} rel="noopener">
                    {p.label}
                  </a>
                );
              }

              return (
                <button key={i} className={base} onClick={p.onClick}>
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
