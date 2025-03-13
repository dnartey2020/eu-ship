// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/user-model";
import sequelize from "@/lib/sequelize";
import { Op } from "sequelize";

export async function POST(req: Request) {
  // Validate content type
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid content type. Use application/json" },
      { status: 415 },
    );
  }

  try {
    await sequelize.authenticate();
    const body = await req.json();

    // Validate required fields
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user with case-insensitive email match
    const user = await User.findOne({
      where: {
        email: {
          [Op.iLike]: email, // Case-insensitive search
        },
      },
    });

    if (!user) {
      // Generic error message for security
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Validate JWT secrets
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured");
    }

    // Token payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: `${user.firstname} ${user.lastname}`,
    };

    // Generate tokens
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Sanitized user data
    const userResponse = {
      id: user.id,
      email: user.email,
      name: `${user.firstname} ${user.lastname}`,
      phonenumber: user.phonenumber,
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      user: userResponse,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    response.cookies.set({
      ...cookieOptions,
      name: "refreshToken",
      value: refreshToken,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set({
      ...cookieOptions,
      name: "accessToken",
      value: accessToken,
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error: any) {
    console.error("Authentication error:", error);

    // Handle specific error types
    if (error.name === "SequelizeConnectionError") {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 },
    );
  }
}
