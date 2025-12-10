// app/portfolio/[slug]/page.tsx
export const dynamic = "force-dynamic";

import ProjectDetailClient from "../ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    [key: string]: any;
  };
};

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: PageProps) {
  const idParam = searchParams.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : undefined;

  const debug: any = {
    params,
    searchParams,
    resolvedId: id,
  };

  let project: PortfolioDetail | null = null;

  // 1) ΔΟΚΙΜΗ με ID
  if (id) {
    const urlById = `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`;
    debug.byIdUrl = urlById;

    try {
      const res = await fetch(urlById, { cache: "no-store" });
      debug.byIdStatus = res.status;

      if (res.ok) {
        const data = (await res.json()) as PortfolioDetail;
        project = data ?? null;
      } else {
        debug.byIdBody = (await res.text()).slice(0, 2000);
      }
    } catch (err: any) {
      debug.byIdError = String(err);
    }
  }

  // 2) ΑΝ δεν βρήκαμε με ID, δοκίμασε με slug
  if (!project) {
    const urlBySlug = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${params.slug}&acf_format=standard`;
    debug.bySlugUrl = urlBySlug;

    try {
      const res = await fetch(urlBySlug, { cache: "no-store" });
      debug.bySlugStatus = res.status;

      if (res.ok) {
        const arr = (await res.json()) as PortfolioDetail[];
        debug.bySlugLength = arr.length;
        project = arr[0] ?? null;
      } else {
        debug.bySlugBody = (await res.text()).slice(0, 2000);
      }
    } catch (err: any) {
      debug.bySlugError = String(err);
    }
  }

  // 3) Αν ακόμα δεν βρήκαμε project, ΔΕΝ ρίχνουμε 404 – δείξε debug info
  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl mb-4">Portfolio detail – debug</h1>
        <p className="mb-2">
          Δεν βρέθηκε project. Δες παρακάτω τι γύρισε το σύστημα:
        </p>
        <pre className="whitespace-pre-wrap text-xs bg-zinc-900/80 p-4 rounded-lg overflow-auto max-h-[80vh]">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </main>
    );
  }

  // 4) Όλα ΟΚ → κανονικό template
  return <ProjectDetailClient project={project} />;
}
