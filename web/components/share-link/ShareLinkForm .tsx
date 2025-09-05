"use client";

import { useState } from "react";

interface ShareLinkFormProps {
  videoId: string;
}

export default function ShareLinkForm({ videoId }: ShareLinkFormProps) {
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [expiry, setExpiry] = useState<"1h" | "12h" | "1d" | "30d" | "forever">("1d");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    try {
      const res = await fetch("/api/share-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          visibility,
          emails: visibility === "PRIVATE" ? emailList : [],
          expiryPreset: expiry,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedLink(data.link);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-50 dark:bg-[#111] rounded-xl shadow-md">
      {/* Visibility */}
      <div>
        <label className="font-medium mb-1 block">Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as "PUBLIC" | "PRIVATE")}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
        >
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      {/* Expiry */}
      <div>
        <label className="font-medium mb-1 block">Expiry</label>
        <select
          value={expiry}
          onChange={(e) => setExpiry(e.target.value as any)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
        >
          <option value="1h">1 Hour</option>
          <option value="12h">12 Hours</option>
          <option value="1d">1 Day</option>
          <option value="30d">30 Days</option>
          <option value="forever">Forever</option>
        </select>
      </div>

      {/* Emails for private links */}
      {visibility === "PRIVATE" && (
        <div>
          <label className="font-medium mb-1 block">Emails (comma separated)</label>
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="user1@example.com, user2@example.com"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Share Link"}
      </button>

      {/* Generated Link */}
      {generatedLink && (
        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/40 rounded">
          <p className="text-sm truncate">
            <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="underline">
              {generatedLink}
            </a>
          </p>
        </div>
      )}
    </form>
  );
}
