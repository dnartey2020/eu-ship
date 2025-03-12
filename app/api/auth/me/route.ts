import { authenticateUser, errorResponse } from "@/lib/api-utils";
import sequelize from "@/lib/sequelize";
import { User } from "@/models/user-model";
import { NextResponse } from "next/server";

// Initialize database connection once
sequelize.authenticate().catch((error) => {
  console.error("Database connection error:", error);
});

export async function GET(req: Request) {
  // await sequelize.authenticate();

  try {
    const decoded = await authenticateUser("token", process.env.JWT_SECRET);
    if (!decoded) return errorResponse("Authentication Required", 401);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return errorResponse("User not found", 404);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Unauthenticated Error:", error);
    return errorResponse("Internal server error", 500);
  }
}
