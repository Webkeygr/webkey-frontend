"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import scrollDownAnimation from "./scroll-down.json";

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
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 915);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ---------------------------------------------------------
     DESKTOP RANGES (UNCHANGED)
     --------------------------------------------------------- */
  const desktop = {
    panelY: useTransform(scrollYProgress, [0, 0.35], ["20vh", "0vh"]),
    titleOpacity: useTransform(scrollYProgress, [0.12, 0.28, 0.6, 0.8], [0, 1, 1, 0]),
    titleY: useTransform(scrollYProgress, [0.12, 0.28, 0.8], [24, 0, -20]),
    lottieOpacity: useTransform(scrollYProgress, [0.2, 0.35], [0, 1]),
    lottieScale: useTransform(scrollYProgress, [0.2, 0.35], [0.85, 1]),

    gridOpacity: useTransform(scrollYProgress, [0.55, 0.7], [0, 1]),
    gridY: useTransform(scrollYProgress, [0.55, 0.7], [80, 0]),

    cardRanges: [
      [0.56, 0.64],
      [0.66, 0.74],
      [0.76, 0.84],
      [0.86, 0.94],
    ],
  };

  /* ---------------------------------------------------------
     MOBILE RANGES (NEW – MEDIUM PAUSE ~1.5 scrolls)
     --------------------------------------------------------- */

  // Τίτλος + Lottie μένουν στο κέντρο ΠΟΛΥ περισσότερο
  const mobile = {
    panelY: useTransform(scrollYProgress, [0, 0.45], ["25vh", "0vh"]),

    // TITLE stays longer
    titleOpacity: useTransform(scrollYProgress, [0.10, 0.35, 0.85, 1.2], [0, 1, 1, 0]),
    titleY: useTransform(scrollYProgress, [0.10, 0.35, 1.2], [40, 0, -30]),

    // LOTTIE also stays very long
    lottieOpacity: useTransform(scrollYProgress, [0.18, 0.40], [0, 1]),
    lottieScale: useTransform(scrollYProgress, [0.18, 0.40], [0.75, 1]),

    // Cards start MUCH later (after the big pause)
    gridOpacity: useTransform(scrollYProgress, [0.90, 1.10], [0, 1]),
    gridY: useTransform(scrollYProgress, [0.90, 1.10], [120, 0]),

    // Cards stacked — each one enters faster (but after a long intro)
    cardRanges: [
      [0.95, 1.05], // Card 1
      [1.10, 1.19], // Card 2
      [1.22, 1.32], // Card 3
      [1.34, 1.44], // Card 4
    ],
  };

  const active = isMobile ? mobile : desktop;

  const cardTransforms = active.cardRanges.map(([start, end]) => ({
    opacity: useTransform(scrollYProgress, [start, end], [0, 1]),
    y: useTransform(scrollYProgress, [start, end], [40, 0]),
  }));

  return (
    <section ref={sectionRef} id="about-philosophy" className="about-section">
      <div className="about-panel-wrap">
        <motion.div className="about-panel" style={{ y: active.panelY }}>
          <div className="about-center-layer">
            <motion.h2
              className="about-glitch-heading"
              style={{ opacity: active.titleOpacity, y: active.titleY }}
            >
              <GlitchText enableOnHover={false} enableShadows className="about-glitch-inner">
                Ποιοι Είμαστε
              </GlitchText>
            </motion.h2>

            <motion.div
              className="about-center-lottie"
              style={{ opacity: active.lottieOpacity, scale: active.lottieScale }}
            >
              <Lottie animationData={scrollDownAnimation} loop autoplay className="about-lottie" />
            </motion.div>
          </div>

          <motion.div className="about-grid-overlay" style={{ opacity: active.gridOpacity, y: active.gridY }}>
            {CARDS.map((card, index) => (
              <motion.article
                key={card.title}
                className={`about-card-outer about-card-pos-${index + 1} philo-card-glow philo-card-glow-active`}
                style={{
                  opacity: cardTransforms[index].opacity,
                  y: cardTransforms[index].y,
                }}
              >
                <div className="about-card-inner">
                  <div className="about-card-title">{card.title}</div>
                  <div className="about-card-body">{card.body}</div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
