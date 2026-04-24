'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface LyricsBlockProps {
  lyrics: string;
  title: string;
}

export default function LyricsBlock({ lyrics, title }: LyricsBlockProps) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">歌詞</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            aria-label="歌詞をコピー"
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? '歌詞を折りたたむ' : '歌詞を展開する'}
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <pre
          lang="ja"
          className="mt-5 whitespace-pre-wrap font-sans text-sm leading-8 text-slate-700"
        >
          {lyrics}
        </pre>
      )}
    </div>
  );
}
