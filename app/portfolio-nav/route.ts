import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("slug") || "";
    const idParam = searchParams.get("id") || "";
    const id = idParam ? Number(idParam) : 0;

    const base =
      process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.webkey.gr";

    const res = await fetch(
      `${base}/wp-json/wp/v2/portfolio?per_page=100&orderby=menu_order&order=asc&acf_format=standard`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const currentIndex = id
      ? list.findIndex((p: any) => Number(p?.id) === id)
      : list.findIndex((p: any) => String(p?.slug || "") === slug);

    if (currentIndex === -1) {
      return NextResponse.json({ prev: null, next: null }, { status: 200 });
    }

    const prev = list[(currentIndex - 1 + list.length) % list.length] ?? null;
    const next = list[(currentIndex + 1) % list.length] ?? null;

    return NextResponse.json({ prev, next }, { status: 200 });
  } catch {
    return NextResponse.json({ prev: null, next: null }, { status: 200 });
  }
}
