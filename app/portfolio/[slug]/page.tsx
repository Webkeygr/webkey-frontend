// app/portfolio/[slug]/page.tsx
import ProjectDetailClient from "../ProjectDetailClient";

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

async function fetchPortfolioById(id: string) {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const status = res.status;

  if (!res.ok) {
    console.error("Failed to fetch portfolio by ID", id, status);
    return { project: null as PortfolioDetail | null, status, url };
  }

  const data = (await res.json()) as PortfolioDetail;
  return { project: data ?? null, status, url };
}

async function fetchPortfolioBySlug(slug: string | undefined) {
  if (!slug) {
    return {
      project: null as PortfolioDetail | null,
      status: 0,
      url: `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=<no-slug>&acf_format=standard`,
    };
  }

  const url = `${WP_BASE_URL}/wp-json/wp/v2/portfolio?slug=${slug}&acf_format=standard`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const status = res.status;

  if (!res.ok) {
    console.error("Failed to fetch portfolio by slug", slug, status);
    return { project: null as PortfolioDetail | null, status, url };
  }

  const data = (await res.json()) as PortfolioDetail[];
  const project = data[0] ?? null;

  return { project, status, url };
}

async function fetchAllPortfolios(): Promise<PortfolioDetail[]> {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch all portfolios", res.status);
    return [];
  }

  const data = (await res.json()) as PortfolioDetail[];
  return data ?? [];
}

type PageProps = {
  params: { slug?: string };
  searchParams: { id?: string };
};

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: PageProps) {
  const slug = params?.slug;
  const id = searchParams?.id;

  let projectResult:
    | Awaited<ReturnType<typeof fetchPortfolioById>>
    | Awaited<ReturnType<typeof fetchPortfolioBySlug>>;

  // 1️⃣ Προσπαθούμε ΠΡΩΤΑ με id (γιατί το στέλνουμε από το PortfolioClient)
  if (id) {
    projectResult = await fetchPortfolioById(id);
  } else {
    // 2️⃣ fallback: δοκιμή με slug, αν κάποιος μπει απευθείας στο URL
    projectResult = await fetchPortfolioBySlug(slug);
  }

  const { project, status, url } = projectResult;

  // Αν πάλι δεν βρήκαμε, δείχνουμε debug (για να μη βλέπεις τυφλό 404)
  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Portfolio detail – debug</h1>
        <p className="mb-2">
          Δεν βρέθηκε project. Δες παρακάτω τι γύρισε το σύστημα:
        </p>
        <pre className="mt-4 text-sm whitespace-pre-wrap bg-zinc-900 p-4 rounded-lg">
{JSON.stringify(
  {
    params,
    searchParams,
    byIdOrSlugUrl: url,
    byIdOrSlugStatus: status,
  },
  null,
  2
)}
        </pre>
      </main>
    );
  }

  const allProjects = await fetchAllPortfolios();

  let prevProject: PortfolioDetail | null = null;
  let nextProject: PortfolioDetail | null = null;

  if (allProjects.length) {
    const index = allProjects.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      if (index > 0) prevProject = allProjects[index - 1];
      if (index < allProjects.length - 1) nextProject = allProjects[index + 1];
    }
  }

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
