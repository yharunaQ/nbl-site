import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildAgenticPlan } from '@/lib/knowledge/agenticPlanner';
import { executeAgenticPlan } from '@/lib/knowledge/agenticExecutor';
import { buildGlmInsights } from '@/lib/knowledge/glmRuntimeInsights';
import {
  getCitationEvidenceDetails,
  type CitationEvidenceDetail,
} from '@/lib/knowledge/claimRegistry';
import {
  GlmInsight,
  GlmInsightResult,
  GLM_INTERACTION_MEANINGS,
} from '@/lib/knowledge/glmInsights';
import { createRefinementJob } from '@/lib/jac/refinementJobStore';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';
import { getKnowledgeSourceById } from '@/lib/knowledge/sourceRegistry';
import type { KnowledgeSafetyGate } from '@/lib/knowledge/types';
import { recordJacSafetyAudit, type JacSafetyGateAuditSnapshot } from '@/lib/jac/safetyAuditLog';
import {
  getData2KnowledgeBundle,
  type SuggestionSeed as Data2SuggestionSeed,
} from '@/lib/jac/data2Knowledge';
import {
  getSupportCatalogBundle,
  type SupportCatalogPromptIssue,
  type SupportCatalogSuggestionSeed,
} from '@/lib/jac/supportCatalog';
import {
  buildRegionalSupportPromptGuidance,
  REGIONAL_SUPPORT_POSITIONING_DETAIL,
  REGIONAL_SUPPORT_POSITIONING_SOURCE_NOTE,
  REGIONAL_SUPPORT_PROMPT_RULES,
} from '@/lib/jac/regionalSupportPositioning';
import {
  buildStep4ReferencePromptGuidance,
  STEP4_REFERENCE_SOURCE_NOTE,
} from '@/lib/jac/step4ReferencePositioning';
import {
  buildPracticalReferencePreview,
  type PracticalReferencePreviewItem,
} from '@/lib/jac/practicalReferenceCatalog';
import { buildStep4EvidencePack } from '@/lib/jac/step4EvidencePack';
import {
  buildSelectedTagContractSummary,
  buildStepContractPromptGuidance,
} from '@/lib/jac/stepContract';
import type { TagGroupKey } from '@/lib/jac/tagTaxonomy';

type FollowUpAnswer = {
  key: string;
  label: string;
  value: string;
};

type Suggestion = {
  title: string;
  reason: string;
  examples: string;
  relatedTags: string[];
  priority: number;
};

type AccommodationSelection = {
  selected: boolean;
  priority: number;
};

type SupportCatalogProcessIssue = {
  title: string;
  summary: string;
  recommendedSupports: Array<{
    title: string;
    summary: string;
  }>;
};

type RequestBody = {
  consultation: string;
  selectedTags: Record<TagGroupKey, string[]>;
  followUpAnswers: FollowUpAnswer[];
  additionalConsultation?: string;
  selectedAccommodations?: Record<string, AccommodationSelection>;
  enabledSourceIds?: string[];
  responseMode?: 'fast' | 'full';
};

const SUGGESTION_LIBRARY: Suggestion[] = [
  {
    title: '会議を短時間化して事前資料を共有',
    reason: '理解・集中負荷を下げ、会議中の疲労を抑えます。',
    examples: '30分刻み、アジェンダの事前配布、議事録の共有。',
    relatedTags: ['会議・対話', '注意集中の波・認知負荷', '疲労・倦怠（慢性疲労含む）'],
    priority: 1,
  },
  {
    title: '休憩導線とリズム設計',
    reason: '疲労や体調の波に合わせて回復時間を確保します。',
    examples: '90分に1回の短休憩、午後の負荷調整、リマインダー。',
    relatedTags: [
      '疲労・倦怠（慢性疲労含む）',
      '休憩の取りやすさ・休養導線',
      '睡眠リズム・通院/治療スケジュール',
    ],
    priority: 1,
  },
  {
    title: '静音・視覚刺激を抑えた環境へ',
    reason: '感覚過敏や認知負荷を軽減します。',
    examples: '静音席、遮光、通知制御、ノイズキャンセル。',
    relatedTags: ['感覚過敏（音・光・温度）', '騒音・音環境', '光・画面の明るさ/反射'],
    priority: 1,
  },
  {
    title: 'タスクの分割と優先順位の明確化',
    reason: 'マルチタスクによる負荷を減らし、達成感を確保します。',
    examples: '1日の優先度トップ3、WIP制限、進捗の可視化。',
    relatedTags: ['マルチタスク・切替', '注意集中の波・認知負荷', '時間制約・納期'],
    priority: 1,
  },
  {
    title: 'エルゴノミクス改善',
    reason: '姿勢負荷や痛みの増悪を予防します。',
    examples: '椅子・机の調整、モニタ位置の最適化、姿勢補助。',
    relatedTags: ['姿勢・椅子・机（エルゴノミクス）', '痛み・体調変動（波がある）'],
    priority: 1,
  },
  {
    title: '締切のバッファ設計',
    reason: '体調変動があっても締切遵守を支えます。',
    examples: '中間締切を設定、レビュー日を前倒し。',
    relatedTags: ['時間制約・納期', '疲労・倦怠（慢性疲労含む）'],
    priority: 1,
  },
  {
    title: 'タスク二重化・代替担当の合意',
    reason: '不調時の業務穴を最小化します。',
    examples: '代替担当の事前設定、引き継ぎテンプレ。',
    relatedTags: ['時間制約・納期', '痛み・体調変動（波がある）'],
    priority: 1,
  },
  {
    title: '業務負荷の平準化',
    reason: '繁忙期に負荷が集中することを避けます。',
    examples: '繁忙期のタスク分散、前倒し計画。',
    relatedTags: ['時間制約・納期', '疲労・倦怠（慢性疲労含む）'],
    priority: 1,
  },
  {
    title: '通院・治療スケジュールへの配慮',
    reason: '治療継続と業務継続を両立します。',
    examples: '通院日の稼働調整、柔軟な始業/終業時間。',
    relatedTags: ['睡眠リズム・通院/治療スケジュール', '時間制約・納期'],
    priority: 2,
  },
  {
    title: '本人の裁量を保ちながら段階調整',
    reason: '自律性を尊重しながら配慮を運用できます。',
    examples: '本人の優先度を尊重、週次レビューで段階調整。',
    relatedTags: ['裁量・自己決定を重視', '役割・専門性を維持したい'],
    priority: 2,
  },
  {
    title: '情報をスローダウンして共有',
    reason: '認知負荷が高い状況で理解を支援します。',
    examples: '要点サマリー、段階的説明、文字量の最適化。',
    relatedTags: ['注意集中の波・認知負荷', '文章作成・読解'],
    priority: 2,
  },
  {
    title: 'コミュニケーションの非同期化',
    reason: '対人ストレスや同席負荷を軽減します。',
    examples: 'チャットでの合意、レスポンス時間の合意。',
    relatedTags: ['対人調整・感情労働', '同席人数・密度'],
    priority: 2,
  },
  {
    title: '通勤負荷の軽減',
    reason: '体調の波や疲労の悪化を防ぎます。',
    examples: '時差出勤、週数回の在宅勤務。',
    relatedTags: ['通勤負荷（時間/混雑/距離）', '疲労・倦怠（慢性疲労含む）'],
    priority: 2,
  },
];

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_CHAT_TIMEOUT_MS_DEFAULT = 75000;
const EXECUTION_TIMEOUT_MS = 7000;

