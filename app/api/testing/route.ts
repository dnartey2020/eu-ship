import { Shipment } from "@/models/shipment-model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid content type. Use application/json" },
      { status: 415 },
    );
  }

  const body = await request.json();
  try {
    const shipments = await Shipment.findAll();
    NextResponse.json(shipments, { status: 200 });
  } catch (error) {}
  return NextResponse.json(body, { status: 201 });
}
