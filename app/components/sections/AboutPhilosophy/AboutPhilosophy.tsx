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

  // parallax + fade in / fade out για το intro κομμάτι
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.6, 0.9],
    [0, 1, 1, 0]
  );

  const introTranslateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [40, 0, -80]
  );

  return (
    <section
      ref={sectionRef}
      id="about-philosophy"
      className="about-philosophy-section"
    >
      {/* Intro block με λευκό background, 100vh, parallax + fade */}
      <div className="about-philosophy-intro-wrap">
        <motion.div
          className="about-philosophy-intro-panel"
          style={{ opacity: introOpacity, y: introTranslateY }}
        >
          <div className="about-philosophy-intro-inner">
            <h2 className="about-philosophy-intro-heading">
              <GlitchText
                enableOnHover={false}
                enableShadows
                speed={1.05}
                className="about-philosophy-glitch-heading"
              >
                Ποιοι είμαστε
              </GlitchText>
            </h2>

            <div className="about-philosophy-intro-lottie">
              <Lottie
                animationData={scrollDownAnimation}
                loop
                autoplay
                className="about-philosophy-intro-lottie-el"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid με 4 κάρτες γύρω από Lottie στο κέντρο */}
      <section className="about-philosophy-grid-section">
        <div className="about-philosophy-grid-shell">
          <div className="about-philosophy-grid">
            {CARDS.map((card, index) => (
              <motion.article
                key={card.title}
                className={`about-card about-card-${index + 1}`}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
              >
                <div className="about-card-inner">
                  <h3 className="about-card-title">{card.title}</h3>
                  <p className="about-card-body">{card.body}</p>
                </div>
              </motion.article>
            ))}

            <motion.div
              className="about-philosophy-grid-lottie-center"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <Lottie
                animationData={scrollDownAnimation}
                loop
                autoplay
                className="about-philosophy-grid-lottie-el"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
}
