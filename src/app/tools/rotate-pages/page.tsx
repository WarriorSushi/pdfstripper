'use client';

import { useState, useCallback } from 'react';
import { Download, Loader2, RotateCw as RotateIcon } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import { rotateAllPages, getPageCount } from '@/lib/pdf-engine';
import { readFileAsArrayBuffer, downloadBytes, formatFileSize, generateOutputFilename } from '@/lib/file-utils';

export default function RotatePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRotate = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError(null); setResult(null);
    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      const rotated = await rotateAllPages(buffer, rotation);
      setResult(rotated);
    } catch (err) {
      setError(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally { setProcessing(false); }
  }, [files, rotation]);

  return (
    <ToolLayout slug="rotate-pages">
      <div className="space-y-5">
        <FileDropZone accept=".pdf" multiple={false} files={files} onFilesChange={setFiles} label="Drop a PDF to rotate" />
        {files.length > 0 && !result && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-500 font-mono">Rotation:</span>
              {[90, 180, 270].map(deg => (
                <button key={deg} onClick={() => setRotation(deg)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-mono transition-colors ${
                    rotation === deg ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800'
                  }`}>
                  {deg}°
                </button>
              ))}
            </div>
            <button onClick={handleRotate} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-900 font-display font-medium rounded-lg py-3 text-[13px] transition-all">
              {processing ? <Loader2 size={15} className="animate-spin" /> : <RotateIcon size={15} />}
              {processing ? 'Rotating...' : `Rotate all pages ${rotation}°`}
            </button>
          </>
        )}
        {error && <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-green-400">Rotation complete — {rotation}°</p>
              <button onClick={() => downloadBytes(result, generateOutputFilename(files[0]?.name || 'doc', `rotated-${rotation}`))}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg px-4 py-2 text-[12px] font-medium transition-colors">
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
