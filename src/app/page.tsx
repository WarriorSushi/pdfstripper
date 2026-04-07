'use client';

import { Shield, Zap, Wifi, WifiOff, Download, ArrowRight, Lock, Eye } from 'lucide-react';
import { CATEGORIES, getToolsByCategory, TOOLS } from '@/lib/tools-config';
import ToolCard from '@/components/ToolCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const availableTools = TOOLS.filter(t => !t.comingSoon).length;
  const comingSoonTools = TOOLS.filter(t => t.comingSoon).length;

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero — concise, trust-forward */}
        <section className="pt-12 sm:pt-20 pb-10 sm:pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
                <Shield size={11} />
                Your files never leave your browser
              </div>
            </div>
            <h1 className="text-[clamp(28px,5vw,48px)] font-display font-bold text-zinc-100 leading-[1.1] tracking-tight">
              Strip the complexity<br />out of PDFs
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-500 mt-4 leading-relaxed max-w-lg">
              {availableTools} professional PDF tools. Merge, split, compress, convert, protect — all processed
              entirely in your browser. No uploads. No servers. No tracking.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a href="#tools" className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-5 py-2.5 text-[13px] transition-all active:scale-[0.98]">
                Browse Tools
                <ArrowRight size={14} />
              </a>
              <div className="flex items-center gap-4 text-[11px] text-zinc-600 font-mono">
                <span className="flex items-center gap-1"><WifiOff size={11} /> Works offline</span>
                <span className="flex items-center gap-1"><Lock size={11} /> Zero uploads</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-[#1e1e21] mb-12 sm:mb-16">
          {[
            { icon: Shield, title: 'Client-Side Only', desc: 'All processing in your browser via WebAssembly' },
            { icon: WifiOff, title: 'Works Offline', desc: 'No internet needed after first load (PWA)' },
            { icon: Zap, title: 'Instant Processing', desc: 'No upload wait — starts immediately' },
            { icon: Eye, title: 'No Tracking', desc: 'Zero analytics, cookies, or data collection' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-[#111113] px-3.5 sm:px-4 py-3 sm:py-3.5">
                <Icon size={14} className="text-teal-500/70 mb-1.5" />
                <h3 className="text-[11px] font-display font-semibold text-zinc-200 mb-0.5">{item.title}</h3>
                <p className="text-[10px] text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </section>

        {/* Tools Grid — categorized */}
        <section id="tools" className="space-y-10 pb-12 sm:pb-16">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-display font-bold text-zinc-100 tracking-tight">All Tools</h2>
            <p className="text-[13px] text-zinc-500 mt-1">
              {availableTools} available · {comingSoonTools} coming soon
            </p>
          </div>

          {CATEGORIES.map(category => {
            const tools = getToolsByCategory(category.id);
            if (tools.length === 0) return null;
            return (
              <div key={category.id}>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-[14px] font-display font-semibold text-zinc-300">{category.label}</h3>
                  <span className="text-[10px] font-mono text-zinc-600">{category.description}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {tools.map(tool => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* How it works */}
        <section className="border-t border-[#1e1e21] py-12 sm:py-16">
          <h2 className="text-[20px] sm:text-[24px] font-display font-bold text-zinc-100 tracking-tight mb-8">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Drop your files', desc: 'Drag and drop PDFs into the tool. Files stay on your device — nothing is uploaded.' },
              { step: '02', title: 'Process instantly', desc: 'Our engine processes everything in your browser using pdf-lib. No waiting for server responses.' },
              { step: '03', title: 'Download the result', desc: 'Get your processed PDF immediately. The original and result only exist on your machine.' },
            ].map((item, i) => (
              <div key={i}>
                <span className="text-[10px] font-mono text-teal-500">{item.step}</span>
                <h3 className="text-[14px] font-display font-semibold text-zinc-200 mt-1 mb-1.5">{item.title}</h3>
                <p className="text-[12px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy section */}
        <section id="privacy" className="border-t border-[#1e1e21] py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-[20px] sm:text-[24px] font-display font-bold text-zinc-100 tracking-tight mb-4">
              Privacy by architecture
            </h2>
            <div className="space-y-4 text-[13px] text-zinc-400 leading-relaxed">
              <p>
                PDFStripper is not "privacy-friendly" — it's <strong className="text-zinc-200">structurally incapable</strong> of seeing your files.
                Every tool runs entirely in your browser using JavaScript and WebAssembly. There is no server to upload to.
              </p>
              <p>
                We don't use analytics. We don't set cookies. We don't track page views. The only network requests
                are for loading the app itself. After that, everything runs offline.
              </p>
              <p className="text-[11px] text-zinc-600 font-mono">
                Technical: PDF processing uses pdf-lib (MIT licensed). No data leaves the browser's
                JavaScript runtime. You can verify by opening DevTools → Network tab while using any tool.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#1e1e21] py-12 sm:py-16 text-center">
          <h2 className="text-[20px] font-display font-bold text-zinc-100 mb-2">Ready to strip some PDFs?</h2>
          <p className="text-[13px] text-zinc-500 mb-5">{availableTools} tools, zero uploads, completely free.</p>
          <a href="#tools" className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-display font-medium rounded-lg px-6 py-2.5 text-[13px] transition-all active:scale-[0.98]">
            Get Started
            <ArrowRight size={14} />
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
