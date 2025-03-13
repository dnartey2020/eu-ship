import { Shipment } from "@/models/shipment-model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const shipments = await Shipment.findAll();
    return NextResponse.json(shipments, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
