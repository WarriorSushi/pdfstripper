'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { type ToolDef, getToolBySlug, TOOLS } from '@/lib/tools-config';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

interface ToolLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function ToolLayout({ slug, children }: ToolLayoutProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;
  const Icon = tool.icon;

  // Related tools (same category, excluding current)
  const related = TOOLS.filter(t => t.category === tool.category && t.slug !== tool.slug && !t.comingSoon).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <Link href="/" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <ArrowLeft size={15} />
          </Link>
          <span className="text-[11px] font-mono text-zinc-600">Tools</span>
          <span className="text-[11px] text-zinc-700">/</span>
          <span className="text-[11px] font-mono text-zinc-400">{tool.name}</span>
        </div>

        {/* Tool header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Icon size={18} className="text-teal-500" />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-display font-bold text-zinc-100 tracking-tight">{tool.name}</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">{tool.longDescription}</p>
          </div>
        </div>

        {/* Privacy reminder */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-teal-500/70 mb-6 bg-teal-500/5 border border-teal-500/10 rounded-lg px-3 py-2">
          <Shield size={11} />
          Files are processed locally in your browser. Nothing is uploaded.
        </div>

        {/* Tool content */}
        {children}

        {/* Related tools */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#1e1e21]">
            <h3 className="text-[12px] font-display font-semibold text-zinc-400 mb-3">Related tools</h3>
            <div className="grid grid-cols-3 gap-2">
              {related.map(t => {
                const TIcon = t.icon;
                return (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="bg-[#111113] border border-zinc-800/50 rounded-lg p-3 hover:border-teal-500/30 transition-all"
                  >
                    <TIcon size={14} className="text-zinc-500 mb-1.5" />
                    <p className="text-[11px] font-display font-medium text-zinc-300">{t.name}</p>
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
