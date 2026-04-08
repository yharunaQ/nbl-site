import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

export default function OrganizationsPage() {
  return (
    <>
      <PageSeo
        title="職場・組織設計 | Next Being Lab"
        description="個人の配慮を超えた、職場・組織の環境設計。日本データから導いたインクルーシブ雇用の実践知識。"
        path="/organizations"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">

          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              職場・組織設計
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              職場の環境を変えたい
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              個別の配慮を超えた、職場・組織設計の知識。支援機関の管理職・機関長と、企業のHR・産業医に向けた実践ガイドです。
            </p>
          </header>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Link
              href="/organizations/design"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
            >
              <span className="self-start rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                組織設計
              </span>
              <p className="mt-4 font-semibold text-slate-900 group-hover:text-teal-700">
                インクルーシブ職場設計
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">
                日本データが独立に再発見したIPS/SE原則。「誰を枠に当てはめるか」でなく「仕事をどう設計するか」という転換。
              </p>
              <span className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-teal-600">読む →</span>
            </Link>

            <div className="flex flex-col rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <span className="self-start rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                準備中
              </span>
              <p className="mt-4 font-semibold text-slate-600">組織診断</p>
              <p className="mt-2 text-sm leading-7 text-slate-400 flex-1">
                「なぜ支援者が動けない組織になっているか」を診断する簡易ツール。Q14データに基づく5つの診断軸。
              </p>
              <span className="mt-4 text-xs text-slate-400">近日公開予定</span>
            </div>
          </div>

          {/* Callout for practitioners */}
          <div className="mt-12 rounded-2xl border border-teal-200 bg-teal-50 px-6 py-5">
            <p className="text-sm font-semibold text-teal-800">支援者・当事者の方へ</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              今の相談事例を整理したい場合は{' '}
              <Link href="/jac/next" className="font-semibold text-teal-700 hover:underline">
                はたらく相談室
              </Link>
              へ。典型的な困難パターンを調べたい場合は{' '}
              <Link href="/guide" className="font-semibold text-teal-700 hover:underline">
                仕事設計ガイドブック
              </Link>
              へ。
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
