import { summarizeDocument } from "@/app/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isOpenAIQuotaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const err = error as {
    status?: number;
    code?: string;
  };

  return (
    err.status === 429 ||
    err.code === "insufficient_quota" ||
    err.code === "credit_balance_exhausted"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { documentText } = body;

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

    const summary = await summarizeDocument(documentText);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: unknown) {
    console.error("Summary error:", error);

    if (isOpenAIQuotaError(error)) {
      return NextResponse.json(
        {
          error:
            "OpenAI API quota exhausted. Please add API credits and try again.",
        },
        {
          status: 429,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Summary generation failed",
      },
      {
        status: 500,
      },
    );
  }
}
