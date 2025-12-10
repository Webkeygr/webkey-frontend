// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
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

// ✅ fetch με βάση ID – ΧΩΡΙΣ acf_format
async function fetchPortfolioById(id: string): Promise<PortfolioDetail | null> {
  const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch portfolio by ID", id, res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail;
  return data ?? null;
}

// fetch με βάση slug – εδώ κρατάμε acf_format
async function fetchPortfolioBySlug(
  slug: string
): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio by slug", res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail[];
  if (!data.length) return null;
  return data[0];
}

// όλα τα projects για prev/next
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
  searchParams: { id?: string };
};

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: PageProps) {
  const id = searchParams.id;
  let project: PortfolioDetail | null = null;

  if (id) {
    project = await fetchPortfolioById(id);
  } else {
    project = await fetchPortfolioBySlug(params.slug);
  }

  if (!project) {
    notFound();
  }

  const allProjects = await fetchAllPortfolios();

  let prevProject: PortfolioDetail | null = null;
  let nextProject: PortfolioDetail | null = null;

  if (allProjects.length) {
    const index = allProjects.findIndex((p) => p.id === project!.id);
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
