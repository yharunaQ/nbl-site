import Head from 'next/head';
import {
  AlarmClock,
  BellRing,
  Bot,
  CalendarSync,
  Gauge,
  Rows3,
} from 'lucide-react';
import React from 'react';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  automationSpecs,
  dailySnapshotSections,
  snapshotAutomationHero,
  snapshotEscalationRules,
  snapshotJobs,
  weeklyLoopSections,
} from '@/lib/content/snapshotAutomationReview';

export default function SnapshotAutomationReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL Snapshot Automation</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="emerald"
          backHref="/review/value-compounding"
          backLabel="Back To Value Compounding"
          eyebrow={snapshotAutomationHero.eyebrow}
          title={snapshotAutomationHero.headline}
          subtitle={snapshotAutomationHero.subheadline}
          sideEyebrow="First Automations"
          sideTitle="最初に固定するのは、daily と weekly の2本で十分。"
          sideBody="monthly は次段でよい。先に daily snapshot と weekly loop report が回るだけでも、Founder chat が trigger になる割合をかなり下げられる。"
        />

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<Bot size={18} className="text-emerald-700" />}
            eyebrow="Recurring Jobs"
            title="最初に回す recurring jobs"
            description="NBL の自動運転は、何本も同時に起動するより、daily と weekly の骨格を先に安定させる方がよい。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {snapshotJobs.map((job) => (
              <article key={job.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                    {job.cadence}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-950">{job.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{job.purpose}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-bold text-slate-900">Reads</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {job.reads.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-sm font-bold text-slate-900">Writes</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {job.writes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 rounded-[1.3rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  Founder sees it only if: {job.founderOnlyIf}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<AlarmClock size={18} className="text-cyan-700" />}
              eyebrow="Daily Snapshot"
              title="daily snapshot の中身"
              description="daily は進捗日記ではなく、今日どこを動かすかを 1 枚で返す運転席にする。"
            />
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {dailySnapshotSections.map((section) => (
                <article key={section.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                  <h3 className="text-xl font-black text-slate-950">{section.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{section.description}</p>
                  <ul className="mt-5 list-disc pl-5 text-sm leading-7 text-slate-700">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<Rows3 size={18} className="text-indigo-700" />}
            eyebrow="Weekly Loop Report"
            title="weekly report の中身"
            description="weekly は 5 loop を並べて見て、複利と drift を点検する。Founder はこの中の赤信号だけを見ればよい。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {weeklyLoopSections.map((section) => (
              <article key={section.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <h3 className="text-xl font-black text-slate-950">{section.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{section.description}</p>
                <ul className="mt-5 list-disc pl-5 text-sm leading-7 text-slate-700">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<BellRing size={18} className="text-rose-700" />}
              eyebrow="Escalation Rules"
              title="Founder に戻す赤信号"
              description="daily / weekly が自走しても、境界が曖昧だと unsafe automation になる。戻す条件を先に固定する。"
            />
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {snapshotEscalationRules.map((rule) => (
                <article key={rule.title} className="rounded-[1.8rem] border border-rose-200 bg-rose-50/60 p-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
                      {rule.severity}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-slate-950">{rule.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    <span className="font-semibold text-slate-900">When:</span> {rule.when}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    <span className="font-semibold text-slate-900">Action:</span> {rule.action}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<CalendarSync size={18} className="text-emerald-700" />}
            eyebrow="Automation-Ready Specs"
            title="あとで recurring task に落とすための仕様"
            description="app automation を作る段階になったら、この cadence と deliverable をそのまま prompt と output path に落とせる。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {automationSpecs.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{item.cadence}</p>
                <h3 className="mt-3 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.deliverable}</p>
                <ul className="mt-5 list-disc pl-5 text-sm leading-7 text-slate-700">
                  {item.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ReviewSectionTitle
            icon={<Gauge size={18} className="text-slate-700" />}
            eyebrow="Working Conclusion"
            title="Founder は daily を追わず、weekly の赤信号だけ見ればよい"
            description="これで、NBL の operating layer は `毎回チャットで起動する` から `日々と週次の snapshot が先に回る` へ移れる。monthly compounding はその次でよい。"
          />
        </section>
      </main>
    </div>
  );
}
