'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface ToolLayoutProps {
  name: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

export default function ToolLayout({ name, description, icon: Icon, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Header />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Back + title */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors mb-3"
          >
            <ArrowLeft size={12} />
            All tools
          </Link>
          <div className="flex items-center gap-3">
            <Icon size={20} className="text-teal-500 shrink-0" />
            <div>
              <h1 className="text-lg sm:text-xl font-display font-bold text-zinc-100">{name}</h1>
              <p className="text-[12px] sm:text-[13px] text-zinc-500 mt-0.5">{description}</p>
            </div>
          </div>
        </div>

        {/* Tool content */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
