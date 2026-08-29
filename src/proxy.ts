import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/events",
    "/api/auth",
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Allow public paths and static assets
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for auth token in session cookie
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Redirect to login if not authenticated
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/portal"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes (NextAuth handles its own auth)
    "/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
