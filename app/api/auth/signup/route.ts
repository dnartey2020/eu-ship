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

// GET handler for testing (remove in production)
export async function GET() {
  return NextResponse.json({
    message: "Sign-up endpoint works. Use POST to register.",
  });
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

    // Basic validation
    if (
      !firstname ||
      !lastname ||
      !password ||
      !firstname ||
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

    console.log(firstname);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }, // More appropriate status code for conflict
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user record
    const user = await prisma.user.create({
      data: {
        firstname,
        email,
        lastname,
        phonenumber,
        pickaddress,
        pickcity,
        picklocation,
        password: hashedPassword,
        // Add if your schema requires these:
        // emailVerified: new Date(),
        // role: 'USER' // Add appropriate default role
      },
    });

    // Remove password before sending response
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
