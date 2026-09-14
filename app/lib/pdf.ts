import { extractText, getDocumentProxy } from "unpdf";

export interface ParsedPdf {
  text: string;
  pageCount: number;
}

export async function extractPdfText(buffer: Buffer): Promise<ParsedPdf> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));

  const { text } = await extractText(pdf, {
    mergePages: true,
  });

  return {
    text: text || "",
    pageCount: pdf.numPages,
  };
}
