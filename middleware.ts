// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // διάβασε από env (Vercel)
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // αν ΔΕΝ είμαστε σε maintenance → άσε τους όλους να περάσουν
  if (!isMaintenance) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = req.nextUrl;

  // 1) άφησε να περάσει το /admin-unlock
  if (pathname.startsWith("/admin-unlock")) {
    return NextResponse.next();
  }

  // 2) άφησε assets, _next, api κλπ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // 3) quick preview: ?preview=1 → δώσε cookie
  const preview = searchParams.get("preview");
  if (preview === "1") {
    const res = NextResponse.next();
    res.cookies.set("webkey_admin", "1", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  // 4) αν έχει ήδη cookie admin → άστον
  const adminCookie = req.cookies.get("webkey_admin");
  if (adminCookie?.value === "1") {
    return NextResponse.next();
  }

  // 5) αλλιώς → redirect σε /maintenance
  const maintenanceUrl = new URL("/maintenance", req.url);
  return NextResponse.redirect(maintenanceUrl);
}

// πες σε ποιες διαδρομές να τρέχει
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
