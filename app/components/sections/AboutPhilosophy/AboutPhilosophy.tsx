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

// Lotties
import scrollDownColor from "@/app/lottie/scroll-down.json";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

// Glitch τίτλος
import GlitchText from "./GlitchText";

const AboutPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  // scroll progress ΜΟΝΟ για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // κρατάμε το sticky όσο το section είναι στο viewport
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsPinned(v > 0 && v < 1);
  });

  // ------------------------------
  // LanguageSwitcher + Logo styling
  // ------------------------------
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;

    const isDark = latest >= 0.8;

    // 1) Γλώσσες (GR / EN)
    const labels = document.querySelectorAll<HTMLElement>(".lang-label");
    labels.forEach((el) => {
      el.style.color = isDark ? "#ffffff" : "";
    });

    // 2) Logo στο header (χρησιμοποιούμε filter για να γίνει λευκό)
    const logoImg =
      (document.querySelector(
        'img[alt="WebKey"]'
      ) as HTMLImageElement | null) ||
      (document.querySelector('img[alt="Webkey"]') as HTMLImageElement | null);

    if (logoImg) {
      logoImg.style.filter = isDark ? "brightness(0) invert(1)" : "";
    }
  });

  // Clean-up όταν φύγει τελείως το component
  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;

      const labels = document.querySelectorAll<HTMLElement>(".lang-label");
      labels.forEach((el) => {
        el.style.color = "";
      });

      const logoImg =
        (document.querySelector(
          'img[alt="WebKey"]'
        ) as HTMLImageElement | null) ||
        (document.querySelector(
          'img[alt="Webkey"]'
        ) as HTMLImageElement | null);

      if (logoImg) {
        logoImg.style.filter = "";
      }
    };
  }, []);

  // ==========================
  // ANIMATIONS
  // ==========================

  // ΟΛΟ ΤΟ BLOCK (τίτλος + lottie)
  // 0.0–0.12: κρυφό
  // 0.12–0.58: full opacity
  // 0.58–0.7: fade-out λίγο πριν μεγαλώσει πολύ ο κύκλος
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.58, 0.7],
    [0, 1, 1, 0]
  );

  // Μαύρος κύκλος:
  // μέχρι 0.58: opacity 0
  // 0.6: μικρή τελεία στο κέντρο (scale 0.02)
  // 0.6–0.95: μεγαλώνει μέχρι να γεμίσει (scale 9)
  // 0.95–1: μένει ίδιος (χωρίς spike)
  const circleScale = useTransform(
    scrollYProgress,
    [0.6, 0.95, 1],
    [0.02, 9, 9]
  );

  const circleOpacity = useTransform(scrollYProgress, [0.58, 0.6], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό όταν σκοτεινιάσει
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.5, 0.75],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      {/* Το ύψος εδώ ορίζει πόσο “ταξιδεύει” το pinned section */}
      <div className="about-scroll-area">
        {/* Αυτό είναι το sticky μέρος που μένει στο κέντρο */}
        <div
          className={
            isPinned ? "about-sticky about-sticky-fixed" : "about-sticky"
          }
        >
          {/* Μαύρος κύκλος που μεγαλώνει */}
          <motion.div
            className="about-black-circle"
            style={{
              scale: circleScale,
              opacity: circleOpacity,
              x: "-50%",
              y: "-50%",
            }}
          />

          {/* Τίτλος + Lottie */}
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
              {/* Έγχρωμο scroll-down */}
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

              {/* Λευκό scroll-down στο μαύρο */}
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
