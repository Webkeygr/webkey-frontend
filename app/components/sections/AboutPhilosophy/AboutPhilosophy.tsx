"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";

import scrollDownWhite from "@/app/lottie/scroll-down-white.json";
import GlitchText from "./GlitchText";

const philosophyCards = [
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

const AboutPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 0: όταν το πάνω του section φτάσει περίπου στο 70% του viewport
    // 1: όταν το κάτω του section φτάσει περίπου στο 20% του viewport
    offset: ["start 70%", "end 20%"],
  });

  // Τίτλος – εμφανίζεται, μένει λίγο, μετά σβήνει
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.32, 0.45],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.6],
    [40, 0, 0, -30]
  );

  // Μαύρος κύκλος – ξεκινάει ΜΕΤΑ τον τίτλο, μεγαλώνει μέχρι full screen
  const circleScale = useTransform(scrollYProgress, [0.3, 0.65], [0, 4.8]);
  const circleOpacity = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);

  // Κάρτες – εμφανίζονται αφού έχει σχεδόν γεμίσει η οθόνη μαύρο
  const cardsOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.6, 0.8], [60, 0]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      {/* Μεγάλο “scroll area” ώστε να έχουμε χώρο για όλο το animation */}
      <div className="about-scroll-area">
        {/* Sticky layer – ο κύκλος, ο τίτλος και οι κάρτες μένουν κολλημένα */}
        <div className="about-sticky-layer">
          {/* Μαύρος κύκλος που μεγαλώνει */}
          <motion.div
            className="about-black-circle"
            style={{ scale: circleScale, opacity: circleOpacity }}
          />

          {/* Τίτλος + Lottie (μένουν πάνω από τον κύκλο) */}
          <motion.div
            className="about-title-block"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <GlitchText className="about-title-glitch">
  ΠΟΙΟΙ ΕΙΜΑΣΤΕ
</GlitchText>

            <div className="about-lottie-wrapper">
              <Lottie
                animationData={scrollDownWhite}
                loop
                className="about-lottie"
              />
            </div>
          </motion.div>

          {/* Κεντρικό grid με τις κάρτες, μέσα στο μαύρο φόντο */}
          <motion.div
            className="about-cards-grid"
            style={{ opacity: cardsOpacity, y: cardsY }}
          >
            {philosophyCards.map((card) => (
              <div key={card.title} className="philo-card-outer">
                <div className="philo-card-glow">
                  <div className="philo-card-content">
                    <h3 className="philo-card-title">{card.title}</h3>
                    <p className="philo-card-body">{card.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophy;