function buildComposedQuery(payload: RequestBody): string {
  const tagText = Object.values(payload.selectedTags || {})
    .flat()
    .join(' / ');

  const followUp = (payload.followUpAnswers || [])
    .map((item) => `${item.label}:${item.value}`)
    .join(' | ');

  return [payload.consultation || '', payload.additionalConsultation || '', tagText, followUp]
    .map((part) => part.trim())
    .filter(Boolean)
    .join('\n');
}

function buildSystemPrompt(): string {
  return `あなたはJACのAIカウンセラーです。

役割:
- 企業側が配慮を検討するために、相談内容から因果関係（原因→影響→増悪因子→保護因子）を整理する。
- 医療診断は行わず、職業場面・タスク条件・環境条件・本人希望に基づいて整理する。
- 追加相談や配慮候補の選択結果を踏まえて、見立てを更新する。
- 提案は合意形成の材料であり、断定的な医療助言は避ける。
- 【重要】consultation（相談文）に障害名・診断名・特性名・症状名が明記されている場合は、タグ選択の有無に関わらず必ずその情報を読み取り、見立てに反映すること。タグは補助的な整理であり、相談文が主情報である。
- selected_tags は Step 2 の粗い入口であり、見落とし防止のための補助線として扱う。タグ自体を結論として扱わない。
- planner_context.glm_context はGLM分析の実証的知見。関連する場合は優先的に配慮案へ反映する。
- GLM根拠に対応する配慮案を、理由に「どの状況を下げる/上げるためか」を含めて明示する。
- planner_context.safety_gate.mode が strict/caution の場合は、断定提案を避け、追加確認質問と条件付き提案を優先する。

${buildRegionalSupportPromptGuidance()}
${buildStepContractPromptGuidance()}
${buildStep4ReferencePromptGuidance()}
- planner_context.support_catalog_context は上記ルールに従って使う。
- planner_context.practical_reference_context は web-cache 由来の類似事例・雇用ガイダンスであり、直接根拠ではなく、合意文書に書いた合理的配慮や支援の実施方法を具体化する参考としてのみ使う。
- 知的障害、身体障害、内部障害、難病、高次脳機能障害など、伝統的な障害者就労支援の対象でも使える地域支援の選択肢を必要に応じて含める。

出力ルール:
- JSONのみを出力する。
- 指定したスキーマに厳密に従う。
- 配慮候補は優先度順で最低3件、最大8件。
- 因果関係が読めるよう、cause/impact/aggravators/protectorsを具体化する。
- causal_chain は3〜5要素の短い因果の流れ。
- causal_summary は因果と配慮必要性がわかる文章。
- citations は claim と evidence_ids で根拠トレースを返す。`;
}

function dedupeSuggestionLibrary(suggestions: Suggestion[], maxCount = 28): Suggestion[] {
  const byTitle = new Map<string, Suggestion>();
  for (const item of suggestions) {
    const key = item.title.trim();
    if (!key) continue;
    if (!byTitle.has(key)) {
      byTitle.set(key, item);
      continue;
    }
    const prev = byTitle.get(key)!;
    byTitle.set(key, {
      ...prev,
      priority: Math.min(prev.priority, item.priority),
      relatedTags: Array.from(new Set([...(prev.relatedTags || []), ...(item.relatedTags || [])])),
    });
  }
  return [...byTitle.values()].sort((a, b) => a.priority - b.priority).slice(0, maxCount);
}

function mapData2Suggestions(rows: Data2SuggestionSeed[]): Suggestion[] {
  return rows.map((row) => ({
    title: row.title,
    reason: row.reason,
    examples: row.examples,
    relatedTags: row.relatedTags,
    priority: row.priority,
  }));
}

