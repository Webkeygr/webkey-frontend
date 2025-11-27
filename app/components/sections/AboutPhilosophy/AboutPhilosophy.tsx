"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";

import "./AboutPhilosophy.css";
import GlitchText from "./GlitchText";

// Χρησιμοποιούμε το κλασικό scroll-down (στο άσπρο φόντο)
import scrollDown from "@/app/lottie/scroll-down.json";

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
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 0 όταν το section μπαίνει στο viewport, 1 όταν βγει
    offset: ["start 70%", "end 20%"],
  });

  // Ο τίτλος: fade in, μένει λίγο, μετά fade out προς τα πάνω
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.55],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.6],
    [40, 0, 0, -40]
  );

  // Μαύρος κύκλος – μικρή βούλα στην αρχή, γεμίζει την οθόνη
  const circleScale = useTransform(scrollYProgress, [0.25, 0.9], [0.15, 6]);

  // Κάρτες – εμφανίζονται όταν σχεδόν έχει γεμίσει μαύρο
  const cardsOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.7, 0.95], [60, 0]);

  return (
    <section
      id="about-philosophy"
      className="about-section"
      ref={sectionRef}
    >
      {/* Μεγάλο vertical “ταξίδι” για το scroll animation */}
      <div className="about-scroll-area">
        {/* Ό,τι βλέπεις (τίτλος, κύκλος, κάρτες) μένει sticky */}
        <div className="about-sticky-layer">
          {/* Μαύρη βούλα που μεγαλώνει */}
          <motion.div
            className="about-black-circle"
            style={{ scale: circleScale }}
          />

          {/* Τίτλος + Lottie στο κέντρο της οθόνης */}
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
              <Lottie
                animationData={scrollDown}
                loop
                className="about-lottie"
              />
            </div>
          </motion.div>

          {/* Κάρτες μέσα στο μαύρο φόντο */}
          <motion.div
            className="about-cards-grid"
            style={{ opacity: cardsOpacity, y: cardsY }}
          >
            {philosophyCards.map((card) => (
              <article key={card.title} className="philo-card">
                <h3 className="philo-card-title">{card.title}</h3>
                <p className="philo-card-body">{card.body}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophy;
