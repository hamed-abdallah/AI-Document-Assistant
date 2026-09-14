import { extractPdfText } from "@/app/lib/pdf";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "PDF file is required",
        },
        {
          status: 400,
        },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Only PDF files are supported",
        },
        {
          status: 400,
        },
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const parsed = await extractPdfText(buffer);

    if (!parsed.text.trim()) {
      return NextResponse.json(
        {
          error: "No text could be extracted from this PDF",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      pageCount: parsed.pageCount,
      text: parsed.text,
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to process PDF",
      },
      {
        status: 500,
      },
    );
  }
}
