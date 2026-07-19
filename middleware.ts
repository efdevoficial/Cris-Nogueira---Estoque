import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicPaths = ["/login", "/api/auth/login", "/api/setup"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    publicPaths.includes(path) ||
    path.startsWith("/_next") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("cris_estoque_session")?.value;
  const secret = process.env.SESSION_SECRET;

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"]
};
