/**
 * /internal/setlist — セットリスト編集ツール (内部向け)
 *
 * 全曲を聴き比べながらドラッグで並び替え、
 * 最終的な順番を YAML でエクスポートする。
 */

import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRef, useState, useCallback, useEffect } from 'react';
import {
  GripVertical,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  RotateCcw,
  Music,
  Headphones,
} from 'lucide-react';
import { getAllSongs } from '@/lib/songs';
import type { Song } from '@/lib/types/songs';

// ── Campaign palette ─────────────────────────────────────────────────────────

const CAMPAIGN_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  'reasonable-accommodation': {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    bar: '#10b981',
  },
  'inclusive-employment': {
    bg: 'bg-sky-50 border-sky-200',
    text: 'text-sky-800',
    bar: '#0ea5e9',
  },
  'disability-awareness': {
    bg: 'bg-violet-50 border-violet-200',
    text: 'text-violet-800',
    bar: '#8b5cf6',
  },
  'care-work-employment-bridge': {
    bg: 'bg-teal-50 border-teal-200',
    text: 'text-teal-800',
    bar: '#14b8a6',
  },
};

const CAMPAIGN_LABEL: Record<string, string> = {
  'reasonable-accommodation': '合理的配慮',
  'inclusive-employment': 'インクルーシブ雇用',
  'disability-awareness': '障害者雇用啓発',
  'care-work-employment-bridge': '医療福祉雇用連携',
};

