"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";

import "./AboutPhilosophy.css";

type Card = {
  title: string;
  body: string;
};

const CARDS: Card[] = [
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
  const [scrollLottie, setScrollLottie] = useState<any | null>(null);

  // Φόρτωμα Lottie από το public/lottie/scroll-down.json
  useEffect(() => {
    async function loadLottie() {
      try {
        const res = await fetch("/lottie/scroll-down.json");
        if (!res.ok) return;
        const json = await res.json();
        setScrollLottie(json);
      } catch (e) {
        console.error("Failed to load scroll-down lottie:", e);
      }
    }
    loadLottie();
  }, []);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Λευκό panel που «σέρνεται» προς τα πάνω και σκεπάζει το προηγούμενο content
  const panelY = useTransform(scrollYProgress, [0, 0.35], ["30vh", "0vh"]);

  // Τίτλος: εμφανίζεται αφού μπει το λευκό, μένει λίγο, μετά fade out
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.6, 0.8],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0.2, 0.35, 0.8], [20, 0, -30]);

  // Lottie: fade in λίγο μετά τον τίτλο, μετά μένει σταθερό (χωρίς fade out)
  const lottieOpacity = useTransform(scrollYProgress, [0.28, 0.42], [0, 1]);
  const lottieScale = useTransform(
    scrollYProgress,
    [0.28, 0.42, 1],
    [0.7, 1, 1]
  );

  // Όλο το grid καρτών
  const gridOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.5, 0.65], [80, 0]);

  // Stagger για κάθε κάρτα (ένα-ένα με διαφορά scroll)
  const card1Opacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const card2Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const card3Opacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const card4Opacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);

  const card1Y = useTransform(scrollYProgress, [0.55, 0.65], [40, 0]);
  const card2Y = useTransform(scrollYProgress, [0.6, 0.7], [40, 0]);
  const card3Y = useTransform(scrollYProgress, [0.65, 0.75], [40, 0]);
  const card4Y = useTransform(scrollYProgress, [0.7, 0.8], [40, 0]);

  const cardOpacities = [card1Opacity, card2Opacity, card3Opacity, card4Opacity];
  const cardYs = [card1Y, card2Y, card3Y, card4Y];

  return (
    <section
      id="about-philosophy"
      ref={sectionRef}
      className="about-section"
    >
      <div className="about-panel-wrap">
        <motion.div className="about-panel" style={{ y: panelY }}>
          {/* Τίτλος (glitch) */}
          <div className="about-heading-block">
            <motion.h2
              className="about-glitch-heading"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <GlitchText enableOnHover={false} enableShadows>
                Ποιοι είμαστε
              </GlitchText>
            </motion.h2>
          </div>

          {/* Grid: 4 κάρτες + Lottie στο κέντρο */}
          <motion.div
            className="about-grid"
            style={{ opacity: gridOpacity, y: gridY }}
          >
            {scrollLottie && (
              <motion.div
                className="about-lottie-center"
                style={{ opacity: lottieOpacity, scale: lottieScale }}
              >
                <Lottie
                  animationData={scrollLottie}
                  loop
                  autoplay
                  className="about-lottie"
                />
              </motion.div>
            )}

            {CARDS.map((card, index) => (
              <motion.div
                key={card.title}
                className={`about-card-outer about-card-pos-${
                  index + 1
                } philo-card-glow philo-card-glow-active`}
                style={{
                  opacity: cardOpacities[index],
                  y: cardYs[index],
                }}
              >
                <div className="about-card-inner">
                  <div className="about-card-title">{card.title}</div>
                  <div className="about-card-body">{card.body}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
