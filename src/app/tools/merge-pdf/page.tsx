'use client';

import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { mergePDFs } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, formatFileSize, generateOutputFilename } from '@/lib/file-utils';

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const buffers: ArrayBuffer[] = [];
      for (let i = 0; i < files.length; i++) {
        buffers.push(await readFileAsArrayBuffer(files[i]));
        setProgress(((i + 1) / files.length) * 50);
      }
      setProgress(60);
      const merged = await mergePDFs(buffers);
      setProgress(100);
      setResult(merged);
    } catch (err) {
      setError(`Failed to merge: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadBytes(result, generateOutputFilename(files[0]?.name || 'document', 'merged'));
  }, [result, files]);

  return (
    <ToolLayout slug="merge-pdf">
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          multiple
          files={files}
          onFilesChange={setFiles}
          maxFiles={20}
          label="Drop PDF files to merge"
        />

        {files.length >= 2 && !result && (
          <button
            onClick={handleMerge}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all"
          >
            {processing ? <Loader2 size={15} className="animate-spin" /> : null}
            {processing ? 'Merging...' : `Merge ${files.length} PDFs`}
          </button>
        )}

        {files.length === 1 && (
          <p className="text-[11px] text-zinc-600 text-center">Add at least 2 PDFs to merge</p>
        )}

        {processing && <ProgressBar progress={progress} label="Merging PDFs" />}

        {error && (
          <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-green-400">Merge complete</p>
                <p className="text-[10px] font-mono text-zinc-500">{formatFileSize(result.byteLength)}</p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg px-4 py-2 text-[12px] font-medium transition-colors"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
