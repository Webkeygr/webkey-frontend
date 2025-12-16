"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import "./HeroGalleryScroll.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/app/components/PageTransition";

const BentoScroll: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition } = usePageTransition();
  const isEnglish = pathname.startsWith("/en");

  /* ===========================
     TEXT GR + EN
  ============================ */
  const eyebrow = "PORTFOLIO";
  const title = isEnglish ? "Selected Work" : "Επιλεγμένα έργα"; // ίδιο και στις 2 γλώσσες, αλλά μπορείς να το καθορίσεις
  const subtitle = isEnglish
    ? "Digital experiences designed for brands that want to stand out."
    : "Ψηφιακές εμπειρίες σχεδιασμένες για brands που θέλουν να ξεχωρίζουν.";

  const btnPrimary = isEnglish ? "View projects" : "Δες τα projects";
  const btnSecondary = isEnglish ? "Book a meeting" : "Κλείσε ραντεβού";

  const ctaPrimary = isEnglish ? "View portfolio" : "Δείτε το portfolio";
  const ctaSecondary = isEnglish ? "Book a meeting" : "Κλείσε ραντεβού";

  /* ===========================
     SCROLL / ANIMATION LOGIC (UNCHANGED)
  ============================ */

  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const galleryScale = useTransform(scrollYProgress, [0, 0.7], [1.4, 1]);
  const galleryY = useTransform(scrollYProgress, [0, 0.7], [60, 0]);

  const headerOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.15, 0.4], [30, 0]);

  const buttonsOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const buttonsY = useTransform(scrollYProgress, [0.25, 0.5], [30, 0]);

  return (
    <section ref={sectionRef} className="hero-gallery-section">
      <div className="hero-gallery-scroll-area">
        <div className="hero-gallery-sticky">
          <div className="hero-gallery-inner">
            {/* HEADER TEXT + BUTTONS */}
            <motion.div
              className="hero-gallery-header"
              style={{ opacity: headerOpacity, y: headerY }}
            >
              <p className="hero-gallery-eyebrow">{eyebrow}</p>
              <h2 className="hero-gallery-title">{title}</h2>
              <p className="hero-gallery-subtitle">{subtitle}</p>

              <motion.div
                className="hero-gallery-buttons"
                style={{ opacity: buttonsOpacity, y: buttonsY }}
              >
                <button
                  className="hero-gallery-btn hero-gallery-btn-primary"
                  onClick={() =>
                    startTransition("Portfolio", () => {
                      router.push(isEnglish ? "/en/portfolio" : "/portfolio");
                    })
                  }
                >
                  {btnPrimary}
                </button>

                <button
                  className="hero-gallery-btn hero-gallery-btn-secondary"
                  onClick={() =>
                    startTransition("Contact", () => {
                      router.push(isEnglish ? "/en/contact" : "/contact");
                    })
                  }
                >
                  {btnSecondary}
                </button>
              </motion.div>
            </motion.div>

            {/* GALLERY BENTO GRID */}
            <motion.div
              className="hero-gallery-grid-wrapper"
              style={{ scale: galleryScale, y: galleryY }}
            >
              <div className="hero-gallery-grid">
                {/* MAIN VIDEO */}
                <div className="hero-gallery-cell hero-gallery-main">
                  <video
                    className="hero-gallery-video"
                    src="/videos/site_video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* TOP RIGHT VIDEO */}
                <div className="hero-gallery-cell hero-gallery-side-top">
                  <video
                    className="hero-gallery-video"
                    src="/videos/site_video_2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* BOTTOM RIGHT BUTTONS */}
                <div className="hero-gallery-cell hero-gallery-side-bottom">
                  <div className="hero-gallery-cta-column">
                    <Link
                      href={isEnglish ? "/en/portfolio" : "/portfolio"}
                      className="hero-gallery-btn hero-gallery-btn-primary hero-gallery-btn-full"
                      onClick={(e) => {
                        e.preventDefault();
                        startTransition("Portfolio", () => {
                          router.push(
                            isEnglish ? "/en/portfolio" : "/portfolio"
                          );
                        });
                      }}
                    >
                      {ctaPrimary}
                    </Link>

                    <Link
                      href={isEnglish ? "/en/contact" : "/contact"}
                      className="hero-gallery-btn hero-gallery-btn-secondary hero-gallery-btn-full"
                      onClick={(e) => {
                        e.preventDefault();
                        startTransition("Contact", () => {
                          router.push(isEnglish ? "/en/contact" : "/contact");
                        });
                      }}
                    >
                      {ctaSecondary}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoScroll;
