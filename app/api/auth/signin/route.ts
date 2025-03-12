// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/user-model";
import sequelize from "@/lib/sequelize";

export async function POST(req: Request) {
  await sequelize.authenticate();

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({
      where: { email },
    });

    console.log(user);

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

    const accesstoken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
      },
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

    response.cookies.set({
      name: "token",
      value: accesstoken,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Refresh Token Generation Failed" },
      { status: 500 },
    );
  }
}
