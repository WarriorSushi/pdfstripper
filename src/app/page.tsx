'use client';

import { Shield, Zap, Lock, HardDrive, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { CATEGORIES, getToolsByCategory } from '@/lib/tools-config';

export default function HomePage() {
  const activeCounts = CATEGORIES.map(c => ({
    ...c,
    tools: getToolsByCategory(c.id),
    activeCount: getToolsByCategory(c.id).filter(t => !t.comingSoon).length,
  }));

  const totalActive = activeCounts.reduce((sum, c) => sum + c.activeCount, 0);
  const totalAll = activeCounts.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Header />

      <main className="max-w-[1200px] mx-auto px-5">
        {/* Hero — left-aligned, dense, no centered marketing fluff */}
        <section className="py-12 md:py-16 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 max-w-[40px] bg-teal-500" />
            <span className="text-[10px] font-mono text-teal-500 uppercase tracking-widest">Privacy-first PDF tools</span>
          </div>
          <h1 className="text-[32px] md:text-[42px] font-display font-bold text-zinc-100 tracking-tight leading-[1.1]">
            Strip the complexity<br />out of PDFs
          </h1>
          <p className="text-[15px] text-zinc-400 mt-4 leading-relaxed max-w-lg">
            {totalActive} professional PDF tools that run entirely in your browser. 
            No file uploads. No servers. No tracking. Your documents never leave your device.
          </p>

          {/* Trust signals — horizontal, not cards */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-teal-500/70" />
              100% client-side
            </span>
            <span className="flex items-center gap-1.5">
              <HardDrive size={12} className="text-teal-500/70" />
              Zero server uploads
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-teal-500/70" />
              Instant processing
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-teal-500/70" />
              No file size limits
            </span>
          </div>
        </section>

        {/* Tool grid — by category */}
        <section className="pb-12 space-y-10">
          {activeCounts.map(category => (
            <div key={category.id}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-[14px] font-display font-semibold text-zinc-200">{category.label}</h2>
                <span className="text-[10px] font-mono text-zinc-600">
                  {category.activeCount}/{category.tools.length} tools
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {category.tools.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* How it works — horizontal strip */}
        <section className="py-10 border-t border-[#1e1e21]">
          <h2 className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-6">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Drop your file', desc: 'Drag and drop or click to browse. Your file stays in your browser — we never see it.' },
              { step: '02', title: 'Choose action', desc: 'Merge, split, compress, convert, protect — pick the tool and configure options.' },
              { step: '03', title: 'Download result', desc: 'Get your processed PDF instantly. No email required. No watermarks. No limits.' },
            ].map(item => (
              <div key={item.step}>
                <span className="text-[28px] font-display font-bold text-zinc-800">{item.step}</span>
                <h3 className="text-[13px] font-display font-semibold text-zinc-200 mt-2">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy section — technical, not marketing */}
        <section className="py-10 border-t border-[#1e1e21]">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
            <div>
              <h2 className="text-[14px] font-display font-semibold text-zinc-200">Privacy by architecture</h2>
              <p className="text-[12px] text-zinc-500 mt-2 leading-relaxed">
                This isn&apos;t a privacy policy — it&apos;s a technical fact. PDFStripper uses 
                <span className="text-zinc-300"> pdf-lib</span> and <span className="text-zinc-300">pdfjs-dist</span> to 
                process everything in your browser&apos;s JavaScript runtime. There is no backend. No API. No server. 
                The page works offline once loaded.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Server uploads', value: 'Zero', color: 'text-green-500' },
                { label: 'File storage', value: 'None', color: 'text-green-500' },
                { label: 'Analytics on content', value: 'None', color: 'text-green-500' },
                { label: 'Tracking cookies', value: 'Zero', color: 'text-green-500' },
                { label: 'Works offline', value: 'Yes', color: 'text-teal-500' },
                { label: 'Open architecture', value: 'pdf-lib', color: 'text-zinc-400' },
              ].map(item => (
                <div key={item.label} className="px-3 py-2.5 rounded-md bg-[#111113] border border-[#1e1e21]">
                  <div className="text-[10px] text-zinc-600 font-mono">{item.label}</div>
                  <div className={`text-[13px] font-display font-semibold mt-0.5 ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
