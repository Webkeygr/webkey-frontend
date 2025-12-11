// app/portfolio/page.tsx
import PortfolioClient from "./PortfolioClient";

export type PortfolioProject = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    [key: string]: any;
  };
};

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`;

  try {
    const res = await fetch(url, {
      // μικρό revalidate για να τραβάει σχετικά φρέσκα
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch portfolio list", res.status, url);
      return [];
    }

    const data = (await res.json()) as PortfolioProject[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error while fetching portfolio list", err);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await fetchPortfolioProjects();

  if (!projects || projects.length === 0) {
    const debugPayload = {
      wpUrl: `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
      count: projects?.length ?? 0,
    };

    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <p>Δεν βρέθηκαν projects από το WordPress (η λίστα είναι κενή).</p>
          <pre className="text-xs text-left bg-neutral-900/80 p-4 rounded-lg max-w-[90vw] mx-auto overflow-auto">
            {JSON.stringify(debugPayload, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  // ✅ Όλα καλά – στέλνουμε τη λίστα στο client component
  return <PortfolioClient projects={projects} />;
}
