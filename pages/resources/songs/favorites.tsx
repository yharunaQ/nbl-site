import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import { getFavSlugsFromStorage } from '@/components/songs/FavStar';
import { usePlayer } from '@/components/songs/PlayerProvider';
import type { Song } from '@/lib/types/songs';

export default function FavoritesPage() {
  const [favSongs, setFavSongs] = useState<Song[]>([]);
  const { playFavorites } = usePlayer();

  useEffect(() => {
    const slugs = getFavSlugsFromStorage();
    if (slugs.length === 0) return;
    fetch('/api/songs/batch?slugs=' + slugs.join(','))
      .then((r) => r.json())
      .then((songs: Song[]) => setFavSongs(songs))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#ecfeff_100%)] pb-28 text-slate-900">
      <PageSeo
        title="お気に入り | Songs | Next Being Lab"
        description="お気に入りに追加した曲の一覧"
        path="/resources/songs/favorites"
        noIndex
      />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/resources/songs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Songs
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <Star size={22} className="text-amber-500" fill="currentColor" />
          <h1 className="text-2xl font-black text-slate-900">お気に入り</h1>
        </div>

        {favSongs.length === 0 ? (
          <div className="mt-10 rounded-[1.8rem] border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              ★ を押した曲がここに並びます。各曲ページから追加できます。
            </p>
            <Link
              href="/resources/songs"
              className="mt-5 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              曲を見る
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <button
                onClick={() => playFavorites(favSongs)}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                お気に入りを続けて再生
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {favSongs.map((song) => (
                <Link
                  key={song.slug}
                  href={`/resources/songs/${song.slug}`}
                  className="flex items-start gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-slate-900">{song.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{song.catchphrase}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
