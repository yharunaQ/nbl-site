#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const GUIDE_PATH = path.join(process.cwd(), 'pages', 'jac', 'guide.tsx');
const DATA2_INDEX_PATH = path.join(
  process.cwd(),
  'references',
  'data2',
  'index',
  'data2-knowledge-index.json',
);
const CLAIMS_JSONL_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');

const RARE_ISSUE_MAX_COUNT = Number(process.env.JAC_RARE_ISSUE_MAX_COUNT || 2);
const RARE_CLAIM_TEXT_MAX_COUNT = Number(process.env.JAC_RARE_CLAIM_TEXT_MAX_COUNT || 1);
const RARE_CLAIM_MAX_EVIDENCE_COUNT = Number(process.env.JAC_RARE_CLAIM_MAX_EVIDENCE_COUNT || 3);
const HIGH_OVERLAP_JACCARD = Number(process.env.JAC_HIGH_OVERLAP_JACCARD || 0.55);
const LOW_DIFF_SCORE_THRESHOLD = Number(process.env.JAC_LOW_DIFF_SCORE_THRESHOLD || 2);

const NOISY_CLAIM_TEXT_REGEX =
  /(close menu|toggle navigation|all rights reserved|grid view|sort order|no products listed|table of contents|copyright|検索結果|本文へ|メニュー|サイトマップ)/i;

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

function normalizeClaimKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function shortenText(value, max = 140) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function isNoisyClaimText(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return true;
  if (text.length < 20) return true;
  return NOISY_CLAIM_TEXT_REGEX.test(text);
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

function extractArraySource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const equalIndex = fileText.indexOf('=', markerIndex);
  if (equalIndex < 0) return null;
  const start = fileText.indexOf('[', equalIndex);
  if (start < 0) return null;

  let depth = 0;
  let end = -1;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let index = start; index < fileText.length; index += 1) {
    const ch = fileText[index];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }
  }

  if (end < 0) return null;
  return fileText.slice(start, end + 1);
}

function jaccard(leftSet, rightSet) {
  let intersection = 0;
  for (const item of leftSet) {
    if (rightSet.has(item)) intersection += 1;
  }
  const union = leftSet.size + rightSet.size - intersection;
  return {
    intersection,
    union,
    score: union === 0 ? 0 : intersection / union,
  };
}

function toSet(items) {
  return new Set((items || []).map((item) => String(item || '').trim()).filter(Boolean));
}

