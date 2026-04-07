'use client';

import { useState, useCallback } from 'react';
import { Image, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, readFileAsArrayBuffer, downloadBlob } from '@/lib/file-utils';

export default function PDFToImagesPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [scale, setScale] = useState(2); // 1=72dpi, 2=144dpi, 3=216dpi

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(10);
    setImages([]);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const bytes = await readFileAsArrayBuffer(files[0].file);
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      const results: string[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        setProgress(Math.round((i / doc.numPages) * 90));
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
      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files, scale]);

  const downloadImage = (dataUrl: string, index: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `page_${index + 1}.png`;
    a.click();
  };

  return (
    <ToolLayout name="PDF to Images" description="Convert each page to a PNG image." icon={Image}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to convert" />

        {files.length > 0 && status === 'idle' && (
          <div>
            <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">Quality</label>
            <div className="flex gap-2">
              {[{ v: 1, l: '72 DPI' }, { v: 2, l: '144 DPI' }, { v: 3, l: '216 DPI' }].map(q => (
                <button key={q.v} onClick={() => setScale(q.v)}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-mono border transition-colors ${
                    scale === q.v ? 'border-teal-500/40 bg-teal-500/10 text-teal-400' : 'border-[#27272a] text-zinc-500 hover:border-zinc-600'
                  }`}>{q.l}</button>
              ))}
            </div>
          </div>
        )}

        <ProgressBar progress={progress} status={status} label={status === 'processing' ? 'Rendering pages...' : status === 'done' ? `${images.length} pages converted` : undefined} />

        {status !== 'done' && (
          <button onClick={handleConvert} disabled={files.length === 0 || status === 'processing'}
            className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]">
            <Image size={15} /> Convert to Images
          </button>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => downloadImage(img, i)}
                className="relative group rounded-lg overflow-hidden border border-[#1e1e21] hover:border-zinc-600 transition-colors bg-white">
                <img src={img} alt={`Page ${i + 1}`} className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Download size={16} className="text-white" />
                </div>
                <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-zinc-600 bg-white/80 px-1 rounded">
                  p{i + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {status === 'done' && (
          <button onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); setImages([]); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Convert another PDF</button>
        )}
      </div>
    </ToolLayout>
  );
}
