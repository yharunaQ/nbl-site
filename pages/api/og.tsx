import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

const CAMPAIGN_COLORS: Record<string, string> = {
  'reasonable-accommodation': '#059669',
  'inclusive-employment': '#0284c7',
  'disability-awareness': '#7c3aed',
  'care-work-employment-bridge': '#0d9488',
};

async function renderSongOg(
  origin: string,
  slug: string,
  fontData: ArrayBuffer,
): Promise<ImageResponse> {
  // Fetch song data from the batch API
  let title = 'Next Being Lab';
  let catchphrase = '';
  let campaignTitle = '';
  let campaignSlug = '';
  let heroVisual = '';

  try {
    const res = await fetch(`${origin}/api/songs/batch?slugs=${encodeURIComponent(slug)}`);
    const songs = await res.json();
    const song = songs[0];
    if (song) {
      title = song.title;
      catchphrase = song.catchphrase;
      campaignTitle = song.campaignTitle;
      campaignSlug = song.campaignSlug;
      heroVisual = song.heroVisual ? `${origin}/${song.heroVisual}` : '';
    }
  } catch {
    // fall through to default
  }

  const accentColor = CAMPAIGN_COLORS[campaignSlug] ?? '#14b8a6';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          fontFamily: '"Noto Sans JP"',
          position: 'relative',
        }}
      >
        {/* Hero image left half */}
        {heroVisual ? (
          <div
            style={{
              display: 'flex',
              width: '50%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroVisual}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent, #0f172a)',
              }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', width: '50%', backgroundColor: '#1e293b' }} />
        )}

        {/* Right panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '52px 56px',
            justifyContent: 'center',
          }}
        >
          {/* Campaign badge */}
          {campaignTitle && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                }}
              />
              <span style={{ fontSize: '13px', color: '#64748b', letterSpacing: '0.1em' }}>
                {campaignTitle}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 10 ? '44px' : '56px',
              fontWeight: 700,
              color: '#f8fafc',
              lineHeight: 1.3,
              marginBottom: '20px',
            }}
          >
            {title}
          </div>

          {/* Catchphrase */}
          {catchphrase && (
            <div style={{ fontSize: '20px', color: '#94a3b8', lineHeight: 1.6 }}>
              {catchphrase}
            </div>
          )}

          {/* NBL badge bottom */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: 'auto',
              paddingTop: '32px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: accentColor,
              }}
            />
            <span style={{ fontSize: '13px', color: '#475569' }}>nextbeinglab.org</span>
          </div>
        </div>

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            backgroundColor: accentColor,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Noto Sans JP', data: fontData, weight: 400, style: 'normal' }],
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  );
}

export default async function handler(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const type = searchParams.get('type');
  const title = searchParams.get('title') || 'Next Being Lab';
  const description =
    searchParams.get('description') ||
    'インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォーム';

  const fontData = await fetch(`${origin}/fonts/NotoSansJP-Regular.ttf`).then((res) =>
    res.arrayBuffer(),
  );

  if (type === 'song') {
    const slug = searchParams.get('slug') ?? '';
    return renderSongOg(origin, slug, fontData);
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          padding: '60px 72px',
          fontFamily: '"Noto Sans JP"',
          position: 'relative',
        }}
      >
        {/* Left teal accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            backgroundColor: '#14b8a6',
          }}
        />

        {/* Top URL badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#14b8a6',
            }}
          />
          <span
            style={{
              fontSize: '15px',
              letterSpacing: '0.15em',
              color: '#64748b',
            }}
          >
            nextbeinglab.org
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: title.length > 24 ? '44px' : title === 'Next Being Lab' ? '72px' : '56px',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.25,
            maxWidth: '980px',
            marginBottom: '28px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '26px',
            color: '#94a3b8',
            lineHeight: 1.7,
            maxWidth: '860px',
          }}
        >
          {description}
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '78px',
            right: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '18px', color: '#334155' }}>
            AIで余力をつくり、人が参加できる仕事を増やす。
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '24px',
              padding: '10px 22px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#14b8a6',
              }}
            />
            <span style={{ fontSize: '15px', color: '#64748b' }}>Next Being Lab</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
}
