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
    // Αν ήδη τρέχει animation, μην ανάβεις δεύτερο overlay
    if (isAnimatingRef.current) {
      navigate();
      return;
    }

    clearHideTimeout();
    isAnimatingRef.current = true;
    setPageLabel(label);

    setIsActive(true);
    setPhase("fill"); // ξεκινάει το γέμισμα

    // 🔥 Κάνουμε ΑΜΕΣΩΣ navigate — η νέα σελίδα φορτώνει όσο γεμίζει & αδειάζει το ποτήρι
    navigate();
  }, []);

  const handleAnimationComplete = () => {
    if (phaseRef.current === "fill") {
      // Μόλις ΤΕΛΕΙΩΣΕ το γέμισμα → ξεκινάει το άδειασμα
      setPhase("empty");
      return;
    }

    if (phaseRef.current === "empty") {
      // Μόλις τελειώσει και το άδειασμα → κλείσε overlay με μικρό buffer
      isAnimatingRef.current = false;

      clearHideTimeout();
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsActive(false);
        setPhase("idle");
      }, 120); // λίγο buffer για να “κάτσει” η νέα σελίδα
    }
  };

  return (
    <PageTransitionContext.Provider value={{ startTransition }}>
      {children}

      {isActive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          {/* ΥΓΡΟ: γεμίζει κι αδειάζει από κάτω προς τα πάνω */}
          <div className="absolute inset-0 overflow-hidden flex items-end justify-center">
            <motion.div
              className="bg-black"
              style={{
                width: "220vw", // υπερβολικό πλάτος για να καλύπτει όλες τις οθόνες
                borderTopLeftRadius: "999px",
                borderTopRightRadius: "999px",
                boxShadow: "0 -24px 80px rgba(0,0,0,0.9)",
              }}
              initial={{ height: "0vh" }}
              animate={
                phase === "fill"
                  ? { height: "220vh" } // γεμίζει (πολύ πάνω από το viewport)
                  : { height: "0vh" } // αδειάζει
              }
              transition={{
                duration: 0.9, // πιο αργό fill/empty για να έχει χρόνο να φορτώσει η νέα σελίδα
                ease: [0.22, 1, 0.36, 1], // λίγο bouncy
              }}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>

          {/* Περιεχόμενο (logo + κείμενο) στο κέντρο */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-4 px-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                // Ορατά ΜΟΝΟ στο FILL – στο EMPTY εξαφανίζονται γρήγορα
                opacity: phase === "fill" ? 1 : 0,
                y: phase === "fill" ? 0 : -20,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="relative w-40 h-10 md:w-72 md:h-20 pointer-events-none">
                <Image
                  src="/images/logo-webkey-white.svg"
                  alt="Webkey"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400 pointer-events-none">
                Navigating to
              </p>

              <h2 className="text-8xl md:text-9xl font-bold text-white pointer-events-none">
                {pageLabel}
              </h2>
            </motion.div>
          </motion.div>
        </div>
      )}
    </PageTransitionContext.Provider>
  );
}
