'use client';

import { useState, useCallback } from 'react';
import { RotateCw, Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropZone from '@/components/FileDropZone';
import ProgressBar from '@/components/ProgressBar';
import { type FileWithMeta, downloadUint8Array } from '@/lib/file-utils';
import { rotatePages } from '@/lib/pdf-engine';

export default function RotatePagesPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleRotate = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(40);

    try {
      const result = await rotatePages(files[0].file, rotation);
      setProgress(100);
      setStatus('done');
      downloadUint8Array(result, `rotated_${files[0].name}`);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [files, rotation]);

  return (
    <ToolLayout
      name="Rotate Pages"
      description="Rotate all pages by 90°, 180°, or 270°."
      icon={RotateCw}
    >
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          multiple={false}
          files={files}
          onFilesChange={setFiles}
          label="Drop a PDF to rotate"
        />

        {files.length > 0 && (
          <div>
            <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">Rotation</label>
            <div className="flex gap-2">
              {([90, 180, 270] as const).map(deg => (
                <button
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`flex-1 py-2.5 rounded-lg text-[12px] font-mono font-medium transition-colors border ${
                    rotation === deg
                      ? 'border-teal-500/40 bg-teal-500/10 text-teal-400'
                      : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        )}

        <ProgressBar progress={progress} status={status} label={
          status === 'processing' ? `Rotating ${rotation}°...` :
          status === 'done' ? 'Rotated — downloading' :
          status === 'error' ? 'Rotation failed' : undefined
        } />

        <button
          onClick={handleRotate}
          disabled={files.length === 0 || status === 'processing'}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-display font-semibold rounded-lg py-3 text-[13px] transition-all active:scale-[0.99]"
        >
          {status === 'done' ? (
            <><Download size={15} /> Download Again</>
          ) : (
            <><RotateCw size={15} /> Rotate {rotation}°</>
          )}
        </button>

        {status === 'done' && (
          <button
            onClick={() => { setFiles([]); setStatus('idle'); setProgress(0); }}
            className="w-full text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            Rotate another file
          </button>
        )}
      </div>
    </ToolLayout>
  );
}
