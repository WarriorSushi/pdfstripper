'use client';

import { useState, useCallback } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { type FileWithMeta, readFileAsArrayBuffer, downloadBlob } from '@/lib/file-utils';

export default function PDFToTextPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExtract = useCallback(async (newFiles: FileWithMeta[]) => {
    setFiles(newFiles);
    setText('');
    if (newFiles.length === 0) return;

    setLoading(true);
    try {
      // Use pdfjs-dist for text extraction
      const pdfjsLib = await import('pdfjs-dist');
      // Set worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const bytes = await readFileAsArrayBuffer(newFiles[0].file);
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      let fullText = '';

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setText(fullText.trim() || '(No extractable text found in this PDF)');
    } catch (err) {
      console.error(err);
      setText('Error extracting text from PDF');
    }
    setLoading(false);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    downloadBlob(new Blob([text], { type: 'text/plain' }), `${files[0]?.name.replace('.pdf', '')}_text.txt`);
  };

  return (
    <ToolLayout name="PDF to Text" description="Extract all readable text from a PDF document." icon={FileText}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={handleExtract} label="Drop a PDF to extract text" />

        {loading && <div className="text-[12px] text-zinc-500 text-center py-4">Extracting text...</div>}

        {text && (
          <>
            <div className="relative">
              <pre className="bg-[#111113] border border-[#1e1e21] rounded-lg p-4 text-[11px] font-mono text-zinc-300 max-h-[400px] overflow-auto leading-relaxed whitespace-pre-wrap">
                {text}
              </pre>
            </div>

            <div className="flex gap-2">
              <button onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-semibold rounded-lg py-2.5 text-[13px] transition-all">
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Text</>}
              </button>
              <button onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-[#111113] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] rounded-lg px-4 py-2.5 text-[13px] transition-all">
                Download .txt
              </button>
            </div>
          </>
        )}

        {text && (
          <button onClick={() => { setFiles([]); setText(''); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2">Extract from another file</button>
        )}
      </div>
    </ToolLayout>
  );
}
