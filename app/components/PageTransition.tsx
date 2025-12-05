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

  // ΠΡΩΤΟ pathname (για να ΜΗ δείχνουμε loader στο πρώτο load)
  const initialPathRef = useRef<string | null>(null);
  // Τελευταίο pathname στο οποίο έχουμε ήδη δείξει transition
  const lastPathRef = useRef<string | null>(null);

  // 1️⃣ Αποθηκεύουμε το αρχικό pathname
  useEffect(() => {
    if (!pathname) return;
    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  // 2️⃣ Σε κάθε αλλαγή pathname, αποφασίζουμε αν θα δείξουμε transition
  useEffect(() => {
    if (!pathname) return;

    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
      return;
    }

    // Πρώτο load: δεν δείχνουμε τίποτα
    if (pathname === initialPathRef.current && lastPathRef.current === pathname) {
      return;
    }

    // Αν δεν άλλαξε σε σχέση με το τελευταίο, skip
    if (lastPathRef.current === pathname) {
      return;
    }

    // Πραγματικό navigation
    lastPathRef.current = pathname;
    setPageLabel(getPageLabel(pathname));
    setIsVisible(true);
  }, [pathname]);

  // 3️⃣ Κλείνουμε το overlay μετά από λίγο (να προλάβει γέμισμα + άδειασμα)
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1100); // ~1.1s συνολικά

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            // Το overlay είναι άμεσα fullscreen μαύρο (κρύβει τη νέα σελίδα)
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            {/* ΥΓΡΟ: γεμίζει από κάτω προς τα πάνω με bouncy spring */}
            <motion.div
              className="absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden"
            >
              <motion.div
                className="w-[120vw] bg-black"
                style={{
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  transformOrigin: "bottom center",
                  height: "120vh",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                }}
              />
            </motion.div>

            {/* Περιεχόμενο του loader (logo + κείμενα) πάνω από το “υγρό” */}
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
                stiffness: 200,
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

              {/* “app-like” αίσθηση */}
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
