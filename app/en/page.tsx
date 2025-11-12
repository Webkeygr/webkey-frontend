import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Digital Studio",
  description:
    "Webkey — Creative digital studio for websites, e-shops and standout experiences.",
  alternates: {
    canonical: "https://webkey.gr/en/",
    languages: {
      en: "https://webkey.gr/en/",
      el: "https://webkey.gr/",
    },
  },
  openGraph: {
    locale: "en_US",
  },
};

export default function PageEN() {
  return (
    <main>
      {/* Χρησιμοποίησε εδώ τα ίδια sections/components της αρχικής με αγγλικά κείμενα */}
      {/* <HomeHero locale="en" /> */}
      {/* <Services locale="en" /> */}
    </main>
  );
}
