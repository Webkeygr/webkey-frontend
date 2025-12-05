"use client";

import React, { useEffect, useRef, useState } from "react";
import "./AboutPhilosophyScrollCards.css";
import Lottie from "lottie-react";
import { usePathname } from "next/navigation";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

type ScrollCard = {
  title: string;
  body: string;
};

/* ============================================================
   🔵 CARDS GR + EN
============================================================ */
const cardsGR: ScrollCard[] = [
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

const cardsEN: ScrollCard[] = [
  {
    title: "Clarity first",
    body: "A clear strategy is the foundation of every successful digital project. Before design or development begins, we align goals, audience, and requirements to create solutions that meet real needs. We remove complexity and organize content, features, and user experience in a way that enhances clarity and performance. With the right direction, every website, brand, or application becomes more effective and easier to manage long-term.",
  },
  {
    title: "Design with purpose",
    body: "Design is a tool for strategic communication. We create visual identities, experiences, and layouts that strengthen brand presence and guide users intuitively. Every choice—from typography to interactions—aims to increase trust, recognition, and conversion. We design websites and digital content that not only look exceptional but function better and support your business growth.",
  },
  {
    title: "Tech without noise",
    body: "We believe in technology that solves problems—not creates new ones. We propose web development solutions that are fast, secure, and easy to use, without unnecessary technical jargon or complexity. We rely on modern frameworks, stable infrastructures, and practices that improve loading speed, SEO, and overall user experience. You want a platform that simply works, every day. That's exactly what we deliver.",
  },
  {
    title: "Relationship, not project",
    body: "For us, collaboration doesn’t end with delivering a website. We build long-term partnerships, offering continuous support, optimization, and strategic guidance. We learn the needs and goals of your business to evolve your digital presence step by step. We’re not just a service provider — we’re the partner you can trust for every digital challenge, today and tomorrow.",
  },
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

const AboutPhilosophyScrollCards: React.FC = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const cards = isEnglish ? cardsEN : cardsGR;

  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // ⬇️ ΜΟΝΗ ΣΗΜΑΝΤΙΚΗ ΑΛΛΑΓΗ: ξεκινάμε με 0, όχι 1
  const [globalOpacity, setGlobalOpacity] = useState(0);

  const baseScrollRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const bodyHasDark = document.body.classList.contains("about-dark");

      if (!bodyHasDark) {
        setIsDark(false);
        baseScrollRef.current = null;
        setHasStarted(false);
        setGlobalOpacity(0);
        return;
      }

      setIsDark(true);

      const currentScroll =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;

      if (baseScrollRef.current === null) {
        baseScrollRef.current = currentScroll;
        setGlobalOpacity(1);
      }

      const delayPixels = 800;
      const baseScroll = baseScrollRef.current ?? currentScroll;
      const rawDelta = currentScroll - baseScroll;

      if (!hasStarted) {
        if (rawDelta < delayPixels) {
          setStep(0);
          setGlobalOpacity(1);
          return;
        }
        setHasStarted(true);
      }

      const effectiveDelta = rawDelta - delayPixels;

      const pixelsPerSwap = 600;
      const visibleCards = cards.length;
      const totalSwaps = Math.max(visibleCards - 1, 1);

      const rawStep = Math.floor(
        Math.max(effectiveDelta, 0) / pixelsPerSwap + 0.0001
      );
      const clampedStep = Math.min(Math.max(rawStep, 0), totalSwaps);
      setStep(clampedStep);

      const lastStepDelta = pixelsPerSwap * totalSwaps;
      const holdDistance = 1000;
      const fadeOutDistance = 500;

      if (effectiveDelta <= lastStepDelta + holdDistance) {
        setGlobalOpacity(1);
      } else {
        const extra = effectiveDelta - (lastStepDelta + holdDistance);
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
  }, [hasStarted, cards.length]);

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

      {/* Lottie scroll indicator */}
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
