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
const GLM_RELATIONS_PATH = path.join(
  process.cwd(),
  'references',
  'GLM_resutls',
  'nanbyo-glm-significant-relations.json',
);
const CARD_TIER_POLICY_PATH = path.join(
  process.cwd(),
  'references',
  'jac',
  'card-tier-policy.json',
);

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

function normalizeEvidenceLane(value) {
  const lane = String(value || '').trim();
  if (!lane) return 'unknown';
  return ['case_practice', 'mixed', 'legal_policy', 'employer_guidance', 'aggregated_general'].includes(lane)
    ? lane
    : 'unknown';
}

function getRelationRows(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.relations)) return parsed.relations;
  return [];
}

function uniqueNonEmpty(values) {
  return Array.from(new Set((values || []).map((v) => String(v || '').trim()).filter(Boolean)));
}

function isPracticalLane(lane) {
  return lane === 'case_practice' || lane === 'mixed' || lane === 'legal_policy' || lane === 'employer_guidance';
}

function evaluateTier({ expectedTier, glmHitCount, data2HitCount, claimEvidenceCount, evidenceLanes, countries, sourceRegions }) {
  const lanes = uniqueNonEmpty(evidenceLanes || []);
  const uniqueCountries = uniqueNonEmpty(countries || []);
  const uniqueRegions = uniqueNonEmpty(sourceRegions || []);

  let triangulationScore = 0;
  if (Number(data2HitCount || 0) > 0) triangulationScore += 1;
  if (Number(claimEvidenceCount || 0) > 0) triangulationScore += 1;
  if (lanes.some((lane) => isPracticalLane(lane))) triangulationScore += 1;
  if (uniqueCountries.length > 0 || uniqueRegions.length >= 2) triangulationScore += 1;

  if (expectedTier === 'A') {
    if (glmHitCount > 0) return { tier: 'A', expectedTierMet: true, triangulationScore };
    if (triangulationScore >= 3) return { tier: 'B', expectedTierMet: false, triangulationScore };
    return { tier: 'C', expectedTierMet: false, triangulationScore };
  }

  if (expectedTier === 'B') {
    const bQualified = triangulationScore >= 3 || (glmHitCount > 0 && triangulationScore >= 2);
    if (bQualified) return { tier: 'B', expectedTierMet: true, triangulationScore };
    return { tier: 'C', expectedTierMet: false, triangulationScore };
  }

  return { tier: 'C', expectedTierMet: expectedTier === 'C', triangulationScore };
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

async function main() {
  // If data2 index or GLM results are absent (e.g. renamed to xx_), skip gracefully.
  const data2Exists = await fs.access(DATA2_INDEX_PATH).then(() => true).catch(() => false);
  const glmExists = await fs.access(GLM_RELATIONS_PATH).then(() => true).catch(() => false);
  if (!data2Exists || !glmExists) {
    console.log(JSON.stringify({ message: 'data2 index or GLM results not found — tier alignment audit skipped.' }));
    return;
  }

  const [guideText, data2Raw, claims, glmRaw, policyRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
    readClaimsJsonl(CLAIMS_JSONL_PATH),
    fs.readFile(GLM_RELATIONS_PATH, 'utf8'),
    fs.readFile(CARD_TIER_POLICY_PATH, 'utf8'),
  ]);

  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES');
  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!profilesSource || !cardsSource) {
    throw new Error('Failed to parse CARD_MINING_PROFILES or PATTERN_CARDS from guide.tsx');
  }

  const profiles = new Function(`return (${profilesSource});`)();
  const cards = new Function(`return (${cardsSource});`)();
  const data2 = JSON.parse(data2Raw);
  const data2Entries = Array.isArray(data2?.entries) ? data2.entries : [];
  const glmRelations = getRelationRows(JSON.parse(glmRaw));
  const policy = JSON.parse(policyRaw);
  const defaultExpectedTier = String(policy?.defaultExpectedTier || 'B');
  const cardPolicy = policy?.cards || {};

  const rows = [];
  for (const card of cards) {
    const profile = profiles[card.id];
    if (!profile) continue;

    const pairCountMap = new Map();
    for (const entry of data2Entries) {
      for (const issueRow of entry?.issues || []) {
        const issue = String(issueRow?.issue || '').trim();
        if (!issue) continue;
        const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
        const issueMatches = countKeywordMatches(issue, profile.issueKeywords || []);
        for (const supportRaw of supports) {
          const support = String(supportRaw || '').replace(/\(要確認\)/g, '').trim();
          if (!support) continue;
          const supportMatches = countKeywordMatches(support, profile.supportKeywords || []);
          if (issueMatches === 0 && supportMatches === 0) continue;
          const key = `${issue}|||${support}`;
          pairCountMap.set(key, (pairCountMap.get(key) || 0) + 1);
        }
      }
    }
    const data2HitCount = Math.max(0, ...Array.from(pairCountMap.values()), 0);

    const keywordPool = [
      ...(profile.issueKeywords || []),
      ...(profile.supportKeywords || []),
      ...(profile.claimKeywords || []),
    ];
    let claimEvidenceCount = 0;
    const evidenceLanes = new Set();
    const countries = new Set();
    for (const claim of claims) {
      if (String(claim?.risk?.level || '') === 'high') continue;
      const statement = String(claim?.statement || '').trim();
      if (!statement) continue;
      const canonical = String(claim?.canonicalStatement || '');
      const score = countKeywordMatches(`${statement} ${canonical}`, keywordPool);
      if (score <= 0) continue;
      claimEvidenceCount += Number(claim?.evidenceCount || 1);
      evidenceLanes.add(normalizeEvidenceLane(claim?.interactionContextSummary?.evidenceLane));
      for (const country of claim?.interactionContextSummary?.countries || []) {
        if (country) countries.add(country);
      }
    }

    let glmHitCount = 0;
    for (const relation of glmRelations) {
      const relationText = [
        String(relation?.predictor || ''),
        String(relation?.outcome || ''),
        String(relation?.summary || ''),
        ...(Array.isArray(relation?.keywords) ? relation.keywords : []),
      ]
        .join(' ')
        .trim();
      if (!relationText) continue;
      const score = countKeywordMatches(relationText, keywordPool);
      if (score > 0) glmHitCount += 1;
    }

    const expectedTier = String(cardPolicy?.[card.id]?.expectedTier || defaultExpectedTier);
    const evalResult = evaluateTier({
      expectedTier,
      glmHitCount,
      data2HitCount,
      claimEvidenceCount,
      evidenceLanes: Array.from(evidenceLanes),
      countries: Array.from(countries),
      sourceRegions: card?.evidenceTrace?.sourceRegions || [],
    });

    rows.push({
      cardId: card.id,
      title: card.title,
      expectedTier,
      actualTier: evalResult.tier,
      expectedTierMet: evalResult.expectedTierMet,
      triangulationScore: evalResult.triangulationScore,
      glmHitCount,
      data2HitCount,
      claimEvidenceCount,
      policyRationale: String(cardPolicy?.[card.id]?.rationale || ''),
    });
  }

  const totalCards = rows.length;
  const alignedCards = rows.filter((row) => row.expectedTierMet).length;
  const alignmentRate = totalCards === 0 ? 0 : Number((alignedCards / totalCards).toFixed(3));
  const mismatches = rows.filter((row) => !row.expectedTierMet);

  const byExpectedTier = rows.reduce((acc, row) => {
    acc[row.expectedTier] = (acc[row.expectedTier] || 0) + 1;
    return acc;
  }, {});
  const byActualTier = rows.reduce((acc, row) => {
    acc[row.actualTier] = (acc[row.actualTier] || 0) + 1;
    return acc;
  }, {});

  const summary = {
    generatedAt: new Date().toISOString(),
    totalCards,
    alignedCards,
    alignmentRate,
    byExpectedTier,
    byActualTier,
    mismatchCount: mismatches.length,
    mismatches,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
