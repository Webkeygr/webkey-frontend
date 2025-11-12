import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://webkey.gr";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/", "/drafts/", "/tmp/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
