import Link from 'next/link';
import { ArrowLeft, ArrowRight, GitBranch, ShieldCheck } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import { useNextSiteCandidate } from '@/components/axiom/AxiomNextSiteCandidateContext';

export default function EmploymentMobilityProjectPage() {
  const candidate = useNextSiteCandidate();
  return (
    <>
      <PageSeo
        title="福祉・医療・雇用の連携設計・人材育成 | Next Being Lab"
        description="障害者の就労支援に関わる様々な関係者が、「働く」と「参加する」の専門支援を提供できるように応援するプロジェクト。"
        path="/projects/employment-mobility"
        type="article"
      />
      <SiteNav />
      <main className="min-h-screen bg-[#fbfaf6] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Projectsへ戻る
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <p className="inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
            Policy / Training
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
            福祉・医療・雇用の連携設計・人材育成
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
            障害者の就労支援に関わる様々な関係者が、「働く」と「参加する」の専門支援を提供できるように、
            共通言語、制度設計、研修、人材育成の形を一緒に整えていきます。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={candidate ? '/materials/policy/overview' : '/nbl-employment-reform'}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {candidate ? '総合政策案の要点を読む' : '関連する旗艦ページを見る'}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/projects/rare-disease-linkage"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            >
              難病地域連携を見る
            </Link>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <GitBranch size={22} className="text-emerald-700" />
              <h2 className="mt-4 text-xl font-black">{candidate ? '協働で整えること' : 'Heronでの扱い'}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {candidate ? '本人が望む仕事と生活を共通の目的に、医療・福祉・教育・企業の通常業務、引継ぎ、研修を具体化します。担当の勤務時間、費用と決定権限をそろえ、現場の善意だけに継続を任せない設計を支援します。' : '社会的に急ぐ論点整理、共通言語、資料導線を最小限公開します。医療判断、雇用判断、制度判断、個別相談は扱いません。'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <ShieldCheck size={22} className="text-sky-700" />
              <h2 className="mt-4 text-xl font-black">{candidate ? '根拠と責任' : 'Falconへの接続'}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {candidate ? 'NBLは、比較できる案、根拠と反証、実施条件、評価と見直しをまとめます。医学・雇用・制度の正式判断は権限ある担当者が担います。協働の成果物、役割と有償の作業範囲を相談時に定めます。' : '公開ページ上の専門知識は、Falconの監査、根拠確認、表現リスク確認を経てから再利用します。'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
