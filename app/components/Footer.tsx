"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FOOTER_EMAIL = "info@webkey.gr";
const FOOTER_PHONE = "+30 6985608579";

const menuItems = ["Υπηρεσίες", "Ποιοι Είμαστε", "Τα έργα μας", "Τα νέα μας"];

export default function Footer() {
  const ref = useRef<HTMLDivElement | null>(null);

  // Parallax: όσο μπαίνει στο viewport, ανεβαίνει λίγο πιο αργά
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  const handleCopyEmail = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(FOOTER_EMAIL);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <section
      ref={ref}
      className="relative h-screen bg-black text-white overflow-hidden"
    >
      {/* Parallax layer */}
      <motion.div
        style={{ y }}
        className="relative z-10 flex h-full flex-col"
      >
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-between py-12 md:py-16">
          {/* === Top: Logo + Menu === */}
          <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-center md:justify-between">
            {/* Left: Logo + tagline */}
            <div className="space-y-6 md:w-1/2">
              <div className="relative h-24 w-56 md:h-32 md:w-72">
                <Image
                  src="/images/logo-webkey-white.svg"
                  alt="Webkey logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <p className="text-lg font-semibold tracking-wide md:text-xl">
                The Key to the Future
              </p>
            </div>

            {/* Right: Menu + Newsletter */}
            <div className="md:w-1/2 md:max-w-sm">
              <nav className="space-y-3">
                {menuItems.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="group flex w-full items-center justify-between border-b border-white/70 pb-1 text-left text-lg tracking-wide transition-transform duration-200 hover:scale-[1.03]"
                  >
                    <span className="py-1">{label}</span>

                    {/* Arrow – εμφανίζεται μόνο στο hover */}
                    <span className="relative ml-3 flex h-6 w-10 items-center justify-end overflow-hidden">
                      <span className="inline-flex translate-x-2 items-center opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                        <span className="h-[1px] w-6 bg-white" />
                        <span className="-mr-0.5 ml-1 h-2 w-2 rotate-45 border-r border-t border-white" />
                      </span>
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mt-6">
                <button
                  type="button"
                  className="rounded-full border border-white px-6 py-2 text-sm font-medium tracking-wide transition-colors duration-200 hover:bg-white hover:text-black"
                >
                  Sign up to our newsletter
                </button>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div className="mt-12 border-t border-white/70" />

          {/* === Bottom: Email / Phone / Social === */}
          <div className="mt-4 flex flex-col items-start justify-between gap-4 text-sm md:flex-row md:items-center">
            {/* Email + phone */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Email with copy + bubble */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-sm tracking-wide transition-opacity hover:opacity-80"
                >
                  {FOOTER_EMAIL}
                </button>

                {/* Bubble "Copy email" */}
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-medium text-black opacity-0 shadow-lg transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
                  Copy email
                </span>
              </div>

              <span className="text-lg leading-none">•••</span>

              <span className="text-sm tracking-wide">{FOOTER_PHONE}</span>
            </div>

            {/* Social (χωρίς links για την ώρα) */}
            <div className="flex flex-wrap items-center gap-6 text-sm tracking-wide">
              <button
                type="button"
                className="transition-opacity hover:opacity-80"
              >
                LinkedIn ↗
              </button>
              <button
                type="button"
                className="transition-opacity hover:opacity-80"
              >
                Facebook ↗
              </button>
              <button
                type="button"
                className="transition-opacity hover:opacity-80"
              >
                Instagram ↗
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 flex justify-center text-xs tracking-wide text-white/70">
            ©Webkey 2025
          </div>
        </div>
      </motion.div>

      {/* Λίγο gradient πάνω για να “κουμπώνει” πάνω στο προηγούμενο section */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-black/0 to-black" />
    </section>
  );
}
