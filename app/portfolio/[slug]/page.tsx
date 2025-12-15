// app/portfolio/[slug]/page.tsx
import ProjectDetailClient, {
  type PortfolioDetail,
} from "../ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

async function fetchBySlug(slug: string): Promise<{
  project: PortfolioDetail | null;
  debug: {
    apiUrl: string;
    status: number;
    length: number;
    raw: any;
  };
}> {
  const apiUrl = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${encodeURIComponent(
    slug
  )}&acf_format=standard`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });

    const status = res.status;
    let raw: any = null;

    try {
      raw = await res.json();
    } catch {
      raw = null;
    }

    if (!res.ok || !Array.isArray(raw) || raw.length === 0) {
      return {
        project: null,
        debug: {
          apiUrl,
          status,
          length: Array.isArray(raw) ? raw.length : -1,
          raw,
        },
      };
    }

    const project = raw[0] as PortfolioDetail;

    return {
      project,
      debug: {
        apiUrl,
        status,
        length: raw.length,
        raw,
      },
    };
  } catch (err: any) {
    return {
      project: null,
      debug: {
        apiUrl,
        status: 0,
        length: -1,
        raw: { error: String(err) },
      },
    };
  }
}

type PageProps = {
  params: { slug: string };
};

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = params;
  const { project, debug } = await fetchBySlug(slug);

  // Αν ΔΕΝ βρούμε project, δείξε DEBUG αντί για 404
  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-3xl px-4 text-left space-y-4">
          <h1 className="text-lg font-semibold">
            Δεν βρέθηκε project με αυτό το slug.
          </h1>
          <p>Άνοιξες URL: <span className="font-mono">{`/portfolio/${slug}`}</span></p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg overflow-auto max-h-[60vh]">
            {JSON.stringify(
              {
                params,
                debug,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    );
  }

  // ✅ Αν όλα είναι ΟΚ, δείξε τη σελίδα του project
  return <ProjectDetailClient project={project} />;
}
