// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient from "../ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    [key: string]: any;
  };
};

async function fetchById(id: string): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio by ID", id, res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail;
  return data ?? null;
}

async function fetchBySlug(slug: string): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio by slug", slug, res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail[];
  if (!data.length) return null;
  return data[0];
}

type PageProps = {
  params: { slug: string };
  searchParams: { id?: string };
};

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = params;
  const id = searchParams.id;

  let project: PortfolioDetail | null = null;

  if (id) {
    project = await fetchById(id);
  } else {
    project = await fetchBySlug(slug);
  }

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
