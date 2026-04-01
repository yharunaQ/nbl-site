import { promises as fs } from 'node:fs';
import path from 'node:path';
import { REGIONAL_SUPPORT_EVIDENCE_ROLE_LABEL } from '@/lib/jac/regionalSupportPositioning';
import {
  EVIDENCE_PRESENTATION_ROLE_LABEL,
  resolveEvidencePresentationRole,
} from '@/lib/jac/evidencePresentation';
import { getKnowledgeSourceById } from '@/lib/knowledge/sourceRegistry';
import type { KnowledgeClaim } from '@/lib/knowledge/types';

const CLAIMS_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');

export const KNOWLEDGE_EVIDENCE_LANE_LABEL: Record<string, string> = {
  case_practice: '事例実践',
  legal_policy: '制度根拠',
  employer_guidance: '雇用主ガイダンス',
  aggregated_general: '集計一般',
  mixed: '混合',
  glm_model: 'GLMモデル',
  safety_gate: '安全ゲート',
  unknown: '不明',
};

export const KNOWLEDGE_EVIDENCE_ROLE_LABEL: Record<string, string> = {
  direct_basis: EVIDENCE_PRESENTATION_ROLE_LABEL.direct_basis,
  conditional_hypothesis: EVIDENCE_PRESENTATION_ROLE_LABEL.conditional_hypothesis,
  support_catalog: REGIONAL_SUPPORT_EVIDENCE_ROLE_LABEL,
  related_reading: EVIDENCE_PRESENTATION_ROLE_LABEL.related_reading,
};

export type CitationEvidenceDetail = {
  evidence_id: string;
  summary: string;
  evidence_lane: string;
  evidence_lane_label: string;
  evidence_role: string;
  evidence_role_label: string;
  source_ids: string[];
  source_names: string[];
  source_urls: string[];
  countries: string[];
  legal_contexts: string[];
  trust_tiers: string[];
  confidence_level: string;
  confidence_score: number | null;
  risk_level: string;
  risk_reasons: string[];
  page_types: string[];
  evidence_scopes: string[];
  note_type: string | null;
  curation_risk_level: string | null;
  public_safe: boolean;
  must_pair_with_regional_support: boolean;
  missing_contexts: string[];
  conditions: string[];
  is_partial: boolean;
  sample_excerpts: Array<{
    record_id: string;
    source_id: string;
    source_name: string;
    file_path: string;
    source_url: string | null;
    excerpt: string;
    practical_title_ja?: string | null;
    practical_summary_ja?: string | null;
    usage_focus?: string | null;
    applicability_conditions_ja?: string | null;
  }>;
};

let claimsByIdPromise: Promise<Map<string, KnowledgeClaim>> | null = null;

function uniqueNonEmpty(
  values: Array<string | null | undefined>,
  blocked: string[] = [],
): string[] {
  const blockedSet = new Set(blocked);
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim())
        .filter((value) => value.length > 0 && !blockedSet.has(value)),
    ),
  );
}

function normalizeEvidenceLane(value: unknown): string {
  const lane = String(value || '').trim();
  if (!lane) return 'unknown';
  return KNOWLEDGE_EVIDENCE_LANE_LABEL[lane] ? lane : 'unknown';
}

function normalizeEvidenceRole(value: unknown): string {
  const role = String(value || '').trim();
  if (!role) return 'related_reading';
  return KNOWLEDGE_EVIDENCE_ROLE_LABEL[role] ? role : 'related_reading';
}

function fallbackEvidenceRole(lane: string): string {
  if (lane === 'legal_policy' || lane === 'case_practice' || lane === 'employer_guidance') {
    return 'direct_basis';
  }
  if (
    lane === 'aggregated_general' ||
    lane === 'mixed' ||
    lane === 'glm_model' ||
    lane === 'safety_gate'
  ) {
    return 'conditional_hypothesis';
  }
  return 'related_reading';
}

async function readClaimsById(): Promise<Map<string, KnowledgeClaim>> {
  if (claimsByIdPromise) {
    return claimsByIdPromise;
  }

  claimsByIdPromise = fs
    .readFile(CLAIMS_PATH, 'utf8')
    .then((raw) => {
      const byId = new Map<string, KnowledgeClaim>();
      const lines = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        let row: KnowledgeClaim;
        try {
          row = JSON.parse(line) as KnowledgeClaim;
        } catch {
          continue;
        }
        const id = String(row?.id || '').trim();
        if (!id) continue;
        byId.set(id, row);
      }

      return byId;
    })
    .catch(() => new Map<string, KnowledgeClaim>());

  return claimsByIdPromise;
}

