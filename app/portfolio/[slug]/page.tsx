// app/portfolio/[slug]/page.tsx
export const dynamic = "force-dynamic";

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

// fetch με βάση ID (σίγουρη δουλειά)
async function fetchPortfolioById(id: string): Promise<PortfolioDetail | null> {
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

// fallback: fetch με βάση slug (σε περίπτωση που δεν έχουμε id)
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

  return <ProjectDetailClient project={project} />;
}