function mapSupportCatalogSuggestions(rows: SupportCatalogSuggestionSeed[]): Suggestion[] {
  return rows.map((row) => ({
    title: row.title,
    reason: row.reason,
    examples: row.examples,
    relatedTags: row.relatedTags,
    priority: row.priority,
  }));
}

function buildSupportCatalogPreview(
  rows: SupportCatalogPromptIssue[],
  maxIssues = 3,
): SupportCatalogProcessIssue[] {
  return rows.slice(0, maxIssues).map((issue) => ({
    title: issue.title,
    summary: issue.summary,
    recommendedSupports: issue.recommendedSupports.slice(0, 2).map((support) => ({
      title: support.title,
      summary: support.summary,
    })),
  }));
}

function buildProcessSourceNotes(
  selectedSourceIds: Array<{ id: string }>,
  hasSupportCatalogPreview: boolean,
  hasPracticalReferencePreview: boolean,
): string[] {
  return selectedSourceIds
    .map((source) => getKnowledgeSourceById(source.id)?.notes)
    .concat(hasSupportCatalogPreview ? [REGIONAL_SUPPORT_POSITIONING_SOURCE_NOTE] : [])
    .concat(hasPracticalReferencePreview ? [STEP4_REFERENCE_SOURCE_NOTE] : [])
    .filter(Boolean) as string[];
}

function buildUserPrompt(
  payload: RequestBody,
  plannerContext: Record<string, unknown>,
  knowledgeBase: Suggestion[],
): string {
  return JSON.stringify(
    {
      consultation: payload.consultation,
      selected_tags: payload.selectedTags,
      selected_tag_contract: buildSelectedTagContractSummary(payload.selectedTags),
      follow_up_answers: payload.followUpAnswers,
      additional_consultation: payload.additionalConsultation || '',
      selected_accommodations: payload.selectedAccommodations || {},
      knowledge_base: knowledgeBase,
      planner_context: plannerContext,
    },
    null,
    2,
  );
}

function buildSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      summary: { type: 'string' },
      task_conditions: { type: 'string' },
      cause: { type: 'array', items: { type: 'string' } },
      impact: { type: 'array', items: { type: 'string' } },
      aggravators: { type: 'array', items: { type: 'string' } },
      protectors: { type: 'array', items: { type: 'string' } },
      accommodations: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            reason: { type: 'string' },
            examples: { type: 'string' },
            priority: { type: 'number' },
          },
          required: ['title', 'reason', 'examples', 'priority'],
        },
      },
      agreement: { type: 'string' },
      kpi: { type: 'string' },
      causal_summary: { type: 'string' },
      causal_chain: { type: 'array', items: { type: 'string' } },
      citations: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            claim: { type: 'string' },
            evidence_ids: { type: 'array', items: { type: 'string' } },
          },
          required: ['claim', 'evidence_ids'],
        },
      },
    },
    required: [
      'summary',
      'task_conditions',
      'cause',
      'impact',
      'aggravators',
      'protectors',
      'accommodations',
      'agreement',
      'kpi',
      'causal_summary',
      'causal_chain',
      'citations',
    ],
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    promise
      .then((result) => resolve(result))
      .catch((error) => reject(error))
      .finally(() => clearTimeout(timeoutId));
  });
}

type ParsedAssessment = {
  summary: string;
  task_conditions: string;
  cause: string[];
  impact: string[];
  aggravators: string[];
  protectors: string[];
  accommodations: Array<{
    title: string;
    reason: string;
    examples: string;
    priority: number;
  }>;
  agreement: string;
  kpi: string;
  causal_summary: string;
  causal_chain: string[];
  citations: Array<{
    claim: string;
    evidence_ids: string[];
    evidence_lanes?: Array<{
      evidence_id: string;
      lane: string;
      label: string;
    }>;
    evidence_details?: CitationEvidenceDetail[];
  }>;
};

const CLAIMS_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');

const EVIDENCE_LANE_LABEL: Record<string, string> = {
  case_practice: '事例実践',
  legal_policy: '制度根拠',
  employer_guidance: '雇用主ガイダンス',
  aggregated_general: '集計一般',
  mixed: '混合',
  glm_model: 'GLMモデル',
  safety_gate: '安全ゲート',
  unknown: '不明',
};

let claimLaneMapPromise: Promise<Map<string, string>> | null = null;

function normalizeEvidenceLane(value: unknown): string {
  const lane = String(value || '').trim();
  if (!lane) return 'unknown';
  return EVIDENCE_LANE_LABEL[lane] ? lane : 'unknown';
}

async function readClaimLaneMap(): Promise<Map<string, string>> {
  if (claimLaneMapPromise) return claimLaneMapPromise;

  claimLaneMapPromise = fs
    .readFile(CLAIMS_PATH, 'utf8')
    .then((raw) => {
      type ClaimLaneRow = {
        id?: string;
        interactionContextSummary?: {
          evidenceLane?: string;
        };
      };

      const map = new Map<string, string>();
      const lines = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        let row: ClaimLaneRow;
        try {
          row = JSON.parse(line) as ClaimLaneRow;
        } catch {
          continue;
        }
        const id = String(row?.id || '').trim();
        if (!id) continue;
        const lane = normalizeEvidenceLane(row?.interactionContextSummary?.evidenceLane);
        map.set(id, lane);
      }
      return map;
    })
    .catch(() => new Map<string, string>());

  return claimLaneMapPromise;
}

