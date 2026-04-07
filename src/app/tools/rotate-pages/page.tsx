'use client';

import { useState } from 'react';
import { Download, Loader2, RotateCw } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { rotatePages } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('rotate-pages')!;

export default function RotatePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [processing, setProcessing] = useState(false);

  const handleRotate = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const result = await rotatePages(files[0], rotation);
      downloadUint8Array(result, `${files[0].name.replace('.pdf', '')}_rotated.pdf`);
    } catch (err) {
      console.error('Rotate failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".pdf"
        multiple={false}
        files={files}
        onFilesChange={setFiles}
        label="Drop a PDF to rotate"
      />

      {files.length > 0 && (
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Rotation</label>
            <div className="flex gap-2">
              {([90, 180, 270] as const).map(deg => (
                <button
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[12px] font-mono transition-colors ${
                    rotation === deg
                      ? 'border-teal-500/40 text-teal-400 bg-teal-500/5'
                      : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <RotateCw size={12} />
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRotate}
            disabled={processing}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Rotating...' : `Rotate ${rotation}°`}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
