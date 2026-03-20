#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ENFORCE = process.argv.includes('--enforce');
const MAX_UNGROUNDED_TERMS = Number(process.env.JAC_MAX_UNGROUNDED_TERMS || 0);

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

const SPECIFIC_TERMS = [
  '透析',
  '血液透析',
  '腹膜透析',
  '循環器',
  '呼吸器',
  '腎',
  '心臓',
  'ペースメーカー',
  '高次脳機能障害',
  '知的障害',
  '発達障害',
  '精神症状',
  '夜勤',
  'シフト',
  'フォークリフト',
  '危険作業',
  '緊急対応',
  '視覚',
  '聴覚',
];

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

function cleanSupportLabel(label) {
  return String(label || '')
    .replace(/\(要確認\)/g, '')
    .trim();
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

function extractExampleTerms(text) {
  const terms = new Set();
  const examples = [...String(text || '').matchAll(/（例:\s*([^）]+)）/g)];
  for (const match of examples) {
    const body = String(match?.[1] || '');
    body
      .split(/[、・,\/]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((term) => terms.add(term));
  }
  return Array.from(terms);
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
  const [guideText, data2Raw, claims, glmRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
    readClaimsJsonl(CLAIMS_JSONL_PATH),
    fs.readFile(GLM_RELATIONS_PATH, 'utf8'),
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
  const glmParsed = JSON.parse(glmRaw);
  const glmRelations = Array.isArray(glmParsed?.relations)
    ? glmParsed.relations
    : Array.isArray(glmParsed)
      ? glmParsed
      : [];

  const cardResults = [];
  let totalUngroundedTerms = 0;

  for (const card of cards) {
    const profile = profiles[card.id];
    if (!profile) continue;

    const wordingText = [card.title, card.situation, card.selectionBoundary || '']
      .filter(Boolean)
      .join('\n');
    const keywordPool = [
      ...(profile.issueKeywords || []),
      ...(profile.supportKeywords || []),
      ...(profile.claimKeywords || []),
    ];

    const matchedData2Texts = [];
    let matchedData2Rows = 0;
    for (const entry of data2Entries) {
      for (const issueRow of entry?.issues || []) {
        const issue = String(issueRow?.issue || '').trim();
        if (!issue) continue;
        const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
        const issueHits = countKeywordMatches(issue, profile.issueKeywords || []);
        const supportHits = supports.reduce((sum, support) => {
          return sum + countKeywordMatches(String(support || ''), profile.supportKeywords || []);
        }, 0);
        if (issueHits === 0 && supportHits === 0) continue;
        matchedData2Rows += 1;
        matchedData2Texts.push(issue);
        supports.forEach((support) => {
          const clean = cleanSupportLabel(support);
          if (clean) matchedData2Texts.push(clean);
        });
      }
    }

    const matchedClaimTexts = [];
    let matchedClaimCount = 0;
    for (const claim of claims) {
      if (String(claim?.risk?.level || '') === 'high') continue;
      const statement = String(claim?.statement || '').trim();
      const canonical = String(claim?.canonicalStatement || '');
      if (!statement) continue;
      const score = countKeywordMatches(`${statement} ${canonical}`, keywordPool);
      if (score <= 0) continue;
      matchedClaimCount += 1;
      matchedClaimTexts.push(statement);
    }

    const matchedGlmTexts = [];
    let matchedGlmCount = 0;
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
      if (score <= 0) continue;
      matchedGlmCount += 1;
      matchedGlmTexts.push(relationText);
    }

    const evidenceText = `${matchedData2Texts.join('\n')}\n${matchedClaimTexts
      .slice(0, 200)
      .join('\n')}\n${matchedGlmTexts.slice(0, 200).join('\n')}`;

    const exampleTerms = extractExampleTerms(wordingText);
    const specificTermsInWording = SPECIFIC_TERMS.filter((term) => wordingText.includes(term));
    const termsToCheck = Array.from(new Set([...exampleTerms, ...specificTermsInWording]));
    const ungroundedTerms = termsToCheck.filter((term) => !evidenceText.includes(term));

    totalUngroundedTerms += ungroundedTerms.length;
    cardResults.push({
      cardId: card.id,
      title: card.title,
      matchedData2Rows,
      matchedClaimCount,
      matchedGlmCount,
      checkedTerms: termsToCheck,
      ungroundedTerms,
      riskLevel: ungroundedTerms.length > 0 ? 'review_required' : 'ok',
    });
  }

  const reviewRequired = cardResults.filter((row) => row.ungroundedTerms.length > 0);
  const summary = {
    generatedAt: new Date().toISOString(),
    cardCount: cardResults.length,
    reviewRequiredCount: reviewRequired.length,
    totalUngroundedTerms,
    maxUngroundedTermsThreshold: MAX_UNGROUNDED_TERMS,
    reviewRequired,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (ENFORCE && totalUngroundedTerms > MAX_UNGROUNDED_TERMS) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

