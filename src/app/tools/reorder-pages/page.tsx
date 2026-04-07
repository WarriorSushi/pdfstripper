'use client';

import { useState } from 'react';
import { Download, Loader2, GripVertical } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { reorderPages, getPageCount } from '@/lib/pdf-engine';
import { downloadUint8Array } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('reorder-pages')!;

export default function ReorderPagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFilesChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const count = await getPageCount(newFiles[0]);
      setPageCount(count);
      setOrder(Array.from({ length: count }, (_, i) => i));
    } else {
      setPageCount(0);
      setOrder([]);
    }
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const newOrder = [...order];
    const [moved] = newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, moved);
    setOrder(newOrder);
    setDragIndex(null);
  };

  const handleReorder = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const result = await reorderPages(files[0], order);
      downloadUint8Array(result, `${files[0].name.replace('.pdf', '')}_reordered.pdf`);
    } catch (err) {
      console.error('Reorder failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const isChanged = order.some((v, i) => v !== i);

  return (
    <ToolLayout tool={tool}>
      <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={handleFilesChange} label="Drop a PDF to reorder pages" />

      {pageCount > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline gap-2 mb-1">
            <label className="text-[11px] text-zinc-500 font-mono">Drag to reorder</label>
            <span className="text-[10px] text-zinc-700 font-mono">{pageCount} pages</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {order.map((pageNum, i) => (
              <div
                key={`${pageNum}-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-md border cursor-grab active:cursor-grabbing text-[11px] font-mono transition-all ${
                  dragIndex === i ? 'opacity-30 border-teal-500' : 'border-[#27272a] text-zinc-300 hover:border-zinc-600'
                }`}
              >
                <GripVertical size={10} className="text-zinc-600" />
                Page {pageNum + 1}
              </div>
            ))}
          </div>

          <button
            onClick={handleReorder}
            disabled={processing || !isChanged}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {processing ? 'Reordering...' : 'Save New Order'}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
