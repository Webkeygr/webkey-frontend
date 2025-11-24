"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";

import scrollDown from "./scroll-down.json";

import "./AboutPhilosophy.css";

type CardData = {
  id: string;
  title: string;
  body: string;
};

const CARDS: CardData[] = [
  {
    id: "clarity",
    title: "Clarity first",
    body: "Δεν κρυβόμαστε πίσω από buzzwords. Ξεκινάμε με ξεκάθαρους στόχους: τι θέλεις να πετύχεις, με ποιο κοινό και σε ποιο χρονικό ορίζοντα. Ό,τι σχεδιάζουμε, υπηρετεί αυτό.",
  },
  {
    id: "design-purpose",
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

const SECTION_VH = 280;

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    mass: 0.2,
  });

  // -------- ΤΙΤΛΟΣ --------
  // Μεγάλο παράθυρο: fade in → μεγάλο hold → fade out
  const titleOpacity = useTransform(
    progress,
    [0.0, 0.08, 0.55, 0.75],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    progress,
    [0.0, 0.08, 0.55, 0.75],
    [30, 0, 0, -40]
  );

  // -------- LOTTIE ΜΕ ΤΟΝ ΤΙΤΛΟ --------
  const lottieOpacity = useTransform(
    progress,
    [0.02, 0.12, 0.55, 0.75],
    [0, 1, 1, 0]
  );
  const lottieScale = useTransform(
    progress,
    [0.02, 0.12, 0.55, 0.75],
    [0.7, 1, 1.05, 1.05]
  );
  const lottieY = useTransform(
    progress,
    [0.0, 0.12, 0.55, 0.75],
    [20, 0, 20, 40]
  );

  // -------- GRID ΚΑΡΤΩΝ --------
  const cardsOpacity = useTransform(progress, [0.55, 0.8], [0, 1]);
  const cardsY = useTransform(progress, [0.55, 0.8], [60, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="about-ph-wrapper sticky top-0 h-screen overflow-hidden">
        {/* Λευκό parallax layer */}
        <div className="about-ph-bg" />

        <div className="about-ph-inner">
          {/* Τίτλος + Lottie (πρώτη φάση) */}
          <motion.div
            className="about-ph-title-block"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <GlitchText
              speed={0.7}
              enableShadows={true}
              enableOnHover={false}
              className="about-glitch-title"
            >
              Ποιοι είμαστε
            </GlitchText>

            <motion.div
              style={{
                opacity: lottieOpacity,
                scale: lottieScale,
                y: lottieY,
              }}
              className="about-ph-lottie-wrapper"
            >
              <Lottie
                animationData={scrollDown}
                loop
                autoplay
                className="about-ph-lottie"
              />
            </motion.div>
          </motion.div>

          {/* Grid καρτών + Lottie στο κέντρο */}
          <motion.div
            className="about-ph-cards-layer"
            style={{ opacity: cardsOpacity, y: cardsY }}
          >
            <div className="about-ph-cards-wrapper">
              {/* Lottie στο κέντρο του grid */}
              <div className="about-ph-cards-lottie">
                <Lottie
                  animationData={scrollDown}
                  loop
                  autoplay
                  className="about-ph-lottie-center"
                />
              </div>

              <CardsGrid cards={CARDS} master={progress} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Cards grid + items ------------------------ */

function CardsGrid({ cards, master }: { cards: CardData[]; master: any }) {
  return (
    <div className="about-ph-grid">
      <CardItem card={cards[0]} index={0} master={master} />
      <CardItem card={cards[1]} index={1} master={master} />
      <CardItem card={cards[2]} index={2} master={master} />
      <CardItem card={cards[3]} index={3} master={master} />
    </div>
  );
}

function CardItem({
  card,
  index,
  master,
}: {
  card: CardData;
  index: number;
  master: any;
}) {
  // Κάθε κάρτα μπαίνει με offset για να έρχονται μία-μία
  const baseStart = 0.6 + index * 0.06;
  const baseEnd = baseStart + 0.1;

  const opacity = useTransform(master, [baseStart, baseEnd], [0, 1]);
  const y = useTransform(master, [baseStart, baseEnd], [30, 0]);

  return (
    <motion.article className="about-ph-card neon-card" style={{ opacity, y }}>
      <h3 className="about-ph-card-title">{card.title}</h3>
      <p className="about-ph-card-body">{card.body}</p>
    </motion.article>
  );
}
