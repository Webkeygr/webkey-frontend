import TextPressure from '@/app/components/TextPressure';
import { PortfolioCard } from '@/app/components/PortfolioCard';
import BlobVideo from '@/app/components/BlobVideo'; // θα τον φτιάξουμε σε 5 δευτερόλεπτα

// Νέο Client Component για το video + animations (ξεχωριστό αρχείο)
export default function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: { rendered: "Luxury E-shop με Next.js 14 & WooCommerce" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=1000&fit=crop" },
        technologies: ["Next.js", "WooCommerce", "Tailwind", "GSAP"]
      }
    },
    {
      id: 2,
      title: { rendered: "Corporate Website με Custom 3D Animations" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=1000&fit=crop" },
        technologies: ["React", "Three.js", "Framer Motion"]
      }
    },
    {
      id: 3,
      title: { rendered: "Brand Identity & Headless WordPress" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1558655146-9f40138ed1cb?w=1400&h=1000&fit=crop" },
        technologies: ["WordPress Headless", "Next.js", "ACF"]
      }
    },
    {
      id: 4,
      title: { rendered: "Web App με Real-time Data" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&h=1000&fit=crop" },
        technologies: ["Next.js API", "Supabase", "Shadcn/ui"]
      }
    }
  ];

  return (
    <>
      {/* STICKY ANIMATED BACKGROUND – χωρίς styled-jsx */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-cyan-600/30" />
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400/20 via-transparent to-purple-800/30 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#ff00ff20_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#00ffff20_0%,transparent_50%),radial-gradient(circle_at_40%_40%,#ffff0020_0%,transparent_50%)] animate-float" />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-white px-6">
        {/* Blob Video – Client Component */}
        <BlobVideo videoSrc="/public/videos/site_video_2.mp4" />

        {/* Title */}
        <div className="h-80 w-full max-w-7xl flex items-center justify-center pointer-events-none select-none mt-12">
          <TextPressure
            text="Portfolio"
            textColor="#ffffff"
            minFontSize={80}
            weight={true}
            width={true}
            italic={true}
            alpha={false}
            stroke={false}
            scale={false}
            flex={true}
          />
        </div>

        {/* Έντονο κείμενο */}
        <div className="text-center max-w-5xl -mt-8">
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent leading-tight">
            Ένα showcase επιλεγμένων digital έργων
          </h2>
          <p className="mt-6 text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            όπου το design, η τεχνολογία και η τυπογραφία συναντιούνται.<br />
            Projects χτισμένα με Next.js, WordPress, WooCommerce και custom animations – όλα με έναν στόχο: να ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {projects.map((project: any) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}