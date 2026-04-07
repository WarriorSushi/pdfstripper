# PDFStripper — Implementation Tasks

## Phase 1: Project Setup & Core Infrastructure
- [x] 1.1 Initialize Next.js project with TypeScript + Tailwind
- [ ] 1.2 Install dependencies (pdf-lib, pdfjs-dist, lucide-react, tailwind-merge)
- [ ] 1.3 Create next.config.ts (static export, basePath, images)
- [ ] 1.4 Create globals.css with design tokens
- [ ] 1.5 Create layout.tsx with fonts (Inter, Space Grotesk, JetBrains Mono)
- [ ] 1.6 Create .gitignore

## Phase 2: Shared Components & Utilities
- [ ] 2.1 Create lib/pdf-engine.ts — PDF processing wrapper (merge, split, compress, rotate)
- [ ] 2.2 Create lib/file-utils.ts — file handling helpers (read, download, format size)
- [ ] 2.3 Create components/FileDropZone.tsx — drag-and-drop upload area
- [ ] 2.4 Create components/FileList.tsx — uploaded files with metadata
- [ ] 2.5 Create components/PagePreview.tsx — PDF page thumbnail renderer
- [ ] 2.6 Create components/ProgressBar.tsx — processing progress indicator
- [ ] 2.7 Create components/ToolCard.tsx — tool card for homepage grid
- [ ] 2.8 Create components/Header.tsx — site header with nav
- [ ] 2.9 Create components/Footer.tsx — site footer
- [ ] 2.10 Create components/ToolLayout.tsx — shared layout for tool pages
- [ ] 2.11 Create lib/tools-config.ts — tool definitions (name, slug, icon, category, description)

## Phase 3: Landing Page
- [ ] 3.1 Create app/page.tsx — hero section
- [ ] 3.2 Add tool grid (categorized: Core, Convert, Security, Edit, Analyze)
- [ ] 3.3 Add "How it works" section (3-step visual)
- [ ] 3.4 Add privacy/trust section
- [ ] 3.5 Add competitor comparison table
- [ ] 3.6 Add FAQ accordion
- [ ] 3.7 Add CTA banner

## Phase 4: Core PDF Tools (6 tools)
- [ ] 4.1 Merge PDF — /tools/merge-pdf
- [ ] 4.2 Split PDF — /tools/split-pdf
- [ ] 4.3 Compress PDF — /tools/compress-pdf
- [ ] 4.4 Rotate Pages — /tools/rotate-pages
- [ ] 4.5 Reorder Pages — /tools/reorder-pages (drag-and-drop thumbnails)
- [ ] 4.6 Delete Pages — /tools/delete-pages

## Phase 5: Convert Tools (5 tools)
- [ ] 5.1 PDF to Images — /tools/pdf-to-images
- [ ] 5.2 Images to PDF — /tools/images-to-pdf
- [ ] 5.3 PDF to Text — /tools/pdf-to-text
- [ ] 5.4 Word to PDF — /tools/word-to-pdf (basic)
- [ ] 5.5 HTML to PDF — /tools/html-to-pdf

## Phase 6: Security Tools (4 tools)
- [ ] 6.1 Protect PDF — /tools/protect-pdf
- [ ] 6.2 Unlock PDF — /tools/unlock-pdf
- [ ] 6.3 Redact Text — /tools/redact-text
- [ ] 6.4 Add Watermark — /tools/add-watermark

## Phase 7: Edit Tools (5 tools)
- [ ] 7.1 Add Text — /tools/add-text
- [ ] 7.2 Add Images — /tools/add-images
- [ ] 7.3 Add Page Numbers — /tools/add-page-numbers
- [ ] 7.4 Sign PDF — /tools/sign-pdf (draw pad)
- [ ] 7.5 Fill Forms — /tools/fill-forms

## Phase 8: Analyze Tools (3 tools)
- [ ] 8.1 PDF Info — /tools/pdf-info
- [ ] 8.2 Extract Images — /tools/extract-images
- [ ] 8.3 OCR Text — /tools/ocr (Tesseract.js)

## Phase 9: Testing
- [ ] 9.1 Install Playwright
- [ ] 9.2 Write tests: landing page renders, all tool links work
- [ ] 9.3 Write tests: file upload flow (mock file)
- [ ] 9.4 Write tests: merge PDF produces valid output
- [ ] 9.5 Write tests: split PDF extracts correct pages
- [ ] 9.6 Write tests: compress reduces file size
- [ ] 9.7 Write tests: page navigation and responsive layout
- [ ] 9.8 Write tests: export/download triggers correctly

## Phase 10: Polish & Deploy
- [ ] 10.1 Responsive testing (mobile, tablet, desktop)
- [ ] 10.2 Performance audit (Lighthouse)
- [ ] 10.3 SEO meta tags per tool page
- [ ] 10.4 Open Graph images
- [ ] 10.5 Create GitHub repo & push
- [ ] 10.6 Deploy to GitHub Pages
- [ ] 10.7 QA live URL with web_fetch
- [ ] 10.8 Post to Discord deployed channel

## Estimated Timeline
- Phases 1-2: ~30 min (setup + shared components)
- Phase 3: ~20 min (landing page)
- Phases 4-8: ~3 hours (23 tool pages, ~8 min each average)
- Phase 9: ~30 min (testing)
- Phase 10: ~20 min (polish + deploy)
- **Total: ~5 hours**
