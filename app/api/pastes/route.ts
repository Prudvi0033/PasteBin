import { connectDb } from "@/app/lib/db";
import Paste from "@/app/lib/paste.model";
import { getNow } from "@/app/lib/ttl";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { content, ttl_seconds, max_views } = await req.json();


    if (!content || typeof content !== "string") {
      return NextResponse.json(
        {
          msg: "Invalid Content",
        },
        { status: 400 },
      );
    }
    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        {
          msg: "Invalid ttl",
        },
        { status: 400 },
      );
    }
    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        {
          msg: "Invalid Max Views",
        },
        { status: 400 },
      );
    }

    const id = nanoid(6);
    const now = getNow(req);

    const ttl = ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null;

    await Paste.create({
      _id: id,
      content,
      expiresAt: ttl,
      maxViews: max_views ?? null,
      viewsUsed: 0,
      createdAt: now,
    });

    return NextResponse.json({
      id,
      url: `${process.env.BASE_URL}/p/${id}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
