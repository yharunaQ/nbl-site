/**
 * /resources/songs — WORK UPDATE FEST 2026
 *
 * バーチャル7ステージ + アンコールのフェス形式で全曲を楽しむ。
 * - 連続再生は app 共有の PlayerProvider に乗せ、二重再生を防ぐ。
 * - 個別曲ページから戻ってきても再生位置は保持される。
 * - ステージ進行に合わせてページ背景・色が切り替わる。
 * - 歌詞ドロワー、SNSシェア、NBL主催表示、トップへの導線つき。
 *
 * 下部にはキャンペーン別の入り口を配置。
 */

import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronUp,
  ExternalLink,
  Facebook,
  Home,
  Link2,
  Music2,
  Pause,
  Play,
  Radio,
  Share2,
  SkipBack,
  SkipForward,
  Sparkles,
  Star,
  Volume2,
  X as XIcon,
  ScrollText,
} from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import { usePlayerOptional } from '@/components/songs/PlayerProvider';
import { getCampaigns, getPublicSongs, getWeeklyPickSongs } from '@/lib/songs';
import type { Campaign, Song } from '@/lib/types/songs';
import { SITE_URL } from '@/lib/siteMetadata';

// ── Stage definitions ───────────────────────────────────────────────────────

interface StageDef {
  id: string;
  number: string;
  label: string;
  english: string;
  role: string;
  songSlugs: string[];
  bg: string;
  accent: string;
  accentSoft: string;
}

const STAGES: StageDef[] = [
  {
    id: 'opening',
    number: 'Stage 01',
    label: '働き方を更新する',
    english: 'Opening Stage',
    role: 'フェスの宣言パート。働き方の固定観念をほどき、「できる条件」へ視点を切り替える入口。',
    songSlugs: [
      'hataraki-kata-update',
      'chigai-wo-chikara-ni',
      'sore-wa-shitsu-janai',
      'dekiru-joken',
    ],
    bg: '/fest/2026gw/stage-01.jpg',
    accent: '#f59e0b',
    accentSoft: 'from-amber-500/30 via-orange-400/15 to-transparent',
  },
  {
    id: 'invisible',
    number: 'Stage 02',
    label: '見えないからだ、見えない荷物',
    english: 'Invisible Conditions',
    role: '外から見えにくい体調変動・疲労・不安・移動やトイレの条件を、職場理解につなげるステージ。',
    songSlugs: [
      'mienai-karada-no-tenki',
      'karada-no-tenki-yoho',
      'mienai-nimotsu-no-hero',
      'tomei-na-ryukku',
    ],
    bg: '/fest/2026gw/stage-02.jpg',
    accent: '#38bdf8',
    accentSoft: 'from-sky-400/30 via-slate-400/15 to-transparent',
  },
  {
    id: 'design',
    number: 'Stage 03',
    label: 'がんばりより設計',
    english: 'Design, Not Heroism',
    role: '個人の努力や美談に寄せすぎず、職場・制度・環境の設計として働きやすさを考えるステージ。',
    songSlugs: [
      'ganbari-yori-sekkei',
      'career-wo-tomenai',
      'seido-wa-hito-wo-tomenai',
      'hairyo-ga-areba-hatarakeru',
    ],
    bg: '/fest/2026gw/stage-03.jpg',
    accent: '#10b981',
    accentSoft: 'from-emerald-500/25 via-emerald-400/10 to-transparent',
  },
  {
    id: 'care',
    number: 'Stage 04',
    label: '小さな配慮が返すもの',
    english: 'Care & Harmony',
    role: '小さな工夫、投資としての配慮、笑顔、共創の未来を明るく広げる中盤ステージ。',
    songSlugs: [
      'return-is-smile',
      'egao-no-harmony',
      'ashita-wo-tsukuru-bokura',
      'tomo-ni-tsukuru-mirai',
    ],
    bg: '/fest/2026gw/stage-04.jpg',
    accent: '#f43f5e',
    accentSoft: 'from-rose-400/30 via-amber-300/15 to-transparent',
  },
  {
    id: 'people-first',
    number: 'Stage 05',
    label: '人が先、条件がひらく',
    english: 'People First / Switch',
    role: '人として出会うこと、対話、条件調整、才能が目を覚ます瞬間を扱うステージ。',
    songSlugs: [
      'hito-ga-saki',
      'akiramenakute-ii',
      'condition-switch',
      'kagayaki-no-switch',
      'me-wo-samasuyou',
      'dekiru-wo-mitsukeru-shakai-ni',
    ],
    bg: '/fest/2026gw/stage-05.jpg',
    accent: '#a855f7',
    accentSoft: 'from-violet-500/30 via-indigo-400/15 to-transparent',
  },
  {
    id: 'bridge',
    number: 'Stage 06',
    label: '本物の役割と明日の仕事へ',
    english: 'Bridge to Tomorrow',
    role: '前に進めない状態から、本物の役割、医療・福祉・雇用の連携、明日の仕事へ橋をかけるステージ。',
    songSlugs: [
      'mae-ni-susumenai-mama-de',
      'mienai-tsubasa',
      'tsunagu-hikari',
      'work-of-tomorrow',
      'light-me-up',
    ],
    bg: '/fest/2026gw/stage-06.jpg',
    accent: '#14b8a6',
    accentSoft: 'from-teal-400/30 via-sky-400/15 to-transparent',
  },
  {
    id: 'encore',
    number: 'Encore',
    label: '合図は笑いだ、明日はここから',
    english: 'Future Sparks',
    role: '障害者雇用の再定義、硬直した形式をほどく笑い、次の共創へつなぐアンコール。',
    songSlugs: [
      'akiramenakute-ii-shougai',
      'aizu-wa-warai-da',
      'ashita-wo-tsukuru-bokura-indie',
    ],
    bg: '/fest/2026gw/stage-07.jpg',
    accent: '#ec4899',
    accentSoft: 'from-fuchsia-500/30 via-pink-400/15 to-transparent',
  },
];

