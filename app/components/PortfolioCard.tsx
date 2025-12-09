"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { PortfolioProject } from "@/app/portfolio/page";

type PortfolioCardProps = {
  project: PortfolioProject;
};

function getImageUrl(project: PortfolioProject): string | null {
  const field = (project.acf?.main_image ?? null) as any;
  if (!field) return null;

  // Αν το ACF είναι "Image URL"
  if (typeof field === "string") return field;

  // Αν είναι "Image Array" ή "Image Object"
  if (typeof field === "object") {
    if (typeof field.url === "string") return field.url;
    if (typeof field.source_url === "string") return field.source_url;
  }

  return null;
}

function getTechnologies(project: PortfolioProject): string[] {
  const raw = (project.acf?.technologies ?? null) as any;
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          return item.label ?? item.name ?? "";
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.25,
      when: "beforeChildren",
    },
  },
};

const techListVariants: Variants = {
  rest: {},
  hover: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const techItemVariants: Variants = {
  rest: { x: -24, opacity: 0 },
  hover: {
    x: 0,
    opacity: 1,
    transition: {
      stiffness: 260,
      damping: 20,
    },
  },
};

export function PortfolioCard({ project }: PortfolioCardProps) {
  const imageUrl = getImageUrl(project);
  const technologies = getTechnologies(project);
  const title = project.title?.rendered ?? "";

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-[32px] bg-black/90 text-white shadow-xl"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* Εικόνα */}
      <div className="relative aspect-[16/9] w-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title || "Portfolio project"}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}

        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
        )}

        {technologies.length > 0 && (
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 flex items-center justify-center bg-black/65"
          >
            <motion.ul
              variants={techListVariants}
              className="space-y-3 text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl"
            >
              {technologies.map((tech) => (
                <motion.li key={tech} variants={techItemVariants}>
                  {tech}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </div>

      {/* Τίτλος */}
      <div className="px-8 py-6 text-xl font-semibold tracking-tight">
        {title}
      </div>
    </motion.article>
  );
}
