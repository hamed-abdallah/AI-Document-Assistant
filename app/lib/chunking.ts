export interface TextChunk {
  id: number;
  text: string;
  start: number;
  end: number;
}

export function splitText(
  text: string,
  chunkSize = 5000,
  overlap = 500,
): TextChunk[] {
  const chunks: TextChunk[] = [];

  let start = 0;
  let id = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    chunks.push({
      id,
      text: text.substring(start, end),
      start,
      end,
    });

    if (end >= text.length) {
      break;
    }

    start += chunkSize - overlap;
    id++;
  }

  return chunks;
}
