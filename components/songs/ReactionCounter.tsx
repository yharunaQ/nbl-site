'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import type { SongReaction } from '@/lib/types/songs';

const BASE_URL = process.env.NEXT_PUBLIC_REACTIONS_BASE_URL ?? '';
const ENABLED = process.env.NEXT_PUBLIC_REACTIONS_ENABLED === 'true';

interface ReactionCounterProps {
  slug: string;
}

export default function ReactionCounter({ slug }: ReactionCounterProps) {
  const [reaction, setReaction] = useState<SongReaction | null>(null);
  const [liked, setLiked] = useState(false);
  const [optimistic, setOptimistic] = useState(0);

  useEffect(() => {
    if (!ENABLED || !BASE_URL) return;
    fetch(`${BASE_URL}/get?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: SongReaction) => setReaction(data))
      .catch(() => {});
  }, [slug]);

  // Record play (30s after mount — simulates meaningful listen)
  useEffect(() => {
    if (!ENABLED || !BASE_URL) return;
    const t = setTimeout(() => {
      fetch(`${BASE_URL}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
    }, 30_000);
    return () => clearTimeout(t);
  }, [slug]);

  const handleLike = async () => {
    if (!ENABLED || !BASE_URL || liked) return;
    setLiked(true);
    setOptimistic((n) => n + 1);
    try {
      const res = await fetch(`${BASE_URL}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data: SongReaction = await res.json();
      setReaction(data);
      setOptimistic(0);
    } catch {
      setLiked(false);
      setOptimistic((n) => Math.max(0, n - 1));
    }
  };

  if (!ENABLED) return null;

  const likeCount = reaction ? reaction.likes + optimistic : optimistic;

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      aria-label={liked ? 'いいね済み' : 'いいね'}
      aria-pressed={liked}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        liked
          ? 'border-rose-200 bg-rose-50 text-rose-600'
          : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500'
      }`}
    >
      <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
      <span>{likeCount > 0 ? likeCount : ''}</span>
    </button>
  );
}
