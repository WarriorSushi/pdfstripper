'use client';
import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { getPDFInfo, type PDFInfo } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, formatFileSize } from '@/lib/file-utils';

export default function PDFInfoPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [info, setInfo] = useState<PDFInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles); setInfo(null); setError(null);
    if (newFiles.length > 0) {
      setProcessing(true);
      try {
        const buf = await readFileAsArrayBuffer(newFiles[0]);
        setInfo(await getPDFInfo(buf));
      } catch (err) { setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`); }
      finally { setProcessing(false); }
    }
  }, []);

  const Row = ({ label, value }: { label: string; value: string | undefined }) => (
    value ? (
      <div className="flex items-baseline justify-between py-1.5 border-b border-zinc-800/30">
        <span className="text-[11px] text-zinc-500">{label}</span>
        <span className="text-[12px] font-mono text-zinc-300 text-right">{value}</span>
      </div>
    ) : null
  );

  return (
    <ToolLayout slug="pdf-info">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={handleFilesChange} label="Drop a PDF to inspect" />
        {processing && <div className="flex items-center gap-2 text-[11px] text-zinc-400"><Loader2 size={13} className="animate-spin" /> Reading PDF...</div>}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {info && (
          <div className="bg-[#111113] border border-zinc-800/50 rounded-lg p-4 space-y-0">
            <Row label="Pages" value={`${info.pageCount}`} />
            <Row label="File Size" value={formatFileSize(info.fileSize)} />
            <Row label="Title" value={info.title} />
            <Row label="Author" value={info.author} />
            <Row label="Subject" value={info.subject} />
            <Row label="Creator" value={info.creator} />
            <Row label="Producer" value={info.producer} />
            <Row label="Created" value={info.creationDate?.toLocaleDateString()} />
            <Row label="Modified" value={info.modificationDate?.toLocaleDateString()} />
            <Row label="Page Size" value={info.pageWidths[0] && info.pageHeights[0] ? `${info.pageWidths[0]} × ${info.pageHeights[0]} pts` : undefined} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
