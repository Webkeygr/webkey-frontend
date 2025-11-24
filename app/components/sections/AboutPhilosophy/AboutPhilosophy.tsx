"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import "./AboutPhilosophy.css";

type CardData = {
  title: string;
  text: string;
};

const CARDS: CardData[] = [
  {
    title: "Clarity first",
    text: "Δεν κρυβόμαστε πίσω από buzzwords. Ξεκινάμε με ξεκάθαρους στόχους: τι θέλεις να πετύχεις, με ποιο κοινό και σε ποιο χρονικό ορίζοντα. Ό,τι σχεδιάζουμε, υπηρετεί αυτό.",
  },
  {
    title: "Design με σκοπό",
    text: "Όμορφο χωρίς λειτουργικότητα δεν μας ενδιαφέρει. Σχεδιάζουμε εμπειρίες που οδηγούν τον επισκέπτη σε πράξη: να σου στείλει μήνυμα, να κλείσει ραντεβού, να αγοράσει, να σε θυμάται.",
  },
  {
    title: "Tech χωρίς φλυαρία",
    text: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε “πνίγουμε” με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
  },
  {
    title: "Σχέση, όχι project",
    text: "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”. Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλευούμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll για όλο το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  // Τίτλος: στο κέντρο, κρατάει αρκετό scroll
  const titleOpacity = useTransform(smooth, [0, 0.25, 0.4], [1, 1, 0]);
  const titleY = useTransform(smooth, [0, 0.4], ["0%", "-20%"]);

  // Lottie κάτω από τον τίτλο, και μετά στο κέντρο του grid
  const lottieOpacity = useTransform(smooth, [0.05, 0.25, 0.8], [1, 1, 0.9]);
  const lottieScale = useTransform(smooth, [0, 0.8], [1, 1.03]);
  const lottieY = useTransform(smooth, [0, 0.25, 0.8], ["40px", "60px", "0px"]);

  // Layout καρτών (συνολικό)
  const layoutOpacity = useTransform(smooth, [0.25, 0.4], [0, 1]);
  const layoutY = useTransform(smooth, [0.25, 0.6], ["80px", "0px"]);

  // Progress για να ανοίγουν οι κάρτες μία μία
  const cardsMaster = useTransform(smooth, [0.35, 0.95], [0, 1]);

  // Φόρτωμα Lottie από public (ΟΧΙ import σε json, για να μην σκάει το build)
  const [lottieData, setLottieData] = useState<any | null>(null);

  useEffect(() => {
    // Αν το αρχείο έχει άλλο όνομα, άλλαξε εδώ το path
    fetch("/lottie/scroll down.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch(() => {
        // Αν αποτύχει, απλά δεν δείχνουμε Lottie – δεν επηρεάζει το build
      });
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10">
      {/* Δίνουμε ύψος για scroll / parallax */}
      <div className="h-[220vh]">
        {/* FULLSCREEN λευκό panel που κολλάει */}
        <div className="about-panel">
          <div className="about-panel-inner">
            {/* Τίτλος στο κέντρο */}
            <motion.div
              style={{ opacity: titleOpacity, y: titleY }}
              className="text-center"
            >
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={false}
                className="about-title"
              >
                Ποιοι είμαστε
              </GlitchText>
            </motion.div>

            {/* Lottie κάτω από τον τίτλο, ανεξάρτητο από τις κάρτες */}
            {lottieData && (
              <motion.div
                style={{
                  opacity: lottieOpacity,
                  y: lottieY,
                  scale: lottieScale,
                }}
                className="about-lottie"
              >
                <Lottie
                  animationData={lottieData}
                  loop
                  autoplay
                  style={{ width: 150, height: 150 }}
                />
              </motion.div>
            )}

            {/* Layout καρτών + Lottie στο κέντρο τους */}
            <motion.div
              style={{ opacity: layoutOpacity, y: layoutY }}
              className="about-layout w-full max-w-6xl px-4 sm:px-8"
            >
              {/* Το ίδιο Lottie κάθεται στο κέντρο του grid */}
              {lottieData && (
                <motion.div
                  style={{ opacity: lottieOpacity, scale: lottieScale }}
                  className="about-lottie-center"
                >
                  <Lottie
                    animationData={lottieData}
                    loop
                    autoplay
                    style={{ width: 150, height: 150 }}
                  />
                </motion.div>
              )}

              {/* Grid 2x2 με μεγαλύτερα gaps */}
              <div className="about-cards-grid">
                {CARDS.map((card, index) => (
                  <CardItem
                    key={card.title}
                    card={card}
                    index={index}
                    master={cardsMaster}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

type CardItemProps = {
  card: CardData;
  index: number;
  master: MotionValue<number>;
};

function CardItem({ card, index, master }: CardItemProps) {
  // Κάθε κάρτα ξεκινάει λίγο πιο μετά από την προηγούμενη
  const start = index * 0.12;
  const end = start + 0.5;

  const local = useTransform(master, [start, end], [0, 1]);
  const opacity = useTransform(local, [0, 0.3, 1], [0, 0, 1]);
  const y = useTransform(local, [0, 1], [80, 0]);

  return (
    <motion.div style={{ opacity, y }} className="neon-card neon-card--active">
      <h3 className="mb-3 text-lg font-semibold text-slate-900 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-700">{card.text}</p>
    </motion.div>
  );
}

export default AboutPhilosophy;
