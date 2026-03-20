import Head from 'next/head';
import {
  Activity,
  BarChart3,
  Bot,
  Gauge,
  GitBranchPlus,
  Infinity,
  UserRoundCog,
} from 'lucide-react';
import React from 'react';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  agiPostures,
  automationCandidates,
  cadenceBlocks,
  compoundingLayers,
  founderActions,
  founderRole,
  metricStages,
  valueCompoundingHero,
} from '@/lib/content/valueCompoundingReview';

export default function ValueCompoundingReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL Value Compounding</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="cyan"
          backHref="/review/operating-loops"
          backLabel="Back To Operating Loops"
          eyebrow={valueCompoundingHero.eyebrow}
          title={valueCompoundingHero.headline}
          subtitle={valueCompoundingHero.subheadline}
          sideEyebrow="Working Rule"
          sideTitle="売上の立ち上がりより先に、価値の複利が立っているかを見る。"
          sideBody="最初の1年は、revenue だけでなく artifact、loop、trust、distribution、revenue capacity が同時に複利を始めているかで判断する。"
        />

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<Infinity size={18} className="text-cyan-700" />}
            eyebrow="Compounding Layers"
            title="何が倍々になるべきか"
            description="NBLで増やしたいのは、単月売上だけではない。売上の前段にある価値生成の構造そのものが複利で伸びる必要がある。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {compoundingLayers.map((layer) => (
              <article key={layer.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <h3 className="text-xl font-black text-slate-950">{layer.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{layer.summary}</p>
                <ul className="mt-5 space-y-2 rounded-[1.4rem] border border-cyan-200 bg-cyan-50/70 p-4 text-sm leading-6 text-slate-700">
                  {layer.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<UserRoundCog size={18} className="text-amber-700" />}
              eyebrow="Founder Role"
              title="Founder はどこを持つべきか"
              description="Founder が every loop の作業者に戻ると、NBL の複利はそこで止まる。Founder は irreversibility を持ち、AI は preparation を持つ。"
            />
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {founderRole.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-stone-300 bg-stone-50 p-6">
                  <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                  {item.aiOwns.length > 0 ? (
                    <>
                      <p className="mt-4 text-sm font-bold text-slate-900">AIが担う</p>
                      <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-slate-700">
                        {item.aiOwns.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {item.founderOwns.length > 0 ? (
                    <>
                      <p className="mt-4 text-sm font-bold text-slate-900">Founderが担う</p>
                      <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-slate-700">
                        {item.founderOwns.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<BarChart3 size={18} className="text-amber-700" />}
            eyebrow="Minimum Required Actions"
            title="Founder が最小限やること"
            description="邪魔しない前提でよい。ただし、本当に必要なときに短く返す役割は残る。返答の単位は `長い説明` でなく `Yes / No / Name / Keep / Adjust / Stop` で十分。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {founderActions.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                    {item.frequency}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                <p className="mt-4 rounded-[1.3rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  Trigger: {item.trigger}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<Activity size={18} className="text-emerald-700" />}
            eyebrow="Cadence"
            title="自動運転とPDCAの骨格"
            description="NBL の operating loop を、daily / weekly / monthly / quarterly の4層でモニタリングし、Founder はその出力だけを見る形に寄せる。"
          />
          <div className="mt-6 grid gap-5 xl:grid-cols-4">
            {cadenceBlocks.map((block) => (
              <article key={block.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">{block.cadence}</p>
                <h3 className="mt-3 text-xl font-black text-slate-950">{block.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{block.purpose}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
                  {block.outputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<Gauge size={18} className="text-cyan-700" />}
              eyebrow="Dashboard"
              title="時間スケールごとの確認指標"
              description="倍々の見通しは revenue のみでなく、どの段階で何が立ち上がっていれば前進とみなすかを先に決めておく方が現実的。"
            />
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {metricStages.map((stage) => (
                <article key={stage.stage} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">
                      {stage.stage}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">{stage.timeframe}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-slate-950">{stage.question}</h3>
                  <ul className="mt-5 list-disc pl-5 text-sm leading-7 text-slate-700">
                    {stage.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ReviewSectionTitle
            icon={<Bot size={18} className="text-indigo-700" />}
            eyebrow="Automation Candidates"
            title="定期自動運転の候補"
            description="まだ automation 自体は未起動でも、NBL に必要な recurring jobs はすでに定義できる。"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {automationCandidates.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">{item.frequency}</p>
                <h3 className="mt-3 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.purpose}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<GitBranchPlus size={18} className="text-rose-700" />}
              eyebrow="AGI / ASI Posture"
              title="NBL 自体が不要になる未来への姿勢"
              description="NBL は自己保存だけを目指すべきではない。より大きな基盤に吸収されても価値が残るなら、それも成功の一形態として扱う。"
            />
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {agiPostures.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-rose-200 bg-rose-50/60 p-6">
                  <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ReviewSectionTitle
            icon={<Gauge size={18} className="text-slate-700" />}
            eyebrow="Working Conclusion"
            title="NBL の成否は、単月売上より、価値生成の複利が立つかで見る"
            description="もし revenue が小さくても、artifact、loop、trust、distribution、revenue capacity が順番に立ち上がっていれば前進と見なせる。逆に、売上が一時的に立っても複利がないなら、consulting drift の可能性が高い。"
          />
        </section>
      </main>
    </div>
  );
}
