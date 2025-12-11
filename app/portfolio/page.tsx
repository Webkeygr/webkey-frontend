// app/portfolio/page.tsx
import PortfolioClient from "./PortfolioClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioProject = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    main_image?: any;
    technologies?: string[];
    [key: string]: any;
  };
};

async function fetchPortfolio(): Promise<PortfolioProject[]> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    console.error("Failed to fetch portfolio list", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioProject[];
  return data ?? [];
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolio();

  if (!projects.length) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-xl px-6 text-center">
          <p className="text-lg mb-4">
            Δεν βρέθηκαν projects από το WordPress (η λίστα είναι κενή).
          </p>
        </div>
      </main>
    );
  }

  return <PortfolioClient projects={projects} />;
}
