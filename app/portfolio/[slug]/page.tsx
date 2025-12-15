// app/portfolio/[slug]/page.tsx
import ProjectDetailClient from "../ProjectDetailClient";
import type { PortfolioDetail } from "../types";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

async function fetchBySlug(slug: string) {
  const apiUrl = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${encodeURIComponent(
    slug
  )}&acf_format=standard`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const status = res.status;
    const raw = await res.json().catch(() => null);

    const length = Array.isArray(raw) ? raw.length : -1;
    const project = Array.isArray(raw) && raw.length ? (raw[0] as PortfolioDetail) : null;

    return { apiUrl, status, length, raw, project };
  } catch (err: any) {
    return {
      apiUrl: `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`,
      status: 0,
      length: -1,
      raw: { error: String(err) },
      project: null,
    };
  }
}

export default async function PortfolioDetailPage(props: any) {
  // ✅ έτσι πιάνουμε 100% το slug αν υπάρχει
  const slug = props?.params?.slug;

  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-3xl px-4 text-left space-y-4">
          <h1 className="text-lg font-semibold">Δεν πήρα slug από το route.</h1>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg overflow-auto max-h-[60vh]">
            {JSON.stringify({ propsKeys: Object.keys(props ?? {}), props }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const { apiUrl, status, length, raw, project } = await fetchBySlug(slug);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-3xl px-4 text-left space-y-4">
          <h1 className="text-lg font-semibold">Δεν βρέθηκε project με αυτό το slug.</h1>
          <p>
            Άνοιξες URL: <span className="font-mono">{`/portfolio/${slug}`}</span>
          </p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg overflow-auto max-h-[60vh]">
            {JSON.stringify({ slug, apiUrl, status, length, rawSample: Array.isArray(raw) ? raw[0] : raw }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  return <ProjectDetailClient project={project} />;
}
