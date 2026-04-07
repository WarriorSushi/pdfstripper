import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { CATEGORIES, getToolsByCategory } from '@/lib/tools-config';
import { Shield, Zap, Wifi, WifiOff, Lock } from 'lucide-react';

export default function HomePage() {
  const activeTools = getToolsByCategory('core').concat(
    getToolsByCategory('convert'),
    getToolsByCategory('security'),
    getToolsByCategory('edit'),
    getToolsByCategory('analyze')
  ).filter(t => !t.comingSoon);

  const comingSoonCount = getToolsByCategory('core').concat(
    getToolsByCategory('convert'),
    getToolsByCategory('security'),
    getToolsByCategory('edit'),
    getToolsByCategory('analyze')
  ).filter(t => t.comingSoon).length;

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero — left-aligned, tight, no fluff */}
        <section className="py-8 sm:py-14 max-w-[640px]">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-teal-500" />
            <span className="text-[11px] font-mono text-teal-500 tracking-wide uppercase">100% Client-Side</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-zinc-100 tracking-tight leading-[1.15]">
            Strip the complexity<br />out of PDFs.
          </h1>
          <p className="text-[14px] sm:text-[16px] text-zinc-400 mt-4 leading-relaxed max-w-[520px]">
            {activeTools.length} professional tools. All free. All private.
            Your files never leave your browser — no uploads, no servers, no tracking.
          </p>
          <div className="flex items-center gap-4 mt-5 text-[10px] font-mono text-zinc-600">
            <span className="flex items-center gap-1"><WifiOff size={11} /> Works offline</span>
            <span className="flex items-center gap-1"><Zap size={11} /> Instant processing</span>
            <span className="flex items-center gap-1"><Lock size={11} /> Zero data collection</span>
          </div>
        </section>

        {/* Tool grid — by category */}
        <section className="pb-10 sm:pb-16 space-y-8 sm:space-y-10">
          {CATEGORIES.map(cat => {
            const tools = getToolsByCategory(cat.id);
            if (tools.length === 0) return null;

            return (
              <div key={cat.id}>
                <div className="flex items-baseline gap-2 mb-3">
                  <h2 className="text-[13px] font-display font-semibold text-zinc-200">{cat.label}</h2>
                  <span className="text-[10px] font-mono text-zinc-600">{tools.filter(t => !t.comingSoon).length} tools</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {tools.map(tool => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* How it works — 3 steps, horizontal */}
        <section className="py-8 sm:py-12 border-t border-[#1e1e21]">
          <h2 className="text-[13px] font-display font-semibold text-zinc-200 mb-5">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: '01', title: 'Drop your files', desc: 'Drag PDFs into any tool. They stay in your browser — nothing is uploaded.' },
              { step: '02', title: 'Process instantly', desc: 'All operations run client-side using WebAssembly. Fast, private, no server round-trips.' },
              { step: '03', title: 'Download the result', desc: 'Get your processed PDF immediately. The original and result are never stored anywhere.' },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <span className="text-[11px] font-mono text-teal-500/60 mt-0.5 shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-[13px] font-display font-semibold text-zinc-200">{s.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy section */}
        <section className="py-8 sm:py-12 border-t border-[#1e1e21]">
          <h2 className="text-[13px] font-display font-semibold text-zinc-200 mb-5">Privacy by design</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[700px]">
            {[
              { title: 'No file uploads', desc: 'Files are processed using pdf-lib directly in your browser. No server ever sees your data.' },
              { title: 'No analytics on content', desc: 'We never track what is in your PDFs. We never even know you used the tool.' },
              { title: 'Works offline', desc: 'Once loaded, PDFStripper works without internet. Process sensitive docs on airplane mode.' },
              { title: 'Open source', desc: 'Every line of code is on GitHub. Audit the privacy claims yourself.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <Shield size={14} className="text-teal-500/40 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-[12px] font-display font-semibold text-zinc-300">{item.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-8 sm:py-12 border-t border-[#1e1e21]">
          <h2 className="text-[13px] font-display font-semibold text-zinc-200 mb-5">vs the alternatives</h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-[#1e1e21]">
                  <th className="text-left py-2.5 pr-4 text-zinc-500 font-medium font-mono"></th>
                  <th className="text-center py-2.5 px-3 text-teal-400 font-display font-semibold">PDFStripper</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">SmallPDF</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">iLovePDF</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">Adobe</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                {[
                  ['Price', 'Free', '$6/mo', '$4/mo', '$20/mo'],
                  ['File uploads', 'Never', 'Always', 'Always', 'Always'],
                  ['Works offline', '✓', '✗', '✗', '✓ (desktop)'],
                  ['Task limits', 'None', '2/day free', '3/day free', 'Unlimited'],
                  ['Open source', '✓', '✗', '✗', '✗'],
                ].map(([label, ...vals], i) => (
                  <tr key={i} className="border-b border-[#1e1e21]/50">
                    <td className="py-2.5 pr-4 text-zinc-500 font-mono whitespace-nowrap">{label}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`text-center py-2.5 px-3 ${j === 0 ? 'text-zinc-100 font-medium' : ''}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
