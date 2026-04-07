'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { deletePages, getPageCount } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('delete-pages')!;

export default function DeletePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);

  const handleFilesChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const count = await getPageCount(newFiles[0]);
      setPageCount(count);
      setSelected(new Set());
    } else {
      setPageCount(0);
    }
  };

  const togglePage = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  const handleDelete = async () => {
    if (files.length === 0 || selected.size === 0) return;
    setProcessing(true);
    try {
      const result = await deletePages(files[0], Array.from(selected));
      downloadUint8Array(result, `${files[0].name.replace('.pdf', '')}_trimmed.pdf`);
    } catch (err) {
      console.error('Delete failed:', err);
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
        onFilesChange={handleFilesChange}
        label="Drop a PDF to remove pages from"
      />

      {pageCount > 0 && (
        <div className="space-y-3">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <label className="text-[11px] text-zinc-500 font-mono">Select pages to remove</label>
              <span className="text-[10px] text-zinc-700 font-mono">{selected.size} of {pageCount} selected</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => togglePage(i)}
                  className={`w-9 h-9 rounded-md text-[11px] font-mono border transition-colors ${
                    selected.has(i)
                      ? 'border-red-500/40 bg-red-500/10 text-red-400'
                      : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={processing || selected.size === 0 || selected.size >= pageCount}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Removing...' : `Remove ${selected.size} pages`}
          </button>

          {selected.size >= pageCount && (
            <p className="text-[11px] text-red-400">Cannot remove all pages.</p>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
