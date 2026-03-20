#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GUIDE_PATH = path.join(ROOT, 'pages', 'jac', 'guide.tsx');
const DATA2_INDEX_PATH = path.join(ROOT, 'references', 'data2', 'index', 'data2-knowledge-index.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'guidebook', 'jac-26-narrative-atlas-prefinal.md');

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

  for (let i = start; i < fileText.length; i += 1) {
    const ch = fileText[i];
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
        end = i;
        break;
      }
    }
  }

  if (end < 0) return null;
  return fileText.slice(start, end + 1);
}

function extractObjectSource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const equalIndex = fileText.indexOf('=', markerIndex);
  if (equalIndex < 0) return null;
  const start = fileText.indexOf('{', equalIndex);
  if (start < 0) return null;

  let depth = 0;
  let end = -1;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let i = start; i < fileText.length; i += 1) {
    const ch = fileText[i];
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
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end < 0) return null;
  return fileText.slice(start, end + 1);
}

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[「」『』（）()・、。.,:：!?！？\[\]【】]/g, '');
}

function includesAny(text, keywords) {
  const t = norm(text);
  return (keywords || []).some((kw) => {
    const k = norm(kw);
    return k.length > 0 && t.includes(k);
  });
}

function collectMatchedKeywords(texts, keywords) {
  const keywordSet = new Set((keywords || []).map((kw) => norm(kw)).filter(Boolean));
  const matched = new Set();
  for (const rawText of texts || []) {
    const text = norm(rawText);
    if (!text) continue;
    for (const kw of keywordSet) {
      if (text.includes(kw)) matched.add(kw);
    }
  }
  return matched;
}

function pickUnique(items, max) {
  const out = [];
  const seen = new Set();
  for (const item of items || []) {
    const key = String(item || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= max) break;
  }
  return out;
}

