// app/project/page.tsx
import ProjectDetailClient from "../portfolio/ProjectDetailClient";

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

async function fetchPortfolioById(id: string) {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const status = res.status;

  if (!res.ok) {
    console.error("Failed to fetch portfolio by ID", id, status);
    return { project: null as PortfolioDetail | null, status, url };
  }

  const data = (await res.json()) as PortfolioDetail;
  return { project: data ?? null, status, url };
}

async function fetchAllPortfolios(): Promise<PortfolioDetail[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch all portfolios", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioDetail[];
  return data ?? [];
}

type PageProps = {
  searchParams: { id?: string };
};

export default async function ProjectPage({ searchParams }: PageProps) {
  const id = searchParams?.id;

  if (!id) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Project detail – debug</h1>
        <p className="mb-2">
          Δεν δόθηκε id στο query string. Περίμενα κάτι σαν /project?id=39.
        </p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
{JSON.stringify({ searchParams }, null, 2)}
        </pre>
      </main>
    );
  }

  const { project, status, url } = await fetchPortfolioById(id);

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Project detail – debug</h1>
        <p className="mb-2">
          Δεν βρέθηκε project με αυτό το id. Δες τα debug στοιχεία:
        </p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
{JSON.stringify(
  {
    id,
    url,
    status,
  },
  null,
  2
)}
        </pre>
      </main>
    );
  }

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
