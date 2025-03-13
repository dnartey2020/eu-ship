import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Allow POST to testing endpoint
  if (pathname.startsWith("/api/testing") && method === "POST") {
    return NextResponse.next();
  }

  // ... rest of your middleware logic
}