function cleanNarrativeText(input) {
  return String(input || '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/[�]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortenForVoice(input, max = 40) {
  const cleaned = cleanNarrativeText(input);
  if (!cleaned) return '';
  const sentence = cleaned.split(/[。!?！？]/)[0].trim();
  if (sentence.length <= max) return sentence;
  return `${sentence.slice(0, max)}…`;
}

function summarizeFragments(items, max = 5) {
  const rows = pickUnique(items.map((x) => shortenForVoice(x, 56)).filter(Boolean), max);
  return rows;
}

function buildSyntheticVoices(card, highlights, issues) {
  const issueSeed = issues[0] || '業務の進め方';
  const issueSeed2 = issues[1] || issueSeed;
  const voiceSeed = shortenForVoice(highlights[0], 36) || '日によって困りごとの出方が変わる';
  const voiceSeed2 = shortenForVoice(highlights[1], 36) || '配慮があれば続けられる手応えはある';
  const focus = (card.focus || []).join('・') || '業務';

  return [
    `- 本人（仮想）: 「${issueSeed}が重なる日は、いつもより失速しやすい。${voiceSeed}」`,
    `- 本人（仮想）: 「できないのではなく、${focus}の条件が合うと進む。${voiceSeed2}」`,
    '- 上司（仮想）: 「能力評価の前に、タスク密度と時間設計のズレを見直したい。」',
    '- 同僚（仮想）: 「手伝う/手伝わないではなく、引き継ぎと連絡の型があると助かる。」',
    `- 支援者（仮想）: 「${issueSeed2}を先に整えると、本人の実力が見えやすくなる。」`,
  ];
}

function bullets(items, fallback = '（該当なし）') {
  if (!Array.isArray(items) || items.length === 0) return `- ${fallback}`;
  return items.map((item) => `- ${String(item || '').trim()}`).join('\n');
}

function scoreEntryForCard(entry, profile) {
  const issueKeywords = profile?.issueKeywords || [];
  const supportKeywords = profile?.supportKeywords || [];
  const claimKeywords = profile?.claimKeywords || [];

  const issueTexts = (entry.issues || []).map((row) => row.issue || '').filter(Boolean);
  const supportTexts = (entry.issues || []).flatMap((row) => row.supports || []).filter(Boolean);
  const narrativeTexts = (entry.narrativeHighlights || []).filter(Boolean);

  const issueMatches = collectMatchedKeywords(issueTexts, issueKeywords);
  const supportMatches = collectMatchedKeywords(supportTexts, supportKeywords);
  const claimMatches = collectMatchedKeywords(narrativeTexts, claimKeywords);

  const signalCount = [issueMatches.size > 0, supportMatches.size > 0, claimMatches.size > 0].filter(Boolean)
    .length;

  const score = issueMatches.size * 3 + supportMatches.size * 2 + claimMatches.size;
  const strongMatch = score >= 6 || (score >= 4 && signalCount >= 2);

  const matchedIssueTexts = issueTexts.filter((txt) => includesAny(txt, issueKeywords));
  const matchedSupportTexts = supportTexts.filter((txt) => includesAny(txt, supportKeywords));
  const matchedNarrativeTexts = narrativeTexts.filter(
    (txt) =>
      includesAny(txt, issueKeywords) ||
      includesAny(txt, supportKeywords) ||
      includesAny(txt, claimKeywords),
  );

  return {
    entryId: entry.id,
    disability: entry.disability || '不明',
    score,
    signalCount,
    strongMatch,
    issueMatchCount: issueMatches.size,
    supportMatchCount: supportMatches.size,
    claimMatchCount: claimMatches.size,
    matchedIssueTexts,
    matchedSupportTexts,
    matchedNarrativeTexts,
  };
}

function chapter(card, profile, index, data2Entries, globalEntryScoreMap) {
  const chapterNo = String(index + 1).padStart(2, '0');
  const title = card.title || `カード${chapterNo}`;
  const [causePart = title, impactPart = '業務継続の見通しが下がる'] = title.split(':');

  const scoredRows = data2Entries.map((entry) => scoreEntryForCard(entry, profile || {}));
  const scoredStrong = scoredRows.filter((row) => row.strongMatch && row.score > 0);
  const scoredWeak = scoredRows.filter((row) => row.score > 0);
  const representativePool = (scoredStrong.length > 0 ? scoredStrong : scoredWeak).map((row) => {
    const globalScore = globalEntryScoreMap.get(row.entryId) || row.score || 1;
    const specificity = row.score / globalScore;
    const rank = row.score * (1 + specificity * 2);
    return { ...row, specificity, rank };
  });

  representativePool.sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    if (b.score !== a.score) return b.score - a.score;
    return String(a.disability).localeCompare(String(b.disability), 'ja');
  });

  const sampledIssues = pickUnique(
    representativePool.flatMap((row) => [...row.matchedIssueTexts, ...row.matchedSupportTexts]),
    4,
  );
  const sampledNarratives = pickUnique(
    representativePool.flatMap((row) => (row.matchedNarrativeTexts || []).map((x) => cleanNarrativeText(x))),
    8,
  );
  const summarizedNarratives = summarizeFragments(sampledNarratives, 5);
  const sampledDisabilities = pickUnique(
    representativePool.map((row) => row.disability),
    6,
  );

  const syntheticVoices = buildSyntheticVoices(card, sampledNarratives, sampledIssues);
  const quickActions = pickUnique(card.quickBundle || [], 4);
  const followUp = pickUnique(card.followUpQuestions || [], 5);
  const coveredLenses = ['difficulty_occurrence', 'difficulty_resolution', 'symptom_work_interaction', 'support_need_formation'];
  const conditions = [
    '診断名のみで結論を固定しない',
    '本人・業務・環境・時間の条件を併記する',
    '導入後にKPIで見直す',
  ];

  return [
    `## 第${chapterNo}章 ${title}`,
    '',
    `- フレームID: \`${card.id}\``,
    `- 強一致の data2 障害類型数: ${scoredStrong.length}`,
    `- 一致あり（参考）: ${scoredWeak.length}`,
    `- 代表類型（相対一致上位）: ${sampledDisabilities.join(' / ') || '該当なし'}`,
    '',
    '### 典型ナラティブ（26パターン版）',
    `- 観測: ${card.situation || '（要追記）'}`,
    `- 連鎖: ${String(causePart || '').trim()} が続くと、${String(impactPart || '').trim()}。`,
    `- 支援形成: ${(card.lensLogic && card.lensLogic.supportFormation) || '支援は個人属性ではなく、業務設計と環境条件で形成される。'}`,
    `- 介入の初手: ${quickActions.join(' / ') || '（要追記）'}`,
    '',
    '### 仮想の生の声（記述回答をもとにした合成）',
    '> 以下は個人特定情報を含まない合成例であり、実在の個人発言をそのまま再掲したものではありません。',
    ...syntheticVoices,
    '',
    '### data2由来の語り要素（匿名要約）',
    bullets(summarizedNarratives, '該当断片なし'),
    '',
    '### 追加確認質問（不足文脈を埋める）',
    bullets(followUp, '追加質問なし'),
    '',
    '### 使える範囲と注意',
    `- Covered lenses: ${coveredLenses.join(', ')}`,
    '- Missing context は person/job/environment/support/time/institution/evidence の順で補う。',
    '- 類型一致は「重み付きキーワード一致＋相対一致順位」で算出（診断名の断定推論ではない）。',
    `- 条件付きで有効: ${conditions.join(' / ')}`,
    '',
    '---',
    '',
  ].join('\n');
}

