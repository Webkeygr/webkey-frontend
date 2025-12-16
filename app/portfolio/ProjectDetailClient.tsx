// app/portfolio/ProjectDetailClient.tsx
"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PortfolioCard } from "@/app/components/PortfolioCard";
import type { PortfolioDetail } from "./types";

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
 * Small helper for entrance animations (no layout changes)
 * ---------------------------------------------------- */
function reveal(delay = 0, y = 14, scale = 1) {
  return {
    initial: { opacity: 0, y, scale },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  } as const;
}

/* ----------------------------------------------------
 * AutoScrollImage – κάνει το long screenshot να scrollάρει μόνο του σε loop
 * ---------------------------------------------------- */
type AutoScrollImageProps = {
  src: string;
  duration?: number;
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

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

      tl.fromTo(
        img,
        { y: 0 },
        { y: -distance, ease: "none", duration }
      ).set(img, { y: 0 });

      tlRef.current = tl;
    };

    if (img.complete) setup();
    else img.addEventListener("load", setup);

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      img.removeEventListener("load", setup);
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

type NavProject = {
  id: number;
  slug?: string;
  title?: { rendered: string };
  acf?: {
    main_image?: { url?: string; [k: string]: any };
    technologies?: string[];
    [key: string]: any;
  };
  [key: string]: any;
};

