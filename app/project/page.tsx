// app/project/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/app/portfolio/ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

export type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: Record<string, any>;
};

type PageProps = {
  searchParams?: { id?: string };
};

async function fetchPortfolioById(id: string): Promise<PortfolioDetail | null> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  return (await res.json()) as PortfolioDetail;
}

export default async function ProjectByIdPage({ searchParams }: PageProps) {
  const id = searchParams?.id;

  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white p-8">
        <div className="text-center space-y-4">
          <p>Δεν δόθηκε id στο query string. Περίμενα κάτι σαν /project?id=39.</p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg text-left inline-block max-w-full overflow-auto">
            {JSON.stringify({ searchParams }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const project = await fetchPortfolioById(id);

  if (!project) notFound();

  // ✅ ΜΟΝΟ αυτό – χωρίς prev/next
  return <ProjectDetailClient project={project} />;
}
