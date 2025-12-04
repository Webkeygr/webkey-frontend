"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";

import "./AboutPhilosophy.css";

import scrollDownColor from "@/app/lottie/scroll-down.json";
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

import GlitchText from "./GlitchText";

const AboutPhilosophy: React.FC = () => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  /* ===========================
     TEXT GR + EN
  ============================ */
  const titleText = isEnglish ? "Who We Are" : "Ποιοι Είμαστε";

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

    // GR / EN labels
    const labels = document.querySelectorAll<HTMLElement>(".lang-label");
    labels.forEach((el) => {
      el.style.color = isDark ? "#ffffff" : "";
    });

    // Logo στο BubbleMenu
    const logoImg = document.querySelector<HTMLImageElement>("img.site-logo");
    if (logoImg) {
      logoImg.style.filter = isDark ? "brightness(0) invert(1)" : "";
    }
  });

  // Cleanup όταν φύγει το component
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

  const contentOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.12, 0.12, 0.7],
    [0, 1, 1, 0]
  );

  const circleScale = useTransform(
    scrollYProgress,
    [0.43, 0.95, 1],
    [0.02, 9, 9]
  );

  const circleOpacity = useTransform(scrollYProgress, [0.35, 0.4], [0, 1]);

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
              {titleText}
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

          {/* ΕΔΩ μπαίνουν οι ScrollCards */}
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophy;
