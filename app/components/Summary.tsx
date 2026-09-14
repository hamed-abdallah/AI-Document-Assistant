"use client";

import { useState } from "react";

interface SummaryProps {
  documentText: string;
}

export default function Summary({ documentText }: SummaryProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateSummary() {
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Summary failed");
      }

      setSummary(data.summary);
    } catch (error) {
      setSummary(
        error instanceof Error ? error.message : "Failed to generate summary",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Document Summary</h2>

        <button
          onClick={generateSummary}
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      {summary && (
        <div className="mt-6 whitespace-pre-wrap text-sm leading-7">
          {summary}
        </div>
      )}
    </div>
  );
}
