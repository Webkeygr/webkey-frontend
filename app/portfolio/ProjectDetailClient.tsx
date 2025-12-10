// app/portfolio/ProjectDetailClient.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { PortfolioDetail } from "./[slug]/page";

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

      // Αν η εικόνα δεν είναι μεγαλύτερη από το viewport, δεν χρειάζεται scroll
      if (distance <= 0) return;

      // Καθαρίζουμε τυχόν παλιό timeline
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      const tl = gsap.timeline({
        repeat: -1, // infinite loop
        repeatDelay: 0.6, // μικρή παύση στο τέλος
      });

      tl.fromTo(
        img,
        { y: 0 },
        {
          y: -distance,
          ease: "none",
          duration,
        }
      ).set(img, { y: 0 }); // reset πάνω πριν ξαναξεκινήσει

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
};

export default function ProjectDetailClient({ project }: Props) {
  // κρατάμε το header “light” όπως στο portfolio list
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
  const highlight1 = getImageUrl(acf.highlight_1); // για το section "Technologies"
  const highlight2 = getImageUrl(acf.highlight_2);
  const highlight3 = getImageUrl(acf.highlight_3);
  const highlight4 = getImageUrl(acf.highlight_4);

  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      {/* HERO: main_image 100vh, μόνο η εικόνα */}
      <section className="relative h-screen overflow-hidden">
        {mainImageUrl && (
          <Image
            src={mainImageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        )}
      </section>

      {/* MARQUEE – Nikolopoulou Foods • ... */}
      <section className="overflow-hidden border-y border-slate-200 bg-slate-50 py-4">
        <div className="whitespace-nowrap">
          <div className="portfolio-marquee text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-slate-500">
            {Array.from({ length: 12 })
              .map(() => `${title} •`)
              .join(" ")}
          </div>
        </div>
      </section>

      {/* HEADING 2 + LOGO + TECHNOLOGY TAGS (λευκό section) */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-start md:px-8">
          {/* Αριστερή στήλη: heading2, heading3, description, technologies tags */}
          <div className="md:w-2/3 space-y-6">
            {heading2 && (
              <div className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Case Study
                </h2>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">
                  {heading2}
                </h1>
              </div>
            )}
            {heading3 && (
              <p className="text-base md:text-lg text-slate-600">{heading3}</p>
            )}
            {description && (
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                {description}
              </p>
            )}

            {technologies.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs md:text-[13px] font-medium text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Δεξιά στήλη: Logo */}
          {logoUrl && (
            <div className="md:w-1/3 flex md:justify-end">
              <div className="relative h-36 w-36 md:h-44 md:w-44 rounded-full border border-slate-200 bg-white shadow-lg flex items-center justify-center">
                <Image
                  src={logoUrl}
                  alt={`${title} logo`}
                  fill
                  className="object-contain p-6"
                />
              </div>
            </div>
          )}
        </div>

        {/* Φαρδύ banner για "Technologies" visual (Highlight_1) */}
        {highlight1 && (
          <div className="mx-auto mt-16 max-w-6xl px-6 md:px-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Technologies
            </h3>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
              <Image
                src={highlight1}
                alt={`${title} technologies visual`}
                width={1600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* WHOLE SITE – 100vh, auto-scroll σε loop + Industry / Location card */}
      {wholeSiteUrl && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid h-screen gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)] items-stretch">
              {/* Αριστερά: τίτλος + auto-scroll image */}
              <div className="flex h-full flex-col">
                <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Whole Site
                </h3>
                <div className="mt-4 flex-1">
                  <AutoScrollImage src={wholeSiteUrl} duration={20} />
                </div>
              </div>

              {/* Δεξιά: Industry / Location / μικρό summary */}
              <div className="flex flex-col items-stretch">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Project Info
                  </h4>
                  <div className="space-y-4 text-sm text-slate-700">
                    {industry && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Industry
                        </div>
                        <div>{industry}</div>
                      </div>
                    )}
                    {location && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Location
                        </div>
                        <div>{location}</div>
                      </div>
                    )}
                    {(heading3 || description) && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                        {heading3 || description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TEXT_1 + HIGHLIGHT_2 */}
      {(text1 || highlight2) && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:px-8 md:items-start">
            {text1 && (
              <div
                className="text-sm md:text-base leading-relaxed text-slate-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: text1 }}
              />
            )}

            {highlight2 && (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                <Image
                  src={highlight2}
                  alt={`${title} highlight 2`}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* HIGHLIGHT_3 + HIGHLIGHT_4 σε δύο στήλες */}
      {(highlight3 || highlight4) && (
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:px-8">
            {highlight3 && (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                <Image
                  src={highlight3}
                  alt={`${title} highlight 3`}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {highlight4 && (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                <Image
                  src={highlight4}
                  alt={`${title} highlight 4`}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* TEXT_2 τελικό section */}
      {text2 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Website
            </h3>
            <div
              className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-sm md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
              dangerouslySetInnerHTML={{ __html: text2 }}
            />
          </div>
        </section>
      )}
    </main>
  );
}
