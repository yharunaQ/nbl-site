import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  buildAxiomNextNblVirtualBetaRun,
  validateAxiomNextNblVirtualBetaRun,
  type AxiomVirtualBetaAgent,
  type AxiomVirtualBetaFinding,
  type AxiomVirtualBetaPageReview,
  type AxiomVirtualBetaSeverity,
} from '@/lib/axiom/nextNblVirtualBetaTest';

const severityLabels: Record<AxiomVirtualBetaSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const severityClasses: Record<AxiomVirtualBetaSeverity, string> = {
  critical: 'border-red-300 bg-red-50 text-red-950',
  high: 'border-amber-300 bg-amber-50 text-amber-950',
  medium: 'border-teal-200 bg-teal-50 text-teal-950',
  low: 'border-slate-200 bg-white text-slate-800',
};

function agentById(agents: AxiomVirtualBetaAgent[]) {
  return new Map(agents.map((agent) => [agent.agentId, agent]));
}

function SeverityBadge({ severity }: { severity: AxiomVirtualBetaSeverity }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${severityClasses[severity]}`}
    >
      {severityLabels[severity]}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-650">{body}</p>
    </div>
  );
}

function AgentCard({ agent }: { agent: AxiomVirtualBetaAgent }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-900 text-white">
          <Users size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">{agent.nameJa}</p>
          <p className="mt-2 text-sm leading-6 text-slate-650">{agent.perspectiveJa}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">見る点</p>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
          {agent.primaryNeedsJa.slice(0, 3).map((need) => (
            <li className="flex gap-2" key={need}>
              <CheckCircle2 className="mt-1 shrink-0 text-teal-700" size={14} />
              <span>{need}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function FindingCard({
  finding,
  agents,
}: {
  finding: AxiomVirtualBetaFinding;
  agents: Map<string, AxiomVirtualBetaAgent>;
}) {
  const reviewers = finding.agentIds
    .map((agentId) => agents.get(agentId)?.nameJa)
    .filter(Boolean)
    .join(' / ');

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={finding.severity} />
        <p className="text-sm font-semibold text-slate-950">{finding.lensJa}</p>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        reviewer lens
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-650">{reviewers}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold text-teal-800">良かった点</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{finding.whatWorkedJa}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-800">気になる点</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{finding.issueJa}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">改善案</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{finding.improvementJa}</p>
        </div>
      </div>
    </article>
  );
}

function PageReviewSection({
  review,
  agents,
}: {
  review: AxiomVirtualBetaPageReview;
  agents: Map<string, AxiomVirtualBetaAgent>;
}) {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 md:p-7"
      id={`virtual-beta-page-${review.pageSlug}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
            {review.navLabelJa}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
            {review.pageRoleJa}
          </h3>
          <p className="mt-3 max-w-4xl text-base leading-8 text-slate-700">
            {review.reviewSummaryJa}
          </p>
        </div>
        <Link
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          href={review.pagePath}
        >
          ページを見る
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-teal-100 bg-white p-4">
          <p className="text-sm font-semibold text-teal-900">一番強い使い道</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{review.strongestUseJa}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">事業活用</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
            {review.businessUseJa.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {review.betaFindings.map((finding) => (
          <FindingCard agents={agents} finding={finding} key={finding.findingId} />
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-950">次の改善候補</p>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700 md:grid-cols-2">
          {review.nextImprovementJa.map((item) => (
            <li className="flex gap-2" key={item}>
              <ArrowRight className="mt-1 shrink-0 text-teal-700" size={14} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AxiomNextNblVirtualBetaTestSurface() {
  const run = buildAxiomNextNblVirtualBetaRun();
  const validation = validateAxiomNextNblVirtualBetaRun(run);
  const agents = agentById(run.agents);
  const highCount = run.pageReviews.flatMap((review) => review.betaFindings).filter((finding) =>
    ['critical', 'high'].includes(finding.severity),
  ).length;

  return (
    <main className="min-h-screen bg-[#fbfaf5] text-slate-950">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              Axiom internal virtual beta
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">
              次期NBLサイトを、想定利用者と経営チームの目で読む。
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-white/78">
              これは公開承認ではありません。公開前に、障害者本人、企業、人事、支援者、
              行政・研究、SNS読者、NBL事業チームの仮想レビューを走らせ、9ページ全体の改善点と
              事業活用の方向をまとめた内部ベータテスト結果です。
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/8 p-5">
            <div className="flex items-center justify-between border-b border-white/12 pb-3">
              <span className="text-sm text-white/70">status</span>
              <span className="text-sm font-semibold text-amber-100">{run.status}</span>
            </div>
            {[
              ['virtual agents', `${run.agentCount}`],
              ['pages reviewed', `${run.pageCount}`],
              ['findings', `${run.findingCount}`],
              ['high priority', `${highCount}`],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between" key={label}>
                <span className="text-sm text-white/70">{label}</span>
                <span className="text-2xl font-semibold">{value}</span>
              </div>
            ))}
            <div className="mt-2 rounded-md border border-white/12 bg-black/20 p-3 text-sm leading-6 text-white/72">
              validation: {validation.validationStatus}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {run.executiveSummaryJa.map((summary) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={summary}>
              <Sparkles className="text-teal-800" size={22} />
              <p className="mt-3 text-sm leading-7 text-slate-700">{summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-14">
        <SectionTitle
          eyebrow="virtual agents"
          title="誰の目でチェックしたか"
          body="個別の実利用者ではなく、公開前レビュー用の仮想エージェントです。断片的な相談、情報アクセス、企業実装、支援連携、政策議論、事業活用をそれぞれ別の目で点検します。"
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {run.agents.map((agent) => (
            <AgentCard agent={agent} key={agent.agentId} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionTitle
          eyebrow="page review"
          title="9ページ別のバーチャルベータ結果"
          body="各ページについて、読者としての使い道、詰まりやすい点、事業としての使い道、次の改善候補をまとめています。"
        />
        <div className="mt-10 grid gap-6">
          {run.pageReviews.map((review) => (
            <PageReviewSection agents={agents} key={review.pageSlug} review={review} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-14">
        <SectionTitle
          eyebrow="business team review"
          title="NBL事業チームとしての使い道"
          body="このサイトを公開物としてだけでなく、研修、共同検討、レポート、SNS、教材、問い合わせ導線の母艦としてどう使うかを整理します。"
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
          {run.businessReviews.map((review) => (
            <article className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-6" key={review.businessReviewId}>
              <BriefcaseBusiness className="text-teal-800" size={24} />
              <h3 className="mt-4 text-xl font-semibold tracking-normal">{review.titleJa}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{review.valueHypothesisJa}</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
                    use cases
                  </p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {review.useCasesJa.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
                    risks
                  </p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {review.risksJa.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    next moves
                  </p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {review.nextOperatingMovesJa.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionTitle
          eyebrow="improvement queue"
          title="公開前に優先して直すこと"
          body="ベータレビューから出た改善案を、全部の要望リストではなく、公開候補の品質を上げるための優先キューに圧縮しています。"
        />
        <div className="mt-10 grid gap-4">
          {run.priorityImprovements.map((item) => (
            <article
              className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr]"
              key={item.improvementId}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white">
                  <ClipboardList size={18} />
                </span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={item.severity} />
                  <p className="text-sm font-semibold text-slate-600">{item.ownerLensJa}</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-normal">{item.titleJa}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.actionJa}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.whyNowJa}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.affectedPageSlugs.map((slug) => (
                    <Link
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800"
                      href={`${run.candidateRouteBase}/${slug}`}
                      key={slug}
                    >
                      {slug}
                      <ArrowRight size={12} />
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <ShieldCheck className="text-amber-100" size={28} />
            <h2 className="mt-4 text-2xl font-semibold tracking-normal">今回動かしていない境界</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              これは内部ベータの実行結果であり、公開承認や学習更新ではありません。
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {run.notNow.map((item) => (
              <p
                className="rounded-md border border-white/12 bg-white/8 px-3 py-2 text-sm leading-6 text-white/78"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {!validation.valid ? (
        <section className="bg-red-50 px-5 py-8 text-red-950">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle size={18} />
              validation errors
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {validation.errors.map((error) => (
                <li key={error}>・{error}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs leading-6 text-slate-500 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-slate-600">
          internal virtual beta / not actual public navigation / not publication
        </p>
        <p>仮想レビュー結果は改善キューであり、公開判断・個別判断・学習更新ではありません。</p>
      </footer>
    </main>
  );
}
