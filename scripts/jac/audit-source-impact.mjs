#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ENFORCE = process.argv.includes('--enforce');
const MIN_REVIEW_ELIGIBLE_CLAIMS = Number(process.env.JAC_SOURCE_IMPACT_MIN_ELIGIBLE || 5);
const MIN_MICROCOPY_COVERAGE = Number(process.env.JAC_SOURCE_IMPACT_MIN_MICROCOPY || 0.8);
const MIN_STRUCTURAL_COVERAGE = Number(process.env.JAC_SOURCE_IMPACT_MIN_STRUCTURAL || 0.6);
const GUIDE_PATH = path.join(process.cwd(), 'pages', 'jac', 'guide.tsx');
const CLAIMS_JSONL_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');

const NOISY_STATEMENT_REGEX =
  /(close menu|toggle navigation|skip to main content|サイトマップ|検索結果|本文へ|文字サイズ変更|背景色変更|all rights reserved|copyright|メニュー\s*閉じる)/i;

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function countKeywordMatches(text, keywords) {
  const normalized = normalizeText(text);
  return (Array.isArray(keywords) ? keywords : []).reduce((count, keyword) => {
    if (!keyword) return count;
    return normalized.includes(normalizeText(keyword)) ? count + 1 : count;
  }, 0);
}

function overlapCount(values, targets) {
  const targetSet = new Set((Array.isArray(targets) ? targets : []).map((value) => String(value)));
  return (Array.isArray(values) ? values : []).reduce((count, value) => {
    return targetSet.has(String(value)) ? count + 1 : count;
  }, 0);
}

function extractObjectSource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const braceStart = fileText.indexOf('{', markerIndex);
  if (braceStart < 0) return null;

  let depth = 0;
  let braceEnd = -1;
  for (let index = braceStart; index < fileText.length; index += 1) {
    const ch = fileText[index];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        braceEnd = index;
        break;
      }
    }
  }
  if (braceEnd < 0) return null;
  return fileText.slice(braceStart, braceEnd + 1);
}

