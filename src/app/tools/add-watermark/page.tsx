'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { addWatermark } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('add-watermark')!;

export default function AddWatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('DRAFT');
  const [opacity, setOpacity] = useState(15);
  const [fontSize, setFontSize] = useState(50);
  const [rotation, setRotation] = useState(-45);
  const [processing, setProcessing] = useState(false);

  const handleWatermark = async () => {
    if (files.length === 0 || !text.trim()) return;
    setProcessing(true);
    try {
      const result = await addWatermark(files[0], text, {
        opacity: opacity / 100,
        fontSize,
        rotation,
      });
      downloadUint8Array(result, `${files[0].name.replace('.pdf', '')}_watermarked.pdf`);
    } catch (err) {
      console.error('Watermark failed:', err);
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
        label="Drop a PDF to watermark"
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Watermark text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-teal-500/40"
                placeholder="CONFIDENTIAL"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Font size</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={10} max={200}
                className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[13px] font-mono text-zinc-100 focus:outline-none focus:border-teal-500/40"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Opacity ({opacity}%)</label>
              <input
                type="range" min={5} max={80} value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Rotation ({rotation}°)</label>
              <input
                type="range" min={-90} max={90} value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleWatermark}
            disabled={processing || !text.trim()}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Adding watermark...' : 'Add Watermark'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
