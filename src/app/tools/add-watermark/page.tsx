'use client';
import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { addWatermark } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, generateOutputFilename } from '@/lib/file-utils';

export default function AddWatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('DRAFT');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(15);
  const [rotation, setRotation] = useState(-45);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApply = useCallback(async () => {
    if (files.length === 0 || !text.trim()) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      setResult(await addWatermark(buffer, text, { fontSize, opacity: opacity / 100, rotation }));
    } catch (err) { setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setProcessing(false); }
  }, [files, text, fontSize, opacity, rotation]);

  return (
    <ToolLayout slug="add-watermark">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={(f) => { setFiles(f); setResult(null); }} label="Drop a PDF to watermark" />
        {files.length > 0 && !result && (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-500 font-mono mb-1 block">Watermark Text</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                  className="w-full bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-teal-500/40" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 font-mono mb-1 block">Font Size: {fontSize}px</label>
                <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 font-mono mb-1 block">Opacity: {opacity}%</label>
                <input type="range" min={5} max={80} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 font-mono mb-1 block">Rotation: {rotation}°</label>
                <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <button onClick={handleApply} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
              {processing ? <Loader2 size={15} className="animate-spin" /> : null}
              {processing ? 'Applying...' : 'Add Watermark'}
            </button>
          </>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">Watermark applied</p>
              <button onClick={() => downloadBytes(result, generateOutputFilename(files[0]?.name || 'doc', 'watermarked'))}
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
