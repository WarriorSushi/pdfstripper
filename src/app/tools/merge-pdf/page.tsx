'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { mergePDFs } from '@/lib/pdf-engine';
import { downloadUint8Array, formatFileSize } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('merge-pdf')!;

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultSize, setResultSize] = useState<number | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const result = await mergePDFs(files);
      setResultSize(result.length);
      downloadUint8Array(result, 'merged.pdf');
    } catch (err) {
      console.error('Merge failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".pdf"
        multiple={true}
        files={files}
        onFilesChange={setFiles}
        maxFiles={20}
        label="Drop PDF files to merge"
      />

      {files.length >= 2 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleMerge}
            disabled={processing}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Merging...' : `Merge ${files.length} PDFs`}
          </button>
          <span className="text-[11px] text-zinc-600 font-mono">
            Total: {formatFileSize(files.reduce((s, f) => s + f.size, 0))}
          </span>
          {resultSize && (
            <span className="text-[11px] text-green-500 font-mono">
              Result: {formatFileSize(resultSize)}
            </span>
          )}
        </div>
      )}

      {files.length === 1 && (
        <p className="text-[12px] text-zinc-500">Add at least 2 PDFs to merge.</p>
      )}
    </ToolLayout>
  );
}
