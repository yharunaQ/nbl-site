import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const title = searchParams.get('title') || 'Next Being Lab';
  const description =
    searchParams.get('description') ||
    'インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォーム';

  const fontData = await fetch(`${origin}/fonts/NotoSansJP-Regular.ttf`).then((res) =>
    res.arrayBuffer(),
  );

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
