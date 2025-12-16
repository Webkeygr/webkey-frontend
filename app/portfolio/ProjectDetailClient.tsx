// app/portfolio/ProjectDetailClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import type { PortfolioDetail } from "./types";
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
  }, [duration, src]);

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
 * Types για Prev/Next
 * ---------------------------------------------------- */
type NavItem = {
  id: number;
  slug?: string;
  title?: { rendered: string };
  acf?: any;
};

type NavResponse = {
  prev: NavItem | null;
  next: NavItem | null;
};

/* ----------------------------------------------------
 * Κύριο component λεπτομερειών project
 * ---------------------------------------------------- */
type Props = {
  project: PortfolioDetail;
};

export default function ProjectDetailClient({ project }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  const highlight5 = getImageUrl(acf.highlight_5);

  // ------- 1440 container helper (εκτός hero / full width sections) -------
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">{children}</div>
  );

  // ------- PARALLAX (FULL WIDTH, 100vh) για highlight_1 -------
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  // -35% έως +35%
  const y = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);

  // ------- NAV (prev/next) -------
  const [nav, setNav] = useState<NavResponse>({ prev: null, next: null });

  const currentSlug = useMemo(() => {
    // pathname πχ /portfolio/vis-consultants
    const parts = (pathname || "").split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }, [pathname]);

  const currentId = useMemo(() => {
    const idStr = searchParams?.get("id");
    const n = idStr ? Number(idStr) : NaN;
    return Number.isFinite(n) ? n : (project as any)?.id ?? null;
  }, [searchParams, project]);

  useEffect(() => {
    if (!currentId || !currentSlug) return;

    let alive = true;

    (async () => {
      try {
        const res = await fetch(
          `/api/portfolio-nav?id=${encodeURIComponent(
            String(currentId)
          )}&slug=${encodeURIComponent(currentSlug)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as NavResponse;
        if (!alive) return;
        setNav({
          prev: data?.prev ?? null,
          next: data?.next ?? null,
        });
      } catch {
        // silent
      }
    })();

    return () => {
      alive = false;
    };
  }, [currentId, currentSlug]);

  // ------- SAME CLICK ANIMATION (όπως PortfolioClient) για prev/next cards -------
  const navCardRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleAnimatedNavClick = (
    item: NavItem,
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!item?.slug || !item?.id) return;

    if (typeof window === "undefined") {
      router.push(`/portfolio/${item.slug}?id=${item.id}`);
      return;
    }

    const cardEl = navCardRefs.current[item.id];
    if (!cardEl) {
      router.push(`/portfolio/${item.slug}?id=${item.id}`);
      return;
    }

    const img = cardEl.querySelector("img");
    if (!img) {
      router.push(`/portfolio/${item.slug}?id=${item.id}`);
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

    gsap.set(clone, { transformPerspective: 1400 });

    const tl = gsap.timeline({
      defaults: { duration: 0.32, ease: "power2.inOut" },
      onComplete: () => {
        router.push(`/portfolio/${item.slug}?id=${item.id}`);
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

      {/* MARQUEE */}
      <section className="overflow-hidden border-y border-slate-200 bg-slate-50 py-4">
        <Container>
          <div className="whitespace-nowrap">
            <div className="portfolio-marquee text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-slate-500">
              {Array.from({ length: 12 })
                .map(() => `${title} •`)
                .join(" ")}
            </div>
          </div>
        </Container>
      </section>

      {/* HEADING 2 + LOGO + TECHNOLOGY TAGS */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="flex flex-col gap-12 md:flex-row md:items-start">
            {/* Αριστερή στήλη */}
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
                <p className="text-base md:text-lg text-slate-600">
                  {heading3}
                </p>
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

            {/* Δεξιά στήλη: Logo + Project Info (ΜΕΤΑΚΙΝΗΣΗ ΕΔΩ) */}
            <div className="md:w-1/3 flex flex-col items-start md:items-end gap-6">
              {logoUrl && (
                <div className="flex w-full justify-center">
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

              {(industry || location || heading3 || description) && (
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
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

                    {!industry && !location && (
                      <div className="text-xs text-slate-500">
                        (No project info yet)
                      </div>
                    )}

                    {(heading3 || description) && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                        {heading3 || description}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* HIGHLIGHT_1 – FULL WIDTH 100vh + PARALLAX */}
      {highlight1 && (
        <section
          ref={parallaxRef}
          className="relative h-screen w-full overflow-hidden bg-slate-50"
        >
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src={highlight1}
              alt={`${title} technologies visual`}
              fill
              className="object-cover"
              priority={false}
            />
          </motion.div>

          {/* label πάνω από την εικόνα (όπως πριν, απλά full width) */}
          <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2">
            <div className="rounded-full border border-white/25 bg-black/30 px-5 py-2 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                Technologies
              </span>
            </div>
          </div>
        </section>
      )}

      {/* WHOLE SITE – full width 1440, ΜΟΝΟ το auto-scroll */}
      {wholeSiteUrl && (
        <section className="bg-slate-50 py-16">
          <Container>
            <div className="h-screen">
              <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Whole Site
              </h3>
              <div className="mt-4 h-[calc(100%-1.25rem)]">
                <AutoScrollImage src={wholeSiteUrl} duration={20} />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* TEXT_1 + HIGHLIGHT_2 */}
      {(text1 || highlight2) && (
        <section className="bg-white py-16 md:py-20">
          <Container>
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
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
          </Container>
        </section>
      )}

      {/* HIGHLIGHT_3 + HIGHLIGHT_4 */}
      {(highlight3 || highlight4) && (
        <section className="bg-white py-12 md:py-16">
          <Container>
            <div className="grid gap-10 md:grid-cols-2">
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
          </Container>
        </section>
      )}

      {/* TEXT_2 */}
      {text2 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <Container>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Website
            </h3>
            <div
              className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-sm md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
              dangerouslySetInnerHTML={{ __html: text2 }}
            />
          </Container>
        </section>
      )}

      {/* HIGHLIGHT_5 – ίδιο wrapper με highlight_1 (1440 container) */}
      {highlight5 && (
        <section className="bg-white py-16">
          <Container>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Highlight
            </h3>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
              <Image
                src={highlight5}
                alt={`${title} highlight`}
                width={1600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </Container>
        </section>
      )}

      {/* BACK + PREV/NEXT (όπως τα είχαμε) */}
      <section className="bg-white pb-24">
        <Container>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.push("/portfolio")}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold tracking-[0.18em] uppercase text-slate-800 shadow-sm hover:shadow-md transition"
            >
              Back to Portfolio
            </button>
          </div>

          {(nav.prev || nav.next) && (
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* PREVIOUS (αριστερά) */}
              <div>
                {nav.prev && (
                  <>
                    <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                      Previous Project
                    </div>
                    <button
                      type="button"
                      className="block text-left w-full"
                      onClick={(e) =>
                        handleAnimatedNavClick(nav.prev as NavItem, e)
                      }
                      ref={(el) => {
                        navCardRefs.current[(nav.prev as NavItem).id] = el;
                      }}
                    >
                      <PortfolioCard project={nav.prev as any} />
                    </button>
                  </>
                )}
              </div>

              {/* NEXT (δεξιά) */}
              <div>
                {nav.next && (
                  <>
                    <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 text-left md:text-right">
                      Next Project
                    </div>
                    <button
                      type="button"
                      className="block text-left w-full"
                      onClick={(e) =>
                        handleAnimatedNavClick(nav.next as NavItem, e)
                      }
                      ref={(el) => {
                        navCardRefs.current[(nav.next as NavItem).id] = el;
                      }}
                    >
                      <PortfolioCard project={nav.next as any} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
