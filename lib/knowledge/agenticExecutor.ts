import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  KnowledgeSafetyGate,
  KnowledgeSafetyGateMode,
  PlannerOutput,
  PlannerStepProgress,
} from '@/lib/knowledge/types';
import { getKnowledgeSourceById } from '@/lib/knowledge/sourceRegistry';

export type EvidenceItem = {
  id: string;
  sourceId: string;
  filePath: string;
  excerpt: string;
  score: number;
};

export type AgenticExecutionContext = {
  query: string;
  keywords: string[];
  maxFiles?: number;
};

export type AgenticExecutionResult = {
  stepProgress: PlannerStepProgress[];
  evidence: EvidenceItem[];
  step4Evidence: EvidenceItem[];
  step4ClaimIds: string[];
  structuredSummary: string[];
  policyNotes: string[];
  safetyGate: KnowledgeSafetyGate;
};

type NormalizedRecord = {
  id: string;
  sourceId: string;
  filePath: string;
  extension: string;
  contentType: string;
  text: string;
  interactionContext?: {
    language?: string;
    country?: string;
    legalContext?: string;
    trustTier?: string;
    sourceUrl?: string | null;
    finalUrl?: string | null;
    fetchedAt?: string | null;
    pageType?: string;
    evidenceScope?: string;
    interactionModelSignals?: Record<string, boolean>;
    supportTypeHints?: string[];
    disabilityHints?: string[];
    disabilityFacets?: string[];
    industryFacets?: string[];
    companySizeFacets?: string[];
    accommodationFacets?: string[];
    outcomeFacets?: string[];
  };
};

type EmbeddingRow = {
  id: string;
  vector: number[];
};

type Manifest = {
  generatedAt: string;
  root: string;
  fileCount: number;
  recordCount: number;
  byExtension: Record<string, number>;
  byContentType?: Record<string, number>;
  bySourceId?: Record<string, number>;
  byLanguage?: Record<string, number>;
  byCountry?: Record<string, number>;
  byModelSignal?: Record<string, number>;
  metadataOnlyCount?: number;
  extractionCoveragePct?: number;
  warnings: Array<{ filePath: string; warning: string }>;
};

const NORMALIZED_RECORDS_PATH = path.join(
  process.cwd(),
  'references',
  'index',
  'normalized-records.jsonl',
);
const EMBEDDINGS_PATH = path.join(process.cwd(), 'references', 'index', 'embeddings.jsonl');
const MANIFEST_PATH = path.join(process.cwd(), 'references', 'index', 'normalized-manifest.json');
const CLAIMS_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');
const EMBEDDINGS_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_TIMEOUT_MS = 6000;
const BM25_K1 = 1.5;
const BM25_B = 0.75;
const INTERACTION_SIGNAL_HINTS: Record<string, string[]> = {
  difficulty_occurrence: ['困難', '困り', '発生', 'barrier', 'limitation', 'problem'],
  difficulty_resolution: ['解決', '改善', '軽減', 'mitigation', 'solution', 'resolve'],
  symptom_exacerbation: ['症状', '悪化', '疲労', 'flare', 'symptom', 'worsen'],
  support_needs: ['必要', 'ニーズ', '配慮', '支援', 'need', 'accommodation', 'support'],
};

const DISABILITY_FACET_HINTS: Record<string, string[]> = {
  physical: ['肢体', 'physical', 'mobility', 'wheelchair', '車いす', '歩行'],
  visual: ['視覚', 'visual', 'blind', 'low vision', '弱視'],
  hearing: ['聴覚', 'hearing', 'deaf', '難聴', '手話', 'caption'],
  mental: [
    '精神',
    'mental',
    'depression',
    'anxiety',
    '統合失調症',
    '気分障害',
    'bipolar',
    'psychosis',
  ],
  developmental: ['発達', 'developmental', 'autism', 'adhd', 'asd', '神経発達'],
  intellectual: ['知的', 'intellectual', '認知的支援'],
  internal: ['内部', '難病', 'chronic', 'autoimmune', '透析', 'dialysis', 'ペースメーカー', 'pacemaker'],
  higher_brain: [
    '高次脳',
    '高次脳機能',
    '脳卒中',
    '脳血管',
    '脳梗塞',
    '脳出血',
    '外傷性脳損傷',
    '頭部外傷',
    '失語',
    '注意障害',
    '注意機能障害',
    '記憶障害',
    '記憶機能障害',
    '見当識障害',
    '遂行機能',
    '半側空間無視',
    'brain injury',
    'traumatic brain injury',
    'tbi',
    'stroke',
    'cerebrovascular',
    'aphasia',
    'cognitive impairment',
    'neurocognitive',
    'attention impairment',
    'attention deficit',
    'memory impairment',
    'orientation disorder',
    'executive dysfunction',
    'hemispatial neglect',
  ],
};

const INDUSTRY_FACET_HINTS: Record<string, string[]> = {
  manufacturing: ['製造', 'manufacturing', 'factory'],
  retail_wholesale: ['卸売', '小売', 'retail', 'wholesale', 'store'],
  healthcare_welfare: ['医療', '福祉', 'healthcare', 'hospital', 'care'],
  transport_logistics: ['運輸', '物流', 'transport', 'logistics'],
  construction: ['建設', 'construction'],
  service: ['サービス', 'service'],
  education: ['教育', 'school', 'education'],
  public_sector: ['自治体', '官公庁', 'public', 'government'],
};

