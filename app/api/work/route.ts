import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const data = {
    position: "Web Development",
    name: "David",
  };

  const posts = data;

  return NextResponse.json(posts);
}
