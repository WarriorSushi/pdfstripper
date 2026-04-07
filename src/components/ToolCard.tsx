'use client';

import Link from 'next/link';
import { type ToolDef } from '@/lib/tools-config';

interface ToolCardProps {
  tool: ToolDef;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  const isDisabled = tool.comingSoon;

  const content = (
    <div className={`group relative flex items-start gap-3.5 px-4 py-3.5 rounded-lg border transition-all duration-150 ${
      isDisabled
        ? 'border-[#1e1e21] opacity-40 cursor-not-allowed'
        : 'border-[#1e1e21] hover:border-zinc-600 cursor-pointer'
    }`}>
      <div className="shrink-0 mt-0.5">
        <Icon size={16} className={isDisabled ? 'text-zinc-700' : 'text-zinc-400 group-hover:text-teal-500 transition-colors'} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[13px] font-display font-semibold ${isDisabled ? 'text-zinc-600' : 'text-zinc-100'}`}>
            {tool.name}
          </span>
          {isDisabled && (
            <span className="text-[9px] font-mono text-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 rounded">
              soon
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{tool.description}</p>
      </div>
    </div>
  );

  if (isDisabled) return content;

  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      {content}
    </Link>
  );
}
