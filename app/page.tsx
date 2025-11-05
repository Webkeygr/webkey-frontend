// app/page.tsx
import type { Metadata } from "next";

// Αν έχεις meta/SEO εδώ
export const metadata: Metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web studio",
};

import Hero from "./components/Hero"; // κράτησα το relative path όπως στο δικό σου snippet
import ServicesIntro from "@/components/sections/ServicesIntro"; // από τον φάκελο που δημιουργήσαμε

export default function HomePage() {
  return (
    <main className="page relative">
      {/* HERO */}
      <Hero />

      {/* ΥΠΗΡΕΣΙΕΣ — sticky 100vh με scroll-scrub τίτλο + Lottie */}
      <ServicesIntro />

      {/* === ΤΟ ΥΠΟΛΟΙΠΟ CONTENT ΣΟΥ === */}
      {/* <Services />  // οι κάρτες/περιγραφές υπηρεσιών */}
      {/* <Portfolio /> */}
      {/* <Footer /> */}
    </main>
  );
}
