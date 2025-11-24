"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Lottie from "lottie-react";

import GlitchText from "./GlitchText";
import scrollDown from "./scroll-down.json";

import "./AboutPhilosophy.css";

type CardData = {
  title: string;
  body: string;
};

const CARDS: CardData[] = [
  {
    title: "Clarity first",
    body: "Δεν κρυβόμαστε πίσω από buzzwords. Ξεκινάμε με ξεκάθαρους στόχους: τι θέλεις να πετύχεις, με ποιο κοινό και σε ποιο χρονικό ορίζοντα. Ό,τι σχεδιάζουμε, υπηρετεί αυτό.",
  },
  {
    title: "Design με σκοπό",
    body: "Όμορφο χωρίς λειτουργικότητα δεν μας ενδιαφέρει. Σχεδιάζουμε εμπειρίες που οδηγούν τον επισκέπτη σε πράξη: να σου στείλει μήνυμα, να κλείσει ραντεβού, να αγοράσει, να σε θυμάται.",
  },
  {
    title: "Tech χωρίς φλυαρία",
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε “πνίγουμε” με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”. Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.2,
  });

  // Λευκό «σεντόνι» που ανεβαίνει από κάτω
  const panelY = useTransform(progress, [0, 0.25], [100, 0]);

  // Τίτλος + μεγάλο Lottie (πρώτη φάση)
  const titleOpacity = useTransform(
    progress,
    [0.08, 0.18, 0.45, 0.6],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    progress,
    [0.08, 0.18, 0.45, 0.6],
    [40, 0, 0, -40]
  );

  const lottieHeroOpacity = useTransform(
    progress,
    [0.12, 0.22, 0.42, 0.52],
    [0, 1, 1, 0]
  );

  // Grid phase – κάρτες + μικρό Lottie στο κέντρο
  const cardsOpacity = useTransform(
    progress,
    [0.52, 0.62, 0.74, 1],
    [0, 0, 1, 1]
  );
  const cardsY = useTransform(progress, [0.52, 0.7], [80, 0]);

  const lottieGridOpacity = useTransform(
    progress,
    [0.58, 0.68, 0.85, 1],
    [0, 1, 1, 1]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "300vh" }} // αρκετός χώρος για όλες τις φάσεις
    >
      {/* λίγο κενό πριν ξεκινήσει να ανεβαίνει το λευκό φόντο */}
      <div className="h-[10vh]" />

      {/* STICKY λευκό φόντο / καμβάς */}
      <motion.div className="about-panel-wrap" style={{ y: panelY }}>
        <div className="about-panel">
          {/* ΦΑΣΗ 1: Τίτλος + μεγάλο Lottie στο κέντρο */}
          <motion.div
            className="flex flex-col items-center gap-8"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={false}
              className="about-glitch-heading"
            >
              Ποιοι είμαστε
            </GlitchText>

            <motion.div style={{ opacity: lottieHeroOpacity }}>
              <Lottie
                animationData={scrollDown}
                loop
                autoplay
                style={{ width: 160, height: 160 }}
              />
            </motion.div>
          </motion.div>

          {/* ΦΑΣΗ 2: Grid με κάρτες + Lottie στο κέντρο */}
          <motion.div
            className="relative mt-16 flex items-center justify-center"
            style={{ opacity: cardsOpacity, y: cardsY }}
          >
            <CardsGrid cards={CARDS} master={progress} />

            {/* Lottie στο κέντρο των καρτών */}
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center z-30"
              style={{ opacity: lottieGridOpacity }}
            >
              <Lottie
                animationData={scrollDown}
                loop
                autoplay
                style={{ width: 130, height: 130 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* κενό από κάτω για να προλάβει να «ζήσει» το grid */}
      <div className="h-[80vh]" />
    </section>
  );
}

/* ----------------------------- ΚΑΡΤΕΣ ----------------------------- */

type CardsGridProps = {
  cards: CardData[];
  master: MotionValue<number>;
};

function CardsGrid({ cards, master }: CardsGridProps) {
  return (
    <div className="about-grid">
      {cards.map((card, index) => (
        <CardItem key={card.title} card={card} index={index} master={master} />
      ))}
    </div>
  );
}

type CardItemProps = {
  card: CardData;
  index: number;
  master: MotionValue<number>;
};

function CardItem({ card, index, master }: CardItemProps) {
  // κάθε κάρτα έχει λίγο διαφορετικό offset στο scroll
  const baseStart = 0.58;
  const perCardOffset = 0.06;

  const start = baseStart + index * perCardOffset;
  const end = start + 0.14;

  const opacity = useTransform(master, [start, end], [0, 1]);
  const y = useTransform(master, [start, end], [40, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="about-card-outer philo-card-glow philo-card-glow-active"
    >
      <div className="about-card-inner">
        <h3 className="about-card-title">{card.title}</h3>
        <p className="about-card-body">{card.body}</p>
      </div>
    </motion.div>
  );
}
