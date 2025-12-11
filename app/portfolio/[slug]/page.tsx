// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient, {
  type PortfolioDetail,
} from "../ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

async function fetchById(id: string): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio by ID", id, res.status);
    return null;
  }

  return (await res.json()) as PortfolioDetail;
}

async function fetchBySlug(slug: string): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio by slug", slug, res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail[];
  return data[0] ?? null;
}

async function fetchAllProjects(): Promise<PortfolioDetail[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=title&order=asc&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];
  const data = (await res.json()) as PortfolioDetail[];
  return Array.isArray(data) ? data : [];
}

type PageProps = {
  params: { slug: string };
  searchParams: { id?: string | string[] };
};

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: PageProps) {
  const slug = params.slug;
  const idParam = searchParams.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : undefined;

  let project: PortfolioDetail | null = null;

  if (id) {
    project = await fetchById(id);
  }

  // fallback σε slug αν δεν βρεθεί με id
  if (!project) {
    project = await fetchBySlug(slug);
  }

  if (!project) {
    notFound();
  }

  const all = await fetchAllProjects();
  let prevProject: PortfolioDetail | null = null;
  let nextProject: PortfolioDetail | null = null;

  if (all.length) {
    const index = all.findIndex((p) => p.id === project!.id);
    if (index !== -1) {
      const prevIndex = (index - 1 + all.length) % all.length;
      const nextIndex = (index + 1) % all.length;
      prevProject = all[prevIndex] ?? null;
      nextProject = all[nextIndex] ?? null;
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
