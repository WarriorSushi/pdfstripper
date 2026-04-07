'use client';

import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { extractPages, getPageCount } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, generateOutputFilename } from '@/lib/file-utils';

export default function SplitPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles); setResult(null); setError(null);
    if (newFiles.length > 0) {
      const buf = await readFileAsArrayBuffer(newFiles[0]);
      const count = await getPageCount(buf);
      setPageCount(count);
      setRangeInput(`1-${count}`);
    }
  }, []);

  const parseRanges = (input: string): number[] => {
    const indices: Set<number> = new Set();
    input.split(',').forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number);
        for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) indices.add(i - 1);
      } else {
        const n = Number(trimmed);
        if (n >= 1 && n <= pageCount) indices.add(n - 1);
      }
    });
    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      const indices = parseRanges(rangeInput);
      if (indices.length === 0) throw new Error('No valid pages selected');
      const extracted = await extractPages(buffer, indices);
      setResult(extracted);
    } catch (err) {
      setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally { setProcessing(false); }
  }, [files, rangeInput, pageCount]);

  return (
    <ToolLayout slug="split-pdf">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={handleFilesChange} label="Drop a PDF to split" />
        {files.length > 0 && pageCount > 0 && !result && (
          <>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Pages to extract ({pageCount} total)</label>
              <input type="text" value={rangeInput} onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="w-full bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-[13px] font-mono text-zinc-100 focus:outline-none focus:border-teal-500/40" />
              <p className="text-[10px] text-zinc-600 mt-1">Use ranges (1-5) and individual pages (7) separated by commas</p>
            </div>
            <button onClick={handleSplit} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
              {processing ? <Loader2 size={15} className="animate-spin" /> : null}
              {processing ? 'Extracting...' : 'Extract Pages'}
            </button>
          </>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">Pages extracted</p>
              <button onClick={() => downloadBytes(result, generateOutputFilename(files[0]?.name || 'doc', 'split'))}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg px-4 py-2 text-[12px] font-medium transition-colors">
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
