// Shared contract for Heron and Falcon.
// Breaking changes (field removal / semantic change) require major versioning.
// Additive changes (new optional fields) are backwards-compatible.

export type SongStatus = 'inbox' | 'review' | 'public' | 'hold';

export type CampaignSlug =
  | 'reasonable-accommodation'
  | 'inclusive-employment'
  | 'disability-awareness'
  | 'care-work-employment-bridge';

export interface Song {
  // identity
  slug: string;
  title: string;
  campaignSlug: CampaignSlug;
  campaignTitle: string;
  status: SongStatus;
  releaseDate?: string; // ISO date YYYY-MM-DD

  // content
  catchphrase: string;
  shortConceptNote: string;
  lyrics: string;
  duration?: string; // "3:12"
  companionBoundaryNote: string;
  primaryAudience: string;
  secondaryAudience?: string;

  // assets (all paths relative to /public)
  heroVisual?: string; // "songs/still/slug.jpg"
  audioPublic?: string; // "songs/audio/slug.mp3"
  lyricCard?: string; // "songs/lyric-card/slug.jpg"
  youtubeId?: string;

  // cross-links
  relatedSongSlugs: string[];
  relatedCampaignSlugs: string[];
  relatedResourcePaths: string[];
  relatedInfographicKeys: string[];

  // share copy
  shareCopyX?: string;
  shareCopyThreads?: string;
  shareCopyLine?: string;

  // source
  notePath: string; // relative path to campaign-song-note.md
}

export interface Campaign {
  slug: CampaignSlug;
  titleJa: string;
  headline: string;
  summary: string;
  toneColor: string; // tailwind color name, e.g. "emerald"
  relatedCampaigns: CampaignSlug[];
}

export interface WeeklyPickEntry {
  slug: string;
  note: string;
}

export interface WeeklyPick {
  weekOf: string; // ISO date YYYY-MM-DD
  picks: WeeklyPickEntry[];
}

export interface WeeklyPickFile {
  current: WeeklyPick;
  archive: WeeklyPick[];
}

// Generated index files

export interface SongsByInfographic {
  [infographicKey: string]: string[]; // slug[]
}

export interface SongsByResourcePath {
  [resourcePath: string]: string[]; // slug[]
}

export interface SongsByCampaign {
  [campaignSlug: string]: string[]; // slug[]
}

export interface GeneratedSongsData {
  songs: Song[];
  generatedAt: string; // ISO datetime
}

// Reaction API response shapes (mirrors Cloudflare Workers response)

export interface SongReaction {
  slug: string;
  likes: number;
  plays: number;
  shares: number;
}

export interface TopReactionEntry {
  slug: string;
  value: number;
}
