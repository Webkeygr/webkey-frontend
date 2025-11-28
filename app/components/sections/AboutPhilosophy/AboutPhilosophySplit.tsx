"use client";

import React, { useRef, useEffect } from "react";
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

  // 0: όταν η κορυφή του section ακουμπήσει τον πάτο του viewport
  // 1: όταν ο πάτος του section φτάσει στην κορυφή του viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
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
  // ANIMATIONS
  // ==========================

  // ΤΙ ΚΑΝΟΥΜΕ ΕΔΩ:
  // 0    → ο τίτλος είναι ΚΑΤΩ από την οθόνη (100vh)
  // 0.18 → ανεβαίνει και κάθεται στο κέντρο (0vh)
  // 0.6  → ΠΑΡΑΜΕΝΕΙ στο κέντρο (0vh) → εδώ είναι το "sticky" range
  // 1    → φεύγει πιο πάνω (-40vh)
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.18, 0.6, 1],
    ["100vh", "0vh", "0vh", "-40vh"]
  );

  // Opacity: μπαίνει γρήγορα, μένει αρκετά, και μετά σβήνει
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.06, 0.7, 0.85],
    [0, 1, 1, 0]
  );

  // Λευκά panels: κλείσιμο πιο γρήγορο και πλήρες
  const panelsScaleX = useTransform(scrollYProgress, [0.3, 0.6], [0, 1.1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.27, 0.3], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό μετά
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.3, 0.55],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  return (
    <section
      id="about-philosophy-split"
      className="about-split-section"
      ref={sectionRef}
    >
      <div className="about-split-sticky">
        {/* Σταθερό μαύρο φόντο που σκεπάζει τις κάρτες από κάτω */}
        <div className="about-split-bg" />

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

        {/* Τίτλος + Lottie στο κέντρο, με entry από κάτω και "κολλημένο" range */}
        <motion.div
          className="about-split-title-block"
          style={{ opacity: contentOpacity, y: contentY }}
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
      </div>
    </section>
  );
};

export default AboutPhilosophySplit;
