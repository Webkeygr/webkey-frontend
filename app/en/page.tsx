// app/en/page.tsx
import type { Metadata } from "next";

import Hero from "@/app/components/Hero";
import ServicesIntro from "@/app/components/sections/ServicesIntro";
import ServicesCards from "@/app/components/sections/ServicesCards";
import AboutPhilosophy from "@/app/components/sections/AboutPhilosophy/AboutPhilosophy";
import AboutPhilosophyScrollCards from "@/app/components/sections/AboutPhilosophy/AboutPhilosophyScrollCards";
import AboutPhilosophySplit from "@/app/components/sections/AboutPhilosophy/AboutPhilosophySplit";
import BentoScroll from "@/app/components/sections/HeroGalleryScroll/BentoScroll";
import ScrollTextSection from "@/app/components/sections/ScrollTextSection/ScrollTextSection";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Webkey — The Key to the Future",
  description: "Creative web studio",
};

export default function EnHomePage() {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <ServicesCards />
      <AboutPhilosophy />
      <AboutPhilosophyScrollCards />
      <AboutPhilosophySplit />
      <BentoScroll />
      <ScrollTextSection />

      <div className="-mt-[100vh] relative z-[20]">
        <Footer />
      </div>
    </>
  );
}