function resolveEvidenceLane(evidenceId: string, claimLaneMap: Map<string, string>): string {
  const id = String(evidenceId || '').trim();
  if (!id) return 'unknown';
  if (id.startsWith('GLM-')) return 'glm_model';
  if (id === 'safety_gate') return 'safety_gate';
  return normalizeEvidenceLane(claimLaneMap.get(id) || 'unknown');
}

async function attachCitationMetadata(assessment: ParsedAssessment): Promise<ParsedAssessment> {
  const claimLaneMap = await readClaimLaneMap();
  const citations = await Promise.all(
    (assessment.citations || []).map(async (citation) => {
      const evidenceIds = Array.isArray(citation.evidence_ids) ? citation.evidence_ids : [];
      const evidence_lanes = evidenceIds.map((evidenceId) => {
        const lane = resolveEvidenceLane(evidenceId, claimLaneMap);
        return {
          evidence_id: evidenceId,
          lane,
          label: EVIDENCE_LANE_LABEL[lane] || lane,
        };
      });
      const evidence_details = await getCitationEvidenceDetails(evidenceIds);
      return {
        ...citation,
        evidence_lanes,
        evidence_details,
      };
    }),
  );

  return {
    ...assessment,
    citations,
  };
}

function mergeAssessmentWithGlm(
  assessment: ParsedAssessment,
  glmInsights: GlmInsight[],
): ParsedAssessment {
  const merged = {
    ...assessment,
    cause: [...assessment.cause],
    aggravators: [...assessment.aggravators],
    accommodations: [...assessment.accommodations],
    citations: [...assessment.citations],
  };

  const existingTitles = new Set(merged.accommodations.map((item) => item.title));
  const actionByTitle = new Map<
    string,
    { title: string; reason: string; examples: string; priority: number; evidenceId: string }
  >();

  glmInsights.forEach((insight) => {
    insight.actionTitles.forEach((title) => {
      if (actionByTitle.has(title)) return;
      actionByTitle.set(title, {
        title,
        reason: `GLM根拠: ${insight.summary}`,
        examples: `根拠: ${insight.predictor} → ${insight.outcome}（B=${insight.effect.toFixed(3)}${insight.pValue !== null ? `, p=${insight.pValue}` : ''}）`,
        priority: insight.confidence === 'high' ? 1 : 2,
        evidenceId: insight.evidenceId,
      });
    });
  });

  for (const candidate of actionByTitle.values()) {
    if (!existingTitles.has(candidate.title)) {
      merged.accommodations.push({
        title: candidate.title,
        reason: candidate.reason,
        examples: candidate.examples,
        priority: candidate.priority,
      });
    } else {
      merged.accommodations = merged.accommodations.map((item) =>
        item.title === candidate.title
          ? {
              ...item,
              priority: Math.min(item.priority, candidate.priority),
            }
          : item,
      );
    }

    if (
      !merged.citations.some((citation) => citation.evidence_ids.includes(candidate.evidenceId))
    ) {
      merged.citations.push({
        claim: `${candidate.title}を優先候補に採用`,
        evidence_ids: [candidate.evidenceId],
      });
    }
  }

  const highRiskSummaries = glmInsights
    .filter((item) => item.effect < 0)
    .map((item) => `${item.summary}（${item.evidenceId}）`);

  highRiskSummaries.slice(0, 2).forEach((summary) => {
    if (!merged.aggravators.includes(summary)) {
      merged.aggravators.push(summary);
    }
  });

  merged.accommodations = merged.accommodations.sort((a, b) => a.priority - b.priority).slice(0, 8);

  return merged;
}

function buildDefaultSafetyGate(summary: string): KnowledgeSafetyGate {
  return {
    mode: 'strict',
    recommendationPolicy: 'questions_first',
    summary,
    reasonCodes: ['execution_fallback'],
    matchedClaimCount: 0,
    highRiskClaimCount: 0,
    mediumRiskClaimCount: 0,
    aggregatedEvidenceClaimCount: 0,
    specificCaseClaimCount: 0,
    partialClaimCount: 0,
    missingContextCount: 0,
    sampleClaimIds: [],
    evidenceLaneCounts: {},
    followUpQuestions: ['相談対象の法域・職場条件・既存配慮を確認してから提案を適用してください。'],
  };
}

function toSafetyAuditSnapshot(safetyGate: KnowledgeSafetyGate): JacSafetyGateAuditSnapshot {
  return {
    mode: safetyGate.mode,
    recommendationPolicy: safetyGate.recommendationPolicy,
    summary: safetyGate.summary,
    reasonCodes: safetyGate.reasonCodes,
    matchedClaimCount: safetyGate.matchedClaimCount,
    highRiskClaimCount: safetyGate.highRiskClaimCount,
    mediumRiskClaimCount: safetyGate.mediumRiskClaimCount,
    aggregatedEvidenceClaimCount: safetyGate.aggregatedEvidenceClaimCount,
    specificCaseClaimCount: safetyGate.specificCaseClaimCount,
    partialClaimCount: safetyGate.partialClaimCount,
    missingContextCount: safetyGate.missingContextCount,
  };
}

function countSelectedTags(selectedTags: RequestBody['selectedTags']): number {
  return Object.values(selectedTags || {}).reduce(
    (sum, tags) => sum + (Array.isArray(tags) ? tags.length : 0),
    0,
  );
}

function isRealFallbackReason(message: string | null): boolean {
  if (!message) return false;
  if (message.includes('初回表示モード')) return false;
  return true;
}

