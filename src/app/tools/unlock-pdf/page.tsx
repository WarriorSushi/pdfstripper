'use client';

import { useState } from 'react';
import { Unlock } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('unlock-pdf')!;

export default function UnlockPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');

  return (
    <ToolLayout tool={tool}>
      <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a password-protected PDF" />

      {files.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Current password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-sm bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-teal-500/40"
              placeholder="Enter current password"
            />
            <p className="text-[10px] text-zinc-700 mt-1">You need to know the current password to unlock the PDF.</p>
          </div>

          <button
            disabled={!password}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Unlock size={14} />
            Unlock PDF
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
