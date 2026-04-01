import {
  enrichReferenceCitationsByContext,
  filterReferenceCitationsByUsefulness,
  resolveEvidencePresentationRole,
  sortCitationsByContext,
  type EvidencePresentationContext,
} from '@/lib/jac/evidencePresentation';
import {
  buildImplementationKnowledgeCatalog,
  flattenImplementationKnowledgeCatalog,
} from '@/lib/jac/implementationKnowledgeCatalog';
import {
  buildPracticalReferencePreview,
  type PracticalReferenceContext,
  type PracticalReferencePreviewItem,
} from '@/lib/jac/practicalReferenceCatalog';
import { buildStep4OutputModel, type Step4OutputModel } from '@/lib/jac/step4OutputModel';
import type { EvidenceItem } from '@/lib/knowledge/agenticExecutor';
import {
  getCitationEvidenceDetails,
  type CitationEvidenceDetail,
} from '@/lib/knowledge/claimRegistry';

type Step4AssessmentShape = {
  summary?: string;
  causal_summary?: string;
  agreement?: string;
  kpi?: string;
  accommodations?: Array<{
    title: string;
    reason?: string;
    examples?: string;
    priority?: number;
  }>;
};

type SupportCatalogPreviewItem = {
  title: string;
  summary: string;
  recommendedSupports: Array<{
    title: string;
    summary: string;
  }>;
};

type Step4SyntheticCitation = {
  claim: string;
  evidence_ids: string[];
  evidence_details: Array<CitationEvidenceDetail & { rank_score?: number | null }>;
};

type Step4LinkStatement = {
  label: string;
  text: string;
  priority: number;
};

export type Step4EvidencePackInput = {
  assessment: Step4AssessmentShape;
  claimIds: string[];
  evidence: EvidenceItem[];
  supportCatalogItems?: SupportCatalogPreviewItem[] | null;
  evidenceContext?: EvidencePresentationContext;
  practicalContext?: PracticalReferenceContext;
  practicalMaxItems?: number;
};

function normalizeText(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .toLowerCase()
    .split(/[\s、。,.()\[\]「」『』/|:;!?\-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => normalizeText(value)).filter(Boolean)));
}

function normalizeLookup(value: unknown): string {
  return normalizeText(value).toLowerCase();
}

function practicalItemFamilyKey(item: PracticalReferencePreviewItem): string {
  return [normalizeLookup(item.sourceId), normalizeLookup(item.title)].join('::');
}

function mergePracticalReferenceItems(
  implementationItems: PracticalReferencePreviewItem[],
  generalItems: PracticalReferencePreviewItem[],
  maxItems: number,
): PracticalReferencePreviewItem[] {
  const implementationByUrl = new Map<string, string[]>();
  const implementationByFamily = new Map<string, PracticalReferencePreviewItem>();

  for (const item of implementationItems || []) {
    const linkedAccommodationTitles = uniqueStrings(item.linkedAccommodationTitles || []);
    const byUrlKey = normalizeText(item.sourceUrl || '');
    const familyKey = practicalItemFamilyKey(item);

    if (byUrlKey) {
      implementationByUrl.set(
        byUrlKey,
        uniqueStrings([...(implementationByUrl.get(byUrlKey) || []), ...linkedAccommodationTitles]),
      );
    }

    if (familyKey) {
      const current = implementationByFamily.get(familyKey);
      implementationByFamily.set(familyKey, {
        ...(current || item),
        linkedAccommodationTitles: uniqueStrings([
          ...(current?.linkedAccommodationTitles || []),
          ...linkedAccommodationTitles,
        ]),
      });
    }
  }

  const merged: PracticalReferencePreviewItem[] = [];
  const usedFamilies = new Set<string>();

  for (const item of generalItems || []) {
    const familyKey = practicalItemFamilyKey(item);
    usedFamilies.add(familyKey);
    merged.push({
      ...item,
      linkedAccommodationTitles: uniqueStrings([
        ...(item.linkedAccommodationTitles || []),
        ...(implementationByUrl.get(normalizeText(item.sourceUrl || '')) || []),
        ...(implementationByFamily.get(familyKey)?.linkedAccommodationTitles || []),
      ]),
    });
  }

  if (merged.length >= maxItems) {
    return merged.slice(0, maxItems);
  }

  const usedSources = new Set(merged.map((item) => normalizeLookup(item.sourceId)));

  for (const item of implementationByFamily.values()) {
    if (merged.length >= maxItems) break;
    const familyKey = practicalItemFamilyKey(item);
    if (usedFamilies.has(familyKey)) continue;
    if (usedSources.has(normalizeLookup(item.sourceId))) continue;

    merged.push(item);
    usedFamilies.add(familyKey);
    usedSources.add(normalizeLookup(item.sourceId));
  }

  for (const item of implementationByFamily.values()) {
    if (merged.length >= maxItems) break;
    const familyKey = practicalItemFamilyKey(item);
    if (usedFamilies.has(familyKey)) continue;

    merged.push(item);
    usedFamilies.add(familyKey);
  }

  return merged.slice(0, maxItems);
}