const fallbackPalette = { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', bar: '#94a3b8' };

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialSongs: Song[];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SetlistPage({ initialSongs }: Props) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);
  const [listened, setListened] = useState<Set<string>>(new Set());
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [dragOverSlug, setDragOverSlug] = useState<string | null>(null);
  const [dragOverPos, setDragOverPos] = useState<'before' | 'after'>('after');
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterCampaign, setFilterCampaign] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio management
  const togglePlay = useCallback(
    (slug: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playingSlug === slug) {
        audio.pause();
        setPlayingSlug(null);
      } else {
        audio.src = `/songs/audio/${slug}.mp3`;
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setPlayingSlug(slug);
        setListened((prev) => new Set(prev).add(slug));
      }
    },
    [playingSlug],
  );

  // When audio ends, advance to next song
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      const idx = songs.findIndex((s) => s.slug === playingSlug);
      if (idx >= 0 && idx < songs.length - 1) {
        const next = songs[idx + 1];
        audio.src = `/songs/audio/${next.slug}.mp3`;
        audio.play().catch(() => {});
        setPlayingSlug(next.slug);
        setListened((prev) => new Set(prev).add(next.slug));
      } else {
        setPlayingSlug(null);
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [songs, playingSlug]);

  // Drag handlers
  const handleDragStart = useCallback((slug: string, e: React.DragEvent) => {
    setDraggedSlug(slug);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback(
    (slug: string, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (slug === draggedSlug) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      setDragOverSlug(slug);
      setDragOverPos(e.clientY < midY ? 'before' : 'after');
    },
    [draggedSlug],
  );

  const handleDrop = useCallback(
    (targetSlug: string) => {
      if (!draggedSlug || draggedSlug === targetSlug) return;
      setSongs((prev) => {
        const result = [...prev];
        const fromIdx = result.findIndex((s) => s.slug === draggedSlug);
        const [moved] = result.splice(fromIdx, 1);
        const toIdx = result.findIndex((s) => s.slug === targetSlug);
        result.splice(dragOverPos === 'before' ? toIdx : toIdx + 1, 0, moved);
        return result;
      });
      setDraggedSlug(null);
      setDragOverSlug(null);
    },
    [draggedSlug, dragOverPos],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedSlug(null);
    setDragOverSlug(null);
  }, []);

  // Move up / down
  const move = useCallback((slug: string, dir: -1 | 1) => {
    setSongs((prev) => {
      const result = [...prev];
      const idx = result.findIndex((s) => s.slug === slug);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= result.length) return prev;
      [result[idx], result[newIdx]] = [result[newIdx], result[idx]];
      return result;
    });
  }, []);

  // Export YAML
  const yamlOutput = songs
    .map((s, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `  - slug: ${s.slug}  # ${num}. ${s.title}`;
    })
    .join('\n');

  const exportText = `# セットリスト順 — ${new Date().toLocaleDateString('ja-JP')}\nsetlist:\n${yamlOutput}\n`;

  const copyExport = useCallback(() => {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [exportText]);

  const reset = useCallback(() => {
    setSongs(initialSongs);
    setListened(new Set());
    setPlayingSlug(null);
    if (audioRef.current) audioRef.current.pause();
  }, [initialSongs]);

  // Displayed songs (filter)
  const displayed = filterCampaign
    ? songs.filter((s) => s.campaignSlug === filterCampaign)
    : songs;

  const campaigns = [...new Set(initialSongs.map((s) => s.campaignSlug))];

  return (
    <>
      <Head>
        <title>セットリスト編集 — NBL Internal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />

      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5 text-slate-400" />
              <span className="font-bold tracking-tight text-white">セットリスト編集</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {songs.length}曲 / 試聴済 {listened.size}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Campaign filter */}
              <div className="flex gap-1">
                <button
                  onClick={() => setFilterCampaign(null)}
                  className={`rounded px-2 py-1 text-xs transition ${filterCampaign === null ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  全て
                </button>
                {campaigns.map((c) => {
                  const pal = CAMPAIGN_COLOR[c] ?? fallbackPalette;
                  return (
                    <button
                      key={c}
                      onClick={() => setFilterCampaign(filterCampaign === c ? null : c)}
                      style={{
                        borderColor: filterCampaign === c ? pal.bar : 'transparent',
                        color: filterCampaign === c ? pal.bar : undefined,
                      }}
                      className={`rounded border px-2 py-1 text-xs transition hover:opacity-80 ${filterCampaign === c ? '' : 'text-slate-400'}`}
                    >
                      {CAMPAIGN_LABEL[c] ?? c}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-1 rounded px-3 py-1.5 text-xs text-slate-400 transition hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                リセット
              </button>
              <button
                onClick={() => setExportOpen((p) => !p)}
                className="flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
              >
                {exportOpen ? '閉じる' : 'エクスポート'}
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-6">

          {/* ── Flow strip ─────────────────────────────────────────────── */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              キャンペーン分布 — フロー
            </p>
            <div className="flex h-8 w-full overflow-hidden rounded-lg">
              {songs.map((s) => {
                const color = (CAMPAIGN_COLOR[s.campaignSlug] ?? fallbackPalette).bar;
                const isPlaying = s.slug === playingSlug;
                return (
                  <div
                    key={s.slug}
                    title={`${s.title} (${CAMPAIGN_LABEL[s.campaignSlug] ?? s.campaignSlug})`}
                    style={{
                      flex: 1,
                      backgroundColor: color,
                      opacity: filterCampaign && filterCampaign !== s.campaignSlug ? 0.2 : 1,
                      outline: isPlaying ? '2px solid white' : 'none',
                      outlineOffset: '-2px',
                    }}
                    className="cursor-default transition-opacity"
                  />
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {campaigns.map((c) => {
                const pal = CAMPAIGN_COLOR[c] ?? fallbackPalette;
                const count = songs.filter((s) => s.campaignSlug === c).length;
                return (
                  <span key={c} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: pal.bar }}
                    />
                    {CAMPAIGN_LABEL[c] ?? c}
                    <span className="text-slate-600">({count})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* ── Export panel ───────────────────────────────────────────── */}
          {exportOpen && (
            <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">YAML 出力 — セットリスト順</p>
                <button
                  onClick={copyExport}
                  className="flex items-center gap-1.5 rounded bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-600"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'コピー済み' : 'コピー'}
                </button>
              </div>
              <pre className="max-h-64 overflow-auto rounded bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300">
                {exportText}
              </pre>
            </div>
          )}

          {/* ── Song list ──────────────────────────────────────────────── */}
          <div className="space-y-1">
            {displayed.map((song, idx) => {
              const globalIdx = songs.findIndex((s) => s.slug === song.slug);
              const pal = CAMPAIGN_COLOR[song.campaignSlug] ?? fallbackPalette;
              const isPlaying = song.slug === playingSlug;
              const hasListened = listened.has(song.slug);
              const isDragging = song.slug === draggedSlug;
              const isDragOver = song.slug === dragOverSlug;

              return (
                <div
                  key={song.slug}
                  draggable
                  onDragStart={(e) => handleDragStart(song.slug, e)}
                  onDragOver={(e) => handleDragOver(song.slug, e)}
                  onDrop={() => handleDrop(song.slug)}
                  onDragEnd={handleDragEnd}
                  style={{
                    borderLeftColor: pal.bar,
                    opacity: isDragging ? 0.4 : 1,
                    boxShadow:
                      isDragOver
                        ? dragOverPos === 'before'
                          ? `0 -2px 0 0 ${pal.bar}`
                          : `0 2px 0 0 ${pal.bar}`
                        : undefined,
                  }}
                  className={`group flex items-stretch gap-0 rounded-lg border border-slate-700 bg-slate-900 transition-all hover:border-slate-600 ${isPlaying ? 'border-slate-500 bg-slate-800' : ''}`}
                >
                  {/* Left accent bar */}
                  <div
                    className="w-1 flex-shrink-0 rounded-l-lg"
                    style={{ backgroundColor: pal.bar }}
                  />

                  {/* Drag handle */}
                  <div className="flex cursor-grab items-center px-2 text-slate-600 active:cursor-grabbing">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Position + listened */}
                  <div className="flex w-10 flex-shrink-0 flex-col items-center justify-center gap-0.5 py-3">
                    <span className="text-xs font-bold tabular-nums text-slate-500">
                      {String(globalIdx + 1).padStart(2, '0')}
                    </span>
                    {hasListened && (
                      <Headphones className="h-3 w-3 text-slate-500" />
                    )}
                  </div>

                  {/* Play button */}
                  <button
                    onClick={() => togglePlay(song.slug)}
                    className={`flex h-full w-10 flex-shrink-0 items-center justify-center rounded transition ${
                      isPlaying
                        ? 'text-white'
                        : 'text-slate-500 hover:text-white'
                    }`}
                    aria-label={isPlaying ? '一時停止' : `${song.title}を再生`}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>

                  {/* Song info */}
                  <div className="min-w-0 flex-1 py-3 pr-3">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span
                        className={`text-sm font-bold ${isPlaying ? 'text-white' : 'text-slate-200'}`}
                      >
                        {song.title}
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: pal.bar + '33', color: pal.bar }}
                      >
                        {CAMPAIGN_LABEL[song.campaignSlug] ?? song.campaignSlug}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{song.catchphrase}</p>
                    {song.primaryAudience && (
                      <p className="mt-0.5 text-[10px] text-slate-600">
                        対象: {song.primaryAudience}
                      </p>
                    )}
                  </div>

                  {/* Move buttons */}
                  <div className="flex flex-col justify-center gap-0.5 px-1 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => move(song.slug, -1)}
                      disabled={globalIdx === 0}
                      className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-slate-700 hover:text-white disabled:opacity-20"
                      aria-label="上に移動"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => move(song.slug, 1)}
                      disabled={globalIdx === songs.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-slate-700 hover:text-white disabled:opacity-20"
                      aria-label="下に移動"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filterCampaign && (
            <p className="mt-4 text-center text-xs text-slate-600">
              フィルター中 — 全曲表示で並び順全体を確認できます
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const all = await getAllSongs();
  // Only public songs, campaign-grouped default order
  const CAMPAIGN_ORDER = [
    'reasonable-accommodation',
    'inclusive-employment',
    'disability-awareness',
    'care-work-employment-bridge',
  ];
  const public_ = all.filter((s) => s.status === 'public');
  const sorted = [...public_].sort((a, b) => {
    const ai = CAMPAIGN_ORDER.indexOf(a.campaignSlug);
    const bi = CAMPAIGN_ORDER.indexOf(b.campaignSlug);
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title, 'ja');
  });
  return { props: { initialSongs: sorted } };
};