const ACCOMMODATION_FACET_HINTS: Record<string, string[]> = {
  schedule_flexibility: [
    '時差',
    '短時間',
    '勤務時間',
    'telework',
    'work from home',
    'flexible schedule',
  ],
  task_redesign: ['業務調整', '配置転換', 'job redesign', 'task'],
  environment_control: ['環境', '騒音', '照明', 'air quality', 'noise', 'lighting'],
  communication_support: ['筆談', '手話', '通訳', 'communication', 'interpreter'],
  assistive_technology: ['支援機器', 'assistive', 'screen reader', 'software'],
  policy_and_training: ['方針', '研修', 'policy', 'training'],
};

type KnowledgeClaimRow = {
  id: string;
  evidenceRecordIds?: string[];
  risk?: {
    level?: 'low' | 'medium' | 'high';
    reasons?: string[];
  };
  applicability?: {
    isPartial?: boolean;
    missingContexts?: string[];
  };
  interactionContextSummary?: {
    evidenceScopes?: string[];
    evidenceLane?: string;
  };
};

let claimsByRecordIdPromise: Promise<Map<string, KnowledgeClaimRow[]>> | null = null;

type RetrievalProfile = {
  requestedSignals: Set<string>;
  asksAccommodation: boolean;
  prefersJapanese: boolean;
  prefersEnglish: boolean;
  requestedDisabilityFacets: Set<string>;
  requestedIndustryFacets: Set<string>;
  requestedAccommodationFacets: Set<string>;
};

function normalizeKeywords(input: string[]): string[] {
  const compact = input
    .flatMap((value) => value.split(/[\s、。,.()\[\]「」\n\r\t]+/))
    .map((value) => value.trim())
    .filter((value) => value.length >= 2);

  return Array.from(new Set(compact)).slice(0, 40);
}

function generateLooseKeywords(input: string[]): string[] {
  const seeds = input
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter((value) => value.length >= 2)
    .slice(0, 8);

  const chunks: string[] = [];
  for (const seed of seeds) {
    const plain = seed.replace(/[、。,.()\[\]「」]/g, '');
    if (plain.length < 2) continue;
    for (let i = 0; i < plain.length - 1 && chunks.length < 120; i += 1) {
      chunks.push(plain.slice(i, i + 2));
    }
    for (let i = 0; i < plain.length - 2 && chunks.length < 180; i += 2) {
      chunks.push(plain.slice(i, i + 3));
    }
  }

  return Array.from(new Set(chunks))
    .filter((term) => term.length >= 2)
    .slice(0, 120);
}

function countTermOccurrences(content: string, term: string): number {
  if (!term || term.length === 0) return 0;

  let count = 0;
  let from = 0;
  while (from < content.length) {
    const index = content.indexOf(term, from);
    if (index === -1) break;
    count += 1;
    from = index + term.length;
  }

  return count;
}

type LexicalContext = {
  idfByKeyword: Map<string, number>;
  avgDocLength: number;
};

function buildLexicalContext(records: NormalizedRecord[], keywords: string[]): LexicalContext {
  const idfByKeyword = new Map<string, number>();
  const docCount = records.length || 1;
  const avgDocLength =
    records.length === 0
      ? 1
      : records.reduce((sum, record) => sum + Math.max(record.text.length, 1), 0) / records.length;

  for (const keyword of keywords) {
    let df = 0;
    for (const record of records) {
      if (record.text.includes(keyword)) {
        df += 1;
      }
    }

    const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
    idfByKeyword.set(keyword, Number.isFinite(idf) ? idf : 0);
  }

  return {
    idfByKeyword,
    avgDocLength: avgDocLength > 0 ? avgDocLength : 1,
  };
}

function scoreByBm25(content: string, keywords: string[], lexicalContext: LexicalContext): number {
  const dl = Math.max(content.length, 1);
  let score = 0;

  for (const keyword of keywords) {
    const tf = countTermOccurrences(content, keyword);
    if (tf === 0) continue;

    const idf = lexicalContext.idfByKeyword.get(keyword) || 0;
    const numerator = tf * (BM25_K1 + 1);
    const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (dl / lexicalContext.avgDocLength));
    score += idf * (numerator / denominator);
  }

  return Number(score.toFixed(6));
}

function filterRecordsBySourceIds(
  records: NormalizedRecord[],
  sourceIds: string[],
): NormalizedRecord[] {
  if (!sourceIds || sourceIds.length === 0) return records;
  const allow = new Set(sourceIds);
  return records.filter((record) => allow.has(record.sourceId));
}

function filterSearchableRecords(records: NormalizedRecord[]): NormalizedRecord[] {
  return records.filter((record) => record.contentType !== 'metadata_only');
}

