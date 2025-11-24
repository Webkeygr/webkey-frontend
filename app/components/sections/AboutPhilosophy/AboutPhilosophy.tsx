"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useMotionValueEvent,
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
    text: "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”. Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress για ΟΛΟ το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  // Τίτλος – στο κέντρο και κρατάει για αρκετό scroll
  const titleOpacity = useTransform(smoothProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.6], ["0%", "-18%"]);

  // Lottie: ξεκινά κάτω από τον τίτλο και καταλήγει στο κέντρο των καρτών
  const lottieOpacity = useTransform(
    smoothProgress,
    [0.05, 0.25, 0.7],
    [1, 1, 0.95]
  );
  const lottieScale = useTransform(smoothProgress, [0, 0.7], [1, 1.02]);
  const lottieY = useTransform(
    smoothProgress,
    [0, 0.3, 0.7],
    ["-80px", "0px", "20px"] // πιο κοντά στον τίτλο στην αρχή, μετά κέντρο grid
  );

  // Πόσο “ανοίγει” συνολικά το grid καρτών
  const cardsMaster = useTransform(smoothProgress, [0.35, 0.95], [0, 1]);
  const cardsWrapperOpacity = useTransform(
    smoothProgress,
    [0.38, 0.48],
    [0, 1]
  );

  // Φόρτωμα Lottie από το public/lottie (ΧΩΡΙΣ import για να μη σκάει το build)
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
        {/* FULLSCREEN λευκό panel που κολλάει (parallax / sticky) */}
        <div className="about-panel">
          <div className="about-panel-inner">
            {/* Τίτλος με glitch, στο κέντρο του viewport */}
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

            {/* Grid + Lottie */}
            <motion.div
              style={{ opacity: cardsWrapperOpacity }}
              className="relative mt-16 w-full max-w-6xl px-4 sm:px-8"
            >
              {/* Lottie στο κέντρο των 4 καρτών */}
              {lottieData && (
                <motion.div
                  style={{
                    opacity: lottieOpacity,
                    y: lottieY,
                    scale: lottieScale,
                  }}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                >
                  <Lottie
                    animationData={lottieData}
                    loop
                    autoplay
                    style={{ width: 150, height: 150 }}
                  />
                </motion.div>
              )}

              {/* 4 κάρτες σε 2x2 grid */}
              <div className="grid gap-10 md:grid-cols-2">
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
  // Κάθε κάρτα ανοίγει λίγο πιο αργά από την προηγούμενη
  const baseStart = 0.0 + index * 0.12;
  const baseEnd = baseStart + 0.4;

  const localProgress = useTransform(master, [baseStart, baseEnd], [0, 1]);

  const opacity = useTransform(localProgress, [0, 0.2, 1], [0, 0, 1]);
  const translateY = useTransform(localProgress, [0, 1], [80, 0]);

  const [active, setActive] = useState(false);

  // Όταν η κάρτα “γεμίσει” (γύρω στο 90%), ανοίγουμε το neon glow
  useMotionValueEvent(localProgress, "change", (v) => {
    if (!active && v > 0.9) {
      setActive(true);
    }
  });

  return (
    <motion.div
      style={{ opacity, y: translateY }}
      className={`neon-card ${active ? "neon-card--active" : ""}`}
    >
      <h3 className="mb-3 text-lg font-semibold text-slate-900 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-700">{card.text}</p>
    </motion.div>
  );
}

export default AboutPhilosophy;
