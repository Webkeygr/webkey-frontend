"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextScrub } from "../ui/text-scrub";
import Lottie from "lottie-react";
import ServicesCards from "@/app/components/sections/ServicesCards";

type LottieData = Record<string, any>;

export default function ServicesIntro() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardsEndRef = useRef<HTMLDivElement | null>(null);

  // παίρνουμε απόλυτο scrollY (σε px) ώστε να μην κάνει lag
  const { scrollY } = useScroll();

  // ----------- Lottie data -----------
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

  // ----------- blur logic -----------
  // fade in του blur όταν ο τίτλος αρχίζει (περίπου στα 500px) και πλήρες στους 1500px
  const blurOpacity = useTransform(scrollY, [500, 1500], [0, 1]);
  // fade out σταδιακά στο τέλος των καρτών (~11000px → προσαρμόζεις αναλόγως)
  const blurEnd = useTransform(scrollY, [11000, 12000], [1, 0]);
  const finalOpacity = useTransform(() => blurOpacity.get() * blurEnd.get());

  // ----------- Lottie fade -----------
  const lottieFade = useTransform(scrollY, [600, 1600, 2200], [0, 1, 0]);

  return (
    <>
      {/* === Global fixed blur overlay === */}
      <motion.div
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{ opacity: finalOpacity }}
      >
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>

      <section ref={wrapRef} className="relative h-[680vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* === CONTENT === */}
          <div className="relative z-10 h-full">
            {/* Scrub layer (λέξη-λέξη) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6"
              aria-hidden="true"
            >
              <TextScrub
                as="h1"
                per="word"
                progress={blurOpacity} // χρησιμοποιούμε το ίδιο για ομαλή εμφάνιση
                window={0.08}
                className="font-[900] leading-[0.95] tracking-[-0.02em]
                           text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                           text-white/90"
              >
                Οι υπηρεσίες μας
              </TextScrub>
            </div>

            {/* Full layer */}
            <motion.h1
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none
                         text-center px-6
                         font-[900] leading-[0.95] tracking-[-0.02em]
                         text-[clamp(22px,4vw,70px)] md:text-[clamp(32px,5vw,90px)]
                         text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
              style={{ opacity: blurOpacity }}
            >
              Οι υπηρεσίες μας
            </motion.h1>

            {/* Lottie */}
            <motion.div
              className="absolute w-[126px] md:w-[144px] pointer-events-none z-[6]"
              style={{
                opacity: lottieFade,
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
        <div style={{ height: "90vh" }} /> {/* κενό για smooth transition */}
        <ServicesCards />
        <div ref={cardsEndRef} className="h-[10vh]" />
      </section>
    </>
  );
}
