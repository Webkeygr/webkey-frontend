"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroGalleryScrollSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Τοπικό scroll μόνο για αυτό το section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Gallery: στην αρχή ΠΟΛΥ μεγάλο → μικραίνει
  const galleryScale = useTransform(scrollYProgress, [0, 0.7], [1.5, 0.9]);

  // Τίτλος + κουμπιά: fade-in + slide-up
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.15, 0.45], [40, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] bg-white"
    >
      {/* Sticky “καρέ” που μένει στην οθόνη όσο παίζει το animation */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* Όλο το block (τίτλος + έργα) κάνει zoom-out */}
        <motion.div
          style={{ scale: galleryScale }}
          className="w-full flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-10 max-w-6xl mx-auto px-6">
            {/* ΤΙΤΛΟΣ + ΚΟΥΜΠΙΑ */}
            <motion.div
              className="text-center max-w-2xl mx-auto"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-slate-500 mb-3">
                Selected work
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                Gallery / Project 1
              </h2>
              <p className="mt-4 text-sm md:text-base text-slate-600">
                Εδώ θα βάλεις εικόνα ή περιγραφή του πρώτου project.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium">
                  Δες τα projects
                </button>
                <button className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-sm font-medium">
                  Κλείσε ραντεβού
                </button>
              </div>
            </motion.div>

            {/* GALLERY – “Bento” grid, ΠΟΛΥ μεγάλο στην αρχή λόγω galleryScale */}
            <div className="w-[92vw] max-w-5xl mt-10 grid gap-4
                            grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]">
              {/* Μεγάλο κύριο block */}
              <div className="col-span-8 md:col-span-6 row-span-3 rounded-3xl bg-slate-900 shadow-2xl" />

              {/* Δεξιό πάνω */}
              <div className="hidden md:block col-span-2 row-span-2 rounded-3xl bg-slate-800 shadow-2xl" />

              {/* Δεξιό κάτω */}
              <div className="hidden md:block col-span-2 row-span-2 rounded-3xl bg-slate-800 shadow-2xl" />

              {/* Κάτω αριστερά */}
              <div className="col-span-4 md:col-span-3 rounded-3xl bg-slate-900 shadow-2xl" />

              {/* Κάτω δεξιά */}
              <div className="col-span-4 md:col-span-3 rounded-3xl bg-slate-900 shadow-2xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroGalleryScrollSection;
