'use client';

import { useState, useCallback } from 'react';
import { Info, FileText, Calendar, User, Layers, Ruler } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { type FileWithMeta, formatFileSize } from '@/lib/file-utils';
import { getPDFInfo, type PDFInfo } from '@/lib/pdf-engine';

export default function PDFInfoPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [info, setInfo] = useState<PDFInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const result = await getPDFInfo(files[0].file);
      setInfo(result);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [files]);

  // Auto-analyze when file is added
  const handleFilesChange = useCallback(async (newFiles: FileWithMeta[]) => {
    setFiles(newFiles);
    setInfo(null);
    if (newFiles.length > 0) {
      setLoading(true);
      try {
        const result = await getPDFInfo(newFiles[0].file);
        setInfo(result);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
  }, []);

  return (
    <ToolLayout
      name="PDF Info"
      description="View metadata, page count, file size, and document details."
      icon={Info}
    >
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          multiple={false}
          files={files}
          onFilesChange={handleFilesChange}
          label="Drop a PDF to inspect"
        />

        {loading && (
          <div className="text-[12px] text-zinc-500 text-center py-4">Analyzing...</div>
        )}

        {info && (
          <div className="border border-[#1e1e21] rounded-lg overflow-hidden">
            {/* Info rows */}
            {[
              { icon: Layers, label: 'Pages', value: `${info.pageCount}` },
              { icon: FileText, label: 'File size', value: formatFileSize(info.fileSize) },
              { icon: Ruler, label: 'Page size', value: info.pageSize ? `${info.pageSize.width} × ${info.pageSize.height} pt` : 'N/A' },
              { icon: FileText, label: 'Title', value: info.title || '(none)' },
              { icon: User, label: 'Author', value: info.author || '(none)' },
              { icon: FileText, label: 'Subject', value: info.subject || '(none)' },
              { icon: FileText, label: 'Creator', value: info.creator || '(none)' },
              { icon: FileText, label: 'Producer', value: info.producer || '(none)' },
              { icon: Calendar, label: 'Created', value: info.creationDate ? info.creationDate.toLocaleDateString() : '(unknown)' },
              { icon: Calendar, label: 'Modified', value: info.modificationDate ? info.modificationDate.toLocaleDateString() : '(unknown)' },
            ].map((row, i) => {
              const Icon = row.icon;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1e1e21] last:border-b-0">
                  <Icon size={13} className="text-zinc-600 shrink-0" />
                  <span className="text-[11px] font-mono text-zinc-500 w-20 shrink-0">{row.label}</span>
                  <span className="text-[12px] text-zinc-200 truncate">{row.value}</span>
                </div>
              );
            })}
          </div>
        )}

        {info && (
          <button
            onClick={() => { setFiles([]); setInfo(null); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            Inspect another file
          </button>
        )}
      </div>
    </ToolLayout>
  );
}
