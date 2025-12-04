"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import "./HeroGalleryScroll.css";

const BentoScroll: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll ΜΟΝΟ για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Τα “κουτιά” ξεκινούν ΠΟΛΥ μεγάλα και μικραίνουν (zoom out)
  const galleryScale = useTransform(scrollYProgress, [0, 0.7], [1.4, 1]);
  const galleryY = useTransform(scrollYProgress, [0, 0.7], [60, 0]);

  // Τίτλος + κείμενο: fade-in + μικρό lift
  const headerOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.15, 0.4], [30, 0]);

  // Κουμπιά header: λίγο πιο μετά (παρότι είναι hidden στο CSS δεν πειράζει)
  const buttonsOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const buttonsY = useTransform(scrollYProgress, [0.25, 0.5], [30, 0]);

  return (
    <section ref={sectionRef} className="hero-gallery-section">
      <div className="hero-gallery-scroll-area">
        {/* ΔΕΝ υπάρχει πια fixed κλάση – μόνο sticky από το CSS */}
        <div className="hero-gallery-sticky">
          <div className="hero-gallery-inner">
            {/* Τίτλος + κείμενο + κουμπιά */}
            <motion.div
              className="hero-gallery-header"
              style={{ opacity: headerOpacity, y: headerY }}
            >
              <p className="hero-gallery-eyebrow">SELECTED WORK</p>
              <h2 className="hero-gallery-title">Gallery / Project 1</h2>
              <p className="hero-gallery-subtitle">
                Εδώ θα βάλεις εικόνα ή περιγραφή του πρώτου project.
              </p>

              <motion.div
                className="hero-gallery-buttons"
                style={{ opacity: buttonsOpacity, y: buttonsY }}
              >
                <button className="hero-gallery-btn hero-gallery-btn-primary">
                  Δες τα projects
                </button>
                <button className="hero-gallery-btn hero-gallery-btn-secondary">
                  Κλείσε ραντεβού
                </button>
              </motion.div>
            </motion.div>

            {/* Τα “κουτιά” – full screen στην αρχή, zoom-out με το scroll */}
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

                {/* ΠΑΝΩ ΔΕΞΙΑ VIDEO */}
                <div className="hero-gallery-cell hero-gallery-side-top">
                  <video
                    className="hero-gallery-video"
                    src="/videos/site_video-1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* ΚΑΤΩ ΔΕΞΙΑ – 2 ΚΟΥΜΠΙΑ ΚΑΘΕΤΑ */}
                <div className="hero-gallery-cell hero-gallery-side-bottom">
                  <div className="hero-gallery-cta-column">
                    <button className="hero-gallery-btn hero-gallery-btn-primary hero-gallery-btn-full">
                      Δείτε το portfolio
                    </button>
                    <button className="hero-gallery-btn hero-gallery-btn-secondary hero-gallery-btn-full">
                      Κλείσε ραντεβού
                    </button>
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