function buildFallbackEvidenceDetail(evidenceId: string): CitationEvidenceDetail {
  if (evidenceId.startsWith('GLM-')) {
    const sourceName =
      getKnowledgeSourceById('nbl_local_research')?.name || 'NBL Local Research Data';
    return {
      evidence_id: evidenceId,
      summary: 'GLM実証知見に基づく補強根拠です。',
      evidence_lane: 'glm_model',
      evidence_lane_label: KNOWLEDGE_EVIDENCE_LANE_LABEL.glm_model,
      evidence_role: 'conditional_hypothesis',
      evidence_role_label: KNOWLEDGE_EVIDENCE_ROLE_LABEL.conditional_hypothesis,
      source_ids: ['nbl_local_research'],
      source_names: [sourceName],
      source_urls: [],
      countries: [],
      legal_contexts: [],
      trust_tiers: ['primary'],
      confidence_level: 'unknown',
      confidence_score: null,
      risk_level: 'unknown',
      risk_reasons: [],
      page_types: [],
      evidence_scopes: [],
      note_type: null,
      curation_risk_level: null,
      public_safe: false,
      must_pair_with_regional_support: false,
      missing_contexts: ['person', 'job', 'environment', 'time', 'institution'],
      conditions: ['GLM根拠は個別文脈での確認が必要です。'],
      is_partial: true,
      sample_excerpts: [],
    };
  }

  if (evidenceId === 'safety_gate') {
    return {
      evidence_id: evidenceId,
      summary: '安全ゲート由来の根拠です。追加確認を優先すべき状態を示します。',
      evidence_lane: 'safety_gate',
      evidence_lane_label: KNOWLEDGE_EVIDENCE_LANE_LABEL.safety_gate,
      evidence_role: 'conditional_hypothesis',
      evidence_role_label: KNOWLEDGE_EVIDENCE_ROLE_LABEL.conditional_hypothesis,
      source_ids: [],
      source_names: [],
      source_urls: [],
      countries: [],
      legal_contexts: [],
      trust_tiers: [],
      confidence_level: 'unknown',
      confidence_score: null,
      risk_level: 'high',
      risk_reasons: ['safety_gate_triggered'],
      page_types: [],
      evidence_scopes: [],
      note_type: null,
      curation_risk_level: null,
      public_safe: false,
      must_pair_with_regional_support: false,
      missing_contexts: ['person', 'job', 'environment', 'support', 'time', 'institution'],
      conditions: ['追加ヒアリングが完了するまで強い提案は控える。'],
      is_partial: true,
      sample_excerpts: [],
    };
  }

  return {
    evidence_id: evidenceId,
    summary: '詳細未解決の根拠IDです。',
    evidence_lane: 'unknown',
    evidence_lane_label: KNOWLEDGE_EVIDENCE_LANE_LABEL.unknown,
    evidence_role: 'related_reading',
    evidence_role_label: KNOWLEDGE_EVIDENCE_ROLE_LABEL.related_reading,
    source_ids: [],
    source_names: [],
    source_urls: [],
    countries: [],
    legal_contexts: [],
    trust_tiers: [],
    confidence_level: 'unknown',
    confidence_score: null,
    risk_level: 'unknown',
    risk_reasons: [],
    page_types: [],
    evidence_scopes: [],
    note_type: null,
    curation_risk_level: null,
    public_safe: false,
    must_pair_with_regional_support: false,
    missing_contexts: [],
    conditions: [],
    is_partial: true,
    sample_excerpts: [],
  };
}

