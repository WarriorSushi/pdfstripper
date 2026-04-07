'use client';

import { useState, useRef, useCallback, type DragEvent } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { formatFileSize, createFileWithMeta, type FileWithMeta } from '@/lib/file-utils';

interface FileDropZoneProps {
  accept: string;
  multiple: boolean;
  files: FileWithMeta[];
  onFilesChange: (files: FileWithMeta[]) => void;
  maxFiles?: number;
  label?: string;
}

export default function FileDropZone({
  accept, multiple, files, onFilesChange, maxFiles = 50,
  label = 'Drop files here or click to browse'
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).map(createFileWithMeta);
    if (multiple) {
      const combined = [...files, ...arr].slice(0, maxFiles);
      onFilesChange(combined);
    } else {
      onFilesChange(arr.slice(0, 1));
    }
  }, [files, multiple, maxFiles, onFilesChange]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const removeFile = useCallback((id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-150 ${
          isDragOver
            ? 'border-teal-500 bg-teal-500/5'
            : 'border-[#27272a] hover:border-zinc-600 bg-transparent'
        } ${files.length > 0 ? 'py-6 px-4' : 'py-12 sm:py-16 px-4'}`}
      >
        <div className="flex flex-col items-center text-center">
          <Upload size={20} className={`mb-2 ${isDragOver ? 'text-teal-500' : 'text-zinc-600'}`} />
          <p className="text-[13px] text-zinc-300 font-medium">{label}</p>
          <p className="text-[11px] text-zinc-600 mt-1">
            {accept === '.pdf' ? 'PDF files' : accept.replace(/\./g, '').toUpperCase() + ' files'}
            {multiple && ` · up to ${maxFiles} files`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2 bg-[#111113] border border-[#1e1e21] rounded-lg group">
              <span className="text-[10px] font-mono text-zinc-600 w-5 text-right shrink-0">{i + 1}</span>
              <FileIcon size={14} className="text-zinc-500 shrink-0" />
              <span className="text-[12px] text-zinc-200 truncate flex-1">{f.name}</span>
              <span className="text-[10px] font-mono text-zinc-600 shrink-0">{formatFileSize(f.size)}</span>
              {f.pages !== undefined && (
                <span className="text-[10px] font-mono text-zinc-600 shrink-0">{f.pages}p</span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all"
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
