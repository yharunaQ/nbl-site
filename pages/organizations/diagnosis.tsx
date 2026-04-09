import { useState } from 'react';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

// ── Types ──────────────────────────────────────────────────────────────────

type AxisId = 'boss' | 'mission' | 'evaluation' | 'funding' | 'norm';
type Screen = 'intro' | 'assessment' | 'results';
type Level = 'good' | 'moderate' | 'critical';

interface AxisDef {
  id: AxisId;
  label: string;
  note?: string;
  q1: number; // Q1 true_expert benchmark (toku18 問14)
  q2: number; // Q2 blocked benchmark
  questions: [string, string];
  texts: Record<Level, string>;
  guidance: string;
}

// ── Data (derived from toku18_barrier_decomposition.json) ─────────────────
// Score normalization: (answer - 1) / 3 → 0.0–1.0 (same as original Q14)
// Thresholds: ≥0.67 = 良好, 0.45–0.67 = 改善余地あり, <0.45 = 要対応

const AXES: AxisDef[] = [
  {
    id: 'boss',
    label: '上司・職場文化',
    note: '最大の規定因子',
    q1: 0.764,
    q2: 0.633,
    questions: [
      '就労支援の連携活動を、上司・管理者が業務として認めている（または認める意向がある）',
      '職場内で就労支援に関わる活動の成果や困難を話し合える雰囲気がある',
    ],
    texts: {
      good: '上司・職場文化は就労支援を後押しする状態です。支援者が動きやすい土台が整っています。',
      moderate:
        '上司の支持が部分的で、支援者ごとに実践の差が出やすい状況です。明示的な承認があればQ1水準に近づけます。',
      critical:
        '上司・職場文化が就労支援の最大の障壁になっています。支援者の個人努力だけでは構造的な限界があります。',
    },
    guidance:
      '最小コストの最初の一手：「就労相談を受けた場合に外部の就労支援機関へ情報提供すること」を業務として明示することが、最もコストが低く効果が大きい介入です。これだけで支援者の「業務外」という認識の壁を取り除けます。',
  },
  {
    id: 'mission',
    label: '機関ミッション・法令',
    q1: 0.744,
    q2: 0.627,
    questions: [
      '当機関の定款・根拠法令・方針文書に、就労支援や社会参加支援が含まれている',
      '機関の年度計画・重点目標に、就労支援連携が明示されている（または検討したことがある）',
    ],
    texts: {
      good: '機関のミッション・法的枠組みが就労支援を後押しする状態です。支援者が動く根拠が明確にあります。',
      moderate: 'ミッションとの接続が曖昧で、支援者が「業務として動いてよいか」判断しにくい状況です。',
      critical:
        '機関のミッションが就労支援を位置づけていない状態です。上司軸との組み合わせで「完全孤立型」に近い可能性があります。',
    },
    guidance:
      '根拠法令（難病法・障害者総合支援法など）の地域生活支援の条文を活用し、「就労支援連携は法的根拠のある業務」として内部方針に明文化することが有効です。患者のQOL改善・通院継続率向上という経営合理性とも接続できます。',
  },
  {
    id: 'evaluation',
    label: '業績評価基準',
    q1: 0.689,
    q2: 0.572,
    questions: [
      '支援者の業績評価に、就労支援・就労連携の取り組みが反映される仕組みがある',
      '就労支援に関連する活動（外部機関への情報提供・連絡など）を業務として記録している',
    ],
    texts: {
      good: '評価基準が就労支援を動機づける状態です。',
      moderate: '評価基準と就労支援の接続が弱く、支援者のモチベーションが個人差に依存しています。',
      critical: '業績評価が就労支援を反映しておらず、取り組む動機が生まれにくい状況です。',
    },
    guidance:
      '年次業績評価に「就労支援連携件数」「外部機関との連携回数」などを指標として追加することが、実践普及の構造的な後押しになります。まず「記録する」ことから始めるのが最小ステップです。',
  },
  {
    id: 'funding',
    label: '資金源・報酬基準',
    q1: 0.597,
    q2: 0.488,
    questions: [
      '就労支援連携のための時間を業務時間内に確保できる仕組みがある',
      '就労支援連携活動が機関の収入・加算・補助金に繋がっている（または繋がる可能性がある）',
    ],
    texts: {
      good: '就労支援への資源配分が適切で、活動の持続性が高い状態です。',
      moderate: '就労支援のための時間・資金の確保が不安定で、個人の持ち出しに依存しがちです。',
      critical: '就労支援を行うほど機関の資源が圧迫される構造になっている可能性があります。',
    },
    guidance:
      '就労支援連携に使える時間の枠（例：月2時間）を業務として明示的に確保することが第一歩です。診療報酬加算（療養・就労両立支援指導料など）の活用可能性も確認してください。',
  },
  {
    id: 'norm',
    label: '専門職規範',
    q1: 0.700,
    q2: 0.599,
    questions: [
      '機関内の支援者の間で、就労支援を行うことが専門家としての責務という意識が共有されている',
      '地域の同業者・専門職団体でも、就労支援実践の重要性が議論されている（または議論すべきという認識がある）',
    ],
    texts: {
      good: '専門職規範が就労支援を後押しする状態です。',
      moderate: '専門職規範と就労支援の接続が個人差に左右されています。',
      critical: '専門職規範が「就労支援は自分たちの仕事ではない」という認識を生んでいる可能性があります。',
    },
    guidance:
      '地域の就労支援ネットワーク（自立支援協議会・就業・生活支援センターのケース会議など）への参加を業務として位置づけることで、専門職としての視野を組織的に広げることができます。',
  },
];

