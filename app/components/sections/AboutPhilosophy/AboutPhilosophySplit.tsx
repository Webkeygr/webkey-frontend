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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
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

  // Parallax κίνηση για όλο το περιεχόμενο του section
  // 0: λίγο χαμηλότερα, 0.5: στη θέση του, 1: λίγο πιο πάνω
  const sectionY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -60]);

  // Τίτλος + lottie – να εμφανίζονται νωρίτερα και να κρατούν λιγότερο
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.05, 0.45, 0.6],
    [0, 1, 1, 0]
  );

  // Λευκά panels: κλείσιμο πιο γρήγορο (λιγότερο scroll) και full κλείσιμο
  const panelsScaleX = useTransform(scrollYProgress, [0.35, 0.65], [0, 1.1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.32, 0.35], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό πιο μετά
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.35, 0.6],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <section
      id="about-philosophy-split"
      className="about-split-section"
      ref={sectionRef}
    >
      <div className="about-split-sticky">
        <motion.div className="about-split-inner" style={{ y: sectionY }}>
          {/* Σταθερό μαύρο φόντο που σκεπάζει το προηγούμενο section */}
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

          {/* Τίτλος + Lottie στο κέντρο της οθόνης */}
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
