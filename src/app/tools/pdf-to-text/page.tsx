'use client';

import { useState } from 'react';
import { Download, Loader2, Copy, Check } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { readFileAsArrayBuffer } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('pdf-to-text')!;

export default function PDFToTextPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      // Using pdfjs-dist for text extraction
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      const bytes = await readFileAsArrayBuffer(files[0]);
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      let fullText = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      setText(fullText);
    } catch (err) {
      console.error('Text extraction failed:', err);
      setText('Error: Could not extract text. The PDF may be image-based (use OCR instead).');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${files[0]?.name.replace('.pdf', '')}_text.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to extract text" />

      {files.length > 0 && !text && (
        <button
          onClick={handleExtract}
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {loading ? 'Extracting text...' : 'Extract Text'}
        </button>
      )}

      {text && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy all'}
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors">
              <Download size={12} /> Download .txt
            </button>
            <span className="text-[10px] text-zinc-600 font-mono">{text.length.toLocaleString()} chars</span>
          </div>
          <pre className="bg-[#111113] border border-[#1e1e21] rounded-lg p-4 text-[11px] font-mono text-zinc-300 max-h-[400px] overflow-auto whitespace-pre-wrap leading-relaxed">
            {text}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
