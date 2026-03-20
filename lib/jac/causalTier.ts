export type CausalTier = 'A' | 'B' | 'C';

export type CausalBasis = 'glm_direct' | 'triangulated_inference' | 'associative_reference';

export type CausalTierInput = {
  expectedTier: CausalTier;
  glmHitCount: number;
  data2HitCount: number;
  claimEvidenceCount: number;
  evidenceLanes: string[];
  countries: string[];
  sourceRegions: string[];
};

export type CausalTierResult = {
  expectedTier: CausalTier;
  expectedTierMet: boolean;
  tier: CausalTier;
  basis: CausalBasis;
  label: string;
  summary: string;
  guardrail: string;
  triangulationScore: number;
};

function uniqueNonEmpty(values: string[]): string[] {
  return Array.from(new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean)));
}

function isPracticalLane(lane: string): boolean {
  return lane === 'case_practice' || lane === 'mixed' || lane === 'legal_policy' || lane === 'employer_guidance';
}

export function evaluateCausalTier(input: CausalTierInput): CausalTierResult {
  const expectedTier: CausalTier = input.expectedTier || 'B';
  const glmHitCount = Number(input.glmHitCount || 0);

  const lanes = uniqueNonEmpty(input.evidenceLanes || []);
  const countries = uniqueNonEmpty(input.countries || []);
  const sourceRegions = uniqueNonEmpty(input.sourceRegions || []);

  let triangulationScore = 0;
  if (Number(input.data2HitCount || 0) > 0) triangulationScore += 1;
  if (Number(input.claimEvidenceCount || 0) > 0) triangulationScore += 1;
  if (lanes.some((lane) => isPracticalLane(lane))) triangulationScore += 1;
  if (countries.length > 0 || sourceRegions.length >= 2) triangulationScore += 1;

  if (expectedTier === 'A') {
    if (glmHitCount > 0) {
      return {
        expectedTier,
        expectedTierMet: true,
        tier: 'A',
        basis: 'glm_direct',
        label: 'Tier A: GLM直接因果',
        summary: `設計Tier=A。難病GLMの有意関係に直接接続（GLM hit ${glmHitCount}）。`,
        guardrail: '難病GLMの適用範囲外へは、同じ強度で一般化しない。',
        triangulationScore,
      };
    }
    if (triangulationScore >= 3) {
      return {
        expectedTier,
        expectedTierMet: false,
        tier: 'B',
        basis: 'triangulated_inference',
        label: 'Tier B: 三角測量因果推定',
        summary: `設計Tier=AだがGLM直接根拠が不足。暫定的に三角測量で運用（score ${triangulationScore}/4）。`,
        guardrail: 'A要件（GLM直接根拠）を再取得するまで、条件付き因果表現に限定する。',
        triangulationScore,
      };
    }
    return {
      expectedTier,
      expectedTierMet: false,
      tier: 'C',
      basis: 'associative_reference',
      label: 'Tier C: 関連知見',
      summary: `設計Tier=Aだが根拠不足。関連知見に留める（score ${triangulationScore}/4）。`,
      guardrail: '因果断定を停止し、GLM接続か追加観測を優先する。',
      triangulationScore,
    };
  }

  const bQualified = triangulationScore >= 3 || (glmHitCount > 0 && triangulationScore >= 2);
  if (expectedTier === 'B' && bQualified) {
    return {
      expectedTier,
      expectedTierMet: true,
      tier: 'B',
      basis: 'triangulated_inference',
      label: 'Tier B: 三角測量因果推定',
      summary:
        glmHitCount > 0
          ? `設計Tier=B。GLM補助信号を参照しつつ、data2・claims・制度/運用で三角測量（score ${triangulationScore}/4）。`
          : `設計Tier=B。data2・claims・制度/運用を統合して因果仮説を構成（score ${triangulationScore}/4）。`,
      guardrail: 'person/job/environment/time の条件一致が崩れたら、提案を再評価する。',
      triangulationScore,
    };
  }

  if (expectedTier === 'B') {
    return {
      expectedTier,
      expectedTierMet: false,
      tier: 'C',
      basis: 'associative_reference',
      label: 'Tier C: 関連知見',
      summary: `設計Tier=Bだが三角測量が不足。関連知見に留める（score ${triangulationScore}/4）。`,
      guardrail: '追加観測で data2/claims/制度レーンの不足を補ってから再判定する。',
      triangulationScore,
    };
  }

  return {
    expectedTier,
    expectedTierMet: expectedTier === 'C',
    tier: 'C',
    basis: 'associative_reference',
    label: 'Tier C: 関連知見',
    summary: `設計Tier=C。関連知見として利用し、因果断定は行わない（score ${triangulationScore}/4）。`,
    guardrail: '因果断定を避け、追加観測または個別相談でA/Bへ昇格判定する。',
    triangulationScore,
  };
}

export function causalTierPriority(tier: CausalTier): number {
  if (tier === 'A') return 28;
  if (tier === 'B') return 14;
  return 0;
}
