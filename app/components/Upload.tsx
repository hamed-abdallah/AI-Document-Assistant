"use client";

import { ChangeEvent, useState } from "react";

interface UploadProps {
  onUpload: (data: {
    filename: string;
    size: number;
    pageCount: number;
    text: string;
  }) => void;

  onError: (error: string) => void;
}

export default function Upload({ onUpload, onError }: UploadProps) {
  const [loading, setLoading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      onError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    onError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUpload(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to upload PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8">
      <div className="text-center">
        <div className="mb-4 text-5xl">📄</div>

        <h2 className="text-xl font-semibold">Upload your PDF</h2>

        <p className="mt-2 text-sm text-gray-500">
          Upload a PDF document and ask questions about it.
        </p>

        <label className="mt-6 inline-block cursor-pointer rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
          {loading ? "Processing..." : "Choose PDF"}

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
}
