// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface SignUpData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phonenumber: string;
  pickaddress: string;
  pickcity: string;
  picklocation: string;
}

export async function POST(request: Request) {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phonenumber,
      pickaddress,
      pickcity,
      picklocation,
    }: SignUpData = await request.json();

    // Validation: Check all required fields
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !phonenumber ||
      !pickaddress ||
      !pickcity ||
      !picklocation
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Optional: Validate phone number format
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phonenumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 },
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log("User exists", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        phonenumber,
        pickaddress,
        pickcity,
        picklocation,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
