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

async function main() {
  const [guideText, data2Raw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
  ]);

  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES');
  if (!profilesSource) {
    throw new Error('Failed to parse CARD_MINING_PROFILES from guide.tsx');
  }
  const profiles = new Function(`return (${profilesSource});`)();
  const cardIds = Object.keys(profiles);

  const data2 = JSON.parse(data2Raw);
  const issueRows = [];
  for (const entry of data2?.entries || []) {
    for (const issueRow of entry?.issues || []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
      issueRows.push({ issue, supports });
    }
  }

  const matchedByCard = new Map(cardIds.map((id) => [id, new Set()]));
  const matchCounts = [];
  issueRows.forEach((row, idx) => {
    let matchedCount = 0;
    for (const cardId of cardIds) {
      const profile = profiles[cardId];
      const issueScore = countKeywordMatches(row.issue, profile.issueKeywords || []);
      const supportScore = row.supports.reduce((sum, support) => {
        return sum + countKeywordMatches(String(support || ''), profile.supportKeywords || []);
      }, 0);
      if (issueScore > 0 || supportScore > 0) {
        matchedCount += 1;
        matchedByCard.get(cardId).add(idx);
      }
    }
    matchCounts[idx] = matchedCount;
  });

  const totalIssueRows = issueRows.length;
  const uncovered = matchCounts.filter((count) => count === 0).length;
  const coverageRate = totalIssueRows === 0 ? 0 : Number(((totalIssueRows - uncovered) / totalIssueRows).toFixed(4));

  const singleAssigned = matchCounts.filter((count) => count === 1).length;
  const overlapAtLeast2 = matchCounts.filter((count) => count >= 2).length;
  const overlapAtLeast3 = matchCounts.filter((count) => count >= 3).length;
  const avgMatchedCardsPerIssue =
    totalIssueRows === 0
      ? 0
      : Number((matchCounts.reduce((sum, count) => sum + count, 0) / totalIssueRows).toFixed(3));

  const perCard = [];
  for (const cardId of cardIds) {
    const coveredSet = matchedByCard.get(cardId);
    let uniqueCount = 0;
    for (const idx of coveredSet) {
      if (matchCounts[idx] === 1) uniqueCount += 1;
    }
    perCard.push({
      cardId,
      coveredIssueRows: coveredSet.size,
      uniqueIssueRows: uniqueCount,
      uniqueRate: coveredSet.size === 0 ? 0 : Number((uniqueCount / coveredSet.size).toFixed(3)),
    });
  }
  perCard.sort((a, b) => {
    if (a.uniqueIssueRows !== b.uniqueIssueRows) return a.uniqueIssueRows - b.uniqueIssueRows;
    if (a.coveredIssueRows !== b.coveredIssueRows) return b.coveredIssueRows - a.coveredIssueRows;
    return a.cardId.localeCompare(b.cardId, 'ja');
  });

  const zeroUniqueCards = perCard.filter((row) => row.uniqueIssueRows === 0).map((row) => row.cardId);

  const pairwise = [];
  for (let i = 0; i < cardIds.length; i += 1) {
    for (let j = i + 1; j < cardIds.length; j += 1) {
      const left = matchedByCard.get(cardIds[i]);
      const right = matchedByCard.get(cardIds[j]);
      let intersection = 0;
      for (const idx of left) {
        if (right.has(idx)) intersection += 1;
      }
      if (intersection === 0) continue;
      const union = left.size + right.size - intersection;
      const jaccard = union === 0 ? 0 : intersection / union;
      pairwise.push({
        left: cardIds[i],
        right: cardIds[j],
        intersection,
        jaccard: Number(jaccard.toFixed(3)),
      });
    }
  }
  pairwise.sort((a, b) => {
    if (b.jaccard !== a.jaccard) return b.jaccard - a.jaccard;
    return b.intersection - a.intersection;
  });

  const result = {
    generatedAt: new Date().toISOString(),
    cardCount: cardIds.length,
    totalIssueRows,
    coverage: {
      uncovered,
      coverageRate,
    },
    exclusivity: {
      avgMatchedCardsPerIssue,
      singleAssigned,
      overlapAtLeast2,
      overlapAtLeast3,
    },
    minimality: {
      zeroUniqueCardCount: zeroUniqueCards.length,
      zeroUniqueCards,
    },
    lowUniqueCardsTop10: perCard.slice(0, 10),
    highOverlapPairsTop12: pairwise.slice(0, 12),
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

