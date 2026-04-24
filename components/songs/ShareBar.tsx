'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { SITE_URL } from '@/lib/siteMetadata';

interface ShareBarProps {
  slug: string;
  title: string;
  catchphrase: string;
  shareCopyX?: string;
  shareCopyLine?: string;
}

export default function ShareBar({
  slug,
  title,
  catchphrase,
  shareCopyX,
  shareCopyLine,
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = `${SITE_URL}/resources/songs/${slug}`;
  const defaultText = `『${title}』— ${catchphrase} | Next Being Lab`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: defaultText, url: pageUrl }).catch(() => {});
      return;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterText = shareCopyX ?? defaultText;
  const lineText = shareCopyLine ?? defaultText;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(pageUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(lineText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Share
      </span>

      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          共有
        </button>
      )}

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        X
      </a>

      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-[#06C755] bg-[#06C755]/5 px-4 py-2 text-sm font-medium text-[#06C755] transition hover:bg-[#06C755]/10"
      >
        LINE
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        Facebook
      </a>

      <button
        onClick={handleCopy}
        aria-label="リンクをコピー"
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? 'コピーしました' : 'リンクをコピー'}
      </button>
    </div>
  );
}
