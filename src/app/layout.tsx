import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', weight: ['500', '600', '700'] });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'PDFStripper — Free Client-Side PDF Tools | No Upload Required',
  description: 'Merge, split, compress, convert, protect, and edit PDFs entirely in your browser. Your files never leave your device. 20+ professional PDF tools, all free.',
  keywords: 'pdf tools, merge pdf, split pdf, compress pdf, pdf to image, client-side pdf, privacy pdf tools',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
