import { connectDb } from "@/app/lib/db";
import Paste from "@/app/lib/paste.model";
import { getNow } from "@/app/lib/ttl";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

async function getPaste(id: string): Promise<PasteResponse | null> {
  try {
    await connectDb();

    const headersList = await headers();
    const testNowMs = headersList.get("x-test-now-ms");

    const mockReq = {
      headers: {
        get: (name: string) =>
          name === "x-test-now-ms" ? testNowMs : null,
      },
    } as Request;

    const now = getNow(mockReq);

    const paste = await Paste.findOne({
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
    });

    if (!paste) return null;

    return {
      content: paste.content,
      remaining_views:
        paste.maxViews === null
          ? null
          : Math.max(0, paste.maxViews - paste.viewsUsed),
      expires_at: paste.expiresAt
        ? paste.expiresAt.toISOString()
        : null,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPaste(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {/* Content - React auto-escapes */}
        <pre className="whitespace-pre-wrap wrap-break-word font-mono text-sm text-gray-900 bg-gray-50 p-4 rounded-md border border-gray-200">
          {data.content}
        </pre>

        <div className="mt-4 border-t pt-3 flex flex-col gap-1 text-sm text-gray-700">
          <span>
            Views Remaining:{" "}
            {data.remaining_views === null ? "Unlimited" : data.remaining_views}
          </span>

          <span>
            Expiry Date:{" "}
            {data.expires_at
              ? new Date(data.expires_at).toLocaleString()
              : "Never"}
          </span>
        </div>
      </div>
    </main>
  );
}