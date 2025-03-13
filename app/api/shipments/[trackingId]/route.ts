// app/api/shipments/[trackingNumber]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> },
) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    try {
      await rateLimiter.consume(ip);
    } catch (rlRejected) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 },
      );
    }

    // Correct parameter access
    const { trackingId } = await params;

    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: `EUS${trackingId}` },
      include: { packages: true, invoice: true },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(shipment, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return NextResponse.json(
      { error: "Failed to retrieve shipment" },
      { status: 500 },
    );
  }
}
