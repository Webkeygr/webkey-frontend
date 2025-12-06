"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TextPressure from "@/app/components/TextPressure";

type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  mainImageUrl: string;
  technologies: string[];
};

// προσωρινό mock – αργότερα θα έρθει από WordPress
const mockItems: PortfolioItem[] = [
  {
    id: "1",
    slug: "project-1",
    title: "Project One",
    mainImageUrl: "/images/portfolio/project-1.jpg",
    technologies: ["Next.js", "WordPress", "WooCommerce", "GSAP"],
  },
  {
    id: "2",
    slug: "project-2",
    title: "Project Two",
    mainImageUrl: "/images/portfolio/project-2.jpg",
    technologies: ["React", "Headless WP", "Framer Motion"],
  },
];

const overlayVariants = {
  rest: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.25,
      when: "beforeChildren",
    },
  },
};

const techListVariants = {
  rest: {},
  hover: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const techItemVariants = {
  rest: { x: -24, opacity: 0 },
  hover: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* Title bar */}
      <div className="border-b border-zinc-100 px-6 py-3 text-center text-lg font-medium tracking-[0.35em] uppercase text-zinc-900">
        {item.title}
      </div>

      {/* Main image + hover overlay */}
      <div className="relative aspect-[4/3]">
        <Image
          src={item.mainImageUrl}
          alt={item.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />

        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 flex items-center justify-center bg-neutral-900/55"
        >
          <motion.ul
            variants={techListVariants}
            className="space-y-3 text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl"
          >
            {item.technologies.map((tech) => (
              <motion.li key={tech} variants={techItemVariants}>
                {tech}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function PortfolioPage() {
  const items = mockItems; // εδώ αργότερα θα μπει το fetch από WordPress

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* HERO 100vh */}
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white hero-iridescence">
        {/* Iridescence background – βάλε εδώ ό,τι χρησιμοποιείς και στο Hero */}
        {/* π.χ. <IridescenceBackground className="absolute inset-0 -z-10" /> */}
        <div className="absolute inset-0 -z-10 opacity-80" />

        <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-12 px-4">
          {/* VIDEO badge + Portfolio word */}
          <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:items-end md:justify-between">
            {/* VIDEO bubble */}
            <div className="relative h-36 w-36 md:h-44 md:w-44">
              <div className="absolute inset-0 -rotate-12 rounded-full bg-white" />
              <div className="relative flex h-full w-full items-center justify-center -rotate-12">
                <span className="text-2xl font-extrabold tracking-[0.25em] text-black">
                  VIDEO
                </span>
              </div>
            </div>

            {/* TextPressure "Portfolio" */}
            <div className="relative w-full max-w-xl" style={{ height: 120 }}>
              <TextPressure
                text="Portfolio"
                flex={false}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                minFontSize={40}
                className="justify-center"
              />
            </div>
          </div>

          {/* Intro κείμενο */}
          <p className="max-w-xl text-center text-sm leading-relaxed text-zinc-200 md:text-base">
            Ένα showcase επιλεγμένων digital έργων, όπου το design, η τεχνολογία
            και η στρατηγική συναντιούνται. Projects χτισμένα με Next.js,
            WordPress, WooCommerce και custom animations – όλα με έναν στόχο: να
            ξεχωρίζουν.
          </p>
        </div>
      </section>

      {/* GRID με τα κουτιά (προς το παρόν mock data) */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
