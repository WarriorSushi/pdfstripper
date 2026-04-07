import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-[#1e1e21] sticky top-0 z-40 bg-[#0a0a0b]/95 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <FileText size={17} className="text-teal-500" />
          <span className="text-[13px] font-display font-semibold text-zinc-100 tracking-tight">PDFStripper</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
            All Tools
          </Link>
          <a
            href="https://github.com/WarriorSushi/pdfstripper"
            target="_blank" rel="noopener"
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}
