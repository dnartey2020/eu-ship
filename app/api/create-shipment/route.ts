import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shipmentSchema } from "@/lib/validation";
import { authenticateUser, errorResponse } from "@/lib/api-utils";
import { calculateShippingCost } from "@/lib/cost-of-package";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const decoded = await authenticateUser("token", process.env.JWT_SECRET);
    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Validate the incoming data using Zod
    const result = shipmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
    }

    const validatedData = result.data;

    // Generate a tracking number (example logic)
    const trackingNumber =
      "EUS" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(8, "0");

    // Create shipment in the database
    const shipment = await prisma.shipment.create({
      data: {
        deliveryAddress: validatedData.deliveryAddress,
        deliveryCity: validatedData.deliveryCity,
        deliveryGeoCoordinate: validatedData.deliveryGeoCoordinate,
        pickupAddress: validatedData.pickupAddress,
        pickupCity: validatedData.pickupCity,
        pickupDate: new Date(validatedData.pickupDate),
        pickupTime: validatedData.pickupTime,
        pickupGeoCoordinate: validatedData.pickupGeoCoordinate,
        receiverName: validatedData.receiverName,
        receiverPhone: validatedData.receiverPhone,
        senderName: validatedData.senderName,
        senderContact: validatedData.contactPhone,
        trackingNumber,
        userId: decoded.id,
        estimatedCost: calculateShippingCost(validatedData.packages),
        packages: {
          create: validatedData.packages.map((pkg) => ({
            weight: pkg.weight,
            length: pkg.length,
            width: pkg.width,
            height: pkg.weight,
            description: pkg.description,
            quantity: pkg.quantity,
          })),
        },
      },
      include: { packages: true },
    });

    const generateInvoiceNumber = () => {
      const date = new Date();
      return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}-${Math.floor(Math.random() * 100000)}`;
    };

    const invoiceNumber = generateInvoiceNumber();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const calculateTax = (amount: number) => {
      return amount * 0.15; // 15% tax rate
    };

    const invoice = await prisma.invoice.create({
      data: {
        shipmentId: shipment.id,
        invoiceNumber,
        amount: shipment.estimatedCost * 1.15,
        dueDate,
        paid: false,
      },
    });

    return NextResponse.json({ shipment, invoice }, { status: 201 });
  } catch (error) {
    console.log("Error creating shipment:", error);
    return errorResponse("Failed to create shipmemt", 500);
  }
}
