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

  // Scroll progress ΜΟΝΟ για αυτό το section
  // 0 → όταν η κορυφή του section ακουμπήσει το viewport
  // 1 → όταν το section βγει τελείως από το viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ===============================
  // ΧΡΩΜΑΤΑ ΓΙΑ LANGSWITCHER + LOGO
  // ===============================
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;

    // Όσο είμαστε στο section (περίπου μέχρι 0.95) → dark mode header
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

  // Τίτλος + lottie – opacity (ίδια λογική με AboutPhilosophy)
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.1, 0.55, 0.7],
    [0, 1, 1, 0]
  );

  // Parallax κίνηση για το block τίτλου/κέντρου
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Panels: κλείνουν πιο γρήγορα, τελείως (με λίγο overlap)
  const panelsScaleX = useTransform(scrollYProgress, [0.45, 0.8], [0, 1.1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.42, 0.45], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό πιο μετά
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.4, 0.7],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  return (
    <section
      id="about-philosophy-split"
      className="about-split-section"
      ref={sectionRef}
    >
      {/* Sticky viewport area */}
      <div className="about-split-sticky">
        {/* Όλο το περιεχόμενο που κάνει parallax */}
        <motion.div className="about-split-inner" style={{ y: contentY }}>
          {/* Λευκά panels που κλείνουν από αριστερά & δεξιά */}
          <motion.div
            className="about-split-panel about-split-panel-left"
            style={{ scaleX: panelsScaleX, opacity: panelsOpacity }}
          />
          <motion.div
            className="about-split-panel about-split-panel-right"
            style={{ scaleX: panelsScaleX, opacity: panelsOpacity }}
          />

          {/* Τίτλος + Lottie */}
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
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPhilosophySplit;
