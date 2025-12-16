import { NextResponse } from "next/server";

type WPItem = {
  id: number;
  slug?: string;
  status?: string;
  [key: string]: any;
};

export async function GET(req: Request) {
  const debug: any = {
    input: {},
    totals: {},
    match: {},
    sample: {},
    errors: [],
  };

  try {
    const { searchParams } = new URL(req.url);

    const slug = (searchParams.get("slug") || "").trim();
    const idParam = (searchParams.get("id") || "").trim();
    const id = idParam ? Number(idParam) : 0;

    debug.input = { slug, id };

    const base =
      process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";

    // Πρώτη σελίδα για headers
    const firstRes = await fetch(
      `${base}/wp-json/wp/v2/portfolio?per_page=100&page=1&orderby=menu_order&order=asc&acf_format=standard`,
      { cache: "no-store" }
    );

    debug.totals.firstResOk = firstRes.ok;
    debug.totals.firstResStatus = firstRes.status;

    if (!firstRes.ok) {
      return NextResponse.json(
        { prev: null, next: null, debug },
        { status: 200 }
      );
    }

    const totalPagesHeader = firstRes.headers.get("X-WP-TotalPages");
    const totalHeader = firstRes.headers.get("X-WP-Total");

    const totalPages = totalPagesHeader ? Number(totalPagesHeader) : 1;
    const total = totalHeader ? Number(totalHeader) : undefined;

    debug.totals.totalPages = totalPages;
    debug.totals.total = total;

    const firstPage = (await firstRes.json()) as WPItem[];
    const all: WPItem[] = Array.isArray(firstPage) ? [...firstPage] : [];

    // fetch υπόλοιπες σελίδες
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const res = await fetch(
          `${base}/wp-json/wp/v2/portfolio?per_page=100&page=${page}&orderby=menu_order&order=asc&acf_format=standard`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          debug.errors.push(`page ${page} status ${res.status}`);
          continue;
        }
        const data = (await res.json()) as WPItem[];
        if (Array.isArray(data) && data.length) all.push(...data);
      }
    }

    debug.totals.loaded = all.length;
    debug.sample.first10 = all.slice(0, 10).map((p) => ({ id: p.id, slug: p.slug, status: p.status }));

    // Matches
    debug.match.containsId = id ? all.some((p) => Number(p?.id) === id) : null;
    debug.match.containsSlug = slug ? all.some((p) => String(p?.slug || "").trim() === slug) : null;

    // Current index
    let currentIndex = -1;
    if (id) currentIndex = all.findIndex((p) => Number(p?.id) === id);
    if (currentIndex === -1 && slug)
      currentIndex = all.findIndex((p) => String(p?.slug || "").trim() === slug);

    debug.match.currentIndex = currentIndex;

    // Direct lookup by slug (για να δούμε αν υπάρχει αυτό το slug στο WP)
    if (slug) {
      const lookupRes = await fetch(
        `${base}/wp-json/wp/v2/portfolio?per_page=5&slug=${encodeURIComponent(slug)}&acf_format=standard`,
        { cache: "no-store" }
      );
      debug.match.slugLookupStatus = lookupRes.status;

      if (lookupRes.ok) {
        const lookup = (await lookupRes.json()) as WPItem[];
        debug.match.slugLookupCount = Array.isArray(lookup) ? lookup.length : 0;
        debug.sample.slugLookup = Array.isArray(lookup)
          ? lookup.map((p) => ({ id: p.id, slug: p.slug, status: p.status }))
          : [];
      }
    }

    if (currentIndex === -1) {
      return NextResponse.json(
        { prev: null, next: null, debug },
        { status: 200 }
      );
    }

    const prev = all[(currentIndex - 1 + all.length) % all.length] ?? null;
    const next = all[(currentIndex + 1) % all.length] ?? null;

    return NextResponse.json({ prev, next, debug }, { status: 200 });
  } catch (e: any) {
    debug.errors.push(String(e?.message || e));
    return NextResponse.json({ prev: null, next: null, debug }, { status: 200 });
  }
}
