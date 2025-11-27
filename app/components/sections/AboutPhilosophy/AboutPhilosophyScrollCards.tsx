"use client";

import React, { useEffect, useState } from "react";
import "./AboutPhilosophyScrollCards.css";

type ScrollCard = {
  title: string;
  body: string;
};

const cards: ScrollCard[] = [
  {
    title: "Clarity first",
    body: "Ξεκινάμε από ξεκάθαρους στόχους, όχι από buzzwords και μόδες. Κάθε project έχει πολύ συγκεκριμένο «γιατί».",
  },
  {
    title: "Design με σκοπό",
    body: "Το design δεν είναι διακόσμηση. Είναι ο τρόπος που οδηγούμε τον επισκέπτη σε επόμενο βήμα: μήνυμα, ραντεβού, αγορά.",
  },
  {
    title: "Tech χωρίς φλυαρία",
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες, αλλά για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να εξελίσσεται.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Δεν θέλουμε ένα site και τέλος. Θέλουμε συνεργασία που ανανεώνεται, βελτιώνεται και μεγαλώνει μαζί σου.",
  },
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

const AboutPhilosophyScrollCards: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const bodyHasDark = document.body.classList.contains("about-dark");
      setIsDark(bodyHasDark);

      if (!bodyHasDark) return;

      const section = document.getElementById("about-philosophy");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Πόσο έχουμε “διανύσει” μέσα στο section
      const total = rect.height + vh;
      const offset = -rect.top;
      const progress = clamp01(offset / total);

      // Θέλουμε να προλάβουμε να δούμε όλες τις κάρτες
      // => τόσα swaps όσα (cards.length - 1), ώστε κάθε κάρτα να έρθει μπροστά μία φορά
      const visibleCards = cards.length;
      const totalSwaps = Math.max(visibleCards - 1, 1);

      const rawStep = Math.floor(progress * totalSwaps + 0.0001); // μικρό offset για να μην “κολλάει”
      const clampedStep = Math.min(Math.max(rawStep, 0), totalSwaps);

      setStep(clampedStep);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!isDark) return null;

  const visibleCards = cards.length;

  return (
    <div className="about-cards-overlay-center">
      <div className="about-cards-3d-stack">
        {cards.map((card, index) => {
          // 3D “σκάλα” – περιστρέφουμε το stack με βάση το step
          const relativeIndex =
            (index - (step % visibleCards) + visibleCards) % visibleCards;

          // 0 = μπροστά, 1 = λίγο πιο πίσω, κ.ο.κ.
          const distX = 80; // λίγο πιο “ανοιχτή” σκάλα οριζόντια
          const distY = 90; // λίγο πιο “ανοιχτή” σκάλα κάθετα
          const distZ = 160; // μεγαλύτερο βάθος για πιο έντονο 3D

          const x = relativeIndex * distX;
          const y = -relativeIndex * distY;
          const z = -relativeIndex * distZ;

          const opacity = 1 - relativeIndex * 0.18;
          const scale = 1 - relativeIndex * 0.05;

          return (
            <div
              key={card.title}
              className="about-card-3d"
              style={{
                transform: `
                  translate3d(${x}px, ${y}px, ${z}px)
                  translate(-50%, -50%)
                  scale(${scale})
                  skewY(-5deg)
                `,
                zIndex: visibleCards - relativeIndex,
                opacity: opacity,
              }}
            >
              <h3 className="about-card-3d-title">{card.title}</h3>
              <p className="about-card-3d-text">{card.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutPhilosophyScrollCards;
