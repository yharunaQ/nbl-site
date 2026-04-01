import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ArrowLeft, BookOpenText, NotebookPen, Route } from 'lucide-react';
import React from 'react';
import PageSeo from '@/components/PageSeo';
import {
  countWorkbookFrames,
  parseWorkbookSampleMarkdown,
  type WorkbookChapter,
} from '@/lib/content/workDesignEditorial';

type WorkDesignWorkbookPageProps = {
  chapters: WorkbookChapter[];
  frameCount: number;
};

export default function WorkDesignWorkbookPage({
  chapters,
  frameCount,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const isReviewRoute = router.pathname.startsWith('/review/');
  const frameReferenceHref = isReviewRoute ? '/review/work-design-frame-reference' : '/jac/frames';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_48%,#eef2ff_100%)] text-slate-900">
      <PageSeo
        title="先行5章版アーカイブ | Next Being Lab"
        description="重点5章の先行試作を、現在の26カード版と照らしながら読み直すための開発履歴ページ。"
        path="/jac/guidebook"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">先行5章版アーカイブ</p>
          </div>
          <Link
            href="/jac-foundations"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            見取り図へ戻る
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <Link
            href="/jac-foundations"
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-slate-300 hover:text-slate-900"
          >
            見取り図
          </Link>
          <span>→</span>
          <Link
            href={frameReferenceHref}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-slate-300 hover:text-slate-900"
          >
            26カード版
          </Link>
          <span>→</span>
          <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1.5 text-stone-700">
            参考資料
          </span>
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-emerald-900">
            先行5章版アーカイブ
          </span>
        </div>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.08fr,0.92fr]">
          <div>
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              開発履歴
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              重点5章の先行試作を、開発履歴として残す。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              この 5章版は、26フレームのまとめ方を試すために先行して書き起こした試作です。現在の本体は
              3/9 時点の 26カード版であり、このページはその前段でどう整理していたかを見返すための開発履歴として扱います。
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs text-slate-500">試作範囲</p>
                <p className="mt-2 text-lg font-black text-slate-900">{chapters.length}章</p>
              </div>
              <div className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs text-slate-500">現在の本体</p>
                <p className="mt-2 text-lg font-black text-slate-900">{frameCount}フレーム</p>
              </div>
              <div className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs text-slate-500">役割</p>
                <p className="mt-2 text-lg font-black text-slate-900">開発履歴</p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Route size={16} />
              役割の切り分け
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.4rem] border border-sky-200 bg-sky-50 px-4 py-4">
                <h2 className="text-lg font-black text-slate-900">いまの本体</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  26フレームの説明の仕方として、現在の正本に近いのは 3/9 時点の 26カード版です。
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-4">
                <h2 className="text-lg font-black text-slate-900">このページの役割</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  先行5章版がどのように利用者向けのまとめ方を試していたかを確認する、開発履歴です。
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4">
                <h2 className="text-lg font-black text-amber-950">いま優先していること</h2>
                <p className="mt-2 text-sm leading-7 text-amber-900">
                  ここで有効だったまとめ方を 26カード版や他の前段階の面へ逆輸入することです。主導線には戻しません。
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <NotebookPen size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">重点5章の試作記録</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            現時点で、ここは `次に読むべき主導線` ではありません。重点5章でどの書き方が利用者に伝わりやすかったかを確認し、
            その工夫を 26カード版や他の面へ戻すための試作記録として見ます。
          </p>

          <div className="mt-8 space-y-6">
            {chapters.map((chapter) => (
              <article
                key={`${chapter.chapterLabel}-${chapter.title}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 md:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {chapter.chapterLabel}
                    </p>
                    <h3 className="mt-3 text-2xl font-black text-slate-900">{chapter.title}</h3>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                    試作記録
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {chapter.intro.slice(0, 3).map((paragraph) => (
                    <p key={`${chapter.title}-${paragraph}`} className="text-sm leading-7 text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {chapter.sections.map((section) => (
                    <section
                      key={`${chapter.title}-${section.title}`}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5"
                    >
                      <h4 className="text-lg font-black text-slate-900">{section.title}</h4>
                      {section.paragraphs.slice(0, 1).map((paragraph) => (
                        <p
                          key={`${section.title}-${paragraph}`}
                          className="mt-3 text-sm leading-7 text-slate-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {section.bullets.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                          {section.bullets.map((item) => (
                            <li key={`${section.title}-${item}`}>• {item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <BookOpenText size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">この試作記録でしないこと</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                <li>• 現在の本体より先に、この試作版を主導線へ戻すこと。</li>
                <li>• 26カード版より新しい正本であるかのように扱うこと。</li>
                <li>• checkout や販売導線を前面に出し、現在のコアを sales-first に見せること。</li>
              </ul>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <NotebookPen size={18} className="text-emerald-700" />
                <h2 className="text-2xl font-black text-slate-900">この試作記録の使い方</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                <li>• フレームの意味を確かめたいときは、26カード版へ戻る。</li>
                <li>• 本線の見え方を確認したいときは、見取り図と 26カード版を往復する。</li>
                <li>• 個別設計が必要な案件は、公開面で完結させず連携ベースの route へ戻す。</li>
              </ul>
            </article>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">関連する面</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              現在の本体は 26カード版です。必要ならこの試作記録を参照しつつ、主導線としては 26カード版へ戻ります。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={frameReferenceHref}
                className="rounded-full border border-slate-500 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                26カード版を見る
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-500 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-800"
              >
                連携・お問い合わせ
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<WorkDesignWorkbookPageProps> = async () => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const samplePath = path.join(process.cwd(), 'docs', 'guidebook', 'jac-focus5-guidebook-sample.md');
  const cardEditionPath = path.join(process.cwd(), 'docs', 'guidebook', 'jac-26-card-edition.md');

  const [sampleMarkdown, cardEditionMarkdown] = await Promise.all([
    fs.readFile(samplePath, 'utf8'),
    fs.readFile(cardEditionPath, 'utf8'),
  ]);

  return {
    props: {
      chapters: parseWorkbookSampleMarkdown(sampleMarkdown),
      frameCount: countWorkbookFrames(cardEditionMarkdown),
    },
  };
};
