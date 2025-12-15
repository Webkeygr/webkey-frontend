// app/portfolio/types.ts

export type PortfolioProject = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: Record<string, any>;
};

export type PortfolioDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: Record<string, any>;
};
