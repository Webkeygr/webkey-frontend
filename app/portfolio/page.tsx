'use client'; // ΑΥΤΗ Η ΓΡΑΜΜΗ ΕΙΝΑΙ ΥΠΟΧΡΕΩΤΙΚΗ

import TextPressure from '@/app/components/TextPressure';
import { PortfolioCard } from '@/app/components/PortfolioCard';
import BlobVideo from '@/app/components/BlobVideo';
import { useEffect } from 'react';

export default function PortfolioPage() {
  // Απενεργοποιούμε το dark-mode detection μόνο σε αυτή τη σελίδα
  useEffect(() => {
    document.body.classList.add('portfolio-no-dark');
    return () => document.body.classList.remove('portfolio-no-dark');
  }, []);

  const projects = ...

  return (
    <>
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[size:400%_400%] bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-cyan-600/30 animate-color-shift" />
        <div className="absolute inset-0 bg-[size:400%_400%] bg-gradient-to-tl from-yellow-400/20 via-transparent to-purple-800/30 animate-color-shift-reverse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#ff00ff20_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#00ffff20_0%,transparent_50%),radial-gradient(circle_at_40%_40%,#ffff0020_0%,transparent_50%)] animate-float" />
      </div>

      {/* HERO – FULL WIDTH, ZERO PADDING */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-20 text-white">
        {/* ΤΙΤΛΟΣ */}
        <div className="w-full max-w-7xl mx-auto text-center mt-10 mb-16">
          <TextPressure text="Portfolio" textColor="#ffffff" minFontSize={90} weight width italic alpha={false} stroke={false} scale={false} flex />
        </div>

        {/* VIDEO */}
        <div className="w-full max-w-5xl">
          <BlobVideo videoSrc="/videos/site_video_2.mp4" />
        </div>

        {/* ΚΕΙΜΕΝΟ */}
        <div className="text-center max-w-4xl mt-20">
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent leading-tight">
            Ένα showcase επιλεγμένων digital έργων
          </h2>
          <p className="mt-8 text-xl md:text-2xl opacity-90 leading-relaxed">
            όπου το design, η τεχνολογία και η τυπογραφία συναντιούνται.<br className="hidden md:block" />
            Projects χτισμένα με Next.js, WordPress, WooCommerce και custom animations — όλα με έναν στόχο: να ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* PROJECTS – ZERO PADDING */}
      <section className="relative py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {projects.map((project: any) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}