async function main() {
  const [guideText, data2Raw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
  ]);

  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES: Record<string, CardMiningProfile> =');
  if (!cardsSource || !profilesSource) {
    throw new Error('PATTERN_CARDS or CARD_MINING_PROFILES not found in guide.tsx');
  }

  const cards = new Function(`return (${cardsSource});`)();
  const profiles = new Function(`return (${profilesSource});`)();
  const data2 = JSON.parse(data2Raw);
  const entries = Array.isArray(data2?.entries) ? data2.entries : [];

  const globalEntryScoreMap = new Map();
  for (const entry of entries) {
    let total = 0;
    for (const card of cards) {
      total += scoreEntryForCard(entry, profiles[card.id] || {}).score;
    }
    globalEntryScoreMap.set(entry.id, total);
  }

  const generatedAt = new Date().toISOString();
  const body = cards
    .map((card, idx) => chapter(card, profiles[card.id], idx, entries, globalEntryScoreMap))
    .join('\n');

  const markdown = [
    '# JAC 26パターン 就労ナラティブ・アトラス（pre-完成版）',
    '',
    `- 生成日時: ${generatedAt}`,
    '- 目的: 従来の「障害者像」中心の説明を、業務設計と支援形成のナラティブへ置き換える。',
    '- 構成: 各パターンごとに「典型ナラティブ」「仮想の生の声」「追加確認質問」を整理。',
    '- データ根拠: `PATTERN_CARDS`（26） + `CARD_MINING_PROFILES` + data2 記述インデックス（52類型 / narrative 201件）',
    '',
    '## 読み方',
    '1. 当てはまりが強い章を1つ選び、典型ナラティブの連鎖を確認する。',
    '2. 仮想の生の声で、本人・職場・支援の視点のズレを点検する。',
    '3. 追加確認質問で不足文脈を埋め、対応を固定せず再評価する。',
    '',
    '## ナラティブ設計原則（置き換えの軸）',
    '- 診断名ではなく、仕事要求と環境条件の相互作用で語る。',
    '- 困難だけでなく、解決可能性と再設計余地を同時に示す。',
    '- 本人の強み・希望・回復条件を必ず同じ重みで扱う。',
    '- 支援は「特別対応」ではなく、運用設計として表現する。',
    '- 1回の配慮決定で終わらせず、KPIで見直す前提にする。',
    '',
    '## 全体サマリ',
    `- 26パターン合計: ${cards.length}`,
    `- data2類型: ${entries.length}`,
    `- data2 narrative highlights: ${entries.reduce((sum, e) => sum + (Array.isArray(e.narrativeHighlights) ? e.narrativeHighlights.length : 0), 0)}`,
    '',
    '---',
    '',
    body,
    '## 免責と運用',
    '- 本書は診断・法的助言ではなく、職場設計のための作業仮説集。',
    '- 実装時は法域・就業規則・産業保健/支援機関との整合を確認する。',
    '- 断定表現を避け、本人同意と再評価トリガーを必ず明記する。',
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${markdown}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        cardCount: cards.length,
        entryCount: entries.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
