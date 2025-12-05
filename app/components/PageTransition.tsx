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

  // Δεν δείχνουμε loader στο πρώτο page load
  const initialPathRef = useRef<string | null>(null);
  const lastPathRef = useRef<string | null>(null);

  // Αποθήκευση αρχικού pathname
  useEffect(() => {
    if (!pathname) return;
    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  // On route change → αποφασίζουμε αν θα δείξουμε transition
  useEffect(() => {
    if (!pathname) return;

    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
      return;
    }

    // πρώτο load → ποτέ transition
    if (pathname === initialPathRef.current && lastPathRef.current === pathname) {
      return;
    }

    // ίδιο pathname με πριν → skip
    if (lastPathRef.current === pathname) {
      return;
    }

    // πραγματικό navigation
    lastPathRef.current = pathname;
    setPageLabel(getPageLabel(pathname));
    setIsVisible(true);
  }, [pathname]);

  // Κλείνουμε το overlay μετά από λίγο (να προλάβει fill + empty)
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1100); // ~1.1s

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            // FULLSCREEN OVERLAY – σταθερά σκούρο, χωρίς fade “flash”
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900"
            initial={false} // δεν κάνει κανένα initial animation στο overlay
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }} // δεν κάνουμε fade-out στο background, μόνο στο “υγρό”
          >
            {/* ΥΓΡΟ: γεμίζει & αδειάζει με bouncy spring */}
            <div className="absolute inset-0 overflow-hidden flex items-end justify-center pointer-events-none">
              <motion.div
                className="w-[140vw] bg-black"
                style={{
                  borderTopLeftRadius: "999px",
                  borderTopRightRadius: "999px",
                  height: "150vh",
                  transformOrigin: "bottom center",
                  boxShadow: "0 -24px 80px rgba(0,0,0,0.9)",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1.15, 1] }} // μικρό overshoot σαν υγρό
                exit={{ scaleY: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.8,
                }}
              />
            </div>

            {/* Περιεχόμενο πάνω από το “υγρό” */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
