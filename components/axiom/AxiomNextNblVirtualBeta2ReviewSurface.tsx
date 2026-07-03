import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Image as ImageIcon,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import {
  buildAxiomNextNblVirtualBeta2Run,
  validateAxiomNextNblVirtualBeta2Run,
  type AxiomVirtualBeta2PageReview,
  type AxiomVirtualBeta2Readiness,
} from '@/lib/axiom/nextNblVirtualBeta2Review';
import {
  type AxiomVirtualBetaAgent,
  type AxiomVirtualBetaFinding,
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

const readinessLabels: Record<AxiomVirtualBeta2Readiness, string> = {
  near_candidate_ready: '候補に近い',
  needs_targeted_polish: '部分仕上げ',
  needs_visual_and_copy_qa: '図解/コピーQA',
  hold_before_public_review: '公開前hold',
};

const readinessClasses: Record<AxiomVirtualBeta2Readiness, string> = {
  near_candidate_ready: 'border-teal-200 bg-teal-50 text-teal-950',
  needs_targeted_polish: 'border-amber-200 bg-amber-50 text-amber-950',
  needs_visual_and_copy_qa: 'border-indigo-200 bg-indigo-50 text-indigo-950',
  hold_before_public_review: 'border-red-200 bg-red-50 text-red-950',
};

function agentById(agents: readonly AxiomVirtualBetaAgent[]) {
  return new Map(agents.map((agent) => [agent.agentId, agent]));
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: AxiomVirtualBetaSeverity }) {
  return <Pill className={severityClasses[severity]}>{severityLabels[severity]}</Pill>;
}

function ReadinessBadge({ readiness }: { readiness: AxiomVirtualBeta2Readiness }) {
  return <Pill className={readinessClasses[readiness]}>{readinessLabels[readiness]}</Pill>;
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
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={finding.severity} />
        <p className="text-sm font-semibold text-slate-950">{finding.lensJa}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{reviewers}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold text-teal-800">良い状態</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{finding.whatWorkedJa}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-800">残るリスク</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{finding.issueJa}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-950">公開前QA</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{finding.improvementJa}</p>
        </div>
      </div>
    </article>
  );
}

