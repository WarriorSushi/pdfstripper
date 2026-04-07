'use client';

import Link from 'next/link';
import { FileText, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-[#1e1e21] sticky top-0 z-40 bg-[#0a0a0b]/95 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-5 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <FileText size={17} className="text-teal-500" />
          <span className="text-[13px] font-display font-semibold text-zinc-100 tracking-tight">PDFStripper</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
            <Shield size={11} />
            <span>100% client-side · your files never leave your browser</span>
          </div>
        </div>
      </div>
    </header>
  );
}
