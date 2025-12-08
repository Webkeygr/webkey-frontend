'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function PortfolioCard({ project }: { project: any }) {
  const [isHovered, setIsHovered] = useState(false);

  // ΣΩΣΤΗ γραμμή – δεν υπάρχει πια "const main image"
  const mainImage =
    project.acf?.main_image?.url ||
    project._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    '/placeholder.jpg';

  const technologies: string[] = project.acf?.technologies || [];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-neutral-900 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-[4/3] relative">
        <Image
          src={mainImage}
          alt={project.title.rendered}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Overlay + Technologies */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 flex items-end p-10 transition-opacity duration-500',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="space-y-4">
          {technologies.map((tech: string, i: number) => (
            <div
              key={i}
              className="text-4xl md:text-6xl font-black text-white translate-x-[-120%] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
              style={{ transitionDelay: `${i * 0.15 + 0.1}s` }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
        <h3
          className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl"
          dangerouslySetInnerHTML={{ __html: project.title.rendered }}
        />
      </div>
    </div>
  );
}