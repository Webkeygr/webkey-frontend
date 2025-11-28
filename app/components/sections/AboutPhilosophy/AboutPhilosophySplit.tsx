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

  // Scroll progress ΜΟΝΟ για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Sticky όσο το section είναι στο viewport
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsPinned(v > 0 && v < 1);
  });

  // ===============================
  // ΧΡΩΜΑΤΑ ΓΙΑ LANGSWITCHER + LOGO
  // ===============================
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;

    // Στην αρχή το φόντο είναι μαύρο, στο τέλος οθόνη λευκή.
    // Άρα μέχρι ~0.85 κρατάμε "dark mode" στο header, μετά επανέρχεται.
    const isDarkPhase = latest < 0.85;

    const labels = document.querySelectorAll<HTMLElement>(".lang-label");
    labels.forEach((el) => {
      el.style.color = isDarkPhase ? "#ffffff" : "";
    });

    const logoImg = document.querySelector<HTMLImageElement>("img.site-logo");
    if (logoImg) {
      logoImg.style.filter = isDarkPhase ? "brightness(0) invert(1)" : "";
    }
  });

  // Cleanup όταν φύγει τελείως το component
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
  // ANIMATIONS (ίδια λογική με τον κύκλο)
  // ==========================

  // Τίτλος + lottie – ενιαίο opacity:
  // 0–0.12: κρυφό, 0.12–0.58: full, 0.58–0.7: fade out
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.12, 0.7],
    [0, 1, 1, 0]
  );

  // Panels: αριστερά / δεξιά "κλείνουν" την οθόνη
  // 0.43–0.95: από scaleX 0 → 1
  const panelsScaleX = useTransform(
    scrollYProgress,
    [0.43, 0.95, 1],
    [0, 1, 1]
  );
  const panelsOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.4],
    [0, 1]
  );

  // Lottie: έγχρωμο στην αρχή, λευκό όσο πλησιάζουμε στο full white
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.5, 0.75],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

  return (
    <section
      id="about-philosophy-split"
      className="about-split-section"
      ref={sectionRef}
    >
      <div className="about-split-scroll-area">
        <div
          className={
            isPinned
              ? "about-split-sticky about-split-sticky-fixed"
              : "about-split-sticky"
          }
        >
          {/* Λευκά panels που κλείνουν από δεξιά & αριστερά */}
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

          {/* Τίτλος + lottie */}
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
              Ποιοι Είμαστε
            </GlitchText>

            <div className="about-split-lottie-wrapper">
              <motion.div
                className="about-split-lottie-layer"
                style={{ opacity: colorLottieOpacity }}
              >
                <Lottie
                  animationData={scrollDownColor}
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

          {/* ΕΔΩ μετά μπορείς να βάλεις συνέχεια content, αν χρειαστεί */}
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophySplit;
