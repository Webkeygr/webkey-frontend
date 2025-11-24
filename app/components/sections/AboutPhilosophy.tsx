"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import Lottie from "lottie-react";
import "./AboutPhilosophy.css";

type LottieData = Record<string, any>;

type Card = {
  id: string;
  title: string;
  body: string;
};

const CARDS: Card[] = [
  {
    id: "clarity",
    title: "Clarity first",
    body: "Δεν κρυβόμαστε πίσω από buzzwords. Ξεκινάμε με ξεκάθαρους στόχους: τι θέλεις να πετύχεις, με ποιο κοινό και σε ποιο χρονικό ορίζοντα. Ό,τι σχεδιάζουμε, υπηρετεί αυτό.",
  },
  {
    id: "design",
    title: "Design με σκοπό",
    body: "Όμορφο χωρίς λειτουργικότητα δεν μας ενδιαφέρει. Σχεδιάζουμε εμπειρίες που οδηγούν τον επισκέπτη σε πράξη: να σου στείλει μήνυμα, να κλείσει ραντεβού, να αγοράσει, να σε θυμάται.",
  },
  {
    id: "tech",
    title: "Tech χωρίς φλυαρία",
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κλπ.), αλλά δεν σε “πνίγουμε” με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
  },
  {
    id: "relation",
    title: "Σχέση, όχι project",
    body: "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”. Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // 0 όταν μπαίνει, 1 όταν φεύγει
  });

  // λευκό πάνελ που "ανεβαίνει" και κολλάει fullscreen
  const panelScaleY = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  // progress για να ξεκινήσουν τα τετράγωνα μετά από λίγα scroll
  const cardsProgress = useTransform(scrollYProgress, [0.35, 0.95], [0, 1]);

  /* LOTTIE CENTER */
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        // άλλαξε το path στο δικό σου JSON αν χρειάζεται
        const res = await fetch("/lottie/about-philosophy.json");
        if (res.ok) {
          setLottieData(await res.json());
        }
      } catch {
        setLottieData(null);
      }
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[220vh]" // αρκετό ύψος για scroll
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Λευκό πάνελ που καλύπτει το hero background */}
        <motion.div
          className="absolute inset-0 bg-white"
          style={{ originY: 1, scaleY: panelScaleY }}
        />

        {/* CONTENT πάνω από το λευκό πάνελ */}
        <div className="relative z-10 flex h-full items-center">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
            {/* Τίτλος με glitch effect */}
            <div className="text-center mb-10 md:mb-14">
              <h2
                className="glitch-title text-[clamp(32px,5vw,56px)] font-extrabold tracking-tight"
                data-text="Ποιοι είμαστε"
              >
                Ποιοι είμαστε
              </h2>
              <p className="mt-4 text-[clamp(14px,1.4vw,18px)] text-neutral-800 max-w-3xl mx-auto leading-relaxed">
                Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο.
                Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν
                ακολουθούν τάσεις — τις ξεκινούν.
              </p>
            </div>

            {/* GRID: 4 τετράγωνα γύρω από Lottie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-3 lg:grid-rows-3 gap-8 lg:gap-10 items-center justify-items-center">
              {/* Πάνω-αριστερά */}
              <GlowingCard
                card={CARDS[0]}
                index={0}
                cardsProgress={cardsProgress}
              />

              {/* Πάνω κέντρο: κενό σε desktop */}
              <div className="hidden lg:block" />

              {/* Πάνω-δεξιά */}
              <GlowingCard
                card={CARDS[1]}
                index={1}
                cardsProgress={cardsProgress}
              />

              {/* Μέση-αριστερά: κενό σε desktop */}
              <div className="hidden lg:block" />

              {/* Κέντρο: Lottie κύκλος */}
              <motion.div
                className="flex items-center justify-center"
                style={{
                  opacity: useTransform(cardsProgress, [0, 0.15], [0.9, 1]),
                  scale: useTransform(cardsProgress, [0, 0.15], [0.95, 1]),
                }}
              >
                <div className="relative flex items-center justify-center rounded-full border border-black/10 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] w-[150px] h-[150px] md:w-[190px] md:h-[190px] bg-white/80 backdrop-blur">
                  {lottieData ? (
                    <Lottie
                      animationData={lottieData}
                      loop
                      autoplay
                      style={{ width: "72%", height: "72%" }}
                    />
                  ) : (
                    <span className="text-xs text-neutral-500">
                      Lottie center
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Μέση-δεξιά: κενό σε desktop */}
              <div className="hidden lg:block" />

              {/* Κάτω-αριστερά */}
              <GlowingCard
                card={CARDS[2]}
                index={2}
                cardsProgress={cardsProgress}
              />

              {/* Κάτω κέντρο: κενό σε desktop */}
              <div className="hidden lg:block" />

              {/* Κάτω-δεξιά */}
              <GlowingCard
                card={CARDS[3]}
                index={3}
                cardsProgress={cardsProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Glowing neon card -------------------- */

function GlowingCard({
  card,
  index,
  cardsProgress,
}: {
  card: Card;
  index: number;
  cardsProgress: MotionValue<number>;
}) {
  // κάθε τετράγωνο ξεκινά λίγο αργότερα → ένα ένα
  const start = 0.15 + index * 0.15;
  const end = start + 0.35;

  const localProg = useTransform(cardsProgress, [start, end], [0, 1]);

  const y = useTransform(localProg, [0, 1], [60, 0]); // έρχεται από κάτω
  const opacity = useTransform(localProg, [0, 1], [0, 1]);

  return (
    <motion.div className="w-full max-w-sm" style={{ y, opacity }}>
      <div className="relative">
        {/* neon gradient frame */}
        <div className="pointer-events-none absolute -inset-[2px] rounded-[14px] bg-gradient-to-tr from-sky-400 via-fuchsia-500 to-violet-500 opacity-80 blur-sm" />
        {/* actual card */}
        <div className="relative rounded-[10px] bg-white border border-white/70 px-6 py-6 md:px-7 md:py-7 shadow-[0_18px_60px_-24px_rgba(15,23,42,0.4)]">
          <h3 className="text-lg md:text-xl font-semibold mb-3 text-neutral-900">
            {card.title}
          </h3>
          <p className="text-sm md:text-[15px] leading-relaxed text-neutral-700">
            {card.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
