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

  // κρατάμε αν είναι το ΠΡΩΤΟ render
  const isFirstRenderRef = useRef(true);
  // κρατάμε ποιο ήταν το προηγούμενο pathname
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // 👉 ΠΡΩΤΟ LOAD: δεν δείχνουμε ΠΟΤΕ overlay
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // Αν το pathname δεν άλλαξε, δεν κάνουμε τίποτα
    if (prevPathnameRef.current === pathname) {
      return;
    }

    // Από εδώ και πέρα έχουμε ΠΡΑΓΜΑΤΙΚΗ αλλαγή route
    prevPathnameRef.current = pathname;

    setPageLabel(getPageLabel(pathname));
    setIsVisible(true);
  }, [pathname]);

  // πόση ώρα μένει το overlay πριν αρχίσει να κλείνει
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 650); // ~0.65s πριν το exit animation

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
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
            <motion.div
              className="flex flex-col items-center justify-center gap-4 px-6 text-center"
              initial={{
                scale: 0.85,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{
                scale: 1.05,
                opacity: 0,
                transition: {
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              {/* ΛΟΓΟΤΥΠΟ – λευκό */}
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