function pickSearchCandidates(
  records: NormalizedRecord[],
  keywords: string[],
  maxRecords?: number,
): NormalizedRecord[] {
  if (!maxRecords || maxRecords <= 0 || records.length <= maxRecords) {
    return records;
  }

  const ranked = records
    .map((record) => ({
      record,
      signal: keywords.reduce(
        (count, keyword) => count + (record.text.includes(keyword) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.signal - a.signal);

  return ranked.slice(0, maxRecords).map((item) => item.record);
}

function extractBestExcerpt(content: string, keywords: string[]): string {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (keywords.some((keyword) => line.includes(keyword))) {
      return line.slice(0, 220);
    }
  }

  return content.replace(/\s+/g, ' ').trim().slice(0, 220);
}

function sourceKind(sourceId: string): string {
  return getKnowledgeSourceById(sourceId)?.kind || 'unknown';
}

type RebalanceEvidenceOptions = {
  maxPerSource?: number;
  websiteQuota?: number;
  candidatePoolSize?: number;
  minDistinctSources?: number;
  minDistinctWebsiteSources?: number;
};

function collectRebalanceCandidates(
  rankedEvidence: EvidenceItem[],
  limit: number,
  options?: RebalanceEvidenceOptions,
): EvidenceItem[] {
  const candidatePoolSize = Math.max(limit, Number(options?.candidatePoolSize || 48));
  const minDistinctSources = Math.max(0, Number(options?.minDistinctSources || 0));
  const minDistinctWebsiteSources = Math.max(0, Number(options?.minDistinctWebsiteSources || 0));

  if (minDistinctSources === 0 && minDistinctWebsiteSources === 0) {
    return (rankedEvidence || []).slice(0, candidatePoolSize);
  }

  const seenSources = new Set<string>();
  const seenWebsiteSources = new Set<string>();
  let endIndex = 0;

  while (endIndex < rankedEvidence.length && endIndex < candidatePoolSize) {
    const item = rankedEvidence[endIndex];
    seenSources.add(item.sourceId);
    if (sourceKind(item.sourceId) === 'website') {
      seenWebsiteSources.add(item.sourceId);
    }
    endIndex += 1;
  }

  while (
    endIndex < rankedEvidence.length &&
    (seenSources.size < minDistinctSources || seenWebsiteSources.size < minDistinctWebsiteSources)
  ) {
    const item = rankedEvidence[endIndex];
    seenSources.add(item.sourceId);
    if (sourceKind(item.sourceId) === 'website') {
      seenWebsiteSources.add(item.sourceId);
    }
    endIndex += 1;
  }

  return rankedEvidence.slice(0, endIndex);
}

function appendUniqueSourceIds(target: string[], seen: Set<string>, sourceIds: string[]): void {
  for (const sourceId of sourceIds) {
    if (seen.has(sourceId)) continue;
    seen.add(sourceId);
    target.push(sourceId);
  }
}

export function rebalanceEvidenceBySource(
  rankedEvidence: EvidenceItem[],
  limit = 16,
  options?: RebalanceEvidenceOptions,
): EvidenceItem[] {
  const maxPerSource = Math.max(1, Number(options?.maxPerSource || 3));
  const websiteQuota = Math.max(0, Number(options?.websiteQuota || 6));
  const minDistinctSources = Math.max(0, Number(options?.minDistinctSources || 0));
  const minDistinctWebsiteSources = Math.max(0, Number(options?.minDistinctWebsiteSources || 0));
  const candidates = collectRebalanceCandidates(rankedEvidence || [], limit, options);
  const buckets = new Map<string, EvidenceItem[]>();
  const cursors = new Map<string, number>();
  const counts = new Map<string, number>();
  const selected = new Set<string>();
  const selectedSourceIds = new Set<string>();
  const selectedWebsiteSourceIds = new Set<string>();
  const result: EvidenceItem[] = [];

  for (const item of candidates) {
    const bucket = buckets.get(item.sourceId) || [];
    bucket.push(item);
    buckets.set(item.sourceId, bucket);
  }

  const sourceOrder = [...buckets.entries()]
    .sort((a, b) => {
      const scoreDiff = Number(b[1][0]?.score || 0) - Number(a[1][0]?.score || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return a[0].localeCompare(b[0], 'ja');
    })
    .map(([sourceId]) => sourceId);
  const websiteSourceOrder = sourceOrder.filter((sourceId) => sourceKind(sourceId) === 'website');
  const prioritizedSourceOrder: string[] = [];
  const prioritizedSourceIds = new Set<string>();

  if (minDistinctWebsiteSources > 0) {
    appendUniqueSourceIds(
      prioritizedSourceOrder,
      prioritizedSourceIds,
      websiteSourceOrder.slice(0, minDistinctWebsiteSources),
    );
  }

  if (minDistinctSources > 0) {
    for (const sourceId of sourceOrder) {
      if (prioritizedSourceOrder.length >= minDistinctSources) break;
      appendUniqueSourceIds(prioritizedSourceOrder, prioritizedSourceIds, [sourceId]);
    }
  }

  appendUniqueSourceIds(prioritizedSourceOrder, prioritizedSourceIds, sourceOrder);

  const pushNextFromSource = (sourceId: string) => {
    const bucket = buckets.get(sourceId) || [];
    const cursor = Number(cursors.get(sourceId) || 0);
    if (cursor >= bucket.length) return false;
    if (Number(counts.get(sourceId) || 0) >= maxPerSource) return false;
    const candidate = bucket[cursor];
    cursors.set(sourceId, cursor + 1);
    if (!candidate || selected.has(candidate.id)) return false;
    selected.add(candidate.id);
    counts.set(sourceId, Number(counts.get(sourceId) || 0) + 1);
    result.push(candidate);
    selectedSourceIds.add(sourceId);
    if (sourceKind(sourceId) === 'website') {
      selectedWebsiteSourceIds.add(sourceId);
    }
    return true;
  };

  for (const sourceId of prioritizedSourceOrder) {
    if (result.length >= limit) break;
    pushNextFromSource(sourceId);
  }

  if (result.length < limit && minDistinctWebsiteSources > 0) {
    for (const sourceId of websiteSourceOrder) {
      if (result.length >= limit || selectedWebsiteSourceIds.size >= minDistinctWebsiteSources) break;
      if (selectedWebsiteSourceIds.has(sourceId)) continue;
      pushNextFromSource(sourceId);
    }
  }

  if (result.length < limit && minDistinctSources > 0) {
    for (const sourceId of sourceOrder) {
      if (result.length >= limit || selectedSourceIds.size >= minDistinctSources) break;
      if (selectedSourceIds.has(sourceId)) continue;
      pushNextFromSource(sourceId);
    }
  }

  let currentWebsiteCount = result.filter((item) => sourceKind(item.sourceId) === 'website').length;
  while (result.length < limit && currentWebsiteCount < websiteQuota) {
    let progressed = false;
    for (const sourceId of websiteSourceOrder) {
      if (result.length >= limit || currentWebsiteCount >= websiteQuota) break;
      if (!pushNextFromSource(sourceId)) continue;
      currentWebsiteCount += 1;
      progressed = true;
    }
    if (!progressed) break;
  }

  for (const item of candidates) {
    if (result.length >= limit) break;
    if (selected.has(item.id)) continue;
    if (Number(counts.get(item.sourceId) || 0) >= maxPerSource) continue;
    selected.add(item.id);
    counts.set(item.sourceId, Number(counts.get(item.sourceId) || 0) + 1);
    result.push(item);
  }

  return result.slice(0, limit);
}

function detectRequestedSignals(query: string, keywords: string[]): Set<string> {
  const normalized = [query, ...keywords].join(' ').toLowerCase();
  const active = new Set<string>();

  for (const [signal, hints] of Object.entries(INTERACTION_SIGNAL_HINTS)) {
    if (hints.some((hint) => normalized.includes(hint.toLowerCase()))) {
      active.add(signal);
    }
  }

  return active;
}

function detectRequestedFacets(
  query: string,
  keywords: string[],
  hints: Record<string, string[]>,
): Set<string> {
  const normalized = [query, ...keywords].join(' ').toLowerCase();
  const active = new Set<string>();

  for (const [facet, facetHints] of Object.entries(hints)) {
    if (facetHints.some((hint) => normalized.includes(hint.toLowerCase()))) {
      active.add(facet);
    }
  }

  return active;
}

function hasJapanese(text: string): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

function hasLatin(text: string): boolean {
  return /[A-Za-z]/.test(text);
}

function buildRetrievalProfile(query: string, keywords: string[]): RetrievalProfile {
  const normalized = [query, ...keywords].join(' ').toLowerCase();
  return {
    requestedSignals: detectRequestedSignals(query, keywords),
    asksAccommodation:
      normalized.includes('合理的配慮') ||
      normalized.includes('配慮') ||
      normalized.includes('accommodation') ||
      normalized.includes('adjustment') ||
      normalized.includes('support'),
    prefersJapanese: hasJapanese(query),
    prefersEnglish: !hasJapanese(query) && hasLatin(query),
    requestedDisabilityFacets: detectRequestedFacets(query, keywords, DISABILITY_FACET_HINTS),
    requestedIndustryFacets: detectRequestedFacets(query, keywords, INDUSTRY_FACET_HINTS),
    requestedAccommodationFacets: detectRequestedFacets(query, keywords, ACCOMMODATION_FACET_HINTS),
  };
}

function computeInteractionBoost(record: NormalizedRecord, profile: RetrievalProfile): number {
  const context = record.interactionContext;
  if (!context) return 0;

  let boost = 0;

  const signals = context.interactionModelSignals || {};
  for (const signal of profile.requestedSignals) {
    if (signals[signal]) {
      boost += 0.18;
    }
  }

  if (
    profile.asksAccommodation &&
    Array.isArray(context.supportTypeHints) &&
    context.supportTypeHints.length > 0
  ) {
    boost += 0.08;
  }

  if (profile.prefersJapanese && context.language === 'ja') {
    boost += 0.06;
  }

  if (profile.prefersEnglish && context.language === 'en') {
    boost += 0.04;
  }

  if (record.contentType === 'web_reference') {
    boost += 0.05;
  }

  if (context.trustTier === 'primary') {
    boost += 0.03;
  }

  if (context.evidenceScope === 'specific_case') {
    boost += 0.06;
  } else if (context.evidenceScope === 'aggregated_index') {
    boost -= 0.08;
  }

  const disabilityFacets = context.disabilityFacets || context.disabilityHints || [];
  for (const requested of profile.requestedDisabilityFacets) {
    if (disabilityFacets.includes(requested)) {
      boost += 0.12;
    }
  }

  const industryFacets = context.industryFacets || [];
  for (const requested of profile.requestedIndustryFacets) {
    if (industryFacets.includes(requested)) {
      boost += 0.08;
    }
  }

  const accommodationFacets = context.accommodationFacets || context.supportTypeHints || [];
  for (const requested of profile.requestedAccommodationFacets) {
    if (accommodationFacets.includes(requested)) {
      boost += 0.1;
    }
  }

  return boost;
}

function applyLexicalBoost(
  baseScore: number,
  record: NormalizedRecord,
  profile: RetrievalProfile,
): number {
  if (baseScore <= 0) return 0;
  const interactionBoost = computeInteractionBoost(record, profile);
  const boosted = baseScore * (1 + interactionBoost);
  return Number(boosted.toFixed(6));
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function readJsonLines<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as T);
  } catch {
    return [];
  }
}

async function readNormalizedRecords(): Promise<NormalizedRecord[]> {
  const rows = await readJsonLines<NormalizedRecord>(NORMALIZED_RECORDS_PATH);
  return rows.filter((row) => typeof row.text === 'string' && row.text.trim().length > 0);
}

async function readEmbeddingMap(): Promise<Map<string, number[]>> {
  const rows = await readJsonLines<EmbeddingRow>(EMBEDDINGS_PATH);
  return new Map(rows.map((row) => [row.id, row.vector]));
}

async function readManifest(): Promise<Manifest | null> {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw) as Manifest;
  } catch {
    return null;
  }
}

