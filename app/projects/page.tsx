// app/projects/page.tsx
import { fetchWPGraphQL } from "@/lib/wp-graphql";
import { GET_PROJECTS } from "@/lib/queries";

type Project = {
  id: string;
  title: string;
  slug: string;
  projectMeta?: {
    client?: string | null;
    year?: string | null;
    projectUrl?: string | null;
    featuredColor?: string | null;
    shortDescription?: string | null;
  } | null;
};

type ProjectsResponse = {
  projects: {
    nodes: Project[];
  };
};

export default async function ProjectsPage() {
  // 1. Φέρνουμε τα data από το WP
  const data = await fetchWPGraphQL<ProjectsResponse>(GET_PROJECTS);
  const projects = data?.projects?.nodes || [];

  // 2. Render
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Projects</h1>

        {/* πρόχειρο layout για να δεις ΟΤΙ δουλεύει */}
        <div className="space-y-4">
          {projects.map((project) => {
            const meta = project.projectMeta;
            return (
              <div
                key={project.id}
                className="rounded-lg border border-white/10 p-4"
              >
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-sm text-white/60 mb-2">
                  slug: <code>{project.slug}</code>
                </p>
                <p className="text-sm">
                  Client: {meta?.client || "—"} | Year: {meta?.year || "—"}
                </p>
                <p className="text-sm">
                  URL: {meta?.projectUrl ? meta.projectUrl : "—"}
                </p>
                <p className="text-sm">
                  Color: {meta?.featuredColor ? meta.featuredColor : "—"}
                </p>
                <p className="text-sm mt-2 text-white/70">
                  {meta?.shortDescription}
                </p>
              </div>
            );
          })}

          {projects.length === 0 && (
            <p className="text-white/50">Δεν υπάρχουν projects.</p>
          )}
        </div>
      </div>
    </div>
  );
}
