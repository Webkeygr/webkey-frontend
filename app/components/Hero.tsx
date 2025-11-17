// app/components/Hero.tsx
"use client";

import { motion } from "framer-motion";

/* ===================== ANIMATION VARIANTS ===================== */

// Όλο το content του hero (για stagger)
const heroContainer = {
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
const heroLineVariant = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.33, 1, 0.68, 1], // ease τύπου Kota
    },
  },
};

// Κειμενάκι + CTA (λίγο πιο «μαλακό», με delay)
const heroTextVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: [0.25, 0.9, 0.3, 1],
    },
  },
};

// Background / wave zoom-out
const heroBgVariant = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
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
          {/* 
            Βάλε εδώ μέσα Ο,ΤΙ είχες πριν για το wave / Iridescence.
            Π.χ. αν είχες component:
            
            <Iridescence className="w-full h-full" mouseReact speed={1.9} />
          
            (κράτα το import όπως το είχες στο παλιό Hero.tsx)
          */}
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
          <h1 className="hero-title">Το κλειδί</h1>
        </motion.div>

        {/* Γραμμή 2: "για το Ψηφιακό" */}
        <motion.div
          className="hero-line hero-line-2"
          variants={heroLineVariant}
        >
          <h1 className="hero-title">για το Ψηφιακό</h1>
        </motion.div>

        {/* Κάτω row: "Μέλλον" + κείμενο/CTA δίπλα */}
        <motion.div className="hero-bottom-row" variants={heroLineVariant}>
          <div className="hero-line hero-line-3">
            <h1 className="hero-title">Μέλλον</h1>
          </div>

          <motion.div className="hero-text-block" variants={heroTextVariant}>
            <p>
              Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο.
              Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν
              ακολουθούν τάσεις — τις ξεκινούν. Για brands που δεν ψάχνουν απλώς
              παρουσία στο web, αλλά μία θέση στο μέλλον.
            </p>

            <a href="#contact" className="hero-cta">
              Ξεκλείδωσε το project σου
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
