'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import { type ToolDef, TOOLS } from '@/lib/tools-config';

interface ToolLayoutProps {
  tool: ToolDef;
  children: React.ReactNode;
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const Icon = tool.icon;

  // Get related tools from same category
  const related = TOOLS.filter(t => t.category === tool.category && t.slug !== tool.slug && !t.comingSoon).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Header />

      <main className="max-w-[900px] mx-auto px-5 py-6">
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors mb-5 font-mono">
          <ArrowLeft size={12} />
          all tools
        </Link>

        {/* Tool header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-lg bg-[#111113] border border-[#1e1e21] shrink-0">
            <Icon size={20} className="text-teal-500" />
          </div>
          <div>
            <h1 className="text-[20px] font-display font-bold text-zinc-100 tracking-tight">{tool.name}</h1>
            <p className="text-[13px] text-zinc-500 mt-1 max-w-xl leading-relaxed">{tool.longDescription}</p>
          </div>
        </div>

        {/* Tool content */}
        <div className="space-y-5">
          {children}
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#1e1e21]">
            <h2 className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-3">Related tools</h2>
            <div className="flex flex-wrap gap-2">
              {related.map(t => {
                const RIcon = t.icon;
                return (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#1e1e21] hover:border-zinc-600 transition-colors"
                  >
                    <RIcon size={13} className="text-zinc-500" />
                    <span className="text-[12px] text-zinc-300">{t.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
