import Head from 'next/head';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import { founderProfile } from '@/lib/content/founderProfile';

const CONTACT_EMAIL = 'info@nextbeinglab.org';
const JAC_PUBLIC_LABEL = '仕事設計の見取り図';
const CONTACT_GUIDE_HREF = '/contact';
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
  '仕事設計の見取り図の基礎説明',
  '3レイヤーと 26フレームの紹介',
  '連携・お問い合わせの入口',
];

const ENTRY_POINTS = [
  {
    title: JAC_PUBLIC_LABEL,
    detail:
      '困りごとを「本人の問題」だけにせず、体調・移行・職場運用の 3レイヤーで読むための基礎ページです。',
    href: '/jac-foundations',
    cta: '仕事設計の見取り図を見る',
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
      <PageSeo
        title="Next Being Lab | 公開中の案内"
        description="Next Being Lab が、内容を整理・再構築しながら現在公開している考え方、動画、仕事設計の見取り図をまとめた入口ページ。"
        path="/"
      />
      <Head>
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
          <Link
            href={CONTACT_GUIDE_HREF}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            連携・お問い合わせ
          </Link>
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
              合理的配慮、継続就労、ニューロダイバーシティ、相談導線、方法論の基礎など、NBL
              が扱う内容を、 読みやすい順序で段階的に公開しています。
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              公開面も、AIネイティブな運営と実装の前提に合わせて整理・再構築を進めています。いまは、考え方の骨格と、
              実際に見られる入口を先に揃えています。
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              障害就労は重要な実装領域ですが、NBL の関心はそこだけに留まりません。AI
              が働く時代に、人が機械のように働く以外の形でも参加できる仕事や社会の設計を、少しずつ形にしていこうとしています。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={CONTACT_GUIDE_HREF}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                連携・お問い合わせ
              </Link>
              <Link
                href="/jac-foundations"
                className="rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
              >
                仕事設計の見取り図を見る
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
              <p className="text-sm font-semibold">この段階でも話を始められること</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                <li>公開中コンテンツの内容確認や連携の打診</li>
                <li>登壇、研究、実装、伴走に関する相談</li>
                <li>公開準備中コンテンツについての問い合わせ</li>
              </ul>
            </section>
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="rounded-[2rem] border border-sky-200 bg-sky-50/80 p-8 shadow-sm shadow-sky-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-900">
              最重要の基礎説明
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">{JAC_PUBLIC_LABEL}とは</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-700">
              困りごとを「本人の問題」だけで片づけず、仕事・環境・支援の条件と、
              体調・移行・職場運用の 3レイヤーで読むための地図です。
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
                <h3 className="text-lg font-black text-slate-900">体調レイヤー</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  体調変動、治療、疲労、生活リズムなど、働く前提条件を見る。
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
                <h3 className="text-lg font-black text-slate-900">移行レイヤー</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  採用、復職、オンボーディング、定着の工程で詰まりが出る場所を見る。
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
                <h3 className="text-lg font-black text-slate-900">職場運用レイヤー</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  指示、会議、情報共有、評価、相談導線など日常の運用設計を見る。
                </p>
              </div>
            </div>
            <Link
              href="/jac-foundations"
              className="mt-6 inline-flex rounded-full border border-sky-300 bg-white px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
            >
              仕事設計の見取り図を見る
            </Link>
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900">NBLの基本的な考え方</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            NBL は、障害者雇用だけの narrow なサイトではなく、AI
            が働く時代に人間の参加をどう設計し直すかを考えるプロジェクトです。いま公開している障害就労や合理的配慮の内容も、その大きな問いの中に位置づいています。
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

        <section className="border-t border-slate-200 py-10">
          <div className="grid gap-5 lg:grid-cols-[1.05fr,0.95fr]">
            <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Founder / NBL
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">{founderProfile.name}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-700">{founderProfile.role}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{founderProfile.summary}</p>
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4 text-sm leading-7 text-slate-700">
                {founderProfile.stance}
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-950"
              >
                Founder と NBL の背景を見る
              </Link>
            </article>

            <article className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-sm shadow-slate-300/50">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                Contact
              </p>
              <h2 className="mt-3 text-2xl font-black">連絡前に分かること</h2>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-200">
                <li>• どんなテーマで話を始めやすいか</li>
                <li>• 初回の連絡がどの形か</li>
                <li>• Founder と NBL の背景</li>
                <li>• まだ固定していない約束</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={CONTACT_GUIDE_HREF}
                  className="rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  連携・お問い合わせ
                </Link>
              </div>
            </article>
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p>Next Being Lab</p>
          <p className="mt-2">
            障害就労、合理的配慮、働き方設計、AI時代の組織運用に関わる内容を段階的に整備しています。
          </p>
          <p className="mt-2">
            連携・お問い合わせ:{' '}
            <Link
              href={CONTACT_GUIDE_HREF}
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
            >
              /contact
            </Link>
          </p>
          <p className="mt-2">
            Mail:{' '}
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
