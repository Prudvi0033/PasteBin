"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<PasteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const getPaste = async () => {
      try {
        const res = await axios.get(`/api/pastes/${id}`, {
          headers: { "Cache-Control": "no-store" },
        });
        setData(res.data);
      } catch {
        setError("Paste not found or expired");
      } finally {
        setLoading(false);
      }
    };

    getPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-600">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-white flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {/* Content */}
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
