import Head from 'next/head';
import { Boxes, Route, ShieldCheck, Users, Workflow } from 'lucide-react';
import React from 'react';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  jacAgentRoles,
  jacCoreInternalSupport,
  jacCorePrinciples,
  jacCoreLadderIntro,
  jacCoreLadderSteps,
  jacCoreProductHero,
  jacCoreSurfaces,
  jacExecutionSteps,
  jacFounderDecisionGates,
  jacNoGoPromises,
} from '@/lib/content/jacCoreProductReview';

const surfaceTone: Record<string, string> = {
  keep_live: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  rewrite_live: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  review_first: 'border-amber-200 bg-amber-50 text-amber-900',
  internal_tool: 'border-violet-200 bg-violet-50 text-violet-900',
  internal_source: 'border-stone-300 bg-stone-100 text-stone-700',
};

const surfaceLabel: Record<string, string> = {
  keep_live: 'keep live',
  rewrite_live: 'rewrite live',
  review_first: 'review first',
  internal_tool: 'internal tool',
  internal_source: 'internal source',
};

const ladderTone: Record<string, string> = {
  public_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  preparing: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  private_layer: 'border-amber-200 bg-amber-50 text-amber-900',
  internal_support: 'border-violet-200 bg-violet-50 text-violet-900',
};

const ladderLabel: Record<string, string> = {
  public_now: 'public now',
  preparing: 'preparing',
  private_layer: 'private layer',
  internal_support: 'internal support',
};

export default function JacCoreProductReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | 仕事設計コアプロダクト</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="emerald"
          backHref="/review/core-content-status"
          backLabel="Back To Core Content Status"
          eyebrow={jacCoreProductHero.eyebrow}
          title={jacCoreProductHero.headline}
          subtitle={jacCoreProductHero.subheadline}
          sideEyebrow={jacCoreProductHero.sideEyebrow}
          sideTitle={jacCoreProductHero.sideTitle}
          sideBody={jacCoreProductHero.sideBody}
          sideExtra={
            <ul className="space-y-3 rounded-[1.4rem] border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-6 text-slate-700">
              {jacNoGoPromises.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Boxes size={18} className="text-emerald-700" />}
            eyebrow="Core Principles"
            title="最初に固定する製品原則"
            description="route ごとの修正に入る前に、仕事設計プロダクト群をどんな製品として扱うかをそろえる。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {jacCorePrinciples.map((principle) => (
              <article
                key={principle.title}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{principle.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{principle.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Route size={18} className="text-emerald-700" />}
            eyebrow={jacCoreLadderIntro.eyebrow}
            title={jacCoreLadderIntro.title}
            description={jacCoreLadderIntro.description}
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {jacCoreLadderSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Step {step.step}
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${ladderTone[step.state]}`}
                  >
                    {ladderLabel[step.state]}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-black text-slate-900">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{step.userValue}</p>
                <div className="mt-4 rounded-[1.3rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Business Role
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step.businessRole}</p>
                </div>
                <div className="mt-4 rounded-[1.3rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Current State
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step.currentState}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Founder boundary: {step.founderBoundary}
                </p>
              </article>
            ))}
          </div>
          <article className="mt-6 rounded-[1.8rem] border border-violet-200 bg-violet-50/80 p-6 shadow-sm shadow-violet-100/60">
            <h3 className="text-xl font-black text-slate-900">{jacCoreInternalSupport.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-700">{jacCoreInternalSupport.detail}</p>
            <ul className="mt-5 space-y-2 text-sm leading-7 text-slate-700">
              {jacCoreInternalSupport.bullets.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Boxes size={18} className="text-cyan-700" />}
            eyebrow="Surface Matrix"
            title="見取り図 / 26カード版 / ガイド / 配慮設計アシスト / 試作履歴 / 編集基盤の役割"
            description="どの surface を live に残し、どれを rewrite や review-first にするかを最初に決める。"
          />
          <div className="mt-6 space-y-5">
            {jacCoreSurfaces.map((surface) => (
              <article
                key={surface.title}
                className="rounded-[1.9rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{surface.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-slate-600">{surface.role}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${surfaceTone[surface.state]}`}
                  >
                    {surfaceLabel[surface.state]}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Current Problem
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{surface.currentProblem}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Target Shape
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{surface.targetShape}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Users size={18} className="text-amber-700" />}
            eyebrow="Agent Cell"
            title="AIエージェントの編成"
            description="最重要プロダクトなので、route 単位でなく role 単位に分担する。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {jacAgentRoles.map((role) => (
              <article
                key={role.title}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{role.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{role.responsibility}</p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Outputs</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {role.outputs.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">Founder boundary: {role.founderBoundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<Workflow size={18} className="text-slate-700" />}
              eyebrow="Critical Path"
              title="実行順序"
              description="最初の 2 週間でどこから直すか。混乱の源から先に切る。"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {jacExecutionSteps.map((step) => (
                <article
                  key={step.step}
                  className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Step {step.step}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ReviewSectionTitle
            icon={<ShieldCheck size={18} className="text-rose-700" />}
            eyebrow="Founder Gates"
            title="Founder が決める境界"
            description="残りは AI 側で draft 化と実装準備まで進める。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {jacFounderDecisionGates.map((item) => (
              <article
                key={item}
                className="rounded-[1.6rem] border border-rose-200 bg-rose-50/70 p-5 text-sm leading-7 text-slate-700"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <CoreStreamFooter
          currentId="methods"
          title="仕事設計プロダクト群を最重要プロダクトとして扱う review"
          description="このページは、仕事設計プロダクト群を route の寄せ集めではなく 1 製品として再編するための program map です。まず surface split と naming を fix し、その後で `/jac` と `/jac/guidebook` の改修に入ります。"
        />
      </main>
    </div>
  );
}
