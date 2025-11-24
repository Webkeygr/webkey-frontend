"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import scrollDown from "./scroll-down.json"; // ✅ ΣΩΣΤΟ import
import "./AboutPhilosophy.css";

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

  // Λευκό panel που ανεβαίνει (parallax) και «κάθεται» fullscreen
  const whiteY = useTransform(progress, [0, 0.4], [200, 0]);

  // Glitch τίτλος: fade in → λίγο χρόνο → fade out
  const titleOpacity = useTransform(progress, [0.12, 0.2, 0.32], [0, 1, 0]);
  const titleY = useTransform(progress, [0.12, 0.2, 0.32], [40, 0, -30]);

  // Lottie κάτω από τίτλο (φαίνεται ΜΟΝΟ στο πρώτο στάδιο)
  const topLottieOpacity = useTransform(
    progress,
    [0.16, 0.22, 0.28],
    [0, 1, 0]
  );
  const topLottieY = useTransform(progress, [0.16, 0.22, 0.28], [30, 0, -20]);

  // Lottie στο κέντρο των καρτών (φαίνεται ΜΟΝΟ όταν είναι οι κάρτες)
  const centerLottieOpacity = useTransform(
    progress,
    [0.3, 0.38, 0.95],
    [0, 1, 1]
  );

  return (
    <section
      ref={sectionRef}
      className="about-section relative w-full"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="about-panel relative flex h-full w-full items-center justify-center bg-white"
          style={{ y: whiteY }}
        >
          <div className="about-inner mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24">
            {/* GLITCH ΤΙΤΛΟΣ + ΠΡΩΤΟ LOTTIE */}
            <motion.div
              className="about-title-block flex flex-col items-center gap-10"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <GlitchText
                speed={0.9}
                enableShadows={true}
                enableOnHover={false}
                className="about-glitch-title"
              >
                Ποιοι είμαστε
              </GlitchText>

              <motion.div
                className="about-lottie-top"
                style={{ opacity: topLottieOpacity, y: topLottieY }}
              >
                <Lottie
                  animationData={scrollDown as unknown as object}
                  loop
                  autoplay
                  className="about-lottie-circle"
                />
              </motion.div>
            </motion.div>

            {/* GRID ΜΕ ΤΑ ΚΟΥΤΙΑ + ΚΕΝΤΡΙΚΟ LOTTIE */}
            <motion.div
              className="about-grid-wrapper relative mt-10 w-full md:mt-16"
              style={{ opacity: centerLottieOpacity }}
            >
              {/* Κεντρικό Lottie – έχει περισσότερο “αέρα” γύρω του */}
              <motion.div
                className="about-lottie-center"
                style={{ opacity: centerLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDown as unknown as object}
                  loop
                  autoplay
                  className="about-lottie-circle about-lottie-circle--small"
                />
              </motion.div>

              {/* Πλέγμα καρτών */}
              <div className="about-grid relative grid grid-cols-1 gap-x-12 gap-y-16 py-10 md:grid-cols-2 md:gap-y-20 lg:gap-y-24 lg:py-14">
                {CARDS.map((card, index) => (
                  <CardBlock
                    key={card.id}
                    card={card}
                    index={index}
                    master={progress}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CardBlock({
  card,
  index,
  master,
}: {
  card: CardData;
  index: number;
  master: MotionValue<number>;
}) {
  // Κάθε κάρτα εμφανίζεται με λίγο διαφορετικό offset στο scroll
  const baseStart = 0.42;
  const perCardOffset = 0.08;

  const start = baseStart + index * perCardOffset;
  const end = start + 0.18;

  const opacity = useTransform(master, [start, end], [0, 1]);
  const y = useTransform(master, [start, end], [45, 0]);

  return (
    <motion.article
      className="about-card"
      style={{
        opacity,
        y,
      }}
    >
      <h3 className="about-card-title">{card.title}</h3>
      <p className="about-card-body">{card.body}</p>
    </motion.article>
  );
}
