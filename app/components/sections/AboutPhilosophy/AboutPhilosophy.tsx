"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Lottie from "lottie-react";

import "./AboutPhilosophy.css";

import scrollDownColor from "@/app/lottie/scroll-down.json";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

import GlitchText from "./GlitchText";

const AboutPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  // Scroll progress μόνο για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Κρατάμε το sticky *όσο* το section είναι ενεργό (0 < progress < 1)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsPinned(v > 0 && v < 1);
  });

  // LanguageSwitcher + header logo: αλλάζουμε χρώματα & class στο <body>
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;
    const body = document.body;
    if (!body) return;

    if (latest >= 0.8) {
      // μαύρο φόντο → άσπρα γράμματα
      body.style.setProperty("--lang-switcher-text-color", "#ffffff");
      body.style.setProperty(
        "--lang-switcher-text-muted-color",
        "rgba(255,255,255,0.7)"
      );
      body.classList.add("about-dark");
    } else {
      // κανονικό φόντο → μαύρα γράμματα
      body.style.setProperty("--lang-switcher-text-color", "#000000");
      body.style.setProperty(
        "--lang-switcher-text-muted-color",
        "rgba(0,0,0,0.6)"
      );
      body.classList.remove("about-dark");
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      const body = document.body;
      if (!body) return;
      body.style.removeProperty("--lang-switcher-text-color");
      body.style.removeProperty("--lang-switcher-text-muted-color");
      body.classList.remove("about-dark");
    };
  }, []);

  /* ==========================
     ANIMATIONS
     ========================== */

  // ΟΛΟ ΤΟ BLOCK (τίτλος + lottie)
  // - 0.0–0.12: κρυμμένο (0) -> δεν “μπλέκει” με το προηγούμενο section
  // - 0.12–0.58: full visible
  // - 0.58–0.7: fade-out ΠΡΙΝ ο κύκλος γίνει πολύ μεγάλος
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.58, 0.7],
    [0, 1, 1, 0]
  );

  // Μαύρος κύκλος:
  //  - μέχρι ~0.58 είναι αόρατος (opacity 0)
  //  - στο 0.6 εμφανίζεται απότομα full black, σαν μικρή τελεία στο κέντρο
  //  - 0.6–0.95 μεγαλώνει αργά από scale 0.02 σε 9 (άρα γεμίζει οθόνη)
  //  - 0.95–1 διατηρεί το ίδιο scale (full black, χωρίς spikes)
  const circleScale = useTransform(
    scrollYProgress,
    [0.6, 0.95, 1],
    [0.02, 9, 9]
  );

  const circleOpacity = useTransform(scrollYProgress, [0.58, 0.6], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό όταν έχουμε ουσιαστικά full black
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.5, 0.75],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      {/* Το ύψος αυτού του wrapper καθορίζει πόσα scroll "ταξιδεύει" το pinned section */}
      <div className="about-scroll-area">
        {/* Αυτό είναι που μένει καρφωμένο στο κέντρο */}
        <div
          className={
            isPinned ? "about-sticky about-sticky-fixed" : "about-sticky"
          }
        >
          {/* Μαύρος κύκλος στο κέντρο που μεγαλώνει */}
          <motion.div
            className="about-black-circle"
            style={{
              scale: circleScale,
              opacity: circleOpacity,
              x: "-50%",
              y: "-50%",
            }}
          />

          {/* Τίτλος + Lottie, μαζί σε ένα opacity */}
          <motion.div
            className="about-title-block"
            style={{ opacity: contentOpacity }}
          >
            <GlitchText
              className="about-title-glitch"
              speed={1.4}
              enableShadows
              enableOnHover={false}
            >
              ΠΟΙΟΙ ΕΙΜΑΣΤΕ
            </GlitchText>

            <div className="about-lottie-wrapper">
              {/* Έγχρωμο scroll-down στην αρχή */}
              <motion.div
                className="about-lottie-layer"
                style={{ opacity: colorLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownColor}
                  loop
                  className="about-lottie"
                />
              </motion.div>

              {/* Λευκό scroll-down όταν πια έχει σκοτεινιάσει */}
              <motion.div
                className="about-lottie-layer"
                style={{ opacity: whiteLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownWhite}
                  loop
                  className="about-lottie"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ΕΔΩ μετά θα μπουν οι καρτέλες όταν μου πεις layout */}
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophy;