function buildLinkStatements(
  assessment: Step4AssessmentShape,
  selectedAccommodationTitles: string[],
): Step4LinkStatement[] {
  const statements: Step4LinkStatement[] = [];
  const accommodations = Array.isArray(assessment.accommodations) ? assessment.accommodations : [];
  const selectedSet = new Set(
    (selectedAccommodationTitles || []).map((title) => normalizeText(title)).filter(Boolean),
  );
  const selectedAccommodations =
    selectedSet.size > 0
      ? accommodations.filter((item) => selectedSet.has(normalizeText(item.title)))
      : accommodations
          .slice()
          .sort((a, b) => Number(a.priority || 99) - Number(b.priority || 99))
          .slice(0, 4);

  for (const item of selectedAccommodations) {
    const title = normalizeText(item.title);
    if (!title) continue;
    const parts = [title, normalizeText(item.reason), normalizeText(item.examples)].filter(Boolean);
    statements.push({
      label: '配慮候補',
      text: parts.join(' / '),
      priority: 24,
    });
  }

  const causalSummary = normalizeText(assessment.causal_summary || assessment.summary);
  if (causalSummary) {
    statements.push({
      label: '見立て要約',
      text: causalSummary,
      priority: 18,
    });
  }

  const agreement = normalizeText(assessment.agreement);
  if (agreement) {
    statements.push({
      label: '合意文書',
      text: agreement,
      priority: 16,
    });
  }

  const kpi = normalizeText(assessment.kpi);
  if (kpi) {
    statements.push({
      label: 'KPI',
      text: kpi,
      priority: 12,
    });
  }

  return statements;
}

function detailSearchText(detail: CitationEvidenceDetail): string {
  return normalizeText(
    [
      detail.summary,
      ...(detail.conditions || []),
      ...(detail.missing_contexts || []),
      ...(detail.sample_excerpts || []).map((item) => item.excerpt),
      ...(detail.source_names || []),
    ].join(' '),
  );
}

function countSharedTokens(textA: string, textB: string): number {
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));
  let count = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) count += 1;
  }
  return count;
}

function baseBasisScore(detail: CitationEvidenceDetail): number {
  let score = 0;
  const lane = normalizeText(detail.evidence_lane);
  const confidenceLevel = normalizeText(detail.confidence_level);
  const sourceIds = uniqueStrings(detail.source_ids || []);
  const scopes = uniqueStrings(detail.evidence_scopes || []);

  if (lane === 'case_practice') score += 20;
  if (lane === 'employer_guidance') score += 16;
  if (lane === 'legal_policy') score += 12;
  if (scopes.includes('specific_case')) score += 10;
  if (confidenceLevel === 'high') score += 16;
  if (confidenceLevel === 'medium') score += 8;
  if (typeof detail.confidence_score === 'number') {
    score += Math.round(detail.confidence_score * 20);
  }
  if (detail.public_safe) score += 8;
  if (detail.is_partial) score -= 8;
  if (normalizeText(detail.risk_level) === 'medium') score -= 5;
  if (normalizeText(detail.risk_level) === 'high') score -= 12;

  for (const sourceId of sourceIds) {
    if (sourceId === 'askjan_website') score += 12;
    if (sourceId === 'askearn_employer_guidance') score += 11;
    if (sourceId === 'australia_jobaccess_guidance') score += 10;
    if (sourceId === 'canada_duty_to_accommodate') score += 10;
    if (sourceId === 'uk_gov_disability_employment') score += 8;
    if (sourceId === 'eu_reasonable_accommodation') score += 7;
    if (sourceId === 'jeed_reference') score += 2;
  }

  return score;
}

