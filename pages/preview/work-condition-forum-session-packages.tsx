import PageSeo from '@/components/PageSeo';
import {
  groupedWorkConditionForumPresentations,
  workConditionForumGroups,
  workConditionForumManifest,
} from '@/lib/falconLab/workConditionForum';
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';

const forumHeroImage = '/images/work-condition-forum-virtual-city-hero-v1.webp';

type WorkConditionForumSessionPackagesPageProps = {
  seoPath?: string;
  noIndex?: boolean;
  presentationHrefBase?: string;
  footerStatus?: string;
};

export default function WorkConditionForumSessionPackagesPage({
  seoPath = '/preview/work-condition-forum-session-packages',
  noIndex = true,
  presentationHrefBase = '/preview/work-condition-forum-text',
  footerStatus = 'このフォーラムは制作中の独立プレビューです。',
}: WorkConditionForumSessionPackagesPageProps = {}) {
  const presentationHref = (id: string) => `${presentationHrefBase}/${encodeURIComponent(id)}`;

  return (
    <>
      <PageSeo
        title="働ける条件を設計する｜NBL仕事条件デザイン・バーチャルフォーラム"
        description="働ける条件を設計する。NBL仕事条件デザイン・バーチャルフォーラムの6セッション、22発表を読むためのメインページです。"
        path={seoPath}
        imagePath={forumHeroImage}
        imageAlt="水辺の架空都市にある会議場へ参加者が向かうバーチャルフォーラムの風景"
        noIndex={noIndex}
      />
      <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#f7f2e8] text-slate-950 [overflow-wrap:anywhere]">
        <section id="forum-top" className="relative min-h-[720px] scroll-mt-0 overflow-hidden bg-slate-950 text-white sm:min-h-[760px]">
          <img
            src={forumHeroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 to-transparent" />

          <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col px-4 py-5 sm:min-h-[760px] sm:px-5 md:px-8 lg:px-10">
            <header className="flex flex-col gap-3 border-b border-white/24 pb-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <a href="#forum-top" className="w-fit font-semibold tracking-normal text-white">
                NBL Work Condition Design Virtual Forum
              </a>
              <nav
                className="flex flex-wrap gap-3 text-white/80"
                aria-label="ページ内ナビゲーション"
              >
                <a href="#sessions" className="hover:text-white">
                  Sessions
                </a>
                <a href="#program" className="hover:text-white">
                  Program
                </a>
              </nav>
            </header>

            <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <div className="min-w-0 self-end">
                <p className="inline-flex items-center gap-2 border border-white/30 bg-slate-950/30 px-3 py-2 text-xs font-semibold tracking-[0.14em] text-white/90 backdrop-blur-sm">
                  <CalendarDays size={16} aria-hidden="true" />
                  VIRTUAL FORUM 2026
                </p>
                <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="block">働ける条件を</span>
                  <span className="block">設計する</span>
                </h1>
                <p className="mt-6 max-w-3xl text-xl font-semibold leading-9 text-white sm:text-3xl sm:leading-10">
                  NBL仕事条件デザイン・バーチャルフォーラム
                </p>
                <p className="mt-5 max-w-3xl text-base leading-8 text-white/80 sm:text-lg sm:leading-9">
                  障害者雇用を、人数やラベルだけでなく、本人、仕事、環境、支援、時間、評価の条件として読み直す22の発表です。各発表から本文ページへ進めます。
                </p>
              </div>

              <div className="self-end border border-white/25 bg-slate-950/40 p-5 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan-100">
                  <MapPin size={16} aria-hidden="true" />
                  Forum View
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-3xl font-semibold text-white">
                      {workConditionForumGroups.length}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/70">sessions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-white">
                      {workConditionForumManifest.count}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/70">presentations</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-white">1</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">series</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/75">
                  架空の会場で開かれるフォーラムとして、セッションを選び、気になる発表を読む構成です。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="sessions" className="border-b border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8 lg:px-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.14em] text-cyan-900">SESSIONS</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                  6つのセッション
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                入口から評価まで、仕事条件を別々のテーマから読み直します。
              </p>
            </div>

            <nav
              className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              aria-label="フォーラムセッション"
            >
              {workConditionForumGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className={`border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${group.accentClass}`}
                >
                  <span className="text-xs font-semibold tracking-[0.14em]">
                    Session {group.number} / {group.range}
                  </span>
                  <span className="mt-3 block text-2xl font-semibold leading-snug tracking-normal">
                    {group.label}
                  </span>
                  <span className="mt-3 block text-sm leading-7 opacity-80">{group.lead}</span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section id="program" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:px-8 lg:px-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-cyan-900">PROGRAM</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                発表一覧
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              カードを選ぶと、要約、図解、本文、動画をまとめた本文ページへ進みます。
            </p>
          </div>

          <div className="mt-10 space-y-14">
            {groupedWorkConditionForumPresentations.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-8">
                <div className="flex flex-col gap-2 border-t border-slate-300 pt-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-cyan-900">
                      Session {group.number} / {group.range}
                    </p>
                    <h3 className="mt-1 text-3xl font-semibold tracking-normal">{group.label}</h3>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">{group.lead}</p>
                </div>

                <div className="mt-5 grid gap-5">
                  {group.presentations.map((presentation) => (
                    <a
                      key={presentation.id}
                      data-testid="presentation-row"
                      href={presentationHref(presentation.id)}
                      aria-label={`${presentation.id} ${presentation.title}の本文ページを読む`}
                      className="grid min-w-0 overflow-hidden border border-slate-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 hover:shadow-lg md:grid-cols-[280px_1fr] xl:grid-cols-[340px_1fr]"
                    >
                      <div className="relative min-h-[230px] overflow-hidden bg-slate-200">
                        <img
                          src={presentation.presenterImagePath}
                          alt={`${presentation.id} ${presentation.presenter}の発表風景写真`}
                          loading="lazy"
                          decoding="async"
                          className="h-full min-h-[230px] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/10" />
                        <div className="absolute left-3 top-3 border border-white/55 bg-slate-950/68 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white">
                          {presentation.id}
                        </div>
                      </div>

                      <div className="min-w-0 p-5 sm:p-6 lg:p-7">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="border border-slate-300 px-2 py-1 text-xs font-semibold tracking-[0.12em] text-slate-700">
                            {presentation.id}
                          </span>
                          <span className="border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-900">
                            {group.label}
                          </span>
                        </div>
                        <h4 className="mt-4 text-2xl font-semibold leading-snug tracking-normal text-slate-950 sm:text-3xl">
                          {presentation.title}
                        </h4>
                        <p className="mt-3 flex gap-2 text-sm font-semibold leading-6 text-slate-800">
                          <Users
                            size={16}
                            className="mt-1 shrink-0 text-cyan-800"
                            aria-hidden="true"
                          />
                          <span>{presentation.presenter}</span>
                        </p>
                        <p className="mt-4 text-base leading-8 text-slate-700">
                          {presentation.summary}
                        </p>
                        <p className="mt-6 inline-flex items-center gap-2 border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-950">
                          本文ページを読む
                          <ArrowRight size={16} aria-hidden="true" />
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-300 bg-slate-950 py-8 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm leading-7 text-white/70 sm:px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
            <p>{footerStatus}</p>
            <p>個別の法的・医学的・雇用上の判断を示すものではありません。</p>
          </div>
        </footer>
      </main>
    </>
  );
}
