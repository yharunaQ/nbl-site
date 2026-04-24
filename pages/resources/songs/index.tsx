import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { ArrowLeft, Music2, Star } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import { getPublicSongs, getCampaigns, getWeeklyPickSongs } from '@/lib/songs';
import type { Song, Campaign } from '@/lib/types/songs';

interface Props {
  songs: Song[];
  campaigns: Campaign[];
  weeklyPicks: Song[];
}

const CAMPAIGN_BADGE: Record<string, string> = {
  'reasonable-accommodation': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'inclusive-employment': 'border-sky-200 bg-sky-50 text-sky-800',
  'disability-awareness': 'border-violet-200 bg-violet-50 text-violet-800',
  'care-work-employment-bridge': 'border-teal-200 bg-teal-50 text-teal-800',
};

const CAMPAIGN_ACCENT: Record<string, string> = {
  'reasonable-accommodation': 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/60',
  'inclusive-employment': 'border-sky-200 hover:border-sky-300 hover:bg-sky-50/60',
  'disability-awareness': 'border-violet-200 hover:border-violet-300 hover:bg-violet-50/60',
  'care-work-employment-bridge': 'border-teal-200 hover:border-teal-300 hover:bg-teal-50/60',
};

function SongCard({ song }: { song: Song }) {
  return (
    <Link
      href={`/resources/songs/${song.slug}`}
      className={`block rounded-[1.6rem] border bg-white p-5 shadow-sm shadow-slate-200/60 transition ${CAMPAIGN_ACCENT[song.campaignSlug] ?? 'border-slate-200 hover:border-slate-300'}`}
    >
      {song.heroVisual && (
        <img
          src={`/${song.heroVisual}`}
          alt={song.title}
          className="mb-4 h-36 w-full rounded-[1rem] object-cover"
        />
      )}
      <span
        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${CAMPAIGN_BADGE[song.campaignSlug] ?? 'border-slate-200 bg-slate-50 text-slate-700'}`}
      >
        {song.campaignTitle}
      </span>
      <h3 className="mt-2 text-base font-black text-slate-900">{song.title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{song.catchphrase}</p>
    </Link>
  );
}

export default function SongsIndexPage({ songs, campaigns, weeklyPicks }: Props) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#ecfeff_100%)] pb-20 text-slate-900">
      <PageSeo
        title="Songs | Next Being Lab"
        description="就労支援・合理的配慮・インクルーシブ雇用をテーマにしたキャンペーンソング集。各曲ページで歌詞・コンセプト・共有リンクを確認できます。"
        path="/resources/songs"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-1 text-sm text-slate-600">Resources / Songs</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/resources/songs/favorites"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
            >
              <Star size={15} fill="currentColor" />
              お気に入り
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              <ArrowLeft size={15} />
              Resources
            </Link>
          </div>
        </div>

        {/* Intro */}
        <section className="py-10">
          <div className="flex items-center gap-3">
            <Music2 size={20} className="text-emerald-600" />
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              キャンペーンソング
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600">
            就労支援・合理的配慮・インクルーシブ雇用をテーマにした曲を集めています。
            各曲のページで歌詞・コンセプト・関連リソースを確認し、SNS でシェアできます。
          </p>
        </section>

        {/* Weekly picks */}
        {weeklyPicks.length > 0 && (
          <section className="border-t border-slate-200 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              今週のピック
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weeklyPicks.map((song) => (
                <SongCard key={song.slug} song={song} />
              ))}
            </div>
          </section>
        )}

        {/* Campaigns */}
        <section className="border-t border-slate-200 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            キャンペーン
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {campaigns.map((campaign) => {
              const count = songs.filter((s) => s.campaignSlug === campaign.slug).length;
              return (
                <Link
                  key={campaign.slug}
                  href={`/resources/songs/campaigns/${campaign.slug}`}
                  className={`rounded-[1.6rem] border bg-white p-5 shadow-sm shadow-slate-200/60 transition ${CAMPAIGN_ACCENT[campaign.slug] ?? 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${CAMPAIGN_BADGE[campaign.slug] ?? 'border-slate-200 bg-slate-50 text-slate-700'}`}
                  >
                    {count} 曲
                  </span>
                  <h2 className="mt-3 text-base font-black text-slate-900">{campaign.titleJa}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.headline}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All songs */}
        <section className="border-t border-slate-200 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            全曲 ({songs.length})
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {songs.map((song) => (
              <SongCard key={song.slug} song={song} />
            ))}
          </div>
        </section>

        {/* Guardrail */}
        <section className="rounded-[1.6rem] border border-slate-200 bg-slate-50 px-6 py-5 text-sm leading-7 text-slate-600">
          <p className="font-semibold text-slate-700">ご注意</p>
          <p className="mt-1">
            各曲は就労支援・合理的配慮・インクルーシブ雇用への理解を深めることを目的としています。
            制度の個別解釈・医療的判断・支援の代替としてご使用いただくものではありません。
          </p>
        </section>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [songs, campaigns, weeklyPicks] = await Promise.all([
    getPublicSongs(),
    getCampaigns(),
    getWeeklyPickSongs(),
  ]);

  return {
    props: { songs, campaigns, weeklyPicks },
    revalidate: 1800, // ISR 30分
  };
};
