// app/portfolio/ProjectDetailClient.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "@/app/components/PortfolioCard";

// Βασικός τύπος project που χρησιμοποιούμε παντού εδώ
export type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    [key: string]: any;
  };
};

type PortfolioProject = PortfolioDetail;

/* ----------------------------------------------------
 * Helper: παίρνουμε URL από ACF image field (object/string)
 * ---------------------------------------------------- */
function getImageUrl(field: any): string | null {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    if (typeof field.url === "string") return field.url;
    if (typeof field.source_url === "string") return field.source_url;
  }
  return null;
}

/* ----------------------------------------------------
 * AutoScrollImage – κάνει το long screenshot να scrollάρει μόνο του σε loop
 * ---------------------------------------------------- */
type AutoScrollImageProps = {
  src: string;
  duration?: number; // σε δευτερόλεπτα για ένα "run" από πάνω μέχρι κάτω
};

function AutoScrollImage({ src, duration = 18 }: AutoScrollImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const setup = () => {
      const imgHeight = img.offsetHeight;
      const viewHeight = container.offsetHeight;
      const distance = imgHeight - viewHeight;

      if (distance <= 0) return;

      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.6,
      });

      tl.fromTo(
        img,
        { y: 0 },
        {
          y: -distance,
          ease: "none",
          duration,
        }
      ).set(img, { y: 0 });

      tlRef.current = tl;
    };

    if (img.complete) {
      setup();
    } else {
      img.addEventListener("load", setup);
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (img) {
        img.removeEventListener("load", setup);
      }
    };
  }, [duration]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl"
    >
      <img
        ref={imgRef}
        src={src}
        alt="Whole site preview"
        className="absolute top-0 left-0 w-full h-auto object-cover"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

/* ----------------------------------------------------
 * Κύριο component λεπτομερειών project
 * ---------------------------------------------------- */
type Props = {
  project: PortfolioDetail;
  prevProject: PortfolioProject | null;
  nextProject: PortfolioProject | null;
};

export default function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
}: Props) {
  const router = useRouter();
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // κρατάμε το header “light”
  useEffect(() => {
    document.body.classList.add("portfolio-no-dark");
    return () => document.body.classList.remove("portfolio-no-dark");
  }, []);

  const acf = project.acf ?? {};
  const title = acf.title || project.title?.rendered || "";
  const heading2 = acf.heading_2 || "";
  const heading3 = acf.heading_3 || "";
  const description = acf.description || "";
  const technologies: string[] = Array.isArray(acf.technologies)
    ? acf.technologies
    : [];
  const industry = acf.industry || "";
  const location = acf.location || "";
  const text1 = acf.text_1 || "";
  const text2 = acf.text_2 || "";

  const mainImageUrl = getImageUrl(acf.main_image);
  const wholeSiteUrl = getImageUrl(acf.whole_site);
  const logoUrl = getImageUrl(acf.logo);
  const highlight1 = getImageUrl(acf.highlight_1);
  const highlight2 = getImageUrl(acf.highlight_2);
  const highlight3 = getImageUrl(acf.highlight_3);
  const highlight4 = getImageUrl(acf.highlight_4);
  const highlight5 = getImageUrl(acf.highlight_5);

  /* ------------------------ wave transition για next/prev ------------------------ */
  const animateAndGo = (project: PortfolioProject) => {
    const targetUrl = `/portfolio/${project.slug}?id=${project.id}`;

    if (typeof window === "undefined") {
      router.push(targetUrl);
      return;
    }

    const cardEl = cardRefs.current[project.id];
    if (!cardEl) {
      router.push(targetUrl);
      return;
    }

    const img = cardEl.querySelector("img");
    if (!img) {
      router.push(targetUrl);
      return;
    }

    const rect = img.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

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
    clone.style.transformOrigin = "50% 50%";

    document.body.appendChild(clone);
    cardEl.style.opacity = "0";

    gsap.set(clone, {
      transformPerspective: 1400,
    });

    const tl = gsap.timeline({
      defaults: { duration: 0.32, ease: "power2.inOut" },
      onComplete: () => {
        router.push(targetUrl);

        setTimeout(() => {
          clone.remove();
          if (cardEl) cardEl.style.opacity = "";
        }, 1500);
      },
    });

    tl.set(clone, {
      x: 0,
      y: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      borderRadius: "32px",
    });

    tl.to(clone, {
      y: -28,
      rotationX: 10,
      rotationY: -10,
      scale: 1.06,
      borderRadius: "40px 120px 30px 100px",
    });

    tl.to(clone, {
      y: 26,
      rotationX: -12,
      rotationY: 12,
      scale: 1.12,
      borderRadius: "130px 40px 150px 50px",
    });

    tl.to(clone, {
      y: -18,
      rotationX: 8,
      rotationY: -6,
      scale: 1.08,
      borderRadius: "60px 140px 80px 160px",
    });

    tl.to(clone, {
      y: 8,
      rotationX: -4,
      rotationY: 4,
      scale: 1.03,
      borderRadius: "30px 80px 50px 90px",
      duration: 0.28,
    });

    tl.to(clone, {
      x: rect.left * -1,
      y: rect.top * -1,
      width: viewportWidth,
      height: viewportHeight,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      borderRadius: "0px",
      duration: 0.55,
      ease: "power3.inOut",
    });
  };

  // ----- εδώ κάτω ολόκληρο το layout σου, ΟΠΩΣ ΤΟ ΕΙΧΑΜΕ -----
  // (δεν το ξανακόβω για να μην γίνει σεντόνι, αλλά κράτα ό,τι είχες ήδη
  //   για main_image, whole_site, text_1, highlights, text_2, highlight_5,
  //   και στο τέλος ΜΟΝΟ πρόσεξε τα onClick/refs για prev/next: )

  /* ... ΟΛΟ ΤΟ ΥΠΟΛΟΙΠΟ JSX ΣΟΥ ΟΠΩΣ ΤΟ ΕΙΧΕΣ ... */

  // στο τέλος, τα κουτιά Previous / Next:
  // (αντικατέστησε μόνο αυτό το κομμάτι στο τέλος του JSX)

  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      {/* ... όλα τα sections όπως τα είχες ... */}

      {(prevProject || nextProject) && (
        <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-6 md:px-8 grid gap-10 md:grid-cols-2">
            {prevProject && (
              <button
                type="button"
                className="text-left group flex flex-col gap-3"
                ref={(el) => {
                  cardRefs.current[prevProject.id] = el;
                }}
                onClick={() => animateAndGo(prevProject)}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Previous Project
                </span>
                <PortfolioCard project={prevProject} />
              </button>
            )}

            {nextProject && (
              <button
                type="button"
                className="text-left group flex flex-col gap-3 md:items-end"
                ref={(el) => {
                  cardRefs.current[nextProject.id] = el;
                }}
                onClick={() => animateAndGo(nextProject)}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 text-right w-full">
                  Next Project
                </span>
                <div className="w-full md:max-w-full">
                  <PortfolioCard project={nextProject} />
                </div>
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
