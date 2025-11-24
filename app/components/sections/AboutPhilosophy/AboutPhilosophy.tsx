"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import GlitchText from "./GlitchText";
import scrollDown from "@/app/lottie/scroll-down.json";

const CARDS = [
  {
    title: "Clarity first",
    body: "Δεν κρυβόμαστε πίσω από buzzwords. Ξεκινάμε με ξεκάθαρους στόχους...",
  },
  {
    title: "Design με σκοπό",
    body: "Όμορφο χωρίς λειτουργικότητα δεν μας ενδιαφέρει...",
  },
  {
    title: "Tech χωρίς φλυαρία",
    body: "Χρησιμοποιούμε σύγχρονες τεχνολογίες χωρίς φλυαρία...",
  },
  {
    title: "Σχέση, όχι project",
    body: "Χτίζουμε σχέση και όχι απλή ολοκλήρωση project...",
  },
];

export default function AboutPhilosophy() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  // Glitch fade-out
  const glitchOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Scroll-down fade-in then fade-out
  const scrollIconOpacity = useTransform(scrollYProgress, [0.08, 0.2, 0.32], [0, 1, 0]);

  // Cards appear one-by-one
  const cardsOpacity = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);
  const cardsTranslate = useTransform(scrollYProgress, [0.25, 0.55], [80, 0]);

  return (
    <section ref={ref} className="relative min-h-[200vh] w-full">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">

        {/* Glitch Title */}
        <motion.div style={{ opacity: glitchOpacity }} className="mb-16">
          <GlitchText speed={1} enableShadows={true}>
            Ποιοι Είμαστε
          </GlitchText>
        </motion.div>

        {/* Scroll Lottie */}
        <motion.div
          className="absolute bottom-20"
          style={{ opacity: scrollIconOpacity }}
        >
          <Lottie
            animationData={scrollDown}
            loop
            autoplay
            style={{ width: 140, opacity: 0.9 }}
          />
        </motion.div>
      </div>

      {/* CARDS Grid */}
      <div className="relative z-10 mt-[100vh] grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6 pb-32">
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            style={{
              opacity: cardsOpacity,
              y: cardsTranslate,
            }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="
              p-6 rounded-xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]
              border border-transparent relative
            "
          >
            <div className="absolute inset-0 rounded-xl pointer-events-none 
              bg-gradient-to-br from-sky-400 via-fuchsia-500 to-violet-500 opacity-40 blur-md" />

            <div className="relative">
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-neutral-700 leading-relaxed">{card.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
