"use client";

import React, { useEffect, useRef, useState } from "react";
import "./AboutPhilosophyScrollCards.css";
import Lottie from "lottie-react";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

type ScrollCard = {
  title: string;
  body: string;
};

const cards: ScrollCard[] = [
  {
    title: "Clarity first",
    body: "Η καθαρή στρατηγική είναι η βάση κάθε επιτυχημένου digital project. Πριν ξεκινήσει το design ή η ανάπτυξη, ευθυγραμμίζουμε στόχους, κοινό και απαιτήσεις ώστε να χτίσουμε λύσεις που εξυπηρετούν πραγματικές ανάγκες. Αφαιρούμε την πολυπλοκότητα και οργανώνουμε το περιεχόμενο, τις λειτουργίες και την εμπειρία χρήστη με τρόπο που ενισχύει την απόδοση και τη σαφήνεια. Με ξεκάθαρη κατεύθυνση, κάθε website, brand ή εφαρμογή γίνεται πιο αποτελεσματική και πιο εύκολη στη διαχείριση μακροπρόθεσμα.",
  },
  {
    title: "Design με σκοπό",
    body: "Το design είναι εργαλείο στρατηγικής επικοινωνίας. Δημιουργούμε οπτικές ταυτότητες, εμπειρίες και layouts που ενισχύουν τη brand εικόνα και καθοδηγούν τον χρήστη με φυσικό τρόπο. Κάθε επιλογή —από την τυπογραφία μέχρι τα interactions— έχει στόχο να αυξήσει την εμπιστοσύνη, την αναγνωρισιμότητα και τη μετατροπή. Σχεδιάζουμε websites και digital περιεχόμενο που όχι μόνο φαίνονται άψογα, αλλά λειτουργούν καλύτερα και υποστηρίζουν την ανάπτυξη της επιχείρησής σου.",
  },
  {
    title: "Tech χωρίς φλυαρία",
    body: "Πιστεύουμε στην τεχνολογία που λύνει προβλήματα, όχι που δημιουργεί νέα. Προτείνουμε λύσεις web development που είναι γρήγορες, ασφαλείς και εύκολες στη χρήση — χωρίς υπερβολικές τεχνικές έννοιες ή περιττή πολυπλοκότητα. Χρησιμοποιούμε σύγχρονα frameworks, σταθερές υποδομές και πρακτικές που βελτιώνουν την ταχύτητα φόρτωσης, το SEO και την συνολική εμπειρία χρήστη. Θέλεις μια πλατφόρμα που απλά λειτουργεί, κάθε μέρα. Αυτό ακριβώς παραδίδουμε.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Για εμάς η συνεργασία δεν τελειώνει με την παράδοση ενός site. Χτίζουμε μακροχρόνιες σχέσεις, προσφέροντας συνεχή υποστήριξη, βελτιστοποιήσεις και στρατηγική καθοδήγηση. Μαθαίνουμε τις ανάγκες και τους στόχους της επιχείρησής σου ώστε να εξελίσσουμε την ψηφιακή σου παρουσία με σταθερά βήματα. Δεν είμαστε απλός πάροχος υπηρεσιών — είμαστε ο συνεργάτης που μπορείς να εμπιστευτείς για κάθε digital ανάγκη, σήμερα και αύριο.",
  },
];

const AboutPhilosophyScrollCards: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [globalOpacity, setGlobalOpacity] = useState(1);

  // Από πού ξεκινήσαμε να “μετράμε” scroll όταν μπήκες στο μαύρο phase
  const baseScrollRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const bodyHasDark = document.body.classList.contains("about-dark");

      if (!bodyHasDark) {
        // Όταν φύγουμε από το μαύρο → κρύψε κάρτες & reset
        setIsDark(false);
        baseScrollRef.current = null;
        setHasStarted(false);
        setGlobalOpacity(0); // σιγουριά ότι δεν "αναβοσβήνουν"
        return;
      }

      // Βρισκόμαστε στο μαύρο phase
      setIsDark(true);

      const currentScroll =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;

      // Μόλις ΜΠΟΥΜΕ στο μαύρο για πρώτη φορά, “κλειδώνουμε” το σημείο
      if (baseScrollRef.current === null) {
        baseScrollRef.current = currentScroll;
        setGlobalOpacity(1); // ξεκινάμε πλήρως ορατές
      }

      const delayPixels = 1080; // ~1–2 scrolls, για να αργήσει λίγο η εναλλαγή

      const baseScroll = baseScrollRef.current ?? currentScroll;
      const rawDelta = currentScroll - baseScroll;

      if (!hasStarted) {
        // Αν δεν έχουμε φτάσει ακόμα το delay → δείξε 1η κάρτα
        if (rawDelta < delayPixels) {
          setStep(0);
          setGlobalOpacity(1);
          return;
        }

        // Μόλις περάσουμε το delay για πρώτη φορά,
        // θεωρούμε ότι "ξεκίνησαν" οι κάρτες
        setHasStarted(true);
      }

      // Από εδώ και κάτω θεωρούμε ότι “τρέχει” κανονικά το σύστημα καρτών
      const effectiveDelta = rawDelta - delayPixels;

      // Κάθε Χ pixels scroll = ένα swap
      const pixelsPerSwap = 800; // αυτό είναι για τις αλλαγές κάρτας
      const visibleCards = cards.length;
      const totalSwaps = Math.max(visibleCards - 1, 1);

      const rawStep = Math.floor(
        Math.max(effectiveDelta, 0) / pixelsPerSwap + 0.0001
      );
      const clampedStep = Math.min(Math.max(rawStep, 0), totalSwaps);
      setStep(clampedStep);

      // --------- GLOBAL FADE OUT ΜΕΤΑ ΤΗΝ ΤΕΛΕΥΤΑΙΑ ΚΑΡΤΑ ---------
      const lastStepDelta = pixelsPerSwap * totalSwaps;
      const fadeOutDistance = 600; // πόσα px scroll για να εξαφανιστούν τελείως

      if (effectiveDelta <= lastStepDelta) {
        // όσο είμαστε μέσα στα steps των καρτών → πλήρως ορατές
        setGlobalOpacity(1);
      } else {
        const extra = effectiveDelta - lastStepDelta;
        const fade = extra >= fadeOutDistance ? 0 : 1 - extra / fadeOutDistance;
        setGlobalOpacity(fade);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [hasStarted]);

  if (!isDark && globalOpacity <= 0) return null;

  const visibleCards = cards.length;

  return (
    <div
      className="about-cards-overlay-center"
      style={{ opacity: globalOpacity }}
    >
      {/* 3D stack στο κέντρο */}
      <div className="about-cards-3d-stack">
        {cards.map((card, index) => {
          const relativeIndex =
            (index - (step % visibleCards) + visibleCards) % visibleCards;

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
                  scale(${scale})
                  rotateX(18deg)
                  rotateZ(-4deg)
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

      {/* Lottie scroll-down στο κέντρο, κάτω από τις κάρτες */}
      <div className="about-cards-lottie">
        <Lottie
          animationData={scrollDownWhite}
          loop
          className="about-cards-lottie-icon"
        />
      </div>
    </div>
  );
};

export default AboutPhilosophyScrollCards;
