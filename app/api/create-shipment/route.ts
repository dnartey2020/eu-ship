import { NextResponse } from "next/server";
import { authenticateUser, errorResponse } from "@/lib/api-utils";
import { calculateShippingCost } from "@/lib/cost-of-package";
import sequelize from "@/lib/sequelize";
import { Invoice, InvoiceStatus } from "@/models/invoice-model";
import { ServiceType, Shipment, ShipmentStatus } from "@/models/shipment-model";
import { Package } from "@/models/package-model";
import { z } from "zod";

// Validation schemas
const DimensionsSchema = z
  .string()
  .regex(/^\d+x\d+x\d+$/, "Invalid dimensions format (e.g., 10x20x30)");
const PackageSchema = z.object({
  weight: z.number().positive().max(100),
  dimensions: DimensionsSchema,
  description: z.string().max(100),
});

const ShipmentSchema = z.object({
  sender: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
    phone: z.string().min(6),
  }),
  receiver: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
    phone: z.string().min(6),
  }),
  packages: z.array(PackageSchema).min(1).max(10),
  specialInstructions: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  if (!process.env.JWT_SECRET) {
    return errorResponse("Server configuration error", 500);
  }
  let decoded: { id: string } | null = null; // Declare decoded outside try block

  const transaction = await sequelize.transaction();

  try {
    await sequelize.authenticate();

    // Authentication
    const decoded = await authenticateUser("token", process.env.JWT_SECRET);
    if (!decoded?.id) {
      await transaction.rollback();
      return errorResponse("Unauthorized", 401);
    }

    // Request validation
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      await transaction.rollback();
      return errorResponse("Invalid content type", 415);
    }

    const body = await request.json();
    const validation = ShipmentSchema.safeParse(body);

    if (!validation.success) {
      await transaction.rollback();
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 },
      );
    }

    const {
      packages: pack,
      receiver,
      sender,
      specialInstructions,
    } = validation.data;

    // Weight validation
    const totalWeight = pack.reduce((sum, pkg) => sum + pkg.weight, 0);
    if (totalWeight > 1000) {
      await transaction.rollback();
      return errorResponse("Total weight exceeds 1000kg limit", 400);
    }

    // Create shipment
    const trackingNumber = `EUS-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 6)}`;
    const shipment = await Shipment.create(
      {
        senderName: sender.name,
        senderAddress: sender.address,
        senderCity: sender.city,
        senderPostalCode: sender.postalCode,
        senderCountry: sender.country,
        senderPhone: sender.phone,
        receiverName: receiver.name,
        receiverAddress: receiver.address,
        receiverCity: receiver.city,
        receiverPostalCode: receiver.postalCode,
        receiverCountry: receiver.country,
        receiverPhone: receiver.phone,
        serviceType: ServiceType.STANDARD,
        specialInstructions: specialInstructions,
        status: ShipmentStatus.PENDING,
        trackingNumber,
        userId: decoded.id,
      },
      { transaction },
    );

    // Create packages
    const packages = await Package.bulkCreate(
      pack.map((pkg) => ({
        ...pkg,
        dimensions: pkg.dimensions.toLowerCase(),
        shipmentId: shipment.id,
      })),
      { transaction },
    );

    // Calculate invoice
    const baseAmount = packages.reduce(
      (sum, pkg) => sum + calculateShippingCost(pkg.weight, pkg.dimensions),
      0,
    );

    const invoiceNumber = `INV-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 5)}`;
    const invoice = await Invoice.create(
      {
        invoiceNumber,
        amount: baseAmount * 1.15, // 15% tax
        taxRate: 0.15,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: InvoiceStatus.UNPAID,
        shipmentId: shipment.id,
        userId: decoded.id,
      },
      { transaction },
    );

    await transaction.commit();

    return NextResponse.json(
      {
        success: true,
        shipmentId: shipment.id,
        trackingNumber: shipment.trackingNumber,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.amount.toFixed(2),
        currency: "USD", // Add currency support
      },
      { status: 201 },
    );
  } catch (error) {
    await transaction.rollback();
    console.error("Shipment creation error:", {
      error,
      // userId: decoded?.id,
      timestamp: new Date().toISOString(),
    });

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid request format", 400);
    }

    return errorResponse("Failed to create shipment. Please try again.", 500);
  }
}
