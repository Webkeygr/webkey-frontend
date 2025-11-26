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

  // Scroll mapping για το pinned / horizontal scroll στο desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Τίτλος & Lottie - ελαφρύ parallax / fade στο desktop
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.8, 1],
    [0, 1, 1, 0.7]
  );
  const titleY = useTransform(scrollYProgress, [0, 0.12, 0.8], [40, 0, -20]);
  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  const lottieScale = useTransform(scrollYProgress, [0.05, 0.2], [0.8, 1]);

  // Οριζόντιο track: από ένα μεγάλο card → οριζόντια κίνηση
  // 0.00–0.20: πρώτο card στο κέντρο, μεγάλο
  // 0.20–1.00: track κινείται αριστερά και περνάνε τα cards ένα-ένα
  const trackX = useTransform(scrollYProgress, [0.2, 1], ["0%", "-300%"]);

  // Πρώτη κάρτα — πιο μεγάλη στην αρχή, και σταδιακά normal
  const firstCardScale = useTransform(scrollYProgress, [0, 0.18], [1.5, 1]);

  return (
    <section ref={sectionRef} id="about-philosophy" className="about-section">
      <div className="about-panel">
        {/* ΤΙΤΛΟΣ + LOTTIE */}
        <div className="about-header">
          <motion.h2
            className="about-glitch-heading"
            style={isMobile ? {} : { opacity: titleOpacity, y: titleY }}
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
              isMobile ? {} : { opacity: lottieOpacity, scale: lottieScale }
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

        {/* DESKTOP: PINNED HORIZONTAL SCROLL */}
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
                        }
                      : {}
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

        {/* MOBILE: SIMPLE STACKED CARDS */}
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
