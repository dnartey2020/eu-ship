// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// In-memory rate limit cache (for demonstration only)
const rateLimitCache = new Map<
  string,
  { count: number; lastRequest: number }
>();
const RATE_LIMIT_WINDOW = 60000; // 60 seconds
const RATE_LIMIT_MAX = 100; // maximum allowed requests per window

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // --- Rate limiting for public shipments tracking endpoint ---
  if (pathname.startsWith("/api/shipments/")) {
    // Extract client's IP from headers
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

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

  if (pathname.startsWith("/auth") && token) {
    try {
      const decoded = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET),
      );
      if (!decoded) return NextResponse.next();

      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // If token is invalid, clear it and allow access to auth pages
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // -----------------------------------------------------------

  // Allow public routes such as authentication and website content.
  if (
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup") ||
    pathname.startsWith("/(website)") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Protected routes

  const isProtectedRoutes = [
    "/account-setting",
    "/create-shipment", // corrected spelling
    "/shipping-history",
    "/api/create-shipment",
  ];

  const isProtected = isProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
    try {
      const decoded = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET),
      );

      if (!decoded) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/signin";
        return NextResponse.redirect(url);
      }

      // // Add user info to headers
      // const requestHeaders = new Headers(request.headers);
      // requestHeaders.set("x-user-id", decoded.id);

      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification error:", error);
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/shipments/:path*",
    "/account-setting",
    "/account-setting/:path*",
    "/shipping-history",
    "/shipping-history/:path*",
    "/auth",
    "/auth/:path*",
    "/api/create-shipment",
    "/api/create-shipment/:path*",
    "/create-shipment",
    "/create-shipment/:path*",
  ],
  runtime: "nodejs", // Force Node.js runtime
};
