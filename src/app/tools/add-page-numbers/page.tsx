'use client';
import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { addPageNumbers } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, generateOutputFilename } from '@/lib/file-utils';

type Pos = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
type Fmt = 'number' | 'page-of' | 'dash';

export default function AddPageNumbersPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<Pos>('bottom-center');
  const [format, setFormat] = useState<Fmt>('number');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApply = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      setResult(await addPageNumbers(buffer, { position, format }));
    } catch (err) { setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`); }
    finally { setProcessing(false); }
  }, [files, position, format]);

  const positions: { value: Pos; label: string }[] = [
    { value: 'bottom-center', label: 'Bottom Center' }, { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' }, { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' }, { value: 'top-left', label: 'Top Left' },
  ];
  const formats: { value: Fmt; label: string; example: string }[] = [
    { value: 'number', label: 'Number', example: '1, 2, 3...' },
    { value: 'page-of', label: 'Page X of Y', example: 'Page 1 of 10' },
    { value: 'dash', label: 'Dash', example: '— 1 —' },
  ];

  return (
    <ToolLayout slug="add-page-numbers">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={(f) => { setFiles(f); setResult(null); }} label="Drop a PDF to add page numbers" />
        {files.length > 0 && !result && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Position</label>
                <div className="grid grid-cols-3 gap-1">
                  {positions.map(p => (
                    <button key={p.value} onClick={() => setPosition(p.value)}
                      className={`px-2 py-1.5 rounded text-[10px] font-mono transition-colors ${
                        position === p.value ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800'
                      }`}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Format</label>
                <div className="space-y-1">
                  {formats.map(f => (
                    <button key={f.value} onClick={() => setFormat(f.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] transition-colors ${
                        format === f.value ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-zinc-800/30 text-zinc-400 border border-zinc-800/50'
                      }`}>
                      <span className="font-medium">{f.label}</span>
                      <span className="text-zinc-600 ml-2 font-mono">{f.example}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleApply} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
              {processing ? <Loader2 size={15} className="animate-spin" /> : null}
              {processing ? 'Adding...' : 'Add Page Numbers'}
            </button>
          </>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">Page numbers added</p>
              <button onClick={() => downloadBytes(result, generateOutputFilename(files[0]?.name || 'doc', 'numbered'))}
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
