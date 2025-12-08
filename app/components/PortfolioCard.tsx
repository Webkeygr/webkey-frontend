'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // αν έχεις shadcn utils

export function PortfolioCard({ project }: { project: any }) {
  const [isHovered, setIsHovered] = useState(false);

  const main image
  const mainImage = project.acf?.main_image?.url ||
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
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={mainImage}
          alt={project.title.rendered}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Overlay + Technologies */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-500 flex items-end p-8",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="space-y-3 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 delay-100">
          {technologies.map((tech: string, i: number) => (
            <div
              key={i}
              className="text-3xl md:text-5xl font-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                animation: `slideIn 0.6s forwards ${i * 0.1 + 0.2}s ease-out`,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
        <h3
          className="text-2xl font-bold text-white"
          dangerouslySetInnerHTML={{ __html: project.title.rendered }}
        />
      </div>
    </div>
  );
}