"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

// Κάνουμε το variants τύπου any για να μην γκρινιάζει το TS
const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: 0.18 + i * 0.16,
      // default ease από framer, δεν βάζουμε string "easeOut" για να μην μπερδεύει το TS
    },
  }),
};

export default function AboutPhilosophy() {
  const [scrollLottie, setScrollLottie] = useState<any | null>(null);

  // Φορτώνουμε το JSON από /public/lottie/scroll-down.json
  useEffect(() => {
    let isMounted = true;

    fetch("/lottie/scroll-down.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setScrollLottie(data);
      })
      .catch(() => {
        // αν αποτύχει, απλά δεν δείχνουμε Lottie
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="about-section">
      {/* sticky λευκό panel που ανεβαίνει και γίνεται fullscreen */}
      <div className="about-panel-wrap">
        <div className="about-panel">
          {/* ΤΙΤΛΟΣ ΣΤΟ ΚΕΝΤΡΟ + LOTTIE ΑΠΟ ΚΑΤΩ */}
          <div className="about-top">
            <h2 className="about-glitch-heading">
              <GlitchText>Ποιοι είμαστε</GlitchText>
            </h2>

            {scrollLottie && (
              <div className="about-lottie-top">
                <Lottie
                  animationData={scrollLottie}
                  loop
                  autoplay
                  style={{ width: 140, height: 140 }}
                />
              </div>
            )}
          </div>

          {/* GRID ΜΕ ΤΙΣ ΚΑΡΤΕΣ ΣΤΟ ΚΕΝΤΡΟ + LOTTIE ΣΤΗ ΜΕΣΗ ΤΟΥ GRID */}
          <div className="about-grid-wrapper">
            {scrollLottie && (
              <div className="about-lottie-center">
                <Lottie
                  animationData={scrollLottie}
                  loop
                  autoplay
                  style={{ width: 150, height: 150 }}
                />
              </div>
            )}

            <motion.div
              className="about-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              {CARDS.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="about-card-outer philo-card-glow philo-card-glow-active"
                  variants={cardVariants}
                  custom={index}
                >
                  <div className="about-card-inner">
                    <div className="about-card-title">{card.title}</div>
                    <div className="about-card-body">{card.body}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