function toCitationEvidenceDetail(claim: KnowledgeClaim): CitationEvidenceDetail {
  const evidenceLane = normalizeEvidenceLane(claim?.interactionContextSummary?.evidenceLane);
  const claimedRole = normalizeEvidenceRole(
    claim?.provenance?.evidenceRole || fallbackEvidenceRole(evidenceLane),
  );
  const sourceIds = uniqueNonEmpty(claim?.sourceIds || []);
  const sourceNames = uniqueNonEmpty(
    sourceIds.map((sourceId) => getKnowledgeSourceById(sourceId)?.name || sourceId),
  );
  const sampleExcerpts = Array.isArray(claim?.sampleExcerpts) ? claim.sampleExcerpts : [];
  const practicalTitleJa =
    uniqueNonEmpty(sampleExcerpts.map((excerpt) => excerpt?.practicalTitleJa || null))[0] || '';
  const practicalSummaryJa =
    uniqueNonEmpty(sampleExcerpts.map((excerpt) => excerpt?.practicalSummaryJa || null))[0] || '';
  const applicabilityConditionsJa =
    uniqueNonEmpty(sampleExcerpts.map((excerpt) => excerpt?.applicabilityConditionsJa || null))[0] ||
    '';
  const noteType = uniqueNonEmpty(claim?.provenance?.noteTypes || [])[0] || null;
  const curationRiskLevel = uniqueNonEmpty(claim?.provenance?.curationRiskLevels || [])[0] || null;
  const pageTypes = uniqueNonEmpty(claim?.interactionContextSummary?.pageTypes || []);
  const evidenceScopes = uniqueNonEmpty(claim?.interactionContextSummary?.evidenceScopes || []);

  const presentationRole = resolveEvidencePresentationRole({
    evidence_role: claimedRole,
    evidence_lane: evidenceLane,
    note_type: noteType,
    is_partial: Boolean(claim?.applicability?.isPartial),
    trust_tiers: uniqueNonEmpty(claim?.interactionContextSummary?.trustTiers || []),
    evidence_scopes: evidenceScopes,
    page_types: pageTypes,
  });

  return {
    evidence_id: String(claim?.id || '').trim(),
    summary:
      practicalTitleJa ||
      practicalSummaryJa ||
      String(claim?.statement || claim?.canonicalStatement || '').trim(),
    evidence_lane: evidenceLane,
    evidence_lane_label:
      KNOWLEDGE_EVIDENCE_LANE_LABEL[evidenceLane] || KNOWLEDGE_EVIDENCE_LANE_LABEL.unknown,
    evidence_role: presentationRole,
    evidence_role_label:
      KNOWLEDGE_EVIDENCE_ROLE_LABEL[presentationRole] ||
      KNOWLEDGE_EVIDENCE_ROLE_LABEL.related_reading,
    source_ids: sourceIds,
    source_names: sourceNames,
    source_urls: uniqueNonEmpty(sampleExcerpts.map((excerpt) => excerpt?.sourceUrl || null)),
    countries: uniqueNonEmpty(claim?.interactionContextSummary?.countries || [], ['unknown']),
    legal_contexts: uniqueNonEmpty(claim?.interactionContextSummary?.legalContexts || [], [
      'unspecified',
      'unknown',
    ]),
    trust_tiers: uniqueNonEmpty(claim?.interactionContextSummary?.trustTiers || []),
    confidence_level: String(claim?.confidence?.level || 'unknown'),
    confidence_score:
      typeof claim?.confidence?.score === 'number' ? Number(claim.confidence.score) : null,
    risk_level: String(claim?.risk?.level || 'unknown'),
    risk_reasons: uniqueNonEmpty(claim?.risk?.reasons || []),
    page_types: pageTypes,
    evidence_scopes: evidenceScopes,
    note_type: noteType,
    curation_risk_level: curationRiskLevel,
    public_safe: Boolean(
      (claim?.provenance?.publicSafe ?? claimedRole === 'direct_basis') &&
        presentationRole === 'direct_basis',
    ),
    must_pair_with_regional_support: Boolean(claim?.provenance?.mustPairWithRegionalSupport),
    missing_contexts: uniqueNonEmpty(claim?.applicability?.missingContexts || []),
    conditions: uniqueNonEmpty([
      ...(claim?.applicability?.conditions || []),
      applicabilityConditionsJa || null,
    ]),
    is_partial: Boolean(claim?.applicability?.isPartial),
    sample_excerpts: sampleExcerpts.slice(0, 3).map((excerpt) => ({
      record_id: String(excerpt?.recordId || '').trim(),
      source_id: String(excerpt?.sourceId || '').trim(),
      source_name:
        getKnowledgeSourceById(String(excerpt?.sourceId || '').trim())?.name ||
        String(excerpt?.sourceId || '').trim(),
      file_path: String(excerpt?.filePath || '').trim(),
      source_url: excerpt?.sourceUrl || null,
      excerpt: String(excerpt?.excerpt || '').trim(),
      practical_title_ja: String(excerpt?.practicalTitleJa || '').trim() || null,
      practical_summary_ja: String(excerpt?.practicalSummaryJa || '').trim() || null,
      usage_focus: String(excerpt?.usageFocus || '').trim() || null,
      applicability_conditions_ja:
        String(excerpt?.applicabilityConditionsJa || '').trim() || null,
    })),
  };
}

export async function getCitationEvidenceDetails(
  evidenceIds: string[],
): Promise<CitationEvidenceDetail[]> {
  const claimsById = await readClaimsById();
  return uniqueNonEmpty(evidenceIds).map((evidenceId) => {
    const claim = claimsById.get(evidenceId);
    return claim ? toCitationEvidenceDetail(claim) : buildFallbackEvidenceDetail(evidenceId);
  });
}
