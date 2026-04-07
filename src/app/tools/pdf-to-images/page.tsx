'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { readFileAsArrayBuffer } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('pdf-to-images')!;

export default function PDFToImagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(2); // 2x = ~150 DPI

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setImages([]);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      const bytes = await readFileAsArrayBuffer(files[0]);
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      const results: string[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        results.push(canvas.toDataURL('image/png'));
      }

      setImages(results);
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `page_${index + 1}.png`;
    a.click();
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to convert to images" />

      {files.length > 0 && images.length === 0 && (
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Quality</label>
            <div className="flex gap-2">
              {[
                { value: 1, label: '72 DPI', desc: 'Web' },
                { value: 2, label: '150 DPI', desc: 'Standard' },
                { value: 4, label: '300 DPI', desc: 'Print' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setScale(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-[11px] transition-colors ${
                    scale === opt.value
                      ? 'border-teal-500/40 text-teal-400 bg-teal-500/5'
                      : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <div className="font-mono">{opt.label}</div>
                  <div className="text-[9px] text-zinc-600">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {loading ? 'Converting...' : 'Convert to Images'}
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] text-zinc-500 font-mono">{images.length} images generated</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative rounded-lg overflow-hidden border border-[#1e1e21] bg-white">
                <img src={img} alt={`Page ${i + 1}`} className="w-full" />
                <button
                  onClick={() => downloadImage(img, i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="flex items-center gap-1.5 text-[11px] text-white font-display">
                    <Download size={12} /> Page {i + 1}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
