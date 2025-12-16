"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type PageTransitionContextValue = {
  startTransition: (label: string, navigate: () => void) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null
);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used inside <PageTransition> provider"
    );
  }
  return ctx;
}

type PageTransitionProps = {
  children: ReactNode;
};

type Phase = "idle" | "fill" | "empty";

export default function PageTransition({ children }: PageTransitionProps) {
  const [isActive, setIsActive] = useState(false);
  const [pageLabel, setPageLabel] = useState<string>("");

  const [phase, _setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const isAnimatingRef = useRef(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const setPhase = (next: Phase) => {
    phaseRef.current = next;
    _setPhase(next);
  };

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const startTransition = useCallback((label: string, navigate: () => void) => {
    if (isAnimatingRef.current) {
      navigate();
      return;
    }

    clearHideTimeout();
    isAnimatingRef.current = true;
    setPageLabel(label);

    setIsActive(true);
    setPhase("fill");

    // ✅ navigate αμέσως (για να μην “spike” η προηγούμενη σελίδα)
    navigate();
  }, []);

  const handleAnimationComplete = () => {
    if (phaseRef.current === "fill") {
      setPhase("empty");
      return;
    }

    if (phaseRef.current === "empty") {
      isAnimatingRef.current = false;

      clearHideTimeout();
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsActive(false);
        setPhase("idle");
      }, 120);
    }
  };

  return (
    <PageTransitionContext.Provider value={{ startTransition }}>
      {children}

      {isActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* ΥΓΡΟ: γεμίζει & αδειάζει από κάτω προς τα πάνω */}
          <div className="absolute inset-0 overflow-hidden flex items-end justify-center">
            <motion.div
              className="bg-black"
              style={{
                width: "220vw",
                borderTopLeftRadius: "999px",
                borderTopRightRadius: "999px",
                boxShadow: "0 -24px 80px rgba(0,0,0,0.9)",
              }}
              initial={{ height: "0vh" }}
              animate={
                phase === "fill" ? { height: "220vh" } : { height: "0vh" }
              }
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>

          {/* ✅ CONTENT: absolute center (ΠΟΤΕ δεν στραβώνει) */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-4 px-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: phase === "fill" ? 1 : 0,
                y: phase === "fill" ? 0 : -20,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="relative w-56 h-14 md:w-72 md:h-20 pointer-events-none">
                <Image
                  src="/images/logo-webkey-white.svg"
                  alt="Webkey"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <p className="mt-3 text-xs md:text-sm uppercase tracking-[0.35em] text-neutral-400 pointer-events-none">
                Navigating to
              </p>

              <h2 className="text-7xl md:text-8xl font-semibold text-white pointer-events-none whitespace-nowrap">
                {pageLabel}
              </h2>
            </motion.div>
          </div>
        </div>
      )}
    </PageTransitionContext.Provider>
  );
}
