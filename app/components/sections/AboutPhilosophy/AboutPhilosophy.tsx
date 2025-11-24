"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import "./AboutPhilosophy.css";

type CardData = {
  title: string;
  body: string;
};

const CARDS: CardData[] = [
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
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε “πνίγουμε” με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελίγεται.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Δεν βλέπουμε τη δουλειά σαν “ένα project και τέλος”. Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress για ΟΛΟ το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Λίγο smoothing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.2,
  });

  // Τίτλος & πάνω Lottie – μένουν στο κέντρο και μετά κάνουν fade out
  const titleOpacity = useTransform(smoothProgress, [0, 0.18, 0.32], [1, 1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.32], [0, -40]);

  const lottieTopOpacity = useTransform(
    smoothProgress,
    [0, 0.18, 0.26],
    [1, 1, 0]
  );

  // Κάρτες & Lottie στο κέντρο του grid
  const cardsOpacity = useTransform(smoothProgress, [0.3, 0.55], [0, 1]);
  const cardsY = useTransform(smoothProgress, [0.3, 0.55], [40, 0]);

  const lottieCenterOpacity = useTransform(
    smoothProgress,
    [0.36, 0.46, 0.6],
    [0, 1, 1]
  );

  // Κάθε κάρτα να εμφανίζεται με διαφορετικό offset στο scroll (μία-μία)
  const cardOpacities = CARDS.map((_, index) =>
    useTransform(
      smoothProgress,
      [0.32 + index * 0.08, 0.44 + index * 0.08],
      [0, 1]
    )
  );

  const cardYs = CARDS.map((_, index) =>
    useTransform(
      smoothProgress,
      [0.32 + index * 0.08, 0.44 + index * 0.08],
      [30, 0]
    )
  );

  // Φόρτωμα Lottie από /public/lottie/scroll-down.json χωρίς imports
  const [scrollLottie, setScrollLottie] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/lottie/scroll-down.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setScrollLottie(data);
      })
      .catch(() => {
        // αν αποτύχει απλά δεν δείχνουμε Lottie
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-panel-wrap">
        <motion.div className="about-panel">
          {/* ΤΙΤΛΟΣ ΣΤΟ ΚΕΝΤΡΟ + LOTTIE ΑΠΟ ΚΑΤΩ */}
          <motion.div
            className="about-top"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <h2 className="about-glitch-heading">
              <GlitchText>Ποιοι είμαστε</GlitchText>
            </h2>

            {scrollLottie && (
              <motion.div
                className="about-lottie-top"
                style={{ opacity: lottieTopOpacity }}
              >
                <Lottie
                  animationData={scrollLottie}
                  loop
                  autoplay
                  style={{ width: 140, height: 140 }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* GRID ΜΕ ΤΙΣ ΚΑΡΤΕΣ ΣΤΟ ΚΕΝΤΡΟ + LOTTIE ΑΝΑΜΕΣΑ */}
          <div className="about-grid-wrapper">
            {scrollLottie && (
              <motion.div
                className="about-lottie-center"
                style={{ opacity: lottieCenterOpacity }}
              >
                <Lottie
                  animationData={scrollLottie}
                  loop
                  autoplay
                  style={{ width: 150, height: 150 }}
                />
              </motion.div>
            )}

            <motion.div
              className="about-grid"
              style={{ opacity: cardsOpacity, y: cardsY }}
            >
              {CARDS.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="about-card-outer philo-card-glow philo-card-glow-active"
                  style={{
                    opacity: cardOpacities[index],
                    y: cardYs[index],
                  }}
                >
                  <div className="about-card-inner">
                    <div className="about-card-title">{card.title}</div>
                    <div className="about-card-body">{card.body}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
