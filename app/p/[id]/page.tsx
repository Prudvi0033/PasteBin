import { notFound } from "next/navigation";
import { headers } from "next/headers";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

async function getPasteFromAPI(id: string): Promise<PasteResponse | null> {
  try {
    const headersList = await headers();
    const testNowMs = headersList.get("x-test-now-ms");
    
    const fetchHeaders: HeadersInit = {};
    if (testNowMs) {
      fetchHeaders["x-test-now-ms"] = testNowMs;
    }
    
    const response = await fetch(`${process.env.BASE_URL}/api/pastes/${id}`, {
      headers: fetchHeaders,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPasteFromAPI(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 border border-gray-200">
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