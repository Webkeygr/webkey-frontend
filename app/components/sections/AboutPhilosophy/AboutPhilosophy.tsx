"use client";

import React, { useRef } from "react";
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Λευκό panel που ανεβαίνει (parallax)
  const panelY = useTransform(scrollYProgress, [0, 0.35], ["20vh", "0vh"]);

  // Τίτλος – εμφανίζεται μετά το background, μένει λίγο, μετά σβήνει
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.28, 0.6, 0.8],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0.12, 0.28, 0.8],
    [24, 0, -20]
  );

  // Lottie – εμφανίζεται λίγο μετά τον τίτλο και μένει ορατό
  const lottieOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const lottieScale = useTransform(scrollYProgress, [0.2, 0.35], [0.85, 1]);

  // Grid καρτών – συνολική εμφάνιση
  const gridOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.55, 0.7], [80, 0]);

  // Stagger per card – ΜΕΓΑΛΥΤΕΡΗ ΚΑΘΥΣΤΕΡΗΣΗ ΜΕΤΑΞΥ ΤΟΥΣ
  const card1Opacity = useTransform(scrollYProgress, [0.58, 0.7], [0, 1]);
  const card2Opacity = useTransform(scrollYProgress, [0.72, 0.84], [0, 1]);
  const card3Opacity = useTransform(scrollYProgress, [0.86, 0.98], [0, 1]);
  const card4Opacity = useTransform(scrollYProgress, [0.92, 1], [0, 1]);

  const card1Y = useTransform(scrollYProgress, [0.58, 0.7], [40, 0]);
  const card2Y = useTransform(scrollYProgress, [0.72, 0.84], [40, 0]);
  const card3Y = useTransform(scrollYProgress, [0.86, 0.98], [40, 0]);
  const card4Y = useTransform(scrollYProgress, [0.92, 1], [40, 0]);

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
          {/* Κεντρικό layer: τίτλος + Lottie στο κέντρο */}
          <div className="about-center-layer">
            <motion.h2
              className="about-glitch-heading"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <GlitchText
                enableOnHover={false}
                enableShadows
                className="about-glitch-inner"
              >
                Ποιοι Είμαστε
              </GlitchText>
            </motion.h2>

            <motion.div
              className="about-center-lottie"
              style={{ opacity: lottieOpacity, scale: lottieScale }}
            >
              <Lottie
                animationData={scrollDownAnimation}
                loop
                autoplay
                className="about-lottie"
              />
            </motion.div>
          </div>

          {/* Overlay grid με τις κάρτες γύρω από το Lottie */}
          <motion.div
            className="about-grid-overlay"
            style={{ opacity: gridOpacity, y: gridY }}
          >
            {CARDS.map((card, index) => (
              <motion.article
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
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
