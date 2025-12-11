// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient from "../ProjectDetailClient";
import type { PortfolioProject } from "../page";

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

async function fetchPortfolioBySlug(
  slug: string
): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio by slug", res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail[];
  if (!data.length) return null;
  return data[0];
}

async function fetchAllProjects(): Promise<PortfolioProject[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio list for prev/next", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioProject[];
  return data ?? [];
}

type PageProps = {
  params: { slug: string };
};

export default async function PortfolioDetailPage({ params }: PageProps) {
  const project = await fetchPortfolioBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const allProjects = await fetchAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);

  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
