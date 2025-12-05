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
  if (pathname === "/contact") return "Contact";

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

  // κρατάμε το ΠΡΩΤΟ pathname
  const initialPathRef = useRef<string | null>(null);
  // κρατάμε σε ποιο pathname έχουμε ήδη δείξει transition
  const lastPathRef = useRef<string | null>(null);

  // 1️⃣ Αρχικό pathname
  useEffect(() => {
    if (!pathname) return;
    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  // 2️⃣ Κάθε αλλαγή pathname → αποφασίζουμε αν θα δείξουμε transition
  useEffect(() => {
    if (!pathname) return;

    if (initialPathRef.current === null) {
      initialPathRef.current = pathname;
      lastPathRef.current = pathname;
      return;
    }

    // Πρώτο load στο αρχικό pathname → ποτέ transition
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

  // 3️⃣ Κλείσιμο overlay μετά από λίγο
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 850); // λίγο πιο “cinematic” για να προλάβει το grow

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            {/* Μαύρο “λαστιχένιο” bubble που μεγαλώνει σε fullscreen */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{
                scale: 0,
                borderRadius: "999px",
              }}
              animate={{
                scale: 1.1, // λίγο μεγαλύτερο από την οθόνη
                borderRadius: "0px",
              }}
              exit={{
                scale: 0.9,
                borderRadius: "999px",
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1], // cubic-bezier “λαστιχένιο”
              }}
            >
              <div className="w-[140vw] h-[140vh] bg-black" />
            </motion.div>

            {/* Περιεχόμενο (logo + κείμενα) πάνω από το bubble */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 text-center"
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 1.05,
                opacity: 0,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
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
