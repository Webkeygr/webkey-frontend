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
      <ContainerScroll className="bg-white h-[220vh]">
        <ContainerScale>
          <BentoGrid
            variant="default"
            className="max-w-6xl mx-auto px-6 py-24"
          >
            <BentoCell className="rounded-3xl bg-slate-900 text-white p-8">
              <h2 className="text-2xl font-semibold mb-3">
                Gallery / Project 1
              </h2>
              <p className="text-sm opacity-80">
                Εδώ θα βάλεις εικόνα ή περιγραφή του πρώτου project.
              </p>
            </BentoCell>

            <BentoCell className="rounded-3xl bg-slate-800 text-white p-6" />
            <BentoCell className="rounded-3xl bg-slate-800 text-white p-6" />
            <BentoCell className="rounded-3xl bg-slate-900 text-white p-6" />
            <BentoCell className="rounded-3xl bg-slate-900 text-white p-6" />
          </BentoGrid>
        </ContainerScale>
      </ContainerScroll>
    </>
  );
}
