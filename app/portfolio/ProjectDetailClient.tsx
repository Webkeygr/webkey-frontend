// app/portfolio/ProjectDetailClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { PortfolioDetail } from "./types";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

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
function AutoScrollImage({ src, alt }: { src: string; alt: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const el = wrapperRef.current;
    const img = el.querySelector("img");

    if (!img) return;

    const onLoad = () => {
      // Πόσο πρέπει να μετακινήσουμε την εικόνα
      const wrapperH = el.clientHeight;
      const imgH = img.scrollHeight || img.clientHeight;
      const distance = imgH - wrapperH;

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
          duration: Math.max(8, distance / 120),
          ease: "none",
        }
      );

      // και επιστροφή στην αρχή
      tl.to(img, { y: 0, duration: 0, ease: "none" });

      tlRef.current = tl;
    };

    if (img.complete) onLoad();
    else img.addEventListener("load", onLoad);

    return () => {
      img.removeEventListener("load", onLoad);
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-[100vh] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
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
  const router = useRouter();

  type NavProject = {
    id: number;
    slug: string;
    title?: { rendered?: string };
    acf?: {
      main_image?: any;
      technologies?: string[];
      [key: string]: any;
    };
  };

  const [nav, setNav] = useState<{
    prev: NavProject | null;
    next: NavProject | null;
  }>({
    prev: null,
    next: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/projects?per_page=100&orderby=menu_order&order=asc`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const list = (await res.json()) as NavProject[];
        if (!Array.isArray(list) || list.length === 0) return;

        const currentIndex = list.findIndex((p) => p?.id === project.id);
        if (currentIndex === -1) return;

        const prev =
          list[(currentIndex - 1 + list.length) % list.length] ?? null;
        const next = list[(currentIndex + 1) % list.length] ?? null;

        if (!cancelled) setNav({ prev, next });
      } catch {
        // ignore
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [project.id]);

  // ACF fields
  const title = project.title?.rendered ?? "Project";
  const heading1 = acf.heading_1 || "";
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
  const highlight5 = getImageUrl(acf.highlight_5);

  const navCardRefs = useRef<Record<"prev" | "next", HTMLButtonElement | null>>(
    {
      prev: null,
      next: null,
    }
  );

  const animateNavClick = (target: NavProject, key: "prev" | "next") => {
    if (typeof window === "undefined") {
      router.push(`/portfolio/${target.slug}?id=${target.id}`);
      return;
    }

    const btn = navCardRefs.current[key];
    const img = btn?.querySelector("img");
    if (!btn || !img) {
      router.push(`/portfolio/${target.slug}?id=${target.id}`);
      return;
    }

    const rect = img.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const clone = img.cloneNode(true) as HTMLImageElement;

    const hiResSrc =
      getImageUrl(target?.acf?.main_image) ||
      (typeof target?.acf?.main_image === "object"
        ? target?.acf?.main_image?.url ||
          target?.acf?.main_image?.source_url ||
          target?.acf?.main_image?.sizes?.["2048x2048"] ||
          target?.acf?.main_image?.sizes?.["1536x1536"]
        : null);

    if (hiResSrc) {
      clone.src = hiResSrc;
      clone.srcset = "";
      clone.sizes = "";
    }

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
    btn.style.opacity = "0";

    gsap.set(clone, { transformPerspective: 1400 });

    const tl = gsap.timeline({
      defaults: { duration: 0.32, ease: "power2.inOut" },
      onComplete: () => {
        router.push(`/portfolio/${target.slug}?id=${target.id}`);
        setTimeout(() => {
          clone.remove();
          btn.style.opacity = "";
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

  return (
    <main className="min-h-screen bg-white">
      {/* HERO IMAGE */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {mainImageUrl && (
          <Image
            src={mainImageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-10 md:pb-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6">
              {logoUrl && (
                <div className="inline-flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
                    <Image
                      src={logoUrl}
                      alt={`${title} logo`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="text-white/80 text-xs uppercase tracking-[0.35em] font-semibold">
                    Project
                  </div>
                </div>
              )}

              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight">
                {heading1 || title}
              </h1>

              {(heading2 || description) && (
                <p className="max-w-3xl text-white/90 text-lg md:text-2xl leading-relaxed">
                  {heading2 || description}
                </p>
              )}

              {/* Technologies pills */}
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {technologies.map((t, idx) => (
                    <span
                      key={`${t}-${idx}`}
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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

      {/* HEADING / DESCRIPTION */}
      {(heading3 || description) && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                  {heading3 || title}
                </h2>
                {description && (
                  <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-700">
                    {description}
                  </p>
                )}
              </div>

              {/* Meta card */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-md">
                <div className="grid gap-5">
                  {industry && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Industry
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        {industry}
                      </div>
                    </div>
                  )}

                  {location && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Location
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        {location}
                      </div>
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

            {/* Φαρδύ banner για "Technologies" visual (Highlight_1) */}
            {highlight1 && (
              <div className="mx-auto mt-16 max-w-6xl px-0">
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
          </div>
        </section>
      )}

      {/* WHOLE SITE – 100vh, auto-scroll σε loop + Industry / Location card */}
      {wholeSiteUrl && (
        <section className="bg-white pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-start">
              <AutoScrollImage src={wholeSiteUrl} alt="Whole site preview" />

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Overview
                </h3>

                <div className="mt-6 grid gap-6">
                  {industry && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Industry
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        {industry}
                      </div>
                    </div>
                  )}

                  {location && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Location
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        {location}
                      </div>
                    </div>
                  )}

                  {technologies.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Stack
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {technologies.map((t, idx) => (
                          <span
                            key={`${t}-${idx}`}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {highlight3 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                        Highlight
                      </div>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <Image
                          src={highlight3}
                          alt={`${title} highlight`}
                          width={1200}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TEXT_1 + HIGHLIGHT_2 */}
      {(text1 || highlight2) && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-start">
              {text1 && (
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Details
                  </h3>
                  <div
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-7 text-sm md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
                    dangerouslySetInnerHTML={{ __html: text1 }}
                  />
                </div>
              )}

              {highlight2 && (
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Highlight
                  </h3>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
                    <Image
                      src={highlight2}
                      alt={`${title} highlight`}
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* HIGHLIGHT_4 */}
      {highlight4 && (
        <section className="bg-white pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
              <Image
                src={highlight4}
                alt={`${title} highlight`}
                width={1600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* TEXT_2 */}
      {text2 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Website
            </h3>
            <div
              className="rounded-3xl border border-slate-200 bg-slate-50 p-7 text-sm md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
              dangerouslySetInnerHTML={{ __html: text2 }}
            />
          </div>
        </section>
      )}

      {/* HIGHLIGHT_5 (όπως το Highlight_1) */}
      {highlight5 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Highlight
            </h3>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
              <Image
                src={highlight5}
                alt={`${title} highlight visual`}
                width={1600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* NEXT / PREVIOUS PROJECT */}
      {(nav.prev || nav.next) && (
        <section className="bg-white pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {nav.prev && (
                <button
                  type="button"
                  className="block text-left"
                  onClick={() => animateNavClick(nav.prev as any, "prev")}
                  ref={(el) => {
                    navCardRefs.current.prev = el;
                  }}
                >
                  <motion.article
                    className="group relative overflow-hidden rounded-[32px] bg-black/80 text-white shadow-[0_40px_120px_rgba(0,0,0,0.7)] border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="relative aspect-[1901/943] w-full overflow-hidden">
                      <Image
                        src={
                          getImageUrl((nav.prev as any)?.acf?.main_image) ||
                          "/images/placeholder-portfolio.jpg"
                        }
                        alt={
                          (nav.prev as any)?.title?.rendered ||
                          "Previous project"
                        }
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        sizes="(min-width: 1024px) 560px, 100vw"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                      <div className="pointer-events-none absolute left-6 top-6 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-md border border-white/20">
                        Previous Project
                      </div>
                    </div>

                    <div className="relative px-6 py-5 md:px-7 md:py-6 bg-gradient-to-t from-black/80 via-black/60 to-black/0">
                      <h3 className="text-lg md:text-xl font-semibold leading-snug">
                        {(nav.prev as any)?.title?.rendered ||
                          "Previous project"}
                      </h3>
                    </div>
                  </motion.article>
                </button>
              )}

              {nav.next && (
                <button
                  type="button"
                  className="block text-left"
                  onClick={() => animateNavClick(nav.next as any, "next")}
                  ref={(el) => {
                    navCardRefs.current.next = el;
                  }}
                >
                  <motion.article
                    className="group relative overflow-hidden rounded-[32px] bg-black/80 text-white shadow-[0_40px_120px_rgba(0,0,0,0.7)] border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="relative aspect-[1901/943] w-full overflow-hidden">
                      <Image
                        src={
                          getImageUrl((nav.next as any)?.acf?.main_image) ||
                          "/images/placeholder-portfolio.jpg"
                        }
                        alt={
                          (nav.next as any)?.title?.rendered || "Next project"
                        }
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        sizes="(min-width: 1024px) 560px, 100vw"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                      <div className="pointer-events-none absolute left-6 top-6 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-md border border-white/20">
                        Next Project
                      </div>
                    </div>

                    <div className="relative px-6 py-5 md:px-7 md:py-6 bg-gradient-to-t from-black/80 via-black/60 to-black/0">
                      <h3 className="text-lg md:text-xl font-semibold leading-snug">
                        {(nav.next as any)?.title?.rendered || "Next project"}
                      </h3>
                    </div>
                  </motion.article>
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
