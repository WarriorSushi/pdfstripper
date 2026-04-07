'use client';

import { useState, useCallback } from 'react';
import { Droplets, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { addWatermark } from '@/lib/pdf-engine';

export default function AddWatermarkPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [text, setText] = useState('DRAFT');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(15);
  const [rotation, setRotation] = useState(-45);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleApply = useCallback(async () => {
    if (files.length === 0 || !text.trim()) return;
    setStatus('processing');
    setProgress(40);
    try {
      const result = await addWatermark(files[0].file, text, {
        fontSize, opacity: opacity / 100, rotation,
      });
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, `watermarked_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files, text, fontSize, opacity, rotation]);

  return (
    <ToolLayout name="Add Watermark" description="Add a text watermark to every page of your PDF." icon={Droplets}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF" />

        {files.length > 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-1.5 block">Watermark text</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2.5 text-[13px] text-zinc-100 focus:outline-none focus:border-teal-500/40"
                placeholder="CONFIDENTIAL" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-zinc-600 font-mono mb-1 block">Size</label>
                <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-transparent border border-[#27272a] rounded-lg px-2.5 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-teal-500/40" min={8} max={200} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-600 font-mono mb-1 block">Opacity %</label>
                <input type="number" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full bg-transparent border border-[#27272a] rounded-lg px-2.5 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-teal-500/40" min={1} max={100} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-600 font-mono mb-1 block">Rotation °</label>
                <input type="number" value={rotation} onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full bg-transparent border border-[#27272a] rounded-lg px-2.5 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-teal-500/40" min={-180} max={180} />
              </div>
            </div>
          </div>
        )}

        <ProgressBar progress={progress} status={status} label={status === 'processing' ? 'Adding watermark...' : status === 'done' ? 'Done — downloading' : undefined} />
        <button onClick={handleApply} disabled={files.length === 0 || !text.trim() || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]">
          {status === 'done' ? <><Download size={15} /> Download</> : <><Droplets size={15} /> Add Watermark</>}
        </button>
        {status === 'done' && (
          <button onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Process another file</button>
        )}
      </div>
    </ToolLayout>
  );
}
