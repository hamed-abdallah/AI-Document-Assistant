import { askDocumentAI } from "@/app/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isAIQuotaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const err = error as {
    status?: number;
    code?: string;
  };

  return (
    err.status === 429 ||
    err.status === 413 ||
    err.code === "rate_limit_exceeded"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { documentText, question } = body;

    if (!documentText) {
      return NextResponse.json(
        {
          error: "Document text is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!question?.trim()) {
      return NextResponse.json(
        {
          error: "Question is required",
        },
        {
          status: 400,
        },
      );
    }

    // Groq: keep request size below current TPM limit
    const context = documentText.substring(0, 20000);

    const answer = await askDocumentAI(context, question);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);

    if (isAIQuotaError(error)) {
      return NextResponse.json(
        {
          error:
            "Groq rate limit reached. Please wait a few seconds and try again.",
        },
        {
          status: 429,
        },
      );
    }

    return NextResponse.json(
      {
        error: "AI request failed",
      },
      {
        status: 500,
      },
    );
  }
}
