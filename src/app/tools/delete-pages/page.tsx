'use client';
import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { deletePages, getPageCount } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, generateOutputFilename } from '@/lib/file-utils';

export default function DeletePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles); setResult(null); setError(null); setSelected(new Set());
    if (newFiles.length > 0) {
      const buf = await readFileAsArrayBuffer(newFiles[0]);
      setPageCount(await getPageCount(buf));
    }
  }, []);

  const togglePage = (i: number) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const handleDelete = useCallback(async () => {
    if (files.length === 0 || selected.size === 0) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      const result = await deletePages(buffer, Array.from(selected));
      setResult(result);
    } catch (err) { setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setProcessing(false); }
  }, [files, selected]);

  return (
    <ToolLayout slug="delete-pages">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={handleFilesChange} label="Drop a PDF to remove pages from" />
        {files.length > 0 && pageCount > 0 && !result && (
          <>
            <div>
              <p className="text-[11px] text-zinc-500 font-mono mb-2">Select pages to delete ({selected.size} of {pageCount} selected)</p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button key={i} onClick={() => togglePage(i)}
                    className={`w-9 h-9 rounded-lg text-[11px] font-mono transition-colors ${
                      selected.has(i) ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800'
                    }`}>{i + 1}</button>
                ))}
              </div>
            </div>
            {selected.size > 0 && selected.size < pageCount && (
              <button onClick={handleDelete} disabled={processing}
                className="w-full flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-500 disabled:opacity-50 text-white font-display font-medium rounded-lg py-3 text-[13px] transition-all">
                {processing ? <Loader2 size={15} className="animate-spin" /> : null}
                {processing ? 'Deleting...' : `Delete ${selected.size} page${selected.size > 1 ? 's' : ''}`}
              </button>
            )}
            {selected.size === pageCount && <p className="text-[11px] text-amber-400 text-center">Cannot delete all pages</p>}
          </>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">Pages deleted</p>
              <button onClick={() => downloadBytes(result, generateOutputFilename(files[0]?.name || 'doc', 'trimmed'))}
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
