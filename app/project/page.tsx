// app/project/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient from "../portfolio/ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    [key: string]: any;
  };
};

type PageProps = {
  searchParams?: { id?: string };
};

async function fetchPortfolioById(id: string): Promise<PortfolioDetail | null> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch portfolio by ID", id, res.status);
      return null;
    }

    const data = (await res.json()) as PortfolioDetail;
    if (!data || !data.id) return null;
    return data;
  } catch (err) {
    console.error("Error fetching portfolio by ID", err);
    return null;
  }
}

export default async function ProjectPage({ searchParams }: PageProps) {
  const id = searchParams?.id;

  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">
            Δεν δόθηκε id στο query string.
          </h1>
          <p className="text-sm opacity-80">
            Περίμενα κάτι σαν <code>/project?id=39</code>.
          </p>
          <pre className="bg-neutral-900 text-neutral-300 text-xs px-4 py-3 rounded-lg inline-block text-left max-w-full overflow-auto">
            {JSON.stringify({ searchParams: searchParams ?? {} }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const project = await fetchPortfolioById(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
