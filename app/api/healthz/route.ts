import { connectDb } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    console.log("DB connected");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
