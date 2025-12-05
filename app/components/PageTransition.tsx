"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
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

export default function PageTransition({ children }: PageTransitionProps) {
  const [isActive, setIsActive] = useState(false);
  const [pageLabel, setPageLabel] = useState<string>("");
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTransition = useCallback(
    (label: string, navigate: () => void) => {
      clearTimer();

      setPageLabel(label);
      setIsActive(true);

      // κάνουμε αμέσως navigation – η νέα σελίδα φορτώνει από πίσω
      navigate();

      // κλείνουμε το overlay όταν τελειώσει το animation (fill + empty)
      timeoutRef.current = window.setTimeout(() => {
        setIsActive(false);
      }, 1100); // πρέπει να ταιριάζει με το duration του animation
    },
    []
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <PageTransitionContext.Provider value={{ startTransition }}>
      {children}

      {isActive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950">
          {/* ΥΓΡΟ: γεμίζει και αδειάζει από κάτω προς τα πάνω */}
          <div className="absolute inset-0 overflow-hidden flex items-end justify-center pointer-events-none">
            <motion.div
              className="w-[140vw] bg-black"
              style={{
                borderTopLeftRadius: "999px",
                borderTopRightRadius: "999px",
                height: "160vh",
                transformOrigin: "bottom center",
                boxShadow: "0 -24px 80px rgba(0,0,0,0.9)",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1.05, 1, 0] }} // γεμίζει → λίγο overshoot → σταθεροποιείται → αδειάζει
              transition={{
                duration: 1.1,
                ease: "easeInOut",
                times: [0, 0.35, 0.45, 1],
              }}
            />
          </div>

          {/* Περιεχόμενο πάνω από το “υγρό” */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
            }}
          >
            {/* Λευκό λογότυπο */}
            <div className="relative w-40 h-10 md:w-56 md:h-14">
              <Image
                src="/images/logo-webkey-white.svg"
                alt="Webkey"
                fill
                className="object-contain"
                priority
              />
            </div>

            <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400">
              Navigating to
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              {pageLabel}
            </h2>

            <p className="mt-2 text-xs md:text-sm text-neutral-500">
              Please wait a moment while we prepare your experience.
            </p>
          </motion.div>
        </div>
      )}
    </PageTransitionContext.Provider>
  );
}
