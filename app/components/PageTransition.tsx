"use client";

import { ReactNode, useEffect, useState } from "react";
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
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [pageLabel, setPageLabel] = useState<string>("");

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    // όταν αλλάζει το pathname, ξεκινάει το transition
    setPageLabel(getPageLabel(pathname));
    setIsVisible(true);
  }, [pathname, isFirstLoad]);

  // κλείσιμο overlay μετά από λίγο
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 900); // πόση ώρα θα φαίνεται συνολικά

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            initial={{ scaleY: 0.0, borderRadius: "0% 0% 50% 50% / 0% 0% 12% 12%" }}
            animate={{
              scaleY: 1,
              borderRadius: "0%",
              transition: {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1], // λίγο “λαστιχένιο”
              },
            }}
            exit={{
              scaleY: 0,
              originY: 1,
              transition: {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            style={{ transformOrigin: "top" }}
          >
            <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
              {/* ΛΟΓΟΤΥΠΟ – βάλε εδώ το λευκό σου logo */}
              <div className="relative w-40 h-10 md:w-56 md:h-14">
                <Image
                  src="/images/logo-webkey-white.svg"
                  alt="Webkey"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* μικρή περιγραφή */}
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-neutral-400">
                Navigating to
              </p>

              {/* τίτλος σελίδας */}
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                {pageLabel}
              </h2>

              {/* “σαν app” feeling */}
              <p className="mt-2 text-sm text-neutral-500">
                Please wait a moment while we prepare your experience.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
