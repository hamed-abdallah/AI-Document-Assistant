"use client";

import { useState } from "react";
import Upload from "./components/Upload";
import Summary from "./components/Summary";
import Chat from "./components/Chat";

interface DocumentData {
  filename: string;
  size: number;
  pageCount: number;
  text: string;
}

export default function Home() {
  const [document, setDocument] = useState<DocumentData | null>(null);

  const [error, setError] = useState("");

  function handleUpload(data: DocumentData) {
    setDocument(data);
    setError("");
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold">AI Document Assistant</h1>

          <p className="mt-3 text-gray-600">
            Upload a PDF, ask questions and generate AI summaries.
          </p>
        </header>

        {!document && <Upload onUpload={handleUpload} onError={setError} />}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {document && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold">{document.filename}</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {document.pageCount} pages · {formatFileSize(document.size)}
                </p>
              </div>

              <button
                onClick={() => {
                  setDocument(null);
                  setError("");
                }}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                Upload another PDF
              </button>
            </div>

            <Summary documentText={document.text} />

            <Chat documentText={document.text} />

            <details className="rounded-xl border bg-white p-6">
              <summary className="cursor-pointer font-semibold">
                Extracted text
              </summary>

              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap text-sm text-gray-600">
                {document.text}
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
