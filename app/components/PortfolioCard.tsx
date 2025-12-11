// app/components/PortfolioCard.tsx
"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

// Τοπικός τύπος – δεν εξαρτόμαστε πια από το page.tsx
type PortfolioProject = {
  id: number;
  slug?: string;
  title?: { rendered: string };
  acf?: {
    main_image?: {
      url?: string;
      sizes?: { [key: string]: string };
    };
    technologies?: string[];
    [key: string]: any;
  };
};

type PortfolioCardProps = {
  project: PortfolioProject;
};

const techItemVariants: Variants = {
  hidden: { x: -15, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.05 * i,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  }),
};

export function PortfolioCard({ project }: PortfolioCardProps) {
  const title = project.title?.rendered ?? "Untitled project";

  const mainImage =
    project.acf?.main_image?.sizes?.["large"] ??
    project.acf?.main_image?.sizes?.["medium_large"] ??
    project.acf?.main_image?.url ??
    "/images/placeholder-portfolio.jpg";

  const technologies = project.acf?.technologies ?? [];

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[32px] bg-black/80 text-white shadow-[0_40px_120px_rgba(0,0,0,0.7)] border border-white/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Εικόνα */}
      <div className="relative aspect-[1901/943] w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(min-width: 1024px) 560px, 100vw"
        />

        {/* Overlay στο hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

        {/* Technologies στο hover */}
        {technologies.length > 0 && (
          <motion.ul
            className="pointer-events-none absolute inset-x-6 bottom-6 flex flex-wrap gap-x-3 gap-y-1 text-sm md:text-[15px] font-medium tracking-[0.08em] uppercase"
            initial="hidden"
            whileHover="visible"
            whileTap="visible"
          >
            {technologies.map((tech, index) => (
              <motion.li
                key={tech + index}
                custom={index}
                variants={techItemVariants}
                className="rounded-full bg-white/12 px-4 py-1.5 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {tech}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Κάτω μέρος – τίτλος */}
      <div className="relative px-6 py-5 md:px-7 md:py-6 bg-gradient-to-t from-black/80 via-black/60 to-black/0">
        <h3 className="text-lg md:text-xl font-semibold leading-snug">
          {title}
        </h3>
      </div>
    </motion.article>
  );
}
