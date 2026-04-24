import { SITE_URL } from '@/lib/siteMetadata';
import type { Song } from '@/lib/types/songs';

interface SongJsonLdProps {
  song: Song;
}

export default function SongJsonLd({ song }: SongJsonLdProps) {
  const pageUrl = `${SITE_URL}/resources/songs/${song.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Next Being Lab',
    },
    inAlbum: {
      '@type': 'MusicAlbum',
      name: song.campaignTitle,
    },
    url: pageUrl,
    ...(song.heroVisual ? { image: `${SITE_URL}/${song.heroVisual}` } : {}),
    ...(song.duration ? { duration: song.duration } : {}),
    description: song.shortConceptNote,
    keywords: [song.campaignTitle, 'インクルーシブ雇用', '就労支援', 'Next Being Lab'].join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
