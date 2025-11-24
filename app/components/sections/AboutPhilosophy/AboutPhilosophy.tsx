"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import scrollDown from "@/public/lottie/scroll down.json";

import "./AboutPhilosophy.css";

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
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε “πνίγουμε” με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
  },
  {
    id: "relationship",
    title: "Σχέση, όχι project",
    body: "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”. Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

export default function AboutPhilosophy() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Λίγο smoothing
  const prog = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    mass: 0.25,
  });

  // Λευκό φόντο που ανεβαίνει (parallax)
  const panelY = useTransform(prog, [0, 0.18], [80, 0]);

  // Phase 1 – Glitch τίτλος + lottie
  const titleOpacity = useTransform(
    prog,
    [0.05, 0.16, 0.32, 0.4],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(prog, [0.05, 0.32, 0.4], [30, 0, -20]);

  const topLottieOpacity = titleOpacity; // ίδιο range με τον τίτλο
  const topLottieY = useTransform(prog, [0.05, 0.32, 0.4], [80, 40, -10]);

  // Phase 2 – Grid με κάρτες + lottie στο κέντρο
  const gridOpacity = useTransform(prog, [0.38, 0.48], [0, 1]);
  const gridY = useTransform(prog, [0.38, 0.7], [40, 0]);

  // Lottie στο κέντρο ανάμεσα στα κουτιά
  const midLottieOpacity = useTransform(prog, [0.42, 0.5, 0.9], [0, 1, 1]);
  const midLottieScale = useTransform(prog, [0.42, 0.6], [0.9, 1.1]);

  return (
    <section ref={wrapRef} className="relative h-[260vh] w-full bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Λευκό panel που ανεβαίνει και κρύβει το hero */}
        <motion.div
          className="absolute inset-0 bg-white"
          style={{ y: panelY, zIndex: 0 }}
        />

        {/* CONTENT */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8">
            {/* PHASE 1: Glitch title + Lottie στο κέντρο */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ opacity: titleOpacity }}
            >
              <motion.div style={{ y: titleY }}>
                <GlitchText
                  speed={1}
                  enableShadows={true}
                  enableOnHover={false}
                  className="text-center text-[clamp(32px,6vw,64px)]"
                >
                  Ποιοι είμαστε
                </GlitchText>
              </motion.div>

              <motion.div
                style={{ opacity: topLottieOpacity, y: topLottieY }}
                className="mt-10 w-[110px] sm:w-[130px]"
              >
                <Lottie animationData={scrollDown} loop autoplay />
              </motion.div>
            </motion.div>

            {/* PHASE 2: Grid + Lottie στο κέντρο */}
            <motion.div
              className="relative flex h-full items-center justify-center"
              style={{ opacity: gridOpacity, y: gridY }}
            >
              {/* Lottie στο κέντρο της διάταξης */}
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 w-[120px] sm:w-[140px]"
                style={{ opacity: midLottieOpacity, scale: midLottieScale }}
              >
                <div className="rounded-full bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                  <Lottie animationData={scrollDown} loop autoplay />
                </div>
              </motion.div>

              {/* GRID ΚΟΥΤΙΩΝ */}
              <CardsGrid cards={CARDS} masterProgress={prog} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- GRID ΚΑΙ ΚΟΥΤΙΑ ----------------------- */

function CardsGrid({
  cards,
  masterProgress,
}: {
  cards: Card[];
  masterProgress: MotionValue<number>;
}) {
  // Βασικό σημείο που αρχίζουν οι κάρτες
  const baseStart = 0.46;
  const step = 0.06; // πόσο “αργεί” η επόμενη κάρτα → πιο έντονο one-by-one

  return (
    <div className="about-grid">
      {cards.map((card, idx) => {
        const start = baseStart + idx * step;
        const end = start + 0.12;

        const opacity = useTransform(masterProgress, [start, end], [0, 1], {
          clamp: true,
        });
        const y = useTransform(masterProgress, [start, end], [30, 0], {
          clamp: true,
        });

        return (
          <motion.div
            key={card.id}
            style={{ opacity, y }}
            className="about-card-wrapper"
          >
            <AboutCard card={card} />
          </motion.div>
        );
      })}
    </div>
  );
}

function AboutCard({ card }: { card: Card }) {
  return (
    <article className="about-card">
      <h3 className="about-card-title">{card.title}</h3>
      <p className="about-card-body">{card.body}</p>
    </article>
  );
}
