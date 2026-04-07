'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/file-utils';

interface FileDropZoneProps {
  accept: string;
  multiple: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  label?: string;
}

export default function FileDropZone({
  accept, multiple, files, onFilesChange, maxFiles = 20, label
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    setError(null);
    const arr = Array.from(incoming);

    // Validate file types
    const acceptTypes = accept.split(',').map(t => t.trim().toLowerCase());
    const valid = arr.filter(f => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return acceptTypes.some(t => t === ext || f.type.includes(t.replace('.', '')));
    });

    if (valid.length < arr.length) {
      setError(`Some files were skipped — only ${accept} files accepted`);
    }

    if (multiple) {
      const combined = [...files, ...valid].slice(0, maxFiles);
      onFilesChange(combined);
    } else {
      onFilesChange(valid.slice(0, 1));
    }
  }, [accept, multiple, files, onFilesChange, maxFiles]);

  const removeFile = useCallback((index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    setError(null);
  }, [files, onFilesChange]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer ${
          isDragging
            ? 'border-teal-500 bg-teal-500/5'
            : files.length > 0
              ? 'border-zinc-700 bg-[#111113]'
              : 'border-zinc-700 hover:border-zinc-500 bg-[#111113]'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col items-center justify-center py-10 sm:py-14 px-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${
            isDragging ? 'bg-teal-500/20 text-teal-400' : 'bg-zinc-800 text-zinc-500'
          }`}>
            <Upload size={22} />
          </div>
          <p className="text-[13px] font-medium text-zinc-200 text-center">
            {label || (multiple ? 'Drop files here or click to browse' : 'Drop a file here or click to browse')}
          </p>
          <p className="text-[11px] text-zinc-600 mt-1 text-center">
            Accepts {accept} · {multiple ? `Up to ${maxFiles} files` : 'Single file'} · Processed locally
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center gap-3 bg-[#111113] border border-zinc-800/50 rounded-lg px-3 py-2.5">
              <File size={15} className="text-teal-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-zinc-200 truncate">{file.name}</p>
                <p className="text-[10px] font-mono text-zinc-600">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 text-zinc-600 hover:text-red-400 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
