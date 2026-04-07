// PDF processing engine — wraps pdf-lib for all operations
import { PDFDocument, degrees, rgb, StandardFonts, type PDFPage } from 'pdf-lib';
import { readFileAsArrayBuffer } from './file-utils';

// ─── Merge ─────────────────────────────────────────────────

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileAsArrayBuffer(file);
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(page => merged.addPage(page));
  }
  return merged.save();
}

// ─── Split ─────────────────────────────────────────────────

export async function splitPDF(file: File, ranges: [number, number][]): Promise<Uint8Array[]> {
  const bytes = await readFileAsArrayBuffer(file);
  const source = await PDFDocument.load(bytes);
  const results: Uint8Array[] = [];

  for (const [start, end] of ranges) {
    const doc = await PDFDocument.create();
    const indices = [];
    for (let i = start; i <= Math.min(end, source.getPageCount() - 1); i++) {
      indices.push(i);
    }
    const pages = await doc.copyPages(source, indices);
    pages.forEach(p => doc.addPage(p));
    results.push(await doc.save());
  }
  return results;
}

export async function extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const source = await PDFDocument.load(bytes);
  const doc = await PDFDocument.create();
  const indices = pageNumbers.filter(n => n >= 0 && n < source.getPageCount());
  const pages = await doc.copyPages(source, indices);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

// ─── Delete Pages ──────────────────────────────────────────

export async function deletePages(file: File, pagesToDelete: number[]): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const source = await PDFDocument.load(bytes);
  const allPages = source.getPageIndices();
  const keep = allPages.filter(i => !pagesToDelete.includes(i));
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(source, keep);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

// ─── Rotate ────────────────────────────────────────────────

export async function rotatePages(
  file: File,
  rotation: 90 | 180 | 270,
  pageIndices?: number[] // undefined = all pages
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  const targets = pageIndices || pages.map((_, i) => i);

  for (const idx of targets) {
    if (idx < pages.length) {
      const page = pages[idx];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotation) % 360));
    }
  }
  return doc.save();
}

// ─── Reorder ───────────────────────────────────────────────

export async function reorderPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const source = await PDFDocument.load(bytes);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(source, newOrder);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

// ─── Compress ──────────────────────────────────────────────
// Basic compression: remove metadata, flatten, re-save
// True image compression requires pdfjs rendering — this is structural optimization

export async function compressPDF(file: File): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);

  // Remove metadata to reduce size
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('PDFStripper');
  doc.setCreator('PDFStripper');

  return doc.save({
    useObjectStreams: true,    // compress object streams
    addDefaultPage: false,
    objectsPerTick: 100,
  });
}

// ─── Protect ───────────────────────────────────────────────

export async function protectPDF(file: File, password: string): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  // pdf-lib doesn't support encryption natively — we flag this as coming soon
  // For now, re-save (placeholder)
  return doc.save();
}

// ─── Watermark ─────────────────────────────────────────────

export async function addWatermark(
  file: File,
  text: string,
  options: {
    fontSize?: number;
    opacity?: number;
    rotation?: number;
    color?: { r: number; g: number; b: number };
  } = {}
): Promise<Uint8Array> {
  const { fontSize = 48, opacity = 0.15, rotation = -45, color = { r: 0.5, g: 0.5, b: 0.5 } } = options;
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    });
  }
  return doc.save();
}

// ─── Page Numbers ──────────────────────────────────────────

export async function addPageNumbers(
  file: File,
  options: {
    position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
    startFrom?: number;
    fontSize?: number;
    format?: 'number' | 'of-total' | 'dash';
  } = {}
): Promise<Uint8Array> {
  const { position = 'bottom-center', startFrom = 1, fontSize = 10, format = 'number' } = options;
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  pages.forEach((page, idx) => {
    const num = idx + startFrom;
    let text = `${num}`;
    if (format === 'of-total') text = `${num} of ${total + startFrom - 1}`;
    if (format === 'dash') text = `— ${num} —`;

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const { width, height } = page.getSize();
    const margin = 30;

    let x = margin;
    let y = margin;

    if (position.includes('center')) x = (width - textWidth) / 2;
    if (position.includes('right')) x = width - textWidth - margin;
    if (position.includes('top')) y = height - margin - fontSize;

    page.drawText(text, {
      x, y,
      size: fontSize,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  });

  return doc.save();
}

// ─── PDF Info ──────────────────────────────────────────────

export interface PDFInfo {
  pageCount: number;
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  creator: string | undefined;
  producer: string | undefined;
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
  pageSize: { width: number; height: number } | undefined;
  fileSize: number;
}

export async function getPDFInfo(file: File): Promise<PDFInfo> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  const firstPage = pages[0];

  return {
    pageCount: doc.getPageCount(),
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    creator: doc.getCreator(),
    producer: doc.getProducer(),
    creationDate: doc.getCreationDate(),
    modificationDate: doc.getModificationDate(),
    pageSize: firstPage ? { width: Math.round(firstPage.getWidth()), height: Math.round(firstPage.getHeight()) } : undefined,
    fileSize: file.size,
  };
}

// ─── Images to PDF ─────────────────────────────────────────

export async function imagesToPDF(files: File[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await readFileAsArrayBuffer(file);
    let image;

    if (file.type === 'image/png') {
      image = await doc.embedPng(bytes);
    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await doc.embedJpg(bytes);
    } else {
      // Skip unsupported formats
      continue;
    }

    const { width, height } = image.scale(1);
    // Fit to A4 (595 x 842) while maintaining aspect ratio
    const maxW = 595;
    const maxH = 842;
    const scale = Math.min(maxW / width, maxH / height, 1);
    const scaledW = width * scale;
    const scaledH = height * scale;

    const page = doc.addPage([scaledW, scaledH]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: scaledW,
      height: scaledH,
    });
  }

  return doc.save();
}
