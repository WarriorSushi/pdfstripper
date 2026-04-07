'use client';
import { useState, useCallback } from 'react';
import { Download, Loader2, ArrowUpDown } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { reorderPages, getPageCount } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, generateOutputFilename } from '@/lib/file-utils';

export default function ReorderPagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles); setResult(null); setError(null);
    if (newFiles.length > 0) {
      const buf = await readFileAsArrayBuffer(newFiles[0]);
      const count = await getPageCount(buf);
      setPageCount(count);
      setOrder(Array.from({ length: count }, (_, i) => i));
    }
  }, []);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
  };
  const moveDown = (idx: number) => {
    if (idx >= order.length - 1) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setOrder(next);
  };

  const handleReorder = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      setResult(await reorderPages(buffer, order));
    } catch (err) { setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setProcessing(false); }
  }, [files, order]);

  return (
    <ToolLayout slug="reorder-pages">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={handleFilesChange} label="Drop a PDF to reorder" />
        {files.length > 0 && pageCount > 0 && !result && (
          <>
            <div className="space-y-1">
              {order.map((pageIdx, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#111113] border border-zinc-800/50 rounded-lg px-3 py-2">
                  <span className="text-[11px] font-mono text-zinc-500 w-6">{i + 1}.</span>
                  <span className="text-[12px] text-zinc-300 flex-1">Page {pageIdx + 1}</span>
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30">↑</button>
                  <button onClick={() => moveDown(i)} disabled={i === order.length - 1} className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30">↓</button>
                </div>
              ))}
            </div>
            <button onClick={handleReorder} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
              {processing ? <Loader2 size={15} className="animate-spin" /> : <ArrowUpDown size={15} />}
              {processing ? 'Reordering...' : 'Apply New Order'}
            </button>
          </>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">Pages reordered</p>
              <button onClick={() => downloadBytes(result, generateOutputFilename(files[0]?.name || 'doc', 'reordered'))}
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
