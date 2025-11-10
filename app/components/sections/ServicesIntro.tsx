"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";

type LottieData = Record<string, any>;
const LOTTIE_OFFSET = 110;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ---- ΤΙΤΛΟΣ: λίγα scrolls, λίγο μεγαλύτερο hold ---- */
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.06, 0.22, 0.5, 0.56],
    [0, 1, 1, 0]
  );
  const titleScale = useTransform(scrollYProgress, [0.08, 0.24], [0.985, 1]);
  const titleY = useTransform(scrollYProgress, [0.5, 0.5], [0, -50]);

  /* ---- SMOOTH BLUR στο background (όχι overlay) ----
     Widen range + spring για να «μπει» ομαλά.
  */
  const blurBase = useTransform(scrollYProgress, [0.1, 0.3], [0, 24], {
    clamp: true,
  });
  const blurSmooth = useSpring(blurBase, {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
  });

  useMotionValueEvent(blurSmooth, "change", (v) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--hero-blur", `${v}px`);
    }
  });
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--hero-blur", `0px`);
      }
    };
  }, []);

  /* ---- LOTTIE μαζί με τον τίτλο ---- */
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
  const lottieOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.12, 0.38],
    [0, 1, 0]
  );

  return (
    <section ref={wrapRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 h-full">
          <motion.h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       text-center px-6 select-none
                       font-[900] leading-[0.95] tracking-[-0.02em]
                       text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                       text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
          >
            Οι υπηρεσίες μας
          </motion.h1>

          <motion.div
            className="absolute w-[120px] md:w-[140px] pointer-events-none z-[12] will-change-[opacity,transform]"
            style={{
              opacity: lottieOpacity,
              left: "50%",
              top: `calc(50% + ${LOTTIE_OFFSET}px)`,
              transform: "translateX(-50%)",
            }}
            aria-hidden="true"
          >
            {lottieData ? (
              <Lottie animationData={lottieData} loop autoplay />
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
