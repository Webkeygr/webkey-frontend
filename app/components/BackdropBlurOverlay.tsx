"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, MotionValue } from "framer-motion";

export default function BackdropBlurOverlay({
  opacity,
  zIndex = 1, // ΠΙΣΩ από περιεχόμενο
}: {
  opacity: MotionValue<number>;
  zIndex?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ opacity, zIndex }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          // Θολώνει ΜΟΝΟ ό,τι είναι από πίσω (hero/canvas), όχι το περιεχόμενο
          backdropFilter: "blur(80px) saturate(115%)",
          WebkitBackdropFilter: "blur(80px) saturate(115%)",
          // λίγο alpha για να ενεργοποιείται ο μηχανισμός
          background: "rgba(255,255,255,0.22)",
        }}
      />
    </motion.div>,
    document.body
  );
}
