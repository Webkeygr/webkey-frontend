// app/api/portfolio-nav/route.ts
import { NextResponse } from "next/server";

type WPItem = {
  id: number;
  slug: string;
  status?: string;
  title?: { rendered?: string };
  acf?: any;
};

const CMS_BASE =
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://cms.webkey.gr";

async function fetchPage(url: string) {
  const res = await fetch(url, { next: { revalidate: 60 } });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { res, json, raw: text };
}

async function loadAllPortfolio(orderby: string, order: "asc" | "desc") {
  const perPage = 100;

  const page1Url = `${CMS_BASE}/wp-json/wp/v2/portfolio?per_page=${perPage}&page=1&orderby=${orderby}&order=${order}&acf_format=standard`;
  const first = await fetchPage(page1Url);

  return { first, page1Url, perPage };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slugRaw = searchParams.get("slug") || "";
  const slug = slugRaw.trim();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;

  const debug: any = {
    input: { slugRaw, slug, id: Number.isFinite(id) ? id : null },
    attempts: [],
    totals: {},
    match: {},
    sample: {},
    errors: [],
  };

  if (!slug && !Number.isFinite(id)) {
    return NextResponse.json(
      {
        prev: null,
        next: null,
        debug: {
          ...debug,
          errors: ["Missing slug or id"],
        },
      },
      { status: 400 }
    );
  }

  // 1) προσπαθούμε menu_order (αν το CPT δεν το υποστηρίζει θα φάμε 400)
  const attempt1 = await loadAllPortfolio("menu_order", "asc");
  debug.attempts.push({
    orderby: "menu_order",
    order: "asc",
    page1Url: attempt1.page1Url,
    status: attempt1.first.res.status,
  });

  let strategyUsed: { orderby: string; order: "asc" | "desc" } = {
  orderby: "menu_order",
  order: "asc",
};

  let list: WPItem[] = [];
  let totalPages = 1;

  if (attempt1.first.res.ok && Array.isArray(attempt1.first.json)) {
    list = attempt1.first.json as WPItem[];
    const tp = attempt1.first.res.headers.get("X-WP-TotalPages");
    totalPages = tp ? Number(tp) : 1;
  } else {
    // 2) fallback σε date desc
    const attempt2 = await loadAllPortfolio("date", "desc");
    debug.attempts.push({
      orderby: "date",
      order: "desc",
      page1Url: attempt2.page1Url,
      status: attempt2.first.res.status,
    });

    strategyUsed = { orderby: "date", order: "desc" };

    if (!attempt2.first.res.ok || !Array.isArray(attempt2.first.json)) {
      debug.totals = {
        firstResOk: attempt2.first.res.ok,
        firstResStatus: attempt2.first.res.status,
      };
      return NextResponse.json(
        { prev: null, next: null, debug },
        { status: 400 }
      );
    }

    list = attempt2.first.json as WPItem[];
    const tp = attempt2.first.res.headers.get("X-WP-TotalPages");
    totalPages = tp ? Number(tp) : 1;

    // αν έχει πολλές σελίδες, τις φορτώνουμε όλες
    if (totalPages > 1) {
      const perPage = 100;
      for (let page = 2; page <= totalPages; page++) {
        const url = `${CMS_BASE}/wp-json/wp/v2/portfolio?per_page=${perPage}&page=${page}&orderby=${strategyUsed.orderby}&order=${strategyUsed.order}&acf_format=standard`;
        const pageRes = await fetchPage(url);
        if (pageRes.res.ok && Array.isArray(pageRes.json)) {
          list = list.concat(pageRes.json as WPItem[]);
        }
      }
    }
  }

  debug.totals = {
    strategyUsed,
    totalPages,
    loaded: list.length,
  };

  const currentIndex = list.findIndex((p) => {
    if (!p) return false;
    const idMatch = Number.isFinite(id) ? p.id === id : false;
    const slugMatch = slug ? p.slug === slug : false;
    return idMatch || slugMatch;
  });

  debug.match = {
    containsId: Number.isFinite(id)
      ? list.some((p) => p?.id === id)
      : false,
    containsSlug: slug ? list.some((p) => p?.slug === slug) : false,
    currentIndex,
  };

  debug.sample = {
    first10: list.slice(0, 10).map((p) => ({
      id: p.id,
      slug: p.slug,
      status: p.status,
    })),
  };

  if (currentIndex === -1) {
    return NextResponse.json({ prev: null, next: null, debug });
  }

  // ✅ ΟΧΙ circular:
  const prev = currentIndex > 0 ? list[currentIndex - 1] : null;
  const next = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

  return NextResponse.json({ prev, next, debug });
}
