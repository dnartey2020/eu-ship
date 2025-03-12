// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/user-model";
import sequelize from "@/lib/sequelize";

export async function POST(request: Request) {
  await sequelize.authenticate();
  const { password, email, firstname, lastname, phonenumber } =
    await request.json();

  try {
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    console.log(existingUser);

    if (existingUser)
      return NextResponse.json(
        { error: "User with email already exist" },
        { status: 409 },
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const newUser = await User.create({
      email,
      firstname,
      lastname,
      phonenumber,
      password: hashedPassword,
    });

    return NextResponse.json("User Created", { status: 201 });
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
