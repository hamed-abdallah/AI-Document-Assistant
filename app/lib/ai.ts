import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not configured");
}

const groq = new OpenAI({
  apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "openai/gpt-oss-20b";

export async function askDocumentAI(
  context: string,
  question: string,
): Promise<string> {
  const response = await groq.responses.create({
    model: MODEL,

    input: `
You are an AI document assistant.

Answer the user's question using ONLY the document context provided below.

Rules:
- Do not invent information.
- If the answer cannot be found in the document, say:
  "I couldn't find this information in the document."
- Be concise and clear.
- If useful, use bullet points.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${question}
`,
  });

  return response.output_text;
}

export async function summarizeDocument(text: string): Promise<string> {
  // Groq free/on-demand limit is currently 8,000 TPM
  const maxCharacters = 18000;

  const content = text.substring(0, maxCharacters);

  const response = await groq.responses.create({
    model: MODEL,

    input: `
You are an AI document analysis assistant.

Analyze the document below.

Create a structured summary with:

1. Executive Summary
2. Main Topics
3. Important Points
4. Important Dates
5. Risks or Issues
6. Key Conclusions

Rules:
- Only use information contained in the document.
- Do not invent information.
- Keep the summary concise.
- Use Markdown.

DOCUMENT:

${content}
`,
  });

  return response.output_text;
}
