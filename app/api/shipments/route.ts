import { authenticateUser, errorResponse } from "@/lib/api-utils";
import sequelize from "@/lib/sequelize";
import { Invoice } from "@/models/invoice-model";
import { Package } from "@/models/package-model";
import { Shipment } from "@/models/shipment-model";
import { User } from "@/models/user-model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await sequelize.authenticate();
  try {
    const decoded = await authenticateUser("token", process.env.JWT_SECRET);
    if (!decoded) return errorResponse("Authentication Required", 401);

    const user = await User.findByPk(decoded.id);
    if (!user) return errorResponse("User not found", 404);

    const shipment = await Shipment.findAll({
      where: { userId: decoded.id },
      // include: [
      //   {
      //     model: Package,
      //   },
      //   { model: Invoice },
      // ],
    });

    console.log(shipment);

    return NextResponse.json(shipment, { status: 200 });
  } catch (error) {
    console.error("Shipment Fetch Error:", error);
    return errorResponse("Internal server error", 500);
  }
}
