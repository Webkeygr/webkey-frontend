"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";

import GlitchText from "./GlitchText";

// χρωματιστό πριν γίνει μαύρο
import scrollDownColor from "@/app/lottie/scroll-down.json";
// λευκό αφού γεμίσει η οθόνη μαύρο
import scrollDownWhite from "@/app/lottie/scroll-down-white.json";

const AboutPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Τίτλος: εμφανίζεται, μένει λίγο, μετά σβήνει
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.25, 0.35],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.35, 0.5],
    [40, 0, 0, -30]
  );

  // Μαύρος κύκλος: από «ανύπαρκτος» μέχρι full screen
  const circleScale = useTransform(scrollYProgress, [0.2, 0.75], [0, 5.2]);
  const circleOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);

  // Λευκό Lottie: μόνο όταν έχει σχεδόν γεμίσει μαύρο
  const whiteLottieOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.65],
    [0, 1]
  );

  return (
    <section
      id="about-philosophy"
      className="about-section"
      ref={sectionRef}
    >
      {/* STAGE ΠΟΥ ΕΙΝΑΙ STICKY */}
      <div className="about-sticky-layer">
        {/* Μαύρος κύκλος στο κέντρο */}
        <motion.div
          className="about-black-circle"
          style={{ scale: circleScale, opacity: circleOpacity }}
        />

        {/* Τίτλος + χρωματιστό Lottie – μένουν καρφωμένα (sticky) */}
        <motion.div
          className="about-title-block"
          style={{ opacity: titleOpacity, y: titleY }}
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
            <Lottie
              animationData={scrollDownColor}
              loop
              className="about-lottie"
            />
          </div>
        </motion.div>

        {/* Λευκό Lottie, μόνο όταν πια έχει γίνει μαύρη η οθόνη */}
        <motion.div
          className="about-lottie-white-wrapper"
          style={{ opacity: whiteLottieOpacity }}
        >
          <Lottie
            animationData={scrollDownWhite}
            loop
            className="about-lottie about-lottie-white"
          />
        </motion.div>

        {/* ΕΔΩ θα βάλουμε μετά τις κάρτες μέσα στο μαύρο φόντο */}
      </div>
    </section>
  );
};

export default AboutPhilosophy;
