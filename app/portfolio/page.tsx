// app/portfolio/page.tsx

export default async function PortfolioPage() {
  // ΠΡΟΣΩΡΙΝΟ FALLBACK – δείχνει 4 dummy projects μέχρι να συνδέσουμε το πραγματικό WP
  const projects = [
    {
      id: 1,
      title: { rendered: "E-shop με Next.js & WooCommerce" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=900&fit=crop" },
        technologies: ["Next.js", "WooCommerce", "Tailwind", "GSAP"]
      }
    },
    {
      id: 2,
      title: { rendered: "Corporate Website με Animations" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop" },
        technologies: ["React", "Framer Motion", "WordPress"]
      }
    },
    {
      id: 3,
      title: { rendered: "Portfolio με 3D Effects" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1558655146-9f40138ed1cb?w=1200&h=900&fit=crop" },
        technologies: ["Three.js", "Next.js", "Shader"]
      }
    },
    {
      id: 4,
      title: { rendered: "Brand Identity & Web" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=900&fit=crop" },
        technologies: ["Figma", "Webflow", "Custom CSS"]
      }
    }
  ];

  return (
    <>
      {/* HERO SECTION – ίδια με πριν */}
      <section className="relative h-screen flex flex-col justify-center items-center text-white overflow-hidden">
        <IridescentBackground />

        <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-black text-white px-8 py-4 rounded-full text-sm font-bold -rotate-90 hidden lg:block">
          VIDEO
        </div>

        <div className="relative h-80 w-full max-w-7xl flex items-center justify-center pointer-events-none select-none">
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

        <div className="text-center px-6 max-w-3xl">
          <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
            Ένα showcase επιλεγμένων digital έργων όπου το design, η τεχνολογία και η τυπογραφία συναντιούνται. 
            Projects χτισμένα με Next.js, WordPress, WooCommerce και custom animations – όλα με έναν στόχο: να ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project: any) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}