import { connectDb } from "@/app/lib/db";
import Paste from "@/app/lib/paste.model";
import { getNow } from "@/app/lib/ttl";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDb();

    const now = getNow(req);

    const paste = await Paste.findOneAndUpdate(
      {
        _id: id,
        $and: [
          {
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
          },
          {
            $or: [
              { maxViews: null },
              { $expr: { $lt: ["$viewsUsed", "$maxViews"] } },
            ],
          },
        ],
      },
      { $inc: { viewsUsed: 1 } },
      { new: true },
    );

    if (!paste) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views:
          paste.maxViews === null
            ? null
            : Math.max(0, paste.maxViews - paste.viewsUsed),
        expires_at: paste.expiresAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
