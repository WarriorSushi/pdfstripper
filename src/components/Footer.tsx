import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e21] mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-mono text-zinc-600">pdfstripper — altcorp 2026</p>
            <p className="text-[10px] text-zinc-700 mt-0.5">All processing happens in your browser. Zero server uploads.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600">
            <Shield size={11} className="text-teal-500" />
            Client-side only · No tracking · No cookies
          </div>
        </div>
      </div>
    </footer>
  );
}