const SCALE_LABELS = [
  '',
  'そう思わない',
  'あまりそう思わない',
  'ある程度そう思う',
  'とてもそう思う',
] as const;

// ── Scoring helpers ────────────────────────────────────────────────────────

function normalize(v: number): number {
  return (v - 1) / 3;
}

function axisScore(answers: Record<string, number>, id: AxisId): number | null {
  const a = answers[`${id}_0`];
  const b = answers[`${id}_1`];
  if (a === undefined || b === undefined) return null;
  return (normalize(a) + normalize(b)) / 2;
}

function getLevel(score: number): Level {
  if (score >= 0.67) return 'good';
  if (score >= 0.45) return 'moderate';
  return 'critical';
}

// ── Pattern detection ──────────────────────────────────────────────────────

interface PatternResult {
  label: string;
  badgeClass: string;
  description: string;
  note?: string;
}

function detectPattern(scores: Record<AxisId, number>): PatternResult {
  const avg = (scores.boss + scores.mission + scores.evaluation + scores.funding + scores.norm) / 5;

  if (scores.boss < 0.45 && scores.mission < 0.45) {
    return {
      label: '完全孤立型',
      badgeClass: 'bg-red-100 text-red-800',
      description:
        '上司・職場文化と機関ミッションの両方が就労支援を支えていない状態です。支援者への個別指導・研修だけでは成果につながりません。管理職・機関長レベルの意思決定が唯一の有効な介入経路です。',
      note: '外部の自立支援協議会や就労支援ネットワークからの参加要請を活用することで、内部からの変革が困難な場合でも組織変化を促すことができます。',
    };
  }
  if (avg >= 0.67) {
    return {
      label: '実践促進型',
      badgeClass: 'bg-teal-100 text-teal-800',
      description:
        '組織的な後押しが整っており、支援者が就労支援を実践しやすい環境です。全国調査で「真の専門性実践者（Q1）」に分類される支援者（全体の20.8%）と同水準の組織環境です。',
    };
  }
  if (avg >= 0.45) {
    return {
      label: '制度的障壁型',
      badgeClass: 'bg-amber-100 text-amber-800',
      description:
        '理念はあっても組織的な壁が支援者の実践を阻んでいる状態です。全国調査の71.9%（n=2,196）がこのパターンに該当します。スコアが低い軸への集中的な改善が、実践率を大きく引き上げます。',
    };
  }
  return {
    label: '環境依存型',
    badgeClass: 'bg-orange-100 text-orange-800',
    description:
      '複数の組織的障壁が重なっており、支援者の実践が個人の努力と外部環境に大きく依存しています。構造的な改革が必要な状況です。',
    note: '特にスコアが低い2〜3軸に絞って、最小コストの変化（業務の明示化・記録の開始）から始めることを推奨します。',
  };
}

// ── Style maps ─────────────────────────────────────────────────────────────

const LEVEL_BADGE: Record<Level, string> = {
  good: 'bg-teal-100 text-teal-800',
  moderate: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-800',
};
const LEVEL_LABEL: Record<Level, string> = {
  good: '良好',
  moderate: '改善余地あり',
  critical: '要対応',
};
const BAR_COLOR: Record<Level, string> = {
  good: 'bg-teal-400',
  moderate: 'bg-amber-400',
  critical: 'bg-red-400',
};
const INTERPRETATION_BG: Record<Level, string> = {
  good: 'bg-teal-50 border border-teal-100',
  moderate: 'bg-amber-50 border border-amber-100',
  critical: 'bg-red-50 border border-red-100',
};