function baseReferenceScore(detail: CitationEvidenceDetail): number {
  let score = 0;
  const sourceIds = uniqueStrings(detail.source_ids || []);
  const scopes = uniqueStrings(detail.evidence_scopes || []);
  const pageTypes = uniqueStrings(detail.page_types || []);

  if (scopes.includes('specific_case')) score += 18;
  if (pageTypes.includes('case_detail') || pageTypes.includes('case_guide')) score += 12;
  if (pageTypes.includes('employer_guidance_page')) score += 10;
  if (pageTypes.includes('employer_toolkit')) score += 9;
  if (pageTypes.includes('document')) score += 4;

  for (const sourceId of sourceIds) {
    if (sourceId === 'askjan_website') score += 12;
    if (sourceId === 'askearn_employer_guidance') score += 11;
    if (sourceId === 'australia_jobaccess_guidance') score += 10;
    if (sourceId === 'canada_duty_to_accommodate') score += 10;
    if (sourceId === 'uk_headway_brain_injury_work') score += 8;
    if (sourceId === 'uk_gov_disability_employment') score += 7;
    if (sourceId === 'eu_reasonable_accommodation') score += 6;
    if (sourceId === 'jeed_reference') score += 2;
  }

  return score;
}

function pickBestLinkedStatement(
  detail: CitationEvidenceDetail,
  statements: Step4LinkStatement[],
): { claim: string; score: number } {
  const searchText = detailSearchText(detail);
  let best: Step4LinkStatement | null = null;
  let bestScore = -1;

  for (const statement of statements) {
    const overlap = countSharedTokens(searchText, statement.text);
    const score = overlap * 6 + statement.priority;
    if (score > bestScore) {
      best = statement;
      bestScore = score;
    }
  }

  if (!best) {
    return {
      claim: '今回の相談で使える根拠・参考資料',
      score: 0,
    };
  }

  return {
    claim: `${best.label}: ${best.text}`,
    score: bestScore,
  };
}

function primarySourceKey(detail: CitationEvidenceDetail): string {
  return normalizeText(detail.source_ids?.[0] || detail.source_names?.[0] || detail.evidence_id);
}

function selectDiverseCitations(
  citations: Step4SyntheticCitation[],
  maxItems: number,
  options?: {
    maxPerSource?: number;
    targetDistinctSources?: number;
  },
): Step4SyntheticCitation[] {
  const maxPerSource = Math.max(1, Number(options?.maxPerSource || 2));
  const targetDistinctSources = Math.max(1, Number(options?.targetDistinctSources || 3));
  const ordered = [...(citations || [])];
  const counts = new Map<string, number>();
  const selected: Step4SyntheticCitation[] = [];
  const usedDistinct = new Set<string>();

  for (const citation of ordered) {
    if (selected.length >= maxItems) break;
    const sourceKey = primarySourceKey(citation.evidence_details[0]);
    if (usedDistinct.has(sourceKey)) continue;
    selected.push(citation);
    usedDistinct.add(sourceKey);
    counts.set(sourceKey, 1);
    if (usedDistinct.size >= targetDistinctSources) break;
  }

  for (const citation of ordered) {
    if (selected.length >= maxItems) break;
    if (selected.includes(citation)) continue;
    const sourceKey = primarySourceKey(citation.evidence_details[0]);
    if (Number(counts.get(sourceKey) || 0) >= maxPerSource) continue;
    selected.push(citation);
    counts.set(sourceKey, Number(counts.get(sourceKey) || 0) + 1);
  }

  return selected;
}

function assignRankScore(
  citations: Step4SyntheticCitation[],
  startingScore = 100,
): Step4SyntheticCitation[] {
  return citations.map((citation, index) => ({
    ...citation,
    evidence_details: citation.evidence_details.map((detail) => ({
      ...detail,
      rank_score: startingScore - index,
    })),
  }));
}