const STAGE2_ILLUSTRATIONS = [
  {
    src: '/fest/2026gw/stage2/karada-tenki.jpg',
    title: 'からだの中の天気予報',
    note: '日内変動を「天気」として共有する。波があっても予測できれば備えられる。',
  },
  {
    src: '/fest/2026gw/stage2/jinsei-sugoroku.jpg',
    title: '人生すごろく',
    note: '一マスずつ、止まったり進んだりする。再開できる設計が「次の役割」をひらく。',
  },
  {
    src: '/fest/2026gw/stage2/ibd-backpack.jpg',
    title: '見えない荷物（バックパック）',
    note: '体力・通院・トイレ・服薬。他者から見えない荷物を、職場の側でひとつずつ降ろせる。',
  },
];

// ── Campaign metadata ──────────────────────────────────────────────────────

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

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildPlaylist(songsBySlug: Map<string, Song>): Array<{ song: Song; stageIdx: number }> {
  const list: Array<{ song: Song; stageIdx: number }> = [];
  STAGES.forEach((stage, stageIdx) => {
    stage.songSlugs.forEach((slug) => {
      const song = songsBySlug.get(slug);
      if (song) list.push({ song, stageIdx });
    });
  });
  return list;
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Extract just the lyric body (between ```text fences) from the markdown note
function extractLyricBody(lyrics: string | undefined): string {
  if (!lyrics) return '';
  // Remove leading/trailing whitespace
  return lyrics.trim();
}

// ── Props ───────────────────────────────────────────────────────────────────

interface Props {
  songs: Song[];
  campaigns: Campaign[];
  weeklyPicks: Song[];
}

// ── Component ───────────────────────────────────────────────────────────────

export default function FestPage({ songs, campaigns, weeklyPicks }: Props) {
  const songsBySlug = useMemo(() => new Map(songs.map((s) => [s.slug, s])), [songs]);
  const playlist = useMemo(() => buildPlaylist(songsBySlug), [songsBySlug]);
  const playlistSongs = useMemo(() => playlist.map((p) => p.song), [playlist]);

  // ── Global player ───────────────────────────────────────────────────────
  const player = usePlayerOptional();

  // Resolve current playlist index from the global player's currentSong slug.
  const currentIdx = useMemo(() => {
    if (!player?.currentSong) return null;
    const idx = playlist.findIndex((p) => p.song.slug === player.currentSong!.slug);
    return idx === -1 ? null : idx;
  }, [player?.currentSong, playlist]);

  const currentEntry = currentIdx !== null ? playlist[currentIdx] : null;
  const currentStage = currentEntry ? STAGES[currentEntry.stageIdx] : null;
  const playing = player?.isPlaying ?? false;
  const currentTime = player?.currentTime ?? 0;
  const duration = player?.duration ?? 0;

  // ── Actions ─────────────────────────────────────────────────────────────
  const playAt = useCallback(
    (idx: number) => {
      if (!player || idx < 0 || idx >= playlist.length) return;
      // playCampaign sets the full fest queue and starts at slug
      player.playCampaign(playlistSongs, playlist[idx].song.slug);
    },
    [player, playlist, playlistSongs],
  );

  const togglePlay = useCallback(() => {
    if (!player) return;
    if (currentIdx === null) return playAt(0);
    player.toggle();
  }, [player, currentIdx, playAt]);

  const seek = useCallback(
    (value: number) => {
      if (!player) return;
      player.seek(value);
    },
    [player],
  );

  // ── UI state ────────────────────────────────────────────────────────────
  const [shareOpen, setShareOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // close lightbox on Escape
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      else if (e.key === 'ArrowLeft' && lightboxIdx > 0) setLightboxIdx(lightboxIdx - 1);
      else if (e.key === 'ArrowRight' && lightboxIdx < STAGE2_ILLUSTRATIONS.length - 1)
        setLightboxIdx(lightboxIdx + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxIdx]);

  // close share dropdown when clicking outside
  useEffect(() => {
    if (!shareOpen) return;
    const onClick = () => setShareOpen(false);
    const t = setTimeout(() => document.addEventListener('click', onClick), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', onClick);
    };
  }, [shareOpen]);

  // ── Share ───────────────────────────────────────────────────────────────
  const festUrl = `${SITE_URL}/resources/songs`;
  const festShareText =
    'WORK UPDATE FEST 2026 — 働き方アップデートのバーチャル7ステージ。30曲で巡るインクルーシブ・ワークの一日。 #働き方アップデート #NextBeingLab';
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(festShareText)}&url=${encodeURIComponent(festUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(festUrl)}&text=${encodeURIComponent(festShareText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(festUrl)}`;
  const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(festShareText + ' ' + festUrl)}`;

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(festUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [festUrl]);

  const nativeShare = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      void (navigator as Navigator).share({
        title: 'WORK UPDATE FEST 2026',
        text: festShareText,
        url: festUrl,
      }).catch(() => {});
    }
  }, [festShareText, festUrl]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <PageSeo
        title="WORK UPDATE FEST 2026 — 働き方アップデート・フェス | Next Being Lab"
        description="バーチャル7ステージ + アンコールで巡る30曲のフェス。働き方アップデート、見えないからだ、がんばりより設計、人が先、明日への橋——働き方の固定観念をほどく音楽体験。主催: Next Being Lab"
        path="/resources/songs"
        imagePath="/og/fest-2026gw.jpg"
        imageAlt="WORK UPDATE FEST 2026 — 働き方アップデート・フェス。30 Songs / 7 Stages + Encore. Hosted by Next Being Lab."
      />
      <Head>
        {/* Additional platform-specific tags PageSeo doesn't cover */}
        <meta name="twitter:site" content="@nextbeinglab" key="twitter:site" />
        {/* LINE / Facebook richer preview hints */}
        <meta property="og:image:type" content="image/jpeg" key="og:image:type" />
        <meta property="og:image:secure_url" content="https://nextbeinglab.org/og/fest-2026gw.jpg" key="og:image:secure_url" />
        {/* Apple touch / link unfurl color */}
        <meta name="theme-color" content="#0f172a" key="theme-color-fest" />
      </Head>

      {/* ── Page wrapper with dynamic background ───────────────────────── */}
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        {/* Stage backgrounds — fixed, swap with opacity */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {STAGES.map((stage, i) => (
            <div
              key={stage.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: currentEntry?.stageIdx === i ? 1 : 0,
                backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.85) 100%), url(${stage.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          {/* Default ambient gradient when nothing is playing */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentEntry === null ? 1 : 0,
              background:
                'linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #0f172a 65%, #052e2e 100%)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
        </div>

        {/* ── Top nav ──────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/10"
              aria-label="Next Being Lab トップへ"
            >
              <Home size={12} />
              NBL TOP
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/10"
            >
              <ArrowLeft size={12} />
              Resources
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/resources/songs/favorites"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur transition hover:bg-amber-400/20"
            >
              <Star size={12} fill="currentColor" />
              お気に入り
            </Link>
          </div>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        {/* z-30 so the share dropdown can escape over the timetable / stages below */}
        <header className="relative z-30 mx-auto max-w-6xl px-5 pb-10 pt-10 md:pb-16 md:pt-14">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 backdrop-blur">
                  <Radio size={12} />
                  Golden Week Special
                </p>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur transition hover:bg-emerald-400/20"
                >
                  Hosted by Next Being Lab
                  <ArrowUpRight size={12} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.05] text-white drop-shadow-md md:text-6xl">
                WORK UPDATE
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                  FEST 2026
                </span>
              </h1>
              <p className="mt-3 text-lg font-bold text-white/90 md:text-xl">
                働き方アップデート・フェス — 30 Songs for Inclusive Work
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">
                バーチャル7ステージ + アンコールで巡る30曲。連続再生モードで、
                ステージごとに変わる景色とテーマを体験できます。
                働き方の固定観念をほどく音楽の一日へ、ようこそ。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => playAt(0)}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-xl shadow-black/30 transition hover:scale-[1.02] hover:bg-amber-100"
                >
                  <Play size={16} fill="currentColor" />
                  フェスを開演する
                </button>
                <a
                  href="#stages"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  ステージ一覧
                  <ChevronUp size={14} className="rotate-180" />
                </a>

                {/* Share */}
                <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShareOpen((p) => !p)}
                    aria-haspopup="menu"
                    aria-expanded={shareOpen}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Share2 size={14} />
                    シェア
                  </button>
                  {shareOpen && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-white/15 bg-slate-900 p-3 shadow-2xl shadow-black/60 ring-1 ring-black/40"
                    >
                      <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                        Share this Fest
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={xUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-white/15"
                        >
                          𝕏 / X
                        </a>
                        <a
                          href={threadsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-white/15"
                        >
                          Threads
                        </a>
                        <a
                          href={lineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="block rounded-lg border border-[#06C755]/40 bg-[#06C755]/10 px-3 py-2 text-center text-xs font-bold text-[#06C755] transition hover:bg-[#06C755]/20"
                        >
                          LINE
                        </a>
                        <a
                          href={fbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-white/15"
                        >
                          <Facebook size={12} />
                          Facebook
                        </a>
                      </div>
                      <button
                        onClick={copyLink}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                      >
                        <Link2 size={12} />
                        {linkCopied ? 'コピーしました' : 'リンクをコピー'}
                      </button>
                      {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <button
                          onClick={() => {
                            nativeShare();
                            setShareOpen(false);
                          }}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/20"
                        >
                          <Share2 size={12} />
                          端末の共有メニュー
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-300/40 via-pink-400/30 to-violet-500/40 blur-2xl" />
              <Image
                src="/fest/2026gw/timetable-poster.jpg"
                alt="Work Update Fest 2026 Timetable Poster"
                width={900}
                height={1200}
                className="relative w-full rounded-2xl object-cover shadow-2xl shadow-black/50"
                priority
              />
            </div>
          </div>
        </header>

        {/* ── Stage timetable strip ───────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-6xl px-5 pb-8">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              Timetable
            </p>
            <p className="text-xs text-white/50">
              {playlist.length} songs / 7 stages + encore
            </p>
          </div>
          <div className="grid grid-cols-7 gap-1 overflow-hidden rounded-xl border border-white/10">
            {STAGES.map((stage, i) => {
              const count = stage.songSlugs.length;
              const isLive = currentEntry?.stageIdx === i;
              return (
                <a
                  key={stage.id}
                  href={`#stage-${stage.id}`}
                  className="group relative block overflow-hidden bg-slate-800/40 px-2 py-3 text-center transition hover:bg-white/5"
                >
                  <div
                    className="absolute inset-0 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(180deg, ${stage.accent}55, transparent)`,
                      opacity: isLive ? 1 : 0.4,
                    }}
                  />
                  <div className="relative">
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: isLive ? '#fff' : stage.accent }}
                    >
                      {stage.number}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-semibold text-white/80">
                      {stage.label}
                    </p>
                    <p className="mt-1 text-[10px] text-white/50">{count}曲</p>
                  </div>
                  {isLive && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white" />
                  )}
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Stages ──────────────────────────────────────────────────── */}
        <main id="stages" className="relative z-10 mx-auto max-w-6xl px-5 pb-32">
          {STAGES.map((stage, stageIdx) => {
            const stageSongs = stage.songSlugs
              .map((slug) => songsBySlug.get(slug))
              .filter((s): s is Song => Boolean(s));
            const offsetInPlaylist = playlist.findIndex((p) => p.stageIdx === stageIdx);

            return (
              <section
                key={stage.id}
                id={`stage-${stage.id}`}
                className={`mt-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${stage.accentSoft} backdrop-blur-sm`}
              >
                <div className="relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.5) 50%, rgba(2,6,23,0.85) 100%), url(${stage.bg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="relative flex flex-wrap items-end justify-between gap-3 p-6 md:p-8">
                    <div>
                      <p
                        className="text-[11px] font-black uppercase tracking-[0.32em]"
                        style={{ color: stage.accent }}
                      >
                        {stage.number} — {stage.english}
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-white drop-shadow md:text-3xl">
                        {stage.label}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                        {stage.role}
                      </p>
                    </div>
                    <button
                      onClick={() => offsetInPlaylist >= 0 && playAt(offsetInPlaylist)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold text-slate-900 shadow-lg transition hover:scale-[1.03]"
                    >
                      <Play size={13} fill="currentColor" />
                      ここから再生
                    </button>
                  </div>
                </div>

                {/* Stage 2 — invisible conditions illustrations */}
                {stage.id === 'invisible' && (
                  <div className="border-t border-white/10 bg-slate-950/40 p-6 md:p-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
                      Visual Companion — 見えにくいものを共有するための絵
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {STAGE2_ILLUSTRATIONS.map((ill, illIdx) => (
                        <figure
                          key={ill.src}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                        >
                          <button
                            onClick={() => setLightboxIdx(illIdx)}
                            aria-label={`${ill.title}を拡大表示`}
                            className="group relative block w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-300"
                          >
                            <Image
                              src={ill.src}
                              alt={ill.title}
                              width={1200}
                              height={900}
                              className="h-44 w-full object-cover transition group-hover:scale-[1.03]"
                            />
                            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100">
                              <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-900">
                                クリックで拡大
                              </span>
                            </span>
                          </button>
                          <figcaption className="p-3">
                            <p className="text-sm font-bold text-white">{ill.title}</p>
                            <p className="mt-1 text-xs leading-5 text-white/65">{ill.note}</p>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {/* Song list */}
                <ol className="divide-y divide-white/5 bg-slate-950/30">
                  {stageSongs.map((song, i) => {
                    const playlistIdx = offsetInPlaylist + i;
                    const isCurrent = currentIdx === playlistIdx;
                    return (
                      <li
                        key={song.slug}
                        className={`group flex items-center gap-3 px-4 py-3 transition ${
                          isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <button
                          onClick={() => (isCurrent ? togglePlay() : playAt(playlistIdx))}
                          aria-label={isCurrent && playing ? '一時停止' : `${song.title}を再生`}
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition hover:scale-105"
                          style={{
                            backgroundColor: isCurrent ? stage.accent : 'transparent',
                            color: isCurrent ? '#0f172a' : stage.accent,
                            borderColor: isCurrent ? stage.accent : 'rgba(255,255,255,0.2)',
                          }}
                        >
                          {isCurrent && playing ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
                        </button>
                        <span className="w-7 flex-shrink-0 text-right text-xs font-bold tabular-nums text-white/40">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/resources/songs/${song.slug}`}
                            className="text-sm font-bold text-white transition hover:text-amber-200 md:text-base"
                          >
                            {song.title}
                          </Link>
                          <p className="mt-0.5 truncate text-xs text-white/55">
                            {song.catchphrase}
                          </p>
                        </div>
                        <Link
                          href={`/resources/songs/${song.slug}`}
                          className="flex-shrink-0 rounded-full border border-white/15 bg-white/5 p-1.5 text-white/50 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                          aria-label={`${song.title}のページへ`}
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}

          {/* ── Boundary note ──────────────────────────────────────────── */}
          <section className="mt-12 rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-sm leading-7 text-white/70 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
              Public Boundary Note
            </p>
            <p className="mt-2">
              このフェス構成は、働き方・合理的配慮・障害者雇用・医療福祉雇用連携について、
              啓発と対話の入口をつくるための特別コンテンツです。
              個別の就労可否、配慮内容、医療判断、法的判断を代替するものではありません。
            </p>
          </section>

          {/* ── Campaign entries ───────────────────────────────────────── */}
          <section className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles size={18} className="text-amber-300" />
              <h2 className="text-xl font-black text-white md:text-2xl">
                キャンペーン別の入り口
              </h2>
            </div>
            <p className="mb-6 max-w-2xl text-sm leading-7 text-white/70">
              曲はそれぞれ「合理的配慮」「インクルーシブ雇用」「障害者雇用啓発」「医療・福祉・雇用の連携」のいずれかのキャンペーンに属しています。テーマから入りたい方は、こちらから。
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {campaigns.map((campaign) => {
                const count = songs.filter((s) => s.campaignSlug === campaign.slug).length;
                return (
                  <Link
                    key={campaign.slug}
                    href={`/resources/songs/campaigns/${campaign.slug}`}
                    className={`block rounded-2xl border bg-white/95 p-5 transition hover:scale-[1.02] hover:shadow-xl ${CAMPAIGN_ACCENT[campaign.slug] ?? 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${CAMPAIGN_BADGE[campaign.slug] ?? 'border-slate-200 bg-slate-50 text-slate-700'}`}
                    >
                      {count} 曲
                    </span>
                    <h3 className="mt-3 text-base font-black text-slate-900">
                      {campaign.titleJa}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.headline}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Weekly picks ───────────────────────────────────────────── */}
          {weeklyPicks.length > 0 && (
            <section className="mt-16">
              <div className="mb-6 flex items-center gap-3">
                <Music2 size={18} className="text-amber-300" />
                <h2 className="text-xl font-black text-white md:text-2xl">今週のピック</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {weeklyPicks.map((song) => (
                  <Link
                    key={song.slug}
                    href={`/resources/songs/${song.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
                  >
                    <p className="text-xs font-semibold text-amber-300">
                      {song.campaignTitle}
                    </p>
                    <h3 className="mt-2 text-base font-bold text-white">{song.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-white/65">{song.catchphrase}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Hosted by NBL footer ───────────────────────────────────── */}
          <section className="mt-16 rounded-3xl border border-emerald-300/20 bg-emerald-500/5 p-6 backdrop-blur md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-300">
                  Hosted by
                </p>
                <p className="mt-2 text-xl font-black text-white md:text-2xl">
                  Next Being Lab
                </p>
                <p className="mt-2 max-w-xl text-sm leading-7 text-white/70">
                  働く人と職場を、固定観念から解放するための研究と表現。
                  キャンペーンソング・記事・ガイドブックを公開しています。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-100"
                >
                  <Home size={14} />
                  NBLサイトへ
                  <ExternalLink size={12} />
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Resources
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ── Continuous play bar ─────────────────────────────────────── */}
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl"
          style={{
            boxShadow: currentStage
              ? `0 -8px 40px -8px ${currentStage.accent}66`
              : undefined,
          }}
        >
          {/* progress bar */}
          <div className="h-1 w-full bg-white/5">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="0.5"
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="block h-1 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none"
              style={{
                background: `linear-gradient(to right, ${currentStage?.accent ?? '#fff'} 0%, ${currentStage?.accent ?? '#fff'} ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
              disabled={currentIdx === null}
            />
          </div>

          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:gap-5">
            {/* Now-playing meta */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className="hidden h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 sm:block"
                style={{
                  backgroundImage: currentEntry
                    ? `url(/songs/still/${currentEntry.song.slug}.jpg)`
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="min-w-0 flex-1">
                {currentEntry ? (
                  <>
                    <Link
                      href={`/resources/songs/${currentEntry.song.slug}`}
                      className="block truncate text-sm font-bold text-white hover:text-amber-200"
                    >
                      {currentEntry.song.title}
                    </Link>
                    <p className="truncate text-[11px] text-white/60">
                      {currentStage && (
                        <>
                          <span style={{ color: currentStage.accent }}>
                            {currentStage.number}
                          </span>{' '}
                          · {currentStage.label}
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-white/70">
                      フェスを開演しましょう
                    </p>
                    <p className="text-[11px] text-white/40">
                      ▶︎ ボタンで連続再生がはじまります
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Lyrics toggle */}
            {currentEntry && (
              <button
                onClick={() => setLyricsOpen(true)}
                aria-label="歌詞を表示"
                className="hidden flex-shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <ScrollText size={13} />
                歌詞
              </button>
            )}

            {/* Transport */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => player?.prev()}
                disabled={currentIdx === null || currentIdx <= 0}
                aria-label="前の曲"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlay}
                aria-label={playing ? '一時停止' : '再生'}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:scale-105"
                style={{ backgroundColor: currentStage?.accent ?? '#fff' }}
              >
                {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              <button
                onClick={() => player?.next()}
                disabled={currentIdx === null || currentIdx >= playlist.length - 1}
                aria-label="次の曲"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Time / Volume */}
            <div className="hidden flex-shrink-0 items-center gap-3 md:flex">
              <span className="text-[11px] tabular-nums text-white/55">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <Volume2 size={14} className="text-white/40" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                defaultValue={1}
                onChange={(e) => {
                  // PlayerProvider doesn't expose volume, but the underlying audio
                  // can be adjusted via Media Session — for now this is a no-op slider.
                  // (kept as visual/placeholder; safe to remove)
                  void e.target.value;
                }}
                className="h-1 w-20 cursor-pointer accent-white"
                aria-label="音量"
              />
            </div>

            {/* Position counter */}
            {currentIdx !== null && (
              <span className="hidden flex-shrink-0 text-[11px] tabular-nums text-white/40 md:block">
                {currentIdx + 1} / {playlist.length}
              </span>
            )}
          </div>
        </div>

        {/* ── Lyrics drawer ──────────────────────────────────────────── */}
        {lyricsOpen && currentEntry && (
          <>
            <div
              onClick={() => setLyricsOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm"
              aria-hidden
            />
            <aside
              className="fixed inset-y-0 right-0 z-[70] flex w-full flex-col border-l border-white/15 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/60 sm:max-w-md"
              role="dialog"
              aria-label="歌詞"
            >
              <div
                className="flex items-center justify-between border-b border-white/10 px-5 py-4"
                style={{
                  backgroundImage: currentStage
                    ? `linear-gradient(180deg, ${currentStage.accent}33, transparent)`
                    : undefined,
                }}
              >
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: currentStage?.accent }}
                  >
                    {currentStage?.number} · {currentStage?.label}
                  </p>
                  <p className="mt-1 truncate text-base font-black text-white">
                    {currentEntry.song.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/60">
                    {currentEntry.song.catchphrase}
                  </p>
                </div>
                <button
                  onClick={() => setLyricsOpen(false)}
                  aria-label="歌詞を閉じる"
                  className="ml-2 flex-shrink-0 rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <XIcon size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-7 text-white/85">
                  {extractLyricBody(currentEntry.song.lyrics)}
                </pre>
                <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/55">
                  <p>歌詞表示中も再生は続いています。</p>
                  <Link
                    href={`/resources/songs/${currentEntry.song.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-bold text-white/85 transition hover:bg-white/10"
                  >
                    曲ページへ
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
              <div className="border-t border-white/10 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                  Hosted by Next Being Lab · WORK UPDATE FEST 2026
                </p>
              </div>
            </aside>
          </>
        )}

        {/* ── Image lightbox (Stage 02 illustrations) ───────────────── */}
        {lightboxIdx !== null && (() => {
          const ill = STAGE2_ILLUSTRATIONS[lightboxIdx];
          const hasPrev = lightboxIdx > 0;
          const hasNext = lightboxIdx < STAGE2_ILLUSTRATIONS.length - 1;
          return (
            <div
              role="dialog"
              aria-label={`${ill.title} — 拡大表示`}
              aria-modal="true"
              onClick={() => setLightboxIdx(null)}
              className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md"
            >
              {/* Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(null);
                }}
                aria-label="拡大表示を閉じる"
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <XIcon size={20} />
              </button>

              {/* Counter */}
              <p className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 backdrop-blur">
                {lightboxIdx + 1} / {STAGE2_ILLUSTRATIONS.length} · Stage 02
              </p>

              {/* Prev */}
              {hasPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx(lightboxIdx - 1);
                  }}
                  aria-label="前のイラスト"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:left-6"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {/* Next */}
              {hasNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx(lightboxIdx + 1);
                  }}
                  aria-label="次のイラスト"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:right-6"
                >
                  <ArrowRight size={20} />
                </button>
              )}

              {/* Image + caption */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full max-w-5xl flex-col items-center gap-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ill.src}
                  alt={ill.title}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl shadow-black/60"
                />
                <figcaption className="max-w-2xl rounded-xl border border-white/10 bg-slate-900/80 p-4 text-center backdrop-blur">
                  <p className="text-base font-bold text-white">{ill.title}</p>
                  <p className="mt-1.5 text-sm leading-7 text-white/70">{ill.note}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
                    Esc で閉じる · ← → で切り替え
                  </p>
                </figcaption>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [songs, campaigns, weeklyPicks] = await Promise.all([
    getPublicSongs(),
    getCampaigns(),
    getWeeklyPickSongs(),
  ]);
  return {
    props: { songs, campaigns, weeklyPicks },
    revalidate: 1800,
  };
};
