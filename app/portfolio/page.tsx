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

async function fetchProjects(): Promise<PortfolioProject[]> {
  const url =
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio` +
    `?per_page=100` +
    `&orderby=menu_order` +
    `&order=asc` +
    `&acf_format=standard` +
    `&lang=all`; // ασφαλές και με Polylang

  const res = await fetch(url, {
    // απλό revalidate
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch portfolio list", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioProject[] | any;

  // αν για κάποιο λόγο δεν είναι array
  if (!Array.isArray(data)) {
    console.warn("Portfolio list is not an array:", data);
    return [];
  }

  return data;
}

export default async function PortfolioPage() {
  const projects = await fetchProjects();

  if (!projects.length) {
    const debug = {
      wpUrl:
        `${WP_BASE_URL}/wp-json/wp/v2/portfolio` +
        `?per_page=100&orderby=menu_order&order=asc&acf_format=standard&lang=all`,
      count: projects.length,
    };

    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-2xl text-center space-y-4">
          <p>Δεν βρέθηκαν projects από το WordPress (η λίστα είναι κενή).</p>
          <pre className="mt-4 text-xs bg-neutral-900/80 p-4 rounded-lg text-left overflow-x-auto">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  return <PortfolioClient projects={projects} />;
}
