// app/project/page.tsx
import ProjectDetailClient from "../portfolio/ProjectDetailClient";
import type { PortfolioProject } from "../portfolio/page";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: { [key: string]: any };
};

type PageProps = {
  searchParams: {
    id?: string | string[];
  };
};

async function fetchProjectById(id: string): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch project by id", id, res.status);
    return null;
  }

  return (await res.json()) as PortfolioDetail;
}

async function fetchAllProjects(): Promise<PortfolioProject[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch project list", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioProject[];
  return Array.isArray(data) ? data : [];
}

export default async function ProjectPage({ searchParams }: PageProps) {
  const idParam = searchParams.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : undefined;

  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <p>
            Δεν δόθηκε id στο query string. Περίμενα κάτι σαν /project?id=39.
          </p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg inline-block text-left">
            {JSON.stringify({ searchParams }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const project = await fetchProjectById(id);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <p>Δεν βρέθηκε project με αυτό το id.</p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg inline-block text-left">
            {JSON.stringify({ id }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const allProjects = await fetchAllProjects();

  let prevProject: PortfolioProject | null = null;
  let nextProject: PortfolioProject | null = null;

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
