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

  // Ο τίτλος + lottie:
  // - στο 0 είναι *κάτω από την οθόνη* (100vh)
  // - στο 0.2 είναι ακριβώς στο κέντρο
  // - στο 0.7 αρχίζει να φεύγει προς τα πάνω
  // - στο 1 είναι αρκετά πάνω από την οθόνη
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 1],
    ["100vh", "0vh", "-20vh", "-40vh"]
  );

  // Opacity του τίτλου (γρήγορη εμφάνιση / εξαφάνιση)
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.05, 0.45, 0.6],
    [0, 1, 1, 0]
  );

  // Λευκά panels: κλείσιμο πιο γρήγορα και τελείως
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

        {/* Τίτλος + Lottie στο κέντρο, με parallax entry από κάτω */}
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
