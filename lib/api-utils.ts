import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const authenticateUser = async (tokenName: string, secret) => {
  const cookieStore = cookies();
  const token = await (await cookieStore).get(tokenName)?.value;

  if (!token) return null;

  try {
    return (await jwt.verify(token, secret)) as {
      id: string;
      email: string;
      name: string;
    };
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};

export const errorResponse = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export const getCookie = async (cookieName: string) => {
  const cookieStore = cookies();
  return (await cookieStore).get(cookieName)?.value;
};

export const deleteCookie = async (cookieName: string) => {
  const cookieStore = cookies();
  return (await cookieStore).delete({ path: "/", name: cookieName });
};
