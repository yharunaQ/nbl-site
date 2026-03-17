import Head from 'next/head';
import Link from 'next/link';

const CONTACT_EMAIL = 'info@nextbeinglab.org';
const CURRENT_TOPICS = [
  {
    title: '合理的配慮を職場設計として考える',
    detail: '思いやりや特別対応ではなく、仕事・情報・運用の調整として捉える。',
  },
  {
    title: '辞めなくて済む設計を先に作る',
    detail: '中途障害者の継続雇用や働き続けやすさを、個別事情と職場設計の両方から考える。',
  },
  {
    title: 'ニューロダイバーシティを実務に落とす',
    detail: '採用や評価の偏り、曖昧な指示、同時処理負荷などを仕事設計の論点として見直す。',
  },
  {
    title: '相談しやすい導線と秘密保持を設計する',
    detail: '開示しにくさや不利益への不安も含め、相談・情報共有・支援連携の設計を考える。',
  },
];

const CORE_POSITIONS = [
  {
    title: 'AIで人を不要にするのではない',
    detail:
      'NBL が目指すのは、人間を消すことではなく、AIで人間の限界を超える実装を進めながら、人が人として参加できる器を広げることです。',
  },
  {
    title: '人が機械のように働かなくても参加できる設計',
    detail:
      'AIが働く時代に、同じ働き方を人へ強化するのではなく、個性や強みを活かして参加できる仕事や役割を増やすことを重視しています。',
  },
  {
    title: '障害就労は重要な実装領域の一つ',
    detail:
      '障害や病気のある人の働きづらさは、仕事や社会の設計課題が見えやすく現れる重要な領域です。NBL はそこを入り口に、より広い参加の設計を考えています。',
  },
];

const PUBLIC_NOW = [
  'NBL の考え方と全体方向',
  '公開中の動画一覧',
  'JAC 26フレームの考え方と 3レイヤー紹介',
  'JAC を含む方法論の位置づけ',
  'お問い合わせによる連携相談',
];

const ENTRY_POINTS = [
  {
    title: 'JACの基礎説明',
    detail: '3レイヤー、読み方、基礎図解を含めて JAC の考え方を整理した入口です。',
    href: '/jac-foundations',
    cta: 'JACの考え方を見る',
  },
  {
    title: '公開中の動画',
    detail: '現在公開している動画を、サムネイル付きの一覧で見られる入口です。',
    href: '/videos',
    cta: '動画一覧を見る',
  },
  {
    title: '企業向けの整理',
    detail: '企業や組織の担当者向けに、職場設計の実務テーマをまとめたページです。',
    href: '/for-enterprise',
    cta: '企業向けの整理を見る',
  },
];

export default function TemporaryPublicHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Next Being Lab',
    url: 'https://nextbeinglab.org',
    description:
      'Next Being Lab is reorganizing and rebuilding its public-facing content while publishing the clearest current entry points first.',
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#ffffff_100%)] text-slate-900">
      <Head>
        <title>Next Being Lab | 公開中の案内</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://nextbeinglab.org/" />
        <meta
          name="description"
          content="Next Being Lab が、内容を整理・再構築しながら現在公開している考え方、動画、JAC の基礎説明をまとめた入口ページ。"
        />
        <meta name="robots" content="index,follow" />
        <meta property="og:site_name" content="Next Being Lab" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nextbeinglab.org/" />
        <meta property="og:title" content="Next Being Lab | 公開中の案内" />
        <meta
          property="og:description"
          content="内容を整理・再構築しながら、現在公開している考え方、動画、JAC の基礎説明を見られる入口です。"
        />
        <meta property="og:image" content="https://nextbeinglab.org/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Next Being Lab | 公開中の案内" />
        <meta
          name="twitter:description"
          content="Next Being Lab が、内容を整理・再構築しながら現在公開している考え方、動画、JAC の基礎説明を見られる入口です。"
        />
        <meta name="twitter:image" content="https://nextbeinglab.org/og.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 md:py-14">
        <header className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">公開中の案内</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            お問い合わせ
          </a>
        </header>

        <section className="grid flex-1 items-start gap-10 py-12 md:grid-cols-[1.2fr,0.8fr] md:py-16">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              内容整理・再構築中
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              NBL は現在、公開面を整理しながら、使いやすい入口から順に組み直しています。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
              合理的配慮、継続就労、ニューロダイバーシティ、相談導線、方法論の基礎など、NBL が扱う内容を、
              読みやすい順序で段階的に公開しています。
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              公開面も、AIネイティブな運営と実装の前提に合わせて整理・再構築を進めています。いまは、考え方の骨格と、
              実際に見られる入口を先に揃えています。
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              障害就労は重要な実装領域ですが、NBL の関心はそこだけに留まりません。AI が働く時代に、人が機械のように働く以外の形でも参加できる仕事や社会の設計を、少しずつ形にしていこうとしています。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                お問い合わせ
              </a>
              <Link
                href="/jac-foundations"
                className="rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
              >
                JACの考え方を見る
              </Link>
              <Link
                href="/videos"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                公開中の動画を見る
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
              <p className="text-sm font-semibold text-slate-900">いま見られる内容</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                {PUBLIC_NOW.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm shadow-sky-100">
              <p className="text-sm font-semibold text-slate-900">現在の公開方針</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                公開面は、運営と実装の前提を整理しながら段階的に組み直しています。いまは、まず理解と利用に役立つ入口を優先して公開しています。
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-sm shadow-slate-300/50">
              <p className="text-sm font-semibold">この間に受け付けること</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                <li>内容確認や連携相談のお問い合わせ</li>
                <li>登壇、研究、実装、伴走のご相談</li>
                <li>公開準備中コンテンツに関する確認連絡</li>
              </ul>
            </section>
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900">NBLの基本的な考え方</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            NBL は、障害者雇用だけの narrow なサイトではなく、AI が働く時代に人間の参加をどう設計し直すかを考えるプロジェクトです。いま公開している障害就労や合理的配慮の内容も、その大きな問いの中に位置づいています。
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {CORE_POSITIONS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="grid gap-5 md:grid-cols-2">
            {CURRENT_TOPICS.map((topic) => (
              <article
                key={topic.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h2 className="text-xl font-black text-slate-900">{topic.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{topic.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900">公開中の入口</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {ENTRY_POINTS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
                >
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p>Next Being Lab</p>
          <p className="mt-2">
            障害就労、合理的配慮、働き方設計、AI時代の組織運用に関わる内容を段階的に整備しています。
          </p>
          <p className="mt-2">
            Contact:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
