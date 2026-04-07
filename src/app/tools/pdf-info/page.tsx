'use client';

import { useState } from 'react';
import { Info, FileText, Calendar, User, Cpu } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import { getPDFInfo, type PDFInfo } from '@/lib/pdf-engine';
import { formatFileSize } from '@/lib/file-utils';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('pdf-info')!;

export default function PDFInfoPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [info, setInfo] = useState<PDFInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFilesChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      setLoading(true);
      try {
        const result = await getPDFInfo(newFiles[0]);
        setInfo(result);
      } catch (err) {
        console.error('Info extraction failed:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setInfo(null);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <FileDropZone
        accept=".pdf"
        multiple={false}
        files={files}
        onFilesChange={handleFilesChange}
        label="Drop a PDF to inspect"
      />

      {loading && (
        <div className="text-[12px] text-zinc-500 font-mono">Analyzing...</div>
      )}

      {info && (
        <div className="space-y-4">
          {/* File overview */}
          <div className="grid sm:grid-cols-3 gap-3">
            <InfoBox label="File size" value={formatFileSize(info.fileSize)} />
            <InfoBox label="Pages" value={String(info.pageCount)} />
            <InfoBox label="File name" value={info.fileName} mono />
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Metadata</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              <MetaRow icon={FileText} label="Title" value={info.title} />
              <MetaRow icon={User} label="Author" value={info.author} />
              <MetaRow icon={Cpu} label="Creator" value={info.creator} />
              <MetaRow icon={Cpu} label="Producer" value={info.producer} />
              <MetaRow icon={Calendar} label="Created" value={info.creationDate ? new Date(info.creationDate).toLocaleString() : ''} />
              <MetaRow icon={Calendar} label="Modified" value={info.modificationDate ? new Date(info.modificationDate).toLocaleString() : ''} />
            </div>
          </div>

          {/* Page dimensions */}
          <div>
            <h3 className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Page dimensions</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {info.pages.map((page, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px] font-mono py-1">
                  <span className="text-zinc-600 w-12">Page {i + 1}</span>
                  <span className="text-zinc-300">{page.width} × {page.height} pt</span>
                  {page.rotation !== 0 && (
                    <span className="text-amber-500">{page.rotation}° rotated</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

function InfoBox({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-3 py-2.5 rounded-md bg-[#111113] border border-[#1e1e21]">
      <div className="text-[10px] text-zinc-600 font-mono">{label}</div>
      <div className={`text-[14px] font-display font-semibold text-zinc-100 mt-0.5 truncate ${mono ? 'text-[12px] font-mono font-normal' : ''}`}>
        {value || '—'}
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: typeof Info; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#0a0a0b] border border-[#1e1e21]">
      <Icon size={12} className="text-zinc-600 shrink-0" />
      <span className="text-[10px] text-zinc-600 shrink-0 w-16">{label}</span>
      <span className="text-[11px] text-zinc-300 font-mono truncate">{value || '—'}</span>
    </div>
  );
}
