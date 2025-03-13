// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/user-model";
import sequelize from "@/lib/sequelize";
import { Op } from "sequelize";

export async function POST(request: Request) {
  // Validate request content type
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid content type. Use application/json" },
      { status: 415 },
    );
  }

  try {
    await sequelize.authenticate();
    const body = await request.json();

    // Destructure with validation
    const { password, email, firstname, lastname, phonenumber } = body;

    // Validate required fields
    if (!email || !password || !firstname || !lastname || !phonenumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check for existing user using transaction
    const transaction = await sequelize.transaction();

    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phonenumber }],
        },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        const conflictField =
          existingUser.email === email ? "email" : "phone number";
        return NextResponse.json(
          { error: `User with this ${conflictField} already exists` },
          { status: 409 },
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create(
        {
          email,
          firstname,
          lastname,
          phonenumber,
          password: hashedPassword,
        },
        { transaction },
      );

      await transaction.commit();

      // Return sanitized user data (without password)
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        phonenumber: newUser.phonenumber,
        // createdAt: newUser.createdAt,
      };

      return NextResponse.json(
        { message: "User created successfully", user: userResponse },
        { status: 201 },
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    console.error("Sign up error:", error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 },
      );
    }

    // Handle database errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return NextResponse.json(
        { error: "Database constraint error" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 },
    );
  }
}