function uniqueCount(leftItems, rightItems) {
  const leftSet = toSet(leftItems);
  const rightSet = toSet(rightItems);
  let leftUnique = 0;
  for (const item of leftSet) {
    if (!rightSet.has(item)) leftUnique += 1;
  }
  let rightUnique = 0;
  for (const item of rightSet) {
    if (!leftSet.has(item)) rightUnique += 1;
  }
  return {
    leftUnique,
    rightUnique,
    totalUnique: leftUnique + rightUnique,
  };
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

function detectClaimSourceGroup(claim) {
  const excerpts = Array.isArray(claim?.sampleExcerpts) ? claim.sampleExcerpts : [];
  const sourceIds = Array.isArray(claim?.sourceIds) ? claim.sourceIds.map((x) => String(x || '')) : [];

  const hasRawExcerpt = excerpts.some((item) => {
    const filePath = String(item?.filePath || '');
    return filePath.includes('/references/raw_data/') || filePath.startsWith('references/raw_data/');
  });
  const hasWebExcerpt = excerpts.some((item) => {
    const filePath = String(item?.filePath || '');
    return filePath.includes('/references/web-cache/') || filePath.startsWith('references/web-cache/');
  });

  const hasRawFallback = !hasRawExcerpt && sourceIds.includes('nbl_local_research');
  const hasRaw = hasRawExcerpt || hasRawFallback;
  const hasWeb = hasWebExcerpt;

  if (hasRaw && hasWeb) return 'mixed';
  if (hasRaw) return 'raw_data';
  if (hasWeb) return 'web_cache';
  return 'other';
}

function scoreClaimForCard(claimText, claimSignal, profile) {
  const claimHits = countKeywordMatches(claimText, profile.claimKeywords || []);
  const issueHits = countKeywordMatches(claimText, profile.issueKeywords || []);
  const supportHits = countKeywordMatches(claimText, profile.supportKeywords || []);
  const signalHit =
    String(claimSignal || '') &&
    Array.isArray(profile.preferredSignals) &&
    profile.preferredSignals.includes(String(claimSignal))
      ? 1
      : 0;
  return claimHits * 2 + issueHits + supportHits + signalHit;
}

function classifyUncoveredStatement(statement) {
  const text = String(statement || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'noise_empty';
  if (
    /(ご自由にご記載|ご自由に記載|任意|backナンバー|別ウィンドウ|本文へ|検索結果|table of contents|grid view|no products listed)/i.test(
      text,
    )
  ) {
    return 'noise_prompt_or_nav';
  }
  if (
    /(Performance Health|Listen Solutions|Rubbermaid|Akro-Mils|No Products Listed|Adjustable [A-Za-z]+|Rehab|Carts|Workstation)/i.test(
      text,
    ) ||
    ((text.match(/,/g) || []).length >= 8 && text.length > 120)
  ) {
    return 'noise_product_catalog';
  }
  if (
    /(equal employment|section\s+\d+|employer|temporarily supplied|classified as such|factors to consider|reasonable accommodations under)/i.test(
      text,
    )
  ) {
    return 'generic_legal_guidance';
  }
  if (
    /(accommodation ideas usually involve|support you get will depend on your needs|steps you can take|get the support you may need)/i.test(
      text,
    )
  ) {
    return 'generic_advice';
  }
  return 'potentially_actionable';
}

function suggestCardForStatement(statement, profiles, cardIds) {
  const text = String(statement || '');
  let best = { cardId: '', score: 0 };
  for (const cardId of cardIds) {
    const profile = profiles[cardId];
    if (!profile) continue;
    const score =
      countKeywordMatches(text, profile.claimKeywords || []) * 2 +
      countKeywordMatches(text, profile.issueKeywords || []) +
      countKeywordMatches(text, profile.supportKeywords || []);
    if (score > best.score) best = { cardId, score };
  }
  return best.cardId ? best : null;
}

function summarizeRareCoverage(label, rows, matchFn, context) {
  const occurrenceByKey = new Map();
  for (const row of rows) {
    const key = normalizeClaimKey(row.keyText);
    if (!key) continue;
    occurrenceByKey.set(key, (occurrenceByKey.get(key) || 0) + 1);
  }

  const rareRows = [];
  const uncoveredRareRows = [];
  for (const row of rows) {
    const occurrenceCount = occurrenceByKey.get(normalizeClaimKey(row.keyText)) || 0;
    const isRareByText = occurrenceCount <= RARE_CLAIM_TEXT_MAX_COUNT;
    const isRareByEvidence = Number(row.evidenceCount || 0) <= RARE_CLAIM_MAX_EVIDENCE_COUNT;
    if (!isRareByText && !isRareByEvidence) continue;

    const matchScores = matchFn(row);
    if (matchScores.length === 0) {
      uncoveredRareRows.push({
        id: row.id,
        statement: shortenText(row.statement),
        occurrenceCount,
        evidenceCount: row.evidenceCount,
      });
      continue;
    }

    matchScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.cardId.localeCompare(b.cardId, 'ja');
    });
    rareRows.push({
      id: row.id,
      statement: shortenText(row.statement),
      occurrenceCount,
      evidenceCount: row.evidenceCount,
      matchedCardCount: matchScores.length,
      primaryCardId: matchScores[0].cardId,
      primaryScore: matchScores[0].score,
    });
  }

  const rareByPrimary = new Map();
  for (const row of rareRows) {
    rareByPrimary.set(row.primaryCardId, (rareByPrimary.get(row.primaryCardId) || 0) + 1);
  }

  const rarePrimaryTop = Array.from(rareByPrimary.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([cardId, count]) => ({ cardId, count }));

  const fragileRareRows = rareRows.filter((row) => row.matchedCardCount === 1).slice(0, 20);

  const totalRareRows = rareRows.length + uncoveredRareRows.length;
  const uncoveredClassCounts = {};
  const actionableCandidates = [];
  for (const row of uncoveredRareRows) {
    const primaryClass = classifyUncoveredStatement(row.statement);
    let finalClass = primaryClass;
    let suggestion = null;

    if (primaryClass === 'potentially_actionable') {
      suggestion = suggestCardForStatement(row.statement, context.profiles, context.cardIds);
      if (!suggestion || suggestion.score <= 0) {
        finalClass = 'low_signal_context';
      } else {
        finalClass = 'actionable_unmatched';
      }
    }

    uncoveredClassCounts[finalClass] = (uncoveredClassCounts[finalClass] || 0) + 1;
    if (finalClass !== 'actionable_unmatched') continue;
    actionableCandidates.push({
      ...row,
      suggestedCardId: suggestion.cardId,
      suggestedScore: suggestion.score,
    });
  }

  const actionableUncoveredCount = actionableCandidates.length;
  const denominator = rareRows.length + uncoveredRareRows.length;
  const actionableCoverageRate =
    denominator === 0 ? 1 : Number(((denominator - actionableUncoveredCount) / denominator).toFixed(4));

  return {
    label,
    totalRareRows,
    coveredRareRows: rareRows.length,
    uncoveredRareRows: uncoveredRareRows.length,
    coverageRate: totalRareRows === 0 ? 1 : Number((rareRows.length / totalRareRows).toFixed(4)),
    fragileRareRows: fragileRareRows.length,
    fragileRareRowsTop: fragileRareRows,
    uncoveredRareRowsTop: uncoveredRareRows.slice(0, 20),
    rarePrimaryTop,
    uncoveredClassCounts,
    actionableUncoveredCount,
    actionableCoverageRate,
    actionableUncoveredTop: actionableCandidates
      .sort((a, b) => b.suggestedScore - a.suggestedScore)
      .slice(0, 20),
  };
}

