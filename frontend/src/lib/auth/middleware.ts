import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/"];

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // For protected dashboard routes, check for token in cookie or let client-side handle
  // The actual auth check is done client-side via AuthContext
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
