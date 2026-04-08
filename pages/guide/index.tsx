import Link from 'next/link';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import { loadGuideBook, type GuideLayer, type GuideFrame } from '@/lib/guidebook/parseGuideBook';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PageProps = {
  layers: Array<{
    number: number;
    label: string;
    romanLabel: string;
    intro: string;
    frames: Array<{
      id: string;
      number: string;
      title: string;
      description: string;
    }>;
  }>;
};

// ---------------------------------------------------------------------------
// Static props
// ---------------------------------------------------------------------------

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const layers = await loadGuideBook();
  return {
    props: {
      layers: layers.map((l: GuideLayer) => ({
        number: l.number,
        label: l.label,
        romanLabel: l.romanLabel,
        intro: l.intro,
        frames: l.frames.map((f: GuideFrame) => ({
          id: f.id,
          number: f.number,
          title: f.title,
          description: f.description,
        })),
      })),
    },
  };
};

// ---------------------------------------------------------------------------
// Layer accent colours
// ---------------------------------------------------------------------------

const LAYER_ACCENT: Record<number, { bg: string; badge: string; border: string }> = {
  1: { bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', border: 'border-teal-200' },
  2: { bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-200' },
  3: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GuidePage({ layers }: InferGetStaticPropsType<typeof getStaticProps>) {
  const totalFrames = layers.reduce((s, l) => s + l.frames.length, 0);

  return (
    <>
      <PageSeo
        title="仕事設計ガイドブック | Next Being Lab"
        description="就労の困難を設計の課題として読み替える27のフレーム。当事者・支援者どちらにも使えるリファレンス。"
        path="/guide"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">

          {/* Header */}
          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Next Being Lab
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              仕事設計ガイドブック
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              就労の困難を「個人の問題」ではなく「設計の課題」として読み替える{totalFrames}のフレーム。
              <br />
              当事者が自分の状況を整理するためにも、支援者が現場で使うためにも設計されています。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/guide/download"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                PDFで入手する
              </Link>
              <Link
                href="/jac/next"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
              >
                はたらく相談室で相談する
              </Link>
            </div>
          </header>

          {/* 3-layer map */}
          <section className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              3つの設計層
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              まず「どの設計層で詰まっているか」を見てから、該当フレームを開いてください。
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {layers.map((layer) => {
                const accent = LAYER_ACCENT[layer.number] ?? LAYER_ACCENT[1];
                return (
                  <div
                    key={layer.number}
                    className={`rounded-2xl border ${accent.border} ${accent.bg} p-5`}
                  >
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}>
                      設計層{layer.romanLabel} — {layer.frames.length}フレーム
                    </span>
                    <p className="mt-3 font-semibold text-slate-900">
                      {layer.label.replace(/^設計層[ⅠⅡⅢ]\s*/, '')}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 line-clamp-3">
                      {layer.intro}
                    </p>
                    <a
                      href={`#layer-${layer.number}`}
                      className="mt-3 inline-block text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      フレーム一覧を見る ↓
                    </a>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Frame lists per layer */}
          {layers.map((layer) => {
            const accent = LAYER_ACCENT[layer.number] ?? LAYER_ACCENT[1];
            return (
              <section key={layer.number} id={`layer-${layer.number}`} className="mt-16">
                <div className="flex items-baseline gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}>
                    設計層{layer.romanLabel}
                  </span>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {layer.label.replace(/^設計層[ⅠⅡⅢ]\s*/, '')}
                  </h2>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {layer.frames.map((frame) => (
                    <Link
                      key={frame.id}
                      href={`/guide/${frame.id}`}
                      className={`group rounded-2xl border ${accent.border} bg-white p-5 transition hover:shadow-md`}
                    >
                      <p className="text-xs font-semibold text-slate-400">{frame.number}</p>
                      <p className="mt-1 font-semibold text-slate-900 group-hover:text-teal-700">
                        {frame.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">
                        {frame.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Footer note */}
          <footer className="mt-16 border-t border-slate-200 pt-8 text-xs text-slate-400">
            <p>
              最終判断は支援者と本人が持ちます。制度適用や個人情報の扱いは、法域・雇用区分・本人同意を確認して判断してください。
            </p>
            <p className="mt-1">
              根拠: 当事者データ n=9,076 + 支援者データ n=3,588 / FCHMAアトラス（8D×6M）
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
