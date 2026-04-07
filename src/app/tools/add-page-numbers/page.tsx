'use client';

import { useState, useCallback } from 'react';
import { Hash, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { addPageNumbers } from '@/lib/pdf-engine';

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
type Format = 'number' | 'of-total' | 'dash';

export default function AddPageNumbersPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [format, setFormat] = useState<Format>('number');
  const [startFrom, setStartFrom] = useState(1);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleApply = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(40);
    try {
      const result = await addPageNumbers(files[0].file, { position, format, startFrom });
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, `numbered_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files, position, format, startFrom]);

  const POSITIONS: { value: Position; label: string }[] = [
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
  ];

  const FORMATS: { value: Format; label: string; example: string }[] = [
    { value: 'number', label: 'Simple', example: '1, 2, 3' },
    { value: 'of-total', label: 'Of Total', example: '1 of 10' },
    { value: 'dash', label: 'Dashed', example: '— 1 —' },
  ];

  return (
    <ToolLayout name="Page Numbers" description="Add automatic page numbering to every page." icon={Hash}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF" />

        {files.length > 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">Position</label>
              <div className="grid grid-cols-3 gap-1.5">
                {POSITIONS.map(p => (
                  <button key={p.value} onClick={() => setPosition(p.value)}
                    className={`py-2 rounded-lg text-[11px] font-mono transition-colors border ${
                      position === p.value ? 'border-teal-500/40 bg-teal-500/10 text-teal-400' : 'border-[#27272a] text-zinc-500 hover:border-zinc-600'
                    }`}>{p.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">Format</label>
              <div className="grid grid-cols-3 gap-1.5">
                {FORMATS.map(f => (
                  <button key={f.value} onClick={() => setFormat(f.value)}
                    className={`py-2 rounded-lg text-[11px] font-mono transition-colors border ${
                      format === f.value ? 'border-teal-500/40 bg-teal-500/10 text-teal-400' : 'border-[#27272a] text-zinc-500 hover:border-zinc-600'
                    }`}>
                    <div>{f.label}</div>
                    <div className="text-[9px] text-zinc-600 mt-0.5">{f.example}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-600 font-mono mb-1 block">Start from</label>
              <input type="number" value={startFrom} onChange={(e) => setStartFrom(Number(e.target.value))} min={1}
                className="w-24 bg-transparent border border-[#27272a] rounded-lg px-2.5 py-2 text-[12px] font-mono text-zinc-200 focus:outline-none focus:border-teal-500/40" />
            </div>
          </div>
        )}

        <ProgressBar progress={progress} status={status} label={status === 'processing' ? 'Adding numbers...' : status === 'done' ? 'Done — downloading' : undefined} />
        <button onClick={handleApply} disabled={files.length === 0 || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]">
          {status === 'done' ? <><Download size={15} /> Download</> : <><Hash size={15} /> Add Page Numbers</>}
        </button>
        {status === 'done' && (
          <button onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Process another file</button>
        )}
      </div>
    </ToolLayout>
  );
}
