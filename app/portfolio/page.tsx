// app/portfolio/page.tsx
import PortfolioClient from "./PortfolioClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioProject = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    [key: string]: any;
  };
};

async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch portfolio list", res.status);
      return [];
    }

    const data = (await res.json()) as PortfolioProject[];

    if (!Array.isArray(data)) {
      console.error("Portfolio list is not an array", data);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error fetching portfolio list", err);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolioProjects();

  if (!projects.length) {
    const debugUrl = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`;

    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <p>Δεν βρέθηκαν projects από το WordPress (η λίστα είναι κενή).</p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg text-left inline-block max-w-full overflow-auto">
            {JSON.stringify(
              {
                wpUrl: debugUrl,
                count: projects.length,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    );
  }

  return <PortfolioClient projects={projects} />;
}
