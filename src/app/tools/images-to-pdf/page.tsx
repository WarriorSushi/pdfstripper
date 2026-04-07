'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { imagesToPDF } from '@/lib/pdf-engine';
import { downloadUint8Array, formatFileSize } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('images-to-pdf')!;

export default function ImagesToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const result = await imagesToPDF(files);
      downloadUint8Array(result, 'images_combined.pdf');
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".jpg,.jpeg,.png,.webp,.gif,.bmp"
        multiple={true}
        files={files}
        onFilesChange={setFiles}
        maxFiles={50}
        label="Drop images to combine into PDF"
      />

      {files.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleConvert}
            disabled={processing}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Converting...' : `Convert ${files.length} images to PDF`}
          </button>
          <span className="text-[11px] text-zinc-600 font-mono">
            {formatFileSize(files.reduce((s, f) => s + f.size, 0))}
          </span>
        </div>
      )}
    </ToolLayout>
  );
}
