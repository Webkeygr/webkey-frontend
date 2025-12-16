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

async function fetchPage(
  base: string,
  page: number,
  orderby: string,
  order: string
) {
  const url =
    `${base}/wp-json/wp/v2/portfolio` +
    `?per_page=100&page=${page}` +
    `&orderby=${encodeURIComponent(orderby)}` +
    `&order=${encodeURIComponent(order)}` +
    `&acf_format=standard`;

  const res = await fetch(url, { cache: "no-store" });
  return { res, url };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wantsDebug = searchParams.get("debug") === "1";

  const slugRaw = (searchParams.get("slug") || "").trim();
  const slug = normSlug(slugRaw);

  const idParam = (searchParams.get("id") || "").trim();
  const id = idParam ? Number(idParam) : 0;

  const base =
    process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";

  const debug: any = wantsDebug
    ? {
        input: { slugRaw, slug, id },
        attempts: [],
        totals: {},
        match: {},
        sample: {},
        errors: [],
      }
    : null;

  // Θα δοκιμάσουμε 2 “σχέδια” ordering
  const strategies = [
    { orderby: "menu_order", order: "asc" },
    { orderby: "date", order: "desc" },
  ];

  try {
    let all: WPItem[] = [];
    let totalPages = 1;

    // --- Try strategies until one works ---
    for (const s of strategies) {
      all = [];
      totalPages = 1;

      const first = await fetchPage(base, 1, s.orderby, s.order);
      if (wantsDebug) debug.attempts.push({ ...s, page1Url: first.url, status: first.res.status });

      // Αν αποτύχει (π.χ. 400), πάμε στο επόμενο strategy
      if (!first.res.ok) continue;

      totalPages = Number(first.res.headers.get("X-WP-TotalPages") || 1);
      const firstPage = (await first.res.json()) as WPItem[];
      if (Array.isArray(firstPage)) all.push(...firstPage);

      for (let page = 2; page <= totalPages; page++) {
        const r = await fetchPage(base, page, s.orderby, s.order);
        if (!r.res.ok) {
          if (wantsDebug) debug.errors.push(`page ${page} ${s.orderby}/${s.order} status ${r.res.status}`);
          continue;
        }
        const data = (await r.res.json()) as WPItem[];
        if (Array.isArray(data) && data.length) all.push(...data);
      }

      // Αν καταφέραμε να φορτώσουμε κάτι, σταματάμε εδώ
      if (all.length) {
        if (wantsDebug) debug.totals = { strategyUsed: s, totalPages, loaded: all.length };
        break;
      }
    }

    if (!all.length) {
      return NextResponse.json(
        wantsDebug ? { prev: null, next: null, debug } : { prev: null, next: null },
        { status: 200 }
      );
    }

    if (wantsDebug) {
      debug.sample.first10 = all.slice(0, 10).map((p) => ({ id: p.id, slug: p.slug, status: p.status }));
      debug.match.containsId = id ? all.some((p) => Number(p?.id) === id) : null;
      debug.match.containsSlug = slug ? all.some((p) => normSlug(p?.slug || "") === slug) : null;
    }

    // βρίσκουμε current
    let currentIndex = -1;
    if (id) currentIndex = all.findIndex((p) => Number(p?.id) === id);
    if (currentIndex === -1 && slug) currentIndex = all.findIndex((p) => normSlug(p?.slug || "") === slug);

    if (wantsDebug) debug.match.currentIndex = currentIndex;

    // fallback lookup με slug (μόνο αν έχουμε slug)
    if (currentIndex === -1 && slug) {
      const lookupUrl =
        `${base}/wp-json/wp/v2/portfolio?per_page=1&slug=${encodeURIComponent(slug)}&acf_format=standard`;
      const lookupRes = await fetch(lookupUrl, { cache: "no-store" });

      if (wantsDebug) debug.match.slugLookup = { url: lookupUrl, status: lookupRes.status };

      if (lookupRes.ok) {
        const lookup = (await lookupRes.json()) as WPItem[];
        const found = Array.isArray(lookup) ? lookup[0] : null;
        if (wantsDebug) debug.match.slugLookupResult = Array.isArray(lookup) ? lookup.map(p => ({ id: p.id, slug: p.slug })) : [];

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
