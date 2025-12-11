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

  // μικρό debug fallback για να βλέπεις *κάτι* αν για κάποιο λόγο έρθει [].
  if (!projects.length) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Portfolio – debug</h1>
        <p className="mb-2">
          Δεν βρέθηκαν projects από το WordPress (η λίστα είναι κενή).
        </p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
          {JSON.stringify(
            {
              wpUrl: `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
              count: projects.length,
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }

  return <PortfolioClient projects={projects} />;
}
