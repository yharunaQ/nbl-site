import Link from 'next/link';
import type { ReactNode } from 'react';
import { AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import {
  rareDiseaseMandatoryDisclaimer,
  rareDiseaseNoPersonalInfoNotice,
  rareDiseasePageLinks,
} from '@/lib/content/rareDiseaseLinkageProject';

type RareDiseaseProjectShellProps = {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
};

export function RareDiseaseProjectShell({
  title,
  description,
  path,
  children,
}: RareDiseaseProjectShellProps) {
  return (
    <>
      <PageSeo title={title} description={description} path={path} type="article" />
      <SiteNav />
      <main className="min-h-screen bg-[#fbfaf6] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                <ArrowLeft size={16} />
                Projectsへ戻る
              </Link>
              <nav className="flex flex-wrap gap-2" aria-label="難病地域連携プロジェクト内ナビ">
                {rareDiseasePageLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>
        {children}
      </main>
    </>
  );
}

export function DisclaimerBox({ includeFormNotice = false }: { includeFormNotice?: boolean }) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <ShieldCheck size={18} />
              必須免責
            </div>
            <p className="mt-3 text-sm leading-7 text-amber-950">
              {rareDiseaseMandatoryDisclaimer}
            </p>
          </div>
          {includeFormNotice ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-900">
                <AlertTriangle size={18} />
                入力時の注意
              </div>
              <p className="mt-3 text-sm leading-7 text-rose-950">
                {rareDiseaseNoPersonalInfoNotice}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck size={18} />
                公開境界
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                NBLは既存機関の代替や評価者ではなく、本人が次の相談へ進みやすい資料と連携設計を共同で整える立場です。
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">{title}</h2>
      {children ? (
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{children}</p>
      ) : null}
    </div>
  );
}