function buildBasisCitations(
  details: CitationEvidenceDetail[],
  statements: Step4LinkStatement[],
  context?: EvidencePresentationContext,
): Step4SyntheticCitation[] {
  const candidates = details
    .filter(
      (detail) =>
        resolveEvidencePresentationRole(detail) === 'direct_basis' && detail.public_safe !== false,
    )
    .map((detail) => {
      const linked = pickBestLinkedStatement(detail, statements);
      const rankScore = baseBasisScore(detail) + linked.score;
      return {
        claim: linked.claim,
        evidence_ids: [detail.evidence_id],
        evidence_details: [
          {
            ...detail,
            rank_score: rankScore,
          },
        ],
      } as Step4SyntheticCitation;
    });

  const sorted = sortCitationsByContext(candidates, context).sort((a, b) => {
    const scoreA = Number(a.evidence_details?.[0]?.rank_score || 0);
    const scoreB = Number(b.evidence_details?.[0]?.rank_score || 0);
    return scoreB - scoreA;
  });

  return assignRankScore(
    selectDiverseCitations(sorted, 5, { maxPerSource: 2, targetDistinctSources: 3 }),
  );
}

function buildReferenceCitations(
  details: CitationEvidenceDetail[],
  statements: Step4LinkStatement[],
  context?: EvidencePresentationContext,
): Step4SyntheticCitation[] {
  const raw = details
    .filter((detail) => resolveEvidencePresentationRole(detail) === 'related_reading')
    .map((detail) => {
      const linked = pickBestLinkedStatement(detail, statements);
      const rankScore = baseReferenceScore(detail) + linked.score;
      return {
        claim: linked.claim,
        evidence_ids: [detail.evidence_id],
        evidence_details: [
          {
            ...detail,
            rank_score: rankScore,
          },
        ],
      } as Step4SyntheticCitation;
    });

  const enriched = enrichReferenceCitationsByContext(
    filterReferenceCitationsByUsefulness(raw, context),
    context,
  );
  const sorted = sortCitationsByContext(enriched, context).sort((a, b) => {
    const scoreA = Number(a.evidence_details?.[0]?.rank_score || 0);
    const scoreB = Number(b.evidence_details?.[0]?.rank_score || 0);
    return scoreB - scoreA;
  });

  return assignRankScore(
    selectDiverseCitations(sorted, 6, { maxPerSource: 2, targetDistinctSources: 3 }),
    80,
  );
}

export async function buildStep4EvidencePack(
  input: Step4EvidencePackInput,
): Promise<Step4OutputModel> {
  const claimIds = uniqueStrings(input.claimIds || []);
  const practicalMaxItems = input.practicalMaxItems || 6;
  const claimDetails = claimIds.length > 0 ? await getCitationEvidenceDetails(claimIds) : [];
  const selectedAccommodationTitles = uniqueStrings(
    (input.practicalContext?.selectedAccommodationTitles || []).map((title) => normalizeText(title)),
  );
  const statements = buildLinkStatements(input.assessment, selectedAccommodationTitles);
  const basisCitations = buildBasisCitations(claimDetails, statements, input.evidenceContext);
  const referenceCitations = buildReferenceCitations(claimDetails, statements, input.evidenceContext);

  const implementationKnowledgeItems = await buildImplementationKnowledgeCatalog({
    accommodations: input.assessment.accommodations || [],
    evidence: input.evidence || [],
    practicalContext: input.practicalContext,
    maxAccommodations: 3,
    maxItemsPerAccommodation: 4,
  }).catch(() => []);
  const implementationPracticalItems = flattenImplementationKnowledgeCatalog(
    implementationKnowledgeItems,
    practicalMaxItems,
  );
  const generalPracticalItems: PracticalReferencePreviewItem[] = await buildPracticalReferencePreview(
    input.evidence || [],
    practicalMaxItems,
    input.practicalContext,
  ).catch(() => []);
  const practicalReferenceItems = mergePracticalReferenceItems(
    implementationPracticalItems,
    generalPracticalItems,
    practicalMaxItems,
  );

  return buildStep4OutputModel({
    basisCitations,
    referenceCitations,
    supportCatalogItems: input.supportCatalogItems || [],
    implementationKnowledgeItems,
    practicalReferenceItems,
  });
}
