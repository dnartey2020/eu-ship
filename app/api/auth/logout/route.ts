import { prisma } from "@/lib/prisma";
import { authenticateUser, deleteCookie, errorResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function POST(res: Request) {
  try {
    const decoded = await authenticateUser("token", process.env.JWT_SECRET);
    if (!decoded) return errorResponse("Authentication Required", 401);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return errorResponse("User not found", 404);

    console.log("Logout endpoint hit");

    await deleteCookie("token");
    await deleteCookie("refreshToken");

    return NextResponse.json({ message: "logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return errorResponse("Internal server error", 500);
  }
}