function PageReviewCard({
  review,
  agents,
}: {
  review: AxiomVirtualBeta2PageReview;
  agents: Map<string, AxiomVirtualBetaAgent>;
}) {
  return (
    <article
      className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 shadow-sm md:p-7"
      id={`beta2-page-${review.pageSlug}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ReadinessBadge readiness={review.readiness} />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
              {review.navLabelJa}
            </p>
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
            {review.pageRoleJa}
          </h3>
          <p className="mt-3 max-w-4xl text-base leading-8 text-slate-700">
            {review.reviewSummaryJa}
          </p>
        </div>
        <Link
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          href={review.pagePath}
        >
          ページを見る
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-teal-100 bg-white p-4">
          <p className="text-sm font-semibold text-teal-900">ベータ2で見る焦点</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{review.beta2FocusJa}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">強み</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{review.pageStrengthJa}</p>
        </div>
        <div className="rounded-lg border border-amber-100 bg-white p-4">
          <p className="text-sm font-semibold text-amber-900">残るリスク</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{review.remainingRiskJa}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {review.betaFindings.map((finding) => (
          <FindingCard agents={agents} finding={finding} key={finding.findingId} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">最終QAチェック</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
            {review.finalQaChecksJa.map((check) => (
              <li className="flex gap-2" key={check}>
                <CheckCircle2 className="mt-1 shrink-0 text-teal-700" size={14} />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-teal-100 bg-white p-4">
          <p className="text-sm font-semibold text-teal-900">次の具体アクション</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{review.recommendedNextActionJa}</p>
        </div>
      </div>
    </article>
  );
}

export default function AxiomNextNblVirtualBeta2ReviewSurface() {
  const run = buildAxiomNextNblVirtualBeta2Run();
  const validation = validateAxiomNextNblVirtualBeta2Run(run);
  const agents = agentById(run.agents);
  const visualQaCount = run.priorityImprovements.filter((item) =>
    item.improvementId.includes('visual') || item.improvementId.includes('infographic'),
  ).length;

  return (
    <main className="min-h-screen bg-[#fbfaf5] text-slate-950">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              Axiom internal virtual beta 2
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">
              ベータ2総合レビュー：公開前QAへ進む。
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-white/78">
              一通り作り込んだ9ページを、もう一度、利用者・実装者・支援者・編集者・事業チームの目で読み直した結果です。
              判断は「新規構築を続ける」ではなく、図解一致、内部語除去、スマホ密度、境界文言を公開前QAとして潰す段階に近づいた、というものです。
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/8 p-5">
            {[
              ['status', run.status],
              ['pages', String(run.pageCount)],
              ['virtual agents', String(run.agentCount)],
              ['page findings + cross reviews', String(run.findingCount)],
              ['priority improvements', String(run.priorityImprovements.length)],
              ['visual QA items', String(visualQaCount)],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0" key={label}>
                <span className="text-sm text-white/70">{label}</span>
                <span className="text-right text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
            <div className="rounded-md border border-white/12 bg-black/20 p-3 text-sm leading-6 text-white/72">
              validation: {validation.validationStatus}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {run.executiveSummaryJa.map((summary) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={summary}>
              <BadgeCheck className="text-teal-800" size={24} />
              <p className="mt-3 text-sm leading-7 text-slate-700">{summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-14">
        <SectionTitle
          eyebrow="cross-site review"
          title="横断レビュー"
          body="ページ単体ではなく、サイト全体として公開候補に近づいたかを見るレビューです。特に、図解と本文の一致、内部語、スマホ密度、個別判断に見えない境界を確認します。"
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-2">
          {run.crossSiteReviews.map((review, index) => {
            const Icon = index === 1 ? ImageIcon : index === 2 ? Smartphone : ShieldCheck;
            return (
              <article className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5" key={review.reviewId}>
                <Icon className="text-teal-800" size={24} />
                <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
                  {review.titleJa}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{review.judgmentJa}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold text-teal-800">強み</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{review.strengthJa}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-800">リスク</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{review.riskJa}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-950">アクション</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{review.actionJa}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.affectedPageSlugs.map((slug) => (
                    <Link
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800"
                      href={`${run.candidateRouteBase}/${slug}`}
                      key={slug}
                    >
                      {slug}
                      <ArrowRight size={12} />
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionTitle
          eyebrow="page review"
          title="9ページ別レビュー"
          body="各ページを、公開候補としての強み、残るリスク、最終QAチェック、次の具体アクションに圧縮しました。"
        />
        <div className="mt-10 grid gap-6">
          {run.pageReviews.map((review) => (
            <PageReviewCard agents={agents} key={review.pageSlug} review={review} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-14">
        <SectionTitle
          eyebrow="business review"
          title="NBL事業チームとしての使い道"
          body="公開サイトを、営業ページではなく、研修・共同検討・レポート・SNS社会対話・素材活用の信頼母艦としてどう使うかを整理します。"
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
          {run.businessReviews.map((review) => (
            <article className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-6" key={review.businessReviewId}>
              <BriefcaseBusiness className="text-teal-800" size={24} />
              <h3 className="mt-4 text-xl font-semibold tracking-normal">{review.titleJa}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{review.valueHypothesisJa}</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">use cases</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {review.useCasesJa.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">risks</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {review.risksJa.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">next moves</p>
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
          eyebrow="priority queue"
          title="公開前に優先して直すこと"
          body="ベータ2の結論は、作り直しではなく公開前QAです。全部の思いつきを並べず、優先キューに圧縮します。"
        />
        <div className="mt-10 grid gap-4">
          {run.priorityImprovements.map((item) => (
            <article
              className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr]"
              key={item.improvementId}
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white">
                <ClipboardCheck size={18} />
              </span>
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
              これは内部ベータ2レビューであり、公開承認や学習更新ではありません。
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {run.notNow.map((item) => (
              <p className="rounded-md border border-white/12 bg-white/8 px-3 py-2 text-sm leading-6 text-white/78" key={item}>
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
        <p className="font-semibold text-slate-600">internal virtual beta 2 / not public approval / not publication</p>
        <p>ベータ2は改善キューであり、公開判断・個別判断・学習更新ではありません。</p>
      </footer>
    </main>
  );
}