async function readClaimsByRecordId(): Promise<Map<string, KnowledgeClaimRow[]>> {
  if (claimsByRecordIdPromise) {
    return claimsByRecordIdPromise;
  }

  claimsByRecordIdPromise = readJsonLines<KnowledgeClaimRow>(CLAIMS_PATH)
    .then((rows) => {
      const map = new Map<string, KnowledgeClaimRow[]>();
      for (const row of rows) {
        if (!row?.id || !Array.isArray(row.evidenceRecordIds)) continue;
        for (const recordId of row.evidenceRecordIds) {
          if (!recordId) continue;
          const bucket = map.get(recordId) || [];
          bucket.push(row);
          map.set(recordId, bucket);
        }
      }
      return map;
    })
    .catch(() => new Map<string, KnowledgeClaimRow[]>());

  return claimsByRecordIdPromise;
}

function collectMatchedClaims(
  evidence: EvidenceItem[],
  claimsByRecordId: Map<string, KnowledgeClaimRow[]>,
): KnowledgeClaimRow[] {
  if (claimsByRecordId.size === 0 || evidence.length === 0) {
    return [];
  }

  const byId = new Map<string, KnowledgeClaimRow>();
  for (const item of evidence) {
    const claimRows = claimsByRecordId.get(item.id) || [];
    for (const claim of claimRows) {
      byId.set(claim.id, claim);
    }
  }

  return Array.from(byId.values());
}

