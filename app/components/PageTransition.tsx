"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

type PageTransitionProps = {
  children: ReactNode;
};

function getPageLabel(pathname: string | null): string {
  if (!pathname || pathname === "/") return "Home";
  if (pathname === "/en" || pathname === "/en/") return "Home";
  if (pathname === "/contact") return "Contact";
  if (pathname === "/en/contact") return "Contact";

  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";

  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(false);
  const [pageLabel, setPageLabel] = useState<string>("");

  // Πρώτο pathname (για να ΜΗ δείχνουμε loader στο αρχικό page load)
  const initialPathRef = useRef<string | null>(null);
  // Τελευταίο pathname στο οποίο έχουμε ήδη δείξει transition
  const lastPathRef = useRef<string | null>(null);

  // Αποθήκευση αρχικού pathname
  useEffect(() => {
    if (!pathname) return;
    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  // Σε κάθε αλλαγή pathname αποφασίζουμε αν θα δείξουμε transition
  useEffect(() => {
    if (!pathname) return;

    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
      return;
    }

    // Πρώτο load → ποτέ transition
    if (pathname === initialPathRef.current && lastPathRef.current === pathname) {
      return;
    }

    // Αν δεν έχει αλλάξει από το τελευταίο, skip
    if (lastPathRef.current === pathname) {
      return;
    }

    // Πραγματικό navigation
    lastPathRef.current = pathname;
    setPageLabel(getPageLabel(pathname));
    setIsVisible(true);
  }, [pathname]);

  return (
    <>
      {children}

      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
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
              animate={{ scaleY: [0, 1.05, 1, 0] }} // γεμίζει → μικρό overshoot → σταθεροποίηση → αδειάζει
              transition={{
                duration: 1.1,
                ease: "easeInOut",
                times: [0, 0.35, 0.45, 1],
              }}
              onAnimationComplete={() => {
                // όταν τελειώσει ΟΛΟ το fill+empty, κλείνουμε το overlay
                setIsVisible(false);
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

            {/* μικρό label */}
            <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400">
              Navigating to
            </p>

            {/* τίτλος σελίδας */}
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              {pageLabel}
            </h2>

            <p className="mt-2 text-xs md:text-sm text-neutral-500">
              Please wait a moment while we prepare your experience.
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
}
