import { NextResponse } from "next/server";
import { authenticateUser, errorResponse } from "@/lib/api-utils";
import { calculateShippingCost } from "@/lib/cost-of-package";
import sequelize from "@/lib/sequelize";
import { Invoice, InvoiceStatus } from "@/models/invoice-model";
import { ServiceType, Shipment, ShipmentStatus } from "@/models/shipment-model";
import { Package } from "@/models/package-model";
import { z } from "zod";

export async function POST(request: Request) {
  await sequelize.authenticate();
  const transaction = await sequelize.transaction();

  try {
    const body = await request.json();
    const decoded = await authenticateUser("token", process.env.JWT_SECRET!);

    if (!decoded) {
      await transaction.rollback();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Combined validation
    // const validation = z
    //   .object({
    //     shipment: shipmentSchema,
    //     packages: packageCreateArraySchema,
    //   })
    //   .safeParse(body);

    // if (!validation.success) {
    //   await transaction.rollback();
    //   return NextResponse.json(
    //     { error: validation.error.errors },
    //     { status: 400 },
    //   );
    // }

    // const { shipment: shipmentData, packages: packageData } = validation.data;
    const { packages: pack, receiver, sender } = body;

    // Validate total weight
    const totalWeight = pack.reduce((sum, pkg) => sum + pkg.weight, 0);
    if (totalWeight > 1000) {
      await transaction.rollback();
      return NextResponse.json(
        { error: "Total weight exceeds 1000kg limit" },
        { status: 400 },
      );
    }

    console.log(sender);

    // Create shipment
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
        specialInstructions: sender.specialInstructions,
        status: ShipmentStatus.PENDING,
        trackingNumber: `EUS-${Date.now()}`,
        userId: decoded.id,
      },
      { transaction },
    );

    // Create packages with sanitization
    const packages = await Package.bulkCreate(
      pack.map((pkg) => ({
        ...pkg,
        dimensions: pkg.dimensions.replace(/[^0-9x]/g, "").toLowerCase(),
        shipmentId: shipment.id,
      })),
      { transaction },
    );

    // Calculate invoice
    const baseAmount = packages.reduce(
      (sum, pkg) => sum + calculateShippingCost(pkg.weight, pkg.dimensions),
      0,
    );
    const taxRate = 0.15;
    const invoice = await Invoice.create(
      {
        invoiceNumber: `INV-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 5)}`,
        amount: baseAmount * (1 + taxRate),
        taxRate,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
        totalAmount: invoice.amount,
      },
      { status: 201 },
    );
  } catch (error) {
    await transaction.rollback();
    console.error("Shipment creation error:", error);
    return errorResponse("Failed to create shipment", 500);
  }
}
