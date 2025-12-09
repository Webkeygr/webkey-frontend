import PortfolioClient from "./PortfolioClient";

export type PortfolioProject = {
  id: number;
  title: { rendered: string };
  slug: string;
  acf?: {
    [key: string]: any;
  };
};

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

// 1. Φέρνουμε ΛΙΣΤΑ (χωρίς ACF)
async function fetchPortfolioList(): Promise<PortfolioProject[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio list", res.status);
    return [];
  }

  const data = (await res.json()) as any[];

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    acf: item.acf, // μπορεί να είναι [] εδώ, δεν μας νοιάζει
  }));
}

// 2. Για κάθε ID φέρνουμε το πλήρες post με ACF
async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const list = await fetchPortfolioList();
  if (!list.length) return [];

  const detailed = await Promise.all(
    list.map(async (item) => {
      const res = await fetch(
        `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${item.id}?acf_format=standard`,
        {
          next: { revalidate: 60 },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch portfolio item", item.id, res.status);
        return item; // γύρνα τουλάχιστον τον τίτλο
      }

      const full = (await res.json()) as any;

      return {
        id: full.id,
        title: full.title,
        slug: full.slug,
        acf: full.acf ?? {},
      } satisfies PortfolioProject;
    })
  );

  return detailed;
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolioProjects();
  return <PortfolioClient projects={projects} />;
}
