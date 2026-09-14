# AI Document Assistant

An AI-powered PDF document assistant built with **Next.js**, **TypeScript**, **Groq**, and **unpdf**.

Upload a PDF document, extract its content, generate an AI summary, and ask questions about the document.

## Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDF files
- 🤖 Ask questions about your document using AI
- 📝 Generate structured document summaries
- ⚡ Fast AI inference with Groq
- 🔒 API key kept securely on the server
- 💾 No database required
- 🎨 Modern responsive UI with Tailwind CSS

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Groq API**
- **OpenAI SDK** — used with Groq's OpenAI-compatible API
- **unpdf** — PDF text extraction

## Project Structure

```text
ai-document-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   └── summarize/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── Upload.tsx
│   │   ├── Chat.tsx
│   │   └── Summary.tsx
│   │
│   └── lib/
│       ├── ai.ts
│       ├── pdf.ts
│       └── chunking.ts
│
├── .env.local
├── package.json
└── README.md
```

## How It Works

The application processes a document through three main API endpoints.

### 1. Upload PDF

```text
PDF
 ↓
/api/upload
 ↓
unpdf
 ↓
Extracted text
 ↓
Frontend
```

The PDF is uploaded and its text is extracted using `unpdf`.

### 2. Generate Summary

```text
Extracted text
 ↓
/api/summarize
 ↓
Groq API
 ↓
AI-generated summary
```

The application generates a structured summary containing:

- Executive Summary
- Main Topics
- Important Points
- Important Dates
- Risks or Issues
- Key Conclusions

### 3. Ask Questions

```text
PDF text
 ↓
/api/chat
 ↓
Groq API
 ↓
AI answer
```

The AI is instructed to answer only using information found in the document.

If the information cannot be found, the assistant responds:

> I couldn't find this information in the document.

## AI Provider

This project uses **Groq** for AI inference.

Groq provides an OpenAI-compatible API, so the existing `openai` npm package can be used.

Current model:

```text
openai/gpt-oss-20b
```

The Groq client is configured using:

```ts
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Do not commit `.env.local` to Git.

Make sure your `.gitignore` contains:

```text
.env*
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ai-document-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Lint

```bash
npm run lint
```

## API Endpoints

### Upload PDF

```http
POST /api/upload
```

Request:

```text
multipart/form-data
file=<PDF>
```

Example response:

```json
{
  "success": true,
  "filename": "document.pdf",
  "size": 245678,
  "pageCount": 12,
  "text": "Extracted document text..."
}
```

### Ask a Question

```http
POST /api/chat
```

Request:

```json
{
  "documentText": "Document content...",
  "question": "What is the main purpose of this document?"
}
```

Example response:

```json
{
  "success": true,
  "answer": "The main purpose of the document is..."
}
```

### Generate Summary

```http
POST /api/summarize
```

Request:

```json
{
  "documentText": "Document content..."
}
```

Example response:

```json
{
  "success": true,
  "summary": "## Executive Summary..."
}
```

## Current Limitations

The current version is intentionally simple and does not use a database or vector database.

For large PDF documents, only a limited amount of text is sent to the AI model to stay within the current Groq token limits.

Current approach:

```text
PDF
 ↓
Extract text
 ↓
Limit context size
 ↓
Groq
```

This means that very large documents may not be fully available to the AI when answering questions.

## Roadmap

### Phase 1 — Current

- [x] PDF upload
- [x] PDF text extraction
- [x] AI summary
- [x] Document Q&A
- [x] Groq integration
- [x] Responsive UI
- [x] No database

### Phase 2 — RAG

- [ ] Improve document chunking
- [ ] Semantic search
- [ ] Embeddings
- [ ] Vector database
- [ ] Retrieve relevant document sections
- [ ] Support large PDF documents

### Phase 3 — Advanced Features

- [ ] Conversation history
- [ ] Multiple documents
- [ ] Document management
- [ ] PDF page references
- [ ] Streaming AI responses
- [ ] Authentication
- [ ] User accounts
- [ ] Document sharing

## Security

The Groq API key must only be used on the server.

Never expose:

```text
GROQ_API_KEY
```

to client-side code.

API calls are handled through Next.js server routes:

```text
Browser
   ↓
Next.js API
   ↓
Groq
```

## License

This project is for educational and development purposes.

---

Built with **Next.js + TypeScript + Groq**.
