"use client";

import React, { useEffect, useRef, useState } from "react";
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

  // Mobile detection
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

  /* ===== ΤΙΤΛΟΣ & LOTTIE ===== */
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.22],
    [0, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0, 0.08, 0.22], [40, 0, -30]);

  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.1, 0.24],
    [0, 1, 0]
  );
  const lottieScale = useTransform(scrollYProgress, [0.02, 0.1], [0.8, 1]);

  /* ===== ΟΡΙΖΟΝΤΙΟ TRACK – πλήρες viewport ανά κάρτα ===== */
  const trackX = useTransform(
    scrollYProgress,
    [0.22, 0.4, 0.6, 0.8, 1],
    ["0vw", "-100vw", "-200vw", "-300vw", "-300vw"]
  );

  // Πρώτη κάρτα: fade-in + zoom-out στο κέντρο
  const firstCardScale = useTransform(scrollYProgress, [0.14, 0.22], [1.7, 1]);
  const firstCardOpacity = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);

  return (
    <section ref={sectionRef} id="about-philosophy" className="about-section">
      <div className="about-panel">
        {/* ---------- Τίτλος + Lottie στο κέντρο ---------- */}
        <div className="about-header">
          <motion.h2
            className="about-glitch-heading"
            style={
              isMobile
                ? {}
                : {
                    opacity: titleOpacity,
                    y: titleY,
                  }
            }
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
            className="about-lottie-wrap"
            style={
              isMobile
                ? {}
                : {
                    opacity: lottieOpacity,
                    scale: lottieScale,
                  }
            }
          >
            <Lottie
              animationData={scrollDownAnimation}
              loop
              autoplay
              className="about-lottie"
            />
          </motion.div>
        </div>

        {/* ---------- DESKTOP: sticky + horizontal scroll ---------- */}
        {!isMobile && (
          <div className="about-horizontal-wrapper">
            <motion.div
              className="about-horizontal-track"
              style={{ x: trackX }}
            >
              {CARDS.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="about-card-outer philo-card-glow philo-card-glow-active"
                  style={
                    index === 0
                      ? {
                          scale: firstCardScale,
                          opacity: firstCardOpacity,
                        }
                      : undefined
                  }
                >
                  <div className="about-card-inner">
                    <div className="about-card-title">{card.title}</div>
                    <div className="about-card-body">{card.body}</div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        )}

        {/* ---------- MOBILE: stacked cards ---------- */}
        {isMobile && (
          <div className="about-mobile-cards">
            {CARDS.map((card) => (
              <article
                key={card.title}
                className="about-mobile-card philo-card-glow philo-card-glow-active"
              >
                <div className="about-card-inner">
                  <div className="about-card-title">{card.title}</div>
                  <div className="about-card-body">{card.body}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
