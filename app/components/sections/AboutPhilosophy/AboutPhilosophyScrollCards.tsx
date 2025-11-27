"use client";

import React, { useEffect, useRef, useState } from "react";
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

const AboutPhilosophyScrollCards: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState(0);

  // Από πού ξεκινήσαμε να “μετράμε” scroll όταν μπήκες στο μαύρο phase
  const baseScrollRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const bodyHasDark = document.body.classList.contains("about-dark");

      if (!bodyHasDark) {
        // Όταν φύγουμε από το μαύρο → κρύψε κάρτες & reset baseScroll
        setIsDark(false);
        baseScrollRef.current = null;
        return;
      }

      setIsDark(true);

      const currentScroll =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;

      // Μόλις ΜΠΟΥΜΕ στο μαύρο για πρώτη φορά, “κλειδώνουμε” το σημείο που βρισκόμαστε
      if (baseScrollRef.current === null) {
        baseScrollRef.current = currentScroll;
      }

      const delta = currentScroll - (baseScrollRef.current ?? currentScroll);

      // Κάθε Χ pixels scroll = ένα swap
      const pixelsPerSwap = 200; // μπορείς να το μεγαλώσεις/μικρύνεις αν το θες πιο αργό/γρήγορο
      const visibleCards = cards.length;
      const totalSwaps = Math.max(visibleCards - 1, 1); // ώστε να έρθει μπροστά κάθε κάρτα μία φορά

      const rawStep = Math.floor(delta / pixelsPerSwap + 0.0001);
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
          const distX = 80;
          const distY = 90;
          const distZ = 170;

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
  rotateX(18deg)
  rotateZ(-4deg)
  scale(${scale})
`,

                zIndex: visibleCards - relativeIndex,
                opacity,
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