async function main() {
  // If data2 index is absent (e.g. renamed to xx_data2/), skip gracefully.
  const data2Exists = await fs.access(DATA2_INDEX_PATH).then(() => true).catch(() => false);
  if (!data2Exists) {
    console.log(JSON.stringify({ message: 'data2 index not found — minority diff audit skipped.' }));
    return;
  }

  const [guideText, data2Raw, claims] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
    readClaimsJsonl(CLAIMS_JSONL_PATH),
  ]);

  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES');
  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!profilesSource || !cardsSource) {
    throw new Error('Failed to parse CARD_MINING_PROFILES or PATTERN_CARDS from guide.tsx');
  }

  const profiles = new Function(`return (${profilesSource});`)();
  const cards = new Function(`return (${cardsSource});`)();
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const cardIds = Object.keys(profiles);
  const data2 = JSON.parse(data2Raw);

  const coveredByCard = new Map(cardIds.map((id) => [id, new Set()]));

  const issueCountByText = new Map();
  const issueRows = [];
  for (const entry of data2?.entries || []) {
    const disability = String(entry?.disability || '').trim();
    for (const issueRow of entry?.issues || []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
      issueRows.push({
        issue,
        supports,
        disability,
      });
      issueCountByText.set(issue, (issueCountByText.get(issue) || 0) + 1);
    }
  }

  const rareIssueRows = [];
  const uncoveredRareIssueRows = [];
  issueRows.forEach((row, idx) => {
    const matchScores = [];
    for (const cardId of cardIds) {
      const profile = profiles[cardId];
      const issueScore = countKeywordMatches(row.issue, profile.issueKeywords || []);
      const supportScore = row.supports.reduce((sum, support) => {
        return sum + countKeywordMatches(String(support || ''), profile.supportKeywords || []);
      }, 0);
      const score = issueScore * 2 + supportScore * 3 + (issueScore > 0 && supportScore > 0 ? 2 : 0);
      if (score > 0) {
        matchScores.push({ cardId, score });
        coveredByCard.get(cardId).add(idx);
      }
    }

    const occurrenceCount = issueCountByText.get(row.issue) || 0;
    if (occurrenceCount > RARE_ISSUE_MAX_COUNT) return;

    if (matchScores.length === 0) {
      uncoveredRareIssueRows.push({
        issue: shortenText(row.issue),
        disability: row.disability,
        occurrenceCount,
      });
      return;
    }

    matchScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.cardId.localeCompare(b.cardId, 'ja');
    });
    rareIssueRows.push({
      issue: shortenText(row.issue),
      disability: row.disability,
      occurrenceCount,
      matchedCardCount: matchScores.length,
      primaryCardId: matchScores[0].cardId,
      primaryScore: matchScores[0].score,
    });
  });

  const rareIssueByPrimary = new Map();
  for (const row of rareIssueRows) {
    rareIssueByPrimary.set(row.primaryCardId, (rareIssueByPrimary.get(row.primaryCardId) || 0) + 1);
  }
  const rareIssuePrimaryTop = Array.from(rareIssueByPrimary.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([cardId, count]) => ({ cardId, count }));

  const fragileRareIssueRows = rareIssueRows.filter((row) => row.matchedCardCount === 1).slice(0, 20);

  const filteredClaims = claims.filter((claim) => String(claim?.risk?.level || '') !== 'high');
  const sourceBuckets = {
    raw_data: [],
    web_cache: [],
    mixed: [],
    other: [],
  };

  for (const claim of filteredClaims) {
    const statement = String(claim?.statement || '').trim();
    const canonical = String(claim?.canonicalStatement || '').trim();
    const keyText = canonical || statement;
    if (!keyText) continue;
    if (isNoisyClaimText(statement || keyText)) continue;

    const sourceGroup = detectClaimSourceGroup(claim);
    const row = {
      id: String(claim?.id || ''),
      statement: statement || keyText,
      keyText,
      signal: String(claim?.signal || ''),
      evidenceCount: Number(claim?.evidenceCount || 0),
      sourceGroup,
      sourceIds: Array.isArray(claim?.sourceIds) ? claim.sourceIds.map((x) => String(x || '')) : [],
    };
    sourceBuckets[sourceGroup].push(row);
  }

  const rawClaims = [...sourceBuckets.raw_data, ...sourceBuckets.mixed];
  const webClaims = [...sourceBuckets.web_cache, ...sourceBuckets.mixed];

  const claimMatchFn = (row) => {
    const claimText = `${row.statement} ${row.keyText}`;
    const scores = [];
    for (const cardId of cardIds) {
      const profile = profiles[cardId];
      const score = scoreClaimForCard(claimText, row.signal, profile);
      if (score > 0) scores.push({ cardId, score });
    }
    return scores;
  };

  const coverageContext = { profiles, cardIds };
  const rawCoverage = summarizeRareCoverage('raw_data', rawClaims, claimMatchFn, coverageContext);
  const webCoverage = summarizeRareCoverage('web_cache', webClaims, claimMatchFn, coverageContext);

  const highOverlapPairs = [];
  for (let i = 0; i < cardIds.length; i += 1) {
    for (let j = i + 1; j < cardIds.length; j += 1) {
      const leftId = cardIds[i];
      const rightId = cardIds[j];
      const leftCovered = coveredByCard.get(leftId);
      const rightCovered = coveredByCard.get(rightId);
      const overlap = jaccard(leftCovered, rightCovered);
      if (overlap.score < HIGH_OVERLAP_JACCARD) continue;

      const leftCard = cardById.get(leftId);
      const rightCard = cardById.get(rightId);
      if (!leftCard || !rightCard) continue;

      const boundaryDifferent =
        String(leftCard.selectionBoundary || '').trim() !== String(rightCard.selectionBoundary || '').trim();
      const preconditionDiff = uniqueCount(leftCard.preconditions || [], rightCard.preconditions || []);
      const failureDiff = uniqueCount(leftCard.failureRisks || [], rightCard.failureRisks || []);
      const followUpDiff = uniqueCount(leftCard.followUpQuestions || [], rightCard.followUpQuestions || []);
      const packageDiff = uniqueCount(
        (leftCard.packages || []).map((pkg) => pkg.id),
        (rightCard.packages || []).map((pkg) => pkg.id),
      );

      const differentiationScore =
        (boundaryDifferent ? 1 : 0) +
        preconditionDiff.totalUnique +
        failureDiff.totalUnique +
        followUpDiff.totalUnique +
        packageDiff.totalUnique;

      highOverlapPairs.push({
        left: leftId,
        right: rightId,
        overlapJaccard: Number(overlap.score.toFixed(3)),
        overlapIntersection: overlap.intersection,
        differentiationScore,
        boundaryDifferent,
        diffBreakdown: {
          preconditions: preconditionDiff.totalUnique,
          failureRisks: failureDiff.totalUnique,
          followUpQuestions: followUpDiff.totalUnique,
          packageIds: packageDiff.totalUnique,
        },
      });
    }
  }

  highOverlapPairs.sort((a, b) => {
    if (b.overlapJaccard !== a.overlapJaccard) return b.overlapJaccard - a.overlapJaccard;
    if (a.differentiationScore !== b.differentiationScore) return a.differentiationScore - b.differentiationScore;
    return b.overlapIntersection - a.overlapIntersection;
  });

  const lowDiffHighOverlapPairs = highOverlapPairs.filter(
    (row) => row.differentiationScore <= LOW_DIFF_SCORE_THRESHOLD,
  );

  const totalRareIssueRows = rareIssueRows.length + uncoveredRareIssueRows.length;
  const result = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      rareIssueMaxCount: RARE_ISSUE_MAX_COUNT,
      rareClaimTextMaxCount: RARE_CLAIM_TEXT_MAX_COUNT,
      rareClaimMaxEvidenceCount: RARE_CLAIM_MAX_EVIDENCE_COUNT,
      highOverlapJaccard: HIGH_OVERLAP_JACCARD,
      lowDiffScoreThreshold: LOW_DIFF_SCORE_THRESHOLD,
    },
    claimSourceSnapshot: {
      eligibleClaims: filteredClaims.length,
      rawDataClaims: sourceBuckets.raw_data.length,
      webCacheClaims: sourceBuckets.web_cache.length,
      mixedClaims: sourceBuckets.mixed.length,
      otherClaims: sourceBuckets.other.length,
    },
    rareIssueCoverage: {
      totalRareRows: totalRareIssueRows,
      coveredRareRows: rareIssueRows.length,
      uncoveredRareRows: uncoveredRareIssueRows.length,
      coverageRate: totalRareIssueRows === 0 ? 1 : Number((rareIssueRows.length / totalRareIssueRows).toFixed(4)),
      fragileRareRows: fragileRareIssueRows.length,
      fragileRareRowsTop: fragileRareIssueRows,
      uncoveredRareRowsTop: uncoveredRareIssueRows.slice(0, 40),
      rarePrimaryTop: rareIssuePrimaryTop,
    },
    rareNarrativeCoverage: {
      rawData: rawCoverage,
      webCache: webCoverage,
    },
    differentiationAudit: {
      highOverlapPairCount: highOverlapPairs.length,
      lowDiffHighOverlapPairCount: lowDiffHighOverlapPairs.length,
      lowDiffHighOverlapPairsTop: lowDiffHighOverlapPairs.slice(0, 20),
      highOverlapPairsTop: highOverlapPairs.slice(0, 20),
    },
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
