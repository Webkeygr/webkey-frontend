import PortfolioClient from "./PortfolioClient";

export type PortfolioProject = {
  id: number;
  title: { rendered: string };
  acf?: {
    [key: string]: any; // αφήνουμε το ACF όπως έρχεται από WP
  };
};

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?acf_format=standard&per_page=100`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio from WordPress", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioProject[];

  // ΔΕΝ το πειράζουμε, το γυρνάμε όπως είναι
  return data;
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolioProjects();
  return <PortfolioClient projects={projects} />;
}