async function readClaimsJsonl(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function normalizeEvidenceLane(value) {
  const lane = String(value || '').trim();
  if (!lane) return 'unknown';
  return ['case_practice', 'mixed', 'legal_policy', 'employer_guidance', 'aggregated_general'].includes(
    lane,
  )
    ? lane
    : 'unknown';
}

function createSourceStats(sourceId) {
  return {
    sourceId,
    totalClaims: 0,
    highRiskClaims: 0,
    noisyClaims: 0,
    eligibleClaims: 0,
    coveredClaims: 0,
    uncoveredClaims: 0,
    evidenceLanes: {},
    matchedCards: {},
    sampleCoveredStatements: [],
    sampleUncoveredStatements: [],
  };
}

function pushSample(bucket, value, max = 5) {
  if (!value) return;
  if (bucket.includes(value)) return;
  if (bucket.length >= max) return;
  bucket.push(value);
}

function classifySourceImpact(summary) {
  if (summary.totalClaims > 0 && summary.eligibleClaims === 0 && summary.highRiskClaims > 0) {
    return {
      action: 'risk_gated_manual_review',
      rationale:
        'このsourceのclaimが高リスク扱いで自動評価対象から外れている。26フレーム影響は、手動レビューと根拠レーン見直しを前提に判断する。',
    };
  }

  if (summary.eligibleClaims < MIN_REVIEW_ELIGIBLE_CLAIMS) {
    return {
      action: 'monitor',
      rationale: 'claim母数が小さいため、構造判断は保留。',
    };
  }

  if (summary.coverageRate >= MIN_MICROCOPY_COVERAGE) {
    return {
      action: 'microcopy_ok',
      rationale: '現行26フレームへ概ね吸収できており、基本は微修正で対応可能。',
    };
  }

  if (
    summary.coverageRate >= MIN_STRUCTURAL_COVERAGE &&
    summary.uncoveredClaims <= Math.max(3, Math.floor(summary.eligibleClaims * 0.25))
  ) {
    return {
      action: 'copy_review',
      rationale: '境界説明や関連フレーム導線の見直しで吸収できる可能性が高い。',
    };
  }

  return {
    action: 'frame_review_candidate',
    rationale: '未吸収claimが多く、26フレーム自体の境界またはクラスタ再点検が必要。',
  };
}

async function main() {
  const [guideText, claims] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    readClaimsJsonl(CLAIMS_JSONL_PATH),
  ]);

  const profilesSource = extractObjectSource(
    guideText,
    'const CARD_MINING_PROFILES: Record<string, CardMiningProfile> =',
  );
  const facetsSource = extractObjectSource(
    guideText,
    'const PATTERN_DISABILITY_FACETS: Record<string, DisabilityFacetKey[]> =',
  );
  if (!profilesSource || !facetsSource) {
    throw new Error('Failed to parse CARD_MINING_PROFILES or PATTERN_DISABILITY_FACETS from guide.tsx');
  }

  const profiles = new Function(`return (${profilesSource});`)();
  const patternFacets = new Function(`return (${facetsSource});`)();
  const sourceMap = new Map();

  for (const claim of claims) {
    const sourceIds = Array.isArray(claim?.sourceIds) && claim.sourceIds.length > 0 ? claim.sourceIds : ['unknown'];
    for (const rawSourceId of sourceIds) {
      const sourceId = String(rawSourceId || '').trim() || 'unknown';
      if (!sourceMap.has(sourceId)) sourceMap.set(sourceId, createSourceStats(sourceId));
      sourceMap.get(sourceId).totalClaims += 1;
    }

    const riskLevel = String(claim?.risk?.level || '');
    const statement = String(claim?.statement || '').trim();
    const isNoisy = NOISY_STATEMENT_REGEX.test(statement);

    for (const rawSourceId of sourceIds) {
      const sourceId = String(rawSourceId || '').trim() || 'unknown';
      const stats = sourceMap.get(sourceId);
      if (!stats) continue;
      if (riskLevel === 'high') stats.highRiskClaims += 1;
      if (isNoisy) stats.noisyClaims += 1;
    }

    if (!statement || riskLevel === 'high' || isNoisy) {
      continue;
    }

    const canonical = String(claim?.canonicalStatement || statement);
    const text = `${statement} ${canonical}`;
    const accommodationFacets = Array.isArray(claim?.interactionContextSummary?.accommodationFacets)
      ? claim.interactionContextSummary.accommodationFacets
      : [];
    const disabilityFacets = Array.isArray(claim?.interactionContextSummary?.disabilityFacets)
      ? claim.interactionContextSummary.disabilityFacets
      : [];
    const signal = String(claim?.signal || '');
    const evidenceLane = normalizeEvidenceLane(claim?.interactionContextSummary?.evidenceLane);

    const matchedCards = Object.entries(profiles)
      .map(([cardId, profile]) => {
        const keywordScore = countKeywordMatches(text, profile.claimKeywords || []);
        const signalScore = signal && Array.isArray(profile.preferredSignals) && profile.preferredSignals.includes(signal) ? 1 : 0;
        const accommodationScore = overlapCount(
          accommodationFacets,
          Array.isArray(profile.accommodationFacets) ? profile.accommodationFacets : [],
        );
        const disabilityScore = overlapCount(
          disabilityFacets,
          Array.isArray(patternFacets[cardId]) ? patternFacets[cardId] : [],
        );
        const score = keywordScore + signalScore + accommodationScore + disabilityScore;
        return {
          cardId,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.cardId.localeCompare(b.cardId, 'ja');
      });

    const covered = matchedCards.length > 0;

    for (const rawSourceId of sourceIds) {
      const sourceId = String(rawSourceId || '').trim() || 'unknown';
      const stats = sourceMap.get(sourceId);
      if (!stats) continue;

      stats.eligibleClaims += 1;
      stats.evidenceLanes[evidenceLane] = (stats.evidenceLanes[evidenceLane] || 0) + 1;

      if (covered) {
        stats.coveredClaims += 1;
        pushSample(stats.sampleCoveredStatements, statement);
        matchedCards.slice(0, 3).forEach((item) => {
          stats.matchedCards[item.cardId] = (stats.matchedCards[item.cardId] || 0) + item.score;
        });
      } else {
        stats.uncoveredClaims += 1;
        pushSample(stats.sampleUncoveredStatements, statement);
      }
    }
  }

  const sourceSummaries = Array.from(sourceMap.values())
    .map((stats) => {
      const coverageRate =
        stats.eligibleClaims === 0 ? 0 : Number((stats.coveredClaims / stats.eligibleClaims).toFixed(3));
      const topMatchedCards = Object.entries(stats.matchedCards)
        .map(([cardId, score]) => ({ cardId, score }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.cardId.localeCompare(b.cardId, 'ja');
        })
        .slice(0, 5);
      const laneCoverage = Object.entries(stats.evidenceLanes)
        .map(([lane, count]) => ({ lane, count }))
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return a.lane.localeCompare(b.lane, 'ja');
        });
      const classification = classifySourceImpact({
        ...stats,
        coverageRate,
      });

      return {
        sourceId: stats.sourceId,
        totalClaims: stats.totalClaims,
        highRiskClaims: stats.highRiskClaims,
        noisyClaims: stats.noisyClaims,
        eligibleClaims: stats.eligibleClaims,
        coveredClaims: stats.coveredClaims,
        uncoveredClaims: stats.uncoveredClaims,
        coverageRate,
        laneCoverage,
        topMatchedCards,
        sampleCoveredStatements: stats.sampleCoveredStatements,
        sampleUncoveredStatements: stats.sampleUncoveredStatements,
        action: classification.action,
        rationale: classification.rationale,
      };
    })
    .sort((a, b) => {
      if (b.eligibleClaims !== a.eligibleClaims) return b.eligibleClaims - a.eligibleClaims;
      if (a.coverageRate !== b.coverageRate) return a.coverageRate - b.coverageRate;
      return a.sourceId.localeCompare(b.sourceId, 'ja');
    });

  const structuralReviewCandidates = sourceSummaries.filter(
    (summary) => summary.action === 'frame_review_candidate',
  );
  const watchSources = sourceSummaries.filter(
    (summary) =>
      summary.action === 'copy_review' ||
      summary.action === 'frame_review_candidate' ||
      summary.action === 'risk_gated_manual_review',
  );
  const totalEligibleClaims = sourceSummaries.reduce((sum, row) => sum + row.eligibleClaims, 0);
  const totalCoveredClaims = sourceSummaries.reduce((sum, row) => sum + row.coveredClaims, 0);

  const summary = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      minReviewEligibleClaims: MIN_REVIEW_ELIGIBLE_CLAIMS,
      minMicrocopyCoverage: MIN_MICROCOPY_COVERAGE,
      minStructuralCoverage: MIN_STRUCTURAL_COVERAGE,
    },
    overall: {
      sourceCount: sourceSummaries.length,
      eligibleClaims: totalEligibleClaims,
      coveredClaims: totalCoveredClaims,
      coverageRate:
        totalEligibleClaims === 0 ? 0 : Number((totalCoveredClaims / totalEligibleClaims).toFixed(3)),
    },
    watchSources,
    structuralReviewCandidates,
    sourceSummaries,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (ENFORCE && structuralReviewCandidates.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
