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

    const isDark = latest >= 0.8;

    // 1) GR / EN labels
    const labels = document.querySelectorAll<HTMLElement>(".lang-label");
    labels.forEach((el) => {
      el.style.color = isDark ? "#ffffff" : "";
    });

    // 2) Logo στο BubbleMenu: η πρώτη εικόνα με class .site-logo
    const logoImg = document.querySelector<HTMLImageElement>("img.site-logo");
    if (logoImg) {
      // στο μαύρο → λευκό logo, στο κανονικό → όπως πριν
      logoImg.style.filter = isDark ? "brightness(0) invert(1)" : "";
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

  // Τίτλος + lottie – ενιαίο opacity:
  // 0–0.12: κρυφό, 0.12–0.58: full, 0.58–0.7: fade out
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.12, 0.7],
    [0, 1, 1, 0]
  );

  // Κύκλος:
  // μέχρι 0.58: αόρατος
  // 0.6: μικρή τελεία
  // 0.6–0.95: μεγαλώνει σε scale 9
  // 0.95–1: μένει ίδιος (full black, χωρίς spike)
  const circleScale = useTransform(
    scrollYProgress,
    [0.5, 0.95, 1],
    [0.02, 9, 9]
  );

  const circleOpacity = useTransform(scrollYProgress, [0.48, 0.55], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό όσο σκοτεινιάζει
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.5, 0.75],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

  return (
    <section id="about-philosophy" className="about-section" ref={sectionRef}>
      <div className="about-scroll-area">
        <div
          className={
            isPinned ? "about-sticky about-sticky-fixed" : "about-sticky"
          }
        >
          {/* Μαύρος κύκλος */}
          <motion.div
            className="about-black-circle"
            style={{
              scale: circleScale,
              opacity: circleOpacity,
              x: "-50%",
              y: "-50%",
            }}
          />

          {/* Τίτλος + lottie */}
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

          {/* ΕΔΩ μετά θα μπουν οι καρτέλες */}
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophy;
