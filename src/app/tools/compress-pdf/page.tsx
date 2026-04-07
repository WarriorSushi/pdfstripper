'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { compressPDF } from '@/lib/pdf-engine';
import { downloadUint8Array, formatFileSize } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('compress-pdf')!;

export default function CompressPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number } | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const compressed = await compressPDF(files[0]);
      const originalSize = files[0].size;
      const compressedSize = compressed.length;
      setResult({ originalSize, compressedSize });
      downloadUint8Array(compressed, `${files[0].name.replace('.pdf', '')}_compressed.pdf`);
    } catch (err) {
      console.error('Compress failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const savings = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0;

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".pdf"
        multiple={false}
        files={files}
        onFilesChange={setFiles}
        label="Drop a PDF to compress"
      />

      {files.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={handleCompress}
            disabled={processing}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Compressing...' : 'Compress PDF'}
          </button>

          {result && (
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-zinc-500">Before: {formatFileSize(result.originalSize)}</span>
              <span className="text-zinc-700">→</span>
              <span className="text-zinc-300">After: {formatFileSize(result.compressedSize)}</span>
              <span className={savings > 0 ? 'text-green-500' : 'text-amber-500'}>
                {savings > 0 ? `−${savings}%` : 'No change'}
              </span>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
