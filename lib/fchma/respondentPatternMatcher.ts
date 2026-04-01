import type { FchmaMinimalSignalPreview } from '@/lib/fchma/minimalIntake';
import {
  listFchmaRespondentManifoldPatterns,
  type FchmaRespondentManifoldPattern,
} from '@/lib/fchma/respondentPatternLibrary';

export type FchmaHighLiftRow = {
  canonical_concept: string;
  firstLabel: string;
  lift: number;
};

export type FchmaRespondentPatternMatch = {
  patternKey: string;
  score: number;
  matchedKeywordGroups: string[];
  matchedHealthConditions: string[];
  causalSummary: string;
  causalAmplifiers: string[];
  interventionPorts: string[];
  rationale: string;
  clusterSubjectCount: number;
  topLabels: Record<string, string[]>;
  representativeNarratives: Array<{ canonical_concept: string; unit_text: string }>;
  highLiftRows: FchmaHighLiftRow[];
};

const KEYWORD_GROUPS: Record<string, string[]> = {
  fatigue: ['疲', '疲労', 'だる', '倦怠', 'しんど'],
  pain: ['痛', '疼'],
  communication: ['聞き', '聞こ', '話', '会話', 'コミュニケーション', '説明', '伝え'],
  cognition: ['集中', '理解', '注意', '忘', '頭', '眠'],
  time_schedule: ['時間', '勤務', 'シフト', '休憩', '残業', '会議', '午後', '朝'],
  mobility: ['通勤', '移動', '歩', '立', '階段'],
  emotion: ['不安', 'ストレス', '落ち込', '迷', '心配'],
  support: ['配慮', '支援', '上司', '人事', '相談', '調整', 'ジョブコーチ'],
};

function detectKeywordGroups(text: string): string[] {
  const normalized = text.trim();
  if (!normalized) {
    return [];
  }

  return Object.entries(KEYWORD_GROUPS)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([group]) => group);
}

function overlapHealthConditions(
  preview: FchmaMinimalSignalPreview,
  pattern: FchmaRespondentManifoldPattern,
): string[] {
  const healthLabels = pattern.top_labels_by_concept.health_condition ?? [];
  return preview.extractedSignals.healthConditions.filter((condition) =>
    healthLabels.some((label) => label.includes(condition)),
  );
}

function hypothesisAlignmentScore(preview: FchmaMinimalSignalPreview, pattern: FchmaRespondentManifoldPattern): number {
  const hypothesisLabels = preview.reasoningBundle.structurePreview.hypotheses.map((item) => item.label);
  const chain = pattern.causal_framework.chain.join(' / ');
  let score = 0;

  if (hypothesisLabels.includes('activity_participation_stability') && chain.includes('activities -> participation')) {
    score += 2;
  }
  if (hypothesisLabels.includes('accommodation_gap_amplification') && chain.includes('environmental_factors -> participation')) {
    score += 2;
  }
  if (hypothesisLabels.includes('future_outlook_fragility') && chain.includes('personal_factors -> participation')) {
    score += 2;
  }

  return score;
}

function buildMatchRationale(
  matchedKeywordGroups: string[],
  matchedHealthConditions: string[],
  pattern: FchmaRespondentManifoldPattern,
): string {
  const parts: string[] = [];
  if (matchedKeywordGroups.length > 0) {
    parts.push(`keyword overlap: ${matchedKeywordGroups.join(', ')}`);
  }
  if (matchedHealthConditions.length > 0) {
    parts.push(`health overlap: ${matchedHealthConditions.join('、')}`);
  }
  parts.push(`causal frame: ${pattern.causal_framework.summary}`);
  return parts.join(' / ');
}

export async function matchFchmaRespondentPatternsForPreview(
  preview: FchmaMinimalSignalPreview,
  limit = 3,
): Promise<FchmaRespondentPatternMatch[]> {
  const patterns = await listFchmaRespondentManifoldPatterns();
  const activeKeywordGroups = detectKeywordGroups(preview.consultation);

  const matches = patterns
    .map((pattern) => {
      const matchedKeywordGroups = pattern.dominant_keyword_groups.filter((group) =>
        activeKeywordGroups.includes(group),
      );
      const matchedHealthConditions = overlapHealthConditions(preview, pattern);
      const score =
        matchedKeywordGroups.length * 3 +
        matchedHealthConditions.length * 2 +
        hypothesisAlignmentScore(preview, pattern);

      // Build high-lift rows: one best row per canonical_concept, sorted by lift descending
      const seenConcepts = new Set<string>();
      const highLiftRows: FchmaHighLiftRow[] = (pattern.prevalence_rows ?? [])
        .slice()
        .sort((a, b) => b.lift - a.lift)
        .filter((row) => {
          if (seenConcepts.has(row.canonical_concept)) return false;
          seenConcepts.add(row.canonical_concept);
          return row.lift >= 2;
        })
        .slice(0, 4)
        .map((row) => ({
          canonical_concept: row.canonical_concept,
          firstLabel: row.label_text.split('|')[0].trim(),
          lift: row.lift,
        }));

      return {
        patternKey: pattern.pattern_key,
        score,
        matchedKeywordGroups,
        matchedHealthConditions,
        causalSummary: pattern.causal_framework.summary,
        causalAmplifiers: pattern.causal_framework.amplifiers,
        interventionPorts: pattern.causal_framework.intervention_ports,
        rationale: buildMatchRationale(matchedKeywordGroups, matchedHealthConditions, pattern),
        clusterSubjectCount: pattern.cluster_subject_count,
        topLabels: pattern.top_labels_by_concept,
        representativeNarratives: pattern.representative_narratives.slice(0, 3).map((n) => ({
          canonical_concept: n.canonical_concept,
          unit_text: n.unit_text,
        })),
        highLiftRows,
      };
    })
    .filter((pattern) => pattern.score > 0)
    .sort((left, right) => right.score - left.score || left.patternKey.localeCompare(right.patternKey))
    .slice(0, limit);

  return matches;
}
