'use client';

import { useState, useCallback } from 'react';
import { Merge, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta } from '@/lib/file-utils';
import { mergePDFs } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';

export default function MergePDFPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setStatus('processing');
    setProgress(20);

    try {
      setProgress(50);
      const result = await mergePDFs(files.map(f => f.file));
      setProgress(100);
      setStatus('done');

      // Auto-download
      downloadUint8Array(result, 'merged.pdf');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files]);

  const handleReorder = useCallback((fromIdx: number, toIdx: number) => {
    setFiles(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  return (
    <ToolLayout
      name="Merge PDF"
      description="Combine multiple PDFs into one document. Drag to reorder."
      icon={Merge}
    >
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          multiple={true}
          files={files}
          onFilesChange={setFiles}
          label="Drop PDF files here to merge"
        />

        {files.length >= 2 && (
          <p className="text-[11px] text-zinc-500">
            {files.length} files selected · Files will be merged in the order shown above
          </p>
        )}

        <ProgressBar progress={progress} status={status} label={
          status === 'processing' ? 'Merging PDFs...' :
          status === 'done' ? 'Merged successfully — downloading' :
          status === 'error' ? 'Failed to merge' : undefined
        } />

        <button
          onClick={handleMerge}
          disabled={files.length < 2 || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]"
        >
          {status === 'done' ? (
            <><Download size={15} /> Download Again</>
          ) : (
            <><Merge size={15} /> Merge {files.length} PDFs</>
          )}
        </button>

        {status === 'done' && (
          <button
            onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            Merge more files
          </button>
        )}
      </div>
    </ToolLayout>
  );
}
