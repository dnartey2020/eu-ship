import { authenticateUser, deleteCookie, errorResponse } from "@/lib/api-utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const token = await authenticateUser(
      "refreshToken",
      process.env.JWT_REFRESH_SECRET,
    );
    if (!token) return errorResponse("Missing refresh token", 401);

    const refreshToken = await jwt.sign(
      {
        id: token.id,
        email: token.email,
        // name: `${token.firstname} ${token.lastname}`,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    const newAccessToken = jwt.sign(
      {
        id: token.id,
        email: token.email,
        // name: `${token.firstname} ${token.lastname}`,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "token",
      value: newAccessToken,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    deleteCookie("refreshToken");
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
