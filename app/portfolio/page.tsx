import TextPressure from '@/app/components/TextPressure';
import { PortfolioCard } from '@/app/components/PortfolioCard';
//import { IridescentBackground } from '@/app/components/IridescentBackground'; // αν έχεις τέτοιο component, αλλιώς θα βάλουμε CSS

// Αν δεν έχεις ξεχωριστό component για iridescent, το κάνουμε inline
const IridescentBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 opacity-600 opacity-40 animate-gradient-xy" />
    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-800 opacity-30 animate-gradient-xy delay-1000" />
  </div>
);

export default async function PortfolioPage() {
  // Φέρνουμε τα portfolio posts από το headless WordPress
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/portfolio?per_page=12&_embed&acf_format=standard`,
    { next: { revalidate: 60 } } // cache 60 δευτερόλεπτα
  );

  const projects = await res.json();

  return (
    <>
      {/* HERO SECTION – 100vh */}
      <section className="relative h-screen flex flex-col justify-center items-center text-white">
        <IridescentBackground />

        {/* VIDEO circle (το έχεις στο layout ή component)
        <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold rotate-[-90deg]">
          VIDEO
        </div>

        {/* Portfolio Title με το effect */}
        <div className="relative h-80 w-full max-w-7xl flex items-center justify-center pointer-events-none">
          <TextPressure
            text="Portfolio"
            textColor="#ffffff"
            minFontSize={60}
            weight={true}
            width={true}
            italic={true}
            alpha={false}
            stroke={false}
            scale={false}
            flex={true}
          />
        </div>

        {/* Περιγραφή */}
        <div className="text-center px-6 max-w-2xl">
          <p className="text-lg opacity-90">
            Ένα showcase επιλεγμένων digital έργων όπου το design, η τεχνολογία και η
            τυπογραφία συναντιούνται. Projects χτισμένα με Next.js, WordPress,
            WooCommerce και custom animations – όλα με έναν στόχο: να ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project: any) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}