// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    title?: string;
    heading_2?: string;
    heading_3?: string;
    description?: string;
    technologies?: string[];
    quote?: string;
    logo?: any;
    main_image?: any;
    whole_site?: any;
    highlight_1?: any;
    highlight_2?: any;
    highlight_3?: any;
    highlight_4?: any;
    text_1?: string;
    text_2?: string;
    industry?: string;
    location?: string;
    [key: string]: any;
  };
};

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
    console.error("Failed to fetch portfolio detail", res.status);
    return null;
  }

  const data = (await res.json()) as PortfolioDetail[];
  if (!data.length) return null;

  return data[0];
}

type PageProps = {
  params: { slug: string };
};

export default async function PortfolioDetailPage({ params }: PageProps) {
  const project = await fetchPortfolioBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