function buildSafetyGate(
  evidence: EvidenceItem[],
  matchedClaims: KnowledgeClaimRow[],
  hasClaimsDataset: boolean,
): KnowledgeSafetyGate {
  if (evidence.length === 0) {
    return {
      mode: 'strict',
      recommendationPolicy: 'questions_first',
      summary: '安全ゲート: 根拠が取得できないため、追加ヒアリングを優先します。',
      reasonCodes: ['no_evidence'],
      matchedClaimCount: 0,
      highRiskClaimCount: 0,
      mediumRiskClaimCount: 0,
      aggregatedEvidenceClaimCount: 0,
      specificCaseClaimCount: 0,
      partialClaimCount: 0,
      missingContextCount: 0,
      sampleClaimIds: [],
      evidenceLaneCounts: {},
      followUpQuestions: [
        '今回の相談で影響が出ている具体タスクと就業条件は何ですか？',
        '適用したい国・法域（日本、米国、EU など）はどこですか？',
        '既に試した配慮とその結果（改善/悪化）を教えてください。',
      ],
    };
  }

  if (!hasClaimsDataset || matchedClaims.length === 0) {
    return {
      mode: 'caution',
      recommendationPolicy: 'conditional_only',
      summary: '安全ゲート: claim突合が不足しているため、条件付き提案として扱います。',
      reasonCodes: hasClaimsDataset ? ['no_claim_match_for_evidence'] : ['claims_dataset_missing'],
      matchedClaimCount: matchedClaims.length,
      highRiskClaimCount: 0,
      mediumRiskClaimCount: 0,
      aggregatedEvidenceClaimCount: 0,
      specificCaseClaimCount: 0,
      partialClaimCount: 0,
      missingContextCount: 0,
      sampleClaimIds: [],
      evidenceLaneCounts: {},
      followUpQuestions: ['相談対象の国・法域と職場の前提条件を先に確認してください。'],
    };
  }

  let highRiskClaimCount = 0;
  let mediumRiskClaimCount = 0;
  let aggregatedEvidenceClaimCount = 0;
  let legalPolicyClaimCount = 0;
  let specificCaseClaimCount = 0;
  let partialClaimCount = 0;
  const missingContextSet = new Set<string>();
  const evidenceLaneCounts: Record<string, number> = {};

  for (const claim of matchedClaims) {
    const riskLevel = claim.risk?.level;
    if (riskLevel === 'high') highRiskClaimCount += 1;
    if (riskLevel === 'medium') mediumRiskClaimCount += 1;

    const scopes = claim.interactionContextSummary?.evidenceScopes || [];
    if (scopes.includes('aggregated_index')) aggregatedEvidenceClaimCount += 1;
    if (scopes.includes('specific_case')) specificCaseClaimCount += 1;
    if (claim.interactionContextSummary?.evidenceLane === 'legal_policy') {
      legalPolicyClaimCount += 1;
    }
    const lane = String(claim.interactionContextSummary?.evidenceLane || 'unknown');
    evidenceLaneCounts[lane] = (evidenceLaneCounts[lane] || 0) + 1;

    const missing = claim.applicability?.missingContexts || [];
    if (claim.applicability?.isPartial || missing.length > 0) partialClaimCount += 1;
    for (const key of missing) {
      if (key) missingContextSet.add(key);
    }
  }

  const matchedClaimCount = matchedClaims.length;
  const aggregatedGeneralClaimCount = Math.max(0, aggregatedEvidenceClaimCount - legalPolicyClaimCount);
  const aggregatedDominant =
    aggregatedGeneralClaimCount >= Math.max(2, Math.ceil(matchedClaimCount * 0.6));
  const legalPolicyDominant = legalPolicyClaimCount >= Math.max(2, Math.ceil(matchedClaimCount * 0.6));
  const highRiskDominant = highRiskClaimCount >= Math.max(2, Math.ceil(matchedClaimCount * 0.3));
  const strictWithoutSpecificCase = highRiskClaimCount > 0 && specificCaseClaimCount === 0;
  const cautionCandidate =
    mediumRiskClaimCount > 0 ||
    partialClaimCount > 0 ||
    aggregatedGeneralClaimCount > specificCaseClaimCount ||
    legalPolicyDominant ||
    missingContextSet.size > 0;

  let mode: KnowledgeSafetyGateMode = 'normal';
  const reasonCodes: string[] = [];
  if (strictWithoutSpecificCase || highRiskDominant || aggregatedDominant) {
    mode = 'strict';
    if (strictWithoutSpecificCase) reasonCodes.push('high_risk_without_specific_case');
    if (highRiskDominant) reasonCodes.push('high_risk_dominant');
    if (aggregatedDominant) reasonCodes.push('aggregated_evidence_dominant');
  } else if (cautionCandidate) {
    mode = 'caution';
    if (mediumRiskClaimCount > 0) reasonCodes.push('medium_risk_present');
    if (partialClaimCount > 0 || missingContextSet.size > 0)
      reasonCodes.push('partial_context_present');
    if (aggregatedGeneralClaimCount > specificCaseClaimCount)
      reasonCodes.push('aggregated_exceeds_specific_case');
    if (legalPolicyDominant) reasonCodes.push('legal_policy_evidence_dominant');
  } else {
    reasonCodes.push('risk_balanced');
  }

  const recommendationPolicy =
    mode === 'strict' ? 'questions_first' : mode === 'caution' ? 'conditional_only' : 'standard';
  const summary =
    mode === 'strict'
      ? '安全ゲート: 根拠の偏り/高リスクが検出されたため、追加確認を優先します。'
      : mode === 'caution'
        ? '安全ゲート: 根拠が部分的なため、条件付き提案として扱います。'
        : '安全ゲート: 根拠バランスは許容範囲です。';
  const followUpQuestions =
    mode === 'strict'
      ? [
          '今回の相談で最も困っている業務場面を1〜2件に絞るとどれですか？',
          '適用したい国・法域（日本、米国、EU など）はどこですか？',
          '過去に試した配慮の効果と副作用は何でしたか？',
        ]
      : mode === 'caution'
        ? ['対象業務・就業条件・法域を確認したうえで提案を適用してください。']
        : [];

  return {
    mode,
    recommendationPolicy,
    summary,
    reasonCodes,
    matchedClaimCount,
    highRiskClaimCount,
    mediumRiskClaimCount,
    aggregatedEvidenceClaimCount,
    specificCaseClaimCount,
    partialClaimCount,
    missingContextCount: missingContextSet.size,
    sampleClaimIds: matchedClaims.slice(0, 6).map((claim) => claim.id),
    evidenceLaneCounts,
    followUpQuestions,
  };
}

