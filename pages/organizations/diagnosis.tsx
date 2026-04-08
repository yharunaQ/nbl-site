import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

export default function OrganizationsDiagnosisPage() {
  return (
    <>
      <PageSeo
        title="組織診断（準備中）| Next Being Lab"
        description="「なぜ支援者が動けない組織になっているか」を診断する簡易ツール。近日公開予定。"
        path="/organizations/diagnosis"
        noIndex
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">

          <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
            準備中
          </span>

          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            組織診断ツール
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-600">
            「なぜ支援者が動けない組織になっているか」を診断する簡易ツールを開発中です。
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left">
            <p className="text-sm font-semibold text-slate-700 mb-4">診断で明らかにすること</p>
            <div className="space-y-3">
              {[
                { axis: '1', label: '上司・職場文化', note: '最大の規定因子' },
                { axis: '2', label: '機関ミッション・法令理解', note: '' },
                { axis: '3', label: '業績評価基準', note: '' },
                { axis: '4', label: '資金・報酬基準', note: '' },
                { axis: '5', label: '専門職規範', note: '' },
              ].map(({ axis, label, note }) => (
                <div key={axis} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                    {axis}
                  </span>
                  <span className="text-slate-700">{label}</span>
                  {note && <span className="text-xs text-slate-400">{note}</span>}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-slate-400">
              Q14データ（支援実践の組織規定因子）に基づく診断軸。
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="/organizations"
              className="text-sm text-slate-500 hover:text-slate-800 hover:underline"
            >
              ← 職場・組織設計に戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
