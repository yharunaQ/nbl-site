#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const GUIDE_PATH = path.join(process.cwd(), 'pages', 'jac', 'guide.tsx');
const GLM_RELATIONS_PATH = path.join(
  process.cwd(),
  'references',
  'GLM_resutls',
  'nanbyo-glm-significant-relations.json',
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

function getRelationRows(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.relations)) return parsed.relations;
  return [];
}

async function main() {
  const [guideText, glmRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(GLM_RELATIONS_PATH, 'utf8'),
  ]);

  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES');
  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!profilesSource || !cardsSource) {
    throw new Error('Failed to parse CARD_MINING_PROFILES or PATTERN_CARDS from guide.tsx');
  }

  const profiles = new Function(`return (${profilesSource});`)();
  const cards = new Function(`return (${cardsSource});`)();
  const glm = getRelationRows(JSON.parse(glmRaw));

  const rows = [];
  for (const card of cards) {
    const profile = profiles[card.id];
    if (!profile) continue;
    const keywordPool = [
      ...(profile.issueKeywords || []),
      ...(profile.supportKeywords || []),
      ...(profile.claimKeywords || []),
    ];

    let matchedGlmCount = 0;
    for (const relation of glm) {
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
      if (score > 0) matchedGlmCount += 1;
    }

    rows.push({
      cardId: card.id,
      title: card.title,
      matchedGlmCount,
    });
  }

  const sorted = [...rows].sort((a, b) => a.matchedGlmCount - b.matchedGlmCount);
  const zeroCards = sorted.filter((row) => row.matchedGlmCount === 0);
  const lowCards = sorted.filter((row) => row.matchedGlmCount < 20);

  const summary = {
    generatedAt: new Date().toISOString(),
    cardCount: rows.length,
    glmRelationCount: glm.length,
    zeroCoverageCardCount: zeroCards.length,
    lowCoverageCardCountUnder20: lowCards.length,
    min: sorted[0] || null,
    median: sorted[Math.floor(sorted.length / 2)] || null,
    max: sorted[sorted.length - 1] || null,
    zeroCoverageCards: zeroCards,
    lowCoverageCards: lowCards,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

