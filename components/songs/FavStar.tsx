'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const STORAGE_KEY = 'nbl.songs.favorites.v1';
const MAX_HISTORY = 200;

interface FavEntry {
  slug: string;
  addedAt: string;
}

function readFavs(): FavEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeFavs(favs: FavEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs.slice(0, MAX_HISTORY)));
}

export function useFavorites() {
  const [favSlugs, setFavSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavSlugs(new Set(readFavs().map((f) => f.slug)));
  }, []);

  const toggle = (slug: string) => {
    const favs = readFavs();
    const exists = favs.some((f) => f.slug === slug);
    const next = exists
      ? favs.filter((f) => f.slug !== slug)
      : [{ slug, addedAt: new Date().toISOString() }, ...favs];
    writeFavs(next);
    setFavSlugs(new Set(next.map((f) => f.slug)));
  };

  const isFav = (slug: string) => favSlugs.has(slug);

  return { isFav, toggle, favSlugs };
}

export function getFavSlugsFromStorage(): string[] {
  return readFavs().map((f) => f.slug);
}

interface FavStarProps {
  slug: string;
  size?: number;
}

export default function FavStar({ slug, size = 20 }: FavStarProps) {
  const { isFav, toggle } = useFavorites();
  const active = isFav(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      aria-label={active ? 'お気に入りから外す' : 'お気に入りに追加'}
      aria-pressed={active}
      className={`rounded-full p-2 transition ${
        active
          ? 'text-amber-500 hover:text-amber-400'
          : 'text-slate-400 hover:text-amber-400'
      }`}
    >
      <Star size={size} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
