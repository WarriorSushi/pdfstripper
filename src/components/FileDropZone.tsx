'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    if (multiple) {
      onFilesChange([...files, ...arr].slice(0, maxFiles));
    } else {
      onFilesChange(arr.slice(0, 1));
    }
  }, [files, multiple, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  }, [files, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative cursor-pointer border-[1.5px] border-dashed rounded-lg transition-all duration-150 ${
          isDragging
            ? 'border-teal-500 bg-teal-500/5'
            : 'border-zinc-700 hover:border-zinc-500 bg-transparent'
        }`}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Upload size={20} className={`mb-3 ${isDragging ? 'text-teal-500' : 'text-zinc-600'}`} />
          <p className="text-[13px] text-zinc-300 font-display font-medium">
            {label || 'Drop files here or click to browse'}
          </p>
          <p className="text-[11px] text-zinc-600 mt-1">
            Accepts {accept} · {multiple ? `Up to ${maxFiles} files` : 'Single file'}
          </p>
          <p className="text-[10px] text-zinc-700 mt-2 font-mono">
            Files never leave your browser
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

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#111113] border border-[#1e1e21]"
            >
              <FileIcon size={14} className="text-zinc-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-zinc-200 truncate">{file.name}</div>
                <div className="text-[10px] text-zinc-600 font-mono">{formatFileSize(file.size)}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 text-zinc-600 hover:text-red-400 transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
