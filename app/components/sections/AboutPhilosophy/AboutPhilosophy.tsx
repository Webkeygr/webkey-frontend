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

  // LanguageSwitcher χρώματα: μαύρο -> άσπρο όταν σχεδόν έχει γεμίσει η βούλα
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window === "undefined") return;
    const body = document.body;
    if (!body) return;

    if (latest >= 0.86) {
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

  // Τίτλος: μένει full opacity για πολύ, fade out ΠΡΙΝ γεμίσει ο κύκλος
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.82, 0.95],
    [1, 1, 0]
  );

  // Μαύρη βούλα:
  // - ξεκινάει αρκετά αργά (για 3–4 scrolls τίτλο)
  // - μεγαλώνει ΠΟΛΥ ώστε να καλύπτει άνετα ultrawide / 4K
  const circleScale = useTransform(scrollYProgress, [0.6, 0.96], [0, 9]);
  const circleOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

  // Lottie: έγχρωμο στην αρχή, λευκό όταν έχει σχεδόν γεμίσει η βούλα
  const colorLottieOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.5, 0.75],
    [1, 1, 0]
  );
  const whiteLottieOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.9],
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
            style={{
              scale: circleScale,
              opacity: circleOpacity,
              x: "-50%",
              y: "-50%",
            }}
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
