// app/portfolio/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import TextPressure from '@/app/components/TextPressure';
import { fetchPortfolioProjects } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Portfolio | Webkey',
  description: 'Επιλεγμένα έργα web design, development και digital branding.',
};

export default async function PortfolioPage() {
  const projects = await fetchPortfolioProjects();

  return (
    <>
      {/* Hero Section - 100vh με Iridescence Background */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Iridescence Background - ίδιο με το Hero σου */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 opacity-80" />
        <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-soft-light opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* VIDEO Circle */}
        <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2">
          <div className="w-32 h-32 lg:w-40 lg:h-40 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-lg lg:text-2xl rotate-[-20deg] shadow-2xl">
            VIDEO
          </div>
        </div>

        {/* Portfolio Title με το μαγικό effect */}
        <div className="relative z-10 w-full max-w-7xl px-8">
          <div className="h-80 lg:h-96">
            <TextPressure
              text="Portfolio"
              textColor="#ffffff"
              minFontSize={60}
              weight={true
              width={true}
              italic={true}
              alpha={false}
              stroke={false}
            />
          </div>
        </div>

        {/* Περιγραφή κάτω από τον τίτλο */}
        <div className="relative z-10 text-center px-8 max-w-4xl mt-8">
          <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
            Ένα showcase επιλεγμένων digital έργων <br className="hidden md:block" />
            όπου το design, η τεχνολογία και η <br className="hidden md:block" />
            τυπογραφική αισθητική συναντιούνται.
          </p>
          <p className="text-sm lg:text-base text-white/60 mt-6">
            Projects χτισμένα με Next.js, WordPress, WooCommerce και custom animations – όλα με έναν στόχο: να ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 lg:py-32 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {projects.map((project) => {
            const mainImage = project.acf?.main_image?.url || project.acf?.main_image || '';
            const technologies: string[] = project.acf?.technologies || [];

            return (
              <article
                key={project.id}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={project.title.rendered}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <span className="text-zinc-600 text-xl">No image</span>
                    </div>
                  )}

                  {/* Overlay + Technologies on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end p-8">
                    <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-100">
                      {technologies.map((tech, idx) => (
                        <div
                          key={idx}
                          className="text-4xl lg:text-5xl font-black text-white opacity-0 group-hover:opacity-100 translate-x-[-100px] group-hover:translate-x-0 transition-all duration-500 ease-out"
                          style={{ transitionDelay: `${idx * 0.15 + 0.2}s` }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title κάτω από την εικόνα */}
                <div className="p-8 lg:p-10">
                  <h3
                    className="text-2xl lg:text-3xl font-bold text-white"
                    dangerouslySetInnerHTML={{ __html: project.title.rendered }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}