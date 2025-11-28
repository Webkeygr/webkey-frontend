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

  // 0: start end, 1: end start
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

  // Τίτλος: ΜΟΝΟ opacity, ΚΑΘΟΛΟΥ κίνηση σε Y
  // Φαίνεται πολύ γρήγορα και μένει σχεδόν όλο το section
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.04, 0.8, 0.95],
    [0, 1, 1, 0]
  );

  // Λευκά panels που κλείνουν
  const panelsScaleX = useTransform(scrollYProgress, [0.3, 0.6], [0, 1.1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.27, 0.3], [0, 1]);

  // Lottie: έγχρωμο → λευκό
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

        {/* Τίτλος + Lottie – ΠΑΝΤΑ στο κέντρο, χωρίς κίνηση προς τα πάνω */}
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
      </div>
    </section>
  );
};

export default AboutPhilosophySplit;
