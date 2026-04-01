import {
  resolveEvidencePresentationRole,
  type EvidencePresentationCitation,
  type EvidencePresentationDetail,
} from '@/lib/jac/evidencePresentation';
import type { ImplementationKnowledgeItem } from '@/lib/jac/implementationKnowledgeCatalog';
import type { PracticalReferencePreviewItem } from '@/lib/jac/practicalReferenceCatalog';

type Step4EvidenceExcerpt = {
  record_id?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  file_path?: string | null;
  excerpt?: string | null;
};

type Step4EvidenceDetail = EvidencePresentationDetail & {
  evidence_id?: string | null;
  summary?: string | null;
  evidence_lane_label?: string | null;
  confidence_level?: string | null;
  confidence_score?: number | null;
  risk_level?: string | null;
  rank_score?: number | null;
  source_names?: string[] | null;
  source_urls?: string[] | null;
  conditions?: string[] | null;
  missing_contexts?: string[] | null;
  sample_excerpts?: Step4EvidenceExcerpt[] | null;
  practice_stage_label?: string | null;
};

type Step4Citation<T extends Step4EvidenceDetail> = EvidencePresentationCitation<T> & {
  evidence_ids?: string[] | null;
};

type SupportCatalogPreviewItem = {
  title: string;
  summary: string;
  recommendedSupports: Array<{
    title: string;
    summary: string;
  }>;
};

export type Step4BasisItem = {
  id: string;
  title: string;
  rankScore: number;
  evidenceLaneLabel: string;
  confidenceLevel: string;
  confidenceScore: number | null;
  riskLevel: string;
  sourceNames: string[];
  sourceUrls: string[];
  linkedClaims: string[];
  conditions: string[];
  missingContexts: string[];
  sampleExcerpts: Array<{
    recordId: string;
    sourceName: string;
    sourceUrl: string | null;
    filePath: string;
    excerpt: string;
  }>;
};

export type Step4SupplementalReferenceItem = {
  id: string;
  title: string;
  rankScore: number;
  sourceNames: string[];
  sourceUrls: string[];
  practiceStageLabel: string | null;
  linkedClaims: string[];
  sampleExcerpts: Array<{
    recordId: string;
    sourceName: string;
    sourceUrl: string | null;
    filePath: string;
    excerpt: string;
  }>;
};

export type Step4OutputModel = {
  basisItems: Step4BasisItem[];
  supportCatalogItems: SupportCatalogPreviewItem[];
  implementationKnowledgeItems: ImplementationKnowledgeItem[];
  practicalReferenceItems: PracticalReferencePreviewItem[];
  supplementalReferenceItems: Step4SupplementalReferenceItem[];
  hasContent: boolean;
  hasReferenceContent: boolean;
};

function normalizeText(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeText(value))
        .filter(Boolean),
    ),
  );
}

function detailKey(detail: Step4EvidenceDetail, fallbackClaim: string): string {
  const evidenceId = normalizeText(detail.evidence_id);
  if (evidenceId) return evidenceId;
  const firstUrl = uniqueStrings(detail.source_urls || [])[0];
  if (firstUrl) return firstUrl;
  const summary = normalizeText(detail.summary);
  if (summary) return summary;
  return normalizeText(fallbackClaim) || 'unknown-step4-item';
}

function toExcerptItems(excerpts: Step4EvidenceExcerpt[] | null | undefined) {
  return (Array.isArray(excerpts) ? excerpts : [])
    .map((excerpt) => ({
      recordId: normalizeText(excerpt.record_id),
      sourceName: normalizeText(excerpt.source_name) || '不明',
      sourceUrl: normalizeText(excerpt.source_url) || null,
      filePath: normalizeText(excerpt.file_path),
      excerpt: normalizeText(excerpt.excerpt),
    }))
    .filter((excerpt) => excerpt.excerpt)
    .slice(0, 2);
}

