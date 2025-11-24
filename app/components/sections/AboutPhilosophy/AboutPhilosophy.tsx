"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";

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
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες (Next.js, headless WordPress κ.λπ.), αλλά δεν σε \"πνίγουμε\" με τεχνικές λεπτομέρειες. Για εσένα μετράει να δουλεύει γρήγορα, σταθερά και να μπορεί να εξελιχθεί.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Δεν βλέπουμε τη δουλειά σαν \"ένα project και τέλος\". Θέλουμε να χτίσουμε σχέση εμπιστοσύνης, να σε συμβουλεύουμε, να κάνουμε βελτιώσεις, να δοκιμάζουμε νέα πράγματα και να μεγαλώνουμε μαζί.",
  },
];

export default function AboutPhilosophy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Λευκό φόντο που ανεβαίνει και κάθεται fullscreen
  const whiteTranslateY = useTransform(
    scrollYProgress,
    [0, 0.18],
    ["100%", "0%"]
  );

  // Glitch τίτλος – εμφανίζεται, κάθεται λίγο, μετά fade out
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.10, 0.20, 0.45, 0.55],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0.10, 0.25], [40, 0]);

  // Lottie: πρώτα κάτω από τον τίτλο, μετά ανεβαίνει στο κέντρο
  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.22, 0.65, 0.75],
    [0, 1, 1, 0.4]
  );
  const lottieY = useTransform(
    scrollYProgress,
    [0.18, 0.40, 0.60],
    [120, 40, 0] // κάτω από τον τίτλο → πλησιάζει → κέντρο
  );

  // Progress για την εμφάνιση των καρτών
  const cardsMaster = useTransform(scrollYProgress, [0.45, 0.95], [0, 1]);

  // Lottie data από /public
  const [scrollData, setScrollData] = useState<any | null>(null);
  useEffect(() => {
    fetch("/lottie/scroll-down.json")
      .then((res) => res.json())
      .then((data) => setScrollData(data))
      .catch(() => setScrollData(null));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "420vh" }} // ανάλογο με τις κάρτες/τίτλο
    >
      {/* STICKY VIEWPORT */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ΛΕΥΚΟ PARALLAX ΦΟΝΤΟ ΠΟΥ ΑΝΕΒΑΙΝΕΙ */}
        <motion.div
          className="absolute inset-0 bg-white z-[1]"
          style={{ translateY: whiteTranslateY }}
        />

        {/* CONTENT πάνω από το λευκό φόντο */}
        <div className="relative z-[2] h-full flex items-center justify-center">
          {/* ΤΙΤΛΟΣ + LOTTIE ΚΑΤΩ ΑΠΟ ΤΟΝ ΤΙΤΛΟ */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ opacity: titleOpacity }}
          >
            <motion.div style={{ y: titleY }} className="mb-10">
              <GlitchText speed={1} enableShadows={true}>
                Ποιοι είμαστε
              </GlitchText>
            </motion.div>

            <motion.div style={{ opacity: lottieOpacity }}>
              {scrollData && (
                <Lottie
                  animationData={scrollData}
                  loop
                  autoplay
                  style={{ width: 140, height: 140 }}
                />
              )}
            </motion.div>
          </motion.div>

          {/* LOTTIE ΣΤΟ ΚΕΝΤΡΟ (όταν έχει φύγει ο τίτλος) */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2"
            style={{ y: lottieY, opacity: lottieOpacity }}
          >
            {scrollData && (
              <div className="w-[150px] h-[150px] rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.25)]">
                <Lottie
                  animationData={scrollData}
                  loop
                  autoplay
                  style={{ width: 110, height: 110 }}
                />
              </div>
            )}
          </motion.div>

          {/* GRID ΜΕ ΤΑ 4 ΚΟΥΤΙΑ – ΕΜΦΑΝΙΖΟΝΤΑΙ ΕΝΑ-ΕΝΑ */}
          <div className="relative w-full max-w-6xl mx-auto px-6">
            <CardsGrid cards={CARDS} masterProgress={cardsMaster} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Cards Grid γύρω από το Lottie ----------------------- */

function CardsGrid({
  cards,
  masterProgress,
}: {
  cards: Card[];
  masterProgress: ReturnType<typeof useTransform>;
}) {
  return (
    <div
      className="
        pointer-events-none
        relative w-full
        max-w-5xl mx-auto
        grid grid-cols-1 lg:grid-cols-2 gap-10
        min-h-[420px]
      "
    >
      {cards.map((card, index) => (
        <NeonCard
          key={card.title}
          card={card}
          index={index}
          masterProgress={masterProgress}
        />
      ))}
    </div>
  );
}

/* ----------------------- Neon Card με glow & animation ----------------------- */

function NeonCard({
  card,
  index,
  masterProgress,
}: {
  card: Card;
  index: number;
  masterProgress: ReturnType<typeof useTransform>;
}) {
  // Κάθε κάρτα εμφανίζεται σε διαφορετικό “παράθυρο” scroll
  const start = 0.1 + index * 0.12;
  const end = start + 0.35;

  const opacity = useTransform(masterProgress, [start, end], [0, 1]);
  const y = useTransform(masterProgress, [start, end], [60, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="
        pointer-events-auto
        relative
        rounded-[10px]
        bg-white
        p-6 sm:p-7
        overflow-hidden
      "
    >
      {/* Neon glow border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[10px]"
        style={{
          boxShadow:
            "0 0 26px rgba(0, 224, 255, 0.55), 0 0 42px rgba(255, 0, 200, 0.35)",
          border: "1px solid rgba(180, 220, 255, 0.9)",
        }}
      />

      <div className="relative">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">
          {card.title}
        </h3>
        <p className="text-[15px] sm:text-[16px] leading-relaxed text-neutral-800">
          {card.body}
        </p>
      </div>
    </motion.div>
  );
}
