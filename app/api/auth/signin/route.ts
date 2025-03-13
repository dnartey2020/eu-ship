// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    // Ensure all required properties are present and not null
    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim(),
    };

    // Verify environment variables are set
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      success: true,
      user: payload,
    });

    // Set cookies
    response.cookies.set("refreshToken", refreshToken, {
      /*...*/
    });
    response.cookies.set("token", accessToken, {
      /*...*/
    });

    return response;
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
