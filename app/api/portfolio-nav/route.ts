import { NextResponse } from "next/server";

type WPItem = {
  id: number;
  slug?: string;
  status?: string;
  [key: string]: any;
};

function normSlug(v: string) {
  return decodeURIComponent(String(v || ""))
    .trim()
    .toLowerCase();
}

export async function GET(req: Request) {
  const debugParam = new URL(req.url).searchParams.get("debug");
  const wantsDebug = debugParam === "1";

  const debug: any = wantsDebug
    ? {
        input: {},
        totals: {},
        match: {},
        sample: {},
        errors: [],
      }
    : null;

  try {
    const { searchParams } = new URL(req.url);

    const slugRaw = (searchParams.get("slug") || "").trim();
    const slug = normSlug(slugRaw);

    const idParam = (searchParams.get("id") || "").trim();
    const id = idParam ? Number(idParam) : 0;

    const base =
      process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";

    if (wantsDebug) debug.input = { slugRaw, slug, id };

    // 1) Πρώτη σελίδα για headers
    const firstRes = await fetch(
      `${base}/wp-json/wp/v2/portfolio?per_page=100&page=1&orderby=menu_order&order=asc&acf_format=standard`,
      { cache: "no-store" }
    );

    if (wantsDebug) {
      debug.totals.firstResOk = firstRes.ok;
      debug.totals.firstResStatus = firstRes.status;
    }

    if (!firstRes.ok) {
      return NextResponse.json(
        wantsDebug ? { prev: null, next: null, debug } : { prev: null, next: null },
        { status: 200 }
      );
    }

    const totalPages = Number(firstRes.headers.get("X-WP-TotalPages") || 1);
    const total = Number(firstRes.headers.get("X-WP-Total") || 0);

    const all: WPItem[] = [];
    const firstPage = (await firstRes.json()) as WPItem[];
    if (Array.isArray(firstPage)) all.push(...firstPage);

    // 2) Φέρνουμε όλες τις σελίδες
    for (let page = 2; page <= totalPages; page++) {
      const res = await fetch(
        `${base}/wp-json/wp/v2/portfolio?per_page=100&page=${page}&orderby=menu_order&order=asc&acf_format=standard`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        if (wantsDebug) debug.errors.push(`page ${page} status ${res.status}`);
        continue;
      }
      const data = (await res.json()) as WPItem[];
      if (Array.isArray(data) && data.length) all.push(...data);
    }

    if (wantsDebug) {
      debug.totals.totalPages = totalPages;
      debug.totals.totalHeader = total;
      debug.totals.loaded = all.length;
      debug.sample.first10 = all.slice(0, 10).map((p) => ({
        id: p.id,
        slug: p.slug,
        status: p.status,
      }));
    }

    if (!all.length) {
      return NextResponse.json(
        wantsDebug ? { prev: null, next: null, debug } : { prev: null, next: null },
        { status: 200 }
      );
    }

    // 3) Προσπάθεια match
    let currentIndex = -1;

    if (id) {
      currentIndex = all.findIndex((p) => Number(p?.id) === id);
    }
    if (currentIndex === -1 && slug) {
      currentIndex = all.findIndex((p) => normSlug(p?.slug || "") === slug);
    }

    if (wantsDebug) {
      debug.match.containsId = id ? all.some((p) => Number(p?.id) === id) : null;
      debug.match.containsSlug = slug ? all.some((p) => normSlug(p?.slug || "") === slug) : null;
      debug.match.currentIndex = currentIndex;
    }

    // 4) Fallback: lookup με slug για να βρούμε το πραγματικό REST id
    if (currentIndex === -1 && slug) {
      const lookupRes = await fetch(
        `${base}/wp-json/wp/v2/portfolio?per_page=1&slug=${encodeURIComponent(slug)}&acf_format=standard`,
        { cache: "no-store" }
      );

      if (wantsDebug) debug.match.slugLookupStatus = lookupRes.status;

      if (lookupRes.ok) {
        const lookup = (await lookupRes.json()) as WPItem[];
        const found = Array.isArray(lookup) ? lookup[0] : null;

        if (wantsDebug) {
          debug.sample.slugLookup = Array.isArray(lookup)
            ? lookup.map((p) => ({ id: p.id, slug: p.slug, status: p.status }))
            : [];
        }

        if (found?.id) {
          currentIndex = all.findIndex((p) => Number(p?.id) === Number(found.id));
          if (wantsDebug) debug.match.currentIndexAfterLookup = currentIndex;
        }
      }
    }

    if (currentIndex === -1) {
      return NextResponse.json(
        wantsDebug ? { prev: null, next: null, debug } : { prev: null, next: null },
        { status: 200 }
      );
    }

    const prev = all[(currentIndex - 1 + all.length) % all.length] ?? null;
    const next = all[(currentIndex + 1) % all.length] ?? null;

    return NextResponse.json(
      wantsDebug ? { prev, next, debug } : { prev, next },
      { status: 200 }
    );
  } catch (e: any) {
    if (wantsDebug) debug.errors.push(String(e?.message || e));
    return NextResponse.json(
      wantsDebug ? { prev: null, next: null, debug } : { prev: null, next: null },
      { status: 200 }
    );
  }
}
