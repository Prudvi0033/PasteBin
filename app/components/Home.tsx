"use client";

import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | "">("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);

  const handleCreatePaste = async () => {
    setError(null);
    setPasteUrl(null);

    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/pastes", {
        content,
        ttl_seconds: ttl || undefined,
        max_views: maxViews || undefined,
      });
      setPasteUrl(res.data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (err) {
      console.log(err);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black flex flex-col gap-6 py-12 w-full items-center">
      {/* Content */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <label className="text-start font-medium">Content</label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-neutral-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-400"
          placeholder="Enter your paste content here"
        />
      </div>

      {/* Optional fields */}
      <div className="flex gap-4 w-full max-w-md justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-start font-medium text-neutral-600">
            Expiry (Optional)
          </label>
          <input
            type="number"
            value={ttl}
            onChange={(e) =>
              setTtl(e.target.value ? Number(e.target.value) : "")
            }
            className="border border-neutral-300 rounded-lg p-2 bg-neutral-50 text-neutral-800 focus:ring-1 focus:ring-blue-400"
            placeholder="Seconds"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-start font-medium text-neutral-600">
            Max Views (Optional)
          </label>
          <input
            type="number"
            value={maxViews}
            onChange={(e) =>
              setMaxViews(e.target.value ? Number(e.target.value) : "")
            }
            className="border border-neutral-300 rounded-lg p-2 bg-neutral-50 text-neutral-800"
            placeholder="Number of views"
          />
        </div>
      </div>

      {/* Button */}
      <div className="w-full max-w-md flex flex-col gap-2">
        <button
          className="bg-neutral-700 cursor-pointer hover:bg-neutral-900 text-white font-semibold py-2 px-6 rounded-lg"
          onClick={handleCreatePaste}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {/* Note / Warning Box */}
        <div className="flex items-start gap-2 mt-2 p-3 bg-neutral-100 border-l-4 border-neutral-300 rounded-md text-neutral-700 text-sm">
          <span className="font-semibold">Note:</span>
          <span>
            If Expiry or Max Views are not set, the paste will remain
            available indefinitely.
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Success */}
        {pasteUrl && (
          <p className="text-sm text-green-600">
            Paste created!{" "}
            <a
              href={pasteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View Paste
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
