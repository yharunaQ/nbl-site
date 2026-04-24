import path from 'node:path';
import { promises as fs } from 'node:fs';
import type {
  Song,
  Campaign,
  GeneratedSongsData,
  SongsByInfographic,
  SongsByResourcePath,
  SongsByCampaign,
  WeeklyPickFile,
} from '@/lib/types/songs';
import { parse as parseYaml } from 'yaml';

const MEDIA_ROOT = path.join(process.cwd(), 'content/media/songs');

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function readYaml<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return parseYaml(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getAllSongs(): Promise<Song[]> {
  const data = await readJson<GeneratedSongsData>(
    path.join(MEDIA_ROOT, 'generated.json'),
    { songs: [], generatedAt: '' },
  );
  return data.songs;
}

export async function getPublicSongs(): Promise<Song[]> {
  const songs = await getAllSongs();
  return songs.filter((s) => s.status === 'public');
}

export async function getSongBySlug(slug: string): Promise<Song | undefined> {
  const songs = await getAllSongs();
  return songs.find((s) => s.slug === slug);
}

interface CampaignYaml {
  slug: string;
  title_ja: string;
  headline: string;
  summary: string;
  tone_color: string;
  related_campaigns?: string[];
}

export async function getCampaigns(): Promise<Campaign[]> {
  const raw = await readYaml<CampaignYaml[]>(path.join(MEDIA_ROOT, 'campaigns.yml'), []);
  return raw.map((c) => ({
    slug: c.slug as Campaign['slug'],
    titleJa: c.title_ja,
    headline: c.headline,
    summary: c.summary,
    toneColor: c.tone_color,
    relatedCampaigns: (c.related_campaigns ?? []) as Campaign['relatedCampaigns'],
  }));
}

export async function getByInfographic(): Promise<SongsByInfographic> {
  return readJson<SongsByInfographic>(path.join(MEDIA_ROOT, 'by-infographic.json'), {});
}

export async function getByResourcePath(): Promise<SongsByResourcePath> {
  return readJson<SongsByResourcePath>(path.join(MEDIA_ROOT, 'by-resource-path.json'), {});
}

export async function getByCampaign(): Promise<SongsByCampaign> {
  return readJson<SongsByCampaign>(path.join(MEDIA_ROOT, 'by-campaign.json'), {});
}

export async function getWeeklyPick(): Promise<WeeklyPickFile | null> {
  return readYaml<WeeklyPickFile | null>(path.join(MEDIA_ROOT, 'weekly-pick.yml'), null);
}

export async function getWeeklyPickSongs(): Promise<Song[]> {
  const [pick, allSongs] = await Promise.all([getWeeklyPick(), getPublicSongs()]);
  if (!pick?.current?.picks) return [];
  return pick.current.picks
    .map((p) => allSongs.find((s) => s.slug === p.slug))
    .filter((s): s is Song => s !== undefined);
}
