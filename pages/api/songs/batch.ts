import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllSongs } from '@/lib/songs';
import type { Song } from '@/lib/types/songs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Song[]>) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  const raw = req.query.slugs;
  const slugs = (Array.isArray(raw) ? raw[0] : raw ?? '').split(',').filter(Boolean);
  const allSongs = await getAllSongs();
  const found = slugs
    .map((slug) => allSongs.find((s) => s.slug === slug && s.status === 'public'))
    .filter((s): s is Song => s !== undefined);
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  res.json(found);
}
