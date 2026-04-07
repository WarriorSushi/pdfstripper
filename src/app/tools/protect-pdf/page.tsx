'use client';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { useState } from 'react';

export default function ToolPage() {
  const [files, setFiles] = useState<File[]>([]);
  const slug = 'protect-pdf';
  return (
    <ToolLayout slug={slug}>
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} />
        <p className="text-[11px] text-zinc-500 text-center py-8">This tool is coming soon. Check back later.</p>
      </div>
    </ToolLayout>
  );
}
