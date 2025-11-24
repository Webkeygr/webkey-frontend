"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import scrollDown from "@/public/lottie/scroll-down.json";

import "./AboutPhilosophy.css";

type CardData = {
  id: string;
  title: string;
  body: string[];
};

const CARDS: CardData[] = [
  {
    id: "clarity",
    title: "Clarity first",
    body: [
      "Δεν κρυβόμαστε πίσω από buzzwords.",
      "Ξεκινάμε με ξεκάθαρους στόχους: τι θέλεις να πετύχεις, με ποιο κοινό και σε ποιο χρονικό ορίζοντα.",
      "Ό,τι σχεδιάζουμε, υπηρετεί αυτό.",
    ],
  },
  {
    id: "design-purpose",
    title: "Design με σκοπό",
    body: [
      "Όμορφο χωρίς λειτουργικότητα δεν μας ενδιαφέρει.",
      "Σχεδιάζουμε εμπειρίες που οδηγούν τον επισκέπτη σε πράξη:",
      "να σου στείλει μήνυμα, να κλείσει ραντεβού, να αγοράσει, να σε θυμάται.",
    ],
  },
  {
    id: "tech-no-noise",
    title: "Tech χωρίς φλυαρία",
    body: [
      "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κλπ.),",
      "αλλά δεν σε “πνίγουμε” με τεχνικές λεπτομέρειες.",
      "Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
    ],
  },
  {
    id: "relationship",
    title: "Σχέση, όχι project",
    body: [
      "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”.",
      "Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε,",
      "να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
    ],
  },
];

export default function AboutPhilosophy() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  // Γενικό progress (με ελατήριο για πιο smooth κίνηση)
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    mass: 0.25,
  });

  // Το λευκό panel να ανεβαίνει λίγο (parallax)
  const panelY = useTransform(progress, [0, 0.25], ["20vh", "0vh"]);

  // Τίτλος – να κάθεται στη μέση για λίγο
  const titleOpacity = useTransform(progress, [0.0, 0.12, 0.32], [0, 1, 0]);
  const titleY = useTransform(progress, [0.0, 0.12, 0.32], [40, 0, -40]);

  // Lottie κάτω από τον τίτλο (ίδιο παράθυρο με τον τίτλο)
  const lottieOpacityTop = useTransform(
    progress,
    [0.02, 0.14, 0.32],
    [0, 1, 0]
  );
  const lottieScaleTop = useTransform(
    progress,
    [0.02, 0.14, 0.32],
    [0.6, 1, 0.8]
  );
  const lottieYTop = useTransform(progress, [0.02, 0.14, 0.32], [30, 0, -20]);

  return (
    <section ref={rootRef} className="about-philo-section">
      {/* Λίγος αέρας πριν ξεκινήσει το sticky fullscreen */}
      <div className="philo-spacer" />

      {/* FULLSCREEN λευκό φόντο που κολλάει (sticky) */}
      <motion.div className="philo-overlay" style={{ y: panelY }}>
        <div className="philo-inner">
          {/* ΤΙΤΛΟΣ + LOTTIE ΣΤΟ ΚΕΝΤΡΟ */}
          <motion.div
            className="philo-title-block"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={false}
              className="philo-title"
            >
              Ποιοι είμαστε
            </GlitchText>

            <motion.div
              className="philo-lottie-top"
              style={{
                opacity: lottieOpacityTop,
                scale: lottieScaleTop,
                y: lottieYTop,
              }}
            >
              <Lottie
                animationData={scrollDown}
                loop
                autoplay
                style={{ width: 140, height: 140 }}
              />
            </motion.div>
          </motion.div>

          {/* GRID ΜΕ LOTTIE ΣΤΗ ΜΕΣΗ + ΚΑΡΤΕΣ */}
          <div className="philo-grid-wrapper">
            <CardsGrid cards={CARDS} master={progress} />

            {/* Lottie στο κέντρο των καρτών – πάντα εμφανές όταν υπάρχουν κάρτες */}
            <motion.div className="philo-lottie-center">
              <Lottie
                animationData={scrollDown}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Λίγος αέρας αφού τελειώσει το section */}
      <div className="philo-spacer-bottom" />
    </section>
  );
}

function CardsGrid({
  cards,
  master,
}: {
  cards: CardData[];
  master: MotionValue<number>;
}) {
  return (
    <div className="philo-grid">
      {cards.map((card, index) => (
        <PhiloCard key={card.id} card={card} index={index} master={master} />
      ))}
    </div>
  );
}

function PhiloCard({
  card,
  index,
  master,
}: {
  card: CardData;
  index: number;
  master: MotionValue<number>;
}) {
  // Κάθε κάρτα ενεργοποιείται λίγο πιο μετά από την προηγούμενη
  const baseStart = 0.38;
  const step = 0.1;
  const start = baseStart + index * step;
  const end = start + 0.22;

  const opacity = useTransform(master, [start, end], [0, 1]);
  const y = useTransform(master, [start, end], [40, 0]);
  const glowIntensity = useTransform(master, [start, end], [0, 1]);

  return (
    <motion.div
      className="philo-card"
      style={
        {
          opacity,
          y,
          // CSS variable για το neon glow
          "--glow-alpha": glowIntensity,
        } as any
      }
    >
      <div className="philo-card-content">
        <h3 className="philo-card-title">{card.title}</h3>
        {card.body.map((line, i) => (
          <p key={i} className="philo-card-text">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
