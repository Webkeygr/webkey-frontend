"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
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

  // Φορτώνουμε το ΛΕΥΚΟ scroll-down lottie από /public/lottie/scroll-down-white.json
  useEffect(() => {
    async function loadLottie() {
      try {
        const res = await fetch("/lottie/scroll-down-white.json");
        if (!res.ok) return;
        const json = await res.json();
        setScrollLottie(json);
      } catch (e) {
        console.error("Failed to load scroll-down-white lottie:", e);
      }
    }
    loadLottie();
  }, []);

  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // αρχίζει όταν μπαίνει στην οθόνη, τελειώνει όταν φύγει
  });

  // Κυκλάκι → μεγαλώνει μέχρι να γίνει full black
  const circleScale = useTransform(scrollYProgress, [0, 0.2, 0.6], [0.1, 1.4, 7]);

  // Τίτλος + Lottie: εμφανίζονται, μένουν λίγο, μετά fade out
  const headingOpacity = useTransform(scrollYProgress, [0, 0.08, 0.3], [0, 1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  // Κάρτες: εμφανίζονται αφού “σκοτεινιάσει” η οθόνη
  const cardsOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.35, 0.55], [60, 0]);

  // Εδώ αλλάζουμε το theme του header ΜΟΝΟ όσο είμαστε πάνω από το μαύρο section
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof document === "undefined") return;

    if (latest > 0.28 && latest < 0.95) {
      document.body.classList.add("dark-header");
    } else {
      document.body.classList.remove("dark-header");
    }
  });

  return (
    <section
      id="about-philosophy"
      className="about-section"
      ref={sectionRef as any}
    >
      <div className="about-panel-wrap">
        <div className="about-panel">
          {/* ΜΑΥΡΟ ΚΥΚΛΑΚΙ ΠΟΥ ΜΕΓΑΛΩΝΕΙ */}
          <motion.div
            className="about-circle"
            style={{ scale: circleScale }}
          />

          {/* ΤΙΤΛΟΣ + LOTTIE ΣΤΟ ΚΕΝΤΡΟ */}
          <motion.div
            className="about-heading-block"
            style={{ opacity: headingOpacity, y: headingY }}
          >
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
          </motion.div>

          {/* ΚΑΡΤΕΣ ΠΑΝΩ ΣΤΟ ΜΑΥΡΟ BACKGROUND */}
          <motion.div
            className="about-cards-block"
            style={{ opacity: cardsOpacity, y: cardsY }}
          >
            <div className="about-grid">
              {CARDS.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="about-card philo-card-glow philo-card-glow-active"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.4, once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 + index * 0.22,
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
