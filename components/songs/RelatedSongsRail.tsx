import Link from 'next/link';
import type { Song } from '@/lib/types/songs';

interface RelatedSongsRailProps {
  songs: Song[];
  heading?: string;
}

export default function RelatedSongsRail({
  songs,
  heading = '関連する曲',
}: RelatedSongsRailProps) {
  if (songs.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{heading}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {songs.map((song) => (
          <Link
            key={song.slug}
            href={`/resources/songs/${song.slug}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
          >
            {song.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Variant for embedding in existing Resource pages, keyed by infographic slug
interface RelatedSongsRailByKeyProps {
  infographicKey: string;
  allSongs: Song[];
  byInfographic: Record<string, string[]>;
  heading?: string;
}

export function RelatedSongsRailByKey({
  infographicKey,
  allSongs,
  byInfographic,
  heading,
}: RelatedSongsRailByKeyProps) {
  const slugs = byInfographic[infographicKey] ?? [];
  const songs = slugs
    .map((slug) => allSongs.find((s) => s.slug === slug))
    .filter((s): s is Song => s !== undefined && s.status === 'public');
  return <RelatedSongsRail songs={songs} heading={heading ?? '関連する曲'} />;
}
