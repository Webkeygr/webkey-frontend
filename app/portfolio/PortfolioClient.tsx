// app/portfolio/PortfolioClient.tsx
"use client";

import { useEffect, useRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import TextPressure from "@/app/components/TextPressure";
import { PortfolioCard } from "@/app/components/PortfolioCard";
import type { PortfolioProject } from "./page";

type PortfolioClientProps = {
  projects: PortfolioProject[];
};

export default function PortfolioClient({ projects }: PortfolioClientProps) {
  const router = useRouter();

  // refs για τα buttons των καρτών
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Απενεργοποίηση dark-mode detection μόνο σε αυτή τη σελίδα
  useEffect(() => {
    document.body.classList.add("portfolio-no-dark");
    return () => document.body.classList.remove("portfolio-no-dark");
  }, []);

  const handleProjectClick = (
    project: PortfolioProject,
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (typeof window === "undefined") {
      router.push(`/portfolio/${project.slug}?id=${project.id}`);
      return;
    }

    const cardEl = cardRefs.current[project.id];
    if (!cardEl) {
      router.push(`/portfolio/${project.slug}?id=${project.id}`);
      return;
    }

    const img = cardEl.querySelector("img");
    if (!img) {
      router.push(`/portfolio/${project.slug}?id=${project.id}`);
      return;
    }

    const rect = img.getBoundingClientRect();

    // Clone της εικόνας
    const clone = img.cloneNode(true) as HTMLImageElement;
    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = "9999";
    clone.style.borderRadius = "32px";
    clone.style.objectFit = "cover";
    clone.style.pointerEvents = "none";
    clone.style.boxShadow = "0 30px 80px rgba(0,0,0,0.45)";
    clone.style.transformOrigin = "center center";

    document.body.appendChild(clone);

    // Κρύψε την αρχική κάρτα
    cardEl.style.opacity = "0";

    const duration = 1100; // λίγο πιο αργό για να "νιώσεις" το κύμα

    const animation = clone.animate(
      [
        // start
        {
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: "32px",
          transform: "translate3d(0,0,0) scale(1) rotate(0deg)",
        },
        // πρώτο κύμα
        {
          left: `${rect.left - rect.width * 0.02}px`,
          top: `${rect.top - rect.height * 0.05}px`,
          width: `${rect.width * 1.06}px`,
          height: `${rect.height * 1.06}px`,
          borderRadius: "40px 120px 60px 130px",
          transform: "translate3d(0,-12px,0) scale(1.04) rotate(-1deg)",
          offset: 0.25,
        },
        // δεύτερο κύμα
        {
          left: `${rect.left + rect.width * 0.02}px`,
          top: `${rect.top + rect.height * 0.02}px`,
          width: `${rect.width * 1.1}px`,
          height: `${rect.height * 1.1}px`,
          borderRadius: "90px 40px 120px 60px",
          transform: "translate3d(0,10px,0) scale(1.08) rotate(1.2deg)",
          offset: 0.5,
        },
        // τρίτο κύμα (επιστροφή λίγο πάνω)
        {
          left: `${rect.left - rect.width * 0.015}px`,
          top: `${rect.top - rect.height * 0.02}px`,
          width: `${rect.width * 1.08}px`,
          height: `${rect.height * 1.08}px`,
          borderRadius: "60px 110px 80px 140px",
          transform: "translate3d(0,-6px,0) scale(1.05) rotate(-0.6deg)",
          offset: 0.75,
        },
        // fullscreen – χωρίς επιπλέον zoom
        {
          left: "0px",
          top: "0px",
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          transform: "translate3d(0,0,0) scale(1) rotate(0deg)",
        },
      ],
      {
        duration,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );

    animation.finished
      .catch(() => {})
      .then(() => {
        router.push(`/portfolio/${project.slug}?id=${project.id}`);

        // καθάρισμα DOM μετά το navigation
        setTimeout(() => {
          clone.remove();
          if (cardEl) cardEl.style.opacity = "";
        }, 1500);
      });
  };

  return (
    <>
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[size:400%_400%] bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-cyan-600/30 animate-color-shift" />
        <div className="absolute inset-0 bg-[size:400%_400%] bg-gradient-to-tl from-yellow-400/20 via-transparent to-purple-800/30 animate-color-shift-reverse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#ff00ff20_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#00ffff20_0%,transparent_50%),radial-gradient(circle_at_40%_40%,#ffff0020_0%,transparent_50%)] animate-float" />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-white">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center gap-10 pt-24">
          <div className="w-full">
            <TextPressure
              text="Portfolio"
              textColor="#ffffff"
              minFontSize={90}
              weight
              width
              italic
              alpha={false}
              stroke={false}
              scale={false}
              flex
            />
          </div>

          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent leading-tight">
              Ένα showcase επιλεγμένων digital έργων
            </h2>
            <p className="mt-6 text-xl md:text-2xl opacity-90 leading-relaxed">
              όπου το design, η τεχνολογία και η τυπογραφία συναντιούνται.
              <br className="hidden md:block" />
              Projects χτισμένα με Next.js, WordPress, WooCommerce και custom
              animations — όλα με έναν στόχο: να ξεχωρίζουν.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="relative py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="block text-left"
              onClick={(e) => handleProjectClick(project, e)}
              ref={(el) => {
                cardRefs.current[project.id] = el;
              }}
            >
              <PortfolioCard project={project} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
