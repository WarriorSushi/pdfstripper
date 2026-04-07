import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e21] mt-8 sm:mt-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <Shield size={12} className="text-teal-500/60" />
            <span>Your files never leave your browser. All processing is 100% client-side.</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-600">
            pdfstripper — altcorp 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
