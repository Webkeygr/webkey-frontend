// app/portfolio/[slug]/page.tsx
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

async function fetchPortfolioBySlug(slug: string) {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  const status = res.status;

  if (!res.ok) {
    console.error("Failed to fetch portfolio by slug", status);
    return { project: null as PortfolioDetail | null, status, url };
  }

  const data = (await res.json()) as PortfolioDetail[];
  const project = data[0] ?? null;

  return { project, status, url };
}

async function fetchAllPortfolios(): Promise<PortfolioDetail[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch all portfolios", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioDetail[];
  return data ?? [];
}

type PageProps = {
  params: { slug: string };
};

export default async function PortfolioDetailPage({ params }: PageProps) {
  const slug = params.slug;

  // 🔍 Παίρνουμε το project ΜΟΝΟ με βάση το slug
  const { project, status, url } = await fetchPortfolioBySlug(slug);

  // ❌ Αν δεν βρέθηκε, δείξε debug αντί για 404
  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Portfolio detail – debug</h1>
        <p className="mb-2">
          Δεν βρέθηκε project με αυτό το slug. Δες τα debug στοιχεία:
        </p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
          {JSON.stringify(
            {
              slug,
              bySlugUrl: url,
              bySlugStatus: status,
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }

  // Αν ΒΡΕΘΗΚΕ, συνεχίζουμε κανονικά με previous / next
  const allProjects = await fetchAllPortfolios();

  let prevProject: PortfolioDetail | null = null;
  let nextProject: PortfolioDetail | null = null;

  if (allProjects.length) {
    const index = allProjects.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      if (index > 0) prevProject = allProjects[index - 1];
      if (index < allProjects.length - 1) nextProject = allProjects[index + 1];
    }
  }

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
