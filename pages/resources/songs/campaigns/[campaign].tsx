import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import { getPublicSongs, getCampaigns } from '@/lib/songs';
import { usePlayer } from '@/components/songs/PlayerProvider';
import type { Song, Campaign } from '@/lib/types/songs';

interface Props {
  campaign: Campaign;
  songs: Song[];
  relatedCampaigns: Campaign[];
}

const CAMPAIGN_BADGE: Record<string, string> = {
  'reasonable-accommodation': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'inclusive-employment': 'border-sky-200 bg-sky-50 text-sky-800',
  'disability-awareness': 'border-violet-200 bg-violet-50 text-violet-800',
  'care-work-employment-bridge': 'border-teal-200 bg-teal-50 text-teal-800',
};

function PlayAllButton({ songs }: { songs: Song[] }) {
  const { playCampaign } = usePlayer();
  if (songs.length === 0) return null;
  return (
    <button
      onClick={() => playCampaign(songs)}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
    >
      <Play size={16} />
      このキャンペーンを通しで聴く
    </button>
  );
}

export default function CampaignPage({ campaign, songs, relatedCampaigns }: Props) {
  const badge = CAMPAIGN_BADGE[campaign.slug] ?? 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#ecfeff_100%)] pb-28 text-slate-900">
      <PageSeo
        title={`${campaign.titleJa} | Songs | Next Being Lab`}
        description={campaign.summary}
        path={`/resources/songs/campaigns/${campaign.slug}`}
      />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/resources/songs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Songs
        </Link>

        {/* Hero */}
        <div className="mt-6">
          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>
            {songs.length} 曲
          </span>
          <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">
            {campaign.titleJa}
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-600">{campaign.headline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600">{campaign.summary}</p>
          <div className="mt-6">
            <PlayAllButton songs={songs} />
          </div>
        </div>

        {/* Song list */}
        <section className="mt-10 border-t border-slate-200 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            収録曲
          </p>
          <div className="mt-4 space-y-3">
            {songs.map((song, i) => (
              <Link
                key={song.slug}
                href={`/resources/songs/${song.slug}`}
                className="flex items-start gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 transition hover:border-slate-300 hover:shadow-md"
              >
                <span className="mt-0.5 text-sm tabular-nums text-slate-400">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-slate-900">{song.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{song.catchphrase}</p>
                </div>
                {song.duration && (
                  <span className="text-xs tabular-nums text-slate-400">{song.duration}</span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Related campaigns */}
        {relatedCampaigns.length > 0 && (
          <section className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              関連キャンペーン
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedCampaigns.map((c) => (
                <Link
                  key={c.slug}
                  href={`/resources/songs/campaigns/${c.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {c.titleJa}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const campaigns = await getCampaigns();
  return {
    paths: campaigns.map((c) => ({ params: { campaign: c.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.campaign as string;
  const [campaigns, allSongs] = await Promise.all([getCampaigns(), getPublicSongs()]);
  const campaign = campaigns.find((c) => c.slug === slug);
  if (!campaign) return { notFound: true };

  const songs = allSongs.filter((s) => s.campaignSlug === slug);
  const relatedCampaigns = campaigns.filter(
    (c) => campaign.relatedCampaigns?.includes(c.slug as never),
  );

  return { props: { campaign, songs, relatedCampaigns } };
};
