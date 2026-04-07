'use client';

import { useState, useCallback } from 'react';
import { Minimize2, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, formatFileSize, downloadUint8Array } from '@/lib/file-utils';
import { compressPDF } from '@/lib/pdf-engine';

export default function CompressPDFPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ data: Uint8Array; originalSize: number; newSize: number } | null>(null);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(30);

    try {
      const originalSize = files[0].size;
      setProgress(60);
      const data = await compressPDF(files[0].file);
      setProgress(100);
      setResult({ data, originalSize, newSize: data.length });
      setStatus('done');
      downloadUint8Array(data, `compressed_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files]);

  const savings = result ? Math.max(0, Math.round((1 - result.newSize / result.originalSize) * 100)) : 0;

  return (
    <ToolLayout
      name="Compress PDF"
      description="Reduce file size by optimizing streams and removing metadata."
      icon={Minimize2}
    >
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          multiple={false}
          files={files}
          onFilesChange={setFiles}
          label="Drop a PDF to compress"
        />

        <ProgressBar progress={progress} status={status} label={
          status === 'processing' ? 'Compressing...' :
          status === 'done' ? 'Compressed — downloading' :
          status === 'error' ? 'Compression failed' : undefined
        } />

        {result && status === 'done' && (
          <div className="flex items-center gap-4 p-3 bg-[#111113] border border-[#1e1e21] rounded-lg">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[12px] font-mono text-zinc-400">{formatFileSize(result.originalSize)}</span>
                <span className="text-[11px] text-zinc-600">→</span>
                <span className="text-[12px] font-mono text-zinc-100">{formatFileSize(result.newSize)}</span>
              </div>
            </div>
            <span className={`text-[12px] font-mono font-semibold ${savings > 0 ? 'text-green-400' : 'text-zinc-400'}`}>
              {savings > 0 ? `-${savings}%` : 'No reduction'}
            </span>
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={files.length === 0 || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]"
        >
          {status === 'done' ? (
            <><Download size={15} /> Download Again</>
          ) : (
            <><Minimize2 size={15} /> Compress PDF</>
          )}
        </button>

        {status === 'done' && (
          <button
            onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); setResult(null); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            Compress another file
          </button>
        )}
      </div>
    </ToolLayout>
  );
}
