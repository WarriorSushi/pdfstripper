'use client';
import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { imagesToPDF } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes } from '@/lib/file-utils';

export default function ImagesToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const images = await Promise.all(files.map(async (f) => ({
        data: await readFileAsArrayBuffer(f),
        type: f.type || 'image/jpeg',
      })));
      setResult(await imagesToPDF(images));
    } catch (err) { setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setProcessing(false); }
  }, [files]);

  return (
    <ToolLayout slug="images-to-pdf">
      <div className="space-y-5">
        <FileDropZone accept=".jpg,.jpeg,.png,.webp,.gif,.bmp" multiple files={files} onFilesChange={(f) => { setFiles(f); setResult(null); }} label="Drop images to combine into PDF" maxFiles={50} />
        {files.length > 0 && !result && (
          <button onClick={handleConvert} disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
            {processing ? <Loader2 size={15} className="animate-spin" /> : null}
            {processing ? 'Converting...' : `Convert ${files.length} image${files.length > 1 ? 's' : ''} to PDF`}
          </button>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">PDF created from {files.length} images</p>
              <button onClick={() => downloadBytes(result, 'images-combined.pdf')}
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
