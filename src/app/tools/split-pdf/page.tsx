'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { extractPages, getPageCount } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('split-pdf')!;

export default function SplitPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFilesChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const count = await getPageCount(newFiles[0]);
      setPageCount(count);
      setRangeInput(`1-${count}`);
    } else {
      setPageCount(0);
    }
  };

  const parseRanges = (input: string): number[] => {
    const pages: Set<number> = new Set();
    input.split(',').forEach(part => {
      part = part.trim();
      const rangeMatch = part.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        for (let i = start; i <= Math.min(end, pageCount); i++) pages.add(i - 1);
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= pageCount) pages.add(num - 1);
      }
    });
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    const indices = parseRanges(rangeInput);
    if (indices.length === 0) return;
    setProcessing(true);
    try {
      const result = await extractPages(files[0], indices);
      downloadUint8Array(result, `${files[0].name.replace('.pdf', '')}_split.pdf`);
    } catch (err) {
      console.error('Split failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".pdf"
        multiple={false}
        files={files}
        onFilesChange={handleFilesChange}
        label="Drop a PDF to split"
      />

      {pageCount > 0 && (
        <div className="space-y-3">
          <div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <label className="text-[11px] text-zinc-500 font-mono">Pages to extract</label>
              <span className="text-[10px] text-zinc-700 font-mono">{pageCount} pages total</span>
            </div>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g., 1-3, 5, 7-10"
              className="w-full max-w-sm bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[13px] font-mono text-zinc-100 focus:outline-none focus:border-teal-500/40"
            />
            <p className="text-[10px] text-zinc-700 mt-1">Use ranges (1-5) or individual pages (1, 3, 7) separated by commas</p>
          </div>

          <button
            onClick={handleSplit}
            disabled={processing || parseRanges(rangeInput).length === 0}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Extracting...' : `Extract ${parseRanges(rangeInput).length} pages`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
