"use client";

import { motion, useTransform } from "motion/react";
import {
  ContainerScroll,
  ContainerScale,
  BentoGrid,
  BentoCell,
  useContainerScroll,
} from "./BentoScroll";

const HeroGalleryScrollInner = () => {
  const { scrollYProgress } = useContainerScroll();

  // Τίτλος + κουμπιά:
  //  - στην αρχή κρυφό
  //  - εμφανίζεται σταδιακά όσο μικραίνει το gallery
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.25, 0.5],
    [0, 0, 1]
  );
  const titleY = useTransform(scrollYProgress, [0.0, 0.25, 0.5], [40, 40, 0]);

  return (
    <ContainerScale>
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

        {/* GALLERY – ΠΟΛΥ ΜΕΓΑΛΟ ΣΤΗΝ ΑΡΧΗ (λόγω scale του ContainerScale) */}
        <BentoGrid
          variant="default"
          className="w-[90vw] max-w-5xl mt-10"
        >
          <BentoCell className="rounded-3xl bg-slate-900 text-white p-8 shadow-2xl h-[260px] md:h-[360px]" />
          <BentoCell className="rounded-3xl bg-slate-800 text-white p-6 shadow-2xl" />
          <BentoCell className="rounded-3xl bg-slate-800 text-white p-6 shadow-2xl" />
          <BentoCell className="rounded-3xl bg-slate-900 text-white p-6 shadow-2xl" />
          <BentoCell className="rounded-3xl bg-slate-900 text-white p-6 shadow-2xl" />
        </BentoGrid>
      </div>
    </ContainerScale>
  );
};

const HeroGalleryScrollSection = () => {
  return (
    <ContainerScroll className="bg-white">
      <HeroGalleryScrollInner />
    </ContainerScroll>
  );
};

export default HeroGalleryScrollSection;
