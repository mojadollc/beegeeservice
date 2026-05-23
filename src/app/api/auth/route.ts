import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "admin123";

  if (username === validUser && password === validPass) {
    const token = signToken(username);
    return NextResponse.json({ token });
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
