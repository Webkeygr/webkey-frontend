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
import BentoScroll from "@/app/components/sections/HeroGalleryScroll/BentoScroll";
import ScrollTextSection from "@/app/components/sections/ScrollTextSection/ScrollTextSection";





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
      <BentoScroll />
      <ScrollTextSection />

    </>
  );
}
