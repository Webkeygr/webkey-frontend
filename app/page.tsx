// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webkey — Unlock the Digital Future",
  description: "Creative web studio",
};

// app/services/page.tsx (ή όπου είναι η σελίδα)
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import ServicesIntro from "@/app/components/sections/ServicesIntro";
import ServicesCards from "@/app/components/sections/ServicesCards";
import AboutPhilosophy from "@/app/components/sections/AboutPhilosophy/AboutPhilosophy";
import AboutPhilosophyScrollCards from "@/app/components/sections/AboutPhilosophy/AboutPhilosophyScrollCards";
import AboutPhilosophySplit from "@/app/components/sections/AboutPhilosophy/AboutPhilosophySplit";
import {ContainerScroll, BentoGrid, BentoCell, ContainerScale,} from "@/app/components/sections/HeroGalleryScroll/BentoScroll";




export default function ServicesPage() {
  return (
    <>
      <Header />
      <Hero />
      <ServicesIntro />
      <ServicesCards />
      <AboutPhilosophy />
      <AboutPhilosophyScrollCards />
      <AboutPhilosophySplit />
      {/* Hero Gallery Scroll Animation */}
      <ContainerScroll className="bg-white">
        <ContainerScale>
          <div className="flex flex-col items-center gap-10 max-w-6xl mx-auto px-6">
            {/* ΤΙΤΛΟΣ + ΚΟΥΜΠΙΑ */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 mb-3">
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
            </div>

            {/* GALLERY / GRID */}
            <BentoGrid
              variant="default"
              className="w-full mt-6"
            >
              <BentoCell className="rounded-3xl bg-slate-900 text-white p-8 shadow-xl" />
              <BentoCell className="rounded-3xl bg-slate-800 text-white p-6 shadow-xl" />
              <BentoCell className="rounded-3xl bg-slate-800 text-white p-6 shadow-xl" />
              <BentoCell className="rounded-3xl bg-slate-900 text-white p-6 shadow-xl" />
              <BentoCell className="rounded-3xl bg-slate-900 text-white p-6 shadow-xl" />
            </BentoGrid>
          </div>
        </ContainerScale>
      </ContainerScroll>
    </>
  );
}
