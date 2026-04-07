'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  size?: 'sm' | 'md';
}

export default function ProgressBar({ progress, label, size = 'md' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1' : 'h-1.5';

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">{label}</span>
          <span className="text-[11px] font-mono text-zinc-500">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`${height} bg-zinc-800 rounded-full overflow-hidden`}>
        <div
          className={`${height} bg-gradient-to-r from-teal-500 to-sky-500 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
