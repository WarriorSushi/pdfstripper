'use client';

import { Loader2, Check, AlertTriangle } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0–100
  status: 'idle' | 'processing' | 'done' | 'error';
  label?: string;
}

export default function ProgressBar({ progress, status, label }: ProgressBarProps) {
  if (status === 'idle') return null;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center gap-2">
          {status === 'processing' && <Loader2 size={13} className="text-teal-500 animate-spin" />}
          {status === 'done' && <Check size={13} className="text-green-500" />}
          {status === 'error' && <AlertTriangle size={13} className="text-red-500" />}
          <span className="text-[12px] text-zinc-400">{label}</span>
          {status === 'processing' && (
            <span className="text-[11px] font-mono text-zinc-600 ml-auto">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className="h-[3px] bg-[#1e1e21] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            status === 'done' ? 'bg-green-500' :
            status === 'error' ? 'bg-red-500' :
            'bg-teal-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
