import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import LyricsBlock from '@/components/songs/LyricsBlock';
import RelatedSongsRail from '@/components/songs/RelatedSongsRail';
import ShareBar from '@/components/songs/ShareBar';
import FavStar from '@/components/songs/FavStar';
import ReactionCounter from '@/components/songs/ReactionCounter';
import SongJsonLd from '@/components/songs/SongJsonLd';
import { getAllSongs, getPublicSongs, getSongBySlug } from '@/lib/songs';
import { usePlayer } from '@/components/songs/PlayerProvider';
import { SITE_URL } from '@/lib/siteMetadata';
import type { Song } from '@/lib/types/songs';

interface Props {
  song: Song;
  relatedSongs: Song[];
  campaignSongs: Song[];
}

function PlayButton({ song, campaignSongs }: { song: Song; campaignSongs: Song[] }) {
  const { play, toggle, currentSong, isPlaying } = usePlayer();
  const isThisSong = currentSong?.slug === song.slug;

  const handleClick = () => {
    if (isThisSong) {
      toggle();
    } else {
      play(song, campaignSongs);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-slate-700"
    >
      {isThisSong && isPlaying ? <Pause size={20} /> : <Play size={20} />}
      {isThisSong && isPlaying ? '一時停止' : '再生'}
    </button>
  );
}

const CAMPAIGN_COLORS: Record<string, string> = {
  'reasonable-accommodation': 'emerald',
  'inclusive-employment': 'sky',
  'disability-awareness': 'violet',
  'care-work-employment-bridge': 'teal',
};

const CAMPAIGN_BADGE: Record<string, string> = {
  'reasonable-accommodation': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'inclusive-employment': 'border-sky-200 bg-sky-50 text-sky-800',
  'disability-awareness': 'border-violet-200 bg-violet-50 text-violet-800',
  'care-work-employment-bridge': 'border-teal-200 bg-teal-50 text-teal-800',
};

export default function SongPage({ song, relatedSongs, campaignSongs }: Props) {
  const ogImageUrl = `${SITE_URL}/api/og?type=song&slug=${song.slug}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#ecfeff_100%)] pb-28 text-slate-900">
      <PageSeo
        title={`『${song.title}』— ${song.catchphrase} | Next Being Lab`}
        description={song.shortConceptNote.slice(0, 120)}
        path={`/resources/songs/${song.slug}`}
        imagePath={`/api/og?type=song&slug=${song.slug}`}
        imageAlt={`${song.title} — ${song.catchphrase}`}
        type="article"
      />
      <SongJsonLd song={song} />

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Back navigation */}
        <Link
          href="/resources/songs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Songs
        </Link>

        {/* Hero */}
        <div className="mt-6">
          {song.heroVisual ? (
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={`/${song.heroVisual}`}
                alt={song.title}
                className="h-56 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${CAMPAIGN_BADGE[song.campaignSlug] ?? 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {song.campaignTitle}
                </span>
                <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{song.title}</h1>
                <p className="mt-2 text-base text-slate-200">{song.catchphrase}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] bg-slate-100 p-8">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${CAMPAIGN_BADGE[song.campaignSlug] ?? 'border-slate-200 bg-slate-50 text-slate-700'}`}
              >
                {song.campaignTitle}
              </span>
              <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">{song.title}</h1>
              <p className="mt-2 text-lg text-slate-600">{song.catchphrase}</p>
            </div>
          )}
        </div>

        {/* Primary CTA + meta */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PlayButton song={song} campaignSongs={campaignSongs} />
          <FavStar slug={song.slug} size={22} />
          <ReactionCounter slug={song.slug} />
          {song.duration && (
            <span className="text-sm text-slate-400">{song.duration}</span>
          )}
        </div>

        {/* Concept note */}
        <div className="mt-8 rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-lg font-black text-slate-900">この曲について</h2>
          <p className="mt-3 text-sm leading-8 text-slate-700">{song.shortConceptNote}</p>
          {song.primaryAudience && (
            <p className="mt-3 text-xs text-slate-500">対象：{song.primaryAudience}</p>
          )}
        </div>

        {/* Lyrics */}
        <div className="mt-4">
          <LyricsBlock lyrics={song.lyrics} title={song.title} />
        </div>

        {/* Companion boundary note */}
        {song.companionBoundaryNote && (
          <div className="mt-4 rounded-[1.4rem] border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm leading-7 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              ご注意
            </p>
            <p className="mt-2">{song.companionBoundaryNote}</p>
          </div>
        )}

        {/* Related */}
        {(relatedSongs.length > 0 || song.relatedResourcePaths.length > 0) && (
          <div className="mt-8 space-y-5">
            {relatedSongs.length > 0 && <RelatedSongsRail songs={relatedSongs} />}
            {song.relatedCampaignSlugs.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  関連キャンペーン
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {song.relatedCampaignSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/resources/songs/campaigns/${slug}`}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      キャンペーンを見る
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {song.relatedResourcePaths.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  関連リソース
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {song.relatedResourcePaths.map((p) => (
                    <Link
                      key={p}
                      href={p}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      {p.replace('/resources/', '').replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share */}
        <div className="mt-8">
          <ShareBar
            slug={song.slug}
            title={song.title}
            catchphrase={song.catchphrase}
            shareCopyX={song.shareCopyX}
            shareCopyLine={song.shareCopyLine}
          />
        </div>

        {/* Download */}
        {song.audioPublic && (
          <p className="mt-6 text-center text-xs text-slate-400">
            <a
              href={`/${song.audioPublic}`}
              download
              className="underline underline-offset-2 hover:text-slate-600"
            >
              mp3 をダウンロード
            </a>
            {' '}（CC-BY-NC / Next Being Lab）
          </p>
        )}
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const songs = await getPublicSongs();
  return {
    paths: songs.map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const [song, allSongs] = await Promise.all([getSongBySlug(slug), getAllSongs()]);

  if (!song || song.status !== 'public') return { notFound: true };

  const relatedSongs = song.relatedSongSlugs
    .map((s) => allSongs.find((a) => a.slug === s))
    .filter((s): s is Song => s !== undefined && s.status === 'public');

  const campaignSongs = allSongs.filter(
    (s) => s.campaignSlug === song.campaignSlug && s.status === 'public',
  );

  return { props: { song, relatedSongs, campaignSongs } };
};
