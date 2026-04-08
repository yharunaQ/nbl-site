import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import {
  loadGuideBook,
  type GuideFrame,
  type GuideFrameSection,
  type GuideLayer,
} from '@/lib/guidebook/parseGuideBook';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SerializedFrame = {
  id: string;
  number: string;
  title: string;
  layer: number;
  layerLabel: string;
  description: string;
  focus: string;
  sceneContext: string;
  sections: GuideFrameSection[];
};

type PageProps = {
  frame: SerializedFrame;
  prevFrame: { id: string; number: string; title: string } | null;
  nextFrame: { id: string; number: string; title: string } | null;
};

// ---------------------------------------------------------------------------
// Static paths + props
// ---------------------------------------------------------------------------

export const getStaticPaths: GetStaticPaths = async () => {
  const layers = await loadGuideBook();
  const paths = layers
    .flatMap((l: GuideLayer) => l.frames)
    .map((f: GuideFrame) => ({ params: { 'frame-id': f.id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const frameId = params?.['frame-id'] as string;
  const layers = await loadGuideBook();
  const allFrames = layers.flatMap((l: GuideLayer) => l.frames);
  const idx = allFrames.findIndex((f: GuideFrame) => f.id === frameId);

  if (idx === -1) return { notFound: true };

  const frame = allFrames[idx];
  const prev = idx > 0 ? allFrames[idx - 1] : null;
  const next = idx < allFrames.length - 1 ? allFrames[idx + 1] : null;

  function slim(f: GuideFrame) {
    return { id: f.id, number: f.number, title: f.title };
  }

  return {
    props: {
      frame: {
        id: frame.id,
        number: frame.number,
        title: frame.title,
        layer: frame.layer,
        layerLabel: frame.layerLabel,
        description: frame.description,
        focus: frame.focus,
        sceneContext: frame.sceneContext,
        sections: frame.sections,
      },
      prevFrame: prev ? slim(prev) : null,
      nextFrame: next ? slim(next) : null,
    },
  };
};

// ---------------------------------------------------------------------------
// Markdown → React helpers
// ---------------------------------------------------------------------------

/** Render inline markdown: **bold**, `code` */
function inlineRender(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="rounded bg-slate-100 px-1 text-xs">{part.slice(1, -1)}</code>;
    return part;
  });
}

/** Render a section body (bullet lists + paragraphs). */
function SectionBody({ body }: { body: string }) {
  const lines = body.split('\n');
  const nodes: React.ReactNode[] = [];
  let bullets: string[] = [];

  function flushBullets() {
    if (!bullets.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="mt-2 space-y-1.5 pl-4">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm leading-7 text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            <span>{inlineRender(b)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets();
      continue;
    }
    if (trimmed.startsWith('- ')) {
      bullets.push(trimmed.slice(2));
      continue;
    }
    // Table rows (| … |) — render as monospace paragraph for now
    if (trimmed.startsWith('|')) {
      flushBullets();
      nodes.push(
        <p key={`tr-${nodes.length}`} className="mt-1.5 text-xs leading-6 text-slate-500 font-mono">
          {trimmed}
        </p>,
      );
      continue;
    }
    // Status level lines (🟢 / 🟡 / 🔴 / 💣)
    if (/^[🟢🟡🔴💣]/.test(trimmed)) {
      flushBullets();
      const [icon, ...rest] = trimmed.split(' ');
      nodes.push(
        <div key={`sl-${nodes.length}`} className="mt-2 flex gap-2 text-sm leading-7 text-slate-700">
          <span>{icon}</span>
          <span>{inlineRender(rest.join(' '))}</span>
        </div>,
      );
      continue;
    }
    // Plain paragraph
    flushBullets();
    nodes.push(
      <p key={`p-${nodes.length}`} className="mt-2 text-sm leading-7 text-slate-700">
        {inlineRender(trimmed)}
      </p>,
    );
  }
  flushBullets();
  return <>{nodes}</>;
}

// ---------------------------------------------------------------------------
// Layer accent
// ---------------------------------------------------------------------------

const LAYER_ACCENT: Record<number, { badge: string; border: string; dot: string }> = {
  1: { badge: 'bg-teal-100 text-teal-800', border: 'border-teal-200', dot: 'bg-teal-500' },
  2: { badge: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  3: { badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
};

// h5 sections that get visual emphasis
const HIGHLIGHT_SECTIONS = new Set(['外部と一緒に考える場面', '最初にやること', '設計の考え方']);

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FramePage({
  frame,
  prevFrame,
  nextFrame,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const accent = LAYER_ACCENT[frame.layer] ?? LAYER_ACCENT[1];

  // Group sections into h4 parents with h5 children
  const grouped: Array<{ h4: GuideFrameSection; children: GuideFrameSection[] }> = [];
  for (const sec of frame.sections) {
    if (sec.level === 4) {
      grouped.push({ h4: sec, children: [] });
    } else if (grouped.length > 0) {
      grouped[grouped.length - 1].children.push(sec);
    }
  }

  return (
    <>
      <PageSeo
        title={`${frame.number} ${frame.title} | 仕事設計ガイドブック`}
        description={frame.description}
        path={`/guide/${frame.id}`}
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_60%,#eef2ff_100%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/guide" className="hover:text-slate-700">ガイドブック</Link>
            <span>/</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badge}`}>
              {frame.layerLabel}
            </span>
          </nav>

          {/* Frame header */}
          <header className="mt-6">
            <p className="text-sm font-semibold text-slate-400">{frame.number}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {frame.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-700">{frame.description}</p>

            {frame.focus && (
              <div className={`mt-5 rounded-2xl border ${accent.border} bg-white px-5 py-4`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  着眼点
                </p>
                <p className="mt-1.5 text-sm leading-7 text-slate-800">{frame.focus}</p>
              </div>
            )}
          </header>

          {/* Sections */}
          <div className="mt-10 space-y-8">
            {grouped.map(({ h4, children }) => (
              <section key={h4.heading}>
                <h2 className="text-base font-semibold text-slate-900">{h4.heading}</h2>
                {h4.body.trim() && (
                  <div className="mt-2">
                    <SectionBody body={h4.body} />
                  </div>
                )}
                <div className="mt-4 space-y-5">
                  {children.map((child) => {
                    const isHighlighted = HIGHLIGHT_SECTIONS.has(child.heading);
                    return (
                      <div
                        key={child.heading}
                        className={
                          isHighlighted
                            ? `rounded-2xl border ${accent.border} bg-white px-5 py-4`
                            : 'pl-1'
                        }
                      >
                        <h3
                          className={`text-sm font-semibold ${
                            isHighlighted ? 'text-slate-800' : 'text-slate-600'
                          }`}
                        >
                          {child.heading}
                        </h3>
                        <SectionBody body={child.body} />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Navigation */}
          <nav className="mt-14 flex items-center justify-between gap-4 border-t border-slate-200 pt-8">
            {prevFrame ? (
              <Link
                href={`/guide/${prevFrame.id}`}
                className="group flex flex-col gap-0.5 text-sm text-slate-500 hover:text-slate-900"
              >
                <span className="text-xs text-slate-400">← 前のフレーム</span>
                <span className="font-semibold group-hover:underline">
                  {prevFrame.number} {prevFrame.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextFrame ? (
              <Link
                href={`/guide/${nextFrame.id}`}
                className="group flex flex-col items-end gap-0.5 text-sm text-slate-500 hover:text-slate-900"
              >
                <span className="text-xs text-slate-400">次のフレーム →</span>
                <span className="font-semibold group-hover:underline">
                  {nextFrame.number} {nextFrame.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <div className="mt-6 text-center">
            <Link
              href="/guide"
              className="text-sm text-slate-500 hover:text-slate-800 hover:underline"
            >
              ← フレーム一覧に戻る
            </Link>
          </div>

          {/* Disclaimer */}
          <footer className="mt-12 text-xs text-slate-400">
            最終判断は支援者と本人が持ちます。
          </footer>
        </div>
      </main>
    </>
  );
}
