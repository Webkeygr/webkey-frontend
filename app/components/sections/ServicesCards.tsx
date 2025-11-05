'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FlowButton } from '../ui/FlowButton';

type Service = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;        // π.χ. /videos/web-dev.mp4
  videoTags?: string[];    // κουμπιά που εμφανίζονται πάνω στο video (στο hover)
  ctas?: { text: string }[];
};

const SERVICES: Service[] = [
  {
    id: 'web-dev',
    title: 'Web development',
    description:
      'Κώδικας που πάλλεται. Πλατφόρμες που αναπνέουν. Μεταμορφώνουμε pixels σε εμπειρίες και κάθε scroll σε ένα μικρό ταξίδι φαντασίας.',
    videoSrc: '/videos/web-dev.mp4', // ΒΑΛΕ εδώ το δικό σου αρχείο στο /public/videos
    videoTags: [
      'Websites & Platforms',
      'Web Applications',
      'E-Commerce',
      'Performance & SEO',
    ],
    ctas: [{ text: 'See details' }, { text: 'Get a quote' }],
  },
  {
    id: 'web-apps',
    title: 'Web Applications',
    description:
      'Από ιδέα σε production—robust αρχιτεκτονική, καθαρό DX, zero-friction UX.',
    videoSrc: '/videos/web-apps.mp4',
    ctas: [{ text: 'Case studies' }, { text: 'Start project' }],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description:
      'Headless, performance, conversion. Καταστήματα που πουλάνε και πετάνε.',
    videoSrc: '/videos/ecommerce.mp4',
    ctas: [{ text: 'Platform options' }, { text: 'Book a call' }],
  },
  {
    id: 'perf-seo',
    title: 'Performance & SEO',
    description:
      'Ταχύτητα, Core Web Vitals, technical SEO—το site σου πρώτα και γρήγορα.',
    videoSrc: '/videos/perf-seo.mp4',
    ctas: [{ text: 'Audit my site' }, { text: 'Improve score' }],
  },
];

export default function ServicesCards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // scroll για ολόκληρο το section καρτών
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.35 });

  // συνεχίζουμε το blur του intro και το σβήνουμε ομαλά στα πρώτα ~15% του section
  const blurContOpacity = useTransform(prog, [0, 0.15], [1, 0], { clamp: true });
  const dimContOpacity  = useTransform(prog, [0.06, 0.20], [0.12, 0], { clamp: true });

  const N = SERVICES.length;

  return (
    <section
      ref={wrapRef}
      className="relative w-full -mt-[18vh]" // εμφανίζεται λίγο πριν σβήσει τελείως ο τίτλος
      // runway: ~140vh ανά κάρτα για sticky αίσθηση στο κέντρο
      style={{ height: `calc(${N} * 140vh)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* συνέχεια του blur για seamless μετάβαση από το intro */}
        <motion.div className="absolute inset-0 backdrop-blur-3xl" style={{ opacity: blurContOpacity }} />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimContOpacity }} />

        {/* container: max 1900px με 60px side + 50px top/bottom στο desktop */}
        <div className="relative w-full max-w-[1900px] mx-auto px-6 sm:px-10 lg:px-[60px] py-8 sm:py-10 lg:py-[50px]">
          {/* Μεγαλύτερη κάρτα (τύπου KOTA) */}
          <div className="relative h-[78vh] sm:h-[76vh] lg:h-[74vh]">
            {SERVICES.map((s, i) => (
              <CardLayer key={s.id} index={i} total={N} progress={prog} service={s} />
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
  // προοδευτική περιοχή ανά κάρτα
  const start = useMemo(() => index / total, [index, total]);
  const end   = useMemo(() => (index + 1) / total, [index, total]);

  // sticky αίσθηση: μπαίνει → κάθεται στο κέντρο → φεύγει
  const enter = start + (end - start) * 0.18;
  const leave = start + (end - start) * 0.82;

  const y = useTransform(progress, [start, enter, leave, end], [120, 0, -10, -120], { clamp: true });
  const opacity = useTransform(
    progress,
    [start, start + 0.06 * (end - start), leave, end],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const zIndex = useTransform(progress, (t: number) => (t >= start && t < end ? 20 : 10));

  return (
    <motion.article className="absolute inset-0 mx-auto flex items-center justify-center" style={{ y, opacity, zIndex }}>
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
      {/* VIDEO AREA — εδώ παίζει το video ΚΑΙ μόνο εδώ κάνει overlay στο hover */}
      <div className="relative h-[58%] sm:h-[58%] lg:h-[60%] overflow-hidden rounded-t-[54px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={service.videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* overlay ΜΟΝΟ πάνω στο video */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />

        {/* TAG BUTTONS (grid 2x2) – εμφανίζονται στο hover, μέσα στο video area */}
        {service.videoTags?.length ? (
          <div
            className="
              absolute inset-0 flex items-center justify-center
              opacity-0 transition-opacity duration-500 group-hover:opacity-100
            "
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {service.videoTags.map((t) => (
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
        ) : null}

        {/* ΚΙΑΤΑ στο κάτω μέρος του video (εμφάνιση στο hover) */}
        <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {(service.ctas ?? []).map((c) => (
            <FlowButton key={c.text} text={c.text} />
          ))}
        </div>
      </div>

      {/* ΚΕΙΜΕΝΟ */}
      <div className="px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14 text-left lg:grid lg:grid-cols-12 lg:gap-10">
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
