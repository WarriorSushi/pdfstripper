import {
  Merge, Scissors, Minimize2, RotateCw, ArrowUpDown, Trash2,
  Image, Images, FileText, FileType, Globe,
  Lock, Unlock, EyeOff, Droplets,
  Type, ImagePlus, Hash, Pen, ClipboardList,
  Info, ImageDown, ScanText,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

export type ToolCategory = 'core' | 'convert' | 'security' | 'edit' | 'analyze';

export interface ToolDef {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  icon: LucideIcon;
  acceptTypes: string;
  multiple: boolean;
  comingSoon?: boolean;
}

export const CATEGORIES: { id: ToolCategory; label: string; description: string }[] = [
  { id: 'core', label: 'Core Tools', description: 'Essential PDF operations' },
  { id: 'convert', label: 'Convert', description: 'Transform between formats' },
  { id: 'security', label: 'Security', description: 'Protect and unlock' },
  { id: 'edit', label: 'Edit', description: 'Modify and annotate' },
  { id: 'analyze', label: 'Analyze', description: 'Inspect and extract' },
];

export const TOOLS: ToolDef[] = [
  // Core Tools
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one document',
    longDescription: 'Drag and drop multiple PDF files, reorder them, and merge into a single PDF. Supports unlimited files. All processing happens in your browser.',
    category: 'core',
    icon: Merge,
    acceptTypes: '.pdf',
    multiple: true,
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract specific pages or split into parts',
    longDescription: 'Select pages by range, extract individual pages, or split a PDF every N pages. Preview all pages before splitting.',
    category: 'core',
    icon: Scissors,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size without losing quality',
    longDescription: 'Optimize images, remove metadata, and compress streams to dramatically reduce PDF file size. Choose quality level.',
    category: 'core',
    icon: Minimize2,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'rotate-pages',
    name: 'Rotate Pages',
    description: 'Rotate individual or all pages',
    longDescription: 'Rotate PDF pages by 90°, 180°, or 270°. Apply to individual pages or the entire document at once.',
    category: 'core',
    icon: RotateCw,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'reorder-pages',
    name: 'Reorder Pages',
    description: 'Drag and drop to reorganize pages',
    longDescription: 'See thumbnail previews of every page and drag-and-drop to reorder them. Perfect for reorganizing scanned documents.',
    category: 'core',
    icon: ArrowUpDown,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'delete-pages',
    name: 'Delete Pages',
    description: 'Remove specific pages from PDF',
    longDescription: 'Preview all pages and select which ones to remove. Keep only the pages you need.',
    category: 'core',
    icon: Trash2,
    acceptTypes: '.pdf',
    multiple: false,
  },
  // Convert Tools
  {
    slug: 'pdf-to-images',
    name: 'PDF to Images',
    description: 'Export pages as PNG or JPEG',
    longDescription: 'Convert each PDF page to a high-quality PNG or JPEG image. Choose DPI (72, 150, 300) and format.',
    category: 'convert',
    icon: Image,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Combine images into a single PDF',
    longDescription: 'Upload JPG, PNG, or WebP images and combine them into a single PDF document. Auto-fit or custom page size.',
    category: 'convert',
    icon: Images,
    acceptTypes: '.jpg,.jpeg,.png,.webp,.gif,.bmp',
    multiple: true,
  },
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract all text from a PDF',
    longDescription: 'Extract readable text from PDF files. Preserves paragraph structure. Copy to clipboard or download as .txt.',
    category: 'convert',
    icon: FileText,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert DOCX files to PDF',
    longDescription: 'Convert Microsoft Word (.docx) documents to PDF format. Basic formatting preserved.',
    category: 'convert',
    icon: FileType,
    acceptTypes: '.docx',
    multiple: false,
    comingSoon: true,
  },
  {
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert web pages to PDF',
    longDescription: 'Paste HTML content or enter a URL to convert web pages into PDF documents.',
    category: 'convert',
    icon: Globe,
    acceptTypes: '.html,.htm',
    multiple: false,
    comingSoon: true,
  },
  // Security Tools
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Add password encryption to PDF',
    longDescription: 'Encrypt your PDF with a password using AES-256 encryption. Set owner and user passwords with different permission levels.',
    category: 'security',
    icon: Lock,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password from PDF',
    longDescription: 'Remove password protection from a PDF file. You must know the current password to unlock.',
    category: 'security',
    icon: Unlock,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'redact-text',
    name: 'Redact Text',
    description: 'Permanently black out sensitive text',
    longDescription: 'Draw redaction boxes over sensitive information. Redaction is permanent and irrecoverable — the underlying text is completely removed.',
    category: 'security',
    icon: EyeOff,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
  {
    slug: 'add-watermark',
    name: 'Add Watermark',
    description: 'Add text or image watermarks',
    longDescription: 'Add custom text watermarks with configurable opacity, rotation, size, color, and position. Apply to all pages or selected pages.',
    category: 'security',
    icon: Droplets,
    acceptTypes: '.pdf',
    multiple: false,
  },
  // Edit Tools
  {
    slug: 'add-text',
    name: 'Add Text',
    description: 'Overlay text on any page',
    longDescription: 'Add custom text to any position on any page. Choose font, size, color, and rotation.',
    category: 'edit',
    icon: Type,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
  {
    slug: 'add-images',
    name: 'Add Images',
    description: 'Insert images into PDF pages',
    longDescription: 'Insert images at any position on any page. Control size, position, and opacity.',
    category: 'edit',
    icon: ImagePlus,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
  {
    slug: 'add-page-numbers',
    name: 'Page Numbers',
    description: 'Add automatic page numbering',
    longDescription: 'Add page numbers to every page. Choose position (top/bottom, left/center/right), format, starting number, and font.',
    category: 'edit',
    icon: Hash,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Draw or upload your signature',
    longDescription: 'Sign PDF documents with a drawn signature, uploaded image, or typed name. Place anywhere on any page.',
    category: 'edit',
    icon: Pen,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
  {
    slug: 'fill-forms',
    name: 'Fill Forms',
    description: 'Detect and fill PDF form fields',
    longDescription: 'Automatically detect form fields in PDF documents and fill them out. Download the completed form.',
    category: 'edit',
    icon: ClipboardList,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
  // Analyze Tools
  {
    slug: 'pdf-info',
    name: 'PDF Info',
    description: 'View metadata, page count, file details',
    longDescription: 'See detailed information about a PDF: page count, file size, creation date, author, producer, fonts, and more.',
    category: 'analyze',
    icon: Info,
    acceptTypes: '.pdf',
    multiple: false,
  },
  {
    slug: 'extract-images',
    name: 'Extract Images',
    description: 'Pull all embedded images from PDF',
    longDescription: 'Find and extract every embedded image from a PDF file. Download individually or as a ZIP archive.',
    category: 'analyze',
    icon: ImageDown,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
  {
    slug: 'ocr',
    name: 'OCR Text',
    description: 'Extract text from scanned PDFs',
    longDescription: 'Use OCR (Optical Character Recognition) to extract text from scanned documents and images.',
    category: 'analyze',
    icon: ScanText,
    acceptTypes: '.pdf',
    multiple: false,
    comingSoon: true,
  },
];

export function getToolsByCategory(category: ToolCategory): ToolDef[] {
  return TOOLS.filter(t => t.category === category);
}

export function getToolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find(t => t.slug === slug);
}
