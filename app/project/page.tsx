// app/project/page.tsx
import { redirect } from "next/navigation";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.webkey.gr";

type PortfolioDetail = {
  id: number;
  slug: string;
};

type PageProps = {
  searchParams: {
    id?: string | string[];
  };
};

export default async function LegacyProjectPage({ searchParams }: PageProps) {
  const idParam = searchParams.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : undefined;

  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <p>
            Δεν δόθηκε id στο query string. Περίμενα κάτι σαν /project?id=39.
          </p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg inline-block text-left">
            {JSON.stringify({ searchParams }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  // Φέρνουμε το project από WP μόνο για να πάρουμε το slug
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wp/v2/portfolio/${id}?acf_format=standard`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <p>Δεν βρέθηκε project με αυτό το id.</p>
          <pre className="text-xs bg-neutral-900 text-neutral-300 px-4 py-3 rounded-lg inline-block text-left">
            {JSON.stringify({ id, status: res.status }, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const data = (await res.json()) as PortfolioDetail;

  // Redirect στο καινούργιο URL του portfolio
  redirect(`/portfolio/${data.slug}?id=${data.id}`);
}
