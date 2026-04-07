'use client';

import { useState, useCallback } from 'react';
import { Trash2, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { deletePages } from '@/lib/pdf-engine';

export default function DeletePagesPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [pageInput, setPageInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDelete = useCallback(async () => {
    if (files.length === 0 || !pageInput.trim()) return;
    setStatus('processing');
    setProgress(40);

    try {
      const pages = pageInput.split(',').map(s => s.trim()).flatMap(part => {
        if (part.includes('-')) {
          const [a, b] = part.split('-').map(Number);
          return Array.from({ length: b - a + 1 }, (_, i) => a + i - 1);
        }
        return [Number(part) - 1];
      }).filter(p => p >= 0 && !isNaN(p));

      setProgress(70);
      const result = await deletePages(files[0].file, pages);
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, `trimmed_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files, pageInput]);

  return (
    <ToolLayout name="Delete Pages" description="Remove specific pages from a PDF." icon={Trash2}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF" />
        {files.length > 0 && (
          <div>
            <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-1.5 block">Pages to delete</label>
            <input type="text" value={pageInput} onChange={(e) => setPageInput(e.target.value)}
              placeholder="e.g. 1,3,5-8"
              className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2.5 text-[13px] font-mono text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-teal-500/40" />
            <p className="text-[10px] text-zinc-600 mt-1.5">These pages will be permanently removed from the output.</p>
          </div>
        )}
        <ProgressBar progress={progress} status={status} label={status === 'processing' ? 'Removing pages...' : status === 'done' ? 'Done — downloading' : undefined} />
        <button onClick={handleDelete} disabled={files.length === 0 || !pageInput.trim() || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]">
          {status === 'done' ? <><Download size={15} /> Download</> : <><Trash2 size={15} /> Delete Pages</>}
        </button>
        {status === 'done' && (
          <button onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); setPageInput(''); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Process another file</button>
        )}
      </div>
    </ToolLayout>
  );
}
