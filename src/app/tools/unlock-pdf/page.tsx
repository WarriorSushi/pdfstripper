'use client';

import { Unlock } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function UnlockPDFPage() {
  return (
    <ToolLayout name="Unlock PDF" description="Remove password protection from a PDF." icon={Unlock}>
      <div className="space-y-5">
        <div className="text-center py-12">
          <Unlock size={32} className="text-zinc-600 mx-auto mb-3" />
          <h3 className="text-[14px] font-display font-semibold text-zinc-300 mb-1">Coming Soon</h3>
          <p className="text-[12px] text-zinc-500 max-w-[400px] mx-auto leading-relaxed">
            PDF password removal requires decryption support which is being implemented.
            You&apos;ll need to know the current password to unlock.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
