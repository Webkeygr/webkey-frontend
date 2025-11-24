"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import "./AboutPhilosophy.css";

type CardData = {
  id: string;
  title: string;
  text: string;
};

const CARDS: CardData[] = [
  {
    id: "clarity",
    title: "Clarity first",
    text: "Δεν κρυβόμαστε πίσω από buzzwords. Ξεκινάμε με ξεκάθαρους στόχους: τι θέλεις να πετύχεις, με ποιο κοινό και σε ποιο χρονικό ορίζοντα. Ό,τι σχεδιάζουμε, υπηρετεί αυτό.",
  },
  {
    id: "design-purpose",
    title: "Design με σκοπό",
    text: "Όμορφο χωρίς λειτουργικότητα δεν μας ενδιαφέρει. Σχεδιάζουμε εμπειρίες που οδηγούν τον επισκέπτη σε πράξη: να σου στείλει μήνυμα, να κλείσει ραντεβού, να αγοράσει, να σε θυμάται.",
  },
  {
    id: "tech-no-fluff",
    title: "Tech χωρίς φλυαρία",
    text: 'Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε "πνίγουμε" με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.',
  },
  {
    id: "relationship",
    title: "Σχέση, όχι project",
    text: 'Δεν βλέπουμε τη δουλειά σαν "ένα project και τέλος". Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.',
  },
];

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress για ΟΛΟ το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.2,
  });

  // -------- LOTTIE (φορτώνει runtime από /public, χωρίς import προβλήματα) -----
  const [scrollData, setScrollData] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/lottie/scroll-down.json");
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setScrollData(json);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- Animations για τίτλο + lottie στην πρώτη φάση  -------------------
  // Τίτλος: δυνατό fade μέχρι ~30% του scroll, μετά σβήνει μέχρι 45%
  const titleOpacity = useTransform(progress, [0, 0.25, 0.45], [1, 1, 0], {
    clamp: true,
  });
  const titleY = useTransform(progress, [0, 0.25, 0.45], [0, 0, -40], {
    clamp: true,
  });

  // Lottie στην "εισαγωγή": κάτω από τον τίτλο, fade-out όταν ξεκινάνε οι κάρτες
  const introLottieOpacity = useTransform(progress, [0, 0.3, 0.45], [1, 1, 0], {
    clamp: true,
  });
  const introLottieScale = useTransform(progress, [0, 0.45], [1, 0.8], {
    clamp: true,
  });

  // Lottie στη μέση του grid: εμφανίζεται αργότερα
  const gridLottieOpacity = useTransform(progress, [0.45, 0.55], [0, 1], {
    clamp: true,
  });
  const gridLottieScale = useTransform(progress, [0.45, 0.7], [0.8, 1], {
    clamp: true,
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        // 280vh = αρκετό scroll για τίτλο + κάρτες
        height: "280vh",
      }}
    >
      {/* Λευκό overlay τύπου "παράθυρο" που κολλάει full-screen */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-8">
        <div
          className="
            relative w-full max-w-6xl h-[80vh]
            bg-white/98 rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.35)]
            overflow-hidden
          "
        >
          {/* Εσωτερικό wrapper για κεντράρισμα περιεχομένου */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {/* ----------- ΦΑΣΗ 1: ΤΙΤΛΟΣ + LOTTIE ----------- */}
            <motion.div
              style={{ opacity: titleOpacity, y: titleY }}
              className="flex flex-col items-center justify-center gap-10 pointer-events-none"
            >
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={false}
                className="text-[clamp(40px,7vw,80px)] font-black text-black text-center"
              >
                Ποιοι είμαστε
              </GlitchText>

              {scrollData && (
                <motion.div
                  style={{
                    opacity: introLottieOpacity,
                    scale: introLottieScale,
                  }}
                >
                  <Lottie
                    animationData={scrollData}
                    loop
                    autoplay
                    style={{ width: 140, height: 140 }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* ----------- ΦΑΣΗ 2: GRID ΜΕ ΚΑΡΤΕΣ + LOTTIE ΣΤΟ ΚΕΝΤΡΟ ----------- */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-6 sm:px-10"
              style={{
                opacity: useTransform(progress, [0.35, 0.5], [0, 1], {
                  clamp: true,
                }),
              }}
            >
              <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 items-center justify-center">
                {CARDS.map((card, index) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    index={index}
                    master={progress}
                  />
                ))}

                {/* Lottie στη μέση του grid (πάνω από τα κάτω δύο κουτιά) */}
                {scrollData && (
                  <motion.div
                    className="about-grid-lottie"
                    style={{
                      opacity: gridLottieOpacity,
                      scale: gridLottieScale,
                    }}
                  >
                    <Lottie
                      animationData={scrollData}
                      loop
                      autoplay
                      style={{ width: 130, height: 130 }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Κάρτα με stagger scroll -------------------------- */

function CardItem({
  card,
  index,
  master,
}: {
  card: CardData;
  index: number;
  master: MotionValue<number>;
}) {
  // Βάση για το πότε ξεκινάει κάθε κάρτα
  const baseStart = 0.42; // αρχή εμφάνισης πρώτης κάρτας
  const step = 0.07; // πόσο απέχει η επόμενη (περισσότερο scroll)
  const start = baseStart + index * step;
  const end = start + 0.25; // πόσο διαρκεί η εμφάνιση

  const opacity = useTransform(master, [start, end], [0, 1], { clamp: true });
  const y = useTransform(master, [start, end], [40, 0], { clamp: true });

  return (
    <motion.article className="about-card neon-card" style={{ opacity, y }}>
      <h3 className="about-card-title">{card.title}</h3>
      <p className="about-card-text">{card.text}</p>
    </motion.article>
  );
}
