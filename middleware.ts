// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const rateLimitCache = new Map<
  string,
  { count: number; lastRequest: number }
>();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 100;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const method = request.method;

  // 1. Explicitly allow POST to auth endpoints
  if (pathname.startsWith("/api/auth") && method === "POST") {
    return NextResponse.next();
  }

  // 2. Rate limiting adjustments
  if (pathname.startsWith("/api/shipments/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const now = Date.now();
    const rateData = rateLimitCache.get(ip) || { count: 0, lastRequest: now };

    if (now - rateData.lastRequest > RATE_LIMIT_WINDOW) {
      rateData.count = 0;
      rateData.lastRequest = now;
    }

    if (rateData.count++ >= RATE_LIMIT_MAX) {
      return new NextResponse("Too many requests", { status: 429 });
    }
    rateLimitCache.set(ip, rateData);
  }

  // 3. Auth page redirect logic
  if (pathname.startsWith("/auth") && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // 4. Protected routes handling
  const protectedRoutes = [
    "/account-setting",
    "/create-shipment",
    "/shipping-history",
    "/api/create-shipment",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      return NextResponse.next();
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect specific paths
    "/account-setting/:path*",
    "/shipping-history/:path*",
    "/create-shipment/:path*",
    "/api/create-shipment/:path*",
    "/api/shipments/:path*",
  ],
};
