import { NextResponse } from "next/server";

type WPItem = {
  id: number;
  slug?: string;
  [key: string]: any;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const slug = (searchParams.get("slug") || "").trim();
    const idParam = (searchParams.get("id") || "").trim();
    const id = idParam ? Number(idParam) : 0;

    const base =
      process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";

    // 1) Πρώτα παίρνουμε total pages (για να κάνουμε fetch όλη τη λίστα, όχι μόνο τα πρώτα 100)
    const firstRes = await fetch(
      `${base}/wp-json/wp/v2/portfolio?per_page=100&page=1&orderby=menu_order&order=asc&acf_format=standard`,
      { cache: "no-store" }
    );

    if (!firstRes.ok) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const totalPagesHeader = firstRes.headers.get("X-WP-TotalPages");
    const totalPages = totalPagesHeader ? Number(totalPagesHeader) : 1;

    const firstPage = (await firstRes.json()) as WPItem[];
    const all: WPItem[] = Array.isArray(firstPage) ? [...firstPage] : [];

    // 2) Fetch όλες τις υπόλοιπες σελίδες
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const res = await fetch(
          `${base}/wp-json/wp/v2/portfolio?per_page=100&page=${page}&orderby=menu_order&order=asc&acf_format=standard`,
          { cache: "no-store" }
        );
        if (!res.ok) continue;

        const data = (await res.json()) as WPItem[];
        if (Array.isArray(data) && data.length) all.push(...data);
      }
    }

    if (!all.length) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    // 3) Βρίσκουμε current item με id ή slug (fallback)
    let currentIndex = -1;

    if (id) {
      currentIndex = all.findIndex((p) => Number(p?.id) === id);
    }

    if (currentIndex === -1 && slug) {
      currentIndex = all.findIndex(
        (p) => String(p?.slug || "").trim() === slug
      );
    }

    // 4) Αν ΠΑΛΙ δεν βρέθηκε, κάνουμε "direct lookup" με slug στο WP (σίγουρο)
    if (currentIndex === -1 && slug) {
      const lookupRes = await fetch(
        `${base}/wp-json/wp/v2/portfolio?per_page=1&slug=${encodeURIComponent(
          slug
        )}&acf_format=standard`,
        { cache: "no-store" }
      );

      if (lookupRes.ok) {
        const lookup = (await lookupRes.json()) as WPItem[];
        const found = Array.isArray(lookup) ? lookup[0] : null;
        if (found?.id) {
          currentIndex = all.findIndex((p) => Number(p?.id) === Number(found.id));
        }
      }
    }

    if (currentIndex === -1) {
      // Δεν το βρίσκουμε -> δεν έχουμε prev/next
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const prev = all[(currentIndex - 1 + all.length) % all.length] ?? null;
    const next = all[(currentIndex + 1) % all.length] ?? null;

    return NextResponse.json({ prev, next }, { status: 200 });
  } catch {
    return NextResponse.json({ prev: null, next: null }, { status: 200 });
  }
}
