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

    // Dark phase όσο είμαστε σε μαύρο / panels
    const isDarkPhase = latest < 0.9;

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

  // Parallax entry για ΟΛΟ το section περιεχόμενο
  // 0 → κάτω λίγο, 0.25 → στη θέση του
  const sectionY = useTransform(scrollYProgress, [0, 0.25], [120, 0]);

  // Τίτλος + lottie – ίδια λογική με AboutPhilosophy
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.12, 0.7],
    [0, 1, 1, 0]
  );

  // Μαύρο background overlay που κάνει fade πάνω από τις κάρτες
  // 0–0.08: από διάφανο σε μαύρο, μετά μένει μαύρο
  const bgOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.08, 0.25],
    [0, 1, 1]
  );

  // Panels: να κλείνουν πιο γρήγορα
  // 0.55–0.85: scaleX 0 → 1.1 (λίγο overlap για να μη μένει μαύρη γραμμή)
  const panelsScaleX = useTransform(scrollYProgress, [0.55, 0.85], [0, 1.1]);

  // Panels opacity – εμφανίζονται λίγο πριν αρχίσουν να κλείνουν
  const panelsOpacity = useTransform(scrollYProgress, [0.5, 0.55], [0, 1]);

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
          {/* ΟΛΟ το περιεχόμενο σε parallax container */}
          <motion.div
            className="about-split-inner"
            style={{ y: sectionY }}
          >
            {/* Μαύρο background overlay που κάνει fade πάνω από τις κάρτες */}
            <motion.div
              className="about-split-bg"
              style={{ opacity: bgOpacity }}
            />

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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophySplit;
