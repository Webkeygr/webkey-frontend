"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;

/* Tunables */
const TITLE_REVEAL_START = 0.02; // πότε ξεκινά να αποκαλύπτεται ο τίτλος
const BLUR_FADEIN_LEN = 0.1; // διάρκεια του fade-in του blur
const GAP_AFTER_TITLE_VH = 90; // 1–2 scrolls πριν ξεκινήσουν οι κάρτες

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  /* Progress ολόκληρου του section (χωρίς spring για να μην αργεί στο scroll-down) */
  const { scrollYProgress: sec } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ---------------- Τίτλος ---------------- */
  const reveal = useTransform(
    sec,
    [TITLE_REVEAL_START, TITLE_REVEAL_START + 0.22],
    [0, 1],
    { clamp: true }
  );
  const scrubOpacity = useTransform(
    sec,
    [TITLE_REVEAL_START + 0.24, TITLE_REVEAL_START + 0.36],
    [1, 0],
    { clamp: true }
  );
  const fullOpacity = useTransform(
    sec,
    [
      TITLE_REVEAL_START + 0.28,
      TITLE_REVEAL_START + 0.4,
      TITLE_REVEAL_START + 0.48,
      TITLE_REVEAL_START + 0.56,
    ],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const fullY = useTransform(
    sec,
    [TITLE_REVEAL_START + 0.48, TITLE_REVEAL_START + 0.64],
    [0, -40],
    { clamp: true }
  );

  /* ---------------- Global BLUR / DIM (fixed overlay) ----------------
     - Fade-in ΜΟΛΙΣ ξεκινά ο τίτλος
     - Κρατά 1 μέχρι το τέλος των καρτών (ΔΕΝ σβήνει νωρίτερα)
     - Καμία εξάρτηση από sentinels → κανένα “σκαλί”
  -------------------------------------------------------------------- */
  const blurOpacity = useTransform(
    sec,
    [
      TITLE_REVEAL_START,
      TITLE_REVEAL_START + BLUR_FADEIN_LEN,
      TITLE_REVEAL_START + BLUR_FADEIN_LEN + 0.001,
      1,
    ],
    [0, 1, 1, 1], // μόλις ανάψει → μένει 1 μέχρι το τέλος
    { clamp: true }
  );
  // dim = 12% της έντασης του blur
  const dimOpacity = useTransform(blurOpacity, [0, 1], [0, 0.12], {
    clamp: true,
  });

  /* ---------------- Lottie ----------------
     εμφανίζεται με τον τίτλο και fade-out λίγο πριν τις κάρτες
  --------------------------------------------------------------- */
  const lottieOpacity = useTransform(
    sec,
    [
      TITLE_REVEAL_START + 0.02,
      TITLE_REVEAL_START + 0.18,
      TITLE_REVEAL_START + 0.32,
    ],
    [0, 1, 0],
    { clamp: true }
  );

  /* Lottie data */
  const [lottieData, setLottieData] = useState<LottieData | null>(null);
  useEffect(() => {
    (async () => {
      try {
        let r = await fetch("/lottie/scroll-down.json");
        if (!r.ok) r = await fetch("/lottie/scroll%20down.json");
        if (r.ok) setLottieData(await r.json());
      } catch {
        setLottieData(null);
      }
    })();
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[680vh]">
      {/* === ΕΝΑ & ΜΟΝΟ overlay για όλη τη ροή (intro + κάρτες) === */}
      {/* Το βάζουμε ΠΑΝΩ από όλα, αλλά κάτω από το περιεχόμενο (pointer-events-none) */}
      <motion.div
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{ opacity: blurOpacity }}
      >
        {/* Κλειδί για να “πιάνει” πραγματικά το backdrop blur */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[40px]" />
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: dimOpacity }}
        />
      </motion.div>

      <div className="sticky top-0 h-screen overflow-hidden isolate">
        {/* === CONTENT === */}
        <div className="relative z-10 h-full">
          {/* Scrub layer (λέξη-λέξη) */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6"
            style={{ opacity: scrubOpacity }}
            aria-hidden="true"
          >
            <TextScrub
              as="h1"
              per="word"
              progress={reveal}
              window={0.08}
              className="font-[900] leading-[0.95] tracking-[-0.02em]
                         text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                         text-white/90"
            >
              Οι υπηρεσίες μας
            </TextScrub>
          </motion.div>

          {/* Full layer */}
          <motion.h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none
                       text-center px-6
                       font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            style={{ opacity: fullOpacity, y: fullY }}
          >
            Οι υπηρεσίες μας
          </motion.h1>

          {/* Lottie: χαμηλά στο κέντρο, 15% μικρότερο */}
          <motion.div
            className="absolute w-[126px] md:w-[144px] pointer-events-none z-[6]"
            style={{
              opacity: lottieOpacity,
              left: "50%",
              bottom: "14vh",
              transform: "translateX(-50%)",
            }}
          >
            {lottieData ? (
              <Lottie animationData={lottieData} loop autoplay />
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* +1–2 scrolls κενό ώστε ο τίτλος να φαίνεται πλήρως πριν τις κάρτες */}
      <div style={{ height: `${GAP_AFTER_TITLE_VH}vh` }} />

      {/* Κάρτες */}
      <ServicesCards />
    </section>
  );
}
