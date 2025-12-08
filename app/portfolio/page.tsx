import TextPressure from '@/app/components/TextPressure';
import { PortfolioCard } from '@/app/components/PortfolioCard';

// Ανέβασε το βίντεό σου στο /public/videos/portfolio-showreel.mp4
// ή άλλαξε το path στο src παρακάτω
const SHOWREEL_VIDEO = "/videos/portfolio-showreel.mp4";

export default function PortfolioPage() {
  // Dummy data (θα αντικατασταθούν αργότερα με το WordPress)
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
        technologies: ["React", "Three.js","Framer Motion"]
      }
    },
    {
      id: 3,
      title: { rendered: "Brand Identity & Headless WordPress" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1558655146-9f40138ed1cb?w=1400&h=1000&fit=crop" },
        technologies: ["WordPress Headless", "Next.js", "ACF", "GraphQL"]
      }
    },
    {
      id: 4,
      title: { rendered: "Web App με Real-time Data" },
      acf: {
        main_image: { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&h=1000&fit=crop" },
        technologies: ["Next.js API Routes", "Supabase", "Shadcn/ui"]
      }
    }
  ];

  return (
    <>
      {/* FULL-PAGE STICKY & ANIMATED BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-cyan-600/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-purple-800/30 animate-pulse" />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(circle at 20% 80%, #ff00ff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00ffff 0%, transparent 50%), radial-gradient(circle at 40% 40%, #ffff00 0%, transparent 50%)",
            animation: "float 20s ease-in-out infinite"
          }}
        />
      </div>

      {/* HERO SECTION – 100vh */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-white px-6">
        {/* Blob Video Container – κεντραρισμένο, περίεργο σχήμα */}
        <div className="relative my-12 max-w-4xl w-full">
          <div className="relative aspect-video overflow-hidden" 
               style={{
                 clipPath: "polygon(5% 0%, 95% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)",
                 transform: "rotate(-1deg)"
               }}>
            <video
              src={SHOWREEL_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-110"
            />
          </div>
        </div>

        {/* Portfolio Title με το effect */}
        <div className="h-80 w-full max-w-7xl flex items-center justify-center pointer-events-none select-none">
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

        {/* Κείμενο – πιο πάνω και πιο έντονο */}
        <div className="text-center max-w-4xl mt-8">
          <p className="text-2xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Ένα showcase επιλεγμένων digital έργων
          </p>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            όπου το design, η τεχνολογία και η τυπογραφία συναντιούνται.<br />
            Projects χτισμένα με Next.js, WordPress, WooCommerce και custom animations – όλα με έναν στόχο: να ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {projects.map((project: any) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, -10px) rotate(-1deg); }
        }
      `}</style>
    </>
  );
}