export default function ProjectDetailClient({ project }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSlugFromUrl = pathname.split("/").filter(Boolean).pop() || "";
  const currentIdFromUrl = Number(searchParams.get("id") || "");

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

  // Parallax για Highlight_1
  const techRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: techRef,
    offset: ["start end", "end start"],
  });
  const techY = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);

  // -------- Prev / Next --------
  const [nav, setNav] = useState<{
  prev: NavProject | null;
  next: NavProject | null;
  debug?: any;
}>({
  prev: null,
  next: null,
  debug: null,
});

  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const qs = new URLSearchParams();
      if (currentIdFromUrl) qs.set("id", String(currentIdFromUrl));
      if (currentSlugFromUrl) qs.set("slug", currentSlugFromUrl);

      const url = `/api/portfolio-nav?${qs.toString()}`;

      const res = await fetch(url, { cache: "no-store" });

      // ✅ ΠΑΝΤΑ διαβάζουμε body για να δούμε τι έγινε
      const text = await res.text();

      // Προσπαθούμε να το κάνουμε JSON αν γίνεται
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!cancelled) {
        setNav({
          prev: data?.prev ?? null,
          next: data?.next ?? null,
          debug:
            data?.debug ??
            ({
              apiUrl: url,
              status: res.status,
              ok: res.ok,
              raw: text?.slice(0, 800),
            } as any),
        });
      }
    } catch (e: any) {
      if (!cancelled) {
        setNav({
          prev: null,
          next: null,
          debug: { error: String(e?.message || e) },
        });
      }
    }
  };

  load();
  return () => {
    cancelled = true;
  };
}, [currentSlugFromUrl, currentIdFromUrl]);


  const navCardRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleProjectNavClick = (target: NavProject, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (typeof window === "undefined") {
      router.push(`/portfolio/${target.slug}?id=${target.id}`);
      return;
    }

    const cardEl = navCardRefs.current[target.id];
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

    // high-res transition
    const hiRes = target?.acf?.main_image?.url;
    if (hiRes) {
      clone.src = hiRes;
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

    gsap.set(clone, { transformPerspective: 1400 });

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

    tl.set(clone, { x: 0, y: 0, scale: 1, rotationX: 0, rotationY: 0, borderRadius: "32px" });

    tl.to(clone, { y: -28, rotationX: 10, rotationY: -10, scale: 1.06, borderRadius: "40px 120px 30px 100px" });
    tl.to(clone, { y: 26, rotationX: -12, rotationY: 12, scale: 1.12, borderRadius: "130px 40px 150px 50px" });
    tl.to(clone, { y: -18, rotationX: 8, rotationY: -6, scale: 1.08, borderRadius: "60px 140px 80px 160px" });
    tl.to(clone, { y: 8, rotationX: -4, rotationY: 4, scale: 1.03, borderRadius: "30px 80px 50px 90px", duration: 0.28 });

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
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        {mainImageUrl && (
          <Image src={mainImageUrl} alt={title} fill priority className="object-cover" />
        )}
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-y border-slate-200 bg-slate-50 py-4">
        <div className="whitespace-nowrap">
          <div className="portfolio-marquee text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-slate-500">
            {Array.from({ length: 12 }).map(() => `${title} •`).join(" ")}
          </div>
        </div>
      </section>

      {/* HEADING + LOGO + TAGS */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 md:flex-row md:items-start md:px-8">
          <div className="md:w-2/3 space-y-6">
            {heading2 && (
              <motion.div {...reveal(0.05, 18)}>
                <div className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Case Study</h2>
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">{heading2}</h1>
                </div>
              </motion.div>
            )}

            {heading3 && (
              <motion.p {...reveal(0.12, 14)} className="text-base md:text-lg text-slate-600">
                {heading3}
              </motion.p>
            )}

            {description && (
              <motion.p {...reveal(0.18, 12)} className="text-sm md:text-base leading-relaxed text-slate-600">
                {description}
              </motion.p>
            )}

            {technologies.length > 0 && (
              <motion.div {...reveal(0.22, 10)} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, idx) => (
                    <motion.span
                      key={tech}
                      {...reveal(0.25 + idx * 0.03, 10, 0.98)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs md:text-[13px] font-medium text-slate-700"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="md:w-1/3 flex flex-col gap-6 md:items-end">
            {logoUrl && (
              <motion.div {...reveal(0.08, 18, 0.98)} className="flex md:justify-end w-full">
                <div className="relative h-36 w-36 md:h-44 md:w-44 rounded-full border border-slate-200 bg-white shadow-lg flex items-center justify-center">
                  <Image src={logoUrl} alt={`${title} logo`} fill className="object-contain p-6" />
                </div>
              </motion.div>
            )}

            <motion.div {...reveal(0.16, 18)} className="w-full md:max-w-[420px] rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Project Info</h4>
              <div className="space-y-4 text-sm text-slate-700">
                {industry && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Industry</div>
                    <div>{industry}</div>
                  </div>
                )}
                {location && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Location</div>
                    <div>{location}</div>
                  </div>
                )}
                {(heading3 || description) && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                    {heading3 || description}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlight_1 FULL WIDTH + parallax */}
      {highlight1 && (
        <section
          ref={(el) => {
            techRef.current = el;
          }}
          className="relative h-screen w-full overflow-hidden bg-slate-50"
        >
          <motion.div style={{ y: techY }} className="absolute inset-0">
            <Image src={highlight1} alt={`${title} technologies visual`} fill priority={false} className="object-cover" />
          </motion.div>

          <motion.div {...reveal(0.05, 12)} className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-8 pt-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 drop-shadow">
              Technologies
            </h3>
          </motion.div>
        </section>
      )}

      {/* WHOLE SITE */}
      {wholeSiteUrl && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1440px] px-6 md:px-8">
            <motion.div {...reveal(0.06, 16)}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Whole Site</h3>
            </motion.div>

            <motion.div {...reveal(0.1, 22, 0.99)} className="mt-4 h-screen">
              <AutoScrollImage src={wholeSiteUrl} duration={20} />
            </motion.div>
          </div>
        </section>
      )}

      {/* TEXT_1 + HIGHLIGHT_2 */}
      {(text1 || highlight2) && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 md:grid-cols-2 md:px-8 md:items-start">
            {text1 && (
              <motion.div
                {...reveal(0.06, 16)}
                className="text-sm md:text-base leading-relaxed text-slate-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: text1 }}
              />
            )}

            {highlight2 && (
              <motion.div {...reveal(0.12, 18, 0.99)} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                <Image src={highlight2} alt={`${title} highlight 2`} width={1200} height={900} className="h-full w-full object-cover" />
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* HIGHLIGHT_3 + HIGHLIGHT_4 */}
      {(highlight3 || highlight4) && (
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 md:grid-cols-2 md:px-8">
            {highlight3 && (
              <motion.div {...reveal(0.06, 18, 0.99)} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                <Image src={highlight3} alt={`${title} highlight 3`} width={1200} height={900} className="h-full w-full object-cover" />
              </motion.div>
            )}
            {highlight4 && (
              <motion.div {...reveal(0.12, 18, 0.99)} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl">
                <Image src={highlight4} alt={`${title} highlight 4`} width={1200} height={900} className="h-full w-full object-cover" />
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* TEXT_2 */}
      {text2 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-[1440px] px-6 md:px-8">
            <motion.div {...reveal(0.06, 14)}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Website</h3>
            </motion.div>

            <motion.div
              {...reveal(0.12, 20)}
              className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-sm md:text-base leading-relaxed text-slate-700 space-y-4 shadow-md"
              dangerouslySetInnerHTML={{ __html: text2 }}
            />
          </div>
        </section>
      )}

      {/* HIGHLIGHT_5 */}
      {highlight5 && (
        <motion.div {...reveal(0.06, 22)} className="mx-auto mt-16 max-w-[1440px] px-6 md:px-8">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Highlight</h3>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
            <Image src={highlight5} alt={`${title} highlight`} width={1600} height={800} className="h-full w-full object-cover" />
          </div>
        </motion.div>
      )}

      {/* ✅ PREV / NEXT */}
      {(nav.prev || nav.next) && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1440px] px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {nav.prev && (
                <motion.div {...reveal(0.06, 18, 0.99)}>
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Previous Project
                  </div>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={(e) => handleProjectNavClick(nav.prev as NavProject, e)}
                    ref={(el) => {
                      navCardRefs.current[(nav.prev as NavProject).id] = el;
                    }}
                  >
                    <PortfolioCard project={nav.prev as any} />
                  </button>
                </motion.div>
              )}

              {nav.next && (
                <motion.div {...reveal(0.12, 18, 0.99)}>
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Next Project
                  </div>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={(e) => handleProjectNavClick(nav.next as NavProject, e)}
                    ref={(el) => {
                      navCardRefs.current[(nav.next as NavProject).id] = el;
                    }}
                  >
                    <PortfolioCard project={nav.next as any} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}
      {/* ✅ DEBUG – ΠΡΕΠΕΙ ΝΑ ΦΑΙΝΕΤΑΙ ΠΑΝΤΑ */}
<section className="bg-red-50 py-10">
  <div className="mx-auto max-w-[1440px] px-6 md:px-8">
    <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-900">
      <div className="font-bold mb-2">DEBUG NAV (should always be visible)</div>
      <div>pathname slug: <b>{currentSlugFromUrl}</b></div>
      <div>query id: <b>{currentIdFromUrl || "—"}</b></div>
      <div className="mt-2">nav.prev: <b>{nav.prev ? `${nav.prev.id} / ${nav.prev.slug}` : "null"}</b></div>
      <div className="mt-3 font-bold">API DEBUG</div>
<pre className="mt-2 whitespace-pre-wrap text-[12px] leading-relaxed">
  {JSON.stringify(nav.debug, null, 2)}
</pre>

      <div>nav.next: <b>{nav.next ? `${nav.next.id} / ${nav.next.slug}` : "null"}</b></div>
      <pre className="mt-2 whitespace-pre-wrap text-[12px] leading-relaxed">
  {JSON.stringify(nav.debug, null, 2)}
</pre>

    </div>
  </div>
</section>

    </main>
  );
}