async function getQueryEmbedding(query: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMBEDDING_TIMEOUT_MS);

  try {
    const response = await fetch(EMBEDDINGS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small',
        input: query.slice(0, 6000),
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json?.data?.[0]?.embedding || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function runKeywordSearch(
  records: NormalizedRecord[],
  keywords: string[],
  lexicalContext: LexicalContext,
  profile: RetrievalProfile,
  maxRecords?: number,
): EvidenceItem[] {
  const candidates = pickSearchCandidates(records, keywords, maxRecords);
  const primary = candidates
    .map((record) => {
      const score = applyLexicalBoost(
        scoreByBm25(record.text, keywords, lexicalContext),
        record,
        profile,
      );
      return {
        id: record.id,
        sourceId: record.sourceId,
        filePath: record.filePath,
        excerpt: extractBestExcerpt(record.text, keywords),
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  if (primary.length > 0) return primary;

  const looseKeywords = generateLooseKeywords(keywords);
  if (looseKeywords.length === 0) return [];
  const looseLexical = buildLexicalContext(candidates, looseKeywords);

  return candidates
    .map((record) => {
      const score = applyLexicalBoost(
        scoreByBm25(record.text, looseKeywords, looseLexical),
        record,
        profile,
      );
      return {
        id: record.id,
        sourceId: record.sourceId,
        filePath: record.filePath,
        excerpt: extractBestExcerpt(record.text, looseKeywords),
        score: Number((score * 0.6).toFixed(6)),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

async function runHybridSemanticSearch(
  records: NormalizedRecord[],
  keywords: string[],
  query: string,
  embeddingMap: Map<string, number[]>,
  lexicalContext: LexicalContext,
  profile: RetrievalProfile,
  maxRecords?: number,
): Promise<{ hits: EvidenceItem[]; mode: 'hybrid' | 'lexical_fallback' }> {
  const candidates = pickSearchCandidates(records, keywords, maxRecords);
  const embedCandidates = candidates.filter((record) => embeddingMap.has(record.id));
  const queryVector = await getQueryEmbedding(query);

  if (queryVector && embedCandidates.length > 0) {
    const scored = embedCandidates
      .map((record) => {
        const vector = embeddingMap.get(record.id) as number[];
        const cosine = cosineSimilarity(queryVector, vector);
        const lexicalScore = scoreByBm25(record.text, keywords, lexicalContext);
        const interactionBoost = computeInteractionBoost(record, profile);
        const combinedScore = cosine * 100 + lexicalScore * 10 + interactionBoost * 12;

        return {
          id: record.id,
          sourceId: record.sourceId,
          filePath: record.filePath,
          excerpt: extractBestExcerpt(record.text, keywords),
          score: Number(combinedScore.toFixed(4)),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return { hits: scored, mode: 'hybrid' };
  }

  const fallback = candidates
    .map((record) => ({
      id: record.id,
      sourceId: record.sourceId,
      filePath: record.filePath,
      excerpt: extractBestExcerpt(record.text, keywords),
      score: applyLexicalBoost(scoreByBm25(record.text, keywords, lexicalContext), record, profile),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (fallback.length > 0) {
    return { hits: fallback, mode: 'lexical_fallback' };
  }

  const looseKeywords = generateLooseKeywords([query, ...keywords]);
  if (looseKeywords.length === 0) {
    return { hits: [], mode: 'lexical_fallback' };
  }
  const looseLexical = buildLexicalContext(candidates, looseKeywords);
  const looseFallback = candidates
    .map((record) => ({
      id: record.id,
      sourceId: record.sourceId,
      filePath: record.filePath,
      excerpt: extractBestExcerpt(record.text, looseKeywords),
      score: Number(
        (
          applyLexicalBoost(
            scoreByBm25(record.text, looseKeywords, looseLexical),
            record,
            profile,
          ) * 0.6
        ).toFixed(6),
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return { hits: looseFallback, mode: 'lexical_fallback' };
}

function summarizeStructuredAssets(
  manifest: Manifest | null,
  records: NormalizedRecord[],
): string[] {
  if (!manifest) {
    return ['No manifest found. Run npm run knowledge:normalize to enable structured summaries.'];
  }

  const summary = [
    `Dataset files indexed: ${manifest.fileCount}`,
    `Normalized records indexed: ${manifest.recordCount}`,
    `Narrative chunks: ${records.filter((record) => record.contentType === 'narrative').length}`,
    `Guideline chunks: ${records.filter((record) => record.contentType === 'guideline').length}`,
    `Structured metadata records: ${records.filter((record) => record.contentType === 'structured_meta').length}`,
    `Web reference chunks: ${records.filter((record) => record.contentType === 'web_reference').length}`,
  ];

  const sourceBreakdown = records.reduce(
    (acc, record) => {
      acc[record.sourceId] = (acc[record.sourceId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const sourceLine = Object.entries(sourceBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sourceId, count]) => `${sourceId}:${count}`)
    .join(', ');
  if (sourceLine) {
    summary.push(`Top sources in current step: ${sourceLine}`);
  }

  const countryBreakdown = records.reduce(
    (acc, record) => {
      const country = record.interactionContext?.country || 'unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const countryLine = Object.entries(countryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => `${country}:${count}`)
    .join(', ');
  if (countryLine) {
    summary.push(`Country coverage: ${countryLine}`);
  }

  const signalBreakdown = records.reduce(
    (acc, record) => {
      const signals = record.interactionContext?.interactionModelSignals || {};
      for (const [key, active] of Object.entries(signals)) {
        if (active) {
          acc[key] = (acc[key] || 0) + 1;
        }
      }
      return acc;
    },
    {} as Record<string, number>,
  );
  const signalLine = Object.entries(signalBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([signal, count]) => `${signal}:${count}`)
    .join(', ');
  if (signalLine) {
    summary.push(`Interaction signal coverage: ${signalLine}`);
  }

  const topFacetLine = (label: string, values: string[]): void => {
    const counts = values.reduce(
      (acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const line = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([key, count]) => `${key}:${count}`)
      .join(', ');
    if (line) {
      summary.push(`${label}: ${line}`);
    }
  };

  topFacetLine(
    'Disability facets',
    records.flatMap(
      (record) =>
        record.interactionContext?.disabilityFacets ||
        record.interactionContext?.disabilityHints ||
        [],
    ),
  );
  topFacetLine(
    'Industry facets',
    records.flatMap((record) => record.interactionContext?.industryFacets || []),
  );
  topFacetLine(
    'Company size facets',
    records.flatMap((record) => record.interactionContext?.companySizeFacets || []),
  );
  topFacetLine(
    'Accommodation facets',
    records.flatMap(
      (record) =>
        record.interactionContext?.accommodationFacets ||
        record.interactionContext?.supportTypeHints ||
        [],
    ),
  );
  topFacetLine(
    'Outcome facets',
    records.flatMap((record) => record.interactionContext?.outcomeFacets || []),
  );

  const scopeBreakdown = records.reduce(
    (acc, record) => {
      const scope = record.interactionContext?.evidenceScope || 'unknown';
      acc[scope] = (acc[scope] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const scopeLine = Object.entries(scopeBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([scope, count]) => `${scope}:${count}`)
    .join(', ');
  if (scopeLine) {
    summary.push(`Evidence scope coverage: ${scopeLine}`);
  }

  if (typeof manifest.metadataOnlyCount === 'number') {
    summary.push(`Metadata-only files: ${manifest.metadataOnlyCount}`);
  }

  if (typeof manifest.extractionCoveragePct === 'number') {
    summary.push(`Extraction coverage: ${manifest.extractionCoveragePct}%`);
  }

  if (manifest.warnings.length > 0) {
    summary.push(`Extraction warnings: ${manifest.warnings.length}`);
  }

  return summary;
}

function buildPolicyNotes(safetyGate: KnowledgeSafetyGate): string[] {
  const base = [
    'Do not provide medical diagnosis or treatment instructions.',
    'Frame outputs as workplace accommodation proposals, not legal advice.',
    'Use explicit uncertainty when evidence is thin or conflicting.',
  ];

  if (safetyGate.mode === 'strict') {
    return [
      ...base,
      `Safety gate mode: strict (${safetyGate.reasonCodes.join(', ') || 'n/a'}).`,
      'Ask follow-up questions first; avoid prescriptive recommendations.',
      'Do not assert legal compliance before jurisdiction and context are confirmed.',
    ];
  }

  if (safetyGate.mode === 'caution') {
    return [
      ...base,
      `Safety gate mode: caution (${safetyGate.reasonCodes.join(', ') || 'n/a'}).`,
      'Provide conditional recommendations with assumptions and caveats.',
    ];
  }

  return [...base, 'Safety gate mode: normal (risk-balanced evidence mix).'];
}

export async function executeAgenticPlan(
  plan: PlannerOutput,
  context: AgenticExecutionContext,
): Promise<AgenticExecutionResult> {
  const stepProgress: PlannerStepProgress[] = [];
  const evidence: EvidenceItem[] = [];
  const structuredSummary: string[] = [];
  const policyNotes: string[] = [];

  const keywords = normalizeKeywords([context.query, ...context.keywords]);
  const retrievalProfile = buildRetrievalProfile(context.query, keywords);
  const maxFiles = context.maxFiles;

  const [records, embeddingMap, manifest] = await Promise.all([
    readNormalizedRecords(),
    readEmbeddingMap(),
    readManifest(),
  ]);
  const lexicalContext = buildLexicalContext(records, keywords);

  for (const step of plan.steps) {
    const stepRecords = filterRecordsBySourceIds(records, step.sourceIds);
    const searchableStepRecords = filterSearchableRecords(stepRecords);

    if (step.tool === 'keyword_search') {
      if (searchableStepRecords.length === 0) {
        stepProgress.push({
          stepId: step.stepId,
          purpose: step.purpose,
          tool: step.tool,
          status: 'skipped',
          message: 'No normalized records found for selected sources',
          evidenceCount: 0,
        });
        continue;
      }

      const hits = runKeywordSearch(
        searchableStepRecords,
        keywords,
        lexicalContext,
        retrievalProfile,
        maxFiles,
      );
      evidence.push(...hits);
      stepProgress.push({
        stepId: step.stepId,
        purpose: step.purpose,
        tool: step.tool,
        status: 'completed',
        message: `Retrieved ${hits.length} lexical matches`,
        evidenceCount: hits.length,
      });
      continue;
    }

    if (step.tool === 'semantic_search') {
      if (searchableStepRecords.length === 0) {
        stepProgress.push({
          stepId: step.stepId,
          purpose: step.purpose,
          tool: step.tool,
          status: 'skipped',
          message: 'No normalized records found for selected sources',
          evidenceCount: 0,
        });
        continue;
      }

      const { hits, mode } = await runHybridSemanticSearch(
        searchableStepRecords,
        keywords,
        context.query,
        embeddingMap,
        lexicalContext,
        retrievalProfile,
        maxFiles,
      );
      evidence.push(...hits);
      stepProgress.push({
        stepId: step.stepId,
        purpose: step.purpose,
        tool: step.tool,
        status: 'completed',
        message:
          mode === 'hybrid'
            ? `Hybrid retrieval done with ${hits.length} matches`
            : `Fallback lexical retrieval with ${hits.length} matches`,
        evidenceCount: hits.length,
      });
      continue;
    }

    if (step.tool === 'structured_query') {
      const summary = summarizeStructuredAssets(manifest, stepRecords);
      structuredSummary.push(...summary);
      stepProgress.push({
        stepId: step.stepId,
        purpose: step.purpose,
        tool: step.tool,
        status: 'completed',
        message: 'Structured assets summarized',
        evidenceCount: summary.length,
      });
      continue;
    }

    if (step.tool === 'policy_check') {
      stepProgress.push({
        stepId: step.stepId,
        purpose: step.purpose,
        tool: step.tool,
        status: 'completed',
        message: 'Policy guardrails staged',
        evidenceCount: 0,
      });
      continue;
    }

    stepProgress.push({
      stepId: step.stepId,
      purpose: step.purpose,
      tool: step.tool,
      status: 'completed',
      message: 'Synthesis step delegated to model',
      evidenceCount: 0,
    });
  }

  const rankedEvidence = Array.from(
    evidence.reduce((map, item) => {
      const existing = map.get(item.id);
      if (!existing || item.score > existing.score) {
        map.set(item.id, item);
      }
      return map;
    }, new Map<string, EvidenceItem>()),
  )
    .map(([, item]) => item)
    .sort((a, b) => b.score - a.score);
  const dedupedEvidence = rebalanceEvidenceBySource(rankedEvidence, 16, {
    maxPerSource: 3,
    websiteQuota: 6,
    candidatePoolSize: 48,
  });
  const step4Evidence = rebalanceEvidenceBySource(rankedEvidence, 32, {
    maxPerSource: 4,
    websiteQuota: 14,
    candidatePoolSize: 160,
    minDistinctSources: 6,
    minDistinctWebsiteSources: 4,
  });

  const claimsByRecordId = await readClaimsByRecordId();
  const matchedClaims = collectMatchedClaims(dedupedEvidence, claimsByRecordId);
  const matchedStep4Claims = collectMatchedClaims(step4Evidence, claimsByRecordId);
  const safetyGate = buildSafetyGate(dedupedEvidence, matchedClaims, claimsByRecordId.size > 0);

  const notes = buildPolicyNotes(safetyGate);
  policyNotes.push(...notes);

  const policyStep = stepProgress.find((step) => step.tool === 'policy_check');
  if (policyStep) {
    policyStep.message = `Policy guardrails applied (${safetyGate.mode})`;
    policyStep.evidenceCount = notes.length;
  }

  return {
    stepProgress,
    evidence: dedupedEvidence,
    step4Evidence,
    step4ClaimIds: matchedStep4Claims.map((claim) => claim.id),
    structuredSummary,
    policyNotes,
    safetyGate,
  };
}
