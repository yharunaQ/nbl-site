import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

export default function GuideDownloadPage() {
  return (
    <>
      <PageSeo
        title="ダウンロード | 仕事設計ガイドブック | Next Being Lab"
        description="仕事設計ガイドブック（27フレーム版）のPDF・印刷用ダウンロード。"
        path="/guide/download"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_60%)] text-slate-900">
        <div className="mx-auto max-w-2xl px-6 py-16">

          <nav className="text-xs text-slate-400">
            <Link href="/guide" className="hover:text-slate-700">ガイドブック</Link>
            <span className="mx-2">/</span>
            <span>ダウンロード</span>
          </nav>

          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              PDFで入手する
            </h1>
            <p className="mt-3 text-base leading-8 text-slate-600">
              仕事設計ガイドブック（27フレーム版）を印刷・オフライン利用できるPDF形式でダウンロードできます。
            </p>
          </header>

          <div className="mt-10 space-y-4">
            <a
              href="/downloads/jac-27-frame-edition.pdf"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
              download
            >
              <div>
                <p className="font-semibold text-slate-900">仕事設計ガイドブック v3</p>
                <p className="mt-1 text-sm text-slate-500">
                  27フレーム完全版 — PDF形式
                </p>
              </div>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                ダウンロード
              </span>
            </a>

            <a
              href="/downloads/jac-27-frame-edition.html"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <p className="font-semibold text-slate-900">仕事設計ガイドブック v3</p>
                <p className="mt-1 text-sm text-slate-500">
                  27フレーム完全版 — HTML形式（印刷向け）
                </p>
              </div>
              <span className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                HTMLを開く
              </span>
            </a>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">利用について</p>
            <p className="mt-2 leading-7">
              就労支援・職場設計の実践目的での利用は自由です。
              商業利用・再配布の際は Next Being Lab（nbl.or.jp）への帰属表示をお願いします。
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/guide"
              className="text-sm text-slate-500 hover:text-slate-800 hover:underline"
            >
              ← フレーム一覧に戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
