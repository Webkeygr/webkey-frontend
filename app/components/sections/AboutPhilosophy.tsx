"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

/**
 * Section "Ποιοι είμαστε / Φιλοσοφία"
 * ΜΟΝΟ εδώ:
 * - σβήνει σταδιακά το blur του hero
 * - αυξάνει το --bg-morph 0→1, που το διαβάζει το Iridescence και μαζεύει τις γραμμές σε «σφαίρα»
 */
export default function AboutPhilosophy() {
  const ref = useRef<HTMLDivElement | null>(null);

  // 0..1 όσο "περνάμε" αυτό το section (start=κάτω, end=πάνω)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* ---------- 1) Σβήσιμο blur hero ---------- */
  // από 24px → 0px στα πρώτα ~20% του section
  const blurBase = useTransform(scrollYProgress, [0.0, 0.2], [24, 0], {
    clamp: true,
  });
  const blurSmooth = useSpring(blurBase, {
    stiffness: 70,
    damping: 20,
    mass: 0.4,
  });

  useMotionValueEvent(blurSmooth, "change", (v) => {
    document.documentElement.style.setProperty("--hero-blur", `${v}px`);
  });

  /* ---------- 2) Morph factor για τη «σφαίρα» ---------- */
  // 0 → 1 σε όλο το section
  const morphBase = useTransform(scrollYProgress, [0, 1], [0, 1], {
    clamp: true,
  });
  const morphSmooth = useSpring(morphBase, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  useMotionValueEvent(morphSmooth, "change", (v) => {
    document.documentElement.style.setProperty("--bg-morph", `${v}`);
  });

  // safety: αν βγεις απ' τη σελίδα, κάνε reset
  useEffect(() => {
    return () => {
      const root = document.documentElement;
      root.style.setProperty("--bg-morph", "0");
      root.style.setProperty("--hero-blur", "0px");
    };
  }, []);

  return (
    <section ref={ref} className="relative min-h-[220vh]">
      {/* Πάνελ 1 - sticky full screen με headline */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.h2 className="text-[clamp(28px,6vw,64px)] font-extrabold tracking-tight">
            Ποιοι είμαστε
          </motion.h2>
          <p className="mt-4 text-[clamp(14px,1.4vw,20px)] text-neutral-700 leading-relaxed">
            Είμαστε ένα digital agency που αμφισβητεί το συνηθισμένο. Δημιουργούμε
            εμπειρίες, ταυτότητες και ιστοσελίδες που δεν ακολουθούν τάσεις —
            τις ξεκινούν. Για brands που δεν ψάχνουν απλώς παρουσία στο web,
            αλλά μια θέση στο μέλλον.
          </p>
        </div>
      </div>

      {/* Πάνελ 2 - extra περιεχόμενο */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="text-left">
            <h3 className="text-2xl md:text-3xl font-bold">Φιλοσοφία</h3>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              Δεν πιστεύουμε σε έτοιμες λύσεις και templates. Κάθε project
              ξεκινά από το γιατί: τι χρειάζεται το brand, ποιον εξυπηρετεί
              και τι αξία δημιουργεί. Ο σχεδιασμός, η τεχνολογία και το
              περιεχόμενο δουλεύουν μαζί — όχι σε σιλό.
            </p>
          </div>
          <div className="text-left">
            <h3 className="text-2xl md:text-3xl font-bold">Προσέγγιση</h3>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              Από το research και τα workshops, μέχρι τα design systems και
              το development, λειτουργούμε σε μικρά, γρήγορα loops.
              Μετρήσιμα βήματα, διάφανη επικοινωνία και συνεχές refinement
              πάνω σε πραγματικά δεδομένα — όχι μόνο αισθητική.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