function applySafetyGateToAssessment(
  assessment: ParsedAssessment,
  safetyGate: KnowledgeSafetyGate,
): ParsedAssessment {
  if (safetyGate.mode === 'normal') {
    return assessment;
  }

  const isStrict = safetyGate.mode === 'strict';
  const cappedAccommodations = assessment.accommodations.slice(0, isStrict ? 4 : 6).map((item) => ({
    ...item,
    reason: isStrict ? `条件付き提案: ${item.reason}` : item.reason,
  }));
  const safetyCitationIds =
    safetyGate.sampleClaimIds.length > 0 ? safetyGate.sampleClaimIds : ['safety_gate'];

  return {
    ...assessment,
    summary: `${isStrict ? '【安全ゲート strict】' : '【安全ゲート caution】'}${assessment.summary}`,
    accommodations: cappedAccommodations,
    agreement: isStrict
      ? 'まず追加ヒアリング（法域、業務条件、既存配慮の効果）を実施し、条件が揃った配慮案のみ短期試行する。'
      : `前提条件を確認した上で段階導入する。${assessment.agreement}`,
    kpi: isStrict
      ? '追加情報収集完了率、試行配慮の実施率、疲労自己評価、業務完了率を週次で確認。'
      : `前提条件の確認率を追加し、${assessment.kpi}`,
    citations: [
      ...assessment.citations,
      {
        claim: `Safety gate ${safetyGate.mode}: ${safetyGate.summary}`,
        evidence_ids: safetyCitationIds,
      },
    ],
  };
}

function normalizeRequestBody(body?: Partial<RequestBody> | null): RequestBody {
  return {
    consultation: body?.consultation || '',
    selectedTags: body?.selectedTags || {
      situation: [],
      task: [],
      symptom: [],
      environment: [],
      preference: [],
    },
    followUpAnswers: body?.followUpAnswers || [],
    additionalConsultation: body?.additionalConsultation || '',
    selectedAccommodations: body?.selectedAccommodations || {},
    enabledSourceIds: body?.enabledSourceIds || [],
    responseMode: body?.responseMode || 'full',
  };
}

function buildFallbackAssessment(
  body: RequestBody,
  glmResult: GlmInsightResult,
  suggestionLibrary: Suggestion[],
): ParsedAssessment {
  const selectedTags = Object.values(body.selectedTags || {}).flat();
  const pickedByTag = suggestionLibrary.filter((item) =>
    item.relatedTags.some((tag) => selectedTags.includes(tag)),
  );
  const pickedByGlm = suggestionLibrary.filter((item) =>
    glmResult.recommendedActions.includes(item.title),
  );
  const accommodations = Array.from(
    new Map(
      [...pickedByGlm, ...pickedByTag, ...suggestionLibrary.slice(0, 3)].map((item) => [
        item.title,
        item,
      ]),
    ).values(),
  )
    .slice(0, 8)
    .map((item) => ({
      title: item.title,
      reason: item.reason,
      examples: item.examples,
      priority: item.priority,
    }));

  const aggravators = glmResult.topInsights
    .filter((item) => item.effect < 0)
    .slice(0, 3)
    .map((item) => item.summary);

  const protectors = glmResult.topInsights
    .filter((item) => item.effect > 0)
    .slice(0, 2)
    .map((item) => item.summary);

  return {
    summary: '入力された相談内容をもとに、症状・業務・環境要因を統合して配慮案を生成しました。',
    task_conditions:
      selectedTags.length > 0 ? selectedTags.join('、') : '相談文および追加回答を基に整理。',
    cause:
      body.followUpAnswers
        .map((item) => item.value.trim())
        .filter(Boolean)
        .slice(0, 3) || [],
    impact: ['業務遂行の安定性低下', '疲労蓄積による作業品質・継続性の低下'],
    aggravators: aggravators.length > 0 ? aggravators : ['業務設計と体調管理のミスマッチ'],
    protectors:
      protectors.length > 0 ? protectors : ['業務調整、休憩導線、情報共有の設計で改善余地がある'],
    accommodations,
    agreement: '配慮案を2〜4週間の試行運用とし、本人・上長・人事で週次レビューを実施。',
    kpi: '欠勤/早退、自己評価疲労、業務完了率、通院継続率を週次で確認。',
    causal_summary:
      '症状と業務条件の不一致が就労困難を増幅しやすいため、業務調整・休憩導線・共有方法の同時実装が有効です。',
    causal_chain: [
      '症状変動・疲労',
      '特定タスク/環境で負荷増大',
      '業務遂行の不安定化',
      '配慮実装で安定性を回復',
    ],
    citations: glmResult.topInsights.map((item) => ({
      claim: item.summary,
      evidence_ids: [item.evidenceId],
    })),
  };
}

async function requestOpenAiAssessment(
  body: RequestBody,
  plannerContext: Record<string, unknown>,
  suggestionLibrary: Suggestion[],
  timeoutMs: number,
): Promise<ParsedAssessment> {
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(body, plannerContext, suggestionLibrary) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'jac_assessment',
          strict: true,
          schema: buildSchema(),
        },
      },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || 'OpenAI API error');
  }
  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI 応答が空です。');
  }
  return JSON.parse(content) as ParsedAssessment;
}

