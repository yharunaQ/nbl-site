'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Song } from '@/lib/types/songs';

type PlayMode = 'queue' | 'shuffle' | 'repeat-one';

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  mode: PlayMode;
  isMiniPlayerVisible: boolean;
}

interface PlayerActions {
  play: (song: Song, queue?: Song[]) => void;
  playCampaign: (songs: Song[], startSlug?: string) => void;
  playFavorites: (songs: Song[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setMode: (mode: PlayMode) => void;
  addToQueue: (song: Song) => void;
}

type PlayerContext = PlayerState & PlayerActions;

const Ctx = createContext<PlayerContext | null>(null);

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}

export function usePlayerOptional() {
  return useContext(Ctx);
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    mode: 'queue',
    isMiniPlayerVisible: false,
  });

  // Single persistent audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTimeUpdate = () =>
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onDurationChange = () =>
      setState((s) => ({ ...s, duration: isFinite(audio.duration) ? audio.duration : 0 }));
    const onEnded = () => {
      setState((s) => {
        if (s.mode === 'repeat-one') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return s;
        }
        const nextIndex =
          s.mode === 'shuffle'
            ? Math.floor(Math.random() * s.queue.length)
            : s.currentIndex + 1;
        if (nextIndex >= s.queue.length) {
          return { ...s, isPlaying: false };
        }
        const nextSong = s.queue[nextIndex];
        audio.src = nextSong.audioPublic ? `/${nextSong.audioPublic}` : '';
        audio.play().catch(() => {});
        return { ...s, currentSong: nextSong, currentIndex: nextIndex };
      });
    };
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, []);

  // Media Session API
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const song = state.currentSong;
    if (!song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: 'Next Being Lab',
      album: song.campaignTitle,
      artwork: song.heroVisual
        ? [{ src: `/${song.heroVisual}`, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => actions.next());
    navigator.mediaSession.setActionHandler('previoustrack', () => actions.prev());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentSong]);

  const actions: PlayerActions = {
    play: useCallback((song: Song, queue?: Song[]) => {
      const audio = audioRef.current;
      if (!audio) return;
      const q = queue ?? [song];
      const idx = q.findIndex((s) => s.slug === song.slug);
      const resolvedIdx = idx === -1 ? 0 : idx;
      audio.src = song.audioPublic ? `/${song.audioPublic}` : '';
      audio.play().catch(() => {});
      setState((s) => ({
        ...s,
        currentSong: song,
        queue: q,
        currentIndex: resolvedIdx,
        isMiniPlayerVisible: true,
      }));
    }, []),

    playCampaign: useCallback((songs: Song[], startSlug?: string) => {
      if (songs.length === 0) return;
      const start = startSlug ? songs.find((s) => s.slug === startSlug) ?? songs[0] : songs[0];
      actions.play(start, songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),

    playFavorites: useCallback((songs: Song[]) => {
      if (songs.length === 0) return;
      actions.play(songs[0], songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),

    toggle: useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    }, []),

    next: useCallback(() => {
      setState((s) => {
        const audio = audioRef.current;
        if (!audio || s.queue.length === 0) return s;
        const nextIndex =
          s.mode === 'shuffle'
            ? Math.floor(Math.random() * s.queue.length)
            : Math.min(s.currentIndex + 1, s.queue.length - 1);
        const nextSong = s.queue[nextIndex];
        audio.src = nextSong.audioPublic ? `/${nextSong.audioPublic}` : '';
        audio.play().catch(() => {});
        return { ...s, currentSong: nextSong, currentIndex: nextIndex };
      });
    }, []),

    prev: useCallback(() => {
      setState((s) => {
        const audio = audioRef.current;
        if (!audio || s.queue.length === 0) return s;
        // If more than 3s in, restart; else go prev
        if (audio.currentTime > 3) {
          audio.currentTime = 0;
          return s;
        }
        const prevIndex = Math.max(s.currentIndex - 1, 0);
        const prevSong = s.queue[prevIndex];
        audio.src = prevSong.audioPublic ? `/${prevSong.audioPublic}` : '';
        audio.play().catch(() => {});
        return { ...s, currentSong: prevSong, currentIndex: prevIndex };
      });
    }, []),

    seek: useCallback((seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = seconds;
    }, []),

    setMode: useCallback((mode: PlayMode) => {
      setState((s) => ({ ...s, mode }));
    }, []),

    addToQueue: useCallback((song: Song) => {
      setState((s) => ({ ...s, queue: [...s.queue, song] }));
    }, []),
  };

  return (
    <Ctx.Provider value={{ ...state, ...actions }}>
      {children}
    </Ctx.Provider>
  );
}