export function buildStep4OutputModel<T extends Step4EvidenceDetail, C extends Step4Citation<T>>({
  basisCitations,
  referenceCitations,
  supportCatalogItems,
  implementationKnowledgeItems,
  practicalReferenceItems,
}: {
  basisCitations: C[];
  referenceCitations: C[];
  supportCatalogItems?: SupportCatalogPreviewItem[] | null;
  implementationKnowledgeItems?: ImplementationKnowledgeItem[] | null;
  practicalReferenceItems?: PracticalReferencePreviewItem[] | null;
}): Step4OutputModel {
  const basisMap = new Map<string, Step4BasisItem>();
  const supplementalMap = new Map<string, Step4SupplementalReferenceItem>();

  for (const citation of basisCitations || []) {
    const claim = normalizeText(citation.claim);
    for (const detail of Array.isArray(citation.evidence_details) ? citation.evidence_details : []) {
      if (
        resolveEvidencePresentationRole(detail) !== 'direct_basis' ||
        detail.public_safe === false
      ) {
        continue;
      }

      const key = detailKey(detail, claim);
      const current =
        basisMap.get(key) ||
        {
          id: key,
          title: normalizeText(detail.summary) || claim || '根拠情報',
          rankScore: typeof detail.rank_score === 'number' ? Number(detail.rank_score) : 0,
          evidenceLaneLabel: normalizeText(detail.evidence_lane_label) || '不明',
          confidenceLevel: normalizeText(detail.confidence_level) || 'unknown',
          confidenceScore:
            typeof detail.confidence_score === 'number' ? Number(detail.confidence_score) : null,
          riskLevel: normalizeText(detail.risk_level) || 'unknown',
          sourceNames: uniqueStrings(detail.source_names || []),
          sourceUrls: uniqueStrings(detail.source_urls || []),
          linkedClaims: [],
          conditions: uniqueStrings(detail.conditions || []),
          missingContexts: uniqueStrings(detail.missing_contexts || []),
          sampleExcerpts: toExcerptItems(detail.sample_excerpts),
        };

      if (claim && !current.linkedClaims.includes(claim)) {
        current.linkedClaims.push(claim);
      }
      if (typeof detail.rank_score === 'number') {
        current.rankScore = Math.max(current.rankScore, Number(detail.rank_score));
      }
      basisMap.set(key, current);
    }
  }

  for (const citation of referenceCitations || []) {
    const claim = normalizeText(citation.claim);
    for (const detail of Array.isArray(citation.evidence_details) ? citation.evidence_details : []) {
      if (resolveEvidencePresentationRole(detail) !== 'related_reading') continue;

      const key = detailKey(detail, claim);
      const current =
        supplementalMap.get(key) ||
        {
          id: key,
          title: normalizeText(detail.summary) || claim || '参考資料',
          rankScore: typeof detail.rank_score === 'number' ? Number(detail.rank_score) : 0,
          sourceNames: uniqueStrings(detail.source_names || []),
          sourceUrls: uniqueStrings(detail.source_urls || []),
          practiceStageLabel: normalizeText(detail.practice_stage_label) || null,
          linkedClaims: [],
          sampleExcerpts: toExcerptItems(detail.sample_excerpts),
        };

      if (claim && !current.linkedClaims.includes(claim)) {
        current.linkedClaims.push(claim);
      }
      if (typeof detail.rank_score === 'number') {
        current.rankScore = Math.max(current.rankScore, Number(detail.rank_score));
      }
      supplementalMap.set(key, current);
    }
  }

  const sortedBasisItems = [...basisMap.values()].sort((a, b) => {
    if (b.rankScore !== a.rankScore) {
      return b.rankScore - a.rankScore;
    }
    if (b.linkedClaims.length !== a.linkedClaims.length) {
      return b.linkedClaims.length - a.linkedClaims.length;
    }
    return a.title.localeCompare(b.title, 'ja');
  });

  const sortedSupplementalItems = [...supplementalMap.values()].sort((a, b) => {
    if (b.rankScore !== a.rankScore) {
      return b.rankScore - a.rankScore;
    }
    if (b.linkedClaims.length !== a.linkedClaims.length) {
      return b.linkedClaims.length - a.linkedClaims.length;
    }
    return a.title.localeCompare(b.title, 'ja');
  });

  const supportItems = Array.isArray(supportCatalogItems) ? supportCatalogItems : [];
  const implementationItems = Array.isArray(implementationKnowledgeItems)
    ? implementationKnowledgeItems
    : [];
  const practicalItems = Array.isArray(practicalReferenceItems) ? practicalReferenceItems : [];

  return {
    basisItems: sortedBasisItems,
    supportCatalogItems: supportItems,
    implementationKnowledgeItems: implementationItems,
    practicalReferenceItems: practicalItems,
    supplementalReferenceItems: sortedSupplementalItems,
    hasContent:
      sortedBasisItems.length > 0 ||
      supportItems.length > 0 ||
      implementationItems.length > 0 ||
      practicalItems.length > 0 ||
      sortedSupplementalItems.length > 0,
    hasReferenceContent:
      supportItems.length > 0 ||
      implementationItems.length > 0 ||
      practicalItems.length > 0 ||
      sortedSupplementalItems.length > 0,
  };
}
