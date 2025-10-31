// app/admin-unlock/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const secret = process.env.MAINTENANCE_SECRET;

  if (!secret || key !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set("webkey_admin", "1", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
