import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ClipboardCheck,
  Mail,
  ShieldCheck,
  UsersRound,
  Waypoints,
} from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import {
  foundingPartnerCandidateSignals,
  foundingPartnerContactChecklist,
  foundingPartnerNotNowItems,
  foundingPartnerPath,
  foundingPartnerRoles,
  foundingPartnersBoundaryNotice,
  foundingPartnersHero,
  foundingPartnersNoPersonalInfoNotice,
  foundingPartnersProjectRoute,
} from '@/lib/content/foundingPartnersProject';

export default function FoundingPartnersProjectPage() {
  return (
    <>
      <PageSeo
        title="仕事と参加の条件デザイン研究会 | Next Being Lab"
        description="病気・障害・AI時代の「働く」と「参加する」を、仕事・環境・支援・制度・AIの使い方を含む条件として考える研究会。"
        path={foundingPartnersProjectRoute}
        type="article"
        noIndex
      />
      <SiteNav />
      <main className="founding-page min-h-screen overflow-x-hidden bg-[#fbfaf6] text-slate-950 [overflow-wrap:anywhere] max-md:[word-break:break-all]">
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

        <section className="border-b border-slate-200 bg-[#eef3f2]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-w-0">
              <p className="inline-flex max-w-full whitespace-normal rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
                {foundingPartnersHero.eyebrow}
              </p>
              <h1 className="mt-5 max-w-5xl break-words text-4xl font-black leading-tight tracking-normal md:text-6xl">
                {foundingPartnersHero.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
                {foundingPartnersHero.subtitle}
              </p>
              <p className="mt-5 max-w-3xl rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700">
                {foundingPartnersHero.note}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  関心を連絡する
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
                >
                  NBLについて読む
                </Link>
              </div>
            </div>
            <aside className="min-w-0 self-start rounded-lg border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={22} className="text-amber-900" />
                <h2 className="text-xl font-black text-amber-950">安心して始めるために</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-amber-950">
                {foundingPartnersBoundaryNotice}
              </p>
              <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-bold text-rose-950">扱わない情報</p>
                <p className="mt-2 text-sm leading-7 text-rose-950">
                  {foundingPartnersNoPersonalInfoNotice}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3">
            <UsersRound size={22} className="text-emerald-700" />
            <h2 className="text-3xl font-black">研究会で出会いたい人</h2>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            役割名を先に決めず、まずは問いと関心の重なりから始めます。
            合う人が見えてから、研究会メンバー、レビュー協力者、共同実装パートナー、運営相談相手を分けます。
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {foundingPartnerRoles.map((role) => (
              <article key={role.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <Building2 size={22} className="text-sky-700" />
                <h3 className="mt-4 text-xl font-black text-slate-950">{role.title}</h3>
                <dl className="mt-4 space-y-4 text-sm leading-7">
                  <div>
                    <dt className="font-bold text-slate-950">合いそうな関わり</dt>
                    <dd className="text-slate-700">{role.fit}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-950">境界</dt>
                    <dd className="text-slate-700">{role.boundary}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <div className="flex items-center gap-3">
                <Waypoints size={22} className="text-sky-700" />
                <h2 className="text-3xl font-black">研究会の進め方</h2>
              </div>
              <p className="mt-4 text-base leading-8 text-slate-700">
                サイトを読んだ人が、個別相談ではなく「どの問いを一緒に考えられるか」を短く返せる流れにします。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {foundingPartnerPath.map((step) => (
                <article
                  key={step.title}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1fr]">
          <article>
            <div className="flex items-center gap-3">
              <ClipboardCheck size={22} className="text-emerald-700" />
              <h2 className="text-3xl font-black">合いそうな人の目印</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {foundingPartnerCandidateSignals.map((signal) => (
                <div key={signal} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold leading-7 text-slate-800">{signal}</p>
                </div>
              ))}
            </div>
          </article>

          <article>
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-slate-700" />
              <h2 className="text-3xl font-black">研究会で扱わないこと</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {foundingPartnerNotNowItems.map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold leading-7 text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-slate-50 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="flex items-center gap-3">
                <Mail size={22} className="text-sky-300" />
                <h2 className="text-3xl font-black">最初の連絡で十分なこと</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                長い提案書は不要です。まずはNBLの問いのどこに関心が近いかを短く共有してください。
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                連絡ページへ
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {foundingPartnerContactChecklist.map((item) => (
                <div key={item} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                  <p className="text-sm font-semibold leading-7 text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <style jsx>{`
        @media (max-width: 767px) {
          .founding-page,
          .founding-page * {
            min-width: 0;
          }

          .founding-page h1,
          .founding-page h2,
          .founding-page h3,
          .founding-page p,
          .founding-page dd,
          .founding-page dt,
          .founding-page a {
            overflow-wrap: anywhere;
            word-break: break-all;
          }
        }
      `}</style>
    </>
  );
}
