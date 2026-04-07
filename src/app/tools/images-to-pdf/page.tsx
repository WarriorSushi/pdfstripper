'use client';

import { useState, useCallback } from 'react';
import { Images, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { imagesToPDF } from '@/lib/pdf-engine';

export default function ImagesToPDFPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(30);
    try {
      setProgress(60);
      const result = await imagesToPDF(files.map(f => f.file));
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, 'images_combined.pdf');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files]);

  return (
    <ToolLayout name="Images to PDF" description="Combine multiple images into a single PDF document." icon={Images}>
      <div className="space-y-5">
        <FileDropZone
          accept=".jpg,.jpeg,.png,.webp"
          multiple={true}
          files={files}
          onFilesChange={setFiles}
          label="Drop images to combine into PDF"
        />
        {files.length > 0 && (
          <p className="text-[11px] text-zinc-500">{files.length} images · JPG and PNG supported · images will appear in order shown</p>
        )}
        <ProgressBar progress={progress} status={status} label={status === 'processing' ? 'Converting...' : status === 'done' ? 'Done — downloading' : undefined} />
        <button onClick={handleConvert} disabled={files.length === 0 || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]">
          {status === 'done' ? <><Download size={15} /> Download PDF</> : <><Images size={15} /> Create PDF from {files.length || 0} Images</>}
        </button>
        {status === 'done' && (
          <button onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Convert more images</button>
        )}
      </div>
    </ToolLayout>
  );
}
