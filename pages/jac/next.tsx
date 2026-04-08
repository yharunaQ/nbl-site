import { startTransition, useState, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import type {
  FchmaFullAssessment,
  FchmaInterventionItem,
  FchmaStructuralHypothesis,
  FchmaStructuredFollowupQuestion,
} from '@/lib/fchma/aiAssessmentOrchestration';

// ---------------------------------------------------------------------------
// Agreement document types
// ---------------------------------------------------------------------------

type AgreementItem = {
  id: string;
  itemType: 'intervention' | 'hypothesis';
  title: string;
  // intervention fields
  interventionType?: string;
  ownerRole?: string;
  evidenceBasis?: string;
  // hypothesis fields
  causalChain?: string;
  confidence?: string;
  // shared
  editableNotes: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function feasibilityLabel(f: string): string {
  if (f === 'high') return '着手しやすい';
  if (f === 'medium') return '要調整';
  return '準備が必要';
}

function feasibilityClass(f: string): string {
  if (f === 'high') return 'bg-emerald-100 text-emerald-800';
  if (f === 'medium') return 'bg-amber-100 text-amber-800';
  return 'bg-slate-100 text-slate-600';
}

function confidenceLabel(c: string): string {
  if (c === 'high') return '確信度：高';
  if (c === 'medium') return '仮説として採用可';
  return '要追加確認';
}

function confidenceBadgeClass(c: string): string {
  if (c === 'high') return 'bg-teal-100 text-teal-800';
  if (c === 'medium') return 'bg-slate-100 text-slate-600 border border-slate-200';
  return 'bg-amber-100 text-amber-700';
}

function evidenceRoleLabel(role: string): string {
  if (role === 'direct_basis') return '直接根拠';
  if (role === 'conditional_hypothesis') return '条件付き仮説';
  return '参考資料';
}

function evidenceRoleClass(role: string): string {
  if (role === 'direct_basis') return 'bg-teal-100 text-teal-800';
  if (role === 'conditional_hypothesis') return 'bg-amber-100 text-amber-800';
  return 'bg-slate-100 text-slate-600';
}

function sourceTypeLabel(t: string): string {
  if (t === 'supports_model') return '支援効果データ';
  if (t === 'hw_practice') return '就労支援実践知識';
  if (t === 'international_guidance') return '国際エビデンス';
  if (t === 'guideline') return 'ガイドライン';
  if (t === 'manifold_pattern') return 'ケースパターン';
  return t;
}

function interventionTypeLabel(t: string): string {
  const map: Record<string, string> = {
    work_design: '仕事設計',
    accommodation: '職場配慮',
    support_linkage: '支援連携',
    self_management: '自己管理',
    employer_engagement: '企業対応',
  };
  return map[t] ?? t;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type SignalBadgesProps = {
  signals: FchmaFullAssessment['extractedSignals'];
};

function SignalBadges({ signals }: SignalBadgesProps) {
  const groups: Array<{ label: string; items: string[] }> = [
    { label: '健康・体調', items: signals.healthConditions },
    { label: '仕事・場面', items: signals.workContext },
    { label: '困難', items: signals.difficultyContext },
    { label: '支援・配慮', items: signals.supportContext },
    { label: '開示', items: signals.disclosureContext },
    { label: '今後', items: signals.futureContext },
  ];

  const filled = groups.filter((g) => g.items.length > 0);
  if (!filled.length) return null;

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {filled.map(({ label, items }) => (
        <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{items.slice(0, 2).join(' / ')}</p>
        </div>
      ))}
    </div>
  );
}



type AssessmentSectionProps = {
  assessment: NonNullable<FchmaFullAssessment['aiAssessment']>;
  addedTitles: Set<string>;
  addedCount: number;
  onToggleAgreement: (item: FchmaInterventionItem, idx: number) => void;
  onToggleHypothesis: (hyp: FchmaStructuralHypothesis, idx: number) => void;
  iterationCount: number;
};

function AssessmentSection({ assessment, addedTitles, addedCount, onToggleAgreement, onToggleHypothesis, iterationCount }: AssessmentSectionProps) {
  return (
    <>
      {/* How-to guide + added count */}
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">1</span>
              <span>仮説・支援仮説を確認</span>
            </div>
            <span className="text-slate-300 text-xs">→</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">2</span>
              <span>採用するものを<strong className="text-slate-700">「合意文書に追加」</strong></span>
            </div>
            <span className="text-slate-300 text-xs">→</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">3</span>
              <span>合意文書を確定</span>
            </div>
          </div>
          {addedCount > 0 && (
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              ✓ {addedCount}件 追加済み
            </span>
          )}
        </div>
      </section>

      {/* Structural hypotheses */}
      {assessment.structuralHypotheses.length > 0 && (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-7">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              構造仮説
            </p>
            {iterationCount > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                第{iterationCount}回更新
              </span>
            )}
          </div>

          {/* Analysis frame summary — multi-frame scan result on first pass */}
          {iterationCount <= 1 ? (
            <p className="mt-3 text-xs text-slate-400">
              アトラス全体をスキャンし、活性化の可能性があるフレームを複数仮説として並列提示しています。以下の追加質問への回答でフレームを絞り込みます。
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400">収束フレーム:</span>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                {assessment.primaryDomainLabel}
              </span>
              <span className="text-xs text-slate-300">×</span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {assessment.primaryMotifLabel}
              </span>
            </div>
          )}
          {assessment.frameworkSummary && (
            <p className="mt-1.5 text-xs leading-5 text-slate-400">{assessment.frameworkSummary}</p>
          )}
          <div className="mt-5 grid gap-5">
            {assessment.structuralHypotheses.map((hyp, idx) => {
              const hypAdded = addedTitles.has(hyp.label);
              return (
                <div
                  key={hyp.label}
                  className={`rounded-2xl border p-5 transition ${hypAdded ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{hyp.label}</p>
                      {(hyp.domainId || hyp.motifId) && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {hyp.domainId && (
                            <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                              {hyp.domainId}{hyp.domainLabel ? `\u00a0${hyp.domainLabel}` : ''}
                            </span>
                          )}
                          {hyp.motifId && (
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {hyp.motifId}{hyp.motifLabel ? `\u00a0${hyp.motifLabel}` : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${confidenceBadgeClass(hyp.confidence)}`}>
                      {confidenceLabel(hyp.confidence)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{hyp.rationale}</p>
                  {hyp.causalChain && (
                    <p className="mt-3 rounded-xl bg-white px-3 py-2 font-mono text-xs text-teal-800">
                      {hyp.causalChain}
                    </p>
                  )}
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {hyp.amplifiers.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-rose-700">増幅因子</p>
                        <ul className="mt-2 space-y-1">
                          {hyp.amplifiers.map((a) => (
                            <li key={a} className="text-xs leading-5 text-slate-600">{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hyp.protectors.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-emerald-700">保護因子</p>
                        <ul className="mt-2 space-y-1">
                          {hyp.protectors.map((p) => (
                            <li key={p} className="text-xs leading-5 text-slate-600">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hyp.interventionPoints.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-teal-700">介入ポート</p>
                        <ul className="mt-2 space-y-1">
                          {hyp.interventionPoints.map((pt) => (
                            <li key={pt} className="text-xs leading-5 text-slate-600">{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <button
                      type="button"
                      onClick={() => onToggleHypothesis(hyp, idx)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        hypAdded
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'border border-indigo-400 text-indigo-700 hover:bg-indigo-50'
                      }`}
                    >
                      {hypAdded ? '✓ 合意文書に追加済み' : '合意文書に追加する'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Intervention plan */}
      {assessment.interventionPlan.length > 0 && (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            支援仮説
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {assessment.interventionPlan.map((item, idx) => {
              const added = addedTitles.has(item.title);
              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-5 transition ${added ? 'border-teal-400 bg-teal-50/60' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex flex-wrap items-start gap-2">
                    <p className="flex-1 font-semibold text-slate-950">{item.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${feasibilityClass(item.feasibility)}`}>
                      {feasibilityLabel(item.feasibility)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                      {interventionTypeLabel(item.interventionType)}
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                      {item.ownerRole}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.rationale}</p>
                  {item.implementationNotes.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {item.implementationNotes.map((note) => (
                        <li
                          key={note}
                          className="flex items-baseline gap-2 text-xs leading-6 text-slate-600"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.evidenceBasis && (
                    <p className="mt-3 text-xs text-slate-400">根拠: {item.evidenceBasis}</p>
                  )}
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <button
                      type="button"
                      onClick={() => onToggleAgreement(item, idx)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        added
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'border border-teal-400 text-teal-700 hover:bg-teal-50'
                      }`}
                    >
                      {added ? '✓ 合意文書に追加済み' : '合意文書に追加する'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Follow-up questions — display only; interaction is handled by FollowupForm below */}
      {assessment.followupQuestions.length > 0 && !assessment.structuredFollowupQuestions.length && (
        <section className="rounded-[1.75rem] border border-amber-200/70 bg-amber-50/60 p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            追加確認事項
          </p>
          <div className="mt-5 grid gap-3">
            {assessment.followupQuestions.map((q) => (
              <div
                key={q}
                className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-slate-700"
              >
                {q}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Knowledge base basis — always shown */}
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          見立ての根拠
        </p>
        <p className="mt-1 text-xs text-slate-500">
          以下の実証データ・実践知識をAIが参照し、ICFフレームに沿って見立てを生成しています。最終的な判断は、相談者が行います。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: 'ICFベース分析フレーム',
              detail: '8ドメイン×6モチーフ 構造化アトラス',
              color: 'border-teal-200 bg-teal-50/60',
              badge: 'bg-teal-100 text-teal-800',
            },
            {
              label: '支援者実践調査',
              detail: '就労支援者 n=3,053 の4象限分析（JEED特別研究）— 71.9%が「理念あり・実施困難」',
              color: 'border-indigo-200 bg-indigo-50/60',
              badge: 'bg-indigo-100 text-indigo-800',
            },
            {
              label: '就労支援実践知識',
              detail: '支援事例から抽出した普遍的原則',
              color: 'border-amber-200 bg-amber-50/60',
              badge: 'bg-amber-100 text-amber-800',
            },
            {
              label: '国際的配慮・支援エビデンス',
              detail: 'AskJAN / JEED / UK / EU / カナダ / 豪州',
              color: 'border-slate-200 bg-slate-50',
              badge: 'bg-slate-100 text-slate-600',
            },
          ].map((kb) => (
            <div key={kb.label} className={`rounded-2xl border p-4 ${kb.color}`}>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${kb.badge}`}>
                {kb.label}
              </span>
              <p className="mt-2 text-xs leading-5 text-slate-600">{kb.detail}</p>
            </div>
          ))}
        </div>

        {/* Case-specific references from AI */}
        {assessment.referenceItems.length > 0 && (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              このケースへの参照
            </p>
            <div className="mt-3 grid gap-3">
              {(['direct_basis', 'conditional_hypothesis', 'related_reading'] as const)
                .flatMap((role) =>
                  assessment.referenceItems
                    .filter((ref) => ref.evidenceRole === role)
                    .map((ref) => (
                      <div
                        key={ref.title}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start gap-2">
                          {ref.url ? (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-sm font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-900"
                            >
                              {ref.title} ↗
                            </a>
                          ) : (
                            <p className="flex-1 text-sm font-semibold text-slate-900">{ref.title}</p>
                          )}
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            {sourceTypeLabel(ref.sourceType)}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${evidenceRoleClass(ref.evidenceRole)}`}>
                            {evidenceRoleLabel(ref.evidenceRole)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-slate-600">{ref.summary}</p>
                        {ref.relevanceNote && (
                          <p className="mt-2 text-xs text-slate-400">関連性: {ref.relevanceNote}</p>
                        )}
                      </div>
                    ))
                )}
            </div>
          </>
        )}
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Agreement document builder
// ---------------------------------------------------------------------------

type AgreementBuilderProps = {
  items: AgreementItem[];
  notes: string;
  consultationDate: string;
  finalized: boolean;
  consultation: string;
  assessmentSummary: string;
  synthesisText: string;
  onUpdateNotes: (notes: string) => void;
  onEditItemNotes: (id: string, val: string) => void;
  onRemoveItem: (id: string) => void;
  onFinalize: () => Promise<void>;
  finalizing: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
};

function AgreementBuilder({
  items, notes, consultationDate, finalized,
  consultation, assessmentSummary, synthesisText,
  onUpdateNotes, onEditItemNotes, onRemoveItem,
  onFinalize, finalizing, anchorRef,
}: AgreementBuilderProps) {
  if (!items.length && !finalized) return null;

  // Group items by type for organised display
  const hypothesisItems = items.filter((i) => i.itemType === 'hypothesis');
  const interventionItems = items.filter((i) => i.itemType === 'intervention');

  if (finalized) {
    return (
      <section
        ref={anchorRef as React.RefObject<HTMLElement>}
        className="rounded-[1.75rem] border-2 border-teal-400 bg-white p-8 print:border-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">合意文書</p>
            <p className="mt-1 text-xs text-slate-400">{consultationDate}</p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 print:hidden"
          >
            ↓ 印刷 / PDF保存
          </button>
        </div>

        {consultation && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">相談内容の整理</p>
            <p className="mt-3 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{consultation}</p>
          </div>
        )}

        {assessmentSummary && (
          <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">専門家の見立ての要旨</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{assessmentSummary}</p>
          </div>
        )}

        {synthesisText && (
          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">総合的な解説</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{synthesisText}</p>
          </div>
        )}

        {hypothesisItems.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              問題構造の仮説（{hypothesisItems.length}件）
            </p>
            <div className="mt-3 grid gap-4">
              {hypothesisItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  {item.causalChain && (
                    <p className="mt-2 font-mono text-xs text-indigo-700">{item.causalChain}</p>
                  )}
                  {item.editableNotes && (
                    <p className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-wrap">{item.editableNotes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {interventionItems.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              採用する支援仮説（{interventionItems.length}件）
            </p>
            <div className="mt-3 grid gap-4">
              {interventionItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="flex-1 font-semibold text-slate-900">{item.title}</p>
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
                      {interventionTypeLabel(item.interventionType ?? '')}
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                      {item.ownerRole}
                    </span>
                  </div>
                  {item.editableNotes && (
                    <p className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-wrap">{item.editableNotes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {notes && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold text-slate-500 mb-2">備考・補足</p>
            <p className="text-sm leading-7 text-slate-600 whitespace-pre-wrap">{notes}</p>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-400">
          ※ この文書は就労支援における支援内容の合意記録です。最終判断は支援者が行います。
        </p>
      </section>
    );
  }

  return (
    <section
      ref={anchorRef as React.RefObject<HTMLElement>}
      className="rounded-[1.75rem] border-2 border-teal-300 bg-teal-50/40 p-7"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800">
            合意文書を作成中
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            採用する支援内容を確認・編集してください
          </p>
        </div>
        <span className="rounded-full bg-teal-200 px-3 py-1 text-sm font-bold text-teal-900">
          {items.length}件
        </span>
      </div>

      {hypothesisItems.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            問題構造の仮説
          </p>
          <div className="mt-3 grid gap-3">
            {hypothesisItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-indigo-100 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 font-semibold text-slate-900">{item.title}</p>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="shrink-0 rounded-full px-3 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    削除
                  </button>
                </div>
                <label className="mt-3 block">
                  <span className="text-xs text-slate-400">仮説の記述（編集可）</span>
                  <textarea
                    value={item.editableNotes}
                    onChange={(e) => onEditItemNotes(item.id, e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-7 text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {interventionItems.length > 0 && (
        <div className={hypothesisItems.length > 0 ? 'mt-5' : 'mt-5'}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            採用する支援仮説
          </p>
          <div className="mt-3 grid gap-3">
            {interventionItems.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
                        {interventionTypeLabel(item.interventionType ?? '')}
                      </span>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                        {item.ownerRole}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="shrink-0 rounded-full px-3 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    削除
                  </button>
                </div>
                <label className="mt-3 block">
                  <span className="text-xs text-slate-400">実施内容（編集可）</span>
                  <textarea
                    value={item.editableNotes}
                    onChange={(e) => onEditItemNotes(item.id, e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-7 text-slate-900 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}


      <div className="mt-4">
        <label className="block">
          <span className="text-xs text-slate-400">備考・補足（任意）</span>
          <textarea
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-7 text-slate-900 placeholder:text-slate-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            placeholder="次回確認事項、留意点など"
          />
        </label>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={finalizing || !items.length}
          onClick={() => { void onFinalize(); }}
          className="rounded-full bg-teal-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {finalizing ? '記録中…' : '合意文書を確定する'}
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Follow-up form
// ---------------------------------------------------------------------------

type FollowupFormProps = {
  structuredQuestions: FchmaStructuredFollowupQuestion[];
  hypotheses: FchmaStructuralHypothesis[];
  selections: Record<number, string[]>;
  freeText: string;
  loading: boolean;
  iterationCount: number;
  onToggleOption: (qi: number, opt: string) => void;
  onFreeTextChange: (val: string) => void;
  onSubmit: () => void;
  onSkipToAgreement: () => void;
};

function confidencePriority(c: string) {
  if (c === 'low') return 0;
  if (c === 'medium') return 1;
  return 2;
}

function FollowupForm({
  structuredQuestions,
  hypotheses,
  selections,
  freeText,
  loading,
  iterationCount,
  onToggleOption,
  onFreeTextChange,
  onSubmit,
  onSkipToAgreement,
}: FollowupFormProps) {
  const hasAnyInput =
    Object.values(selections).some((v) => v.length > 0) || freeText.trim().length > 0;

  // Show hypotheses that still have room to improve (not high confidence)
  const refinableHypotheses = [...hypotheses]
    .filter((h) => h.confidence !== 'high')
    .sort((a, b) => confidencePriority(a.confidence) - confidencePriority(b.confidence));

  // Loading state: replace form with step progress
  if (loading) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200/70 bg-amber-50/60 p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
          追加情報で見立てを更新する
        </p>
        <div className="mt-6 flex flex-col items-center gap-5 py-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
          <p className="text-sm font-semibold text-slate-700">追加情報をもとに見立てを更新しています</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="rounded-full bg-amber-200 px-3 py-1 font-semibold text-amber-900">① 情報を受付</span>
            <span className="text-slate-300">→</span>
            <span className="rounded-full bg-amber-500 px-3 py-1 font-semibold text-white">② 専門知識と照合中</span>
            <span className="text-slate-300">→</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-400">③ 見立てを更新</span>
          </div>
          <p className="text-xs text-slate-400">構造仮説と支援仮説を再生成しています…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-amber-200/70 bg-amber-50/60 p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            情報を補足する（任意・最大2回）
          </p>
          <p className="mt-1 text-xs text-slate-500">
            補足なしでも合意文書の作成に進めます。「仮説として採用可」は実践に十分な根拠水準です。
          </p>
        </div>
        {iterationCount >= 1 && (
          <button
            type="button"
            onClick={onSkipToAgreement}
            className="shrink-0 rounded-full bg-teal-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-800"
          >
            この見立てで進める →
          </button>
        )}
      </div>

      {/* Differential focus — what we're trying to narrow down */}
      {refinableHypotheses.length > 0 && (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-white/70 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
            鑑別・確信度向上の対象
          </p>
          <div className="mt-2 grid gap-2">
            {refinableHypotheses.map((hyp) => (
              <div key={hyp.label} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  hyp.confidence === 'low'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {hyp.confidence === 'low' ? '確信度：低' : '確信度：中'}
                </span>
                <p className="text-xs leading-5 text-slate-700">{hyp.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-4 text-slate-400">
            以下の追加情報が、これらの仮説の鑑別と確信度向上に使われます。
          </p>
        </div>
      )}

      {structuredQuestions.length > 0 && (
        <div className="mt-4 grid gap-4">
          {structuredQuestions.map((q, qi) => (
            <div key={qi} className="rounded-2xl bg-white/80 p-4">
              {q.differentialPurpose && (
                <p className="mb-2 text-[11px] leading-4 text-amber-700 italic">
                  → {q.differentialPurpose}
                </p>
              )}
              <p className="text-sm font-semibold text-slate-800">{q.question}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.suggestedOptions.map((opt) => {
                  const selected = (selections[qi] ?? []).includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onToggleOption(qi, opt)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? 'border-amber-500 bg-amber-100 text-amber-800'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-amber-400'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            補足・自由記述（任意）
          </span>
          <textarea
            value={freeText}
            onChange={(e) => onFreeTextChange(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-[1.25rem] border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="選択肢にない状況や補足情報があれば記入してください。"
          />
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          disabled={loading || !hasAnyInput}
          onClick={onSubmit}
          className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '再分析中…' : '見立てを更新する'}
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JacNextPage() {
  const [consultation, setConsultation] = useState('');
  const [assessment, setAssessment] = useState<FchmaFullAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Follow-up state
  const [followupSelections, setFollowupSelections] = useState<Record<number, string[]>>({});
  const [followupFreeText, setFollowupFreeText] = useState('');
  const [followupLoading, setFollowupLoading] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);
  // Accumulated follow-up history sent to the AI on every refinement call
  const [cumulativeContext, setCumulativeContext] = useState('');
  // Track question texts that have already been presented to the user
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());

  // Agreement document state
  const [agreementItems, setAgreementItems] = useState<AgreementItem[]>([]);
  const [agreementNotes, setAgreementNotes] = useState('');
  const [agreementFinalized, setAgreementFinalized] = useState(false);
  const [agreementFinalizing, setAgreementFinalizing] = useState(false);
  const [agreementSynthesis, setAgreementSynthesis] = useState('');
  const [consultationDate] = useState(() => new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }));
  const agreementRef = useRef<HTMLElement | null>(null);

  async function callAssessApi(consultation: string, additionalContext?: string) {
    const response = await fetch('/api/fchma/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultation, additionalContext }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error || 'アセスメントの生成に失敗しました。');
    }

    return (await response.json()) as FchmaFullAssessment;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = consultation.trim();
    if (trimmed.length < 8) {
      setError('相談文をもう少し書いてください（8文字以上）。');
      return;
    }

    setLoading(true);
    setError(null);
    setAssessment(null);
    setFollowupSelections({});
    setFollowupFreeText('');
    setIterationCount(0);
    setCumulativeContext('');
    setAskedQuestions(new Set());
    setAgreementItems([]);
    setAgreementNotes('');
    setAgreementFinalized(false);
    setAgreementSynthesis('');

    try {
      const body = await callAssessApi(trimmed);
      startTransition(() => {
        setAssessment(body);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アセスメントの生成に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  function toggleFollowupOption(questionIndex: number, option: string) {
    setFollowupSelections((prev) => {
      const current = prev[questionIndex] ?? [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [questionIndex]: next };
    });
  }

  function toggleAgreementItem(item: FchmaInterventionItem, idx: number) {
    const isFirstAdd = agreementItems.length === 0;
    setAgreementItems((prev) => {
      // Deduplicate by title across assessment updates (idx can change between rounds)
      const existing = prev.find((a) => a.itemType === 'intervention' && a.title === item.title);
      if (existing) return prev.filter((a) => a.id !== existing.id);
      return [
        ...prev,
        {
          id: `${idx}-${item.title}`,
          itemType: 'intervention' as const,
          title: item.title,
          interventionType: item.interventionType,
          ownerRole: item.ownerRole,
          editableNotes: item.implementationNotes.join('\n'),
          evidenceBasis: item.evidenceBasis,
        },
      ];
    });
    // Only scroll to agreement on the very first add so subsequent adds don't interrupt browsing
    if (isFirstAdd) {
      setTimeout(() => {
        agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function toggleAgreementHypothesis(hyp: FchmaStructuralHypothesis, idx: number) {
    const isFirstAdd = agreementItems.length === 0;
    setAgreementItems((prev) => {
      // Deduplicate by label across assessment updates
      const existing = prev.find((a) => a.itemType === 'hypothesis' && a.title === hyp.label);
      if (existing) return prev.filter((a) => a.id !== existing.id);
      return [
        ...prev,
        {
          id: `hyp-${idx}-${hyp.label}`,
          itemType: 'hypothesis' as const,
          title: hyp.label,
          causalChain: hyp.causalChain,
          confidence: hyp.confidence,
          editableNotes: hyp.rationale,
        },
      ];
    });
    if (isFirstAdd) {
      setTimeout(() => {
        agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function editAgreementItemNotes(id: string, val: string) {
    setAgreementItems((prev) => prev.map((a) => (a.id === id ? { ...a, editableNotes: val } : a)));
  }

  function removeAgreementItem(id: string) {
    setAgreementItems((prev) => prev.filter((a) => a.id !== id));
  }

  async function finalizeAgreement() {
    setAgreementFinalizing(true);

    const hypothesesSelected = agreementItems
      .filter((i) => i.itemType === 'hypothesis')
      .map(({ title, causalChain }) => ({ label: title, causalChain }));
    const interventionsSelected = agreementItems
      .filter((i) => i.itemType === 'intervention')
      .map(({ title, ownerRole }) => ({ title, ownerRole }));

    // Generate AI synthesis (best-effort; non-blocking on failure)
    try {
      const synthRes = await fetch('/api/jac-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultation: assessment?.consultation ?? '',
          frameworkSummary: assessment?.aiAssessment?.frameworkSummary ?? '',
          selectedHypotheses: hypothesesSelected,
          selectedInterventions: interventionsSelected,
        }),
      });
      if (synthRes.ok) {
        const synthData = (await synthRes.json()) as { synthesis?: string };
        if (synthData.synthesis) setAgreementSynthesis(synthData.synthesis);
      }
    } catch {
      // synthesis is best-effort
    }

    // Save feedback (best-effort)
    try {
      await fetch('/api/fchma/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generatedAt: assessment?.generatedAt,
          selectedItems: agreementItems.map(({ title, interventionType, ownerRole }) => ({
            title,
            interventionType,
            ownerRole,
          })),
        }),
      });
    } catch {
      // feedback is best-effort; don't block the user
    }

    setAgreementFinalized(true);
    setAgreementFinalizing(false);
    setTimeout(() => {
      agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function handleFollowupSubmit() {
    if (!assessment) return;

    // Capture questions currently shown BEFORE the API call — these become "asked"
    const currentlyShownQs = assessment.aiAssessment?.structuredFollowupQuestions ?? [];

    const structuredAnswers = currentlyShownQs
      .map((q: FchmaStructuredFollowupQuestion, i: number) => {
        const sels = followupSelections[i] ?? [];
        if (!sels.length) return null;
        return `Q: ${q.question}\nA: ${sels.join('、')}`;
      })
      .filter(Boolean)
      .join('\n\n');

    const thisRound = [structuredAnswers, followupFreeText.trim()].filter(Boolean).join('\n\n');
    if (!thisRound) return;

    // Build cumulative context with round label so the AI knows what was already answered
    const roundLabel = `【第${iterationCount + 1}回 追加情報】`;
    const newCumulative = [cumulativeContext, `${roundLabel}\n${thisRound}`]
      .filter(Boolean)
      .join('\n\n');

    setFollowupLoading(true);
    setError(null);

    try {
      const body = await callAssessApi(consultation.trim(), newCumulative);
      startTransition(() => {
        setAssessment(body);
        setIterationCount((n) => n + 1);
        setCumulativeContext(newCumulative);
        setFollowupSelections({});
        setFollowupFreeText('');
        // Mark previously shown questions as asked so they are filtered in the next round
        setAskedQuestions((prev) => {
          const next = new Set(prev);
          currentlyShownQs.forEach((q) => next.add(q.question));
          return next;
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '見立ての更新に失敗しました。');
    } finally {
      setFollowupLoading(false);
    }
  }

  return (
    <>
      <PageSeo
        title="はたらく相談室"
        description="就労の詰まりを、一緒に整理します。日本の当事者・支援者データから導いた専門知識ネットワークが、現場の一手を示します。"
        path="/jac/next"
        noIndex={false}
      />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.14),_transparent_30%),linear-gradient(180deg,_#f8fcfb_0%,_#eef5ff_50%,_#fffaf2_100%)] text-slate-900">

        {/* Top bar */}
        <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 md:px-10">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950">
              <span className="text-teal-700">NBL</span>
              <span className="text-slate-400">/</span>
              <span>はたらく相談室</span>
            </Link>
            <Link href="/jac" className="text-xs text-slate-400 hover:text-slate-700">
              ← 相談室トップ
            </Link>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 md:px-10">

          {/* Hero + form */}
          <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
                はたらく相談室
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                就労の詰まりを、一緒に整理する。
              </h1>
              <p className="mt-4 text-sm leading-8 text-slate-600">
                相談内容から支援仮説を生成し、具体的な一手を示します。
                最終的な見立てと判断は支援者と本人が持ちます。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  相談の手がかり
                </span>
                <textarea
                  value={consultation}
                  onChange={(e) => setConsultation(e.target.value)}
                  className="mt-2 min-h-[180px] w-full rounded-[1.25rem] border border-slate-300 bg-white px-5 py-4 text-sm leading-7 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="例: 午後になると疲労が強く、会議での理解が落ちる。上司には少し相談したが、勤務時間の調整はまだない。働き続けたいが悪化が不安。"
                />
              </label>
              {error && (
                <p className="mt-3 text-sm text-rose-600">{error}</p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? '分析中…' : '見立てを開始する'}
                </button>
                <Link
                  href="/jac"
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  ← 相談室について
                </Link>
              </div>
            </form>
          </section>

          {/* Loading state */}
          {loading && (
            <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-8 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
              <p className="mt-4 text-sm text-slate-600">
                支援仮説を生成しています。少々お待ちください…
              </p>
            </section>
          )}

          {/* Results */}
          {assessment && !loading && (() => {
            const ai = assessment.aiAssessment;
            const addedTitles = new Set(agreementItems.map((a) => a.title));
            const filteredFollowupQs = ai
              ? ai.structuredFollowupQuestions.filter((q) => !askedQuestions.has(q.question))
              : [];
            const allHigh = ai
              ? ai.structuralHypotheses.length > 0 &&
                ai.structuralHypotheses.every((h) => h.confidence === 'high')
              : false;
            // Assessment is "settled" when:
            // - all hypotheses reached high confidence, OR
            // - no new structured questions remain after at least 1 update, OR
            // - 2 follow-up rounds completed (hard cap — medium confidence is actionable)
            const assessmentSettled =
              allHigh ||
              (iterationCount > 0 && filteredFollowupQs.length === 0) ||
              iterationCount >= 2;

            return (
            <>
              {/* Signals */}
              <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  抽出されたシグナル
                </p>
                <SignalBadges signals={assessment.extractedSignals} />
              </section>

              {/* AI assessment */}
              {ai && (
                <AssessmentSection
                  assessment={ai}
                  addedTitles={addedTitles}
                  addedCount={agreementItems.length}
                  onToggleAgreement={toggleAgreementItem}
                  onToggleHypothesis={toggleAgreementHypothesis}
                  iterationCount={iterationCount}
                />
              )}

              {/* Follow-up form — refine before documenting */}
              {ai && !agreementFinalized && !assessmentSettled && (
                <FollowupForm
                  structuredQuestions={filteredFollowupQs}
                  hypotheses={ai.structuralHypotheses}
                  selections={followupSelections}
                  freeText={followupFreeText}
                  loading={followupLoading}
                  iterationCount={iterationCount}
                  onToggleOption={toggleFollowupOption}
                  onFreeTextChange={setFollowupFreeText}
                  onSubmit={handleFollowupSubmit}
                  onSkipToAgreement={() => {
                    setTimeout(() => {
                      agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                />
              )}

              {/* Settled: no more questions — show completion banner */}
              {ai && !agreementFinalized && assessmentSettled && (
                <section className="rounded-[1.75rem] border border-teal-200 bg-teal-50/60 px-7 py-6">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-teal-800">
                        {allHigh
                          ? '見立てが安定しました'
                          : iterationCount >= 2
                          ? '見立てを確定できます'
                          : '追加確認の質問が尽きました'}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        {allHigh
                          ? 'すべての仮説の確信度が高くなりました。'
                          : '「仮説として採用可」は就労支援の現場で十分に行動できる根拠水準です。完璧な確信を待つより、この見立てを出発点に実践で検証することが重要です。'}
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-200 px-3 py-1 text-xs font-semibold text-teal-900">
                      {iterationCount}回補足完了
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTimeout(() => {
                          agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                      className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      この見立てで合意文書を作成する →
                    </button>
                  </div>
                </section>
              )}

              {/* Transition: from refine → agreement */}
              {ai && !agreementFinalized && (
                <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 px-7 py-5">
                  <p className="text-sm font-semibold text-slate-700">見立てに納得したら</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    採用する仮説・支援仮説を「合意文書に追加する」で選んで、合意文書を確定してください。
                    同じタイトルの項目は自動的に重複しません。
                  </p>
                  {agreementItems.length > 0 ? (
                    <p className="mt-3 text-xs font-semibold text-teal-700">
                      ✓ {agreementItems.length}件 選択中 — 下の合意文書を確認してください
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">
                      各仮説・支援仮説カードの「合意文書に追加する」ボタンで選択できます。
                    </p>
                  )}
                </section>
              )}

              {/* Agreement document builder */}
              {assessment.aiAssessment && (
                <AgreementBuilder
                  items={agreementItems}
                  notes={agreementNotes}
                  consultationDate={consultationDate}
                  finalized={agreementFinalized}
                  consultation={assessment.consultation}
                  assessmentSummary={assessment.aiAssessment.frameworkSummary}
                  synthesisText={agreementSynthesis}
                  onUpdateNotes={setAgreementNotes}
                  onEditItemNotes={editAgreementItemNotes}
                  onRemoveItem={removeAgreementItem}
                  onFinalize={finalizeAgreement}
                  finalizing={agreementFinalizing}
                  anchorRef={agreementRef}
                />
              )}

              {/* Fallback: AI error but show deterministic followup */}
              {!assessment.aiAssessment && assessment.aiError && (
                <section className="rounded-[1.75rem] border border-rose-200/70 bg-rose-50/60 p-7">
                  <p className="text-sm font-semibold text-rose-700">
                    AI アセスメントでエラーが発生しました
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{assessment.aiError}</p>
                  {assessment.deterministicFollowupQuestions.length > 0 && (
                    <>
                      <p className="mt-5 text-sm font-semibold text-slate-700">
                        シグナルから生成した確認事項:
                      </p>
                      <div className="mt-3 grid gap-3">
                        {assessment.deterministicFollowupQuestions.map((q) => (
                          <div
                            key={q}
                            className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-slate-700"
                          >
                            {q}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Reset */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setAssessment(null);
                    setConsultation('');
                    setAgreementItems([]);
                    setAgreementNotes('');
                    setAgreementFinalized(false);
                    setAgreementSynthesis('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  新しい相談を始める
                </button>
              </div>
            </>
            );
          })()}

          {/* Method note (shown before assessment) */}
          {!assessment && !loading && (
            <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                このツールについて
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  [
                    '複数仮説の並列提示',
                    'ICFの枠組みで整理された就労困難の問題構造と典型的な因果パターンの組み合わせを見取り図として持ち、相談内容との類似性が認められるパターンを複数の仮説候補として提示します。この見取り図が、専門的な見立てを進めるための地図になります。最初の仮説は断片情報による暫定で、追加質問への回答でフレームを絞り込みます。',
                  ],
                  [
                    '類似事例の照合',
                    '実証的な調査データに基づき、類似する困難パターンを参照します。健康状態・就労状況・代表記述が実データ由来の情報です。',
                  ],
                  [
                    '支援知識の参照',
                    '日本の当事者・支援者調査データ、個別就労支援の国際標準モデルをNBLが日本データで再検証した結果、就労支援事例から抽出した実践原則、国際的な職場配慮ガイダンスの4層を参照知識として使います。',
                  ],
                  [
                    '合意文書の作成',
                    '採用する仮説と支援案を選択し、実施内容を編集して合意文書を作成できます。相談内容の整理・見立ての要旨・AIによる総合的な解説が文書に含まれます。',
                  ],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 p-5">
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
