import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = (searchParams.get("slug") || "").trim();
    const idParam = (searchParams.get("id") || "").trim();
    const id = idParam ? Number(idParam) : 0;

    const base =
      process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";

    // Φέρνουμε όλα (με paging)
    const firstRes = await fetch(
      `${base}/wp-json/wp/v2/portfolio?per_page=100&page=1&orderby=menu_order&order=asc&acf_format=standard`,
      { cache: "no-store" }
    );

    if (!firstRes.ok) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const totalPagesHeader = firstRes.headers.get("X-WP-TotalPages");
    const totalPages = totalPagesHeader ? Number(totalPagesHeader) : 1;

    const all: any[] = [];
    const firstPage = await firstRes.json();
    if (Array.isArray(firstPage)) all.push(...firstPage);

    for (let page = 2; page <= totalPages; page++) {
      const res = await fetch(
        `${base}/wp-json/wp/v2/portfolio?per_page=100&page=${page}&orderby=menu_order&order=asc&acf_format=standard`,
        { cache: "no-store" }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data)) all.push(...data);
    }

    if (!all.length) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    let currentIndex = -1;
    if (id) currentIndex = all.findIndex((p) => Number(p?.id) === id);
    if (currentIndex === -1 && slug)
      currentIndex = all.findIndex((p) => String(p?.slug || "") === slug);

    if (currentIndex === -1) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const prev = all[(currentIndex - 1 + all.length) % all.length] ?? null;
    const next = all[(currentIndex + 1) % all.length] ?? null;

    return NextResponse.json({ prev, next }, { status: 200 });
  } catch {
    return NextResponse.json({ prev: null, next: null }, { status: 200 });
  }
}