// ── Page component ─────────────────────────────────────────────────────────

export default function OrganizationsDiagnosisPage() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalQ = AXES.length * 2; // 10
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQ;

  const scores = allAnswered
    ? (Object.fromEntries(AXES.map((a) => [a.id, axisScore(answers, a.id)!])) as Record<AxisId, number>)
    : null;
  const pattern = scores ? detectPattern(scores) : null;

  function handleAnswer(key: string, val: number) {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  }

  function handleReset() {
    setAnswers({});
    setScreen('intro');
  }

  return (
    <>
      <PageSeo
        title="組織診断ツール | Next Being Lab"
        description="就労支援実践の組織規定因子を診断。toku18支援者調査Q14（n=3,053）に基づく5軸評価で、あなたの機関の強みと課題を明らかにします。"
        path="/organizations/diagnosis"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-2xl px-6 py-14">

          {/* Breadcrumb */}
          <nav className="text-xs text-slate-400">
            <Link href="/organizations" className="hover:text-slate-700">
              職場・組織設計
            </Link>
            <span className="mx-2">/</span>
            <span>組織診断</span>
          </nav>

          {/* ── INTRO ────────────────────────────────────────────────── */}
          {screen === 'intro' && (
            <div>
              <header className="mt-6">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                  組織診断
                </span>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  組織診断ツール
                </h1>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  「なぜ支援者が動けない組織になっているか」を5つの軸で診断します。
                  個人への介入より先に、組織の環境を変えることが効果的です。
                </p>
              </header>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-slate-700 mb-4">診断する5つの軸</p>
                <div className="space-y-3">
                  {AXES.map((axis, i) => (
                    <div key={axis.id} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700">{axis.label}</span>
                      {axis.note && (
                        <span className="ml-auto text-xs text-slate-400 shrink-0">{axis.note}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-600">対象</span>
                    <p className="mt-0.5">支援機関の管理職・機関長</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">所要時間</span>
                    <p className="mt-0.5">約3分（10問）</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-600">根拠データ</span>
                    <p className="mt-0.5">toku18 支援者調査 問14（組織規定因子）n=3,053</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 leading-6">
                診断結果は全国調査のQ1（真の専門性実践者: 20.8%）・Q2（制度的障壁型: 71.9%）の
                ベンチマーク値と比較します。すべて回答は保存されません。
              </div>

              <button
                onClick={() => setScreen('assessment')}
                className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                診断を始める →
              </button>
            </div>
          )}

          {/* ── ASSESSMENT ───────────────────────────────────────────── */}
          {screen === 'assessment' && (
            <div>
              {/* Progress */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  {answeredCount} / {totalQ} 問回答済
                </p>
                <div className="flex-1 mx-4 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-teal-400 transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQ) * 100}%` }}
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                各項目を1〜4で評価してください。「わからない」場合は「あまりそう思わない」を選んでください。
              </p>

              {/* Questions */}
              <div className="mt-8 space-y-10">
                {AXES.map((axis, ai) => (
                  <section key={axis.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {ai + 1}
                      </span>
                      <h2 className="text-sm font-semibold text-slate-800">{axis.label}</h2>
                      {axis.note && (
                        <span className="text-xs text-slate-400">{axis.note}</span>
                      )}
                    </div>

                    <div className="space-y-5">
                      {axis.questions.map((q, qi) => {
                        const key = `${axis.id}_${qi}`;
                        const current = answers[key];
                        return (
                          <div key={qi} className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-sm leading-6 text-slate-700 mb-3">
                              <span className="text-xs font-semibold text-slate-400 mr-1.5">
                                Q{ai * 2 + qi + 1}
                              </span>
                              {q}
                            </p>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {([1, 2, 3, 4] as const).map((val) => (
                                <label
                                  key={val}
                                  className={`flex items-center justify-center rounded-lg border px-2 py-2 text-xs text-center cursor-pointer transition-colors
                                    ${current === val
                                      ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold'
                                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    className="sr-only"
                                    name={key}
                                    value={val}
                                    checked={current === val}
                                    onChange={() => handleAnswer(key, val)}
                                  />
                                  {SCALE_LABELS[val]}
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* Submit */}
              <div className="mt-10">
                <button
                  disabled={!allAnswered}
                  onClick={() => setScreen('results')}
                  className={`w-full rounded-xl px-6 py-4 text-sm font-semibold transition-colors
                    ${allAnswered
                      ? 'bg-slate-900 text-white hover:bg-slate-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  {allAnswered ? '結果を見る →' : `あと${totalQ - answeredCount}問回答してください`}
                </button>
              </div>
            </div>
          )}

          {/* ── RESULTS ──────────────────────────────────────────────── */}
          {screen === 'results' && scores && pattern && (
            <div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                  診断結果
                </p>

                {/* Pattern card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${pattern.badgeClass}`}>
                      {pattern.label}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{pattern.description}</p>
                  {pattern.note && (
                    <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                      <p className="text-xs leading-5 text-slate-600">{pattern.note}</p>
                    </div>
                  )}
                </div>

                {/* Per-axis scores */}
                <h2 className="mt-8 text-sm font-semibold text-slate-700 mb-4">軸別スコア</h2>
                <div className="space-y-5">
                  {AXES.map((axis) => {
                    const score = scores[axis.id];
                    const level = getLevel(score);
                    return (
                      <div key={axis.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{axis.label}</span>
                            {axis.note && (
                              <span className="text-xs text-slate-400">{axis.note}</span>
                            )}
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_BADGE[level]}`}>
                            {LEVEL_LABEL[level]}
                          </span>
                        </div>

                        {/* Score bar */}
                        <div className="relative mt-1 mb-4">
                          <div className="h-3 w-full rounded-full bg-slate-100">
                            <div
                              className={`h-3 rounded-full ${BAR_COLOR[level]} transition-all duration-500`}
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          {/* Q1 marker */}
                          <div
                            className="absolute top-[-5px] h-[22px] w-0.5 bg-indigo-400"
                            style={{ left: `${axis.q1 * 100}%` }}
                            title={`Q1水準: ${(axis.q1 * 100).toFixed(0)}`}
                          />
                          {/* Q2 marker */}
                          <div
                            className="absolute top-[-5px] h-[22px] w-0.5 bg-slate-300"
                            style={{ left: `${axis.q2 * 100}%` }}
                            title={`全国平均: ${(axis.q2 * 100).toFixed(0)}`}
                          />
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-3">
                          <span>
                            あなたのスコア:{' '}
                            <span className="font-semibold text-slate-600">
                              {(score * 100).toFixed(0)}
                            </span>
                          </span>
                          <div className="flex gap-3">
                            <span className="flex items-center gap-1">
                              <span className="inline-block h-0.5 w-4 bg-indigo-400" />
                              Q1水準 ({(axis.q1 * 100).toFixed(0)})
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="inline-block h-0.5 w-4 bg-slate-300" />
                              全国平均 ({(axis.q2 * 100).toFixed(0)})
                            </span>
                          </div>
                        </div>

                        {/* Interpretation */}
                        <div className={`rounded-lg px-4 py-3 ${INTERPRETATION_BG[level]}`}>
                          <p className="text-sm leading-6 text-slate-700">{axis.texts[level]}</p>
                        </div>

                        {/* Guidance for non-good */}
                        {level !== 'good' && (
                          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold text-slate-500 mb-1">推奨アクション</p>
                            <p className="text-sm leading-6 text-slate-600">{axis.guidance}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Data note */}
                <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-400 leading-5">
                  <p className="font-semibold text-slate-500 mb-1">診断の根拠</p>
                  <p>
                    この診断は、難病就労支援機関調査（toku18: n=3,053）の問14
                    「就労支援実践の組織規定因子」分析に基づいています。Q1水準は
                    「真の専門性実践者」（20.8%, n=634）の平均値、全国平均は
                    「理念あり・制度的障壁型」（71.9%, n=2,196）の平均値です。
                    スコアの基点（0〜100）は、元の4段階回答を0〜1に正規化し100倍したものです。
                  </p>
                </div>

                {/* Next steps */}
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <Link
                    href="/jac/next"
                    className="text-sm font-semibold text-teal-700 hover:underline"
                  >
                    はたらく相談室で組織課題を整理する →
                  </Link>
                  <Link
                    href="/organizations/design"
                    className="text-sm text-slate-500 hover:text-slate-800 hover:underline"
                  >
                    インクルーシブ職場設計を読む →
                  </Link>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-slate-600 hover:underline"
                  >
                    ← もう一度診断する
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
