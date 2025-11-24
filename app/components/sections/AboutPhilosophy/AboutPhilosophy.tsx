"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";

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
  const [scrollLottie, setScrollLottie] = useState<any | null>(null);

  // Φορτώνουμε το Lottie JSON από το /public/lottie/scroll-down.json
  useEffect(() => {
    async function loadLottie() {
      try {
        const res = await fetch("/lottie/scroll-down.json");
        if (!res.ok) return;
        const json = await res.json();
        setScrollLottie(json);
      } catch (e) {
        console.error("Failed to load scroll-down lottie:", e);
      }
    }
    loadLottie();
  }, []);

  return (
    <section id="about-philosophy" className="about-section">
      <div className="about-panel-wrap">
        <div className="about-panel">
          {/* ΤΙΤΛΟΣ + LOTTIE ΣΤΟ ΚΕΝΤΡΟ */}
          <div className="about-heading-block">
            <h2 className="about-glitch-heading">
              <GlitchText>Ποιοι είμαστε</GlitchText>
            </h2>

            {scrollLottie && (
              <div className="about-lottie-wrapper">
                <Lottie
                  animationData={scrollLottie}
                  loop
                  autoplay
                  className="about-lottie"
                />
              </div>
            )}
          </div>

          {/* GRID ΜΕ ΚΑΡΤΕΣ – στο κέντρο, με neon glow + stagger animation */}
          <div className="about-grid">
            {CARDS.map((card, index) => (
              <motion.div
                key={card.title}
                className="about-card-outer philo-card-glow philo-card-glow-active"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + index * 0.18,
                  ease: "easeOut",
                }}
              >
                <div className="about-card-inner">
                  <div className="about-card-title">{card.title}</div>
                  <div className="about-card-body">{card.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
