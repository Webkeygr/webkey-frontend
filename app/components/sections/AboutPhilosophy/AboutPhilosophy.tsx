"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";

import "./AboutPhilosophy.css";

// Lotties
import scrollDownColor from "@/app/lottie/scroll-down.json";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

// Glitch τίτλος
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
    offset: ["start 70%", "end 20%"],
  });

  /* ------------------ ΤΙΤΛΟΣ + LOTTIE ------------------ */

  const titleOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.08, 0.35, 0.55],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0.0, 0.08, 0.55],
    [40, 0, -20]
  );

  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.1, 0.4],
    [0, 1, 0]
  );

  const whiteLottieOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.55, 0.8],
    [0, 1, 1]
  );

  /* ------------------ ΜΑΥΡΟΣ ΚΥΚΛΟΣ ------------------ */
  // ⬇️ μεγαλώνουμε το range & το τελικό scale για ultrawide / 4K
  const circleScale = useTransform(scrollYProgress, [0.18, 0.9], [0, 7]);
  const circleOpacity = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);

  /* ------------------ ΚΑΡΤΕΣ ------------------ */
  // τις πάμε λίγο πιο “αργά” ώστε να εμφανιστούν όταν το μαύρο έχει γεμίσει
  const cardsOpacity = useTransform(scrollYProgress, [0.65, 0.9], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.65, 0.9], [40, 0]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      <div className="about-scroll-area">
        <div className="about-sticky">
          {/* Μαύρος κύκλος */}
          <motion.div
            className="about-black-circle"
            style={{ scale: circleScale, opacity: circleOpacity }}
          />

          {/* Τίτλος + lottie sticky στο κέντρο */}
          <motion.div
            className="about-title-block"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <GlitchText
              className="about-title-glitch"
              speed={1.4}
              enableShadows
              enableOnHover={false}
            >
              ΠΟΙΟΙ ΕΙΜΑΣΤΕ
            </GlitchText>

            <div className="about-lottie-wrapper">
              <motion.div
                className="about-lottie-layer"
                style={{ opacity: colorLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownColor}
                  loop
                  className="about-lottie"
                />
              </motion.div>

              <motion.div
                className="about-lottie-layer"
                style={{ opacity: whiteLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownWhite}
                  loop
                  className="about-lottie"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Κάρτες μέσα στο μαύρο */}
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
