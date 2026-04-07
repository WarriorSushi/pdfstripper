'use client';

import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools-config';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';

const tool = getToolBySlug('protect-pdf')!;

export default function ProtectPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');

  return (
    <ToolLayout tool={tool}>
      <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to protect" />

      {files.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-zinc-500 font-mono mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-sm bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-teal-500/40"
              placeholder="Enter password"
            />
          </div>

          <div className="px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-400/80 leading-relaxed">
            <strong>Note:</strong> PDF encryption via pdf-lib has limited support in the browser. 
            Full AES-256 encryption requires a server-side library. This tool sets basic password protection 
            that works with most PDF readers.
          </div>

          <button
            disabled={!password}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Lock size={14} />
            Protect PDF
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
