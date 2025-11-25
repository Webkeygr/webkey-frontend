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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 915);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ---------------------- DESKTOP TRANSFORMS ---------------------- */

  const panelY = useTransform(scrollYProgress, [0, 0.35], ["20vh", "0vh"]);

  const titleOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.28, 0.6, 0.8],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0.12, 0.28, 0.8], [24, 0, -20]);

  const lottieOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const lottieScale = useTransform(scrollYProgress, [0.2, 0.35], [0.85, 1]);

  const gridOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.55, 0.7], [80, 0]);

  const cardRanges = [
    [0.56, 0.64],
    [0.66, 0.74],
    [0.76, 0.84],
    [0.86, 0.94],
  ];

  const cardsOpacity = cardRanges.map(([s, e]) =>
    useTransform(scrollYProgress, [s, e], [0, 1])
  );
  const cardsY = cardRanges.map(([s, e]) =>
    useTransform(scrollYProgress, [s, e], [40, 0])
  );

  /* ---------------------- MOBILE TRANSFORMS ---------------------- */

  const mobileTitleOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.20, 0.45, 0.55],
    [0, 1, 1, 0]
  );
  const mobileTitleY = useTransform(
    scrollYProgress,
    [0.05, 0.20, 0.55],
    [40, 0, -20]
  );

  const mobileLottieOpacity = useTransform(scrollYProgress, [0.10, 0.28], [0, 1]);
  const mobileLottieScale = useTransform(scrollYProgress, [0.10, 0.28], [0.70, 1]);

  return (
    <section ref={sectionRef} id="about-philosophy" className="about-section">

      {/* ---------------------- MOBILE INTRO (STICKY) ---------------------- */}
      {isMobile && (
        <div className="about-mobile-intro">
          <motion.h2
            className="about-glitch-heading"
            style={{ opacity: mobileTitleOpacity, y: mobileTitleY }}
          >
            <GlitchText enableOnHover={false} enableShadows className="about-glitch-inner">
              Ποιοι Είμαστε
            </GlitchText>
          </motion.h2>

          <motion.div
            className="about-center-lottie"
            style={{ opacity: mobileLottieOpacity, scale: mobileLottieScale }}
          >
            <Lottie animationData={scrollDownAnimation} loop autoplay className="about-lottie" />
          </motion.div>
        </div>
      )}

      {/* ---------------------- MOBILE CARDS (NORMAL FLOW) ---------------------- */}
      {isMobile && (
        <div className="about-mobile-cards">
          {CARDS.map((card, index) => (
            <div key={card.title} className="about-mobile-card philo-card-glow philo-card-glow-active">
              <div className="about-card-inner">
                <div className="about-card-title">{card.title}</div>
                <div className="about-card-body">{card.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------ DESKTOP FULL CINEMATIC ------------------------ */}
      {!isMobile && (
        <div className="about-panel-wrap">
          <motion.div className="about-panel" style={{ y: panelY }}>

            <div className="about-center-layer">
              <motion.h2 className="about-glitch-heading" style={{ opacity: titleOpacity, y: titleY }}>
                <GlitchText enableOnHover={false} enableShadows className="about-glitch-inner">
                  Ποιοι Είμαστε
                </GlitchText>
              </motion.h2>

              <motion.div
                className="about-center-lottie"
                style={{ opacity: lottieOpacity, scale: lottieScale }}
              >
                <Lottie animationData={scrollDownAnimation} loop autoplay className="about-lottie" />
              </motion.div>
            </div>

            <motion.div className="about-grid-overlay" style={{ opacity: gridOpacity, y: gridY }}>
              {CARDS.map((card, index) => (
                <motion.article
                  key={card.title}
                  className={`about-card-outer about-card-pos-${index + 1} philo-card-glow philo-card-glow-active`}
                  style={{ opacity: cardsOpacity[index], y: cardsY[index] }}
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
      )}
    </section>
  );
}
