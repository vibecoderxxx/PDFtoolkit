# PDF Toolkit

## Overview

A full-stack PDF processing web app similar to iLovePDF, built with React + Tailwind CSS frontend and Express backend. Features 31 PDF tools organized by category.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (artifacts/pdf-toolkit)
- **API framework**: Express 5 (artifacts/api-server)
- **Authentication**: Clerk (@clerk/react on frontend, @clerk/express on backend)
- **PDF processing**: pdf-lib (merge, split, edit, watermark, page numbers, protect/unlock, rotate, repair, images-to-PDF, organize, crop, sign, redact, edit, PDF/A)
- **Document conversion**: mammoth (DOCX), xlsx (Excel), jszip (PPTX parsing), docx (DOCX creation), pptxgenjs (PPTX creation)
- **AI features**: Mistral Large via Mistral API (summarizer, translate, OCR post-processing, compare)
- **File upload**: multer (multipart/form-data)
- **Archive creation**: archiver (ZIP generation for multi-file downloads)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Routing**: wouter
- **Drag & drop**: react-dropzone

## Features (31 Tools)

### Organize (6)
1. **Merge PDF** - Combine multiple PDFs into one
2. **Split PDF** - Split by page range, download as ZIP or merged
3. **Remove Pages** - Select pages to delete
4. **Extract Pages** - Select pages, download as ZIP or merged
5. **Organize PDF** - Reorder pages with up/down controls
6. **Scan to PDF** - Upload scanned images, convert to PDF

### Optimize (3)
7. **Compress PDF** - Three quality levels with before/after comparison
8. **Repair PDF** - Fix corrupted PDFs
9. **OCR PDF** - Apply OCR processing to scanned PDFs

### Convert to PDF (5)
10. **JPG to PDF** - Convert images with page size/margin controls
11. **WORD to PDF** - DOCX to PDF via mammoth text extraction
12. **POWERPOINT to PDF** - PPTX to PDF via XML text extraction
13. **EXCEL to PDF** - XLSX/CSV to PDF table rendering
14. **HTML to PDF** - HTML file to PDF text rendering

### Convert from PDF (5)
15. **PDF to JPG** - Pages to images ZIP archive
16. **PDF to WORD** - PDF to DOCX via docx package
17. **PDF to POWERPOINT** - PDF to PPTX via pptxgenjs
18. **PDF to EXCEL** - PDF metadata to XLSX
19. **PDF to PDF/A** - Set archiving metadata

### Edit (5)
20. **Rotate PDF** - Rotate specific or all pages
21. **Add Page Numbers** - Customize position, format, font size
22. **Add Watermark** - Text/image with opacity, rotation controls
23. **Crop PDF** - Trim margins with per-side control
24. **Edit PDF** - Add text annotations with position/size controls

### Security (5)
25. **Unlock PDF** - Remove password protection
26. **Protect PDF** - Add password encryption
27. **Sign PDF** - Add text signature with date stamp
28. **Redact PDF** - Black out sensitive information
29. **Compare PDF** - Compare two PDFs for structural differences

### AI (2)
30. **AI Summarizer** - Mistral Large-powered document summary
31. **Translate PDF** - Mistral Large translation to 12+ languages

## Authentication

- **Provider**: Clerk (auto-provisioned via setupClerkWhitelabelAuth)
- **Frontend**: ClerkProvider wraps app in App.tsx, with sign-in/sign-up routes using Clerk's pre-built components
- **Backend**: clerkMiddleware() mounted globally, requireAuth middleware protects PDF API routes
- **Home page**: Publicly accessible (shows tools grid for both signed-in and signed-out users)
- **Tool pages**: Protected — unauthenticated users redirected to /sign-in
- **User menu**: Avatar + dropdown in header with sign-out option (uses useUser hook, not UserButton)
- **Env vars**: CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, VITE_CLERK_PUBLISHABLE_KEY (auto-provisioned)

## Architecture

- `artifacts/pdf-toolkit/` — React + Vite frontend, serves at `/`
- `artifacts/api-server/` — Express API server, serves at `/api`
- `artifacts/api-server/src/middlewares/` — Clerk proxy and auth middleware
  - `src/routes/pdf.ts` — Original 13 tool endpoints
  - `src/routes/pdf-tools.ts` — 18 new tool endpoints (organize, OCR, conversions, AI)
- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod schemas

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/pdf-toolkit run dev` — run frontend locally

## Environment Variables

- `MISTRAL_API_KEY` — Mistral API key for AI features (summarizer, translate, OCR, compare)
- `SESSION_SECRET` — Session secret for auth

## Session File Handling

The compress endpoint stores processed files in `/tmp` with a 30-minute TTL. Files are served via `/api/pdf/download/:sessionId` endpoint.

## Binary Response Handling

All PDF/ZIP download endpoints return binary data directly. The frontend handles these with native `fetch()` + `.blob()` + `URL.createObjectURL()` for download triggering. Only compress returns JSON with a `downloadUrl`.
