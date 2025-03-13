// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// In-memory rate limit cache (Note: not ideal for multi-instance production)
const rateLimitCache = new Map<
  string,
  { count: number; lastRequest: number }
>();
const RATE_LIMIT_WINDOW = 60000; // 60 seconds
const RATE_LIMIT_MAX = 100; // Maximum allowed requests per window

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get("token")?.value;

  // Allow OPTIONS requests for CORS preflight if needed
  if (method === "OPTIONS") {
    return NextResponse.next();
  }

  // 1. Allow all requests to /api/auth (authentication endpoints)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Apply rate limiting for shipment endpoints
  if (pathname.startsWith("/api/shipments/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const now = Date.now();
    const rateData = rateLimitCache.get(ip) || { count: 0, lastRequest: now };

    // Reset the counter if the time window has passed
    if (now - rateData.lastRequest > RATE_LIMIT_WINDOW) {
      rateData.count = 0;
      rateData.lastRequest = now;
    }

    rateData.count += 1;
    rateLimitCache.set(ip, rateData);

    if (rateData.count > RATE_LIMIT_MAX) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  // 3. Redirect users away from /auth pages if they already have a valid token
  if (pathname.startsWith("/auth") && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      // Token valid – redirect authenticated user to home
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // Token invalid – clear cookie and allow access to auth pages
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // 4. Protect specific routes that require authentication
  const protectedRoutes = [
    "/account-setting",
    "/create-shipment",
    "/shipping-history",
    "/api/create-shipment",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // No token: redirect to sign-in
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      return NextResponse.next();
    } catch (error) {
      // Invalid token: redirect to sign-in
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware only on these routes
    "/account-setting/:path*",
    "/shipping-history/:path*",
    "/create-shipment/:path*",
    "/api/create-shipment/:path*",
    "/api/shipments/:path*",
    // Note: /api/auth is intentionally excluded to let those endpoints work without interference.
  ],
};
