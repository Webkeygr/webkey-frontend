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

// ΝΕΟ: CardSwap
import CardSwap, { Card } from "./CardSwap";

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
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε πνίγουμε με τεχνικά. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Δεν βλέπουμε τη δουλειά σαν «ένα project και τέλος». Θέλουμε μακροχρόνια σχέση, βελτιώσεις, δοκιμές και εξέλιξη μαζί.",
  },
];

const AboutPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // scroll progress ΜΟΝΟ για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 20%"],
  });

  /* ------------------ ΤΙΤΛΟΣ + LOTTIE ------------------ */

  // Τίτλος: fade in → μικρή παύση → fade out λίγο πριν μπουν οι κάρτες
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.08, 0.35, 0.55],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0.0, 0.08, 0.55], [40, 0, -20]);

  // Χρωματιστό lottie (στην αρχή, πάνω στο λευκό background)
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.1, 0.4],
    [0, 1, 0]
  );

  // Λευκό lottie (όταν έχει πια γεμίσει με μαύρο)
  const whiteLottieOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.55, 0.8],
    [0, 1, 1]
  );

  /* ------------------ ΜΑΥΡΟΣ ΚΥΚΛΟΣ ------------------ */

  // Ξεκινάει λίγο μετά τον τίτλο, από “αόρατος” και γεμίζει όλο το viewport
  const circleScale = useTransform(scrollYProgress, [0.18, 0.75], [0, 5.5]);
  const circleOpacity = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);

  /* ------------------ ΚΑΡΤΕΣ ------------------ */

  // Εμφανίζονται όταν πλέον είναι πρακτικά μαύρο το φόντο
  const cardsOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.55, 0.8], [40, 0]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      {/* Μεγάλο “ύψος” για να δουλέψει το sticky animation */}
      <div className="about-scroll-area">
        {/* ΟΛΟ το περιεχόμενο είναι sticky και μένει στο κέντρο του viewport */}
        <div className="about-sticky">
          {/* Μαύρος κύκλος που μεγαλώνει */}
          <motion.div
            className="about-black-circle"
            style={{ scale: circleScale, opacity: circleOpacity }}
          />

          {/* Τίτλος + Lottie (πάντα στο κέντρο όσο κάνεις scroll) */}
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
              {/* Χρωματιστό lottie – αρχικά */}
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

              {/* Λευκό lottie – όταν έχει γίνει μαύρο */}
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

          {/* Κάρτες μέσα στο μαύρο φόντο – ΤΩΡΑ με CardSwap */}
          <motion.div
            className="about-cards-grid"
            style={{ opacity: cardsOpacity, y: cardsY }}
          >
            <CardSwap
              cardDistance={60}
              verticalDistance={70}
              delay={5000}
              pauseOnHover={false}
              width={420}
              height={260}
            >
              {philosophyCards.map((card) => (
                <Card key={card.title}>
                  <div className="philo-card-content">
                    <h3 className="philo-card-title">{card.title}</h3>
                    <p className="philo-card-body">{card.body}</p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophy;
