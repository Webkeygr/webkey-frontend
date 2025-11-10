// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web studio",
};

// app/services/page.tsx (ή όπου είναι η σελίδα)
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import ServicesIntro from "@/app/components/sections/ServicesIntro";
import ServicesCards from "@/app/components/sections/ServicesCards";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <Hero />
      <ServicesIntro />
      <ServicesCards />
    </>
  );
}
