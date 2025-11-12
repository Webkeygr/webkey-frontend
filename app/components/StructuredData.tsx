"use client";
import Script from "next/script";

export default function StructuredData() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Webkey",
    url: "https://webkey.gr",
    logo: "https://webkey.gr/favicon.ico",
    sameAs: [
      // προσθέτεις social urls όταν θες
    ],
  };

  return (
    <Script
      id="ld-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
    />
  );
}
