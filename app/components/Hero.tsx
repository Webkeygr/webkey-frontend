"use client";

import { motion, type Variants } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { usePageTransition } from "./PageTransition"; // ★ NEW IMPORT
import Iridescence from "./Iridescence";

/* ===================== ANIMATION VARIANTS ===================== */

// Όλο το content του hero (για stagger μεταξύ child animations)
const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.18,
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
      ease: "easeOut",
    },
  },
};

// Κειμενάκι + CTA
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
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition } = usePageTransition(); // ★ HOOK for transition

  const isEnglish = pathname.startsWith("/en");

  const titleLine1 = "The Key to the";
  const titleLine2 = "Future";

  const paragraph = isEnglish
    ? "We are a digital agency that challenges the ordinary. We create experiences, identities, and websites that don’t follow trends — they start them. For brands that are not just looking for a presence on the web, but a place in the future."
    : "Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο. Δημιουργούμε εμπειρίες, ταυτότητες και ιστοσελίδες που δεν ακολουθούν τάσεις — τις ξεκινούν. Για brands που δεν ψάχνουν απλώς παρουσία στο web, αλλά μία θέση στο μέλλον.";

  const cta = isEnglish ? "Start your project" : "Ξεκίνα το project σου";

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

      {/* ---------- MAIN CONTENT ---------- */}
      <motion.div
        className="hero-inner"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-line hero-line-1" variants={heroLineVariant}>
          <h1 className="hero-title font-ITC-Bold">{titleLine1}</h1>
        </motion.div>

        <motion.div className="hero-bottom-row" variants={heroLineVariant}>
          <div className="hero-line hero-line-3">
            <h1 className="hero-title font-ITC-Bold">{titleLine2}</h1>
          </div>

          <motion.div className="hero-text-block" variants={heroTextVariant}>
            <div className="hero-text-inner">
              <p>{paragraph}</p>

              {/* ★★★ CTA WITH PAGE TRANSITION ★★★ */}
              <a
                href="/contact"
                className="hero-cta"
                onClick={(e) => {
                  e.preventDefault();

                  startTransition("Contact", () => {
                    router.push("/contact");
                  });
                }}
              >
                {cta}
              </a>
              {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
