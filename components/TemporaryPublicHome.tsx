import Head from 'next/head';

const CONTACT_EMAIL = 'info@nextbeinglab.org';
const YOUTUBE_URL = 'https://www.youtube.com/@next-being-lab';

export default function TemporaryPublicHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Next Being Lab',
    url: 'https://nextbeinglab.org',
    sameAs: [YOUTUBE_URL],
    description:
      'Next Being Lab is temporarily publishing a minimal public site while detailed resources are reviewed for staged release.',
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#ffffff_100%)] text-slate-900">
      <Head>
        <title>Next Being Lab | Public Site Update</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://nextbeinglab.org/" />
        <meta
          name="description"
          content="Next Being Lab is temporarily operating a minimal public site while detailed resources and prototype content are reorganized for staged release."
        />
        <meta name="robots" content="index,follow" />
        <meta property="og:site_name" content="Next Being Lab" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nextbeinglab.org/" />
        <meta property="og:title" content="Next Being Lab | Public Site Update" />
        <meta
          property="og:description"
          content="The public site is being reorganized. Detailed resources and prototype sections are temporarily withheld while content review continues."
        />
        <meta property="og:image" content="https://nextbeinglab.org/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Next Being Lab | Public Site Update" />
        <meta
          name="twitter:description"
          content="The public site is being reorganized while detailed resources and prototype sections are reviewed."
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
            <p className="mt-2 text-sm text-slate-600">Public-facing site in staged renewal</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Contact
          </a>
        </header>

        <section className="grid flex-1 items-start gap-10 py-12 md:grid-cols-[1.2fr,0.8fr] md:py-16">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              Temporary public release
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              NBLサイトは現在、公開内容を整理しながら段階的に組み直しています。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
              現在は、試作段階のページや未整理の資料をいったん公開面から外し、
              無難な仮公開版として運用しています。詳細なコンテンツ、プロトタイプ、
              連携導線は、内容の見直しと整備が済み次第、段階的に公開していきます。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                お問い合わせ
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                YouTubeを見る
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
              <p className="text-sm font-semibold text-slate-900">現在の公開方針</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                <li>試作ページや未完成の案内は、いったん公開面から外しています。</li>
                <li>障害就労・合理的配慮に関する詳細コンテンツは表現と文脈を再点検中です。</li>
                <li>完成版は、整理済みの内容から段階的に差し替えていく予定です。</li>
              </ul>
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

        <footer className="border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p>Next Being Lab</p>
          <p className="mt-2">障害就労、合理的配慮、働き方設計に関わる内容を段階的に整備しています。</p>
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
