// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webkey — Dare Against Normal",
  description: "Creative web studio",
};

import Hero from "./components/Hero";
import ServicesIntro from "./components/sections/ServicesIntro";

export default function HomePage() {
  return (
    <main className="page relative">
      <Hero />
      <ServicesIntro />
      {/* <Services /> */}
      {/* <Portfolio /> */}
      {/* <Footer /> */}
    </main>
  );
}
