'use client';

import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { compressPDF } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, formatFileSize, generateOutputFilename } from '@/lib/file-utils';

export default function CompressPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ data: Uint8Array; originalSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setProgress(0); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      setProgress(30);
      const compressed = await compressPDF(buffer);
      setProgress(100);
      setResult({ data: compressed, originalSize: buffer.byteLength });
    } catch (err) {
      setError(`Failed to compress: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally { setProcessing(false); }
  }, [files]);

  const savings = result ? Math.round((1 - result.data.byteLength / result.originalSize) * 100) : 0;

  return (
    <ToolLayout slug="compress-pdf">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to compress" />
        {files.length > 0 && !result && (
          <button onClick={handleCompress} disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
            {processing ? <Loader2 size={15} className="animate-spin" /> : null}
            {processing ? 'Compressing...' : 'Compress PDF'}
          </button>
        )}
        {processing && <ProgressBar progress={progress} label="Compressing" />}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-green-400">Compressed — {savings}% smaller</p>
                <p className="text-[10px] font-mono text-zinc-500">{formatFileSize(result.originalSize)} → {formatFileSize(result.data.byteLength)}</p>
              </div>
              <button onClick={() => downloadBytes(result.data, generateOutputFilename(files[0]?.name || 'doc', 'compressed'))}
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
