import Link from 'next/link';
import { type ToolDef } from '@/lib/tools-config';

interface ToolCardProps {
  tool: ToolDef;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  if (tool.comingSoon) {
    return (
      <div className="relative px-4 py-3.5 bg-[#111113] border border-[#1e1e21] rounded-lg opacity-50 cursor-not-allowed">
        <div className="flex items-start gap-3">
          <Icon size={18} className="text-zinc-600 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-display font-semibold text-zinc-400">{tool.name}</h3>
              <span className="text-[9px] font-mono text-zinc-600 bg-zinc-800/60 px-1.5 py-0.5 rounded">soon</span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{tool.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative px-4 py-3.5 bg-[#111113] border border-[#1e1e21] rounded-lg hover:border-zinc-600 transition-all duration-150 block"
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className="text-zinc-500 group-hover:text-teal-500 mt-0.5 shrink-0 transition-colors" />
        <div className="min-w-0">
          <h3 className="text-[13px] font-display font-semibold text-zinc-200 group-hover:text-zinc-100">{tool.name}</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}
