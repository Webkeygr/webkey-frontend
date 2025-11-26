"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";

import scrollDownDark from "@/app/lottie/scroll-down.json";
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
    offset: ["start 65%", "end 15%"],
  });

  /** Τίτλος – Fade In → Hold → Fade Out */
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.30, 0.42],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4],
    [40, 0, -20]
  );

  /** Μαύρος κύκλος που μεγαλώνει μέχρι Fullscreen */
  const circleScale = useTransform(scrollYProgress, [0.28, 0.65], [0, 6.2]);
  const circleOpacity = useTransform(scrollYProgress, [0.28, 0.32], [0, 1]);

  /** Lottie (μαύρο) που το “καταπίνει” ο κύκλος */
  const darkLottieOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.45],
    [1, 0]
  );

  /** Lottie (λευκό) που εμφανίζεται ΜΟΛΙΣ γίνει μαύρο */
  const whiteLottieOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.62],
    [0, 1]
  );

  /** Κάρτες — εμφανίζονται αφού γίνει Full Black */
  const cardsOpacity = useTransform(scrollYProgress, [0.62, 0.82], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.62, 0.82], [60, 0]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      <div className="about-scroll-area">
        <div className="about-sticky-layer">
          
          {/* Black expanding circle */}
          <motion.div
            className="about-black-circle"
            style={{ scale: circleScale, opacity: circleOpacity }}
          />

          {/* Title + Both Lotties */}
          <motion.div
            className="about-title-block"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <GlitchText
              className="about-title-glitch"
              speed={1.4}
              enableShadows={true}
              enableOnHover={false}
            >
              ΠΟΙΟΙ ΕΙΜΑΣΤΕ
            </GlitchText>

            <div className="about-lottie-wrapper">

              {/* Dark Lottie – φαίνεται μέχρι να το “καταπιεί” το circle */}
              <motion.div style={{ opacity: darkLottieOpacity }}>
                <Lottie animationData={scrollDownDark} loop className="about-lottie" />
              </motion.div>

              {/* White Lottie – εμφανίζεται όταν η οθόνη γίνει μαύρη */}
              <motion.div
                className="about-lottie-white"
                style={{ opacity: whiteLottieOpacity }}
              >
                <Lottie animationData={scrollDownWhite} loop className="about-lottie" />
              </motion.div>

            </div>
          </motion.div>

          {/* Cards */}
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
