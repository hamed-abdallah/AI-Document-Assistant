"use client";

import { FormEvent, useState } from "react";

interface ChatProps {
  documentText: string;
}

export default function Chat({ documentText }: ChatProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-xl font-semibold">Ask your document</h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about this document..."
            className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50">
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </form>

      {answer && (
        <div className="mt-6 rounded-lg bg-gray-50 p-5">
          <h3 className="mb-2 font-semibold">Answer</h3>

          <div className="whitespace-pre-wrap text-sm leading-6">{answer}</div>
        </div>
      )}
    </div>
  );
}
