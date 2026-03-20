import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useMemo, useState } from 'react';
import { GLM_EVIDENCE, GLM_INTERACTION_MEANINGS } from '@/lib/knowledge/glmInsights';
import {
  causalTierPriority,
  evaluateCausalTier,
  type CausalBasis,
  type CausalTier,
} from '@/lib/jac/causalTier';
import { expectedTierForCard, tierPolicyRationaleForCard } from '@/lib/jac/cardTierPolicy';

type ManifestSnapshot = {
  generatedAt: string;
  claimCount: number;
  inputRecordCount: number;
  bySourceId: Record<string, number>;
  byCountry: Record<string, number>;
  byRiskLevel: Record<string, number>;
  byEvidenceScope: Record<string, number>;
};

type GuideProps = {
  manifest: ManifestSnapshot | null;
  coverageAudit: CoverageAuditSnapshot | null;
  data2Stats: Data2Stats | null;
  cardStrategicInsights: Record<string, GuideCardStrategicInsight>;
  patternCoverage: PatternCoverageSnapshot | null;
  claimsGlmCoverage: ClaimsGlmCoverageSnapshot | null;
  commonWorkCopy: Record<string, GuideCommonWorkDesignCopyRow>;
  layerDisposition: Record<string, GuideLayerDispositionRow>;
};

type Data2Stats = {
  entryCount: number;
  disabilityCount: number;
  issueCount: number;
  supportCount: number;
  narrativeCount: number;
  generatedAt: string | null;
};

type CardStrategicInsight = {
  cardId: string;
  observation: string;
  inference: string;
  move: string;
  expectedCausalTier: CausalTier;
  expectedTierMet: boolean;
  causalTier: CausalTier;
  causalBasis: CausalBasis;
  causalLabel: string;
  causalSummary: string;
  causalGuardrail: string;
  causalTriangulationScore: number;
  tierPolicyRationale: string;
  data2Hits: number;
  claimHits: number;
  countries: string[];
  evidenceLanes: string[];
  claimIds: string[];
  glmIds: string[];
  glmHighlights: Array<{ id: string; summary: string }>;
  claimHighlights: string[];
  data2NarrativeHits: number;
  data2NarrativeHighlights: string[];
  syntheticVoices: string[];
  evidenceTraceCounts: {
    glmAnchors: number;
    glmMatched: number;
    data2PairHits: number;
    data2NarrativeHits: number;
    claimsMatched: number;
    claimsEvidence: number;
  };
};

type GuideCardStrategicInsight = Pick<
  CardStrategicInsight,
  | 'observation'
  | 'inference'
  | 'move'
  | 'expectedCausalTier'
  | 'expectedTierMet'
  | 'causalTier'
  | 'causalBasis'
  | 'causalLabel'
  | 'causalSummary'
  | 'causalGuardrail'
  | 'causalTriangulationScore'
  | 'tierPolicyRationale'
  | 'data2Hits'
  | 'claimHits'
  | 'countries'
  | 'evidenceLanes'
  | 'claimIds'
  | 'glmIds'
  | 'glmHighlights'
  | 'claimHighlights'
  | 'data2NarrativeHighlights'
  | 'syntheticVoices'
  | 'evidenceTraceCounts'
>;

type PatternCoverageSnapshot = {
  totalIssueRows: number;
  coveredIssueRows: number;
  coverageRate: number;
  topUncoveredIssues: Array<{ issue: string; count: number }>;
};

type ClaimCoverageBySource = {
  sourceId: string;
  totalClaims: number;
  eligibleClaims: number;
  coveredClaims: number;
  coverageRate: number;
};

type ClaimCoverageByLane = {
  lane: string;
  eligibleClaims: number;
  coveredClaims: number;
  coverageRate: number;
};

type ClaimsGlmCoverageSnapshot = {
  claimsAll: number;
  claimsEligible: number;
  claimsCovered: number;
  claimsCoverageRate: number;
  claimsCoverageBySourceTop: ClaimCoverageBySource[];
  claimsCoverageByLane: ClaimCoverageByLane[];
  directEvidenceTotal: number;
  directEvidenceCovered: number;
  directEvidenceCoverageRate: number;
  glmWorkbookSignificantRelations: number;
  glmWorkbookPredictors: number;
  glmFullCoveredRelations: number;
  glmFullTotalRelations: number;
  glmFullCoverageRate: number;
  glmFullLexicalCoveredRelations: number;
  glmFullBucketBridgedRelations: number;
  glmLegacyCovered: number;
  glmLegacyTotal: number;
  glmLegacyCoverageRate: number;
};

type DisabilityFacetKey =
  | 'visual'
  | 'hearing'
  | 'physical'
  | 'internal'
  | 'intellectual'
  | 'mental'
  | 'developmental'
  | 'higher_brain';

type FocusKey =
  | 'all'
  | 'meeting'
  | 'fatigue'
  | 'medical'
  | 'environment'
  | 'commute'
  | 'disclosure'
  | 'manager'
  | 'return'
  | 'customer'
  | 'career'
  | 'jobsearch'
  | 'application';

type ContextCheckKey =
  | 'person'
  | 'job'
  | 'environment'
  | 'support'
  | 'time'
  | 'institution'
  | 'evidence';

type CardLayerKey = 'health' | 'transition' | 'operation';

type AccommodationPackage = {
  id: string;
  name: string;
  goal: string;
  components: string[];
  operationRules: string[];
  kpi: string[];
  recheckTrigger: string;
};

type SituationSeverityTone = 'critical' | 'high' | 'moderate' | 'stable';

type SituationSeverityLevel = {
  icon: string;
  label: string;
  description: string;
  tone: SituationSeverityTone;
};

type PatternCard = {
  id: string;
  focus: FocusKey[];
  title: string;
  mode: 'standard' | 'conditional_only' | 'questions_first';
  situation: string;
  selectionBoundary?: string;
  quickBundle: string[];
  packages: AccommodationPackage[];
  lensLogic: {
    occurrence: string;
    resolution: string;
    symptomWork: string;
    supportFormation: string;
  };
  preconditions: string[];
  failureRisks: string[];
  followUpQuestions: string[];
  jurisdictionNotes: string[];
  evidenceTrace: {
    glm: string[];
    claimIds: string[];
    sourceRegions: string[];
  };
};

type CoverageAuditSnapshot = {
  totalClaims: number;
  noisyClaimCount: number;
  noisyClaimRatio: number;
  disabilityFacetCounts: Record<string, number>;
  evidenceLaneCounts: Record<string, number>;
  topNoisySources: Array<{ sourceId: string; count: number; ratio: number }>;
  missingDataFacets: DisabilityFacetKey[];
  missingPatternFacets: DisabilityFacetKey[];
};

type CommonWorkDesignCopyRow = {
  id: string;
  title?: string;
  situation?: string;
  selectionBoundary?: string;
  legalPolicyGuardrail?: {
    grounding?: {
      observation?: string;
      evidenceCue?: string;
    };
    summary?: string;
    checks?: string[];
    escalation?: string;
    category?: string;
    source?: string;
  };
  regionalSupportOverlay?: {
    grounding?: {
      observation?: string;
      evidenceCue?: string;
    };
    summary?: string;
    jacRole?: string[];
    regionalRole?: string[];
    returnPath?: string;
  };
  quickBundle?:
    | string[]
    | {
        standardized?: string[];
        individualized?: string[];
        principle?: string;
      };
  quickBundleFlat?: string[];
  disabilityEmploymentConnection?: {
    note?: string;
    examples?: string[];
  };
  situationLevels?: SituationSeverityLevel[];
};

type GuideCommonWorkDesignCopyRow = {
  title?: string;
  situation?: string;
  selectionBoundary?: string;
  legalPolicyGuardrail?: {
    grounding?: {
      observation?: string;
      evidenceCue?: string;
    };
    summary?: string;
    checks?: string[];
    escalation?: string;
  };
  regionalSupportOverlay?: {
    grounding?: {
      observation?: string;
      evidenceCue?: string;
    };
    summary?: string;
    jacRole?: string[];
    regionalRole?: string[];
    returnPath?: string;
  };
  quickBundle?:
    | string[]
    | {
        standardized?: string[];
        individualized?: string[];
      };
  disabilityEmploymentConnection?: {
    examples?: string[];
  };
  situationLevels?: SituationSeverityLevel[];
};

type LayerDispositionValue = 'keep_in_card' | 'move_to_shared_layer' | 'move_to_separate_guide';

type LayerDispositionDetail = {
  disposition?: LayerDispositionValue;
  keepInCard?: string[];
  detailTarget?: string;
};

type LayerDispositionRow = {
  cardId: string;
  legalPolicy?: LayerDispositionDetail;
  regionalSupport?: LayerDispositionDetail;
  rationale?: string;
  nextArtifact?: string[];
};

type GuideLayerDispositionRow = {
  legalPolicy?: LayerDispositionDetail;
  regionalSupport?: LayerDispositionDetail;
};

const LAYER_DISPOSITION_LABEL: Record<LayerDispositionValue, string> = {
  keep_in_card: 'カード内に残す',
  move_to_shared_layer: '共通レイヤーで確認',
  move_to_separate_guide: '別ガイドで確認',
};

function filterNonEmptyList(items: unknown): string[] {
  return Array.isArray(items) ? items.map((item) => String(item || '').trim()).filter(Boolean) : [];
}

function getLayerDisposition(detail: LayerDispositionDetail | undefined): LayerDispositionValue {
  const value = String(detail?.disposition || '').trim();
  if (
    value === 'move_to_shared_layer' ||
    value === 'move_to_separate_guide' ||
    value === 'keep_in_card'
  ) {
    return value;
  }
  return 'keep_in_card';
}

