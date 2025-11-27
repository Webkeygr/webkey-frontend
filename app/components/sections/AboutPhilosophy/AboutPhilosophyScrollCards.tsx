"use client";

import { useEffect, useState } from "react";
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

const AboutPhilosophyScrollCards = () => {
  const [isDark, setIsDark] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // 1) Εμφανίζουμε τις κάρτες ΜΟΝΟ όταν το body έχει about-dark
      const bodyHasDark = document.body.classList.contains("about-dark");
      setIsDark(bodyHasDark);

      if (!bodyHasDark) return;

      // 2) Υπολογίζουμε progress μέσα στο section #about-philosophy
      const section = document.getElementById("about-philosophy");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // offset: πόσο έχουμε «μπει» μέσα στο section
      const total = rect.height + vh;
      const offset = -rect.top; // όταν top = 0 είμαστε στην αρχή του section

      const progress = clamp01(offset / total);

      const segments = cards.length;
      const newIndex = Math.min(
        segments - 1,
        Math.max(0, Math.floor(progress * segments))
      );

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeIndex]);

  // Όσο δεν είναι μαύρο το background, δεν δείχνουμε τίποτα
  if (!isDark) return null;

  return (
    <div className="about-cards-overlay-center">
      <div className="about-card-stack">
        {cards.map((card, index) => (
          <div
            key={card.title}
            className={`about-card-panel ${
              index === activeIndex ? "is-active" : "is-inactive"
            }`}
          >
            <h3 className="about-card-title">{card.title}</h3>
            <p className="about-card-text">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPhilosophyScrollCards;
