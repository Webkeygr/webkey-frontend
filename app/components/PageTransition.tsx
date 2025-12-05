"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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

  const initialPathRef = useRef<string | null>(null);
  const lastPathRef = useRef<string | null>(null);

  // 1️⃣ Αποθήκευση αρχικού pathname (για να μην δείχνουμε loader στο πρώτο load)
  useEffect(() => {
    if (!pathname) return;
    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  // 2️⃣ Σε κάθε αλλαγή pathname, αποφασίζουμε αν θα παίξει το transition
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

    // Αν δεν άλλαξε από το τελευταίο, skip
    if (lastPathRef.current === pathname) {
      return;
    }

    // Πραγματικό navigation
    lastPathRef.current = pathname;
    setPageLabel(getPageLabel(pathname));
    setIsVisible(true);
  }, [pathname]);

  // 3️⃣ Κλείνουμε το overlay μετά από λίγο (να προλάβει fill + empty)
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1200); // ~1.2s συνολικά

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950/95"
            // πάντα fullscreen “σκοτείνιασμα” από το πρώτο frame
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            {/* ΥΓΡΟ: γεμίζει & αδειάζει με spring από κάτω προς τα πάνω */}
            <motion.div className="absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden pointer-events-none">
              <motion.div
                className="w-[130vw] bg-black shadow-[0_-20px_60px_rgba(0,0,0,0.7)]"
                style={{
                  borderTopLeftRadius: "999px",
                  borderTopRightRadius: "999px",
                  transformOrigin: "bottom center",
                  height: "140vh",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              />
            </motion.div>

            {/* Περιεχόμενο πάνω από το “υγρό” */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 text-center"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
