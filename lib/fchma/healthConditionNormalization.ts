import healthConditionNormalizationSeedsJson from '@/data/specs/icd/health-condition-normalization-seeds-v0.json';

type HealthConditionNormalizationSeedEntry = {
  id: string;
  raw_label: string;
  preferred_label_seed: string;
  alias_candidates: string[];
  label_kind: string;
  normalization_scope: string;
  icd_lookup_priority: 'none' | 'medium' | 'high';
  source_dataset_ids: string[];
  source_fields: string[];
  review_required: boolean;
  notes: string[];
};

type HealthConditionNormalizationSeedPayload = {
  version: string;
  entries: HealthConditionNormalizationSeedEntry[];
};

export type FchmaHealthConditionNormalizationCandidate = {
  seedId: string;
  preferredLabelSeed: string;
  matchedAlias: string;
  matchType: 'exact' | 'contains';
  labelKind: string;
  normalizationScope: string;
  icdLookupPriority: 'none' | 'medium' | 'high';
  sourceDatasetIds: string[];
  sourceFields: string[];
  reviewRequired: boolean;
};

type ScoredCandidate = {
  score: number;
  candidate: FchmaHealthConditionNormalizationCandidate;
};

const healthConditionNormalizationSeeds =
  healthConditionNormalizationSeedsJson as HealthConditionNormalizationSeedPayload;

function normalizeForMatch(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/[\s　]+/g, '').trim();
}

function priorityWeight(priority: FchmaHealthConditionNormalizationCandidate['icdLookupPriority']): number {
  if (priority === 'high') return 3;
  if (priority === 'medium') return 2;
  return 1;
}

export function getHealthConditionNormalizationCandidates(
  rawLabel: string,
  limit = 5,
): FchmaHealthConditionNormalizationCandidate[] {
  const normalizedRaw = normalizeForMatch(rawLabel);
  if (!normalizedRaw) {
    return [];
  }

  const scored: ScoredCandidate[] = [];

  for (const entry of healthConditionNormalizationSeeds.entries) {
    for (const alias of entry.alias_candidates) {
      const normalizedAlias = normalizeForMatch(alias);
      if (!normalizedAlias) {
        continue;
      }

      if (normalizedRaw === normalizedAlias) {
        scored.push({
          score: 100,
          candidate: {
            seedId: entry.id,
            preferredLabelSeed: entry.preferred_label_seed,
            matchedAlias: alias,
            matchType: 'exact',
            labelKind: entry.label_kind,
            normalizationScope: entry.normalization_scope,
            icdLookupPriority: entry.icd_lookup_priority,
            sourceDatasetIds: entry.source_dataset_ids,
            sourceFields: entry.source_fields,
            reviewRequired: entry.review_required,
          },
        });
        continue;
      }

      if (normalizedRaw.includes(normalizedAlias) || normalizedAlias.includes(normalizedRaw)) {
        scored.push({
          score: 70,
          candidate: {
            seedId: entry.id,
            preferredLabelSeed: entry.preferred_label_seed,
            matchedAlias: alias,
            matchType: 'contains',
            labelKind: entry.label_kind,
            normalizationScope: entry.normalization_scope,
            icdLookupPriority: entry.icd_lookup_priority,
            sourceDatasetIds: entry.source_dataset_ids,
            sourceFields: entry.source_fields,
            reviewRequired: entry.review_required,
          },
        });
      }
    }
  }

  scored
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return (
        priorityWeight(right.candidate.icdLookupPriority) -
        priorityWeight(left.candidate.icdLookupPriority)
      );
    });

  const deduped: FchmaHealthConditionNormalizationCandidate[] = [];
  const seen = new Set<string>();

  for (const item of scored) {
    if (seen.has(item.candidate.seedId)) {
      continue;
    }
    deduped.push(item.candidate);
    seen.add(item.candidate.seedId);
    if (deduped.length >= limit) {
      break;
    }
  }

  return deduped;
}
