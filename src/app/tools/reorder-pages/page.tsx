'use client';

import { useState, useCallback } from 'react';
import { ArrowUpDown, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { reorderPages } from '@/lib/pdf-engine';

export default function ReorderPagesPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [orderInput, setOrderInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleReorder = useCallback(async () => {
    if (files.length === 0 || !orderInput.trim()) return;
    setStatus('processing');
    setProgress(40);
    try {
      const order = orderInput.split(',').map(s => Number(s.trim()) - 1).filter(n => n >= 0 && !isNaN(n));
      setProgress(70);
      const result = await reorderPages(files[0].file, order);
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, `reordered_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files, orderInput]);

  return (
    <ToolLayout name="Reorder Pages" description="Specify a new page order by listing page numbers." icon={ArrowUpDown}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to reorder" />
        {files.length > 0 && (
          <div>
            <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-1.5 block">New page order</label>
            <input type="text" value={orderInput} onChange={(e) => setOrderInput(e.target.value)}
              placeholder="e.g. 3,1,2,5,4" className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2.5 text-[13px] font-mono text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-teal-500/40" />
            <p className="text-[10px] text-zinc-600 mt-1.5">List all page numbers in the desired order, separated by commas.</p>
          </div>
        )}
        <ProgressBar progress={progress} status={status} label={status === 'processing' ? 'Reordering...' : status === 'done' ? 'Done — downloading' : undefined} />
        <button onClick={handleReorder} disabled={files.length === 0 || !orderInput.trim() || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]">
          {status === 'done' ? <><Download size={15} /> Download</> : <><ArrowUpDown size={15} /> Reorder Pages</>}
        </button>
        {status === 'done' && (
          <button onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); setOrderInput(''); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Process another file</button>
        )}
      </div>
    </ToolLayout>
  );
}
