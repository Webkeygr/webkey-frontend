// app/components/Hero.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Iridescence from "./Iridescence";

/* ===================== ANIMATION VARIANTS ===================== */

// Όλο το content του hero (για stagger μεταξύ child animations)
const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25, // πόσο θα περιμένει πριν αρχίσει το stagger
      staggerChildren: 0.18, // διαφορά χρόνου μεταξύ των γραμμών
    },
  },
};

// Κάθε γραμμή του τίτλου
const heroLineVariant: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut", // ασφαλές για Typescript
    },
  },
};

// Κειμενάκι + CTA (λίγο πιο “μαλακό”, με delay)
const heroTextVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: "easeOut",
    },
  },
};

// Background / wave zoom-out
const heroBgVariant: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.6,
      ease: "easeInOut",
    },
  },
};

/* ========================== COMPONENT ========================= */

export default function Hero() {
  return (
    <section className="hero-wrapper">
      {/* ---------- BACKGROUND / IRIDESCENCE ---------- */}
      <div className="hero-bg">
        <motion.div
          className="hero-iridescence"
          variants={heroBgVariant}
          initial="hidden"
          animate="visible"
        >
          <Iridescence
            className="hero-iridescence"
            mouseReact={true}
            speed={1.9}
            amplitude={0.1}
            opacity={0.9}
            scale={1.1}
            cutRadius={130}
            cutFeather={90}
            cutStrength={0.012}
            waveWidth={58}
            waveOpacity={0.95}
            colorA="#FF00F2"
            colorB="#0090FF"
            bandTopPct={0.22}
            bandBottomPct={0.7}
            bandFeatherPx={90}
            ampMainFactor={0.34}
            ampSubFactor={0.16}
            yOffsetPct={0.1}
          />
        </motion.div>
      </div>

      {/* ---------- MAIN CONTENT (ΚΟΚΚΙΝΟ CONTAINER 1900px) ---------- */}
      <motion.div
        className="hero-inner"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Γραμμή 1: "Το κλειδί" */}
        <motion.div
          className="hero-line hero-line-1"
          variants={heroLineVariant}
        >
          <h1 className="hero-title font-ITC-Bold">Το κλειδί</h1>
        </motion.div>

        {/* Γραμμή 2: "για το Ψηφιακό" */}
        <motion.div
          className="hero-line hero-line-2"
          variants={heroLineVariant}
        >
          <h1 className="hero-title font-ITC-Bold">για το Ψηφιακό</h1>
        </motion.div>

        {/* Κάτω row: "Μέλλον" + κειμενάκι/CTA δίπλα */}
        <motion.div className="hero-bottom-row" variants={heroLineVariant}>
          <div className="hero-line hero-line-3">
            <h1 className="hero-title font-ITC-Bold">Μέλλον</h1>
          </div>

          <motion.div className="hero-text-block" variants={heroTextVariant}>
            <p>
              Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο.
              Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν
              ακολουθούν τάσεις — τις ξεκινούν. Για brands που δεν ψάχνουν απλώς
              παρουσία στο web, αλλά μία θέση στο μέλλον.
            </p>

            <Link href="/contact" className="hero-cta">
              Ξεκλείδωσε το project σου
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
