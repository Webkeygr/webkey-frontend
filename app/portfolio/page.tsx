// app/project/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailClient from "../portfolio/ProjectDetailClient";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    main_image?: {
      url?: string;
      sizes?: { [key: string]: string };
    };
    whole_site?: {
      url?: string;
      sizes?: { [key: string]: string };
    };
    text_1?: string;
    text_2?: string;
    technologies?: string[];
    highlight_1?: string[];
    highlight_2?: string[];
    highlight_3?: string[];
    highlight_4?: string[];
    highlight_5?: string[];
    [key: string]: any;
  };
};

// 🔹 Φέρνουμε project ΜΟΝΟ με βάση το ID (ασφαλές & ξεκάθαρο)
async function fetchProjectById(id: string): Promise<PortfolioDetail | null> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch project by id", id, res.status);
      return null;
    }

    const data = (await res.json()) as PortfolioDetail;
    if (!data || !data.id) return null;

    return data;
  } catch (error) {
    console.error("Project fetch crashed:", error);
    return null;
  }
}

type PageProps = {
  searchParams?: {
    id?: string;
  };
};

export default async function ProjectPage({ searchParams }: PageProps) {
  const id = searchParams?.id;

  // ❌ Δεν ήρθε id στο query string
  if (!id) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-4">
          Δεν δόθηκε <code>id</code> στο query string.
        </h1>
        <p className="mb-2">Περίμενα κάτι σαν /project?id=39.</p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
          {JSON.stringify(
            {
              searchParams: searchParams ?? {},
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }

  const project = await fetchProjectById(id);

  // ❌ Δεν βρέθηκε project με αυτό το id
  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-4">
          Δεν βρέθηκε project με id = {id}
        </h1>
        <p className="mb-2">
          Δοκίμασε να ελέγξεις αν υπάρχει αντίστοιχο post στο WordPress.
        </p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
          {JSON.stringify(
            {
              triedUrl: `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`,
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }

  // ✅ Όλα καλά – στέλνουμε τα δεδομένα στο client component
  return <ProjectDetailClient project={project} />;
}
