import Link from 'next/link';
import { ArrowLeft, Map, Sparkles } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import ZoomableImage from '@/components/ZoomableImage';
import {
  jacFoundationEnterpriseSignals,
  jacFoundationInfographics,
} from '@/lib/content/jacFoundations';

export default function WorkDesignFoundationsPage() {
  const conditionMap = jacFoundationInfographics.find((item) => item.slug === 'condition-map');
  const otherInfographics = jacFoundationInfographics.filter((item) => item.slug !== 'condition-map');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_48%,#eef2ff_100%)] text-slate-900">
      <PageSeo
        title="仕事設計の基礎図解 | Next Being Lab"
        description="就労支援や仕事設計を理解するための基礎図解集。コンディションマップ・場の設計・雇用の正常化・質の指標を収録。"
        path="/resources/work-design-foundations"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab / リソース
            </p>
            <p className="mt-2 text-sm text-slate-600">仕事設計の基礎図解</p>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            リソース一覧へ
          </Link>
        </div>

        <section className="py-12">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
            基礎図解
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            仕事設計の基礎図解
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
            就労支援や仕事設計を理解するための基礎図解集です。コンディションマップ、場の設計、雇用の正常化、質の指標の4点を収録しています。
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            仕事設計の全体フレームワークについては{' '}
            <Link href="/jac/guide" className="text-sky-700 underline underline-offset-2 hover:text-sky-900">
              仕事設計ガイド（インタラクティブ）
            </Link>{' '}
            を参照してください。
          </p>
        </section>

        {conditionMap ? (
          <section id="condition-map" className="border-t border-slate-200 py-12">
            <div className="flex items-center gap-3">
              <Map size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">{conditionMap.title}</h2>
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
              <div>
                <p className="text-sm leading-7 text-slate-700">{conditionMap.summary}</p>
                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-900">この図が補うこと</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{conditionMap.whatItAdds}</p>
                </div>
                <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-900">企業読者への意味</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{conditionMap.businessMeaning}</p>
                </div>
              </div>
              <figure className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
                  <ZoomableImage
                    src={conditionMap.imageSrc}
                    alt={conditionMap.imageAlt}
                    width={2400}
                    height={1600}
                    imageClassName="h-auto max-h-[32rem] w-full object-contain"
                  />
                </div>
              </figure>
            </div>
          </section>
        ) : null}

        {otherInfographics.length > 0 ? (
          <section className="border-t border-slate-200 py-12">
            <div className="flex items-center gap-3">
              <Map size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">関連する基礎図解</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              コンディションマップと合わせて読むと、仕事設計としての論点がつながって見えてきます。
            </p>
            <div className="mt-6 space-y-8">
              {otherInfographics.map((item) => (
                <article
                  key={item.title}
                  id={item.slug}
                  className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 lg:grid-cols-[0.88fr,1.12fr] md:p-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                    <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                      <p className="text-sm font-semibold text-slate-900">この図が補うこと</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.whatItAdds}</p>
                    </div>
                    <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                      <p className="text-sm font-semibold text-slate-900">企業読者への意味</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.businessMeaning}</p>
                    </div>
                  </div>
                  <figure className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="overflow-hidden rounded-[1.3rem] bg-white p-2">
                      <ZoomableImage
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        width={2400}
                        height={1600}
                        imageClassName="h-auto max-h-[30rem] w-full object-contain"
                      />
                    </div>
                  </figure>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">企業担当者への示唆</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {jacFoundationEnterpriseSignals.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
              <h2 className="text-2xl font-black">次のステップ</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
                仕事設計の全体フレームワークや個別ケースの整理はこちらから。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/jac/guide"
                  className="rounded-full border border-slate-500 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
                >
                  仕事設計ガイド（インタラクティブ）
                </Link>
                <Link
                  href="/jac"
                  className="rounded-full border border-slate-500 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
                >
                  はたらく相談室（AI対話）
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-500 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-800"
                >
                  連携・お問い合わせ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
