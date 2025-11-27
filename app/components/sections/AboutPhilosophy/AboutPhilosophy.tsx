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

  // Scroll progress μόνο για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // LanguageSwitcher χρώματα: μαύρο -> άσπρο όταν γεμίσει η βούλα / σκοτεινιάσει
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;
    const body = document.body;
    if (!body) return;

    // το πάμε πιο αργά (όταν σχεδόν έχει γεμίσει η βούλα)
    if (latest >= 0.8) {
      body.style.setProperty("--lang-switcher-text-color", "#ffffff");
      body.style.setProperty(
        "--lang-switcher-text-muted-color",
        "rgba(255,255,255,0.7)"
      );
    } else {
      body.style.setProperty("--lang-switcher-text-color", "#000000");
      body.style.setProperty(
        "--lang-switcher-text-muted-color",
        "rgba(0,0,0,0.6)"
      );
    }
  });

  // Cleanup όταν φύγουμε από το section / σελίδα
  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      const body = document.body;
      if (!body) return;
      body.style.removeProperty("--lang-switcher-text-color");
      body.style.removeProperty("--lang-switcher-text-muted-color");
    };
  }, []);

  // Χειροκίνητο "sticky" με fixed
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = section.offsetHeight;

      const startPin = sectionTop;
      const endPin = sectionTop + sectionHeight - viewportHeight;

      const y = window.scrollY;
      const pinnedNow = y >= startPin && y <= endPin;
      setIsPinned(pinnedNow);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /* ==========================
     ANIMATIONS
     ========================== */

  // Τίτλος: full opacity για ώρα, fade out όταν η βούλα έχει σχεδόν γεμίσει
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.7, 0.9],
    [1, 1, 0]
  );

  // Μαύρη βούλα να εμφανιστεί πιο αργά (μετά από 3-4 scroll περίπου)
  // Ξεκινά γύρω στο 0.45 και γεμίζει μέχρι ~0.9
  const circleScale = useTransform(scrollYProgress, [0.45, 0.9], [0, 5.5]);
  const circleOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό όταν έχει σχεδόν γεμίσει η βούλα
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.4, 0.65],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(
    scrollYProgress,
    [0.65, 0.85],
    [0, 1]
  );

  return (
    <section
      id="about-philosophy"
      className="about-section"
      ref={sectionRef}
    >
      {/* Το ύψος αυτού του wrapper καθορίζει πόσα scroll "ταξιδεύει" το pinned section */}
      <div className="about-scroll-area">
        {/* Αυτό είναι που μένει καρφωμένο στο κέντρο */}
        <div
          className={
            isPinned ? "about-sticky about-sticky-fixed" : "about-sticky"
          }
        >
          {/* Μαύρος κύκλος στο κέντρο που μεγαλώνει */}
          <motion.div
            className="about-black-circle"
            style={{ scale: circleScale, opacity: circleOpacity }}
          />

          {/* Τίτλος + Lottie, πάντα στο κέντρο όσο το section είναι ενεργό */}
          <motion.div
            className="about-title-block"
            style={{ opacity: titleOpacity }}
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
              {/* Έγχρωμο scroll-down στην αρχή */}
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

              {/* Λευκό scroll-down όταν πια έχει σκοτεινιάσει */}
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
