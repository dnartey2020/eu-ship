import { authenticateUser, errorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const decoded = await authenticateUser("token", process.env.JWT_SECRET);
    if (!decoded) return errorResponse("Authentication Required", 401);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return errorResponse("User not found", 404);

    const shipment = await prisma.shipment.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(shipment, { status: 200 });
  } catch (error) {
    console.error("Shipment Fetch Error:", error);
    return errorResponse("Internal server error", 500);
  }
}
