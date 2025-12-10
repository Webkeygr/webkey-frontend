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
      className="relative w-full h-full overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl"
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
  const highlight1 = getImageUrl(acf.highlight_1);
  const highlight2 = getImageUrl(acf.highlight_2);
  const highlight3 = getImageUrl(acf.highlight_3);
  const highlight4 = getImageUrl(acf.highlight_4);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-pink-300 via-rose-200 to-indigo-200 text-white">
      {/* HERO: main_image 100vh */}
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

        {/* overlay για να διαβάζεται το κείμενο */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

        <motion.div
          className="relative z-10 flex h-full flex-col justify-between px-8 pb-12 pt-32 md:px-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* top area: logo + heading2 + technologies */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-4">
              {heading2 && (
                <h1 className="text-3xl md:text-5xl font-black leading-tight">
                  {heading2}
                </h1>
              )}
              {heading3 && (
                <p className="text-lg md:text-xl text-white/80">{heading3}</p>
              )}
              {description && (
                <p className="max-w-2xl text-sm md:text-base text-white/70">
                  {description}
                </p>
              )}
              {technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm font-medium uppercase tracking-wide"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {logoUrl && (
              <motion.div
                className="relative h-28 w-28 md:h-36 md:w-36 shrink-0 rounded-full bg-white/10 backdrop-blur"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src={logoUrl}
                  alt={`${title} logo`}
                  fill
                  className="object-contain p-4"
                />
              </motion.div>
            )}
          </div>

          {/* bottom meta */}
          <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between md:text-sm text-white/70">
            <div className="flex gap-6">
              {industry && (
                <div>
                  <span className="font-semibold text-white/90">Industry</span>
                  <div>{industry}</div>
                </div>
              )}
              {location && (
                <div>
                  <span className="font-semibold text-white/90">Location</span>
                  <div>{location}</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* SCROLLING TITLE / MARQUEE */}
      <section className="overflow-hidden border-y border-white/10 bg-black/20 py-4">
        <div className="whitespace-nowrap">
          <div className="portfolio-marquee text-2xl md:text-3xl font-semibold tracking-[0.35em] uppercase text-white/70">
            {Array.from({ length: 8 })
              .map(() => `${title} •`)
              .join(" ")}
          </div>
        </div>
      </section>

      {/* OVERVIEW + HIGHLIGHT_1 */}
      <motion.section
        className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:px-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="md:w-1/2 space-y-6 text-slate-900">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Στόχος &amp; Προσέγγιση
          </h2>
          {text1 && (
            <p className="text-sm md:text-base leading-relaxed text-slate-800">
              {text1}
            </p>
          )}
          {text2 && (
            <p className="text-sm md:text-base leading-relaxed text-slate-800">
              {text2}
            </p>
          )}
        </div>

        {highlight1 && (
          <div className="md:w-1/2">
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
              <Image
                src={highlight1}
                alt={`${title} highlight 1`}
                width={1200}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </motion.section>

      {/* WHOLE SITE – 100vh, auto-scroll σε loop μέσα στο frame */}
      {wholeSiteUrl && (
        <motion.section
          className="relative h-screen bg-slate-950/90 flex flex-col items-center justify-center px-4 py-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-5xl w-full h-full">
            {/* 🔁 Εδώ είναι το looping auto-scroll */}
            <AutoScrollImage src={wholeSiteUrl} duration={20} />
          </div>
        </motion.section>
      )}

      {/* GRID με Highlights 2–4 */}
      {(highlight2 || highlight3 || highlight4) && (
        <motion.section
          className="mx-auto max-w-6xl px-6 py-24 md:px-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid gap-8 md:grid-cols-3">
            {highlight2 && (
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
                <Image
                  src={highlight2}
                  alt={`${title} highlight 2`}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {highlight3 && (
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
                <Image
                  src={highlight3}
                  alt={`${title} highlight 3`}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {highlight4 && (
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl md:col-span-1">
                <Image
                  src={highlight4}
                  alt={`${title} highlight 4`}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </motion.section>
      )}
    </main>
  );
}
