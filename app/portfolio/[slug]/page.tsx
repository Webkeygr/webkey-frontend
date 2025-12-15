// app/portfolio/[slug]/page.tsx
import ProjectDetailClient from "../ProjectDetailClient";
import type { PortfolioDetail } from "../types";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

async function resolveMaybePromise<T>(value: T | Promise<T>): Promise<T> {
  return value instanceof Promise ? await value : value;
}

async function fetchBySlug(slug: string) {
  const apiUrl = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${encodeURIComponent(
    slug
  )}&acf_format=standard`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const status = res.status;

    const raw = await res.json().catch(() => null);
    const project =
      Array.isArray(raw) && raw.length ? (raw[0] as PortfolioDetail) : null;

    return { apiUrl, status, raw, project };
  } catch (err: any) {
    return {
      apiUrl,
      status: 0,
      raw: { error: String(err) },
      project: null as PortfolioDetail | null,
    };
  }
}

type PageProps = {
  // αφήνουμε τα “maybe promise” γιατί Next 16 μπορεί να τα δώσει έτσι
  params: { slug?: string } | Promise<{ slug?: string }>;
  searchParams?: Record<string, string | string[] | undefined> | Promise<any>;
};

export default async function PortfolioDetailPage(props: PageProps) {
  const resolvedParams = await resolveMaybePromise(props.params);
  const slug = resolvedParams?.slug;

  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-3xl px-4 text-left space-y-4">
          <h1 className="text-lg font-semibold">Δεν πήρα slug από το route.</h1>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg overflow-auto max-h-[60vh]">
            {JSON.stringify({ resolvedParams }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const { apiUrl, status, raw, project } = await fetchBySlug(slug);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-3xl px-4 text-left space-y-4">
          <h1 className="text-lg font-semibold">
            Δεν βρέθηκε project με αυτό το slug.
          </h1>
          <p>
            Άνοιξες URL: <span className="font-mono">{`/portfolio/${slug}`}</span>
          </p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg overflow-auto max-h-[60vh]">
            {JSON.stringify(
              {
                apiUrl,
                status,
                length: Array.isArray(raw) ? raw.length : null,
                rawSample: Array.isArray(raw) ? raw[0] : raw,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    );
  }

  return <ProjectDetailClient project={project} />;
}