function buildFreeTextEvidenceSummary(
  evidence: Array<{ filePath: string; excerpt: string; sourceId: string; score: number }>,
) {
  const freeTextHits = evidence.filter(
    (item) => item.filePath.includes('/raw_data/') && item.filePath.endsWith('.txt'),
  );
  return {
    hitCount: freeTextHits.length,
    samples: freeTextHits.slice(0, 3).map((item) => ({
      sourceId: item.sourceId,
      filePath: item.filePath,
      excerpt: item.excerpt,
      score: item.score,
    })),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const guard = await guardJacApiRequest(req, { route: 'jac-assess', costly: true });
  if (!guard.ok) {
    return res.status(guard.status).json({ error: guard.error });
  }
  try {
    const body = normalizeRequestBody(req.body as RequestBody);
    const responseMode = guard.forceFast ? 'fast' : body.responseMode || 'full';
    const isFastMode = responseMode === 'fast';
    const openAiTimeoutMs = Number(
      process.env.OPENAI_CHAT_TIMEOUT_MS || OPENAI_CHAT_TIMEOUT_MS_DEFAULT,
    );
    if (!body?.consultation) {
      return res.status(400).json({ error: 'consultation が必要です。' });
    }

    const composedQuery = buildComposedQuery(body);
    const glmResult = buildGlmInsights({
      consultation: body.consultation,
      additionalConsultation: body.additionalConsultation,
      selectedTags: body.selectedTags,
      followUpAnswers: body.followUpAnswers,
    });
    const data2Bundle = await getData2KnowledgeBundle(composedQuery, body.selectedTags, {
      maxInsights: 6,
      maxSuggestions: 10,
    }).catch(() => ({ suggestions: [], promptInsights: [] }));
    const supportCatalogBundle = await getSupportCatalogBundle(composedQuery, body.selectedTags, {
      maxIssues: 3,
      maxSuggestions: 8,
      maxQuestions: 4,
    }).catch(() => ({ suggestions: [], promptIssues: [], followupHints: [] }));
    const suggestionLibrary = dedupeSuggestionLibrary([
      ...mapData2Suggestions(data2Bundle.suggestions),
      ...mapSupportCatalogSuggestions(supportCatalogBundle.suggestions),
      ...SUGGESTION_LIBRARY,
    ]);
    const supportCatalogPreview = buildSupportCatalogPreview(supportCatalogBundle.promptIssues);
    const data2Preview = data2Bundle.promptInsights.slice(0, 3).map((insight) => ({
      id: insight.id,
      disability: insight.disability,
      issues: insight.matchedIssues.map((item) => item.issue).slice(0, 2),
    }));

    const plan = buildAgenticPlan({
      query: composedQuery,
      enabledSourceIds: body.enabledSourceIds,
    });

    const safeExecution = await withTimeout(
      executeAgenticPlan(plan, {
        query: composedQuery,
        keywords: [
          body.consultation,
          body.additionalConsultation || '',
          ...Object.values(body.selectedTags || {}).flat(),
          ...(body.followUpAnswers || []).map((item) => item.value),
        ],
      }),
      EXECUTION_TIMEOUT_MS,
      'Agentic execution timeout',
    ).catch(() => ({
      stepProgress: [],
      evidence: [],
      step4Evidence: [],
      step4ClaimIds: [],
      structuredSummary: [
        'Execution fallback: structured summary unavailable due to timeout/error.',
      ],
      policyNotes: [],
      safetyGate: buildDefaultSafetyGate(
        '安全ゲート: 実行フォールバックのため追加確認を優先します。',
      ),
    }));
    const evidenceContext = {
      consultationText: body.consultation,
      selectedTags: Object.values(body.selectedTags || {}).flat(),
      followUpAnswers: (body.followUpAnswers || []).map(
        (item) => `${item.label} ${item.value}`.trim(),
      ),
      selectedAccommodationTitles: Object.entries(body.selectedAccommodations || {})
        .filter(([, selection]) => selection?.selected !== false)
        .map(([title]) => title),
    };
    const practicalContext = {
      consultationText: body.consultation,
      additionalConsultation: body.additionalConsultation || '',
      selectedTags: Object.values(body.selectedTags || {}).flat(),
      followUpAnswers: (body.followUpAnswers || []).map(
        (item) => `${item.label} ${item.value}`.trim(),
      ),
      selectedAccommodationTitles: evidenceContext.selectedAccommodationTitles,
    };
    const practicalReferencePreview = await buildPracticalReferencePreview(
      safeExecution.step4Evidence,
      6,
      practicalContext,
    ).catch(() => []);

    const plannerContext = {
      selected_sources: plan.selectedSources,
      plan_warnings: plan.warnings,
      execution_progress: safeExecution.stepProgress,
      evidence: safeExecution.evidence,
      structured_summary: safeExecution.structuredSummary,
      policy_notes: safeExecution.policyNotes,
      safety_gate: safeExecution.safetyGate,
      glm_context: {
        interaction_meanings: GLM_INTERACTION_MEANINGS,
        top_insights: glmResult.topInsights.map((item) => ({
          evidence_id: item.evidenceId,
          summary: item.summary,
          predictor: item.predictor,
          outcome: item.outcome,
          effect_b: item.effect,
          p_value: item.pValue,
          confidence: item.confidence,
          matched_keywords: item.matchedKeywords,
          action_titles: item.actionTitles,
        })),
        recommended_actions: glmResult.recommendedActions,
      },
      support_catalog_context: {
        positioning_summary: REGIONAL_SUPPORT_POSITIONING_DETAIL,
        reasoning_rules: REGIONAL_SUPPORT_PROMPT_RULES,
        prompt_issues: supportCatalogBundle.promptIssues,
        followup_hints: supportCatalogBundle.followupHints,
      },
      practical_reference_context: practicalReferencePreview,
      data2_context: data2Bundle.promptInsights,
    };

    let assessment: ParsedAssessment;
    let fallbackReason: string | null = null;
    let refinementJobId: string | null = null;
    let step4EvidencePack = null;
    const freeTextEvidence = buildFreeTextEvidenceSummary(safeExecution.evidence);
    const planWarnings = [...plan.warnings];
    if (safeExecution.evidence.length === 0) {
      planWarnings.push(
        'Evidence hit count is 0. Try adding concrete scenes (meeting/load/time/environment) or selecting more tags.',
      );
    }
    if (supportCatalogBundle.promptIssues.length > 0) {
      planWarnings.push(
        '地域支援カタログを、本人と職場の個別調整を支える支援連携の文脈として参照しました。',
      );
    }
    if (practicalReferencePreview.length > 0) {
      planWarnings.push(
        STEP4_REFERENCE_SOURCE_NOTE,
      );
    }
    if (safeExecution.safetyGate.mode !== 'normal') {
      planWarnings.push(safeExecution.safetyGate.summary);
    }

    if (isFastMode) {
      assessment = await attachCitationMetadata(
        applySafetyGateToAssessment(
          mergeAssessmentWithGlm(
            buildFallbackAssessment(body, glmResult, suggestionLibrary),
            glmResult.topInsights,
          ),
          safeExecution.safetyGate,
        ),
      );
      fallbackReason =
        '初回表示モード: ローカル推論を即時返却しました。精密見立てはバックグラウンド更新されます。';
      if (process.env.OPENAI_API_KEY) {
        refinementJobId = createRefinementJob(async () => {
          const fullAssessmentRaw = await requestOpenAiAssessment(
            body,
            plannerContext,
            suggestionLibrary,
            openAiTimeoutMs,
          );
          const fullAssessment = await attachCitationMetadata(
            applySafetyGateToAssessment(fullAssessmentRaw, safeExecution.safetyGate),
          );
          const fullStep4EvidencePack = await buildStep4EvidencePack({
            assessment: fullAssessment,
            claimIds: safeExecution.step4ClaimIds,
            evidence: safeExecution.step4Evidence,
            supportCatalogItems: supportCatalogPreview,
            evidenceContext,
            practicalContext,
            practicalMaxItems: 6,
          }).catch(() => null);
          const refinementProcess = {
            selectedSources: plan.selectedSources.map((source) => ({
              id: source.id,
              name: source.name,
              kind: source.kind,
              enabled: source.enabled,
            })),
            stepProgress: safeExecution.stepProgress,
            planWarnings,
            evidenceCount: safeExecution.evidence.length,
            evidencePreview: safeExecution.evidence.slice(0, 6),
            glmInsights: glmResult.topInsights,
            glmInteractionMeanings: GLM_INTERACTION_MEANINGS,
            freeTextEvidence,
            responseMode: 'full',
            pendingRefinement: false,
            refinementJobId: null,
            data2InsightCount: data2Bundle.promptInsights.length,
            data2Preview,
            supportCatalogPreview,
            practicalReferencePreview,
            step4EvidencePack: fullStep4EvidencePack,
            safetyGate: safeExecution.safetyGate,
            sourceNotes: buildProcessSourceNotes(
              plan.selectedSources,
              supportCatalogPreview.length > 0,
              practicalReferencePreview.length > 0,
            ),
            fallbackReason: null,
          };
          return {
            assessment: fullAssessment,
            process: refinementProcess,
          };
        });
      }
    } else if (!process.env.OPENAI_API_KEY) {
      assessment = await attachCitationMetadata(
        applySafetyGateToAssessment(
          buildFallbackAssessment(body, glmResult, suggestionLibrary),
          safeExecution.safetyGate,
        ),
      );
      fallbackReason = 'OPENAI_API_KEY が未設定のため、ローカル推論にフォールバックしました。';
    } else {
      try {
        const fullAssessmentRaw = await requestOpenAiAssessment(
          body,
          plannerContext,
          suggestionLibrary,
          openAiTimeoutMs,
        );
        assessment = await attachCitationMetadata(
          applySafetyGateToAssessment(fullAssessmentRaw, safeExecution.safetyGate),
        );
      } catch (error) {
        const rawMessage =
          error instanceof Error ? error.message : 'OpenAI 呼び出しに失敗しました。';
        fallbackReason =
          rawMessage.includes('aborted') || rawMessage.toLowerCase().includes('timeout')
            ? '精密見立ては時間上限を超えたため、初回結果を継続表示しています。'
            : rawMessage;
        assessment = await attachCitationMetadata(
          applySafetyGateToAssessment(
            buildFallbackAssessment(body, glmResult, suggestionLibrary),
            safeExecution.safetyGate,
          ),
        );
      }
    }
    step4EvidencePack = await buildStep4EvidencePack({
      assessment,
      claimIds: safeExecution.step4ClaimIds,
      evidence: safeExecution.step4Evidence,
      supportCatalogItems: supportCatalogPreview,
      evidenceContext,
      practicalContext,
      practicalMaxItems: 6,
    }).catch(() => null);

    const responseProcess = {
      selectedSources: plan.selectedSources.map((source) => ({
        id: source.id,
        name: source.name,
        kind: source.kind,
        enabled: source.enabled,
      })),
      stepProgress: safeExecution.stepProgress,
      planWarnings,
      evidenceCount: safeExecution.evidence.length,
      evidencePreview: safeExecution.evidence.slice(0, 6),
      glmInsights: glmResult.topInsights,
      glmInteractionMeanings: GLM_INTERACTION_MEANINGS,
      freeTextEvidence,
      safetyGate: safeExecution.safetyGate,
      responseMode,
      pendingRefinement: isFastMode,
      refinementJobId,
      data2InsightCount: data2Bundle.promptInsights.length,
      data2Preview,
      supportCatalogPreview,
      practicalReferencePreview,
      step4EvidencePack,
      sourceNotes: buildProcessSourceNotes(
        plan.selectedSources,
        supportCatalogPreview.length > 0,
        practicalReferencePreview.length > 0,
      ),
      fallbackReason,
    };

    await recordJacSafetyAudit({
      req,
      route: 'jac-assess',
      outcome: isRealFallbackReason(fallbackReason) ? 'fallback' : 'success',
      responseMode,
      safetyGate: toSafetyAuditSnapshot(safeExecution.safetyGate),
      selectedSourceCount: responseProcess.selectedSources.length,
      evidenceCount: responseProcess.evidenceCount,
      warningCount: responseProcess.planWarnings.length,
      fallbackReason,
      consultationLength: body.consultation.length,
      additionalConsultationLength: (body.additionalConsultation || '').length,
      selectedTagCount: countSelectedTags(body.selectedTags),
      followUpAnswerCount: body.followUpAnswers.length,
    });

    return res.status(200).json({
      assessment,
      process: responseProcess,
    });
  } catch (error) {
    const body = normalizeRequestBody((req.body || {}) as Partial<RequestBody>);
    if (!body.consultation) {
      return res.status(400).json({ error: 'consultation が必要です。' });
    }
    const glmResult = buildGlmInsights({
      consultation: body.consultation,
      additionalConsultation: body.additionalConsultation,
      selectedTags: body.selectedTags,
      followUpAnswers: body.followUpAnswers,
    });
    const data2Bundle = await getData2KnowledgeBundle(
      buildComposedQuery(body),
      body.selectedTags,
    ).catch(() => ({ suggestions: [], promptInsights: [] }));
    const supportCatalogBundle = await getSupportCatalogBundle(
      buildComposedQuery(body),
      body.selectedTags,
      { maxIssues: 3, maxSuggestions: 8, maxQuestions: 4 },
    ).catch(() => ({ suggestions: [], promptIssues: [], followupHints: [] }));
    const suggestionLibrary = dedupeSuggestionLibrary([
      ...mapData2Suggestions(data2Bundle.suggestions),
      ...mapSupportCatalogSuggestions(supportCatalogBundle.suggestions),
      ...SUGGESTION_LIBRARY,
    ]);
    const supportCatalogPreview = buildSupportCatalogPreview(supportCatalogBundle.promptIssues);
    const practicalReferencePreview: PracticalReferencePreviewItem[] = [];
    const data2Preview = data2Bundle.promptInsights.slice(0, 3).map((insight) => ({
      id: insight.id,
      disability: insight.disability,
      issues: insight.matchedIssues.map((item) => item.issue).slice(0, 2),
    }));
    const safetyGate = buildDefaultSafetyGate('安全ゲート: 内部例外のため追加確認を優先します。');
    const assessment = await attachCitationMetadata(
      applySafetyGateToAssessment(
        mergeAssessmentWithGlm(
          buildFallbackAssessment(body, glmResult, suggestionLibrary),
          glmResult.topInsights,
        ),
        safetyGate,
      ),
    );
    const fallbackEvidenceContext = {
      consultationText: body.consultation,
      selectedTags: Object.values(body.selectedTags || {}).flat(),
      followUpAnswers: (body.followUpAnswers || []).map(
        (item) => `${item.label} ${item.value}`.trim(),
      ),
      selectedAccommodationTitles: Object.keys(body.selectedAccommodations || {}),
    };
    const fallbackPracticalContext = {
      consultationText: body.consultation,
      additionalConsultation: body.additionalConsultation || '',
      selectedTags: Object.values(body.selectedTags || {}).flat(),
      followUpAnswers: (body.followUpAnswers || []).map(
        (item) => `${item.label} ${item.value}`.trim(),
      ),
      selectedAccommodationTitles: Object.keys(body.selectedAccommodations || {}),
    };
    const step4EvidencePack = await buildStep4EvidencePack({
      assessment,
      claimIds: [],
      evidence: [],
      supportCatalogItems: supportCatalogPreview,
      evidenceContext: fallbackEvidenceContext,
      practicalContext: fallbackPracticalContext,
      practicalMaxItems: 6,
    }).catch(() => null);
    const errorMessage = error instanceof Error ? error.message : 'unexpected error';
    await recordJacSafetyAudit({
      req,
      route: 'jac-assess',
      outcome: 'error',
      responseMode: body.responseMode || 'unknown',
      safetyGate: toSafetyAuditSnapshot(safetyGate),
      selectedSourceCount: 0,
      evidenceCount: 0,
      warningCount: 1,
      fallbackReason: `内部例外: ${errorMessage}`,
      consultationLength: body.consultation.length,
      additionalConsultationLength: (body.additionalConsultation || '').length,
      selectedTagCount: countSelectedTags(body.selectedTags),
      followUpAnswerCount: body.followUpAnswers.length,
    });
    return res.status(200).json({
      assessment,
      process: {
        selectedSources: [],
        stepProgress: [],
        planWarnings: ['Internal error fallback was used.'],
        evidenceCount: 0,
        evidencePreview: [],
        glmInsights: glmResult.topInsights,
        glmInteractionMeanings: GLM_INTERACTION_MEANINGS,
        freeTextEvidence: { hitCount: 0, samples: [] },
        safetyGate,
        responseMode: body.responseMode || 'fast',
        pendingRefinement: false,
        refinementJobId: null,
        data2InsightCount: data2Bundle.promptInsights.length,
        data2Preview,
        supportCatalogPreview,
        practicalReferencePreview,
        step4EvidencePack,
        sourceNotes: buildProcessSourceNotes([], supportCatalogPreview.length > 0, false),
        fallbackReason: `内部例外のため安全フォールバックを返却しました: ${errorMessage}`,
      },
    });
  }
}
