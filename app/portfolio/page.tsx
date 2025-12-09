import PortfolioClient from "./PortfolioClient";

// Τύπος project με βάση το WP REST + ACF
export type PortfolioProject = {
  id: number;
  title: { rendered: string };
  acf?: {
    main_image?: {
      url?: string;
    };
    technologies?: string[];
  };
};

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

// Φέρνει τα projects από το WordPress CPT "portfolio"
async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?acf_format=standard&per_page=100`,
    {
      // SSG με revalidate (π.χ. κάθε 60 δευτερόλεπτα)
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch portfolio from WordPress", res.status);
    return [];
  }

  const data = (await res.json()) as any[];

  // Προληπτικό mapping για να είμαστε σίγουροι στο shape
  return data.map((item) => ({
    id: item.id,
    title: {
      rendered: item?.title?.rendered ?? "",
    },
    acf: {
      main_image: {
        url: item?.acf?.main_image?.url ?? "",
      },
      technologies: item?.acf?.technologies ?? [],
    },
  }));
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolioProjects();

  return <PortfolioClient projects={projects} />;
}
