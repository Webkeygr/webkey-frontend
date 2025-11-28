"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Lottie from "lottie-react";

import "./AboutPhilosophySplit.css";

import scrollDownColor from "@/app/lottie/scroll-down.json";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

import GlitchText from "./GlitchText";

const AboutPhilosophySplit: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  // 0: όταν η κορυφή του section ακουμπά τον πάτο του viewport
  // 1: όταν ο πάτος του section φτάσει στην κορυφή του viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Sticky/fixed όσο το section είναι πραγματικά μέσα στο viewport
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsPinned(v > 0 && v < 1);
  });

  // ===============================
  // ΧΡΩΜΑΤΑ ΓΙΑ LANGSWITCHER + LOGO
  // ===============================
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;

    const isDarkPhase = latest < 0.95;

    const labels = document.querySelectorAll<HTMLElement>(".lang-label");
    labels.forEach((el) => {
      el.style.color = isDarkPhase ? "#ffffff" : "";
    });

    const logoImg = document.querySelector<HTMLImageElement>("img.site-logo");
    if (logoImg) {
      logoImg.style.filter = isDarkPhase ? "brightness(0) invert(1)" : "";
    }
  });

  // Cleanup
  useEffect(() => {
    if (typeof window === "undefined") return;

    return () => {
      const labels = document.querySelectorAll<HTMLElement>(".lang-label");
      labels.forEach((el) => {
        el.style.color = "";
      });
      const logoImg = document.querySelector<HTMLImageElement>("img.site-logo");
      if (logoImg) {
        logoImg.style.filter = "";
      }
    };
  }, []);

  // ==========================
  // ANIMATIONS
  // ==========================

  // ΟΛΟ το περιεχόμενο (panels + τίτλος) ξεκινάει ΚΑΤΩ από την οθόνη
  // 0   → 100vh (off-screen κάτω)
  // 0.30→ 0vh (στη θέση του)
  // 1   → 0vh (μένει στη θέση του)
  const innerY = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    ["100vh", "0vh", "0vh"]
  );

  // Τίτλος + Lottie: αισθητό fade-in στο ίδιο range
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.3, 0.5, 0.7],
    [0, 1, 1, 0]
  );

  // Panels που κλείνουν από τα πλάγια
  const panelsScaleX = useTransform(scrollYProgress, [0.35, 0.65], [0, 1.1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.32, 0.35], [0, 1]);

  // Lottie: έγχρωμο → λευκό
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.35, 0.6],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <section
      id="about-philosophy-split"
      className="about-split-section"
      ref={sectionRef}
    >
      <div
        className={
          isPinned
            ? "about-split-sticky about-split-sticky-fixed"
            : "about-split-sticky"
        }
      >
        {/* ΣΤΑΘΕΡΟ ΜΑΥΡΟ BACKGROUND – ΔΕΝ ΚΟΥΝΙΕΤΑΙ ΜΕ innerY */}
        <div className="about-split-bg" />

        {/* ΟΛΟ το υπόλοιπο layer με slide-up / parallax από κάτω */}
        <motion.div className="about-split-inner" style={{ y: innerY }}>
          {/* Λευκά panels που κλείνουν από αριστερά & δεξιά */}
          <motion.div
            className="about-split-panel about-split-panel-left"
            style={{
              scaleX: panelsScaleX,
              opacity: panelsOpacity,
            }}
          />
          <motion.div
            className="about-split-panel about-split-panel-right"
            style={{
              scaleX: panelsScaleX,
              opacity: panelsOpacity,
            }}
          />

          {/* Τίτλος + Lottie – ΠΑΝΤΑ στο κέντρο, με fade-in */}
          <motion.div
            className="about-split-title-block"
            style={{ opacity: contentOpacity }}
          >
            <GlitchText
              className="about-split-title-glitch"
              speed={1.4}
              enableShadows
              enableOnHover={false}
            >
              Τα έργα μας
            </GlitchText>

            <div className="about-split-lottie-wrapper">
              <motion.div
                className="about-split-lottie-layer"
                style={{ opacity: colorLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownWhite}
                  loop
                  className="about-split-lottie"
                />
              </motion.div>

              <motion.div
                className="about-split-lottie-layer"
                style={{ opacity: whiteLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownWhite}
                  loop
                  className="about-split-lottie"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPhilosophySplit;
