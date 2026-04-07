'use client';

import { useState, useCallback } from 'react';
import { Scissors, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { extractPages } from '@/lib/pdf-engine';

export default function SplitPDFPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [pageInput, setPageInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSplit = useCallback(async () => {
    if (files.length === 0 || !pageInput.trim()) return;
    setStatus('processing');
    setProgress(30);
    setError('');

    try {
      // Parse page input: "1,3,5-8" → [0,2,4,5,6,7]
      const pages: number[] = [];
      const parts = pageInput.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const [a, b] = part.split('-').map(Number);
          for (let i = a; i <= b; i++) pages.push(i - 1); // 0-indexed
        } else {
          pages.push(Number(part) - 1);
        }
      }

      const validPages = pages.filter(p => p >= 0 && !isNaN(p));
      if (validPages.length === 0) {
        setError('No valid pages specified');
        setStatus('error');
        return;
      }

      setProgress(60);
      const result = await extractPages(files[0].file, validPages);
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, `split_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setError('Failed to split PDF');
      setStatus('error');
    }
  }, [files, pageInput]);

  return (
    <ToolLayout
      name="Split PDF"
      description="Extract specific pages from a PDF. Enter page numbers or ranges."
      icon={Scissors}
    >
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          multiple={false}
          files={files}
          onFilesChange={setFiles}
          label="Drop a PDF to split"
        />

        {files.length > 0 && (
          <div>
            <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-1.5 block">
              Pages to extract
            </label>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="e.g. 1,3,5-8,12"
              className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2.5 text-[13px] font-mono text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-teal-500/40"
            />
            <p className="text-[10px] text-zinc-600 mt-1.5">
              Use commas for individual pages, hyphens for ranges. Page 1 is the first page.
            </p>
          </div>
        )}

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <ProgressBar progress={progress} status={status} label={
          status === 'processing' ? 'Extracting pages...' :
          status === 'done' ? 'Extracted — downloading' :
          status === 'error' ? 'Split failed' : undefined
        } />

        <button
          onClick={handleSplit}
          disabled={files.length === 0 || !pageInput.trim() || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]"
        >
          {status === 'done' ? (
            <><Download size={15} /> Download Again</>
          ) : (
            <><Scissors size={15} /> Extract Pages</>
          )}
        </button>

        {status === 'done' && (
          <button
            onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); setPageInput(''); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            Split another file
          </button>
        )}
      </div>
    </ToolLayout>
  );
}
