// app/api/shipments/[trackingNumber]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { Shipment } from "@/models/shipment-model";
import { Package } from "@/models/package-model";
import { Invoice } from "@/models/invoice-model";
import sequelize from "@/lib/sequelize";

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> },
) {
  await sequelize.authenticate();
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

    const shipment = await Shipment.findOne({
      where: { trackingNumber: trackingId },
      include: [
        {
          model: Invoice,
        },
        { model: Package },
      ],
    });

    console.log(shipment);

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
