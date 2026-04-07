'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { addPageNumbers } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('add-page-numbers')!;

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';

export default function AddPageNumbersPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [startFrom, setStartFrom] = useState(1);
  const [format, setFormat] = useState('{n}');
  const [processing, setProcessing] = useState(false);

  const handleAddNumbers = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const result = await addPageNumbers(files[0], { position, startFrom, format });
      downloadUint8Array(result, `${files[0].name.replace('.pdf', '')}_numbered.pdf`);
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const positions: { value: Position; label: string }[] = [
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
  ];

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".pdf"
        multiple={false}
        files={files}
        onFilesChange={setFiles}
        label="Drop a PDF to add page numbers"
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full bg-[#111113] border border-[#27272a] rounded-lg px-3 py-2 text-[12px] text-zinc-100 focus:outline-none focus:border-teal-500/40"
              >
                {positions.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Start from</label>
              <input
                type="number" min={1} value={startFrom}
                onChange={(e) => setStartFrom(Number(e.target.value))}
                className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[13px] font-mono text-zinc-100 focus:outline-none focus:border-teal-500/40"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#111113] border border-[#27272a] rounded-lg px-3 py-2 text-[12px] text-zinc-100 focus:outline-none focus:border-teal-500/40"
              >
                <option value="{n}">{'{n}'} — 1, 2, 3</option>
                <option value="Page {n}">Page {'{n}'} — Page 1</option>
                <option value="Page {n} of {total}">Page {'{n}'} of {'{total}'}</option>
                <option value="- {n} -">- {'{n}'} -</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAddNumbers}
            disabled={processing}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Adding...' : 'Add Page Numbers'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
