'use client';

import Link from 'next/link';
import { Scissors, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-[#1e1e21] sticky top-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scissors size={17} className="text-teal-500" />
          <span className="text-[13px] font-display font-semibold text-zinc-100 tracking-tight">PDFStripper</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-5">
          <Link href="/#tools" className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors">Tools</Link>
          <Link href="/#privacy" className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</Link>
          <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
            <Shield size={11} className="text-teal-500" />
            100% client-side
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-1 text-zinc-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#1e1e21] bg-[#0a0a0b] px-4 py-3 space-y-2">
          <Link href="/#tools" className="block text-[13px] text-zinc-400 py-1.5" onClick={() => setMenuOpen(false)}>Tools</Link>
          <Link href="/#privacy" className="block text-[13px] text-zinc-400 py-1.5" onClick={() => setMenuOpen(false)}>Privacy</Link>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 font-mono pt-1">
            <Shield size={11} className="text-teal-500" />
            Files never leave your browser
          </div>
        </div>
      )}
    </header>
  );
}
