'use client';

import { usePlayerOptional } from './PlayerProvider';
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MiniPlayer() {
  const player = usePlayerOptional();

  if (!player || !player.currentSong || !player.isMiniPlayerVisible) return null;

  const { currentSong, isPlaying, currentTime, duration, toggle, next, prev } = player;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-lg shadow-slate-300/30 backdrop-blur-sm">
      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        {/* Album art / campaign color indicator */}
        {currentSong.heroVisual ? (
          <img
            src={`/${currentSong.heroVisual}`}
            alt={currentSong.title}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-lg">
            🎵
          </div>
        )}

        {/* Title */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{currentSong.title}</p>
          <p className="truncate text-xs text-slate-500">{currentSong.campaignTitle}</p>
        </div>

        {/* Time */}
        <span className="hidden text-xs tabular-nums text-slate-400 sm:block">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="前の曲"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={toggle}
            aria-label={isPlaying ? '一時停止' : '再生'}
            className="rounded-full bg-slate-900 p-2 text-white hover:bg-slate-700"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={next}
            aria-label="次の曲"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
