// app/portfolio/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProjectDetailClient from "../ProjectDetailClient";
import type { PortfolioDetail } from "../types";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";


export default function PortfolioDetailPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const [project, setProject] = useState<PortfolioDetail | null | "loading">(
    "loading"
  );
  const [debug, setDebug] = useState<any | null>(null);

  const slug = params?.slug;
  const id = searchParams.get("id") || undefined;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug && !id) {
        setProject(null);
        setDebug({ reason: "missing slug and id", slug, id });
        return;
      }

      const dbg: any = { slug, id, steps: [] };

      let found: PortfolioDetail | null = null;

      // 1) ΔΟΚΙΜΗ με ID (αν υπάρχει)
      if (id) {
        const byIdUrl = `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`;
        dbg.steps.push({ type: "byId", url: byIdUrl });

        try {
          const res = await fetch(byIdUrl, { cache: "no-store" });
          dbg.steps[dbg.steps.length - 1].status = res.status;
          if (res.ok) {
            const data = (await res.json()) as PortfolioDetail;
            found = data ?? null;
          } else {
            dbg.steps[dbg.steps.length - 1].body = await res.text();
          }
        } catch (err: any) {
          dbg.steps[dbg.steps.length - 1].error = String(err);
        }
      }

      // 2) Αν δεν βρήκαμε, δοκίμασε με slug
      if (!found && slug) {
        const bySlugUrl = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`;
        dbg.steps.push({ type: "bySlug", url: bySlugUrl });

        try {
          const res = await fetch(bySlugUrl, { cache: "no-store" });
          dbg.steps[dbg.steps.length - 1].status = res.status;
          if (res.ok) {
            const arr = (await res.json()) as PortfolioDetail[];
            dbg.steps[dbg.steps.length - 1].length = arr.length;
            found = arr[0] ?? null;
          } else {
            dbg.steps[dbg.steps.length - 1].body = await res.text();
          }
        } catch (err: any) {
          dbg.steps[dbg.steps.length - 1].error = String(err);
        }
      }

      if (cancelled) return;

      if (!found) {
        setProject(null);
        setDebug(dbg);
      } else {
        setProject(found);
        setDebug(null);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug, id]);

  // Loading state
  if (project === "loading") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-sm md:text-base">
          Φορτώνω το project...
        </div>
      </main>
    );
  }

  // Δεν βρέθηκε – δείξε debug info (μέχρι να είμαστε 100% σίγουροι)
  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl mb-4">Portfolio detail – debug (client)</h1>
        <p className="mb-2">
          Δεν βρέθηκε project. Δες τι γύρισε το σύστημα από τον browser:
        </p>
        <pre className="whitespace-pre-wrap text-xs bg-zinc-900/80 p-4 rounded-lg overflow-auto max-h-[80vh]">
          {JSON.stringify(
            {
              slug,
              id,
              debug,
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }

  // Όλα ΟΚ → κανονικό template
  return <ProjectDetailClient project={project} />;
}
