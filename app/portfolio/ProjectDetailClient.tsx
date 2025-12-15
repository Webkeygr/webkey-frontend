// app/portfolio/ProjectDetailClient.tsx
"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { PortfolioDetail } from "./types";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "@/app/components/PortfolioCard";

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
      const imgHeight = img.naturalHeight;
      const imgWidth = img.naturalWidth;

      if (!imgHeight || !imgWidth) return;

      const containerWidth = container.offsetWidth;
      const scale = containerWidth / imgWidth;
      const scaledHeight = imgHeight * scale;

      const viewHeight = container.offsetHeight;
      const scrollDistance = Math.max(0, scaledHeight - viewHeight);

      if (scrollDistance <= 0) return;

      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      const tl = gsap
        .timeline({ repeat: -1, yoyo: true })
        .fromTo(
          img,
          { y: 0 },
          {
            y: -scrollDistance,
            ease: "none",
            duration,
          }
        )
        .set(img, { y: 0 }); // reset πάνω πριν ξαναξεκινήσει

      tlRef.current = tl;
    };

    if (img.complete) {
      setup();
    } else {
      img.addEventListener("load", setup);
    }

    return () => {
      img.removeEventListener("load", setup);
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [src, duration]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        className="absolute left-0 top-0 w-full select-none"
        style={{ willChange: "transform" }}
        draggable={false}
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
  const highlight5 = getImageUrl(acf.highlight_5);

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

  const router = useRouter();
  const [nav, setNav] = useState<{
    prev: NavProject | null;
    next: NavProject | null;
  }>({ prev: null, next: null });

  const navCardRefs = useRef<Record<"prev" | "next", HTMLButtonElement | null>>(
    {
      prev: null,
      next: null,
    }
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";
        const res = await fetch(
          `${base}/wp-json/wp/v2/projects?per_page=100&orderby=menu_order&order=asc`,
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

  const handleNavClick = (
    target: NavProject,
    key: "prev" | "next",
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (typeof window === "undefined") {
      router.push(`/portfolio/${target.slug}?id=${target.id}`);
      return;
    }

    const cardEl = navCardRefs.current[key];
    if (!cardEl) {
      router.push(`/portfolio/${target.slug}?id=${target.id}`);
      return;
    }

    const img = cardEl.querySelector("img");
    if (!img) {
      router.push(`/portfolio/${target.slug}?id=${target.id}`);
      return;
    }

    const rect = img.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const clone = img.cloneNode(true) as HTMLImageElement;

    // ✅ Force full-res image for the transition (avoid thumbnail pixelation)
    const hiResSrc = getImageUrl(target?.acf?.main_image);
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
    cardEl.style.opacity = "0";

    gsap.set(clone, {
      transformPerspective: 1400,
    });

    const tl = gsap.timeline({
      defaults: { duration: 0.32, ease: "power2.inOut" },
      onComplete: () => {
        router.push(`/portfolio/${target.slug}?id=${target.id}`);
        setTimeout(() => {
          clone.remove();
          cardEl.style.opacity = "";
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
                  Project
                </h2>
                <div className="text-3xl md:text-5xl font-black tracking-tight">
                  {heading2}
                </div>
              </div>
            )}

            {heading3 && (
              <div className="text-lg md:text-xl font-semibold text-slate-700">
                {heading3}
              </div>
            )}

            {description && (
              <div className="text-sm md:text-base leading-relaxed text-slate-700 space-y-4">
                {description}
              </div>
            )}

            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {technologies.map((t, idx) => (
                  <span
                    key={`${t}-${idx}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Δεξιά στήλη: Logo */}
          {logoUrl && (
            <div className="md:w-1/3 flex md:justify-end">
              <div className="relative h-36 w-36 md:h-44 md:w-44 rounded-3xl border border-slate-200 bg-white shadow-lg flex items-center justify-center">
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

        {/* Highlight 1 */}
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

      {/* WHOLE_SITE + Project Info */}
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
                    {highlight3 && (
                      <div className="pt-4 border-t border-slate-100">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Highlight
                        </div>
                        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md">
                          <Image
                            src={highlight3}
                            alt={`${title} highlight 3`}
                            width={1200}
                            height={900}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {highlight4 && (
                  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
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
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-sm md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
                    dangerouslySetInnerHTML={{ __html: text1 }}
                  />
                </div>
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
              className="rounded-3xl border border-slate-200...md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
              dangerouslySetInnerHTML={{ __html: text2 }}
            />
          </div>
        </section>
      )}

      {/* Highlight_5 (με ίδια attributes όπως Highlight_1) */}
      {highlight5 && (
        <div className="mx-auto mt-16 max-w-6xl px-6 md:px-8">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Highlight
          </h3>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
            <Image
              src={highlight5}
              alt={`${title} highlight_5`}
              width={1600}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Previous / Next Project (σαν Portfolio thumbnails + ίδιο click animation) */}
      {(nav.prev || nav.next) && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {nav.prev && (
                <div>
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Previous Project
                  </div>
                  <button
                    type="button"
                    className="block w-full text-left"
                    ref={(el) => {
                      navCardRefs.current.prev = el;
                    }}
                    onClick={(e) => handleNavClick(nav.prev as any, "prev", e)}
                  >
                    <PortfolioCard project={nav.prev as any} />
                  </button>
                </div>
              )}

              {nav.next && (
                <div>
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Next Project
                  </div>
                  <button
                    type="button"
                    className="block w-full text-left"
                    ref={(el) => {
                      navCardRefs.current.next = el;
                    }}
                    onClick={(e) => handleNavClick(nav.next as any, "next", e)}
                  >
                    <PortfolioCard project={nav.next as any} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
