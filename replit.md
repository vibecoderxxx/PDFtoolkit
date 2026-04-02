# PDF Toolkit

## Overview

A full-stack PDF processing web app similar to iLovePDF, built with React + Tailwind CSS frontend and Express backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (artifacts/pdf-toolkit)
- **API framework**: Express 5 (artifacts/api-server)
- **PDF processing**: pdf-lib (merge, split, edit, watermark, page numbers, protect/unlock, rotate, repair, images-to-PDF)
- **File upload**: multer (multipart/form-data)
- **Archive creation**: archiver (ZIP generation for multi-file downloads)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Routing**: wouter
- **Drag & drop**: react-dropzone

## Features

1. **Merge PDF** - Upload multiple PDFs, reorder, merge into one
2. **Split PDF** - Split by page range or extract all pages, download as ZIP or merged
3. **Remove Pages** - Show thumbnails, select pages to delete
4. **Extract Pages** - Select pages, download as ZIP or merged
5. **Compress PDF** - Three quality levels, shows before/after file size
6. **Add Watermark** - Text or image watermark with opacity, rotation, position controls
7. **Add Page Numbers** - Customize position, format, font size, page range
8. **Protect PDF** - Add password protection
9. **Unlock PDF** - Remove password protection
10. **Rotate Pages** - Rotate specific or all pages
11. **Repair PDF** - Attempt to fix corrupted PDFs
12. **Images to PDF** - Convert JPG/PNG to PDF with page size and margin controls
13. **PDF to Images** - Convert PDF pages to image ZIP archive

## Architecture

- `artifacts/pdf-toolkit/` — React + Vite frontend, serves at `/`
- `artifacts/api-server/` — Express API server, serves at `/api`
- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/` — Generated React Query hooks (from Orval codegen)
- `lib/api-zod/` — Generated Zod schemas (from Orval codegen)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/pdf-toolkit run dev` — run frontend locally

## Session File Handling

The compress endpoint stores processed files in `/tmp` with a 30-minute TTL. Files are served via `/api/pdf/download/:sessionId` endpoint.

## Binary Response Handling

All PDF/ZIP download endpoints return binary data directly. The frontend handles these with native `fetch()` + `.blob()` + `URL.createObjectURL()` for download triggering. Only compress returns JSON with a `downloadUrl`.
