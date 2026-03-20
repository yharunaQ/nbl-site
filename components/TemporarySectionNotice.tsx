import Head from 'next/head';
import Link from 'next/link';

type TemporarySectionNoticeProps = {
  sectionLabel: string;
  sectionNote: string;
};

export default function TemporarySectionNotice({
  sectionLabel,
  sectionNote,
}: TemporarySectionNoticeProps) {
  return (
    <>
      <Head>
        <title>{`${sectionLabel} | Temporarily Unavailable`}</title>
        <meta
          name="description"
          content={`${sectionLabel} is temporarily withheld from the public site while content review and staged release preparation continue.`}
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/70 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Temporary hold
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              {sectionLabel} は現在、公開サイトから一時的に外しています。
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-700">
              この領域は、試作要素や未整理の情報を含んでいたため、
              公開内容を見直す間は一時的な案内ページに切り替えています。
            </p>
            <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
              Current status: {sectionNote}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                トップへ戻る
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                連携・お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
