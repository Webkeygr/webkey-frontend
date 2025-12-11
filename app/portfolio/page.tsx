// app/portfolio/page.tsx
import PortfolioClient from "./PortfolioClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioProject = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    main_image?: {
      url?: string;
      sizes?: { [key: string]: string };
    };
    technologies?: string[];
    [key: string]: any;
  };
};

async function fetchPortfolios(): Promise<PortfolioProject[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio list", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioProject[];
  return data ?? [];
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolios();
  return <PortfolioClient projects={projects} />;
}