function truncateText(value: unknown, maxLength: number): string {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function limitTextList(items: unknown, maxItems: number, maxLength = 120): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => truncateText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function trimSituationLevels(levels: unknown): SituationSeverityLevel[] {
  if (!Array.isArray(levels)) return [];
  return levels
    .map((item) => {
      const icon = String(item?.icon || '').trim();
      const label = String(item?.label || '').trim();
      const description = truncateText(item?.description, 90);
      const tone = item?.tone;
      if (
        !icon ||
        !label ||
        !description ||
        (tone !== 'critical' && tone !== 'high' && tone !== 'moderate' && tone !== 'stable')
      ) {
        return null;
      }
      return { icon, label, description, tone } satisfies SituationSeverityLevel;
    })
    .filter((item): item is SituationSeverityLevel => Boolean(item))
    .slice(0, 4);
}

function toGuideCardStrategicInsight(
  insight: CardStrategicInsight,
): GuideCardStrategicInsight {
  return {
    observation: truncateText(insight.observation, 160),
    inference: truncateText(insight.inference, 160),
    move: truncateText(insight.move, 160),
    expectedCausalTier: insight.expectedCausalTier,
    expectedTierMet: insight.expectedTierMet,
    causalTier: insight.causalTier,
    causalBasis: insight.causalBasis,
    causalLabel: insight.causalLabel,
    causalSummary: truncateText(insight.causalSummary, 140),
    causalGuardrail: truncateText(insight.causalGuardrail, 140),
    causalTriangulationScore: insight.causalTriangulationScore,
    tierPolicyRationale: truncateText(insight.tierPolicyRationale, 140),
    data2Hits: insight.data2Hits,
    claimHits: insight.claimHits,
    countries: limitTextList(insight.countries, 3, 40),
    evidenceLanes: limitTextList(insight.evidenceLanes, 3, 40),
    claimIds: limitTextList(insight.claimIds, 4, 32),
    glmIds: limitTextList(insight.glmIds, 3, 48),
    glmHighlights: Array.isArray(insight.glmHighlights)
      ? insight.glmHighlights
          .map((item) => ({
            id: truncateText(item?.id, 40),
            summary: truncateText(item?.summary, 100),
          }))
          .filter((item) => item.id && item.summary)
          .slice(0, 2)
      : [],
    claimHighlights: limitTextList(insight.claimHighlights, 2, 100),
    data2NarrativeHighlights: limitTextList(insight.data2NarrativeHighlights, 2, 100),
    syntheticVoices: limitTextList(insight.syntheticVoices, 2, 100),
    evidenceTraceCounts: insight.evidenceTraceCounts,
  };
}

function toGuideCommonWorkDesignCopyRow(
  row: CommonWorkDesignCopyRow,
): GuideCommonWorkDesignCopyRow {
  const quickBundle =
    Array.isArray(row.quickBundle)
      ? limitTextList(row.quickBundle, 3, 60)
      : {
          standardized: limitTextList(row.quickBundle?.standardized, 3, 60),
          individualized: limitTextList(row.quickBundle?.individualized, 2, 60),
        };

  const situationLevels = trimSituationLevels(row.situationLevels);
  const defaultSituationLevels = trimSituationLevels(CARD_SITUATION_LEVELS[row.id] || []);
  const shouldKeepSituationLevels =
    situationLevels.length > 0 &&
    JSON.stringify(situationLevels) !== JSON.stringify(defaultSituationLevels);

  const legalGroundingObservation = truncateText(
    row.legalPolicyGuardrail?.grounding?.observation,
    110,
  );
  const legalGroundingCue = truncateText(row.legalPolicyGuardrail?.grounding?.evidenceCue, 90);
  const legalSummary = truncateText(row.legalPolicyGuardrail?.summary, 120);
  const legalChecks = limitTextList(row.legalPolicyGuardrail?.checks, 3, 60);
  const legalEscalation = truncateText(row.legalPolicyGuardrail?.escalation, 100);

  const regionalGroundingObservation = truncateText(
    row.regionalSupportOverlay?.grounding?.observation,
    110,
  );
  const regionalGroundingCue = truncateText(
    row.regionalSupportOverlay?.grounding?.evidenceCue,
    90,
  );
  const regionalSummary = truncateText(row.regionalSupportOverlay?.summary, 120);
  const regionalJacRole = limitTextList(row.regionalSupportOverlay?.jacRole, 2, 70);
  const regionalRole = limitTextList(row.regionalSupportOverlay?.regionalRole, 2, 70);
  const regionalReturnPath = truncateText(row.regionalSupportOverlay?.returnPath, 100);

  const examples = limitTextList(row.disabilityEmploymentConnection?.examples, 2, 70);

  const result: GuideCommonWorkDesignCopyRow = {};

  const title = truncateText(row.title, 80);
  if (title) result.title = title;
  const situation = truncateText(row.situation, 140);
  if (situation) result.situation = situation;
  const selectionBoundary = truncateText(row.selectionBoundary, 120);
  if (selectionBoundary) result.selectionBoundary = selectionBoundary;

  if (legalGroundingObservation || legalGroundingCue || legalSummary || legalChecks.length > 0 || legalEscalation) {
    result.legalPolicyGuardrail = {
      grounding:
        legalGroundingObservation || legalGroundingCue
          ? {
              observation: legalGroundingObservation || undefined,
              evidenceCue: legalGroundingCue || undefined,
            }
          : undefined,
      summary: legalSummary || undefined,
      checks: legalChecks.length > 0 ? legalChecks : undefined,
      escalation: legalEscalation || undefined,
    };
  }

  if (
    regionalGroundingObservation ||
    regionalGroundingCue ||
    regionalSummary ||
    regionalJacRole.length > 0 ||
    regionalRole.length > 0 ||
    regionalReturnPath
  ) {
    result.regionalSupportOverlay = {
      grounding:
        regionalGroundingObservation || regionalGroundingCue
          ? {
              observation: regionalGroundingObservation || undefined,
              evidenceCue: regionalGroundingCue || undefined,
            }
          : undefined,
      summary: regionalSummary || undefined,
      jacRole: regionalJacRole.length > 0 ? regionalJacRole : undefined,
      regionalRole: regionalRole.length > 0 ? regionalRole : undefined,
      returnPath: regionalReturnPath || undefined,
    };
  }

  if (Array.isArray(quickBundle)) {
    if (quickBundle.length > 0) result.quickBundle = quickBundle;
  } else if (quickBundle.standardized.length > 0 || quickBundle.individualized.length > 0) {
    result.quickBundle = {
      standardized: quickBundle.standardized.length > 0 ? quickBundle.standardized : undefined,
      individualized: quickBundle.individualized.length > 0 ? quickBundle.individualized : undefined,
    };
  }

  if (examples.length > 0) {
    result.disabilityEmploymentConnection = {
      examples,
    };
  }

  if (shouldKeepSituationLevels) {
    result.situationLevels = situationLevels;
  }

  return result;
}

function toGuideLayerDispositionRow(row: LayerDispositionRow): GuideLayerDispositionRow {
  const result: GuideLayerDispositionRow = {};
  if (row.legalPolicy) {
    const keepInCard = limitTextList(row.legalPolicy.keepInCard, 3, 60);
    const detailTarget = truncateText(row.legalPolicy.detailTarget, 60);
    if (row.legalPolicy.disposition || keepInCard.length > 0 || detailTarget) {
      result.legalPolicy = {
        disposition: row.legalPolicy.disposition,
        keepInCard: keepInCard.length > 0 ? keepInCard : undefined,
        detailTarget: detailTarget || undefined,
      };
    }
  }
  if (row.regionalSupport) {
    const keepInCard = limitTextList(row.regionalSupport.keepInCard, 3, 60);
    const detailTarget = truncateText(row.regionalSupport.detailTarget, 60);
    if (row.regionalSupport.disposition || keepInCard.length > 0 || detailTarget) {
      result.regionalSupport = {
        disposition: row.regionalSupport.disposition,
        keepInCard: keepInCard.length > 0 ? keepInCard : undefined,
        detailTarget: detailTarget || undefined,
      };
    }
  }
  return result;
}

const DISABILITY_FACET_LABEL: Record<DisabilityFacetKey, string> = {
  visual: '視覚障害',
  hearing: '聴覚障害',
  physical: '肢体不自由',
  internal: '内部障害',
  intellectual: '知的障害',
  mental: '精神障害',
  developmental: '発達障害',
  higher_brain: '高次脳機能障害',
};

const PRIORITY_FACETS: DisabilityFacetKey[] = [
  'visual',
  'hearing',
  'physical',
  'internal',
  'intellectual',
  'mental',
  'developmental',
  'higher_brain',
];

const PATTERN_DISABILITY_FACETS: Record<string, DisabilityFacetKey[]> = {
  'p-meeting-overload': ['mental', 'developmental', 'higher_brain'],
  'p-fatigue-pacing': ['internal', 'mental'],
  'p-medical-schedule': ['internal', 'physical'],
  'p-environment-sensory': ['developmental', 'mental', 'visual', 'hearing'],
  'p-commute-hybrid': ['physical', 'internal', 'mental'],
  'p-disclosure-boundary': ['mental', 'developmental', 'internal'],
  'p-return-to-work-ramp': ['mental', 'internal', 'physical'],
  'p-shift-rhythm-guard': ['internal', 'mental'],
  'p-manager-checkin': ['mental', 'developmental', 'intellectual'],
  'p-customer-facing-load': ['mental', 'developmental', 'hearing'],
  'p-visual-document-access': ['visual'],
  'p-hearing-meeting-access': ['hearing'],
  'p-physical-mobility-route': ['physical'],
  'p-safety-critical-operations': [
    'visual',
    'hearing',
    'physical',
    'internal',
    'mental',
    'developmental',
    'higher_brain',
  ],
  'p-internal-treatment-compatibility': ['internal'],
  'p-intellectual-task-clarity': ['intellectual'],
  'p-developmental-switch-load': ['developmental'],
  'p-mental-fluctuation-plan': ['mental'],
  'p-higher-brain-memory-support': ['higher_brain'],
  'p-jobmatch-exploration': ['developmental', 'intellectual', 'mental', 'higher_brain', 'visual'],
  'p-application-contact-flow': ['mental', 'developmental', 'hearing', 'visual'],
  'p-interview-self-advocacy': ['mental', 'developmental', 'intellectual', 'hearing'],
  'p-skill-building-path': ['intellectual', 'developmental', 'higher_brain', 'physical'],
  'p-worktrial-transition': ['physical', 'internal', 'mental', 'developmental'],
  'p-income-condition-stability': ['mental', 'internal', 'physical', 'intellectual'],
  'p-support-service-navigation': [
    'visual',
    'hearing',
    'physical',
    'internal',
    'intellectual',
    'mental',
    'developmental',
    'higher_brain',
  ],
};

const FOCUS_OPTIONS: Array<{ key: FocusKey; label: string }> = [
  { key: 'all', label: '全体' },
  { key: 'meeting', label: '会議負荷' },
  { key: 'fatigue', label: '体調の波' },
  { key: 'medical', label: '通院両立' },
  { key: 'environment', label: '環境' },
  { key: 'commute', label: '通勤/働き方' },
  { key: 'disclosure', label: '開示' },
  { key: 'manager', label: '上司対応' },
  { key: 'return', label: '復職' },
  { key: 'customer', label: '接客/対人' },
  { key: 'career', label: 'キャリア' },
  { key: 'jobsearch', label: '就活' },
  { key: 'application', label: '応募/定着' },
];

const CONTEXT_CHECK_LABEL: Record<ContextCheckKey, string> = {
  person: 'person 本人状態',
  job: 'job 業務要件',
  environment: 'environment 環境条件',
  support: 'support 支援履歴',
  time: 'time 時間変動',
  institution: 'institution 法域/制度',
  evidence: 'evidence 根拠質',
};

const CONTEXT_CHECK_HINT: Record<ContextCheckKey, string> = {
  person: '症状変動・強み・希望',
  job: '必須タスク・納期・誤差許容',
  environment: '音/光/温度・対人密度',
  support: '試した配慮の効果/副作用',
  time: '悪化周期・復帰フェーズ',
  institution: '法域・社内制度・権限',
  evidence: '単一事例か、複数根拠か',
};

const ALL_CONTEXT_KEYS: ContextCheckKey[] = [
  'person',
  'job',
  'environment',
  'support',
  'time',
  'institution',
  'evidence',
];

const MODE_REQUIRED_CONTEXTS: Record<PatternCard['mode'], ContextCheckKey[]> = {
  standard: ['person', 'job', 'environment', 'support', 'evidence'],
  conditional_only: ['person', 'job', 'environment', 'support', 'time', 'evidence'],
  questions_first: ALL_CONTEXT_KEYS,
};

type TagNavigatorItem = {
  id: string;
  label: string;
  focus: FocusKey[];
  facets: DisabilityFacetKey[];
  note: string;
};

const TAG_NAVIGATOR_OPTIONS: TagNavigatorItem[] = [
  {
    id: 'all',
    label: 'まずは全体',
    focus: [
      'meeting',
      'fatigue',
      'medical',
      'environment',
      'commute',
      'disclosure',
      'manager',
      'return',
      'customer',
      'career',
      'jobsearch',
      'application',
    ],
    facets: PRIORITY_FACETS,
    note: 'タグ指定なし。導入版の全パターンを表示します。',
  },
  {
    id: 'meeting_dialogue',
    label: '会議',
    focus: ['meeting', 'manager', 'customer'],
    facets: ['hearing', 'developmental', 'mental'],
    note: '会議理解、発話順、情報保障、対人調整に関わるパターンを優先表示します。',
  },
  {
    id: 'hearing_load',
    label: '聞き取り',
    focus: ['meeting', 'environment'],
    facets: ['hearing'],
    note: '聞き取り困難、電話依存、字幕/議事録導線の設計が必要なカードを優先表示します。',
  },
  {
    id: 'pain_fluctuation',
    label: '痛み/体調波',
    focus: ['fatigue', 'medical', 'commute'],
    facets: ['physical', 'internal'],
    note: '痛みや体調波を前提に、勤務密度と復帰速度を調整するカードを優先表示します。',
  },
  {
    id: 'attention_load',
    label: '集中の波',
    focus: ['meeting', 'fatigue', 'manager'],
    facets: ['developmental', 'higher_brain', 'mental'],
    note: '切替負荷、同時処理負荷、WIP制御に関わるカードを優先表示します。',
  },
  {
    id: 'rest_route',
    label: '休憩しづらい',
    focus: ['fatigue', 'medical', 'return'],
    facets: ['internal', 'mental', 'physical'],
    note: '休養確保とフォールバック運用を含むカードを優先表示します。',
  },
  {
    id: 'commute_remote',
    label: '通勤/在宅',
    focus: ['commute', 'medical', 'fatigue'],
    facets: ['physical', 'internal', 'mental'],
    note: '通勤消耗の軽減、ハイブリッド設計、移動制約対応のカードを優先表示します。',
  },
  {
    id: 'safety_critical',
    label: '安全クリティカル',
    focus: ['environment', 'manager', 'application'],
    facets: [
      'visual',
      'hearing',
      'physical',
      'internal',
      'mental',
      'developmental',
      'higher_brain',
    ],
    note: '危険作業・運転・緊急対応の業務を安全に実行するためのカードを優先表示します。',
  },
  {
    id: 'mental_uncertainty',
    label: '不安/メンタル',
    focus: ['fatigue', 'return', 'manager', 'disclosure'],
    facets: ['mental', 'developmental'],
    note: '悪化兆候の検知、開示境界、段階復帰に関わるカードを優先表示します。',
  },
  {
    id: 'relationship_stability',
    label: '人間関係',
    focus: ['manager', 'disclosure', 'customer'],
    facets: ['mental', 'developmental', 'intellectual'],
    note: '対人摩擦の予防、相談導線、情報共有範囲の整理に関わるカードを優先表示します。',
  },
  {
    id: 'document_reading',
    label: '読み書き',
    focus: ['meeting', 'environment', 'manager'],
    facets: ['visual', 'higher_brain', 'intellectual'],
    note: '資料アクセシビリティ、手順明確化、読解負荷調整のカードを優先表示します。',
  },
  {
    id: 'job_entry',
    label: '就活・応募',
    focus: ['career', 'jobsearch', 'application'],
    facets: PRIORITY_FACETS,
    note: '仕事探し、応募、面接、職場実習、就労定着の初期設計カードを優先表示します。',
  },
  {
    id: 'income_stability',
    label: '収入/条件',
    focus: ['career', 'jobsearch', 'application'],
    facets: ['internal', 'mental', 'physical', 'intellectual'],
    note: '収入確保と雇用条件の両立、段階就労の安定化カードを優先表示します。',
  },
];

type CardMiningProfile = {
  issueKeywords: string[];
  supportKeywords: string[];
  claimKeywords: string[];
  accommodationFacets: string[];
  preferredSignals: string[];
};

type Data2IndexEntry = {
  id: number;
  disability?: string;
  issues?: Array<{
    issue?: string;
    supports?: string[];
  }>;
  narrativeHighlights?: string[];
};

type KnowledgeClaimRow = {
  id: string;
  signal?: string | null;
  statement?: string;
  canonicalStatement?: string;
  evidenceCount?: number;
  sourceIds?: string[];
  risk?: { level?: string };
  confidence?: { score?: number };
  interactionContextSummary?: {
    countries?: string[];
    disabilityFacets?: string[];
    accommodationFacets?: string[];
    evidenceLane?: string;
  };
};

type GlmWorkbookMetrics = {
  totals?: {
    significantRelations?: number;
    uniquePredictorsWithSignificantRelation?: number;
  };
};

type GlmSignificantRelation = {
  id: string;
  sheet?: string;
  sheetOrder?: number;
  predictor?: string;
  predictorGroup?: string;
  outcome?: string;
  p?: number;
  b?: number;
  direction?: string;
  summary?: string;
  keywords?: string[];
};

type GlmSignificantRelationsPayload = {
  relationCount?: number;
  relations?: GlmSignificantRelation[];
};

const CARD_MINING_PROFILES: Record<string, CardMiningProfile> = {
  'p-meeting-overload': {
    issueKeywords: ['会話', '議論', '理解', '注意を集中', '問題解決', '判断'],
    supportKeywords: ['コミュニケーションに時間', '個別的な調整', '業務内容を改善', '相談にのって'],
    claimKeywords: ['meeting', 'communication', 'information', '会議', '対話', '理解'],
    accommodationFacets: ['communication_support', 'policy_and_training', 'schedule_flexibility'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution', 'symptom_exacerbation'],
  },
  'p-fatigue-pacing': {
    issueKeywords: ['精神的ストレス', '仕事中に適度に休憩', 'フルタイム', '週20時間', '体調'],
    supportKeywords: ['休憩や健康管理', '健康状態チェック', '無理のない仕事', '勤務時間帯の変更'],
    claimKeywords: ['fatigue', 'pace', 'break', 'rest', '疲労', '体調'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training', 'environment_control'],
    preferredSignals: ['symptom_exacerbation', 'difficulty_resolution'],
  },
  'p-medical-schedule': {
    issueKeywords: ['通院', '週20時間', 'フルタイム', '仕事内容が安定'],
    supportKeywords: ['通院への配慮', '勤務時間帯の変更', '産業医', '服薬や自己管理'],
    claimKeywords: ['treatment', 'medical', 'schedule', '通院', '治療', '服薬'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-environment-sensory': {
    issueKeywords: ['注意を集中', '文書の内容を理解', '精神的ストレス'],
    supportKeywords: [
      '支援機器',
      '個別的な環境整備',
      '休憩や健康管理',
      '換気',
      '空気清浄',
      '空調',
      'HVAC',
      '刺激を減らす',
    ],
    claimKeywords: [
      'environment',
      'stimuli',
      'noise',
      'light',
      'air quality',
      'ventilation',
      'air filtration',
      'hvac',
      'fragrance',
      'allergy',
      '音',
      '光',
      '環境',
      '換気',
      '空気',
      '刺激',
    ],
    accommodationFacets: ['environment_control', 'assistive_technology', 'schedule_flexibility'],
    preferredSignals: ['symptom_exacerbation', 'support_needs'],
  },
  'p-commute-hybrid': {
    issueKeywords: ['週20時間', 'フルタイム', '仕事内容が安定', '地域で安心して生活'],
    supportKeywords: ['勤務時間帯の変更', '無理のない仕事', '通院への配慮'],
    claimKeywords: ['telework', 'remote', 'commute', 'hybrid', '通勤', '在宅'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training', 'environment_control'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution'],
  },
  'p-disclosure-boundary': {
    issueKeywords: [
      '誤解されずうまく説明',
      '必要な配慮や支援等についての職場への説明',
      '職場への説明',
    ],
    supportKeywords: ['正しい理解', '相談にのって', '職業カウンセリング'],
    claimKeywords: ['disclosure', 'privacy', 'consent', '開示', '共有', '同意'],
    accommodationFacets: ['policy_and_training', 'communication_support'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-return-to-work-ramp': {
    issueKeywords: ['仕事内容が安定して継続', 'フルタイム', '週20時間', '精神的ストレス'],
    supportKeywords: ['無理のない仕事', '産業医', '健康状態チェック', '勤務時間帯の変更'],
    claimKeywords: ['return to work', 'ramp', '復職', '段階', '再発'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution', 'support_needs'],
  },
  'p-shift-rhythm-guard': {
    issueKeywords: ['フルタイム', '週20時間', '仕事中に適度に休憩'],
    supportKeywords: ['勤務時間帯の変更', '通院への配慮', '服薬や自己管理', '休憩や健康管理'],
    claimKeywords: ['shift', 'schedule', 'sleep', 'シフト', '勤務時間', '睡眠'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training'],
    preferredSignals: ['difficulty_occurrence', 'symptom_exacerbation'],
  },
  'p-manager-checkin': {
    issueKeywords: [
      '円滑な人間関係を維持',
      '必要な配慮等を伝える',
      '仕事内容が安定',
      '責任に十分に応える',
    ],
    supportKeywords: [
      '相談にのって',
      '業務内容を改善',
      '健康状態チェック',
      '障害や病気の定期的なチェック',
      '行動規範',
      '監督方法',
      '定期面談',
    ],
    claimKeywords: [
      'manager',
      'check-in',
      'supervisor',
      'conduct',
      'behavior',
      'supervisory',
      'policy',
      '上司',
      '面談',
      '相談',
      '行動',
      '規範',
    ],
    accommodationFacets: ['policy_and_training', 'communication_support'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-customer-facing-load': {
    issueKeywords: ['人と応対', '意思を伝える', '会話や議論'],
    supportKeywords: ['コミュニケーションに時間', '個別実務指導', '個別的な調整'],
    claimKeywords: ['customer', 'frontline', 'communication', '接客', '対人'],
    accommodationFacets: ['communication_support', 'policy_and_training'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution'],
  },
  'p-visual-document-access': {
    issueKeywords: ['書類、本、説明書等を読む', '文章を書く', '話や文書の内容を理解'],
    supportKeywords: ['支援機器', '個別的な環境整備', 'コミュニケーションに時間'],
    claimKeywords: ['visual', 'document', 'screen', 'read', '視覚', '文書', '読解'],
    accommodationFacets: ['assistive_technology', 'environment_control', 'communication_support'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-hearing-meeting-access': {
    issueKeywords: ['会話や議論', '話や文書の内容を理解', 'コミュニケーション機器'],
    supportKeywords: ['コミュニケーションに時間', '支援機器', '個別的な調整'],
    claimKeywords: ['hearing', 'caption', 'subtitle', '聴覚', '聞き取り', '字幕'],
    accommodationFacets: ['communication_support', 'assistive_technology', 'policy_and_training'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-physical-mobility-route': {
    issueKeywords: [
      '歩くこと',
      '様々な場所をあちこち移動',
      '立った姿勢で仕事',
      '運搬すること',
      '乗り物を操作して動かすこと',
      '手と手指を使って物をつまんだり',
    ],
    supportKeywords: [
      '個別的な環境整備や改造',
      '無理のない仕事',
      '勤務時間帯の変更',
      '作業台調整',
      '姿勢負担の軽減',
      '補助具',
    ],
    claimKeywords: [
      'mobility',
      'access',
      'route',
      'physical',
      'exertion',
      'workstation',
      'adjustable',
      '移動',
      '動線',
      '段差',
      '作業台',
      '姿勢',
    ],
    accommodationFacets: ['assistive_technology', 'environment_control', 'schedule_flexibility'],
    preferredSignals: ['difficulty_occurrence', 'support_needs'],
  },
  'p-safety-critical-operations': {
    issueKeywords: [
      '乗り物を操作して動かすこと',
      '危険のある事態や状況に適切に対処すること',
      '手と手指を使って物をつまんだり',
      '仕事で要求されている責任に十分に応えること',
    ],
    supportKeywords: [
      '障害や病気の定期的なチェック',
      '必要に応じた同僚等の作業補助',
      '仕事の内容や仕方の個別的な調整',
      '仕事上の相談にのってくれる同僚・上司・上役',
      '誰もが使いやすい機器・機材',
      '緊急時対応手順',
      '9-1-1',
      '発作時手順',
    ],
    claimKeywords: [
      'safety',
      'risk',
      'hazard',
      'operation',
      'emergency',
      'seizure',
      'plan of action',
      '危険',
      '安全',
      '運転',
      'フォークリフト',
      '責任',
      '手指',
      '緊急',
      '発作',
    ],
    accommodationFacets: ['environment_control', 'policy_and_training', 'communication_support'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution', 'symptom_exacerbation'],
  },
  'p-internal-treatment-compatibility': {
    issueKeywords: ['病気の適切な管理', '体調管理', '治療', '回復'],
    supportKeywords: ['通院への配慮', '服薬や自己管理', '産業医・産業保健師', '休憩や健康管理'],
    claimKeywords: ['internal', 'chronic', 'treatment', 'recovery', '内部障害', '通院', '回復'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-intellectual-task-clarity': {
    issueKeywords: [
      '数を数えたり、計算',
      '決められた課題を達成',
      '問題解決や判断',
      '本質的業務',
      '職務要件',
      '学習困難',
    ],
    supportKeywords: [
      '個別実務指導',
      '無理のない仕事',
      '個別的な調整',
      '手順書',
      'チェックリスト',
      '本質的機能の明確化',
    ],
    claimKeywords: [
      'intellectual',
      'instruction',
      'checklist',
      'essential function',
      'job performance',
      'learning disabilities',
      'executive function',
      '知的',
      '手順',
      '明確化',
      '本質的業務',
      '職務要件',
    ],
    accommodationFacets: ['policy_and_training', 'communication_support'],
    preferredSignals: ['difficulty_resolution', 'support_needs'],
  },
  'p-developmental-switch-load': {
    issueKeywords: ['注意を集中', '問題解決や判断', '会話や議論'],
    supportKeywords: ['個別的な調整', 'コミュニケーションに時間', '健康状態チェック'],
    claimKeywords: ['developmental', 'switch', 'executive', '発達', '切替', '認知負荷'],
    accommodationFacets: ['policy_and_training', 'environment_control', 'schedule_flexibility'],
    preferredSignals: ['difficulty_occurrence', 'symptom_exacerbation'],
  },
  'p-mental-fluctuation-plan': {
    issueKeywords: ['精神的ストレス', '仕事内容が安定して継続', '円滑な人間関係'],
    supportKeywords: ['産業医・産業保健師', '相談にのって', '健康状態チェック', 'ストレス対処'],
    claimKeywords: ['mental', 'stress', 'anxiety', '精神', '不安', 'ストレス'],
    accommodationFacets: ['policy_and_training', 'environment_control', 'schedule_flexibility'],
    preferredSignals: ['symptom_exacerbation', 'support_needs'],
  },
  'p-higher-brain-memory-support': {
    issueKeywords: ['注意を集中', '決められた課題を達成', '話や文書の内容を理解'],
    supportKeywords: ['個別実務指導', '個別的な調整', 'コミュニケーションに時間'],
    claimKeywords: ['brain injury', 'memory', 'cognitive', '高次脳', '記憶', '遂行'],
    accommodationFacets: ['policy_and_training', 'communication_support', 'assistive_technology'],
    preferredSignals: ['difficulty_resolution', 'support_needs'],
  },
  'p-jobmatch-exploration': {
    issueKeywords: [
      '本人が能力を発揮できる仕事について調べること',
      '希望の会社についての情報を集めること',
      '希望の仕事に就くための能力を身につけること',
      '地域で安心して生活できること',
      '障害と共存しての人生・生活の展望をもつこと',
      '仕事をとおして、社会に役立つ自信',
      '仕事内容によっては、企業ニーズに応える自信',
      '独立起業や自営の始め方の情報を集めること',
    ],
    supportKeywords: [
      '進路支援',
      '職業相談',
      '技能訓練',
      '職業能力の評価',
      '職場見学',
      '仕事の探し方や、求人票検索の仕方の説明',
      '就職の説明会や学習会、起業等の講座',
    ],
    claimKeywords: ['job matching', 'career', 'assessment', '能力発揮', '職業選択', '進路'],
    accommodationFacets: ['policy_and_training', 'communication_support'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-application-contact-flow': {
    issueKeywords: [
      '企業に就職について連絡・申し込みすること',
      '履歴書や応募書類を作成すること',
      '就職面接を受けること',
      '企業に対して自分をうまくアピールすること',
    ],
    supportKeywords: [
      '履歴書作成等の練習',
      '職業カウンセリング',
      '就労相談',
      'コミュニケーションに時間',
      '仕事の探し方や、求人票検索の仕方の説明',
    ],
    claimKeywords: ['application', 'interview', 'resume', '応募', '面接', '履歴書'],
    accommodationFacets: ['communication_support', 'policy_and_training'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution'],
  },
  'p-interview-self-advocacy': {
    issueKeywords: [
      '企業に障害や病気を誤解されずうまく説明すること',
      '企業に対して職場で必要な配慮等を伝えること',
      '必要な配慮や支援等についての職場への説明',
      '自分の希望について周囲を説得して意思を通す自信',
    ],
    supportKeywords: ['正しい理解', '相談にのって', '個別の職業相談', '面接や履歴書作成等の練習'],
    claimKeywords: ['disclosure', 'self-advocacy', 'accommodation request', '説明', '配慮を伝える'],
    accommodationFacets: ['communication_support', 'policy_and_training'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
  'p-skill-building-path': {
    issueKeywords: [
      '希望の仕事に就くための能力を身につけること',
      '仕事に必要な技能を習得すること',
      '能力やスキルに見合って適正な処遇（賃金、職位等）',
      '職務として決められた課題を達成すること',
    ],
    supportKeywords: ['技能訓練', '資格取得支援', '職業能力の評価', '個別実務指導'],
    claimKeywords: ['skill', 'training', 'qualification', '技能習得', '職業訓練'],
    accommodationFacets: ['policy_and_training', 'assistive_technology'],
    preferredSignals: ['difficulty_resolution', 'support_needs'],
  },
  'p-worktrial-transition': {
    issueKeywords: [
      '実際の職場の見学や職場実習・体験をすること',
      '雇用就労',
      '一般就労',
      'フルタイム労働',
      '週20時間以上の労働',
    ],
    supportKeywords: [
      '職場見学',
      '職場実習',
      'トライアル雇用',
      '就職先のあっせん・紹介',
      'ジョブコーチ支援',
    ],
    claimKeywords: ['work trial', 'transition', 'placement', '実習', 'トライアル', '定着'],
    accommodationFacets: ['policy_and_training', 'schedule_flexibility', 'communication_support'],
    preferredSignals: ['difficulty_occurrence', 'difficulty_resolution', 'support_needs'],
  },
  'p-income-condition-stability': {
    issueKeywords: [
      '生活に十分な収入',
      '収入のある就労',
      '適当な報酬を得ること',
      '仕事上の身分、仕事内容が安定して継続すること',
      '希望と合い満足できる職業生活',
    ],
    supportKeywords: [
      'キャリアアップ',
      '無理のない仕事への配置',
      '就職先のあっせん・紹介',
      '仕事内容の個別的な調整',
    ],
    claimKeywords: ['income', 'wage', 'stability', 'retention', '収入', '雇用条件', '安定'],
    accommodationFacets: ['schedule_flexibility', 'policy_and_training'],
    preferredSignals: ['difficulty_resolution', 'support_needs'],
  },
  'p-support-service-navigation': {
    issueKeywords: [
      '世の中のいろんな支援制度やサービスを有効に活用できる自信',
      '就労したいという思いを周りの人に伝えること',
      '全般的に満足できる生活',
      '地域で安心して生活できること',
    ],
    supportKeywords: [
      '就労相談',
      '相談員',
      '支援機関の見学',
      'ケース会議',
      '日常生活、地域生活の支援',
      '支援への接続',
      '手続きのステップ',
    ],
    claimKeywords: [
      'service navigation',
      'support system',
      'case management',
      'workplace changes',
      'support steps',
      '支援制度',
      '相談導線',
      '支援の手順',
      '手続き',
    ],
    accommodationFacets: ['policy_and_training', 'communication_support', 'environment_control'],
    preferredSignals: ['support_needs', 'difficulty_resolution'],
  },
};

const CARD_REGION_TO_COUNTRY: Record<string, string> = {
  JP: 'JP',
  US: 'US',
  UK: 'UK',
  EU: 'EU',
  AU: 'AU',
  CA: 'CA',
  DE: 'DE',
};

const EVIDENCE_LANE_LABEL: Record<string, string> = {
  case_practice: '事例実践',
  legal_policy: '制度根拠',
  employer_guidance: '雇用主ガイダンス',
  aggregated_general: '集計一般',
  mixed: '混合',
  unknown: '不明',
};

const NOISY_STATEMENT_REGEX =
  /(close menu|toggle navigation|skip to main content|サイトマップ|検索結果|本文へ|文字サイズ変更|背景色変更|all rights reserved|copyright|メニュー\s*閉じる)/i;

function normalizeEvidenceLane(value: unknown): string {
  const lane = String(value || '').trim();
  if (!lane) return 'unknown';
  return EVIDENCE_LANE_LABEL[lane] ? lane : 'unknown';
}

function lanePriorityWeight(lane: string): number {
  if (lane === 'case_practice') return 36;
  if (lane === 'mixed') return 26;
  if (lane === 'legal_policy') return 14;
  if (lane === 'employer_guidance') return 12;
  if (lane === 'aggregated_general') return 4;
  return 8;
}

function strategicLaneBonus(
  insight?: Pick<GuideCardStrategicInsight, 'evidenceLanes'> | Pick<CardStrategicInsight, 'evidenceLanes'>,
): number {
  if (!insight || !Array.isArray(insight.evidenceLanes)) return 0;
  const lanes = insight.evidenceLanes.map((lane) => normalizeEvidenceLane(lane));
  return lanes.reduce((sum, lane) => sum + lanePriorityWeight(lane), 0);
}

function normalizeText(value: unknown): string {
  return String(value || '').toLowerCase();
}

function countKeywordMatches(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  return keywords.reduce((count, keyword) => {
    if (!keyword) return count;
    return normalized.includes(normalizeText(keyword)) ? count + 1 : count;
  }, 0);
}

const SEMANTIC_TOKEN_STOP_WORDS = new Set([
  'こと',
  'もの',
  'ため',
  'など',
  'する',
  'できる',
  '必要',
  '対応',
  '調整',
  '支援',
  '配慮',
  '職場',
  '仕事',
  '就労',
  '就職',
  '業務',
  '状態',
  '本人',
  '場合',
  '課題',
  '問題',
  '実施',
  '確認',
  '検証',
  '改善',
]);

function normalizeSemanticToken(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[\s　・／/（）()「」『』、,。.!?\-_:：;'"[\]{}]/g, '')
    .trim();
}

function tokenizeSemantic(text: string): string[] {
  const tokens = String(text || '')
    .split(/[・／/（）()「」『』、,。.!?\-_:：;\s　]+/)
    .map((token) => normalizeSemanticToken(token))
    .filter((token) => token.length >= 2 && !SEMANTIC_TOKEN_STOP_WORDS.has(token));
  return Array.from(new Set(tokens));
}

const GLM_OUTCOME_BUCKET_CARD_HINTS: Record<string, string[]> = {
  employment_continuation: [
    'p-meeting-overload',
    'p-fatigue-pacing',
    'p-medical-schedule',
    'p-environment-sensory',
    'p-commute-hybrid',
    'p-return-to-work-ramp',
    'p-shift-rhythm-guard',
    'p-manager-checkin',
    'p-customer-facing-load',
    'p-visual-document-access',
    'p-hearing-meeting-access',
    'p-physical-mobility-route',
    'p-safety-critical-operations',
    'p-internal-treatment-compatibility',
    'p-intellectual-task-clarity',
    'p-developmental-switch-load',
    'p-mental-fluctuation-plan',
    'p-higher-brain-memory-support',
    'p-income-condition-stability',
  ],
  job_preparation: [
    'p-jobmatch-exploration',
    'p-application-contact-flow',
    'p-interview-self-advocacy',
    'p-skill-building-path',
    'p-worktrial-transition',
    'p-support-service-navigation',
    'p-income-condition-stability',
  ],
  job_search: [
    'p-jobmatch-exploration',
    'p-application-contact-flow',
    'p-interview-self-advocacy',
    'p-worktrial-transition',
    'p-income-condition-stability',
    'p-support-service-navigation',
  ],
  symptom_function: [
    'p-fatigue-pacing',
    'p-medical-schedule',
    'p-environment-sensory',
    'p-shift-rhythm-guard',
    'p-visual-document-access',
    'p-hearing-meeting-access',
    'p-physical-mobility-route',
    'p-safety-critical-operations',
    'p-internal-treatment-compatibility',
    'p-intellectual-task-clarity',
    'p-developmental-switch-load',
    'p-mental-fluctuation-plan',
    'p-higher-brain-memory-support',
  ],
  workplace_accommodation_need: [
    'p-disclosure-boundary',
    'p-manager-checkin',
    'p-return-to-work-ramp',
    'p-support-service-navigation',
    'p-commute-hybrid',
    'p-shift-rhythm-guard',
    'p-safety-critical-operations',
  ],
  understanding_need: [
    'p-disclosure-boundary',
    'p-manager-checkin',
    'p-interview-self-advocacy',
    'p-support-service-navigation',
  ],
  support_need: [
    'p-support-service-navigation',
    'p-jobmatch-exploration',
    'p-skill-building-path',
    'p-worktrial-transition',
    'p-income-condition-stability',
    'p-application-contact-flow',
  ],
  support_use: [
    'p-support-service-navigation',
    'p-jobmatch-exploration',
    'p-worktrial-transition',
    'p-skill-building-path',
    'p-income-condition-stability',
  ],
};

const GLM_OUTCOME_BUCKET_SEMANTIC_TOKENS: Record<string, string[]> = {
  employment_continuation: ['就業継続', '現状問題', '問題発生', '継続', '定着', '離職'],
  job_preparation: ['職業準備', '職業訓練', '能力', 'スキル', '準備'],
  job_search: ['就職活動', '求人応募', '面接', '応募', '採用'],
  symptom_function: ['機能障害', '体調', '疲れ', '痛み', '通院', '集中力', 'ストレス'],
  workplace_accommodation_need: ['職場配慮', '配慮', '休憩', '勤務時間', '上司', '同僚'],
  understanding_need: ['必要理解', '誤解', '差別', '理解', '説明'],
  support_need: ['必要支援', '支援機器', '職業訓練', '資格取得', 'バリアフリー'],
  support_use: ['要支援利用', '主治医', '産業医', '相談', '支援機関', '障害者求人'],
};

function outcomeBucketsForCard(cardId: string): string[] {
  return Object.entries(GLM_OUTCOME_BUCKET_CARD_HINTS)
    .filter(([, cards]) => cards.includes(cardId))
    .map(([bucket]) => bucket);
}

function buildCardSemanticLexicon(card: PatternCard, profile: CardMiningProfile): string[] {
  const lexicon = new Set<string>();
  const seedTexts = [
    card.title,
    card.situation,
    card.selectionBoundary || '',
    ...card.quickBundle,
    ...card.preconditions,
    ...card.failureRisks,
    ...profile.issueKeywords,
    ...profile.supportKeywords,
    ...profile.claimKeywords,
  ];

  for (const seed of seedTexts) {
    for (const token of tokenizeSemantic(seed)) {
      lexicon.add(token);
    }
  }

  const buckets = outcomeBucketsForCard(card.id);
  for (const bucket of buckets) {
    const bucketTokens = GLM_OUTCOME_BUCKET_SEMANTIC_TOKENS[bucket] || [];
    for (const token of bucketTokens) {
      const normalized = normalizeSemanticToken(token);
      if (normalized.length < 2) continue;
      if (SEMANTIC_TOKEN_STOP_WORDS.has(normalized)) continue;
      lexicon.add(normalized);
    }
  }

  return Array.from(lexicon).slice(0, 90);
}

function inferGlmOutcomeBucket(outcome: string): string {
  const text = String(outcome || '');
  if (!text) return '';
  if (text.startsWith('就業継続[')) return 'employment_continuation';
  if (text.startsWith('職業準備[')) return 'job_preparation';
  if (text.startsWith('就職活動[')) return 'job_search';
  if (text.startsWith('機能障害等：')) return 'symptom_function';
  if (text.startsWith('職場配慮(要)：')) return 'workplace_accommodation_need';
  if (text.startsWith('必要理解：')) return 'understanding_need';
  if (text.startsWith('必要支援：')) return 'support_need';
  if (text.startsWith('要支援利用：')) return 'support_use';
  return '';
}

function overlapCount(values: string[], targets: string[]): number {
  if (values.length === 0 || targets.length === 0) return 0;
  const set = new Set(targets.map((item) => normalizeText(item)));
  return values.reduce((count, value) => {
    return set.has(normalizeText(value)) ? count + 1 : count;
  }, 0);
}

function cleanSupportLabel(label: string): string {
  return label.replace(/\(要確認\)/g, '').trim();
}

function shortenStatement(text: string, max = 82): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max)}…`;
}

function cleanNarrativeText(input: string): string {
  return String(input || '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/[�]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSyntheticVoices(
  card: PatternCard,
  issueSeed: string,
  supportSeed: string,
  narrativeSeed: string,
): string[] {
  const focusLabel =
    card.focus
      .map((focus) => FOCUS_OPTIONS.find((option) => option.key === focus)?.label || focus)
      .slice(0, 2)
      .join(' / ') || '業務';
  const issue = issueSeed || '業務要求が重なる場面';
  const support = supportSeed || '運用ルールの調整';
  const narrative = narrativeSeed || '条件が合うと安定して進められる';
  return [
    `本人（仮想）: 「${issue}が重なる日に失速しやすい。${narrative}」`,
    `上司（仮想）: 「能力の問題にせず、${support}を先に固定したい。」`,
    `支援者（仮想）: 「${focusLabel}の条件を分解して調整すると、継続可能性が上がる。」`,
  ];
}

function kpiHintFromIssue(issue: string): string {
  if (/会話|議論|理解/.test(issue)) return '会議後の再説明件数';
  if (/ストレス|体調|休憩|フルタイム|週20/.test(issue)) return '終業時疲労スコアと欠勤率';
  if (/読む|文書|文章/.test(issue)) return '文書読解時間と修正回数';
  if (/歩く|移動|運搬|姿勢/.test(issue)) return '移動起因の遅延件数';
  return '完了率と再作業件数';
}

function toOperationalMove(support: string, issue: string): string {
  const clean = cleanSupportLabel(support);
  if (clean.includes('勤務時間帯の変更')) {
    return '時差出勤/フレックスを固定ルール化し、不可業務帯を先に確定する';
  }
  if (clean.includes('通院への配慮')) {
    return '通院日を先にブロックし、納期を中間締切で逆算する';
  }
  if (clean.includes('個別的な調整')) {
    return '仕事内容を高負荷/低負荷に分割し、週次で再配分する';
  }
  if (clean.includes('休憩や健康管理')) {
    return '回復休憩のタイミングと場所を就業ルールとして明文化する';
  }
  if (clean.includes('支援機器')) {
    return '支援機器を許可で終わらせず、利用手順を標準作業に組み込む';
  }
  if (clean.includes('相談') || clean.includes('上司')) {
    return '週次15分の定例チェックインを固定し、未対応項目に期限を付ける';
  }
  if (clean.includes('正しい理解')) {
    return 'チームへ配慮の目的と実施ルールを短時間で共有し、誤解を先に潰す';
  }
  if (/会話|議論|理解/.test(issue)) {
    return '会議前に論点共有を固定し、終了直後に決定事項を文章で残す';
  }
  if (/ストレス|体調|休憩|フルタイム|週20/.test(issue)) {
    return '高負荷帯を避ける勤務設計に切り替え、休憩条件を運用ルールにする';
  }
  return `「${clean}」を単発対応でなく運用ルールとして固定する`;
}

function glmSignalFromRelation(relation: GlmSignificantRelation): string {
  const sheetOrder = Number(relation?.sheetOrder || 0);
  if (sheetOrder === 1) return 'difficulty_occurrence';
  if (sheetOrder === 2) return 'difficulty_resolution';
  if (sheetOrder === 3) return 'symptom_exacerbation';
  if (sheetOrder === 4) return 'support_needs';
  return '';
}

function scoreGlmRelationForCard(
  relation: GlmSignificantRelation,
  card: PatternCard,
  profile: CardMiningProfile,
): {
  score: number;
  keywordHits: number;
  semanticHits: number;
  totalHits: number;
  anchored: boolean;
  outcomeBucketHit: boolean;
} {
  const text = [
    relation?.predictor || '',
    relation?.outcome || '',
    relation?.summary || '',
    ...(Array.isArray(relation?.keywords) ? relation.keywords : []),
  ]
    .join(' ')
    .trim();
  const claimHits = countKeywordMatches(text, profile.claimKeywords);
  const issueHits = countKeywordMatches(text, profile.issueKeywords);
  const supportHits = countKeywordMatches(text, profile.supportKeywords);
  const keywordHits = claimHits + issueHits + supportHits;
  const normalizedText = normalizeSemanticToken(text);
  const semanticTokens = buildCardSemanticLexicon(card, profile);
  const semanticHits = semanticTokens.reduce((count, token) => {
    return normalizedText.includes(token) ? count + 1 : count;
  }, 0);
  const outcomeBucket = inferGlmOutcomeBucket(String(relation?.outcome || ''));
  const bucketCards = GLM_OUTCOME_BUCKET_CARD_HINTS[outcomeBucket] || [];
  const outcomeBucketHit = outcomeBucket && bucketCards.includes(card.id);
  const totalHits = keywordHits + semanticHits + (outcomeBucketHit ? 2 : 0);
  const anchored = (card.evidenceTrace.glm || []).includes(String(relation?.id || ''));
  const signal = glmSignalFromRelation(relation);
  const signalScore = signal && profile.preferredSignals.includes(signal) ? 0.6 : 0;
  const anchorScore = anchored ? 2.2 : 0;
  const score =
    claimHits * 1.6 +
    issueHits * 1.1 +
    supportHits * 1.1 +
    Math.min(semanticHits, 6) * 0.45 +
    (outcomeBucketHit ? 1.2 : 0) +
    signalScore +
    anchorScore;
  return {
    score: Number(score.toFixed(3)),
    keywordHits,
    semanticHits,
    totalHits,
    anchored,
    outcomeBucketHit: Boolean(outcomeBucketHit),
  };
}

function buildCardStrategicInsight(
  card: PatternCard,
  data2Entries: Data2IndexEntry[],
  claims: KnowledgeClaimRow[],
  glmSignificantRelations: GlmSignificantRelation[],
): CardStrategicInsight {
  const profile = CARD_MINING_PROFILES[card.id] || {
    issueKeywords: [card.title],
    supportKeywords: [],
    claimKeywords: [card.title],
    accommodationFacets: [],
    preferredSignals: [],
  };

  const pairMap = new Map<
    string,
    { issue: string; support: string; score: number; count: number; disabilities: Set<string> }
  >();
  const data2NarrativeMatches: Array<{ text: string; score: number; disability: string }> = [];

  for (const entry of data2Entries) {
    const disability = String(entry?.disability || '不明').trim() || '不明';
    for (const issueRow of entry.issues || []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      const issueMatches = countKeywordMatches(issue, profile.issueKeywords);
      for (const supportRaw of issueRow?.supports || []) {
        const support = cleanSupportLabel(String(supportRaw || '').trim());
        if (!support) continue;
        const supportMatches = countKeywordMatches(support, profile.supportKeywords);
        if (issueMatches === 0 && supportMatches === 0) continue;
        const score =
          issueMatches * 2 + supportMatches * 3 + (issueMatches > 0 && supportMatches > 0 ? 2 : 0);
        const key = `${issue}|||${support}`;
        const prev = pairMap.get(key);
        if (!prev) {
          pairMap.set(key, {
            issue,
            support,
            score,
            count: 1,
            disabilities: new Set([disability]),
          });
          continue;
        }
        prev.score += score;
        prev.count += 1;
        prev.disabilities.add(disability);
      }
    }

    for (const narrative of entry?.narrativeHighlights || []) {
      const cleaned = cleanNarrativeText(String(narrative || ''));
      if (!cleaned) continue;
      const issueMatches = countKeywordMatches(cleaned, profile.issueKeywords);
      const supportMatches = countKeywordMatches(cleaned, profile.supportKeywords);
      const claimMatches = countKeywordMatches(cleaned, profile.claimKeywords);
      const score =
        issueMatches * 2 +
        supportMatches * 2 +
        claimMatches +
        (issueMatches > 0 && (supportMatches > 0 || claimMatches > 0) ? 1 : 0);
      if (score <= 0) continue;
      data2NarrativeMatches.push({ text: cleaned, score, disability });
    }
  }

  const bestPair =
    Array.from(pairMap.values()).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.count !== a.count) return b.count - a.count;
      return b.disabilities.size - a.disabilities.size;
    })[0] || null;
  const data2NarrativeHighlights = data2NarrativeMatches
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.text.localeCompare(b.text, 'ja');
    })
    .map((item) => shortenStatement(item.text, 90))
    .filter((value, index, self) => self.indexOf(value) === index)
    .slice(0, 3);

  const cardFacets = PATTERN_DISABILITY_FACETS[card.id] || [];
  const targetCountries = new Set(
    (card.evidenceTrace.sourceRegions || [])
      .map((region) => CARD_REGION_TO_COUNTRY[region])
      .filter(Boolean),
  );

  const scoredClaims = claims
    .map((claim) => {
      const riskLevel = String(claim?.risk?.level || '');
      if (riskLevel === 'high') return null;
      const statement = String(claim?.statement || '').trim();
      if (!statement || NOISY_STATEMENT_REGEX.test(statement)) return null;
      const canonical = String(claim?.canonicalStatement || statement);
      const disabilityFacets = Array.isArray(claim?.interactionContextSummary?.disabilityFacets)
        ? claim.interactionContextSummary!.disabilityFacets!
        : [];
      const accommodationFacets = Array.isArray(
        claim?.interactionContextSummary?.accommodationFacets,
      )
        ? claim.interactionContextSummary!.accommodationFacets!
        : [];
      const countries = Array.isArray(claim?.interactionContextSummary?.countries)
        ? claim.interactionContextSummary!.countries!
        : [];
      const evidenceLane = normalizeEvidenceLane(claim?.interactionContextSummary?.evidenceLane);

      const facetScore = overlapCount(disabilityFacets, cardFacets) * 1.4;
      const accommodationScore =
        overlapCount(accommodationFacets, profile.accommodationFacets) * 1.2;
      const signalScore =
        profile.preferredSignals.includes(String(claim?.signal || '')) && claim?.signal ? 1.0 : 0;
      const keywordScore =
        countKeywordMatches(`${statement} ${canonical}`, profile.claimKeywords) * 0.5;
      const countryScore =
        countries.some((country) => targetCountries.has(country)) && targetCountries.size > 0
          ? 0.8
          : 0;
      const evidenceScore = Math.min(Number(claim?.evidenceCount || 0), 40) / 12;
      const confidenceScore = Number(claim?.confidence?.score || 0) >= 0.8 ? 0.4 : 0;
      const laneScore =
        evidenceLane === 'case_practice'
          ? 0.7
          : evidenceLane === 'mixed'
            ? 0.5
            : evidenceLane === 'legal_policy'
              ? 0.3
              : evidenceLane === 'employer_guidance'
                ? 0.25
                : evidenceLane === 'aggregated_general'
                  ? 0
                  : 0.1;
      const totalScore =
        facetScore +
        accommodationScore +
        signalScore +
        keywordScore +
        countryScore +
        evidenceScore +
        confidenceScore +
        laneScore;
      if (totalScore <= 1.2) return null;
      return {
        claim,
        evidenceLane,
        score: Number(totalScore.toFixed(3)),
      };
    })
    .filter((item): item is { claim: KnowledgeClaimRow; evidenceLane: string; score: number } =>
      Boolean(item),
    )
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Number(b.claim.evidenceCount || 0) - Number(a.claim.evidenceCount || 0);
    })
    .slice(0, 3);

  const topPracticeClaim =
    scoredClaims.find(
      (item) => item.evidenceLane === 'case_practice' || item.evidenceLane === 'mixed',
    )?.claim || null;
  const topPolicyClaim =
    scoredClaims.find((item) => item.evidenceLane === 'legal_policy')?.claim || null;
  const topEmployerGuidanceClaim =
    scoredClaims.find((item) => item.evidenceLane === 'employer_guidance')?.claim || null;
  const claimHighlights = scoredClaims
    .map((item) =>
      shortenStatement(String(item.claim?.statement || item.claim?.canonicalStatement || ''), 90),
    )
    .filter(Boolean)
    .slice(0, 3);
  const topEvidenceLanes = Array.from(new Set(scoredClaims.map((item) => item.evidenceLane))).slice(
    0,
    3,
  );
  const topClaimCountries = Array.from(
    new Set(
      scoredClaims.flatMap((item) => {
        const countries = item.claim?.interactionContextSummary?.countries;
        return Array.isArray(countries) ? countries : [];
      }),
    ),
  ).filter((country) => country && country !== 'unknown');

  const glmMatched = glmSignificantRelations
    .map((relation) => {
      const fit = scoreGlmRelationForCard(relation, card, profile);
      if (fit.totalHits <= 0 && !fit.anchored) return null;
      return {
        relation,
        score: fit.score,
      };
    })
    .filter((item): item is { relation: GlmSignificantRelation; score: number } => Boolean(item))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const pA = Number(a.relation?.p ?? Number.POSITIVE_INFINITY);
      const pB = Number(b.relation?.p ?? Number.POSITIVE_INFINITY);
      if (pA !== pB) return pA - pB;
      const bA = Math.abs(Number(a.relation?.b || 0));
      const bB = Math.abs(Number(b.relation?.b || 0));
      return bB - bA;
    })
    .slice(0, 3);

  const glmLegacyIds = (card.evidenceTrace.glm || []).filter((id) =>
    GLM_EVIDENCE.some((row) => row.id === id),
  );
  const glmIds =
    glmMatched.length > 0
      ? glmMatched.map((item) => String(item.relation.id)).filter(Boolean)
      : glmLegacyIds;
  const glmLeadFull = glmMatched[0]?.relation || null;
  const glmLeadLegacy = glmLegacyIds
    .map((id) => GLM_EVIDENCE.find((row) => row.id === id))
    .filter((row): row is (typeof GLM_EVIDENCE)[number] => Boolean(row))[0];
  const glmLead = glmLeadFull || glmLeadLegacy;
  const glmHighlights =
    glmMatched.length > 0
      ? glmMatched.map((item) => ({
          id: String(item.relation.id),
          summary: shortenStatement(
            String(
              item.relation.summary ||
                `${String(item.relation.predictor || '')} × ${String(item.relation.outcome || '')}`,
            ),
            96,
          ),
        }))
      : glmLeadLegacy
        ? [
            {
              id: glmLeadLegacy.id,
              summary: shortenStatement(String(glmLeadLegacy.summary || ''), 96),
            },
          ]
        : [];

  const observation = bestPair
    ? `data2では「${bestPair.issue}」×「${bestPair.support}」が${bestPair.count}件（${bestPair.disabilities.size}障害群）で反復。`
    : 'data2単体では一致度の高い課題×支援ペアが弱く、追加質問の先行が必要。';

  const inferenceParts = [
    glmLead ? `GLM(${glmLead.id})は「${glmLead.summary}」を示す。` : null,
    topPracticeClaim
      ? `事例実践claimsでは「${shortenStatement(String(topPracticeClaim.statement || ''))}」が参照される。`
      : null,
    topPolicyClaim
      ? `制度根拠claimsでは「${shortenStatement(String(topPolicyClaim.statement || ''))}」が参照される。`
      : null,
    topEmployerGuidanceClaim
      ? `雇用主ガイダンスclaimsでは「${shortenStatement(String(topEmployerGuidanceClaim.statement || ''))}」が参照される。`
      : null,
  ].filter(Boolean);

  const fallbackMove = `mode=${modeLabel[card.mode]}として、まず${MODE_REQUIRED_CONTEXTS[card.mode]
    .slice(0, 3)
    .map((key) => CONTEXT_CHECK_LABEL[key])
    .join(' / ')}を確定する。`;

  const move = bestPair
    ? `最初の一手: ${toOperationalMove(bestPair.support, bestPair.issue)}。検証指標は「${kpiHintFromIssue(
        bestPair.issue,
      )}」。`
    : `最初の一手: ${fallbackMove}`;

  const expectedCausalTier = expectedTierForCard(card.id);
  const policyRationale = tierPolicyRationaleForCard(card.id);
  const claimHits = scoredClaims.reduce(
    (sum, item) => sum + Number(item.claim.evidenceCount || 0),
    0,
  );
  const issueSeed = bestPair?.issue || '';
  const supportSeed = bestPair?.support || card.quickBundle[0] || '';
  const narrativeSeed = data2NarrativeHighlights[0] || claimHighlights[0] || '';
  const syntheticVoices = buildSyntheticVoices(card, issueSeed, supportSeed, narrativeSeed);
  const causal = evaluateCausalTier({
    expectedTier: expectedCausalTier,
    glmHitCount: glmIds.length,
    data2HitCount: bestPair?.count || 0,
    claimEvidenceCount: claimHits,
    evidenceLanes: topEvidenceLanes,
    countries: topClaimCountries,
    sourceRegions: card.evidenceTrace.sourceRegions || [],
  });

  return {
    cardId: card.id,
    observation,
    inference:
      inferenceParts.join(' ') || 'GLM・claimsの関連シグナルが弱いため、仮説を置いて再観測する。',
    move,
    expectedCausalTier: causal.expectedTier,
    expectedTierMet: causal.expectedTierMet,
    causalTier: causal.tier,
    causalBasis: causal.basis,
    causalLabel: causal.label,
    causalSummary: causal.summary,
    causalGuardrail: causal.guardrail,
    causalTriangulationScore: causal.triangulationScore,
    tierPolicyRationale: policyRationale,
    data2Hits: bestPair?.count || 0,
    claimHits,
    countries: topClaimCountries.slice(0, 4),
    evidenceLanes: topEvidenceLanes,
    claimIds: scoredClaims.map((item) => String(item.claim.id)).filter(Boolean),
    glmIds,
    glmHighlights,
    claimHighlights,
    data2NarrativeHits: data2NarrativeMatches.length,
    data2NarrativeHighlights,
    syntheticVoices,
    evidenceTraceCounts: {
      glmAnchors: card.evidenceTrace.glm.length,
      glmMatched: glmIds.length,
      data2PairHits: bestPair?.count || 0,
      data2NarrativeHits: data2NarrativeMatches.length,
      claimsMatched: scoredClaims.length,
      claimsEvidence: claimHits,
    },
  };
}

function computePatternCoverageSnapshot(entries: Data2IndexEntry[]): PatternCoverageSnapshot {
  const allProfiles = Object.values(CARD_MINING_PROFILES);
  let totalIssueRows = 0;
  let coveredIssueRows = 0;
  const uncoveredIssueMap = new Map<string, number>();

  for (const entry of entries) {
    for (const issueRow of entry.issues || []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      totalIssueRows += 1;
      const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];

      const covered = allProfiles.some((profile) => {
        const issueScore = countKeywordMatches(issue, profile.issueKeywords);
        const supportScore = supports.reduce((sum, support) => {
          return sum + countKeywordMatches(String(support || ''), profile.supportKeywords);
        }, 0);
        return issueScore > 0 || supportScore > 0;
      });

      if (covered) {
        coveredIssueRows += 1;
      } else {
        uncoveredIssueMap.set(issue, (uncoveredIssueMap.get(issue) || 0) + 1);
      }
    }
  }

  return {
    totalIssueRows,
    coveredIssueRows,
    coverageRate: totalIssueRows === 0 ? 0 : Number((coveredIssueRows / totalIssueRows).toFixed(3)),
    topUncoveredIssues: Array.from(uncoveredIssueMap.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0], 'ja');
      })
      .slice(0, 8)
      .map(([issue, count]) => ({ issue, count })),
  };
}

function computeClaimsGlmCoverageSnapshot(
  claims: KnowledgeClaimRow[],
  glmWorkbookMetrics: GlmWorkbookMetrics | null,
  patternCoverage: PatternCoverageSnapshot | null,
  glmSignificantRelations: GlmSignificantRelation[],
): ClaimsGlmCoverageSnapshot {
  const sourceCoverageMap = new Map<string, ClaimCoverageBySource>();
  const laneCoverageMap = new Map<
    string,
    { lane: string; eligibleClaims: number; coveredClaims: number; coverageRate: number }
  >();

  const touchSourceCoverage = (
    sourceId: string,
    updater: (current: ClaimCoverageBySource) => ClaimCoverageBySource,
  ) => {
    const normalized = sourceId || 'unknown';
    const current = sourceCoverageMap.get(normalized) || {
      sourceId: normalized,
      totalClaims: 0,
      eligibleClaims: 0,
      coveredClaims: 0,
      coverageRate: 0,
    };
    sourceCoverageMap.set(normalized, updater(current));
  };

  const touchLaneCoverage = (
    lane: string,
    updater: (current: {
      lane: string;
      eligibleClaims: number;
      coveredClaims: number;
      coverageRate: number;
    }) => { lane: string; eligibleClaims: number; coveredClaims: number; coverageRate: number },
  ) => {
    const normalized = normalizeEvidenceLane(lane);
    const current = laneCoverageMap.get(normalized) || {
      lane: normalized,
      eligibleClaims: 0,
      coveredClaims: 0,
      coverageRate: 0,
    };
    laneCoverageMap.set(normalized, updater(current));
  };

  claims.forEach((claim) => {
    const rawSources = Array.isArray(claim?.sourceIds) ? claim.sourceIds : [];
    const sources = rawSources.length > 0 ? rawSources : ['unknown'];
    sources.forEach((sourceId) => {
      const source = String(sourceId || '').trim() || 'unknown';
      touchSourceCoverage(source, (current) => ({
        ...current,
        totalClaims: current.totalClaims + 1,
      }));
    });
  });

  const eligibleClaims = claims.filter((claim) => {
    const riskLevel = String(claim?.risk?.level || '');
    if (riskLevel === 'high') return false;
    const statement = String(claim?.statement || '').trim();
    if (!statement) return false;
    if (NOISY_STATEMENT_REGEX.test(statement)) return false;
    return true;
  });

  let claimsCovered = 0;

  for (const claim of eligibleClaims) {
    const statement = String(claim?.statement || '');
    const canonical = String(claim?.canonicalStatement || statement);
    const text = `${statement} ${canonical}`;
    const accommodationFacets = Array.isArray(claim?.interactionContextSummary?.accommodationFacets)
      ? claim.interactionContextSummary!.accommodationFacets!
      : [];
    const disabilityFacets = Array.isArray(claim?.interactionContextSummary?.disabilityFacets)
      ? claim.interactionContextSummary!.disabilityFacets!
      : [];
    const signal = String(claim?.signal || '');
    const evidenceLane = normalizeEvidenceLane(claim?.interactionContextSummary?.evidenceLane);
    const rawSources = Array.isArray(claim?.sourceIds) ? claim.sourceIds : [];
    const sources = rawSources.length > 0 ? rawSources : ['unknown'];
    sources.forEach((sourceId) => {
      const source = String(sourceId || '').trim() || 'unknown';
      touchSourceCoverage(source, (current) => ({
        ...current,
        eligibleClaims: current.eligibleClaims + 1,
      }));
    });
    touchLaneCoverage(evidenceLane, (current) => ({
      ...current,
      eligibleClaims: current.eligibleClaims + 1,
    }));

    const matched = Object.entries(CARD_MINING_PROFILES).some(([cardId, profile]) => {
      const keywordScore = countKeywordMatches(text, profile.claimKeywords);
      const signalMatch = signal && profile.preferredSignals.includes(signal);
      const accommodationScore = overlapCount(accommodationFacets, profile.accommodationFacets);
      const cardFacets = PATTERN_DISABILITY_FACETS[cardId] || [];
      const disabilityScore = overlapCount(disabilityFacets, cardFacets);
      return keywordScore > 0 || signalMatch || accommodationScore > 0 || disabilityScore > 0;
    });

    if (matched) {
      claimsCovered += 1;
      sources.forEach((sourceId) => {
        const source = String(sourceId || '').trim() || 'unknown';
        touchSourceCoverage(source, (current) => ({
          ...current,
          coveredClaims: current.coveredClaims + 1,
        }));
      });
      touchLaneCoverage(evidenceLane, (current) => ({
        ...current,
        coveredClaims: current.coveredClaims + 1,
      }));
    }
  }

  const claimsCoverageBySourceTop = Array.from(sourceCoverageMap.values())
    .map((row) => ({
      ...row,
      coverageRate:
        row.eligibleClaims === 0 ? 0 : Number((row.coveredClaims / row.eligibleClaims).toFixed(3)),
    }))
    .sort((a, b) => {
      if (b.eligibleClaims !== a.eligibleClaims) return b.eligibleClaims - a.eligibleClaims;
      if (b.totalClaims !== a.totalClaims) return b.totalClaims - a.totalClaims;
      return a.sourceId.localeCompare(b.sourceId, 'ja');
    })
    .slice(0, 6);

  const claimsCoverageByLane = Array.from(laneCoverageMap.values())
    .map((row) => ({
      ...row,
      coverageRate:
        row.eligibleClaims === 0 ? 0 : Number((row.coveredClaims / row.eligibleClaims).toFixed(3)),
    }))
    .sort((a, b) => {
      if (b.eligibleClaims !== a.eligibleClaims) return b.eligibleClaims - a.eligibleClaims;
      return a.lane.localeCompare(b.lane, 'ja');
    });

  const glmLegacyAllSet = new Set(GLM_EVIDENCE.map((item) => item.id));
  const glmLegacyCoveredSet = new Set<string>();
  PATTERN_CARDS.forEach((card) => {
    card.evidenceTrace.glm.forEach((id) => {
      if (glmLegacyAllSet.has(id)) glmLegacyCoveredSet.add(id);
    });
  });

  const glmFullCoveredSet = new Set<string>();
  const glmFullLexicalCoveredSet = new Set<string>();
  const glmFullBucketBridgedSet = new Set<string>();
  for (const relation of glmSignificantRelations) {
    let lexicalMatched = false;
    let bucketBridged = false;

    const matched = PATTERN_CARDS.some((card) => {
      const profile = CARD_MINING_PROFILES[card.id];
      if (!profile) return false;
      const fit = scoreGlmRelationForCard(relation, card, profile);
      const lexicalHit = fit.keywordHits > 0 || fit.semanticHits > 0 || fit.anchored;
      if (lexicalHit) lexicalMatched = true;
      if (!lexicalHit && fit.outcomeBucketHit) bucketBridged = true;
      return fit.totalHits > 0 || fit.anchored;
    });
    if (lexicalMatched) glmFullLexicalCoveredSet.add(String(relation.id));
    if (!lexicalMatched && bucketBridged) glmFullBucketBridgedSet.add(String(relation.id));
    if (matched) glmFullCoveredSet.add(String(relation.id));
  }

  const directEvidenceTotal =
    Number(patternCoverage?.totalIssueRows || 0) + Number(eligibleClaims.length || 0);
  const directEvidenceCovered =
    Number(patternCoverage?.coveredIssueRows || 0) + Number(claimsCovered || 0);

  return {
    claimsAll: claims.length,
    claimsEligible: eligibleClaims.length,
    claimsCovered,
    claimsCoverageRate:
      eligibleClaims.length === 0 ? 0 : Number((claimsCovered / eligibleClaims.length).toFixed(3)),
    claimsCoverageBySourceTop,
    claimsCoverageByLane,
    directEvidenceTotal,
    directEvidenceCovered,
    directEvidenceCoverageRate:
      directEvidenceTotal === 0
        ? 0
        : Number((directEvidenceCovered / directEvidenceTotal).toFixed(3)),
    glmWorkbookSignificantRelations: Number(glmWorkbookMetrics?.totals?.significantRelations || 0),
    glmWorkbookPredictors: Number(
      glmWorkbookMetrics?.totals?.uniquePredictorsWithSignificantRelation || 0,
    ),
    glmFullCoveredRelations: glmFullCoveredSet.size,
    glmFullTotalRelations: glmSignificantRelations.length,
    glmFullCoverageRate:
      glmSignificantRelations.length === 0
        ? 0
        : Number((glmFullCoveredSet.size / glmSignificantRelations.length).toFixed(3)),
    glmFullLexicalCoveredRelations: glmFullLexicalCoveredSet.size,
    glmFullBucketBridgedRelations: glmFullBucketBridgedSet.size,
    glmLegacyCovered: glmLegacyCoveredSet.size,
    glmLegacyTotal: glmLegacyAllSet.size,
    glmLegacyCoverageRate:
      glmLegacyAllSet.size === 0
        ? 0
        : Number((glmLegacyCoveredSet.size / glmLegacyAllSet.size).toFixed(3)),
  };
}

const PATTERN_CARDS: PatternCard[] = [
  {
    id: 'p-meeting-overload',
    focus: ['meeting', 'fatigue'],
    title: '会議同時処理負荷が主因: 理解遅延が午後疲労へ連鎖する',
    mode: 'conditional_only',
    situation:
      '長時間会議・即時応答・資料の同時読解が重なると、理解遅延と疲労蓄積が同時に起きやすい。',
    selectionBoundary:
      '選ぶ目安: 主困りごとが会議中の同時処理（聞く・読む・即答）なら本カード。会議外の割込み切替が中心なら「タスク切替過多が主因」カード、聞こえ/見えのアクセス不足が中心なら各アクセスカードを優先。',
    quickBundle: [
      '会議を30分単位に分割し、論点を1テーマずつ固定する',
      '事前資料を前日配布し、当日は意思決定項目だけに集中する',
      '同期会議の一部を非同期コメントに置き換える',
      '会議後15分の回復バッファを勤務設計に組み込む',
    ],
    packages: [
      {
        id: 'pkg-meeting-redesign',
        name: '会議再設計パッケージ',
        goal: '同時処理負荷を減らし、会議中の理解精度を上げる。',
        components: [
          '会議を「共有」「判断」「調整」に分離して別枠化',
          '事前資料は24時間前配布し、当日は決定論点のみ扱う',
          '会議後15分の回復バッファを標準運用にする',
        ],
        operationRules: [
          '4週間の試行期間を設定し、毎週運用レビューを実施する',
          '司会者が議題逸脱を止める責任を持つ',
        ],
        kpi: ['会議後の再説明依頼件数', '会議後30分の疲労自己評価', '会議内意思決定率'],
        recheckTrigger: '2週間連続で疲労自己評価が悪化した場合、会議数と密度を再設計する。',
      },
      {
        id: 'pkg-async-shift',
        name: '同期→非同期シフトパッケージ',
        goal: '即時応答ストレスを下げつつ、合意速度を維持する。',
        components: [
          '情報共有は非同期スレッドへ移行し、会議は意思決定のみ',
          '返信SLA（例: 4営業時間以内）を合意する',
          '非同期議論のテンプレート（論点/懸念/提案）を固定化する',
        ],
        operationRules: ['レスポンス遅延を個人責任化しない', '会議と非同期の役割境界を明文化する'],
        kpi: ['非同期スレッド完結率', '会議時間総量', '締切遅延件数'],
        recheckTrigger: '締切遅延が増えた場合、非同期対象タスクを再分類する。',
      },
    ],
    lensLogic: {
      occurrence: '同時処理（聞く・読む・判断する）の密度が高いほど、困難の発生確率が上がる。',
      resolution: '情報の分解（時間分割・論点分割）で、解決可能性を上げやすい。',
      symptomWork: '認知負荷が高い会議設計は疲労・集中低下の悪循環を作りやすい。',
      supportFormation:
        '必要支援は「能力不足」ではなく、会議設計と情報流通設計の問題として形成される。',
    },
    preconditions: [
      '職務上、会議参加が必須である',
      '会議目的（共有/意思決定/調整）が区別されている',
      '上長・司会者が進行設計を変更できる',
    ],
    failureRisks: [
      '会議時間だけ短縮して論点密度を下げないと、効果が出にくい',
      '非同期化しても返信SLAを決めないと逆に負荷が増える',
    ],
    followUpQuestions: [
      '理解遅延は「どの会議」で最も起きやすいか？',
      '会議後に落ちる業務（文章作成/判断/対人調整）は何か？',
      '短縮と非同期化のどちらが現場文化に適合するか？',
    ],
    jurisdictionNotes: [
      'JP/US/UK/EUいずれでも運用設計の調整は実務的に適用しやすい。',
      '制度申請が必要な配慮（助成・正式申請）に進む場合は法域確認が必要。',
    ],
    evidenceTrace: {
      glm: ['GLM-S3-002', 'GLM-S1-001'],
      claimIds: ['9a810f34c89b02b2', '627977e3fd538fe0'],
      sourceRegions: ['JP', 'US', 'UK'],
    },
  },
  {
    id: 'p-fatigue-pacing',
    focus: ['fatigue', 'medical'],
    title: '体調変動が主因: 日ごとの業務達成度が安定しない',
    mode: 'conditional_only',
    situation:
      '症状の波・疲労・回復遅延がある場合、同じ業務量でも日ごとの達成度が大きく変動しやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が「日内・週内の体調波に合わせた業務密度の可変運用」なら本カード。通院時刻の衝突が中心なら「通院日程の衝突が主因」、治療後の回復時間確保が中心なら「回復時間不足が主因」、復職初期の段階復帰設計が中心なら「復職ランプ不足が主因」を優先。',
    quickBundle: [
      '業務量を週単位で平準化し、ピーク日を作らない',
      '90分ごとの短休憩を標準運用にする',
      '重要タスクを体調の安定時間帯へ再配置する',
      '週次レビューで負荷の上げ下げを事前合意する',
    ],
    packages: [
      {
        id: 'pkg-pacing',
        name: 'ペーシング運用パッケージ',
        goal: '体調波がある前提で、負荷を可変制御する。',
        components: [
          '業務を高負荷/中負荷/低負荷で分類して日次配分する',
          '90分ごとに強制マイクロ休憩を入れる',
          '安定時間帯に重要判断タスクを配置する',
        ],
        operationRules: ['週次で業務密度を再調整する', '自己申告を評価不利益に結びつけない'],
        kpi: ['週次完了率', '疲労ピーク頻度', '体調要因による遅延件数'],
        recheckTrigger: '完了率低下が2週続いたら、目標設定を再調整する。',
      },
      {
        id: 'pkg-load-buffer',
        name: '負荷バッファ設計パッケージ',
        goal: '症状悪化日の影響を翌日以降に連鎖させない。',
        components: [
          '予備日を週1回設ける',
          '納期を中間締切付きの二段階にする',
          '代替担当ルールを明文化する',
        ],
        operationRules: ['繁忙期は前倒し着手を標準化する', '調整履歴を記録し翌月設計に反映する'],
        kpi: ['中間締切遵守率', '突発残業時間', '代替発動件数'],
        recheckTrigger: '突発残業が増加した場合は中間締切の設計を見直す。',
      },
    ],
    lensLogic: {
      occurrence: '体調管理と業務要求が不整合なとき、就労困難が発生しやすい。',
      resolution: '業務配分の再設計で、解決難易度を下げられる可能性がある。',
      symptomWork: '疲労の蓄積は翌日以降へ遅延影響し、連鎖的に作業品質を下げる。',
      supportFormation: '必要支援は固定ではなく、時間帯・季節・治療状況で再形成される。',
    },
    preconditions: [
      '日内/週内で体調波の傾向が把握できる',
      '業務の優先順位づけが可能',
      'レビューで調整する運用責任者がいる',
    ],
    failureRisks: [
      '根性論でカバーすると再発・離脱リスクが上がる',
      '本人の自己申告チャネルがないと調整が後手になる',
    ],
    followUpQuestions: [
      '体調が崩れる直前の業務パターンは何か？',
      '休憩で回復するのか、タスク変更が必要なのか？',
      '調整後に改善を測るKPIは何か？',
    ],
    jurisdictionNotes: [
      '法域を問わず有効な運用設計だが、労働時間制度との整合確認が必要。',
      '制度活用（助成/支援機器）に進む場合は各国制度に依存する。',
    ],
    evidenceTrace: {
      glm: ['GLM-S3-001', 'GLM-S2-001'],
      claimIds: ['d2033f3551357dd0', '55b623ad4146f8b9'],
      sourceRegions: ['US', 'JP', 'NBL-local'],
    },
  },
  {
    id: 'p-medical-schedule',
    focus: ['medical', 'commute'],
    title: '通院日程の衝突が主因: 通院・治療と勤務スケジュールが噛み合わない',
    mode: 'questions_first',
    situation:
      '主課題が「通院日・受診時刻の調整不足」にある場合のカード。受診予定と業務ピークが重なると、欠勤不安・有給消費不安・心理的負荷が重なり、就業継続の見通しが下がりやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が「受診日・受診時刻」と「納期・会議枠」の衝突なら本カード。勤務制度（交代制・連勤・早出）の不整合が中心なら「勤務時刻の不整合が主因」、始業前の移動消耗が中心なら「通勤負荷が主因」、復職初期の負荷段階設計が中心なら「復職ランプ不足が主因」を優先。',
    quickBundle: [
      '通院日を固定し、前後で業務負荷を調整する',
      '始業/終業時刻の可変枠を設定する',
      '引き継ぎテンプレートを作り、突発時の業務穴を最小化する',
      '治療ピーク期だけ短期運用ルールを別立てにする',
    ],
    packages: [
      {
        id: 'pkg-medical-window',
        name: '治療ウィンドウ確保パッケージ',
        goal: '治療継続と業務継続を両立する時間枠を作る。',
        components: [
          '通院日を先に固定し、納期計画を逆算する',
          '始業/終業の可変枠を定義する',
          '通院当日・翌日の負荷上限を明文化する',
        ],
        operationRules: [
          '適用対象の法域と雇用区分を必ず確認する',
          '運用開始前に本人同意範囲を確認する',
        ],
        kpi: ['通院実施率', '治療関連欠勤率', '納期遅延率'],
        recheckTrigger: '通院実施率が下がった場合、業務配分と時間枠を優先的に再設計する。',
      },
      {
        id: 'pkg-handover-min',
        name: '欠勤影響最小化パッケージ',
        goal: '急な不調時でも業務穴を最小化する。',
        components: [
          '引き継ぎテンプレートを1ページ化する',
          '代替担当を事前合意する',
          '未完了タスクの優先順位ルールを設定する',
        ],
        operationRules: [
          '代替担当への負担偏りを週次で点検する',
          '引き継ぎ記録は更新責任者を固定する',
        ],
        kpi: ['代替起動から再開までの時間', '引き継ぎ漏れ件数', '周囲負担自己評価'],
        recheckTrigger: '引き継ぎ漏れが月2件を超えたらテンプレート項目を見直す。',
      },
    ],
    lensLogic: {
      occurrence: '治療スケジュールと納期密度の衝突が発生トリガーになりやすい。',
      resolution: '時間制度・代替体制・優先順位調整の3点で改善可能性が上がる。',
      symptomWork: '通院後の疲労や副作用が、当日後半タスクへ遅延影響を与える。',
      supportFormation: '必要支援は治療フェーズに連動し、恒久ではなく可変で設計する必要がある。',
    },
    preconditions: [
      '通院予定と業務ピークの重なりが見える化されている',
      '代替担当・先送り基準が運用で合意されている',
    ],
    failureRisks: [
      '制度だけ作って案件優先ルールを変えないと、現場で形骸化する',
      '本人の開示範囲が未整理のまま運用すると対人摩擦が増える',
    ],
    followUpQuestions: [
      '適用法域（JP/US/EUなど）と雇用区分は何か？',
      '通院直後に難しくなる具体タスクは何か？',
      '既に試した配慮で効いたもの/逆効果だったものは何か？',
    ],
    jurisdictionNotes: [
      '制度根拠は国・地域で異なるため、法域確定前の断定提案は避ける。',
      'この領域は question-first（質問先行）で進める。',
    ],
    evidenceTrace: {
      glm: ['GLM-S4-001', 'GLM-S1-003'],
      claimIds: ['5991a785430975cb', '86f336fb9e05cec8'],
      sourceRegions: ['JP', 'NBL-local'],
    },
  },
  {
    id: 'p-environment-sensory',
    focus: ['environment', 'fatigue'],
    title: '環境刺激が主因: 音・光・温度で症状が悪化する',
    mode: 'conditional_only',
    situation: '感覚刺激が強い環境では、集中低下と疲労増幅が重なり、業務継続性が下がることがある。',
    selectionBoundary:
      '選ぶ目安: 音・光・温度など刺激そのものが主トリガーなら本カード。資料や画面の見え方・読み取り負荷が主因なら「資料アクセス障壁が主因」、音声情報の欠落が主因なら「音声アクセス障壁が主因」を優先。',
    quickBundle: [
      '静音席・照明調整・通知制御をセットで導入する',
      '作業ゾーン（集中/連絡）を分離する',
      '在宅/出社の使い分け基準を業務ごとに定義する',
      '環境調整の効果を2週間単位で測定する',
    ],
    packages: [
      {
        id: 'pkg-sensory-control',
        name: '感覚刺激制御パッケージ',
        goal: '音・光・通知刺激を下げ、集中維持を改善する。',
        components: [
          '静音席/遮光/通知制御を同時導入する',
          '必要に応じて耳栓・ノイズキャンセル機器を許容する',
          '会議室・執務席で刺激量基準を設定する',
        ],
        operationRules: [
          '単一施策で終わらせず、複合導入を前提とする',
          '周囲に運用意図を説明し誤解を防ぐ',
        ],
        kpi: ['集中中断回数', '刺激要因による離席回数', '終業時疲労スコア'],
        recheckTrigger: '刺激要因離席が減らない場合、席配置とタスク設計を同時に見直す。',
      },
      {
        id: 'pkg-zoning',
        name: '作業ゾーニングパッケージ',
        goal: '環境とタスクのミスマッチを減らす。',
        components: [
          '集中ゾーンと連絡ゾーンを分ける',
          '在宅/出社の使い分け基準を業務単位で定義する',
          '高集中時間帯に割込連絡を制限する',
        ],
        operationRules: ['チーム全体でゾーニングルールを共有する', '例外処理手順を先に決める'],
        kpi: ['高集中タスクの完了時間', '割込件数', '業務再開までの平均時間'],
        recheckTrigger: '割込件数が増える場合は例外運用の範囲を再設定する。',
      },
    ],
    lensLogic: {
      occurrence: '刺激量と業務要求が同時に高いと問題発生率が上がる。',
      resolution: '環境因子を可変化できるほど改善余地が広がる。',
      symptomWork: '刺激の累積は疲労回復を遅らせ、翌日以降にも波及する。',
      supportFormation: '必要支援は人によって閾値が異なるため、固定テンプレだけでは不足する。',
    },
    preconditions: [
      '刺激要因（音/光/温度）の特定ができている',
      '座席・設備・勤務形態の調整権限がある',
    ],
    failureRisks: [
      '単一施策（例: イヤホンのみ）では十分な改善にならないことがある',
      '周囲説明なしの個別運用は運用摩擦につながる',
    ],
    followUpQuestions: [
      'どの刺激がどの時間帯に影響するか？',
      '環境変更後に改善を測る指標は何か？',
      '在宅化と現場要件の境界線はどこか？',
    ],
    jurisdictionNotes: [
      '環境調整は多法域で導入しやすいが、費用負担・補助制度は法域依存。',
      '正式制度化する場合は各国の合理的配慮枠組み確認が必要。',
    ],
    evidenceTrace: {
      glm: ['GLM-S3-003', 'GLM-S4-002'],
      claimIds: ['030f6c25bee7e726', '8a704d1bd91c999b'],
      sourceRegions: ['US', 'EU', 'AU'],
    },
  },
  {
    id: 'p-commute-hybrid',
    focus: ['commute', 'medical', 'fatigue'],
    title: '通勤負荷が主因: 始業前消耗で日中稼働が崩れる',
    mode: 'conditional_only',
    situation:
      '混雑・移動時間・気温差が大きいと、業務開始前にエネルギーを消耗し、日中の集中維持が難しくなる。',
    selectionBoundary:
      '選ぶ目安: 主課題が「自宅→職場の移動」で、始業前に消耗して日中稼働が崩れるなら本カード。職場内の段差・歩行距離・移乗負荷が中心なら「動線・移動負荷が主因」、勤務時刻制度の不整合が中心なら「勤務時刻の不整合が主因」を優先。',
    quickBundle: [
      '時差出勤と在宅勤務をタスク単位で使い分ける',
      '出社日は高協働タスク、在宅日は高集中タスクに再編する',
      '遠距離移動・連続出張の回避ルールを明文化する',
      '通勤負荷が高い日の代替KPI（成果基準）を定義する',
    ],
    packages: [
      {
        id: 'pkg-hybrid-routing',
        name: '通勤負荷分散ハイブリッドパッケージ',
        goal: '移動負荷を抑えつつ成果を維持する。',
        components: [
          '時差出勤と在宅勤務をタスク別に割り当てる',
          '出社日は協働タスク、在宅日は集中タスクへ再編する',
          '移動が重い日は業務開始前の高負荷作業を避ける',
        ],
        operationRules: [
          'ハイブリッド対象業務を四半期ごとに棚卸しする',
          '評価は拘束時間より成果基準を優先する',
        ],
        kpi: ['通勤後1時間の生産性指標', '移動要因の欠勤率', 'タスク完了率'],
        recheckTrigger: '通勤後パフォーマンス低下が続く場合、勤務開始時刻を再設計する。',
      },
      {
        id: 'pkg-travel-guard',
        name: '移動制約ガードレールパッケージ',
        goal: '連続移動による症状悪化を予防する。',
        components: [
          '遠距離出張の除外基準を定義する',
          '連続移動日の翌日は回復重視タスクにする',
          '代替参加（オンライン参加）ルールを明文化する',
        ],
        operationRules: [
          '例外承認フローを短くし、無理な出張を防ぐ',
          '業務都合のみで除外基準を崩さない',
        ],
        kpi: ['連続移動後の体調悪化報告件数', '出張代替実施率', '翌日欠勤率'],
        recheckTrigger: '悪化報告が続く場合は移動上限と参加方式を再定義する。',
      },
    ],
    lensLogic: {
      occurrence: '通勤負荷が体調管理余力を先に消費し、困難発生確率を上げる。',
      resolution: '勤務形態の可変化で、解決可能性を引き上げられる。',
      symptomWork: '移動負荷は疲労/痛みの悪化と業務効率低下を連動させる。',
      supportFormation: '支援は「在宅可否」だけでなく、業務再配置設計とセットで成立する。',
    },
    preconditions: ['業務を出社必須/非必須に分解できる', '成果評価を時間拘束中心から調整できる'],
    failureRisks: [
      '在宅化だけで業務設計を変えないと、生産性が不安定になる',
      '同僚負担の再設計がないと長期運用しにくい',
    ],
    followUpQuestions: [
      '通勤で最も消耗する要因（距離/混雑/乗換/気温）は何か？',
      '出社必須タスクは本当に必須か？',
      '在宅時の成果確認基準は合意されているか？',
    ],
    jurisdictionNotes: [
      'ハイブリッド運用の制度条件は会社規程・国制度で差が大きい。',
      '補助・助成活用は法域別に別途確認が必要。',
    ],
    evidenceTrace: {
      glm: ['GLM-S1-001', 'GLM-S3-001'],
      claimIds: ['dafcf53e7fe87f2c', 'd9d2a5f228f59eef'],
      sourceRegions: ['JP', 'NBL-local', 'US'],
    },
  },
  {
    id: 'p-disclosure-boundary',
    focus: ['disclosure', 'meeting', 'manager'],
    title: '情報開示の設計不足が主因: 配慮実装とプライバシーが両立しにくい',
    mode: 'questions_first',
    situation: '必要配慮の実装には情報共有が必要だが、開示過多はプライバシー侵害リスクを高める。',
    selectionBoundary:
      '選ぶ目安: 主課題が社内運用段階での「共有範囲・共有先・更新責任」の設計なら本カード。採用選考の面接で伝達が詰まるなら「面接時自己説明不足が主因」、定例面談やエスカレーション運用が回らないなら「相談運用の欠如が主因」を優先。',
    quickBundle: [
      '「共有する情報」と「共有しない情報」を二層で定義する',
      '職務遂行に必要な配慮情報だけをチーム共有する',
      '個人情報は管理責任者ルートで限定管理する',
      '定期面談で開示範囲を見直す',
    ],
    packages: [
      {
        id: 'pkg-disclosure-layer',
        name: '開示レイヤー設計パッケージ',
        goal: '配慮実装に必要な情報だけを適切に共有する。',
        components: [
          '共有情報を「業務必要」「本人限定」「管理者限定」に分ける',
          'チーム共有は配慮実施に必要な事実のみとする',
          '同意取得と更新タイミングを明示する',
        ],
        operationRules: ['共有範囲の変更は本人同意を必須にする', '目的外利用を禁止し記録を残す'],
        kpi: ['配慮実装までのリードタイム', '情報共有トラブル件数', '本人納得度'],
        recheckTrigger: 'トラブル発生時は共有範囲とアクセス権限を即時見直す。',
      },
      {
        id: 'pkg-consult-loop',
        name: '面談・見直しループパッケージ',
        goal: '開示と配慮のバランスを継続的に調整する。',
        components: [
          '月次面談で開示範囲と配慮効果を評価する',
          '配慮情報の更新履歴を管理責任者が保持する',
          '異動・業務変更時は再評価を必須化する',
        ],
        operationRules: ['面談未実施を放置しない', '担当者依存を避けて複線管理する'],
        kpi: ['面談実施率', '配慮更新反映率', '再発トラブル率'],
        recheckTrigger: '組織変更や担当変更が起きた時点で再設計する。',
      },
    ],
    lensLogic: {
      occurrence: '開示ルールが曖昧な組織ほど、配慮実装が遅れやすい。',
      resolution: '情報統制の設計（目的・範囲・権限）で解決可能性が上がる。',
      symptomWork: '不必要な開示不安は心理的負荷を高め、業務維持に影響する。',
      supportFormation: '必要支援は「全部開示」でも「全部非開示」でもなく、目的限定で形成される。',
    },
    preconditions: [
      '情報共有ポリシーと責任者が定義されている',
      '現場が目的限定の情報共有ルールを運用できる',
    ],
    failureRisks: [
      '開示を本人任せにしすぎると配慮が実装されない',
      '逆に過剰開示すると信頼損失と二次被害が起きる',
    ],
    followUpQuestions: [
      '配慮実装に必須な情報は何で、不要な情報は何か？',
      'どの役割まで共有する必要があるか？',
      '本人同意と見直しタイミングをどう設計するか？',
    ],
    jurisdictionNotes: [
      '個人情報・雇用配慮は法域差が大きいため、運用前に制度確認が必要。',
      'この領域は question-first を原則に、断定運用を避ける。',
    ],
    evidenceTrace: {
      glm: ['GLM-S4-001', 'GLM-S2-001'],
      claimIds: ['39c93a1d04fe9955', 'd2f92a0d8af18ab3'],
      sourceRegions: ['JP', 'UK', 'CA'],
    },
  },
  {
    id: 'p-return-to-work-ramp',
    focus: ['return', 'medical', 'manager'],
    title: '復職初期の負荷復帰が主因: 早戻しで再不調が起きやすい',
    mode: 'questions_first',
    situation:
      '復職初期は「できる業務」と「継続できる業務」が一致しないことが多く、段階設計がないと再不調が起きやすい。',
    selectionBoundary:
      '選ぶ目安: 休職・病休からの復帰初期（目安4〜12週）で、負荷を段階的に戻す設計が主課題なら本カード。通常運用期の悪化兆候対応が主課題なら「悪化前対応の欠如が主因」、日々の体調波全般の配分調整が主課題なら「体調変動が主因」を優先。',
    quickBundle: [
      '復職初月は段階負荷（例: 60%→80%→100%）で設定する',
      '体調・勤務・業務進捗を同じシートで見える化する',
      '復職面談を週次で実施し、配慮を微調整する',
      '支援機関・産業保健との連携窓口を固定する',
    ],
    packages: [
      {
        id: 'pkg-return-ramp',
        name: '段階復職ランプパッケージ',
        goal: '復職初期の再不調リスクを下げ、定着確率を上げる。',
        components: [
          '週単位で業務負荷上限を設定する',
          '復職後4週間は週次面談を固定する',
          '症状悪化時の即時調整ルールを明示する',
        ],
        operationRules: [
          '短期の生産性低下を許容し長期安定を優先する',
          '面談結果を業務計画に反映する責任者を定める',
        ],
        kpi: ['復職後8週間の継続率', '再不調による離脱件数', '計画負荷遵守率'],
        recheckTrigger: '欠勤・早退が増加した場合、負荷段階を一段戻して再設計する。',
      },
      {
        id: 'pkg-return-bridge',
        name: '支援連携ブリッジパッケージ',
        goal: '職場外支援と職場運用を接続し、情報断絶を防ぐ。',
        components: [
          '支援機関/産業保健/現場責任者の連絡窓口を一本化する',
          '共有情報を目的限定で定義する',
          '月次で連携評価会を実施する',
        ],
        operationRules: [
          '本人同意範囲を超える共有をしない',
          '共有は配慮実装に必要な最小限に留める',
        ],
        kpi: ['連携会実施率', '情報連携遅延件数', '配慮反映までの日数'],
        recheckTrigger: '連携遅延が続く場合は窓口設計を再編する。',
      },
    ],
    lensLogic: {
      occurrence: '復職初期に旧来負荷へ戻すと困難発生率が上がる。',
      resolution: '段階負荷と週次調整により解決可能性を高められる。',
      symptomWork: '回復途中の症状は負荷変化に敏感で、遅延悪化しやすい。',
      supportFormation: '必要支援は復職フェーズごとに変化する。',
    },
    preconditions: ['復職計画の合意がある', '調整責任者と面談スケジュールが確定している'],
    failureRisks: [
      '本人の一時的回復を恒常能力と誤認すると再不調につながる',
      '面談だけで業務計画を変えないと実質改善しない',
    ],
    followUpQuestions: [
      '復職初期に崩れやすいタスクは何か？',
      '負荷を戻す判断基準はどの指標か？',
      '連携先（支援機関/産業保健）の役割分担は明確か？',
    ],
    jurisdictionNotes: [
      '復職運用は企業制度・法域差が大きいため、制度根拠を先に確認する。',
      'この領域は questions-first を原則とする。',
    ],
    evidenceTrace: {
      glm: ['GLM-S2-001', 'GLM-S4-001'],
      claimIds: ['1bc1228c08504dbb', '3dfea629344d20c3'],
      sourceRegions: ['JP', 'NBL-local'],
    },
  },
  {
    id: 'p-shift-rhythm-guard',
    focus: ['fatigue', 'medical', 'return'],
    title: '勤務時刻の不整合が主因: 生活・服薬リズムが崩れる',
    mode: 'conditional_only',
    situation:
      '早出・遅出・交代制勤務や連続残業があると、睡眠・服薬・通院リズムが崩れやすく、症状悪化を引き起こしやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が早出・遅出・連勤など「勤務時刻制度」と症状リズムの不整合なら本カード。受診日・受診時刻の衝突が中心なら「通院日程の衝突が主因」、日ごとの負荷配分が中心なら「体調変動が主因」を優先。',
    quickBundle: [
      '固定シフト優先と残業上限の設定',
      '夜勤・連続勤務の除外条件を明文化',
      'セルフチェック（睡眠/体調）を日次で記録',
      '体調指標に応じて勤務時間を段階調整',
    ],
    packages: [
      {
        id: 'pkg-rhythm-protect',
        name: '生活リズム保護パッケージ',
        goal: '勤務設計で症状悪化トリガーを減らす。',
        components: [
          '固定シフトを基本とし、急な時刻変更を抑える',
          '残業・夜勤の上限ルールを設定する',
          '睡眠・体調のセルフチェックを運用する',
        ],
        operationRules: ['シフト変更時は本人確認を必須化する', '業務都合による例外を乱用しない'],
        kpi: ['睡眠不足日数', '体調悪化報告件数', 'シフト逸脱件数'],
        recheckTrigger: '体調悪化報告が増えた週はシフト設計を即時見直す。',
      },
      {
        id: 'pkg-shift-fallback',
        name: '勤務形態フォールバックパッケージ',
        goal: '悪化兆候が出た時に勤務を安全側へ切り替える。',
        components: [
          '悪化サイン時の短時間勤務ルールを事前定義する',
          '業務引き継ぎ先を先に決める',
          '回復後の復帰ステップを明文化する',
        ],
        operationRules: ['本人申告の遅れを責めない', 'フォールバック適用記録を残す'],
        kpi: ['フォールバック起動時間', '復帰までの日数', '再悪化率'],
        recheckTrigger: '再悪化が続く場合は基本勤務設計を再定義する。',
      },
    ],
    lensLogic: {
      occurrence: '生活リズム不整合は困難発生の基礎リスクを上げる。',
      resolution: '勤務時間設計の柔軟性が解決可能性を左右する。',
      symptomWork: '睡眠不足・不規則勤務は症状悪化を誘発しやすい。',
      supportFormation: '必要支援は勤務形態と体調データの組合せで形成される。',
    },
    preconditions: ['シフト編成権限がある', '体調記録の運用が受け入れられている'],
    failureRisks: [
      '例外運用の常態化でルールが形骸化する',
      'データ記録だけで勤務を調整しないと効果が出ない',
    ],
    followUpQuestions: [
      'どの勤務帯で悪化しやすいか？',
      '夜勤・残業の代替手段はあるか？',
      '悪化兆候の閾値をどう定義するか？',
    ],
    jurisdictionNotes: ['労働時間制度は法域差が大きいため、制度整合を確認して運用する。'],
    evidenceTrace: {
      glm: ['GLM-S3-001', 'GLM-S1-003'],
      claimIds: ['344f20a67c246bb1', '9823aa9bed509b53'],
      sourceRegions: ['JP'],
    },
  },
  {
    id: 'p-manager-checkin',
    focus: ['manager', 'disclosure', 'return'],
    title: '相談運用の欠如が主因: 配慮が単発で定着しない',
    mode: 'conditional_only',
    situation: '相談窓口が曖昧だと、困りごとが蓄積してから顕在化し、調整が後手になりやすい。',
    selectionBoundary:
      '選ぶ目安: 定期面談・エスカレーション・更新責任がなく配慮運用が続かないなら本カード。開示範囲の判断が主課題なら「情報開示の設計不足が主因」を優先。',
    quickBundle: [
      '相談窓口を固定し、週次チェックインを定例化する',
      '本人申告が苦手でも拾える声かけ運用を設計する',
      '現場→人事→支援機関のエスカレーション経路を明文化する',
      '相談内容を業務設計変更に反映する運用責任者を置く',
    ],
    packages: [
      {
        id: 'pkg-checkin-loop',
        name: 'チェックイン定着パッケージ',
        goal: '問題を早期検知し、配慮の微調整を継続する。',
        components: [
          '週次15分チェックインを固定化する',
          '相談項目テンプレート（体調/業務/環境）を使う',
          '未対応項目に期限と責任者を設定する',
        ],
        operationRules: [
          '単なる傾聴で終わらせず、次アクションを必ず決める',
          '申告しづらい人向けに代替入力手段を用意する',
        ],
        kpi: ['相談実施率', '未対応項目滞留日数', '配慮更新件数'],
        recheckTrigger: '未対応滞留が増えた場合は会議体と責任分担を再設計する。',
      },
      {
        id: 'pkg-escalation-map',
        name: '支援連携エスカレーションパッケージ',
        goal: '現場だけで抱え込まない運用を作る。',
        components: [
          'エスカレーション条件を明文化する',
          '人事・産業保健・支援機関の接続点を定義する',
          '連携結果を現場運用へ戻す',
        ],
        operationRules: ['目的外共有をしない', '連携結果を現場で実装したか確認する'],
        kpi: ['エスカレーション適時率', '連携後の再発率', '現場納得度'],
        recheckTrigger: '再発率が下がらない場合は連携プロトコルを改定する。',
      },
    ],
    lensLogic: {
      occurrence: '相談導線の不在は問題発生の見逃しを増やす。',
      resolution: '定期チェックと責任分担が解決可能性を押し上げる。',
      symptomWork: '早期調整がないと心理的負荷が蓄積しやすい。',
      supportFormation: '必要支援は対話ループの質で形成される。',
    },
    preconditions: ['相談窓口の担当が明確', '業務変更権限を持つ管理者が関与できる'],
    failureRisks: ['相談だけ増えて実装が伴わない', '担当者依存で運用継続性が落ちる'],
    followUpQuestions: [
      '現在の相談導線は誰が担っているか？',
      '相談内容が業務変更へ反映されるまでの遅延は何日か？',
      '連携先へのエスカレーション条件は明確か？',
    ],
    jurisdictionNotes: [
      '個人情報取り扱いは法域ごとに要件が異なるため、共有範囲を目的限定で設計する。',
    ],
    evidenceTrace: {
      glm: ['GLM-S4-001', 'GLM-S2-002'],
      claimIds: ['c496569b9ed0b484', 'bc5b77049ad3cbbd'],
      sourceRegions: ['JP', 'NBL-local'],
    },
  },
  {
    id: 'p-customer-facing-load',
    focus: ['customer', 'meeting', 'fatigue'],
    title: '対人即時応答負荷が主因: 接客場面でミスと疲労が増える',
    mode: 'conditional_only',
    situation:
      '即時応答が続く接客・対人場面では、情報処理負荷が高まり、伝達ミスや消耗が発生しやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が顧客・外部対応での即時応答、感情労働、対人切替なら本カード。音声取得不足（聞き取り・字幕不足）が中心なら「音声アクセス障壁が主因」、記憶保持や段取り保持が中心なら「記憶・遂行機能負荷が主因」、社内会議の同時処理が中心なら「会議同時処理負荷が主因」を優先。',
    quickBundle: [
      '接客タスクを難易度別に分け、段階配置する',
      '問い合わせ引継ぎの定型文・手順を整備する',
      '高密度対人タスクの後に低負荷タスクを挟む',
      '同席サポートやバックアップ担当を配置する',
    ],
    packages: [
      {
        id: 'pkg-customer-tier',
        name: '接客段階配置パッケージ',
        goal: '対人負荷を制御しつつ業務品質を保つ。',
        components: [
          '接客タスクを難易度3段階に分類する',
          '初期は低〜中負荷中心で配置する',
          '慣熟に応じて段階的に範囲を拡大する',
        ],
        operationRules: ['配置変更の判断基準を本人と共有する', '急な拡大をしない'],
        kpi: ['接客ミス率', '引継ぎ成功率', '対人タスク後の疲労評価'],
        recheckTrigger: 'ミス率上昇時は配置段階を一段戻す。',
      },
      {
        id: 'pkg-handover-script',
        name: '引継ぎスクリプトパッケージ',
        goal: '問い合わせ対応の情報欠落を減らす。',
        components: [
          '問い合わせ内容の聞き取りテンプレートを導入する',
          '支援担当への引継ぎ文を定型化する',
          '引継ぎ後の確認ステップを追加する',
        ],
        operationRules: [
          'テンプレート項目は最小限にし現場負荷を増やしすぎない',
          '定期的に文面を改善する',
        ],
        kpi: ['引継ぎ漏れ件数', '再問い合わせ率', '対応時間のばらつき'],
        recheckTrigger: '再問い合わせ率が高止まりした場合、テンプレート項目を改訂する。',
      },
    ],
    lensLogic: {
      occurrence: '即時応答密度が高いほど困難発生率が上がる。',
      resolution: '段階配置と引継ぎ整備で解決可能性が上がる。',
      symptomWork: '対人負荷の蓄積は疲労・不安を増やしやすい。',
      supportFormation: '必要支援は接客難易度と役割分担で形成される。',
    },
    preconditions: ['接客業務を分解できる', 'バックアップ担当を確保できる'],
    failureRisks: [
      '根性論で高難度タスクを続けると再発しやすい',
      '引継ぎが属人化すると品質が不安定になる',
    ],
    followUpQuestions: [
      'どの場面で伝達ミスが起きやすいか？',
      '引継ぎ時に落ちやすい情報は何か？',
      '配置段階を上げる判断基準は明確か？',
    ],
    jurisdictionNotes: [
      '顧客対応品質基準と配慮運用の両立設計が必要。法域差より組織運用差の影響が大きい。',
    ],
    evidenceTrace: {
      glm: ['GLM-S3-002', 'GLM-S1-001'],
      claimIds: ['f4017c880a1efc84', '359cb8a8ce6dda40'],
      sourceRegions: ['JP', 'US'],
    },
  },
  {
    id: 'p-visual-document-access',
    focus: ['environment', 'meeting'],
    title: '視覚アクセス障壁が主因: 資料・画面処理で速度が落ちる',
    mode: 'conditional_only',
    situation:
      '文字サイズ・配色・PDF構造・図表の複雑さが重なると、読み取り負荷が蓄積し、会議理解や文書作業が遅れやすい。',
    selectionBoundary:
      '選ぶ目安: 文字サイズ・配色・PDF構造など視覚入力の難しさが主因なら本カード。刺激過敏が主因なら「環境刺激が主因」を優先。',
    quickBundle: [
      '資料を事前配布し、当日は意思決定論点だけ確認する',
      'テキスト版・高コントラスト版・拡大版の提供ルールを固定する',
      '読み上げ対応ツール前提で資料テンプレートを統一する',
    ],
    packages: [
      {
        id: 'pkg-visual-format-standard',
        name: '文書アクセシビリティ標準化パッケージ',
        goal: '資料アクセスの再現性を高め、読み取り負荷を下げる。',
        components: [
          '配布資料をテキスト抽出可能な形式に統一する',
          'フォントサイズ・配色・見出し階層の基準を定義する',
          '表・図は代替説明を必須にする',
        ],
        operationRules: [
          '全社テンプレートとして運用し、個人依存にしない',
          '例外資料は事前レビューする',
        ],
        kpi: ['資料再配布依頼件数', '会議内理解確認回数', '文書読解時間'],
        recheckTrigger: '読解時間の悪化が続く場合、テンプレート基準を再設計する。',
      },
      {
        id: 'pkg-visual-workflow-support',
        name: '会議・作業の視覚負荷調整パッケージ',
        goal: '高負荷場面での理解遅延と疲労連鎖を防ぐ。',
        components: [
          '会議前配布と議題固定をセット運用する',
          '会議中は要点サマリーを逐次提示する',
          '会議後の回復バッファを標準化する',
        ],
        operationRules: ['短縮だけでなく情報密度を下げる', '要点提示の担当を明確化する'],
        kpi: ['会議後疲労評価', '再説明依頼件数', '意思決定率'],
        recheckTrigger: '会議後疲労が高止まりした場合、会議形式を非同期中心へ再設計する。',
      },
    ],
    lensLogic: {
      occurrence: '視覚情報密度が高いほど困難発生率が上がる。',
      resolution: '資料形式標準化と進行設計で解決可能性が上がる。',
      symptomWork: '読解負荷の蓄積は疲労・誤読・遅延を連鎖させる。',
      supportFormation: '必要支援は個人特性だけでなく資料設計で形成される。',
    },
    preconditions: ['資料作成ルールを決められる', '会議進行を調整できる'],
    failureRisks: ['拡大対応だけで構造を変えないと効果が薄い', '事前配布を徹底しないと再発する'],
    followUpQuestions: [
      'どの資料形式で最も読み取り負荷が高いか？',
      '代替形式の作成責任者は誰か？',
      '会議中の要点提示を誰が担うか？',
    ],
    jurisdictionNotes: [
      '視覚支援の具体手段は法域差より実装差の影響が大きい。調達規程との整合を確認する。',
    ],
    evidenceTrace: {
      glm: ['GLM-S1-001', 'GLM-S3-002'],
      claimIds: ['f5d54482ab79ce81', 'ba76e1ace9190728'],
      sourceRegions: ['US', 'JP'],
    },
  },
  {
    id: 'p-hearing-meeting-access',
    focus: ['meeting', 'environment'],
    title: '音声アクセス障壁が主因: 会議・連絡で聞き取り抜けが起きる',
    mode: 'conditional_only',
    situation: '複数同時発話や雑音環境では、聞き取り情報の欠落が増え、判断遅延や誤解が起きやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が聞き取り・音声情報取得（字幕、文字化、話者特定）の不足なら本カード。対人応答の即時性や感情労働が中心なら「対人即時応答負荷が主因」、記憶保持や段取り維持が中心なら「記憶・遂行機能負荷が主因」を優先。',
    quickBundle: [
      '発話ルール（1人ずつ・要点復唱）を会議運用に組み込む',
      '字幕/議事録/チャット補助を標準化する',
      '緊急連絡にテキスト導線を必ず用意する',
    ],
    packages: [
      {
        id: 'pkg-hearing-meeting-protocol',
        name: '会議プロトコル再設計パッケージ',
        goal: '聞き取り欠落を減らし、合意精度を上げる。',
        components: [
          '同時発話禁止と発話順ルールを設定する',
          '要点を会議中にテキスト化する',
          '会議後即時に議事要点を共有する',
        ],
        operationRules: ['司会者が進行責任を持つ', '会議体ごとに実施率をレビューする'],
        kpi: ['聞き返し回数', '会議後修正依頼件数', '会議満足度'],
        recheckTrigger: '修正依頼が増えた場合、字幕/議事録運用を強化する。',
      },
      {
        id: 'pkg-hearing-async-fallback',
        name: '非同期連絡フォールバックパッケージ',
        goal: '音声依存の連絡を減らし、情報の取りこぼしを防ぐ。',
        components: [
          '重要連絡はテキスト通知を義務化する',
          '問い合わせ対応に定型引継ぎ文を使う',
          '緊急時の代替チャネルを事前合意する',
        ],
        operationRules: ['口頭連絡のみを禁止する', '連絡漏れを個人責任化しない'],
        kpi: ['連絡漏れ件数', '再問い合わせ率', '連絡到達時間'],
        recheckTrigger: '連絡漏れが再発した場合、通知ルール違反を運用監査する。',
      },
    ],
    lensLogic: {
      occurrence: '音声前提の設計ほど情報欠落が発生しやすい。',
      resolution: '会議運用と連絡導線の再設計で解決可能性が上がる。',
      symptomWork: '聞き取り負荷の持続は疲労と不安を増幅しやすい。',
      supportFormation: '必要支援は個人能力でなく情報伝達設計で形成される。',
    },
    preconditions: ['会議運用を変更できる', 'テキスト連絡ツールを利用できる'],
    failureRisks: [
      '議事録作成を任意運用にすると定着しない',
      '緊急連絡の代替導線が未整備だと事故リスクが残る',
    ],
    followUpQuestions: [
      '情報欠落が起きやすい会議はどれか？',
      '字幕・議事録の実装責任は誰か？',
      '緊急連絡のテキスト導線は24時間使えるか？',
    ],
    jurisdictionNotes: [
      '情報保障の実装手段は職場規程とIT環境依存が大きい。個人情報規程を確認する。',
    ],
    evidenceTrace: {
      glm: ['GLM-S3-002', 'GLM-S4-001'],
      claimIds: ['e14dc33068f61857', '5991a785430975cb'],
      sourceRegions: ['JP', 'US'],
    },
  },
  {
    id: 'p-physical-mobility-route',
    focus: ['commute', 'environment'],
    title: '動線・移動負荷が主因: 始業前消耗で稼働が崩れる',
    mode: 'conditional_only',
    situation:
      '通勤や職場内動線に段差・遠回り・移動回数の多さがあると、始業時点で疲労が高まり作業継続が難しくなりやすい。',
    selectionBoundary:
      '選ぶ目安: 段差・歩行距離・移乗など物理移動が主因なら本カード。公共交通混雑や長距離通勤が主因なら「通勤負荷が主因」を優先。',
    quickBundle: [
      '通路・座席・機器配置を移動最小化で再設計する',
      '通勤混雑を避ける時差運用を固定する',
      '移動が多い業務を段階的に再配分する',
    ],
    packages: [
      {
        id: 'pkg-physical-route-redesign',
        name: '動線最適化パッケージ',
        goal: '移動負荷を下げて業務継続性を高める。',
        components: [
          '通路障害物除去と机配置最適化を実施する',
          '頻用機器を手の届く範囲へ再配置する',
          '会議場所を移動負荷の低い場所へ集約する',
        ],
        operationRules: ['レイアウト変更後に現場検証を実施する', '通路確保を恒常運用にする'],
        kpi: ['移動時間', '始業後疲労評価', '移動起因の遅延件数'],
        recheckTrigger: '遅延が再発した場合、動線と業務配置を同時に再調整する。',
      },
      {
        id: 'pkg-physical-commute-buffer',
        name: '通勤バッファ運用パッケージ',
        goal: '通勤負荷の影響を勤務内で吸収する。',
        components: [
          '時差出勤と短時間運用の条件を定義する',
          '始業直後の高負荷タスクを回避する',
          '悪化時のフォールバック勤務を事前合意する',
        ],
        operationRules: ['通勤事情を評価不利益に結びつけない', '運用条件を月次で見直す'],
        kpi: ['無理な早出件数', '欠勤・遅刻件数', '通勤後回復時間'],
        recheckTrigger: '欠勤増加時は通勤条件と勤務時間の双方を再設計する。',
      },
    ],
    lensLogic: {
      occurrence: '移動負荷の高さは困難発生率を押し上げる。',
      resolution: '動線と勤務設計の同時調整で解決可能性が上がる。',
      symptomWork: '始業前消耗が日中の集中低下を引き起こす。',
      supportFormation: '必要支援は身体特性と環境設計の相互作用で形成される。',
    },
    preconditions: ['レイアウト変更権限がある', '勤務時間調整を運用できる'],
    failureRisks: [
      '座席調整だけで通勤負荷を放置すると改善しない',
      '例外運用の属人化で継続性が落ちる',
    ],
    followUpQuestions: [
      '最も消耗する移動区間はどこか？',
      '動線変更で対応できる範囲と設備改修が必要な範囲は？',
      '始業直後に避けるべき業務は何か？',
    ],
    jurisdictionNotes: ['建物改修を伴う場合は施設基準・費用負担の制度確認が必要。'],
    evidenceTrace: {
      glm: ['GLM-S1-003', 'GLM-S3-001'],
      claimIds: ['8a0b2b30b635d3cb', '43eed394e65db39b'],
      sourceRegions: ['JP'],
    },
  },
  {
    id: 'p-safety-critical-operations',
    focus: ['environment', 'manager', 'application'],
    title: '安全クリティカル要件が主因: 危険のある事態への対処で事故リスクが上がる',
    mode: 'questions_first',
    situation:
      '症状変動や感覚負荷がある状態で危険のある事態への対処を担うと、事故リスクと心理的負荷が同時に上がり、就業継続に直結する不安が増えやすい。',
    selectionBoundary:
      '選ぶ目安: 運転・機械操作など事故時影響が大きい業務で安全判定が必要なら本カード。通常業務の疲労調整が中心なら疲労系カードを優先。',
    quickBundle: [
      '危険度の高い業務を先に棚卸しし、実施可否を条件付きで合意する',
      '運転・機械操作は体調チェック通過時のみ実施する運用にする',
      '緊急時連絡・代替担当・停止判断ラインを明文化する',
      'ヒヤリハット記録を個人責任化せず、運用改善に使う',
    ],
    packages: [
      {
        id: 'pkg-safety-task-gating',
        name: '安全クリティカル業務ゲーティング',
        goal: '危険作業を「実施可能条件つき」に再設計し、事故リスクを下げる。',
        components: [
          '業務を低/中/高リスクへ分類し、担当条件を定義する',
          '運転・機械操作の当日チェック（体調/集中/環境）を運用化する',
          '高リスク業務は同僚補助または代替工程をあらかじめ設ける',
        ],
        operationRules: [
          '安全停止判断を現場責任者と本人の双方で発動できるようにする',
          '停止発動を評価不利益に結びつけない',
        ],
        kpi: ['ヒヤリハット件数', '安全停止発動件数', '危険作業の代替運用率'],
        recheckTrigger: 'ヒヤリハットが再発した場合、業務割当と実施条件を即時見直す。',
      },
      {
        id: 'pkg-emergency-response-clarity',
        name: '緊急対応フロー明確化パッケージ',
        goal: '危険事態での判断遅延を防ぎ、現場の安心感を高める。',
        components: [
          '緊急時の連絡順・停止手順・引継ぎ先を1ページ化する',
          '危険個所の表示と回避導線を現場で統一する',
          '月次で短時間のシナリオ確認を行い、フローの形骸化を防ぐ',
        ],
        operationRules: [
          '障害特性の共有は本人同意範囲に限定する',
          '緊急対応訓練は責任追及でなく学習目的で行う',
        ],
        kpi: ['緊急時初動時間', '連絡漏れ件数', '危険個所の是正完了率'],
        recheckTrigger: '初動遅延が増えた場合、連絡フローと担当権限を再定義する。',
      },
    ],
    lensLogic: {
      occurrence: '危険業務と症状変動の重なりが、困難発生率と事故リスクを同時に上げる。',
      resolution: '業務ゲーティングと停止判断ルールの明確化で、解決可能性を高められる。',
      symptomWork: '安全不安は緊張と疲労を増幅し、判断精度を下げる連鎖を作りやすい。',
      supportFormation: '必要支援は能力不足ではなく、業務危険度と運用設計の相互作用で形成される。',
    },
    preconditions: [
      '危険作業の棚卸しができる',
      '停止判断を受け入れる職場運用がある',
      '代替担当の調整権限がある',
    ],
    failureRisks: [
      '安全基準を曖昧にしたまま現場判断へ丸投げすると事故リスクが残る',
      '本人だけに自己管理責任を寄せると再発時に相談遅延が起きる',
    ],
    followUpQuestions: [
      '事故・ヒヤリハットが起きやすい具体業務は何か？',
      '当日中止判断を誰がどの条件で出せるか？',
      '代替担当へ切替える際の手順は何分で実行できるか？',
    ],
    jurisdictionNotes: [
      '安全衛生規程・運転資格・機械操作ルールは法域や業種で異なるため、制度確認を先に行う。',
      '安全配慮は合理的配慮と労働安全の両面で整理する。',
    ],
    evidenceTrace: {
      glm: [],
      claimIds: ['29bd9fb0c5653dfc', '606dafd6990bbf1f', '44f21dbdfdbafdd8'],
      sourceRegions: ['JP'],
    },
  },
  {
    id: 'p-internal-treatment-compatibility',
    focus: ['medical', 'return'],
    title: '回復時間不足が主因: 定期治療の回復リズムと業務密度が衝突する',
    mode: 'questions_first',
    situation:
      '主課題が「治療後・服薬後の回復時間の不足」にある場合のカード。定期治療の回復を無視して業務密度を維持すると、欠勤・再悪化・離脱が起きやすい。',
    selectionBoundary:
      '選ぶ目安: 回復時間の確保や業務密度の再設計が中心なら本カード。通院日程の当て込みが中心なら「通院日程の衝突が主因」カードを優先。定期治療でも、回復遅延が主問題でない限りは通院日程カードを先に見る。',
    quickBundle: [
      '治療日を前提に業務密度を週単位で設計する',
      '不可業務帯を先に定義し、代替担当を確保する',
      '再悪化サイン時の勤務フォールバックを明文化する',
    ],
    packages: [
      {
        id: 'pkg-internal-treatment-calendar',
        name: '治療両立カレンダーパッケージ',
        goal: '治療継続と業務継続を同時に成立させる。',
        components: [
          '治療スケジュールを前提に週次計画を作る',
          '高負荷タスクを回復時間帯から外す',
          '中間締切を設定して負荷集中を回避する',
        ],
        operationRules: ['治療情報の共有範囲は目的限定にする', '計画逸脱時は即週次で再設計する'],
        kpi: ['治療欠席件数', '納期遅延件数', '再悪化による離脱件数'],
        recheckTrigger: '治療欠席や再悪化が発生したら業務量を一段階下げる。',
      },
      {
        id: 'pkg-internal-fallback',
        name: '再悪化フォールバックパッケージ',
        goal: '悪化時の業務停止を最小化し安全に継続する。',
        components: [
          '悪化兆候時の短時間勤務ルールを定義する',
          '代替担当・引継ぎ手順を文書化する',
          '復帰ステップを段階化する',
        ],
        operationRules: ['フォールバック発動を不利益評価しない', '発動履歴を次月計画へ反映する'],
        kpi: ['フォールバック起動時間', '復帰までの日数', '再悪化率'],
        recheckTrigger: '再悪化率が高止まりした場合は基本勤務設計を再定義する。',
      },
    ],
    lensLogic: {
      occurrence: '治療リズム不整合は困難発生率を高める。',
      resolution: '業務設計を治療前提へ切り替えると解決可能性が上がる。',
      symptomWork: '無理な勤務は症状悪化を遅延的に増幅する。',
      supportFormation: '必要支援は治療条件と業務要件の接続で形成される。',
    },
    preconditions: ['治療スケジュールの共有同意がある', '業務再配分できる体制がある'],
    failureRisks: ['通常勤務復帰を急ぐと再悪化しやすい', '代替担当が未定義だと運用が破綻する'],
    followUpQuestions: [
      '不可業務帯と回復時間帯はどこか？',
      '悪化兆候の判定基準は何か？',
      '代替担当の権限と引継ぎ時間を確保できるか？',
    ],
    jurisdictionNotes: [
      '治療情報の取扱いと勤務配慮は法域差が大きいため、制度要件を確認して運用する。',
    ],
    evidenceTrace: {
      glm: ['GLM-S2-001', 'GLM-S3-001'],
      claimIds: ['dafcf53e7fe87f2c', '22c0eb0a0e7a1aa6'],
      sourceRegions: ['JP', 'NBL-local'],
    },
  },
  {
    id: 'p-intellectual-task-clarity',
    focus: ['manager', 'meeting'],
    title: '指示の曖昧さが主因: 作業再現性が下がる',
    mode: 'conditional_only',
    situation:
      '指示が抽象的なままだと、優先順位や完了条件が不明確になり、ミスとやり直しが増えやすい。',
    selectionBoundary:
      '選ぶ目安: 完了条件・優先順位・手順の曖昧さが主因なら本カード。記憶保持や段取り維持の負荷が主因なら「記憶・遂行機能負荷が主因」を優先。',
    quickBundle: [
      '手順書・見本・チェックリストをセットで提供する',
      '完了条件を具体的に定義して共有する',
      '作業レビューを短い間隔で固定する',
    ],
    packages: [
      {
        id: 'pkg-intellectual-procedure',
        name: '手順明確化パッケージ',
        goal: '作業再現性を高め、ミス再発を減らす。',
        components: [
          '作業をステップ分解し見本を用意する',
          '完了条件をチェックリスト化する',
          '口頭指示を文書で再確認する',
        ],
        operationRules: ['更新履歴を残し手順改定を管理する', '指示のあいまい語を禁止する'],
        kpi: ['やり直し件数', '作業完了時間のばらつき', 'レビュー修正率'],
        recheckTrigger: '修正率が高止まりした場合、手順粒度を再調整する。',
      },
      {
        id: 'pkg-intellectual-review-loop',
        name: '短サイクル確認パッケージ',
        goal: '問題を後工程でなく早期に検知する。',
        components: [
          '日次または半日で進捗確認を行う',
          '困りごとの申告テンプレートを用意する',
          '優先順位の変更を即時共有する',
        ],
        operationRules: ['叱責ではなく修正支援を前提にする', '確認会を省略しない'],
        kpi: ['確認会実施率', '後工程差戻し件数', '自己申告件数'],
        recheckTrigger: '後工程差戻しが増えた場合、確認頻度を上げる。',
      },
    ],
    lensLogic: {
      occurrence: '手順曖昧性が高いほど困難発生率が上がる。',
      resolution: '作業分解と完了条件明示で解決可能性が上がる。',
      symptomWork: '混乱状態の継続は不安と疲労を増やしやすい。',
      supportFormation: '必要支援は指示設計と確認運用で形成される。',
    },
    preconditions: ['手順書更新を運用できる', 'レビュー時間を確保できる'],
    failureRisks: ['手順書を作っても更新しないと陳腐化する', '確認会を省略すると再発する'],
    followUpQuestions: [
      '曖昧な指示が出やすい工程はどこか？',
      '完了条件の定義は共有されているか？',
      'レビュー頻度を維持できる体制か？',
    ],
    jurisdictionNotes: ['評価制度との整合が必要。合理的配慮としての記録方法を事前に決める。'],
    evidenceTrace: {
      glm: ['GLM-S4-001', 'GLM-S1-001'],
      claimIds: ['d00ce88a080f6988', '586cd24eb3be5902'],
      sourceRegions: ['JP'],
    },
  },
  {
    id: 'p-developmental-switch-load',
    focus: ['meeting', 'fatigue'],
    title: 'タスク切替過多が主因: 認知負荷が急上昇する',
    mode: 'conditional_only',
    situation: '頻繁な割込みや同時並行が続くと、切替コストが高まり、エラーと疲労が増えやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が割込み・同時並行・頻繁切替（タスクスイッチ）なら本カード。会議内での聞く/読む/即答の同時処理が中心なら「会議同時処理負荷が主因」、記憶保持や手順保持の困難が中心なら「記憶・遂行機能負荷が主因」を優先。',
    quickBundle: [
      'WIP制限で同時進行数を減らす',
      '割込み対応時間帯を固定する',
      '感覚過敏対策を含めた作業環境調整を行う',
    ],
    packages: [
      {
        id: 'pkg-developmental-switch-guard',
        name: '切替負荷ガードパッケージ',
        goal: '割込み密度を制御し作業品質を安定化する。',
        components: [
          '同時進行数に上限を設定する',
          '割込み受付時間帯を明示する',
          '集中ブロック時間を保護する',
        ],
        operationRules: ['上司が割込み調整の最終責任を持つ', '緊急タスク定義を明確化する'],
        kpi: ['割込み件数', '再作業件数', '集中ブロック確保率'],
        recheckTrigger: '再作業増加時はWIP上限を引き下げる。',
      },
      {
        id: 'pkg-developmental-sensory',
        name: '感覚負荷調整パッケージ',
        goal: '感覚過敏と認知負荷の重なりを減らす。',
        components: [
          '音・光刺激の低い席へ配置する',
          '通知制御ルールを定義する',
          '必要に応じて耳栓・サングラス等を許可する',
        ],
        operationRules: [
          '安全上必要な通知は別導線で担保する',
          '個人の嗜好ではなく業務影響で判断する',
        ],
        kpi: ['刺激起因の中断件数', '疲労評価', '作業完了率'],
        recheckTrigger: '中断件数が減らない場合は席配置と通知設計を再調整する。',
      },
    ],
    lensLogic: {
      occurrence: '割込み密度が高いほど困難発生率が上がる。',
      resolution: '業務設計と環境設計の同時調整で解決可能性が上がる。',
      symptomWork: '感覚負荷と切替負荷の重なりは疲労を急増させる。',
      supportFormation: '必要支援は認知特性と業務構造の相互作用で形成される。',
    },
    preconditions: ['業務優先順位を管理できる', '通知・席配置を調整できる'],
    failureRisks: [
      '割込みルールを設けても運用監督がないと崩れる',
      '席配置だけで業務設計を変えないと効果が限定的',
    ],
    followUpQuestions: [
      'どの割込み種別が最も負荷を高めるか？',
      '集中ブロック時間を守る運用責任者は誰か？',
      '感覚刺激対策の優先順位は何か？',
    ],
    jurisdictionNotes: ['安全衛生・就業規程との整合を確認しながら運用する。'],
    evidenceTrace: {
      glm: ['GLM-S3-002', 'GLM-S1-002'],
      claimIds: ['381029c1563399d1', '61e0e7f817a789aa'],
      sourceRegions: ['JP'],
    },
  },
  {
    id: 'p-mental-fluctuation-plan',
    focus: ['manager', 'disclosure', 'fatigue'],
    title: '悪化前対応の欠如が主因: 精神・心理面の症状の波に先手を打てない',
    mode: 'questions_first',
    situation: '悪化兆候の定義や連絡手順がないと、対応が遅れて離脱・長期休職リスクが上がりやすい。',
    selectionBoundary:
      '選ぶ目安: 悪化兆候の定義や連絡・負荷調整手順の不在が主因なら本カード。日常的な体調波全般のペーシング課題が主因なら「体調変動が主因」を優先。',
    quickBundle: [
      '悪化兆候の観測項目を本人と合意する',
      '段階的な負荷調整ルールを先に決める',
      '緊急時の連絡・共有範囲を目的限定で定義する',
    ],
    packages: [
      {
        id: 'pkg-mental-early-sign',
        name: '悪化兆候モニタリングパッケージ',
        goal: '悪化前に調整を発動し、離脱を防ぐ。',
        components: [
          '兆候チェック項目（睡眠/集中/不安等）を定義する',
          '週次チェックインで状態を確認する',
          '兆候閾値超過時の業務調整を即時実行する',
        ],
        operationRules: ['本人同意のない共有をしない', '兆候報告を不利益評価しない'],
        kpi: ['兆候検知から調整までの時間', '再悪化件数', '継続就業率'],
        recheckTrigger: '再悪化が続いた場合、閾値と調整手順を見直す。',
      },
      {
        id: 'pkg-mental-crisis-route',
        name: '緊急時対応ルートパッケージ',
        goal: '緊急時の混乱を防ぎ安全に対応する。',
        components: [
          '緊急連絡先と責任分担を定義する',
          '業務引継ぎ手順を文書化する',
          '回復後の復帰ステップを段階化する',
        ],
        operationRules: ['訓練を年2回以上実施する', '目的外共有を禁止する'],
        kpi: ['緊急時初動時間', '引継ぎ完了率', '復帰後再発率'],
        recheckTrigger: '初動遅延が発生した場合、連絡ルートを再編する。',
      },
    ],
    lensLogic: {
      occurrence: '悪化前運用がないほど困難発生率が上がる。',
      resolution: '兆候定義と段階調整で解決可能性が上がる。',
      symptomWork: '無調整の高負荷継続は症状悪化を誘発しやすい。',
      supportFormation: '必要支援は症状波と職場運用の相互作用で形成される。',
    },
    preconditions: ['相談窓口と責任者が明確', '緊急時ルートを運用できる'],
    failureRisks: [
      '兆候を本人任せにすると検知遅延が起きる',
      '緊急手順を文書化しても訓練しないと機能しない',
    ],
    followUpQuestions: [
      '初期悪化サインは何で、誰が確認するか？',
      '段階調整の発動条件は定義済みか？',
      '緊急連絡時の共有範囲は目的限定になっているか？',
    ],
    jurisdictionNotes: [
      'メンタル情報の扱いは法域差が大きい。個人情報・労務規程との整合を確認する。',
    ],
    evidenceTrace: {
      glm: ['GLM-S2-002', 'GLM-S4-001'],
      claimIds: ['5991a785430975cb', '0298f63dee1f65a5'],
      sourceRegions: ['JP'],
    },
  },
  {
    id: 'p-higher-brain-memory-support',
    focus: ['manager', 'meeting', 'fatigue'],
    title: '記憶・遂行機能負荷が主因: 業務が分断され手戻りが増える',
    mode: 'questions_first',
    situation:
      '記憶保持や段取り負荷が高い業務を連続で求めると、タスク抜け・手戻り・疲労の連鎖が起きやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が記憶保持・段取り維持・実行機能（作業記憶）の負荷なら本カード。割込みや同時並行の切替負荷が中心なら「タスク切替過多が主因」、音声情報取得の不足が中心なら「音声アクセス障壁が主因」、指示内容そのものの曖昧さが中心なら「指示の曖昧さが主因」を優先。',
    quickBundle: [
      '工程を短い単位に分割し、確認ポイントを増やす',
      '記録支援（チェックリスト・テンプレート）を標準化する',
      '復帰時は段階的に業務範囲を拡張する',
    ],
    packages: [
      {
        id: 'pkg-higher-brain-memory-aid',
        name: '記録・記憶補助パッケージ',
        goal: 'タスク抜けを減らし、再現性を確保する。',
        components: [
          'タスクチェックリストを工程ごとに用意する',
          '定型入力テンプレートを導入する',
          '引継ぎ時に確認項目を固定する',
        ],
        operationRules: ['テンプレート改定を月次で行う', '口頭指示のみ運用を禁止する'],
        kpi: ['タスク漏れ件数', '再作業件数', '引継ぎ不備件数'],
        recheckTrigger: 'タスク漏れが増えた場合、工程分解粒度を細かくする。',
      },
      {
        id: 'pkg-higher-brain-phased-load',
        name: '段階負荷調整パッケージ',
        goal: '復職・再立上げ時の過負荷を防ぐ。',
        components: [
          '業務範囲を段階設定（低→中→高）する',
          '週次で実行可能量を再評価する',
          '過負荷兆候時に一段戻すルールを定義する',
        ],
        operationRules: ['短期生産性より継続性を優先する', '評価基準を事前合意する'],
        kpi: ['段階維持率', '再調整発動件数', '継続就業率'],
        recheckTrigger: '再調整が多発する場合、段階幅を小さく再設計する。',
      },
    ],
    lensLogic: {
      occurrence: '記憶・遂行負荷の高密度化で困難発生率が上がる。',
      resolution: '工程分解と段階負荷で解決可能性が上がる。',
      symptomWork: '過負荷は疲労と混乱を増幅しやすい。',
      supportFormation: '必要支援は機能特性と業務構造の相互作用で形成される。',
    },
    preconditions: ['工程分解の時間を確保できる', '段階運用に同意がある'],
    failureRisks: [
      '復帰初期に旧負荷へ戻すと再不調が起きやすい',
      '記録運用を省略すると効果が持続しない',
    ],
    followUpQuestions: [
      'どの工程で記憶負荷が急上昇するか？',
      'テンプレート運用を誰が監督するか？',
      '段階引き上げの判定指標は何か？',
    ],
    jurisdictionNotes: ['復職配慮と評価運用の整合が必要。制度根拠は法域ごとに確認する。'],
    evidenceTrace: {
      glm: ['GLM-S2-001', 'GLM-S1-001'],
      claimIds: ['05a011984aba0e1b', '9a810f34c89b02b2'],
      sourceRegions: ['US', 'JP'],
    },
  },
  {
    id: 'p-jobmatch-exploration',
    focus: ['career', 'jobsearch'],
    title: '職務マッチング不足が主因: 応募前の探索が止まる',
    mode: 'conditional_only',
    situation: '求人情報の読み解きと自己理解が噛み合わないと、応募前段階で迷いが長期化しやすい。',
    selectionBoundary:
      '選ぶ目安: 応募前の職種選定・自己理解・求人読み解きで止まるなら本カード。応募連絡や書類実務で止まるなら「応募実務の詰まりが主因」を優先。',
    quickBundle: [
      '業務要件を「必須/調整可」に分解して適合度を可視化する',
      '強み・制約・必要配慮を1ページの探索シートに統合する',
      '週次で探索対象を3件に絞って検証する',
    ],
    packages: [
      {
        id: 'pkg-jobmatch-map',
        name: '職業探索マッピングパッケージ',
        goal: '探索を感覚でなく検証サイクルで進める。',
        components: [
          '求人票の要件を必須条件/調整可能条件で分解する',
          '本人の強み・制約・希望条件を同じシートで突合する',
          '週次で仮説職種を更新し、探索対象を再優先する',
        ],
        operationRules: [
          '検討対象を同時に増やしすぎない',
          '支援者とのレビューで判断を固定化しない',
        ],
        kpi: ['応募候補の確定件数', '探索停滞週数', '求人適合度スコア'],
        recheckTrigger: '2週連続で候補が0件なら、条件優先順位を再定義する。',
      },
    ],
    lensLogic: {
      occurrence: '自己理解と求人理解が分断すると困難が発生しやすい。',
      resolution: '業務要件の分解と比較で解決可能性が上がる。',
      symptomWork: '探索停滞は不安と回避行動を増やしやすい。',
      supportFormation: '必要支援は探索フェーズでの情報整理設計として形成される。',
    },
    preconditions: ['本人の希望条件を言語化できる', '求人要件をレビューする時間が確保できる'],
    failureRisks: [
      '抽象的な自己分析だけで終わると応募に進めない',
      '求人票の表面的一致だけで判断するとミスマッチが増える',
    ],
    followUpQuestions: [
      '希望職種の必須要件で最も障壁になる項目は何か？',
      '調整可能条件として交渉できる余地はどこか？',
      '探索レビューを誰とどの頻度で回すか？',
    ],
    jurisdictionNotes: ['求人表示・募集要件の扱いは法域差があるため、差別的要件の確認を行う。'],
    evidenceTrace: {
      glm: ['GLM-S2-002', 'GLM-S1-001'],
      claimIds: ['d9d2a5f228f59eef', '627977e3fd538fe0'],
      sourceRegions: ['JP', 'US'],
    },
  },
  {
    id: 'p-application-contact-flow',
    focus: ['jobsearch', 'application'],
    title: '応募実務の詰まりが主因: 連絡・書類準備で機会損失が起きる',
    mode: 'conditional_only',
    situation: '応募手順が曖昧なままだと、連絡遅延や書類不備でチャンスを逃しやすい。',
    selectionBoundary:
      '選ぶ目安: 応募連絡・書類作成・提出管理の実務停滞が主因なら本カード。応募前の職種探索が主因なら「職務マッチング不足が主因」、面接伝達が主因なら「面接時自己説明不足が主因」を優先。',
    quickBundle: [
      '応募手順を「連絡→書類→送付→追跡」の固定フロー化',
      '履歴書・職務経歴書を役割別テンプレートで管理',
      '応募後48時間以内のフォロー連絡を運用ルール化',
    ],
    packages: [
      {
        id: 'pkg-application-flow',
        name: '応募実行フローパッケージ',
        goal: '応募行動を止めず、再現可能にする。',
        components: [
          '応募先管理表と締切アラートを運用する',
          '書類テンプレートを職種別に用意する',
          '送付前チェック項目を固定化する',
        ],
        operationRules: [
          '1回の応募でテンプレートを必ず更新する',
          '期限前日に再確認する運用を省略しない',
        ],
        kpi: ['応募完了件数', '書類差戻し件数', '応募から返信までの日数'],
        recheckTrigger: '差戻しが2件続いたらテンプレート構成を見直す。',
      },
    ],
    lensLogic: {
      occurrence: '応募行動の工程未整備で困難発生率が上がる。',
      resolution: '手順標準化で解決可能性が上がる。',
      symptomWork: '締切直前の負荷集中が症状悪化を誘発しやすい。',
      supportFormation: '必要支援は応募実務の段取り設計として形成される。',
    },
    preconditions: ['応募対象職種がある程度絞れている', '応募管理表を運用できる'],
    failureRisks: [
      '書類作成支援だけで送付工程を管理しないと止まる',
      '応募数のみを追うと質が落ちる',
    ],
    followUpQuestions: [
      '今止まっている工程は連絡/書類/送付のどこか？',
      '書類差戻しの主因は何か？',
      '応募進捗を誰がレビューするか？',
    ],
    jurisdictionNotes: ['個人情報送付と選考管理の規程に従って運用する。'],
    evidenceTrace: {
      glm: ['GLM-S2-002', 'GLM-S3-002'],
      claimIds: ['39c93a1d04fe9955', '9a810f34c89b02b2'],
      sourceRegions: ['JP', 'US'],
    },
  },
  {
    id: 'p-interview-self-advocacy',
    focus: ['application', 'disclosure'],
    title: '面接時自己説明不足が主因: 必要配慮が誤解される',
    mode: 'questions_first',
    situation: '開示範囲の設計がないと、必要配慮が伝わらないか、過剰開示で不利益を招きやすい。',
    selectionBoundary:
      '選ぶ目安: 主課題が採用選考の面接場面で「必要配慮・働き方条件をどう伝えるか」なら本カード。入社後の社内共有範囲設計が主課題なら「情報開示の設計不足が主因」、応募連絡や書類実務が主課題なら「応募実務の詰まりが主因」を優先。',
    quickBundle: [
      '「伝える事実/伝えない情報」を二層で設計する',
      '配慮要望を業務影響ベースの短文で定型化する',
      '面接想定問答で3パターン練習する',
    ],
    packages: [
      {
        id: 'pkg-self-advocacy-script',
        name: '自己説明スクリプトパッケージ',
        goal: '必要配慮を簡潔かつ誤解なく伝える。',
        components: [
          '症状説明でなく業務影響と対応策を中心に記述する',
          '開示範囲を面接前に合意する',
          '想定質問への回答例を3段階で準備する',
        ],
        operationRules: ['同意外の情報は共有しない', '練習後に表現を毎回改善する'],
        kpi: ['面接後の追加質問件数', '配慮説明の理解度自己評価', '選考継続率'],
        recheckTrigger: '誤解質問が増えた場合、説明文の構造を再設計する。',
      },
    ],
    lensLogic: {
      occurrence: '開示設計不足で誤解リスクが上がる。',
      resolution: '業務影響ベースの伝達で解決可能性が上がる。',
      symptomWork: '面接時の過緊張は説明品質の低下を招きやすい。',
      supportFormation: '必要支援は自己説明準備と面接運用の接続で形成される。',
    },
    preconditions: ['開示範囲について本人意向が確認できている', '想定問答の練習機会がある'],
    failureRisks: [
      '診断名のみ説明すると業務配慮に繋がらない',
      '過剰開示はプライバシー侵害のリスクを高める',
    ],
    followUpQuestions: [
      '面接で必ず伝えるべき業務影響は何か？',
      '共有不要な情報はどこまでか？',
      '面接後のフォロー連絡で補足する内容は何か？',
    ],
    jurisdictionNotes: ['障害情報の取扱いは法域差があるため、募集・採用時の適法性を確認する。'],
    evidenceTrace: {
      glm: ['GLM-S4-001', 'GLM-S2-002'],
      claimIds: ['fa68f0f625761fb6', 'c496569b9ed0b484'],
      sourceRegions: ['JP', 'UK', 'CA'],
    },
  },
  {
    id: 'p-skill-building-path',
    focus: ['career', 'jobsearch'],
    title: '学習順序の不明確さが主因: スキル獲得が実務につながらない',
    mode: 'conditional_only',
    situation: '学習目標が広すぎると、実務に結びつかず離脱しやすい。',
    selectionBoundary:
      '選ぶ目安: 何をどの順で学ぶかの設計不足が主因なら本カード。実習から採用への移行設計が主因なら「実習から採用への橋渡し不足が主因」を優先。',
    quickBundle: [
      '就業要件に直結するスキルを3段階で分解する',
      '訓練と実務タスクを週次で接続する',
      '達成指標を資格ではなく業務再現性で評価する',
    ],
    packages: [
      {
        id: 'pkg-skill-ladder',
        name: 'スキル獲得ラダーパッケージ',
        goal: '学習と就業を接続し、成長を見える化する。',
        components: [
          '必須スキルを入門/実践/運用の3層に分ける',
          '訓練成果を実務課題で検証する',
          '習得確認を短サイクルで実施する',
        ],
        operationRules: ['同時学習テーマを増やしすぎない', '評価軸を都度変更しない'],
        kpi: ['スキル達成率', '実務課題完了率', '訓練継続率'],
        recheckTrigger: '継続率が低下したら学習粒度を再調整する。',
      },
    ],
    lensLogic: {
      occurrence: '学習要件の不明確さが困難発生率を上げる。',
      resolution: '段階化された訓練設計で解決可能性が上がる。',
      symptomWork: '過負荷な学習計画は疲労・意欲低下を招きやすい。',
      supportFormation: '必要支援は訓練と実務評価の往復で形成される。',
    },
    preconditions: ['対象職種が定義されている', '訓練レビューを行う支援者がいる'],
    failureRisks: [
      '資格取得だけを目標化すると実務移行が遅れる',
      '学習計画が固定的すぎると継続しない',
    ],
    followUpQuestions: [
      '最優先で獲得すべきスキルは何か？',
      '実務で検証できる課題は何か？',
      '週次レビューで誰が判定するか？',
    ],
    jurisdictionNotes: ['公的訓練・助成の適用範囲は法域ごとに確認する。'],
    evidenceTrace: {
      glm: ['GLM-S2-002', 'GLM-S1-002'],
      claimIds: ['d2f92a0d8af18ab3', 'd00ce88a080f6988'],
      sourceRegions: ['JP', 'US'],
    },
  },
  {
    id: 'p-worktrial-transition',
    focus: ['application', 'return'],
    title: '実習から採用への橋渡し不足が主因: 定着前に失速する',
    mode: 'questions_first',
    situation: '実習時の評価軸と採用後の運用条件が繋がっていないと、定着に失敗しやすい。',
    selectionBoundary:
      '選ぶ目安: 実習評価を採用後運用に接続できないことが主因なら本カード。応募前後の連絡・書類課題が主因なら「応募実務の詰まりが主因」を優先。',
    quickBundle: [
      '実習段階で本採用後の評価指標を先に合意する',
      '引継ぎ責任者とフォロー面談を固定する',
      '就労初月の負荷上限を事前に設定する',
    ],
    packages: [
      {
        id: 'pkg-transition-bridge',
        name: '実習→採用ブリッジパッケージ',
        goal: '移行ギャップを減らし、初期定着を安定化する。',
        components: [
          '実習評価表に採用後KPIを組み込む',
          '採用後4週間のフォロー面談を固定する',
          '不調時フォールバック手順を明文化する',
        ],
        operationRules: ['実習評価を採用判定だけで終わらせない', '支援機関連携の窓口を一本化する'],
        kpi: ['採用後8週継続率', '初期離脱件数', '面談実施率'],
        recheckTrigger: '初期離脱が発生したら移行条件を再定義する。',
      },
    ],
    lensLogic: {
      occurrence: '移行条件の未整備で困難発生率が上がる。',
      resolution: '移行期の評価軸統合で解決可能性が上がる。',
      symptomWork: '急な負荷増は症状悪化と離脱を誘発しやすい。',
      supportFormation: '必要支援は実習期と採用期の接続設計で形成される。',
    },
    preconditions: ['実習評価が記録されている', '採用側の運用責任者が定義されている'],
    failureRisks: [
      '実習でできたことをそのまま恒常能力とみなすと再不調が起きる',
      '移行後の面談省略で課題が顕在化する',
    ],
    followUpQuestions: [
      '採用後に増える業務負荷は何か？',
      '実習評価のどの項目を採用後KPIに転用するか？',
      '不調時の連絡・代替フローは明確か？',
    ],
    jurisdictionNotes: ['トライアル雇用・実習制度の適用要件は法域/制度で異なるため確認が必要。'],
    evidenceTrace: {
      glm: ['GLM-S2-001', 'GLM-S4-001'],
      claimIds: ['1bc1228c08504dbb', 'bc5b77049ad3cbbd'],
      sourceRegions: ['JP', 'NBL-local'],
    },
  },
  {
    id: 'p-income-condition-stability',
    focus: ['career', 'application'],
    title: '契約・収入条件の不確実性が主因: 就労継続の判断が揺らぐ',
    mode: 'conditional_only',
    situation: '収入・契約条件・働き方の整合が取れないと、就労の意思決定が不安定になりやすい。',
    selectionBoundary:
      '選ぶ目安: 収入見通し・契約条件・働き方の整合が意思決定の主課題なら本カード。制度探索と接続が主課題なら「支援接続設計の不足が主因」を優先。',
    quickBundle: [
      '希望条件を必須/交渉可/受容可の3層に分ける',
      '収入見通しと体調維持可能な稼働量を同時に検証する',
      '初期契約期間の再評価タイミングを明確化する',
    ],
    packages: [
      {
        id: 'pkg-income-stability-design',
        name: '収入・条件安定化パッケージ',
        goal: '条件交渉と継続可能性を両立する。',
        components: [
          '雇用条件シートで譲れない条件を先に明示する',
          '稼働量と体調維持ラインを同時評価する',
          '契約更新前の評価面談を設定する',
        ],
        operationRules: ['短期収入のみで過負荷条件を受けない', '条件変更履歴を記録して再評価する'],
        kpi: ['条件満足度', '契約更新率', '過負荷による欠勤率'],
        recheckTrigger: '欠勤率悪化や満足度低下時は条件優先順位を再交渉する。',
      },
    ],
    lensLogic: {
      occurrence: '条件不整合で困難発生率が上がる。',
      resolution: '条件と稼働量の同時設計で解決可能性が上がる。',
      symptomWork: '過負荷契約は症状悪化と離職リスクを高める。',
      supportFormation: '必要支援は収入要件と健康維持要件の接続で形成される。',
    },
    preconditions: ['希望条件を言語化できる', '雇用側と再評価タイミングを合意できる'],
    failureRisks: [
      '条件交渉を後回しにすると短期離脱が増える',
      '収入優先で体調維持条件を外すと継続性が下がる',
    ],
    followUpQuestions: [
      '最低限守るべき収入・契約条件は何か？',
      '体調維持可能な稼働上限はどこか？',
      '再評価面談の時期と判定者は誰か？',
    ],
    jurisdictionNotes: ['賃金・契約更新・合理的配慮の法的枠組みは法域差があるため確認が必要。'],
    evidenceTrace: {
      glm: ['GLM-S1-001', 'GLM-S2-001'],
      claimIds: ['55b623ad4146f8b9', 'f4017c880a1efc84'],
      sourceRegions: ['JP', 'US', 'CA'],
    },
  },
  {
    id: 'p-support-service-navigation',
    focus: ['career', 'jobsearch', 'application'],
    title: '支援接続設計の不足が主因: 制度が分散し利用につながらない',
    mode: 'questions_first',
    situation: '制度情報が散在していると、必要な支援へ接続できず就労移行が遅れやすい。',
    selectionBoundary:
      '選ぶ目安: 支援制度・相談機関の探索と接続が主課題なら本カード。契約条件や収入設計そのものが主課題なら「契約・収入条件の不確実性が主因」を優先。',
    quickBundle: [
      '支援機関・相談窓口・制度を1枚のルート図に統合する',
      '相談目的ごとに窓口を固定し、重複相談を減らす',
      'ケース会議で次アクションの責任者と期限を確定する',
    ],
    packages: [
      {
        id: 'pkg-service-navigation-map',
        name: '支援導線統合パッケージ',
        goal: '支援資源を使える行動へ変換する。',
        components: [
          '支援制度と窓口を目的別に整理する',
          '相談記録テンプレートを統一する',
          '未完了アクションの期限管理を行う',
        ],
        operationRules: ['同じ相談を複数窓口で繰り返さない', '期限超過時は担当者を再割当する'],
        kpi: ['支援接続完了件数', '相談重複回数', 'アクション期限遵守率'],
        recheckTrigger: '期限遵守率が下がった場合、窓口分担を再整理する。',
      },
    ],
    lensLogic: {
      occurrence: '支援導線の分散で困難発生率が上がる。',
      resolution: '導線統合と責任明確化で解決可能性が上がる。',
      symptomWork: '支援探索の迷走は心理的負荷を増やしやすい。',
      supportFormation: '必要支援は制度知識だけでなく運用導線の設計で形成される。',
    },
    preconditions: ['利用可能な制度一覧を把握できる', '窓口間連携に同意がある'],
    failureRisks: [
      '情報提供だけで行動計画を作らないと接続しない',
      '窓口責任が曖昧だと期限超過が常態化する',
    ],
    followUpQuestions: [
      '直近1か月で止まっている支援手続きは何か？',
      '窓口ごとの役割分担は明確か？',
      '次アクションの期限と責任者は誰か？',
    ],
    jurisdictionNotes: ['制度給付や支援機関の要件は法域・自治体差があるため必ず確認する。'],
    evidenceTrace: {
      glm: ['GLM-S2-002', 'GLM-S4-001'],
      claimIds: ['fa68f0f625761fb6', 'd2f92a0d8af18ab3'],
      sourceRegions: ['JP', 'US', 'AU', 'CA'],
    },
  },
];

const CARD_SITUATION_LEVELS: Record<string, SituationSeverityLevel[]> = {
  'p-meeting-overload': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '会議に出るたび内容取得が崩れ、会議後の判断・記録も止まる。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '長時間会議や同時読解で理解抜けが反復し、午後の業務まで落ちる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '会議の種類や時間を絞れば回るが、資料遅配や即答要求で崩れやすい。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '事前資料・短時間化・非同期補助があり、会議後も通常業務へ戻れる。',
      tone: 'stable',
    },
  ],
  'p-fatigue-pacing': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '数日単位で稼働が崩れ、欠勤や納期断念が出ている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '週の後半や繁忙日に失速が反復し、品質と回復の両方が落ちる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '休憩や業務再配置で持ち直せるが、波に合わせた負荷調整がまだ不十分。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '波を前提に業務量と休憩が組まれ、悪化前に負荷を下げられる。',
      tone: 'stable',
    },
  ],
  'p-medical-schedule': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '通院を優先すると仕事が落ち、仕事を優先すると受診が崩れる。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '受診日と会議・納期が定期的に衝突し、欠勤不安や有給消耗が積み上がる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '通院日の調整で回るが、突発受診や治療ピーク期に運用が崩れやすい。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '受診枠・引継ぎ・前後の負荷調整が固定され、通院が就労継続を壊さない。',
      tone: 'stable',
    },
  ],
  'p-environment-sensory': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '音・光・温度刺激でその場に居続けられず、離席や早退が頻発する。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '刺激の強い時間帯に集中と持続が落ち、ミスや疲労増幅が反復する。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '席替えや通知制御で持つが、会議室や繁忙帯ではまだ消耗が大きい。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '刺激源が把握され、席・通知・働く場所の切替で安定して作業できる。',
      tone: 'stable',
    },
  ],
  'p-commute-hybrid': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '通勤だけでエネルギーを使い切り、始業後すぐに稼働が崩れる。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '混雑や長距離移動の後に集中低下が反復し、出社日だけ成果が落ちる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '時差出勤や在宅でしのげるが、出社必須日の設計がまだ重い。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '出社と在宅の役割分担があり、通勤負荷が成果低下へ直結しない。',
      tone: 'stable',
    },
  ],
  'p-disclosure-boundary': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '必要情報が伝わらず配慮が動かない、または過剰開示で二次被害が出ている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '共有範囲が曖昧で、誰に何を伝えるかが都度ぶれて対人摩擦が起きる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '最低限の共有はできているが、異動や業務変更時の更新ルールが弱い。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '共有目的・共有先・見直し時点が決まり、配慮実装とプライバシーが両立している。',
      tone: 'stable',
    },
  ],
  'p-return-to-work-ramp': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '復職直後に旧負荷へ戻し、再不調や再休職の兆候が出ている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: 'できる日は回るが継続できず、週単位で負荷と回復の噛み合いが悪い。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '段階復帰はあるが、面談や負荷見直しが追いつかず微調整が後手になる。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '負荷段階・面談・戻し条件が明確で、復職初期を安全に越えられている。',
      tone: 'stable',
    },
  ],
  'p-shift-rhythm-guard': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '夜勤・早出・残業で睡眠や服薬が崩れ、勤務継続自体が危うい。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '特定の勤務帯のたびに症状悪化や遅刻・欠勤が反復する。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: 'シフト配慮で持つが、連勤や突発変更が入るとすぐ不安定になる。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '勤務帯の制約とフォールバックが共有され、生活リズムを保って働ける。',
      tone: 'stable',
    },
  ],
  'p-manager-checkin': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '困りごとが溜まってからしか表面化せず、調整がいつも手遅れになる。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '面談はあるが業務変更へつながらず、同じ問題が繰り返し再発する。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '相談導線はあるが、担当者依存で頻度や質にばらつきがある。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '定期チェックインとエスカレーションが機能し、小さな詰まりの段階で直せる。',
      tone: 'stable',
    },
  ],
  'p-customer-facing-load': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '接客や即時応答で混乱が連鎖し、クレームや離席につながっている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '応答が続く場面で伝達ミスと疲労が反復し、後続業務にも影響する。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '難易度調整で回るが、繁忙時間帯や引継ぎ時に負荷が跳ねやすい。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '対人タスクの段階配置と引継ぎ支援があり、接客後も業務を保てる。',
      tone: 'stable',
    },
  ],
  'p-visual-document-access': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '資料が読めず会議判断や文書作業が止まり、参加自体が難しい。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: 'PDFや図表の読み取り負荷で理解遅延が反復し、対応速度が落ちる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '代替形式があれば回るが、事前配布やテンプレ統一が徹底されていない。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: 'テキスト版・拡大版・高コントラスト版が整い、必要な情報へ自力で到達できる。',
      tone: 'stable',
    },
  ],
  'p-hearing-meeting-access': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '複数同時発話や雑音で要点が取れず、重要判断から外れてしまう。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '会議や緊急連絡で聞き取り欠落が反復し、誤解や再確認コストが高い。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '議事録やチャット補助で回るが、即時の口頭連絡ではまだ取りこぼしが出る。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '発話ルールとテキスト導線があり、会議でも緊急時でも情報欠落が少ない。',
      tone: 'stable',
    },
  ],
  'p-physical-mobility-route': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '段差や長距離移動で始業前から消耗し、移動自体が就労継続の壁になっている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '特定の動線や移乗で疲労・痛みが反復し、作業継続時間が短くなる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '座席や通路の調整で持つが、設備や業務配置がまだ移動前提のまま。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '動線・座席・機器配置が最適化され、移動負荷が仕事の主障壁ではない。',
      tone: 'stable',
    },
  ],
  'p-safety-critical-operations': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '危険業務で停止判断が曖昧なまま続けており、事故の切迫リスクがある。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '体調波や感覚負荷と危険作業が重なり、ヒヤリハットや強い不安が反復する。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '条件付きで対応できるが、代替担当や中止ラインがまだ弱い。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '危険作業の条件・停止基準・代替体制が共有され、安全側で運用できる。',
      tone: 'stable',
    },
  ],
  'p-internal-treatment-compatibility': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '治療後の回復時間が取れず、悪化と欠勤が連鎖している。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '治療翌日まで疲労や副作用が残り、業務密度を維持できない状態が続く。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '一部の軽減はあるが、不可業務帯や代替担当が未固定で無理が残る。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '回復時間帯を前提に業務密度が組まれ、治療と仕事がぶつかりにくい。',
      tone: 'stable',
    },
  ],
  'p-intellectual-task-clarity': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '指示の意味や完了条件が分からず、手戻りが連鎖して仕事が止まる。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '抽象指示や優先順位不明でミスが反復し、確認コストが高い。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '手順書があれば回るが、更新不足や工程差で曖昧さが残る。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '手順・見本・完了条件がそろい、迷わず再現できる。',
      tone: 'stable',
    },
  ],
  'p-developmental-switch-load': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '割込みと同時並行で処理が崩れ、重要タスクの完了が維持できない。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '頻繁な切替でエラーや疲労が反復し、集中の立て直しに時間がかかる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: 'WIP制限や時間帯分離で持つが、例外割込みが多いと崩れやすい。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '同時進行数と割込みルールが管理され、集中ブロックを保てる。',
      tone: 'stable',
    },
  ],
  'p-mental-fluctuation-plan': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '悪化兆候を拾えず、離脱や長期休職に直結する局面が出ている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '波のたびに対応が後手になり、負荷調整や共有が追いつかない。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '兆候は見えているが、連絡手順や段階調整が担当者ごとにぶれる。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '初期サインと調整手順が合意され、悪化前に運用を切り替えられる。',
      tone: 'stable',
    },
  ],
  'p-higher-brain-memory-support': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '段取り保持ができず、抜け漏れと手戻りが連鎖して仕事が進まない。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '記憶負荷の高い工程でミスが反復し、再確認と疲労が積み上がる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: 'チェックリストで補えるが、工程分割や復帰支援がまだ不足している。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '工程分割と記録支援が定着し、記憶負荷を抱え込まずに進められる。',
      tone: 'stable',
    },
  ],
  'p-jobmatch-exploration': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '応募先を絞れず探索が止まり、就職活動そのものが前に進まない。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '求人要件と自己理解のずれで応募判断が毎回ぶれ、見送りが続く。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '探索シートがあれば進むが、必須条件と調整可能条件の切分けがまだ粗い。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '職務要件と本人条件の照合軸があり、検証しながら応募先を絞れる。',
      tone: 'stable',
    },
  ],
  'p-application-contact-flow': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '連絡・書類・送付管理が崩れ、応募機会を繰り返し逃している。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '書類不備や返信遅れが反復し、応募のたびに負荷が詰まる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: 'テンプレートで回るが、追跡や締切管理が弱く止まりやすい。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '連絡から追跡までの固定フローがあり、応募実務が安定して回る。',
      tone: 'stable',
    },
  ],
  'p-interview-self-advocacy': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '面接で必要配慮が伝わらず、誤解や不一致のまま選考が進んでしまう。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '伝える範囲が毎回ぶれ、過少説明か過剰開示のどちらかに寄りやすい。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '想定問答があれば話せるが、業務影響ベースの表現がまだ不安定。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '伝える事実と伝えない情報が整理され、短く具体的に説明できる。',
      tone: 'stable',
    },
  ],
  'p-skill-building-path': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '学習が実務に結びつかず、訓練だけ続いて就職につながらない。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '学ぶ順序が定まらず、努力量の割に応募や実習へ進めない。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '重点スキルは見えているが、実務検証の場が少なく接続が弱い。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: 'スキルが段階化され、学習と実務課題が週次でつながっている。',
      tone: 'stable',
    },
  ],
  'p-worktrial-transition': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '実習でできたことが採用後に再現できず、初期定着が崩れている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '実習評価と採用後運用がつながらず、負荷設定や支援が毎回手探りになる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '引継ぎはあるが、初月の評価指標や面談設計が十分ではない。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '実習時の安定条件が採用後運用へ翻訳され、初期定着まで見通せる。',
      tone: 'stable',
    },
  ],
  'p-income-condition-stability': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: '収入・契約・体調維持が両立せず、働き続ける判断自体が揺らいでいる。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '条件交渉が後手で、就業開始後に無理が見えて不安定になる。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '必須条件はある程度見えているが、再評価時点や交渉余地が曖昧。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '収入条件と稼働上限がそろって確認され、継続可能な判断ができる。',
      tone: 'stable',
    },
  ],
  'p-support-service-navigation': [
    {
      icon: '💣',
      label: '破綻・停止',
      description: 'どこに相談すべきか分からず、制度も支援も動かないまま止まっている。',
      tone: 'critical',
    },
    {
      icon: '🔴',
      label: '高頻度支障',
      description: '窓口が分散し、たらい回しや期限超過で接続が遅れている。',
      tone: 'high',
    },
    {
      icon: '🟡',
      label: '要調整',
      description: '使う窓口は見えているが、責任者と次アクションが毎回曖昧。',
      tone: 'moderate',
    },
    {
      icon: '🟢',
      label: '安定・予防',
      description: '相談目的ごとの窓口と順番が整理され、支援接続が継続的に回る。',
      tone: 'stable',
    },
  ],
};

const modeStyle: Record<PatternCard['mode'], string> = {
  standard: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  conditional_only: 'bg-amber-100 text-amber-800 border-amber-200',
  questions_first: 'bg-rose-100 text-rose-800 border-rose-200',
};

const situationLevelStyle: Record<SituationSeverityTone, string> = {
  critical: 'border-rose-300 bg-rose-100 text-rose-900',
  high: 'border-red-300 bg-red-100 text-red-900',
  moderate: 'border-amber-300 bg-amber-100 text-amber-900',
  stable: 'border-emerald-300 bg-emerald-100 text-emerald-900',
};

const situationLevelOrder: Record<SituationSeverityTone, number> = {
  stable: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

const modeLabel: Record<PatternCard['mode'], string> = {
  standard: 'STANDARD',
  conditional_only: 'CONDITIONAL',
  questions_first: 'QUESTIONS FIRST',
};

const CAUSAL_TIER_STYLE: Record<CausalTier, string> = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  B: 'bg-sky-100 text-sky-800 border-sky-200',
  C: 'bg-slate-100 text-slate-700 border-slate-200',
};

const CAUSAL_BASIS_LABEL: Record<CausalBasis, string> = {
  glm_direct: 'GLM直接',
  triangulated_inference: '三角測量',
  associative_reference: '関連知見',
};

const CARD_DISPLAY_ORDER: string[] = [
  'p-fatigue-pacing',
  'p-medical-schedule',
  'p-internal-treatment-compatibility',
  'p-shift-rhythm-guard',
  'p-return-to-work-ramp',
  'p-mental-fluctuation-plan',
  'p-environment-sensory',
  'p-commute-hybrid',
  'p-physical-mobility-route',
  'p-jobmatch-exploration',
  'p-application-contact-flow',
  'p-interview-self-advocacy',
  'p-skill-building-path',
  'p-worktrial-transition',
  'p-income-condition-stability',
  'p-support-service-navigation',
  'p-meeting-overload',
  'p-disclosure-boundary',
  'p-manager-checkin',
  'p-customer-facing-load',
  'p-visual-document-access',
  'p-hearing-meeting-access',
  'p-intellectual-task-clarity',
  'p-developmental-switch-load',
  'p-higher-brain-memory-support',
  'p-safety-critical-operations',
];

const CARD_DISPLAY_ORDER_INDEX = new Map(CARD_DISPLAY_ORDER.map((id, index) => [id, index]));

const CARD_LAYER_MAP: Record<string, CardLayerKey> = {
  'p-fatigue-pacing': 'health',
  'p-medical-schedule': 'health',
  'p-internal-treatment-compatibility': 'health',
  'p-shift-rhythm-guard': 'health',
  'p-return-to-work-ramp': 'health',
  'p-mental-fluctuation-plan': 'health',
  'p-environment-sensory': 'health',
  'p-commute-hybrid': 'health',
  'p-physical-mobility-route': 'health',
  'p-jobmatch-exploration': 'transition',
  'p-application-contact-flow': 'transition',
  'p-interview-self-advocacy': 'transition',
  'p-skill-building-path': 'transition',
  'p-worktrial-transition': 'transition',
  'p-income-condition-stability': 'transition',
  'p-support-service-navigation': 'transition',
  'p-meeting-overload': 'operation',
  'p-disclosure-boundary': 'operation',
  'p-manager-checkin': 'operation',
  'p-customer-facing-load': 'operation',
  'p-visual-document-access': 'operation',
  'p-hearing-meeting-access': 'operation',
  'p-intellectual-task-clarity': 'operation',
  'p-developmental-switch-load': 'operation',
  'p-higher-brain-memory-support': 'operation',
  'p-safety-critical-operations': 'operation',
};

const CARD_LAYER_LABEL: Record<CardLayerKey, string> = {
  health: '体調レイヤー',
  transition: '就職移行レイヤー',
  operation: '職場運用レイヤー',
};

const CARD_LAYER_STYLE: Record<CardLayerKey, string> = {
  health: 'border-rose-200 bg-rose-50 text-rose-800',
  transition: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  operation: 'border-sky-200 bg-sky-50 text-sky-800',
};

const CARD_LAYER_ORDER: CardLayerKey[] = ['health', 'transition', 'operation'];

const CARD_LAYER_NOTE: Record<CardLayerKey, string> = {
  health: '変動・治療・回復・リズムに関する困りごとをまとめて確認',
  transition: '探索→応募→面接→合意→定着までの移行プロセスを確認',
  operation: '会議・指示・安全・日常業務の運用課題を確認',
};

export default function JacGuidebookPage({
  manifest,
  coverageAudit,
  data2Stats,
  cardStrategicInsights,
  patternCoverage,
  claimsGlmCoverage,
  commonWorkCopy,
  layerDisposition,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [focus, setFocus] = useState<FocusKey>('all');
  const [tagNavigator, setTagNavigator] = useState<string>('all');

  const orderedTagNavigatorOptions = useMemo(() => {
    const scored = TAG_NAVIGATOR_OPTIONS.map((option) => {
      if (option.id === 'all') return { option, score: Number.POSITIVE_INFINITY };
      const focusSet = new Set(option.focus);
      const facetSet = new Set(option.facets);
      const matchedCards = PATTERN_CARDS.filter((card) => {
        const matchFocus = card.focus.some((item) => focusSet.has(item));
        const matchFacet = (PATTERN_DISABILITY_FACETS[card.id] || []).some((facet) =>
          facetSet.has(facet),
        );
        return matchFocus || matchFacet;
      });
      const strategicScore = matchedCards.reduce((sum, card) => {
        const strategic = cardStrategicInsights[card.id];
        if (!strategic) return sum;
        return (
          sum +
          strategic.data2Hits * 2 +
          Math.min(strategic.claimHits / 20, 40) +
          strategic.glmIds.length * 3 +
          causalTierPriority(strategic.causalTier) +
          strategicLaneBonus(strategic)
        );
      }, 0);
      return { option, score: matchedCards.length * 12 + strategicScore };
    });

    return scored
      .sort((a, b) => {
        if (a.option.id === 'all') return -1;
        if (b.option.id === 'all') return 1;
        if (b.score !== a.score) return b.score - a.score;
        return a.option.label.localeCompare(b.option.label, 'ja');
      })
      .map((item) => item.option);
  }, [cardStrategicInsights]);

  const activeTagNavigator = useMemo(
    () =>
      TAG_NAVIGATOR_OPTIONS.find((item) => item.id === tagNavigator) ||
      orderedTagNavigatorOptions[0] ||
      TAG_NAVIGATOR_OPTIONS[0],
    [tagNavigator, orderedTagNavigatorOptions],
  );

  const visibleCards = useMemo(() => {
    const byFocus =
      focus === 'all' ? PATTERN_CARDS : PATTERN_CARDS.filter((card) => card.focus.includes(focus));
    const focusSet = new Set(activeTagNavigator.focus);
    const facetSet = new Set(activeTagNavigator.facets);
    const filtered =
      !activeTagNavigator || activeTagNavigator.id === 'all'
        ? byFocus
        : byFocus.filter((card) => {
            const matchFocus = card.focus.some((item) => focusSet.has(item));
            const matchFacet = (PATTERN_DISABILITY_FACETS[card.id] || []).some((facet) =>
              facetSet.has(facet),
            );
            return matchFocus || matchFacet;
          });

    if (focus === 'all' && activeTagNavigator.id === 'all') {
      return [...filtered].sort((a, b) => {
        const orderA = CARD_DISPLAY_ORDER_INDEX.get(a.id) ?? Number.POSITIVE_INFINITY;
        const orderB = CARD_DISPLAY_ORDER_INDEX.get(b.id) ?? Number.POSITIVE_INFINITY;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title, 'ja');
      });
    }

    return [...filtered].sort((a, b) => {
      const score = (card: PatternCard) => {
        const strategic = cardStrategicInsights[card.id];
        const orderIndex = CARD_DISPLAY_ORDER_INDEX.get(card.id);
        const orderBonus =
          typeof orderIndex === 'number'
            ? Math.max(0, (CARD_DISPLAY_ORDER.length - orderIndex) * 0.25)
            : 0;
        let value =
          (strategic?.data2Hits || 0) * 3 +
          Math.min((strategic?.claimHits || 0) / 15, 40) +
          (strategic?.glmIds.length || 0) * 4 +
          causalTierPriority(strategic?.causalTier || 'C') +
          strategicLaneBonus(strategic) +
          orderBonus;
        if (focus !== 'all' && card.focus.includes(focus)) value += 18;
        if (activeTagNavigator.id !== 'all') {
          if (card.focus.some((item) => focusSet.has(item))) value += 24;
          if ((PATTERN_DISABILITY_FACETS[card.id] || []).some((facet) => facetSet.has(facet)))
            value += 20;
        }
        if (card.mode === 'questions_first') value += 3;
        return value;
      };

      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      const orderA = CARD_DISPLAY_ORDER_INDEX.get(a.id) ?? Number.POSITIVE_INFINITY;
      const orderB = CARD_DISPLAY_ORDER_INDEX.get(b.id) ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title, 'ja');
    });
  }, [focus, activeTagNavigator, cardStrategicInsights]);

  const visibleCardsByLayer = useMemo(() => {
    const grouped: Record<CardLayerKey, PatternCard[]> = {
      health: [],
      transition: [],
      operation: [],
    };
    for (const card of visibleCards) {
      const layer = CARD_LAYER_MAP[card.id] || 'operation';
      grouped[layer].push(card);
    }
    return grouped;
  }, [visibleCards]);

  const sourceCount = manifest ? Object.keys(manifest.bySourceId || {}).length : 0;
  const countryCount = manifest ? Object.keys(manifest.byCountry || {}).length : 0;
  const highRiskCount = manifest?.byRiskLevel?.high || 0;
  const specificCaseCount = manifest?.byEvidenceScope?.specific_case || 0;
  const data2GeneratedAt = data2Stats?.generatedAt
    ? new Date(data2Stats.generatedAt).toLocaleString('ja-JP')
    : 'n/a';
  const patternFacetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PATTERN_CARDS.forEach((card) => {
      const facets = PATTERN_DISABILITY_FACETS[card.id] || [];
      facets.forEach((facet) => {
        counts[facet] = (counts[facet] || 0) + 1;
      });
    });
    return counts;
  }, []);
  const causalTierCounts = useMemo(() => {
    const counts: Record<CausalTier, number> = { A: 0, B: 0, C: 0 };
    PATTERN_CARDS.forEach((card) => {
      const tier = cardStrategicInsights[card.id]?.causalTier || 'C';
      counts[tier] += 1;
    });
    return counts;
  }, [cardStrategicInsights]);
  const tierAlignmentSnapshot = useMemo(() => {
    let matched = 0;
    let total = 0;
    PATTERN_CARDS.forEach((card) => {
      const strategic = cardStrategicInsights[card.id];
      if (!strategic) return;
      total += 1;
      if (strategic.expectedTierMet) matched += 1;
    });
    return {
      matched,
      total,
      rate: total === 0 ? 0 : Number((matched / total).toFixed(3)),
    };
  }, [cardStrategicInsights]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      <Head>
        <title>JACガイド | 困りごとから配慮設計へ</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="JACのGLM・諸外国Web・記述データを統合した、困りごと起点の合理的配慮ガイド。"
        />
      </Head>

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">Next Being Lab</p>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">JACガイド（導入版）</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/jac/guidebook"
              className="rounded-full border border-cyan-200 px-4 py-2 text-xs font-semibold text-cyan-800 hover:bg-cyan-50"
            >
              26フレーム実装ガイドブック
            </Link>
            <Link
              href="/jac"
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              JAC個別相談（条件確認あり）へ
            </Link>
            <Link
              href="/"
              className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-cyan-50 p-6 md:p-8">
          <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700">
            Difficulty-to-Accommodation Atlas
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            困りごとを、条件つきで解ける知識へ。
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed">
            これは一般的な配慮一覧ではありません。JACが統合した
            <span className="font-semibold"> GLM・諸外国Web・国内記述データ </span>
            を、過一般化を避ける形で再編した導入ガイドです。各カードは「すぐ読める要約」と「深い根拠」を同時に持ちます。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/80 bg-white p-3">
              <p className="text-[11px] text-gray-500">Claims</p>
              <p className="text-xl font-bold text-gray-900">{manifest?.claimCount || '-'}</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white p-3">
              <p className="text-[11px] text-gray-500">Sources</p>
              <p className="text-xl font-bold text-gray-900">{sourceCount || '-'}</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white p-3">
              <p className="text-[11px] text-gray-500">Countries/Regions</p>
              <p className="text-xl font-bold text-gray-900">{countryCount || '-'}</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white p-3">
              <p className="text-[11px] text-gray-500">Specific-case Evidence</p>
              <p className="text-xl font-bold text-gray-900">{specificCaseCount || '-'}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            high-risk claims: {highRiskCount} / generatedAt:{' '}
            {manifest?.generatedAt ? new Date(manifest.generatedAt).toLocaleString('ja-JP') : 'n/a'}
          </p>
        </section>

        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
          <h3 className="text-lg font-bold text-cyan-900">入口体験: なぜJACガイドが効くのか</h3>
          <p className="mt-2 text-sm text-cyan-900 leading-relaxed">
            JACガイドは「一般論を読むページ」ではなく、data2とGLMの知見を使って
            <span className="font-semibold"> 条件つきで再現可能な配慮設計 </span>
            へつなげる入口です。ここで全体像を掴み、必要なケースだけ個別相談へ進みます。
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-xs font-semibold text-cyan-900">1) 困りごとから入る</p>
              <p className="mt-1 text-xs text-cyan-800">
                タグ導線で近いパターンを即時表示。最初に読むカードを迷わず決められます。
              </p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-xs font-semibold text-cyan-900">2) 根拠と失敗リスクを見る</p>
              <p className="mt-1 text-xs text-cyan-800">
                各カードで、配慮の運用条件と逆効果リスクを同時に確認できます。
              </p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-xs font-semibold text-cyan-900">3) 条件不足だけ個別相談へ</p>
              <p className="mt-1 text-xs text-cyan-800">
                person/job/environment等が不足しているときだけ、JAC個別相談で深掘りします。
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-[11px] text-cyan-700">data2 entries</p>
              <p className="text-xl font-bold text-cyan-900">{data2Stats?.entryCount || '-'}</p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-[11px] text-cyan-700">disability types</p>
              <p className="text-xl font-bold text-cyan-900">
                {data2Stats?.disabilityCount || '-'}
              </p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-[11px] text-cyan-700">issue patterns</p>
              <p className="text-xl font-bold text-cyan-900">{data2Stats?.issueCount || '-'}</p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-[11px] text-cyan-700">support patterns</p>
              <p className="text-xl font-bold text-cyan-900">{data2Stats?.supportCount || '-'}</p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white p-3">
              <p className="text-[11px] text-cyan-700">narrative signals</p>
              <p className="text-xl font-bold text-cyan-900">{data2Stats?.narrativeCount || '-'}</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-cyan-800">
            data2 generatedAt: {data2GeneratedAt} /
            不足条件が残る場合のみ、下のボタンから個別相談へ進んでください。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/jac"
              className="rounded-full bg-cyan-700 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-800"
            >
              条件を持ってJAC個別相談へ進む
            </Link>
            <Link
              href="/jac/guidebook"
              className="rounded-full border border-cyan-300 bg-white px-4 py-2 text-xs font-bold text-cyan-900 hover:bg-cyan-100"
            >
              26フレーム実装ガイドブックを見る
            </Link>
            <a
              href="#guide-usage-flow"
              className="rounded-full border border-cyan-300 bg-white px-4 py-2 text-xs font-bold text-cyan-900 hover:bg-cyan-100"
            >
              使い方を先に確認する
            </a>
          </div>
        </section>

        <section id="guide-usage-flow" className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-gray-900">JACの相互作用ロジック（4レンズ）</h3>
          <div className="mt-3 grid gap-2">
            {GLM_INTERACTION_MEANINGS.map((item, index) => (
              <p key={item} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{index + 1}.</span> {item}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-gray-900">よくある困りごと → 配慮パターン</h3>
          <p className="mt-2 text-sm text-gray-600">
            まずは困りごとタグだけで探せるようにしています。テーマ絞り込みは任意の詳細設定です。
          </p>
          {patternCoverage && (
            <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
              <p className="text-xs font-semibold text-cyan-900">
                {PATTERN_CARDS.length}カードで拾えている data2課題:{' '}
                {patternCoverage.coveredIssueRows.toLocaleString()} /{' '}
                {patternCoverage.totalIssueRows.toLocaleString()} (
                {(patternCoverage.coverageRate * 100).toFixed(1)}%)
              </p>
              {claimsGlmCoverage && (
                <>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    直接根拠の統合被覆（data2課題 + claims有効）:{' '}
                    {claimsGlmCoverage.directEvidenceCovered.toLocaleString()} /{' '}
                    {claimsGlmCoverage.directEvidenceTotal.toLocaleString()} (
                    {(claimsGlmCoverage.directEvidenceCoverageRate * 100).toFixed(1)}%)
                  </p>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    claims被覆（件数, 高リスク/ノイズ除外）:{' '}
                    {claimsGlmCoverage.claimsCovered.toLocaleString()} /{' '}
                    {claimsGlmCoverage.claimsEligible.toLocaleString()} / 全体{' '}
                    {claimsGlmCoverage.claimsAll.toLocaleString()} (
                    {(claimsGlmCoverage.claimsCoverageRate * 100).toFixed(1)}%)
                  </p>
                  {claimsGlmCoverage.claimsCoverageBySourceTop.length > 0 && (
                    <p className="mt-1 text-[11px] text-cyan-800">
                      source別claims被覆（有効件数上位）:{' '}
                      {claimsGlmCoverage.claimsCoverageBySourceTop
                        .map(
                          (item) =>
                            `${item.sourceId} ${item.coveredClaims}/${item.eligibleClaims} (${(
                              item.coverageRate * 100
                            ).toFixed(0)}%)`,
                        )
                        .join(' / ')}
                    </p>
                  )}
                  {claimsGlmCoverage.claimsCoverageByLane.length > 0 && (
                    <p className="mt-1 text-[11px] text-cyan-800">
                      レーン別claims被覆:{' '}
                      {claimsGlmCoverage.claimsCoverageByLane
                        .map(
                          (item) =>
                            `${EVIDENCE_LANE_LABEL[item.lane] || item.lane} ${item.coveredClaims}/${
                              item.eligibleClaims
                            } (${(item.coverageRate * 100).toFixed(0)}%)`,
                        )
                        .join(' / ')}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-cyan-800">
                    GLM全体（NanbyoGLM有意関係）:{' '}
                    {claimsGlmCoverage.glmWorkbookSignificantRelations.toLocaleString()}関係 /{' '}
                    {claimsGlmCoverage.glmWorkbookPredictors.toLocaleString()}予測子
                  </p>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    GLM全量カード適合（relation単位）: {claimsGlmCoverage.glmFullCoveredRelations} /{' '}
                    {claimsGlmCoverage.glmFullTotalRelations} (
                    {(claimsGlmCoverage.glmFullCoverageRate * 100).toFixed(1)}%)
                  </p>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    内訳: 語彙直結 {claimsGlmCoverage.glmFullLexicalCoveredRelations}件 /
                    outcome分類ブリッジ {claimsGlmCoverage.glmFullBucketBridgedRelations}件
                  </p>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    legacy導線（実装要約セット）: {claimsGlmCoverage.glmLegacyCovered} /{' '}
                    {claimsGlmCoverage.glmLegacyTotal} (
                    {(claimsGlmCoverage.glmLegacyCoverageRate * 100).toFixed(1)}%)
                  </p>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    因果Tier分布: A {causalTierCounts.A} / B {causalTierCounts.B} / C{' '}
                    {causalTierCounts.C}
                  </p>
                  <p className="mt-1 text-[11px] text-cyan-800">
                    設計Tier整合: {tierAlignmentSnapshot.matched} / {tierAlignmentSnapshot.total} (
                    {(tierAlignmentSnapshot.rate * 100).toFixed(1)}%)
                  </p>
                </>
              )}
              {patternCoverage.topUncoveredIssues.length > 0 && (
                <p className="mt-1 text-[11px] text-cyan-800">
                  未カバー上位:{' '}
                  {patternCoverage.topUncoveredIssues
                    .map((item) => item.issue)
                    .slice(0, 3)
                    .join(' / ')}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-semibold text-emerald-900">
              26カードで何ができて、何を個別相談で扱うか
            </p>
            <p className="mt-1 text-[11px] text-emerald-900">
              配慮・支援は個別性が高く見えますが、職場で反復する「詰まり方の型」は26カードでかなり捉えられます。ここで全体像を掴み、
              最終調整は個別相談で行うのが前提です。
            </p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <div className="rounded-md border border-emerald-200 bg-white p-2">
                <p className="text-[11px] font-semibold text-emerald-900">
                  26カードで扱う範囲（型）
                </p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px] text-emerald-800">
                  <li>会議・通院・疲労・復職・開示など、再発しやすい困りごとの構造</li>
                  <li>失敗しやすい運用パターンと、初手の配慮パッケージ</li>
                </ul>
              </div>
              <div className="rounded-md border border-emerald-200 bg-white p-2">
                <p className="text-[11px] font-semibold text-emerald-900">
                  個別相談で扱う範囲（最終調整）
                </p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px] text-emerald-800">
                  <li>同じカードでも、悪化トリガー・職務要件・法域で変わる具体条件</li>
                  <li>複数特性の重なり、開示範囲、復職段階、制度・契約との整合</li>
                </ul>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-emerald-800">
              例:
              「体調変動」でも、通院翌日の副作用中心か、睡眠・気圧中心かで打ち手は変わります。ここはJAC個別相談で詰めます。
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
            <p className="text-xs font-semibold text-indigo-900">困りごとタグで探す（主導線）</p>
            <p className="mt-1 text-xs text-indigo-800">
              1ステップで使える入口です。タグを選ぶと、関連しやすいパターンを優先表示します。
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {orderedTagNavigatorOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTagNavigator(item.id)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                    tagNavigator === item.id
                      ? 'border-indigo-700 bg-indigo-700 text-white'
                      : 'border-indigo-200 bg-white text-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-indigo-900">
              選択中: <span className="font-bold">{activeTagNavigator.label}</span> / 該当カード:{' '}
              <span className="font-bold">{visibleCards.length}</span>件
            </p>
            <p className="mt-1 text-[11px] text-indigo-700">{activeTagNavigator.note}</p>
          </div>

          <details className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <summary className="cursor-pointer text-xs font-semibold text-gray-700">
              詳細テーマでさらに絞る（任意）
            </summary>
            <p className="mt-2 text-[11px] text-gray-600">
              この設定は上級者向けです。通常は上のタグ導線だけで利用できます。
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFocus(option.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    focus === option.key
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </details>

          <div className="mt-5 space-y-6">
            {CARD_LAYER_ORDER.map((layer) => {
              const layerCards = visibleCardsByLayer[layer] || [];
              if (layerCards.length === 0) return null;
              return (
                <section key={`layer-${layer}`} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          CARD_LAYER_STYLE[layer]
                        }`}
                      >
                        {CARD_LAYER_LABEL[layer]}
                      </span>
                      <span className="text-xs text-gray-600">{CARD_LAYER_NOTE[layer]}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      {layerCards.length}件
                    </span>
                  </div>
                  <div className="space-y-4">
                    {layerCards.map((card) => (
                      <article
                        key={card.id}
                        id={card.id}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-5"
                      >
                        {(() => {
                          const strategic = cardStrategicInsights[card.id];
                          const rewritten = commonWorkCopy?.[card.id];
                          const displayTitle = rewritten?.title || card.title;
                          const displaySituation = rewritten?.situation || card.situation;
                          const displaySelectionBoundary =
                            rewritten?.selectionBoundary || card.selectionBoundary;
                          const displaySituationLevels = Array.isArray(rewritten?.situationLevels)
                            ? rewritten.situationLevels.filter(
                                (item) =>
                                  String(item?.icon || '').trim().length > 0 &&
                                  String(item?.label || '').trim().length > 0 &&
                                  String(item?.description || '').trim().length > 0,
                              )
                            : CARD_SITUATION_LEVELS[card.id] || [];
                          const orderedSituationLevels = [...displaySituationLevels].sort(
                            (a, b) => situationLevelOrder[a.tone] - situationLevelOrder[b.tone],
                          );
                          const rewrittenQuickBundleRaw = rewritten?.quickBundle;
                          const rewrittenQuickBundle = Array.isArray(rewrittenQuickBundleRaw)
                            ? { standardized: rewrittenQuickBundleRaw, individualized: [] }
                            : rewrittenQuickBundleRaw;
                          const standardizedBundle = Array.isArray(
                            rewrittenQuickBundle?.standardized,
                          )
                            ? rewrittenQuickBundle.standardized.filter(
                                (item) => String(item || '').trim().length > 0,
                              )
                            : [];
                          const individualizedBundle = Array.isArray(
                            rewrittenQuickBundle?.individualized,
                          )
                            ? rewrittenQuickBundle.individualized.filter(
                                (item) => String(item || '').trim().length > 0,
                              )
                            : [];
                          const connectionExamples = Array.isArray(
                            rewritten?.disabilityEmploymentConnection?.examples,
                          )
                            ? rewritten.disabilityEmploymentConnection.examples.filter(
                                (item) => String(item || '').trim().length > 0,
                              )
                            : [];
                          const legalSummary = String(
                            rewritten?.legalPolicyGuardrail?.summary || '',
                          ).trim();
                          const legalGroundingObservation = String(
                            rewritten?.legalPolicyGuardrail?.grounding?.observation || '',
                          ).trim();
                          const legalGroundingCue = String(
                            rewritten?.legalPolicyGuardrail?.grounding?.evidenceCue || '',
                          ).trim();
                          const legalChecks = Array.isArray(rewritten?.legalPolicyGuardrail?.checks)
                            ? rewritten.legalPolicyGuardrail.checks.filter(
                                (item) => String(item || '').trim().length > 0,
                              )
                            : [];
                          const legalEscalation = String(
                            rewritten?.legalPolicyGuardrail?.escalation || '',
                          ).trim();
                          const regionalSummary = String(
                            rewritten?.regionalSupportOverlay?.summary || '',
                          ).trim();
                          const regionalGroundingObservation = String(
                            rewritten?.regionalSupportOverlay?.grounding?.observation || '',
                          ).trim();
                          const regionalGroundingCue = String(
                            rewritten?.regionalSupportOverlay?.grounding?.evidenceCue || '',
                          ).trim();
                          const regionalJacRole = Array.isArray(
                            rewritten?.regionalSupportOverlay?.jacRole,
                          )
                            ? rewritten.regionalSupportOverlay.jacRole.filter(
                                (item) => String(item || '').trim().length > 0,
                              )
                            : [];
                          const regionalRole = Array.isArray(
                            rewritten?.regionalSupportOverlay?.regionalRole,
                          )
                            ? rewritten.regionalSupportOverlay.regionalRole.filter(
                                (item) => String(item || '').trim().length > 0,
                              )
                            : [];
                          const regionalReturnPath = String(
                            rewritten?.regionalSupportOverlay?.returnPath || '',
                          ).trim();
                          const layerDecision = layerDisposition?.[card.id];
                          const legalDecision = getLayerDisposition(layerDecision?.legalPolicy);
                          const legalKeepInCard = filterNonEmptyList(
                            layerDecision?.legalPolicy?.keepInCard,
                          );
                          const legalDetailTarget = String(
                            layerDecision?.legalPolicy?.detailTarget || '',
                          ).trim();
                          const regionalDecision = getLayerDisposition(
                            layerDecision?.regionalSupport,
                          );
                          const regionalKeepInCard = filterNonEmptyList(
                            layerDecision?.regionalSupport?.keepInCard,
                          );
                          const regionalDetailTarget = String(
                            layerDecision?.regionalSupport?.detailTarget || '',
                          ).trim();
                          const reasonParts: string[] = [];
                          const navigatorFocusMatched =
                            activeTagNavigator.id !== 'all' &&
                            card.focus.some((item) => activeTagNavigator.focus.includes(item));
                          const navigatorFacetMatched =
                            activeTagNavigator.id !== 'all' &&
                            (PATTERN_DISABILITY_FACETS[card.id] || []).some((facet) =>
                              activeTagNavigator.facets.includes(facet),
                            );
                          const focusMatched = focus !== 'all' && card.focus.includes(focus);
                          if (
                            activeTagNavigator.id !== 'all' &&
                            (navigatorFocusMatched || navigatorFacetMatched)
                          ) {
                            reasonParts.push(`タグ「${activeTagNavigator.label}」一致`);
                          }
                          if (focusMatched) {
                            const focusLabel =
                              FOCUS_OPTIONS.find((item) => item.key === focus)?.label || focus;
                            reasonParts.push(`詳細テーマ「${focusLabel}」一致`);
                          }
                          if ((strategic?.data2Hits || 0) > 0) {
                            reasonParts.push(`data2反復 ${strategic?.data2Hits}件`);
                          }
                          if ((strategic?.glmIds?.length || 0) > 0) {
                            reasonParts.push(`GLM ${strategic?.glmIds.slice(0, 2).join(' / ')}`);
                          }
                          if ((strategic?.evidenceLanes?.length || 0) > 0) {
                            const primaryLane = strategic?.evidenceLanes?.[0] || 'unknown';
                            const laneLabel = EVIDENCE_LANE_LABEL[primaryLane] || primaryLane;
                            reasonParts.push(`claims ${laneLabel}`);
                          }
                          if (strategic?.causalTier) {
                            reasonParts.push(
                              strategic.expectedTierMet
                                ? `因果${strategic.causalTier}(設計一致)`
                                : `因果${strategic.causalTier}(設計${strategic.expectedCausalTier}乖離)`,
                            );
                          }
                          reasonParts.push(
                            `レイヤー ${CARD_LAYER_LABEL[CARD_LAYER_MAP[card.id] || 'operation']}`,
                          );
                          const selectionReason =
                            reasonParts.slice(0, 4).join(' | ') ||
                            '困りごと全体像と障害facetの近さで抽出';
                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-base md:text-lg font-bold text-gray-900">
                                  {displayTitle}
                                </h4>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                                      CARD_LAYER_STYLE[CARD_LAYER_MAP[card.id] || 'operation']
                                    }`}
                                  >
                                    {CARD_LAYER_LABEL[CARD_LAYER_MAP[card.id] || 'operation']}
                                  </span>
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${modeStyle[card.mode]}`}
                                  >
                                    {modeLabel[card.mode]}
                                  </span>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">{displaySituation}</p>
                              {displaySelectionBoundary && (
                                <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
                                  選び分け目安: {displaySelectionBoundary}
                                </p>
                              )}
                              {orderedSituationLevels.length > 0 && (
                                <div className="mt-2 rounded-md border border-slate-200 bg-white px-2 py-2">
                                  <p className="text-[11px] font-semibold text-slate-900">
                                    状況レベル（🟢 → 💣）
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-slate-600">
                                    診断の重さではなく、仕事がどれだけ詰まり、運用で吸収できているかで見る。
                                  </p>
                                  <div className="mt-2 space-y-1.5">
                                    {orderedSituationLevels.map((level) => (
                                      <div
                                        key={`${card.id}-${level.icon}-${level.label}`}
                                        className="flex items-start gap-2"
                                      >
                                        <span
                                          className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                                            situationLevelStyle[level.tone]
                                          }`}
                                        >
                                          {level.icon} {level.label}
                                        </span>
                                        <p className="text-[11px] text-slate-700">
                                          {level.description}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {(standardizedBundle.length > 0 ||
                                individualizedBundle.length > 0) && (
                                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-2">
                                  <p className="text-[11px] font-semibold text-emerald-900">
                                    実装ポイント（共通設計 / 個別調整）
                                  </p>
                                  {standardizedBundle.length > 0 && (
                                    <p className="mt-0.5 text-[11px] text-emerald-900">
                                      共通設計: {standardizedBundle.slice(0, 3).join(' / ')}
                                    </p>
                                  )}
                                  {individualizedBundle.length > 0 && (
                                    <p className="mt-0.5 text-[11px] text-emerald-800">
                                      個別調整: {individualizedBundle.slice(0, 2).join(' / ')}
                                    </p>
                                  )}
                                </div>
                              )}
                              {connectionExamples.length > 0 && (
                                <p className="mt-2 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] text-sky-900">
                                  障害者雇用との接続（多様性の例）: {connectionExamples.join(' / ')}
                                </p>
                              )}
                              {(legalGroundingObservation ||
                                legalGroundingCue ||
                                legalSummary ||
                                legalChecks.length > 0 ||
                                legalEscalation) && (
                                <div className="mt-2 rounded-md border border-orange-200 bg-orange-50 px-2 py-2">
                                  <p className="text-[11px] font-semibold text-orange-900">
                                    適用条件（法政策）
                                  </p>
                                  {legalDecision === 'keep_in_card' ? (
                                    <>
                                      {legalGroundingObservation && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          根拠: {legalGroundingObservation}
                                        </p>
                                      )}
                                      {legalGroundingCue && (
                                        <p className="mt-0.5 text-[11px] text-orange-800">
                                          参照範囲: {legalGroundingCue}
                                        </p>
                                      )}
                                      {legalSummary && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          見落としやすい制約: {legalSummary}
                                        </p>
                                      )}
                                      {legalKeepInCard.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          このカードで残す判断線: {legalKeepInCard.join(' / ')}
                                        </p>
                                      )}
                                      {legalChecks.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          実施前に固定: {legalChecks.slice(0, 3).join(' / ')}
                                        </p>
                                      )}
                                      {legalEscalation && (
                                        <p className="mt-0.5 text-[11px] text-orange-800">
                                          迷う時の戻し先: {legalEscalation}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {legalGroundingObservation && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          根拠: {legalGroundingObservation}
                                        </p>
                                      )}
                                      {legalGroundingCue && (
                                        <p className="mt-0.5 text-[11px] text-orange-800">
                                          参照範囲: {legalGroundingCue}
                                        </p>
                                      )}
                                      {legalKeepInCard.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          このカードで残す判断線: {legalKeepInCard.join(' / ')}
                                        </p>
                                      )}
                                      {legalSummary && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          見落としやすい制約: {legalSummary}
                                        </p>
                                      )}
                                      {legalChecks.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-orange-900">
                                          実施前に固定: {legalChecks.slice(0, 3).join(' / ')}
                                        </p>
                                      )}
                                      <p className="mt-0.5 text-[11px] text-orange-800">
                                        詳細の所在: {LAYER_DISPOSITION_LABEL[legalDecision]}
                                        {legalDetailTarget ? ` (${legalDetailTarget})` : ''}
                                      </p>
                                      {legalEscalation && (
                                        <p className="mt-0.5 text-[11px] text-orange-800">
                                          迷う時の戻し先: {legalEscalation}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                              {(regionalGroundingObservation ||
                                regionalGroundingCue ||
                                regionalSummary ||
                                regionalJacRole.length > 0 ||
                                regionalRole.length > 0 ||
                                regionalReturnPath) && (
                                <div className="mt-2 rounded-md border border-teal-200 bg-teal-50 px-2 py-2">
                                  <p className="text-[11px] font-semibold text-teal-900">
                                    実施条件（地域支援）
                                  </p>
                                  {regionalDecision === 'keep_in_card' ? (
                                    <>
                                      {regionalGroundingObservation && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          根拠: {regionalGroundingObservation}
                                        </p>
                                      )}
                                      {regionalGroundingCue && (
                                        <p className="mt-0.5 text-[11px] text-teal-800">
                                          参照範囲: {regionalGroundingCue}
                                        </p>
                                      )}
                                      {regionalSummary && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          企業単独では足りない場面: {regionalSummary}
                                        </p>
                                      )}
                                      {regionalKeepInCard.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          このカードで残す判断線: {regionalKeepInCard.join(' / ')}
                                        </p>
                                      )}
                                      {regionalJacRole.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          JAC側で先に固定: {regionalJacRole.slice(0, 2).join(' / ')}
                                        </p>
                                      )}
                                      {regionalRole.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-teal-800">
                                          外部支援で支える点: {regionalRole.slice(0, 2).join(' / ')}
                                        </p>
                                      )}
                                      {regionalReturnPath && (
                                        <p className="mt-0.5 text-[11px] text-teal-800">
                                          止まった時の戻し先: {regionalReturnPath}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {regionalGroundingObservation && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          根拠: {regionalGroundingObservation}
                                        </p>
                                      )}
                                      {regionalGroundingCue && (
                                        <p className="mt-0.5 text-[11px] text-teal-800">
                                          参照範囲: {regionalGroundingCue}
                                        </p>
                                      )}
                                      {regionalKeepInCard.length > 0 && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          このカードで残す判断線: {regionalKeepInCard.join(' / ')}
                                        </p>
                                      )}
                                      {regionalSummary && (
                                        <p className="mt-0.5 text-[11px] text-teal-900">
                                          企業単独では足りない場面: {regionalSummary}
                                        </p>
                                      )}
                                      <p className="mt-0.5 text-[11px] text-teal-800">
                                        詳細の所在: {LAYER_DISPOSITION_LABEL[regionalDecision]}
                                        {regionalDetailTarget ? ` (${regionalDetailTarget})` : ''}
                                      </p>
                                      {regionalReturnPath && (
                                        <p className="mt-0.5 text-[11px] text-teal-800">
                                          止まった時の戻し先: {regionalReturnPath}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {(PATTERN_DISABILITY_FACETS[card.id] || []).map((facet) => (
                                  <span
                                    key={`${card.id}-${facet}`}
                                    className="inline-flex rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800"
                                  >
                                    {DISABILITY_FACET_LABEL[facet]}
                                  </span>
                                ))}
                              </div>
                              <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] text-indigo-900">
                                このカードが上位に出た理由: {selectionReason}
                              </p>

                              {strategic && (
                                <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
                                  <p className="text-xs font-bold text-cyan-900">
                                    統合AI分析で見えた「一手」
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-1.5">
                                    <span
                                      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${CAUSAL_TIER_STYLE[strategic.causalTier]}`}
                                    >
                                      {strategic.causalLabel}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      設計Tier: {strategic.expectedCausalTier}
                                      {strategic.expectedTierMet ? ' (一致)' : ' (要見直し)'}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      根拠種別: {CAUSAL_BASIS_LABEL[strategic.causalBasis]}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      triangulation: {strategic.causalTriangulationScore}/4
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-cyan-900">
                                    {strategic.causalSummary}
                                  </p>
                                  <p className="mt-1 text-[11px] text-cyan-800">
                                    留意: {strategic.causalGuardrail}
                                  </p>
                                  {!strategic.expectedTierMet && strategic.tierPolicyRationale ? (
                                    <p className="mt-1 text-[11px] text-amber-800">
                                      設計意図: {strategic.tierPolicyRationale}
                                    </p>
                                  ) : null}
                                  <p className="mt-1 text-xs text-cyan-900">
                                    {strategic.observation}
                                  </p>
                                  <p className="mt-1 text-xs text-cyan-900">
                                    {strategic.inference}
                                  </p>
                                  <p className="mt-1 text-xs font-semibold text-cyan-950">
                                    {strategic.move}
                                  </p>
                                  <div className="mt-3 rounded-lg border border-cyan-200 bg-white p-2">
                                    <p className="text-[11px] font-semibold text-cyan-900">
                                      根拠トレース（3レーン）
                                    </p>
                                    <div className="mt-2 grid gap-2 md:grid-cols-3">
                                      <div className="rounded-md border border-cyan-100 bg-cyan-50 p-2">
                                        <p className="text-[10px] font-semibold text-cyan-900">
                                          GLMレーン
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-cyan-800">
                                          anchor {strategic.evidenceTraceCounts.glmAnchors} /
                                          matched {strategic.evidenceTraceCounts.glmMatched}
                                        </p>
                                      </div>
                                      <div className="rounded-md border border-cyan-100 bg-cyan-50 p-2">
                                        <p className="text-[10px] font-semibold text-cyan-900">
                                          data2レーン
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-cyan-800">
                                          issue-support反復{' '}
                                          {strategic.evidenceTraceCounts.data2PairHits} /
                                          narrative一致{' '}
                                          {strategic.evidenceTraceCounts.data2NarrativeHits}
                                        </p>
                                      </div>
                                      <div className="rounded-md border border-cyan-100 bg-cyan-50 p-2">
                                        <p className="text-[10px] font-semibold text-cyan-900">
                                          claimsレーン
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-cyan-800">
                                          matched {strategic.evidenceTraceCounts.claimsMatched} /
                                          evidence重み{' '}
                                          {strategic.evidenceTraceCounts.claimsEvidence}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {(strategic.data2NarrativeHighlights.length > 0 ||
                                    strategic.syntheticVoices.length > 0) && (
                                    <div className="mt-3 rounded-lg border border-cyan-200 bg-white p-2">
                                      <p className="text-[11px] font-semibold text-cyan-900">
                                        ナラティブ要約と仮想の生の声
                                      </p>
                                      {strategic.data2NarrativeHighlights.length > 0 && (
                                        <div className="mt-1">
                                          <p className="text-[10px] font-semibold text-cyan-800">
                                            data2由来ナラティブ（匿名要約）
                                          </p>
                                          <ul className="mt-1 list-disc pl-4 text-[11px] text-cyan-900 space-y-0.5">
                                            {strategic.data2NarrativeHighlights.map((item) => (
                                              <li key={`${card.id}-narrative-${item}`}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {strategic.syntheticVoices.length > 0 && (
                                        <div className="mt-2">
                                          <p className="text-[10px] font-semibold text-cyan-800">
                                            仮想の生の声（合成・匿名）
                                          </p>
                                          <ul className="mt-1 list-disc pl-4 text-[11px] text-cyan-900 space-y-0.5">
                                            {strategic.syntheticVoices.map((item) => (
                                              <li key={`${card.id}-voice-${item}`}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      data2 hit: {strategic.data2Hits}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      claims evidence: {strategic.claimHits}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      GLM(top): {strategic.glmIds.join(', ') || 'n/a'}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      countries: {strategic.countries.join(', ') || 'n/a'}
                                    </span>
                                    <span className="inline-flex rounded-md border border-cyan-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-cyan-900">
                                      lanes:{' '}
                                      {strategic.evidenceLanes.length > 0
                                        ? strategic.evidenceLanes
                                            .map((lane) => EVIDENCE_LANE_LABEL[lane] || lane)
                                            .join(', ')
                                        : 'n/a'}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-500">
                                  配慮パッケージ（詳細を開いて運用条件まで確認）
                                </p>
                              </div>

                              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                {card.packages.map((pkg) => (
                                  <section
                                    key={pkg.id}
                                    className="rounded-xl border border-gray-200 bg-white p-3"
                                    aria-label={`${pkg.name} の詳細`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm font-semibold text-gray-900">
                                        {pkg.name}
                                      </p>
                                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                                        {pkg.id}
                                      </code>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-700">{pkg.goal}</p>
                                    <details className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                                      <summary className="cursor-pointer text-xs font-semibold text-gray-700">
                                        配慮パッケージ詳細
                                      </summary>
                                      <div className="mt-2 space-y-2 text-xs text-gray-700">
                                        <div>
                                          <p className="font-semibold text-gray-900">構成要素</p>
                                          <ul className="mt-1 list-disc pl-4 space-y-1">
                                            {pkg.components.map((item) => (
                                              <li key={item}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900">運用ルール</p>
                                          <ul className="mt-1 list-disc pl-4 space-y-1">
                                            {pkg.operationRules.map((item) => (
                                              <li key={item}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900">観測KPI</p>
                                          <div className="mt-1 flex flex-wrap gap-1.5">
                                            {pkg.kpi.map((item) => (
                                              <span
                                                key={item}
                                                className="inline-flex rounded-md border border-cyan-100 bg-cyan-50 px-1.5 py-0.5 text-[11px] text-cyan-800"
                                              >
                                                {item}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-900">
                                          <p className="font-semibold">再評価トリガー</p>
                                          <p className="mt-0.5">{pkg.recheckTrigger}</p>
                                        </div>
                                      </div>
                                    </details>
                                  </section>
                                ))}
                              </div>

                              <details className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                                  深いロジックと根拠を表示
                                </summary>
                                <div className="mt-3 space-y-3 text-sm text-gray-700">
                                  <div>
                                    <p className="font-semibold text-gray-900">4レンズ解釈</p>
                                    <ul className="mt-1 list-disc pl-5 space-y-1">
                                      <li>{card.lensLogic.occurrence}</li>
                                      <li>{card.lensLogic.resolution}</li>
                                      <li>{card.lensLogic.symptomWork}</li>
                                      <li>{card.lensLogic.supportFormation}</li>
                                    </ul>
                                  </div>
                                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-2">
                                    <p className="text-xs font-semibold text-indigo-900">
                                      実行前コンテキスト確認（7観点）
                                    </p>
                                    <p className="mt-1 text-[11px] text-indigo-800">
                                      mode:{' '}
                                      <span className="font-semibold">{modeLabel[card.mode]}</span>{' '}
                                      / 必須観点を先に確認してから提案を適用してください。
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {ALL_CONTEXT_KEYS.map((key) => {
                                        const required =
                                          MODE_REQUIRED_CONTEXTS[card.mode].includes(key);
                                        return (
                                          <span
                                            key={`${card.id}-${key}`}
                                            className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                                              required
                                                ? 'border-indigo-300 bg-white text-indigo-900'
                                                : 'border-indigo-100 bg-indigo-100/70 text-indigo-700'
                                            }`}
                                          >
                                            {CONTEXT_CHECK_LABEL[key]}: {CONTEXT_CHECK_HINT[key]}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                      <p className="font-semibold text-gray-900">適用条件</p>
                                      <ul className="mt-1 list-disc pl-5 space-y-1">
                                        {card.preconditions.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">逆効果リスク</p>
                                      <ul className="mt-1 list-disc pl-5 space-y-1">
                                        {card.failureRisks.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                      <p className="font-semibold text-gray-900">追加確認質問</p>
                                      <ul className="mt-1 list-disc pl-5 space-y-1">
                                        {card.followUpQuestions.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">法域メモ</p>
                                      <ul className="mt-1 list-disc pl-5 space-y-1">
                                        {card.jurisdictionNotes.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                                    <p className="text-xs font-semibold text-gray-700">
                                      Evidence Trace
                                    </p>
                                    {strategic ? (
                                      <p className="mt-1 text-xs text-gray-600">
                                        Causal tier: {strategic.causalLabel} /{' '}
                                        {CAUSAL_BASIS_LABEL[strategic.causalBasis]} / score{' '}
                                        {strategic.causalTriangulationScore}/4
                                      </p>
                                    ) : null}
                                    {strategic?.glmHighlights?.length ? (
                                      <p className="mt-1 text-xs text-gray-600">
                                        GLM全量ハイライト:{' '}
                                        {strategic.glmHighlights
                                          .map((item) => `${item.id} ${item.summary}`)
                                          .join(' / ')}
                                      </p>
                                    ) : null}
                                    {strategic?.claimHighlights?.length ? (
                                      <p className="mt-1 text-xs text-gray-600">
                                        claimsハイライト: {strategic.claimHighlights.join(' / ')}
                                      </p>
                                    ) : null}
                                    {strategic?.data2NarrativeHighlights?.length ? (
                                      <p className="mt-1 text-xs text-gray-600">
                                        data2ナラティブ要約:{' '}
                                        {strategic.data2NarrativeHighlights.join(' / ')}
                                      </p>
                                    ) : null}
                                    <p className="mt-1 text-xs text-gray-600">
                                      GLM legacy anchor: {card.evidenceTrace.glm.join(', ')}
                                    </p>
                                    {strategic?.claimIds?.length ? (
                                      <p className="text-xs text-gray-600">
                                        Top Claim IDs: {strategic.claimIds.join(', ')}
                                      </p>
                                    ) : null}
                                    {strategic?.evidenceLanes?.length ? (
                                      <p className="text-xs text-gray-600">
                                        Claim lanes:{' '}
                                        {strategic.evidenceLanes
                                          .map((lane) => EVIDENCE_LANE_LABEL[lane] || lane)
                                          .join(', ')}
                                      </p>
                                    ) : null}
                                    <p className="text-xs text-gray-600">
                                      Claim IDs: {card.evidenceTrace.claimIds.join(', ')}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Source regions: {card.evidenceTrace.sourceRegions.join(', ')}
                                    </p>
                                  </div>
                                </div>
                              </details>
                            </>
                          );
                        })()}
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
          <h3 className="text-lg font-bold text-cyan-900">カバレッジ検査（自動）</h3>
          <p className="mt-2 text-sm text-cyan-900/90 leading-relaxed">
            `knowledge-claims.jsonl`
            の障害facet分布と、このページのパターン分布を並べて監査しています。
            偏りやノイズを隠さず表示し、次スプリントの改善対象を明確化します。
          </p>
          {coverageAudit ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white bg-white p-3">
                  <p className="text-[11px] text-cyan-700">Claims総数</p>
                  <p className="mt-1 text-xl font-extrabold text-cyan-900">
                    {coverageAudit.totalClaims.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-white bg-white p-3">
                  <p className="text-[11px] text-cyan-700">ノイズ推定比率</p>
                  <p className="mt-1 text-xl font-extrabold text-cyan-900">
                    {(coverageAudit.noisyClaimRatio * 100).toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-cyan-700">
                    ({coverageAudit.noisyClaimCount.toLocaleString()} /{' '}
                    {coverageAudit.totalClaims.toLocaleString()})
                  </p>
                </div>
                <div className="rounded-xl border border-white bg-white p-3">
                  <p className="text-[11px] text-cyan-700">パターン総数</p>
                  <p className="mt-1 text-xl font-extrabold text-cyan-900">
                    {PATTERN_CARDS.length.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-200 bg-white p-3">
                <p className="text-sm font-semibold text-cyan-900">
                  障害領域ごとの分布（Data vs Guide）
                </p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {PRIORITY_FACETS.map((facet) => (
                    <div
                      key={facet}
                      className="rounded-lg border border-cyan-100 bg-cyan-50/40 px-3 py-2 text-xs text-cyan-900"
                    >
                      <p className="font-semibold">{DISABILITY_FACET_LABEL[facet]}</p>
                      <p className="mt-0.5">
                        Data: {(coverageAudit.disabilityFacetCounts[facet] || 0).toLocaleString()} /
                        Guide: {(patternFacetCounts[facet] || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-cyan-200 bg-white p-3">
                <p className="text-sm font-semibold text-cyan-900">根拠レーン分布（claims）</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(coverageAudit.evidenceLaneCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([lane, count]) => (
                      <span
                        key={lane}
                        className="inline-flex rounded-md border border-cyan-100 bg-cyan-50/40 px-2 py-1 text-xs text-cyan-900"
                      >
                        {EVIDENCE_LANE_LABEL[lane] || lane}: {count.toLocaleString()}
                      </span>
                    ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-900">
                    Data欠落facet（要収集・要抽出改善）
                  </p>
                  <p className="mt-1 text-xs text-amber-800">
                    {coverageAudit.missingDataFacets.length > 0
                      ? coverageAudit.missingDataFacets
                          .map((facet) => DISABILITY_FACET_LABEL[facet])
                          .join(' / ')
                      : 'なし'}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-900">
                    Guide欠落facet（要コンテンツ拡張）
                  </p>
                  <p className="mt-1 text-xs text-amber-800">
                    {coverageAudit.missingPatternFacets.length > 0
                      ? coverageAudit.missingPatternFacets
                          .map((facet) => DISABILITY_FACET_LABEL[facet])
                          .join(' / ')
                      : 'なし'}
                  </p>
                </div>
              </div>

              {coverageAudit.topNoisySources.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-xs font-semibold text-rose-900">
                    ノイズ上位ソース（要クリーニング）
                  </p>
                  <div className="mt-2 space-y-1">
                    {coverageAudit.topNoisySources.map((item) => (
                      <p key={item.sourceId} className="text-xs text-rose-800">
                        {item.sourceId}: {(item.ratio * 100).toFixed(1)}% ({item.count}件)
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-cyan-900">
              カバレッジ監査データの読み込みに失敗しました。
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-amber-900">このページの境界</h3>
          <p className="mt-2 text-sm text-amber-800 leading-relaxed">
            本ガイドは一般理解促進を目的とした情報提供であり、医療判断・法的判断そのものを代替しません。
            具体適用には、本人状況、業務要件、環境条件、既存支援、法域を確認してください。
          </p>
          <div className="mt-3 rounded-xl border border-amber-300 bg-white/70 p-3">
            <p className="text-xs font-semibold text-amber-900">
              最低限確認する観点: person / job / environment / support / time / institution /
              evidence
            </p>
            <p className="mt-1 text-xs text-amber-800">
              いずれかが欠ける場合は、断定提案より先に追加質問を優先してください。
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/jac"
              className="rounded-full bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800"
            >
              条件を確認しながらJACで個別相談する
            </Link>
            <Link
              href="/jac/guidebook"
              className="rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
            >
              26フレーム実装ガイドブック（電子版）
            </Link>
            <Link
              href="/"
              className="rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
            >
              トップページへ戻る
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

let cachedGuidePropsPromise: Promise<GuideProps> | null = null;

async function buildGuideProps(): Promise<GuideProps> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  let manifest: ManifestSnapshot | null = null;
  let coverageAudit: CoverageAuditSnapshot | null = null;
  let data2Stats: Data2Stats | null = null;
  const claimRows: KnowledgeClaimRow[] = [];
  let data2Entries: Data2IndexEntry[] = [];
  let cardStrategicInsights: Record<string, GuideCardStrategicInsight> = {};
  let patternCoverage: PatternCoverageSnapshot | null = null;
  let claimsGlmCoverage: ClaimsGlmCoverageSnapshot | null = null;
  let glmWorkbookMetrics: GlmWorkbookMetrics | null = null;
  let glmSignificantRelations: GlmSignificantRelation[] = [];
  let commonWorkCopy: Record<string, GuideCommonWorkDesignCopyRow> = {};
  let layerDisposition: Record<string, GuideLayerDispositionRow> = {};

  try {
    const manifestPath = path.join(
      process.cwd(),
      'references',
      'index',
      'knowledge-claims-manifest.json',
    );
    const raw = await fs.readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw) as ManifestSnapshot;
  } catch {
    manifest = null;
  }

  try {
    const claimsPath = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');
    const raw = await fs.readFile(claimsPath, 'utf8');
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const noisyRegex =
      /(close menu|toggle navigation|skip to main content|サイトマップ|検索結果|本文へ|文字サイズ変更|背景色変更|for employers|for individuals|all rights reserved|copyright|メニュー\s*閉じる)/i;

    const facetCounts: Record<string, number> = {};
    const evidenceLaneCounts: Record<string, number> = {};
    const sourceStats: Record<string, { all: number; noisy: number }> = {};
    let noisyClaimCount = 0;

    for (const line of lines) {
      let row: KnowledgeClaimRow;
      try {
        row = JSON.parse(line) as KnowledgeClaimRow;
      } catch {
        continue;
      }

      claimRows.push(row);

      const statement = String(row?.statement || '');
      const sourceId = String(row?.sourceIds?.[0] || 'unknown');
      const facets = Array.isArray(row?.interactionContextSummary?.disabilityFacets)
        ? row.interactionContextSummary.disabilityFacets
        : [];
      const evidenceLane = normalizeEvidenceLane(row?.interactionContextSummary?.evidenceLane);

      sourceStats[sourceId] = sourceStats[sourceId] || { all: 0, noisy: 0 };
      sourceStats[sourceId].all += 1;
      evidenceLaneCounts[evidenceLane] = (evidenceLaneCounts[evidenceLane] || 0) + 1;

      facets.forEach((facet: string) => {
        facetCounts[facet] = (facetCounts[facet] || 0) + 1;
      });

      if (noisyRegex.test(statement)) {
        noisyClaimCount += 1;
        sourceStats[sourceId].noisy += 1;
      }
    }

    const patternFacetCounts: Record<string, number> = {};
    Object.values(PATTERN_DISABILITY_FACETS).forEach((facets) => {
      facets.forEach((facet) => {
        patternFacetCounts[facet] = (patternFacetCounts[facet] || 0) + 1;
      });
    });

    const missingDataFacets = PRIORITY_FACETS.filter((facet) => !facetCounts[facet]);
    const missingPatternFacets = PRIORITY_FACETS.filter((facet) => !patternFacetCounts[facet]);

    const topNoisySources = Object.entries(sourceStats)
      .map(([sourceId, stats]) => ({
        sourceId,
        count: stats.noisy,
        ratio: stats.all === 0 ? 0 : Number((stats.noisy / stats.all).toFixed(3)),
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
        return b.count - a.count;
      })
      .slice(0, 5);

    coverageAudit = {
      totalClaims: lines.length,
      noisyClaimCount,
      noisyClaimRatio: lines.length === 0 ? 0 : Number((noisyClaimCount / lines.length).toFixed(3)),
      disabilityFacetCounts: facetCounts,
      evidenceLaneCounts,
      topNoisySources,
      missingDataFacets,
      missingPatternFacets,
    };
  } catch {
    coverageAudit = null;
  }

  try {
    const data2IndexPath = path.join(
      process.cwd(),
      'references',
      'data2',
      'index',
      'data2-knowledge-index.json',
    );
    const raw = await fs.readFile(data2IndexPath, 'utf8');
    const parsed = JSON.parse(raw) as {
      generatedAt?: string;
      counts?: { entries?: number };
      entries?: Array<{
        disability?: string;
        issues?: Array<{ supports?: string[] }>;
        narrativeHighlights?: string[];
      }>;
    };

    const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
    data2Entries = entries as Data2IndexEntry[];
    const disabilitySet = new Set<string>();
    const supportSet = new Set<string>();
    let issueCount = 0;
    let narrativeCount = 0;

    entries.forEach((entry) => {
      const disability = String(entry?.disability || '').trim();
      if (disability) disabilitySet.add(disability);

      const issues = Array.isArray(entry?.issues) ? entry.issues : [];
      issueCount += issues.length;
      issues.forEach((issue) => {
        const supports = Array.isArray(issue?.supports) ? issue.supports : [];
        supports.forEach((support) => {
          const text = String(support || '').trim();
          if (text) supportSet.add(text);
        });
      });

      const narratives = Array.isArray(entry?.narrativeHighlights) ? entry.narrativeHighlights : [];
      narrativeCount += narratives.filter((line) => String(line || '').trim().length > 0).length;
    });

    data2Stats = {
      entryCount: Number(parsed.counts?.entries || entries.length),
      disabilityCount: disabilitySet.size,
      issueCount,
      supportCount: supportSet.size,
      narrativeCount,
      generatedAt: parsed.generatedAt || null,
    };
  } catch {
    data2Stats = null;
  }

  try {
    const glmMetricsPath = path.join(
      process.cwd(),
      'references',
      'GLM_resutls',
      'nanbyo-glm-metrics.json',
    );
    const raw = await fs.readFile(glmMetricsPath, 'utf8');
    glmWorkbookMetrics = JSON.parse(raw) as GlmWorkbookMetrics;
  } catch {
    glmWorkbookMetrics = null;
  }

  try {
    const glmRelationsPath = path.join(
      process.cwd(),
      'references',
      'GLM_resutls',
      'nanbyo-glm-significant-relations.json',
    );
    const raw = await fs.readFile(glmRelationsPath, 'utf8');
    const parsed = JSON.parse(raw) as GlmSignificantRelationsPayload | GlmSignificantRelation[];
    const relations = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.relations)
        ? parsed.relations
        : [];
    glmSignificantRelations = relations
      .map((row) => ({
        id: String(row?.id || '').trim(),
        sheet: String(row?.sheet || '').trim() || undefined,
        sheetOrder: Number(row?.sheetOrder || 0) || undefined,
        predictor: String(row?.predictor || '').trim() || undefined,
        predictorGroup: String(row?.predictorGroup || '').trim() || undefined,
        outcome: String(row?.outcome || '').trim() || undefined,
        p: Number.isFinite(Number(row?.p)) ? Number(row?.p) : undefined,
        b: Number.isFinite(Number(row?.b)) ? Number(row?.b) : undefined,
        direction: String(row?.direction || '').trim() || undefined,
        summary: String(row?.summary || '').trim() || undefined,
        keywords: Array.isArray(row?.keywords)
          ? row.keywords.map((v) => String(v || '').trim()).filter(Boolean)
          : undefined,
      }))
      .filter((row) => row.id);
  } catch {
    glmSignificantRelations = [];
  }

  try {
    const commonCopyPath = path.join(
      process.cwd(),
      'references',
      'jac',
      'common-work-design-copy.json',
    );
    const raw = await fs.readFile(commonCopyPath, 'utf8');
    const parsed = JSON.parse(raw) as { cards?: CommonWorkDesignCopyRow[] };
    const rows = Array.isArray(parsed?.cards) ? parsed.cards : [];
    commonWorkCopy = Object.fromEntries(
      rows
        .map((row) => [String(row?.id || ''), toGuideCommonWorkDesignCopyRow(row)] as const)
        .filter((entry) => Boolean(entry[0]) && Object.keys(entry[1]).length > 0),
    );
  } catch {
    commonWorkCopy = {};
  }

  try {
    const layerDispositionPath = path.join(
      process.cwd(),
      'references',
      'jac',
      'layer-disposition.json',
    );
    const raw = await fs.readFile(layerDispositionPath, 'utf8');
    const parsed = JSON.parse(raw) as { cards?: LayerDispositionRow[] };
    const rows = Array.isArray(parsed?.cards) ? parsed.cards : [];
    layerDisposition = Object.fromEntries(
      rows
        .map((row) => [String(row?.cardId || ''), toGuideLayerDispositionRow(row)] as const)
        .filter((entry) => Boolean(entry[0]) && Object.keys(entry[1]).length > 0),
    );
  } catch {
    layerDisposition = {};
  }

  if (claimRows.length > 0 || data2Entries.length > 0) {
    const next: Record<string, GuideCardStrategicInsight> = {};
    for (const card of PATTERN_CARDS) {
      next[card.id] = toGuideCardStrategicInsight(
        buildCardStrategicInsight(card, data2Entries, claimRows, glmSignificantRelations),
      );
    }
    cardStrategicInsights = next;
  }

  if (data2Entries.length > 0) {
    patternCoverage = computePatternCoverageSnapshot(data2Entries);
  }
  if (claimRows.length > 0) {
    claimsGlmCoverage = computeClaimsGlmCoverageSnapshot(
      claimRows,
      glmWorkbookMetrics,
      patternCoverage,
      glmSignificantRelations,
    );
  }

  return {
    manifest,
    coverageAudit,
    data2Stats,
    cardStrategicInsights,
    patternCoverage,
    claimsGlmCoverage,
    commonWorkCopy,
    layerDisposition,
  };
}

export const getServerSideProps: GetServerSideProps<GuideProps> = async () => {
  if (!cachedGuidePropsPromise) {
    cachedGuidePropsPromise = buildGuideProps();
  }

  return {
    props: await cachedGuidePropsPromise,
  };
};
