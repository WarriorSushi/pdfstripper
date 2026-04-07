'use client';

import { Lock } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function ProtectPDFPage() {
  return (
    <ToolLayout name="Protect PDF" description="Add password encryption to your PDF." icon={Lock}>
      <div className="space-y-5">
        <div className="text-center py-12">
          <Lock size={32} className="text-zinc-600 mx-auto mb-3" />
          <h3 className="text-[14px] font-display font-semibold text-zinc-300 mb-1">Coming Soon</h3>
          <p className="text-[12px] text-zinc-500 max-w-[400px] mx-auto leading-relaxed">
            PDF password encryption requires AES-256 support which is being implemented.
            This feature will be available in the next update.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
