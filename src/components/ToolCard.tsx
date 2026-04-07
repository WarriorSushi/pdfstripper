'use client';

import Link from 'next/link';
import { type ToolDef } from '@/lib/tools-config';

interface ToolCardProps {
  tool: ToolDef;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  if (tool.comingSoon) {
    return (
      <div className="relative bg-[#111113] border border-zinc-800/50 rounded-lg p-4 opacity-50 cursor-not-allowed">
        <div className="absolute top-2 right-2 text-[8px] font-mono uppercase tracking-widest text-zinc-600 bg-zinc-800/60 px-1.5 py-0.5 rounded">
          Soon
        </div>
        <Icon size={18} className="text-zinc-600 mb-2.5" />
        <h3 className="text-[12px] font-display font-semibold text-zinc-400 mb-0.5">{tool.name}</h3>
        <p className="text-[10px] text-zinc-600 leading-relaxed">{tool.description}</p>
      </div>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group bg-[#111113] border border-zinc-800/50 rounded-lg p-4 hover:border-teal-500/30 hover:bg-[#111113]/80 transition-all"
    >
      <Icon size={18} className="text-zinc-400 group-hover:text-teal-500 transition-colors mb-2.5" />
      <h3 className="text-[12px] font-display font-semibold text-zinc-200 mb-0.5">{tool.name}</h3>
      <p className="text-[10px] text-zinc-500 leading-relaxed">{tool.description}</p>
    </Link>
  );
}
