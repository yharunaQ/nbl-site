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
const COMMON_COPY_PATH = path.join(
  process.cwd(),
  'references',
  'jac',
  'common-work-design-copy.json',
);
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'guidebook', 'manuscript.md');

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

function markdownList(items, fallback = '（該当なし）') {
  if (!Array.isArray(items) || items.length === 0) return `- ${fallback}`;
  return items.map((item) => `- ${String(item || '').trim()}`).join('\n');
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

function shorten(text, max = 68) {
  const cleaned = cleanNarrativeText(text);
  if (!cleaned) return '';
  const firstSentence = cleaned.split(/[。!?！？]/)[0].trim() || cleaned;
  if (firstSentence.length <= max) return firstSentence;
  return `${firstSentence.slice(0, max)}…`;
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

  const signalCount = [
    issueMatches.size > 0,
    supportMatches.size > 0,
    claimMatches.size > 0,
  ].filter(Boolean).length;
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
    entryId: Number(entry.id || 0),
    disability: String(entry.disability || '不明'),
    score,
    strongMatch,
    matchedIssueTexts,
    matchedSupportTexts,
    matchedNarrativeTexts,
  };
}

function pickRelatedCards(cards, current, max = 3) {
  const currentFocus = new Set(current.focus || []);
  return cards
    .filter((card) => card.id !== current.id)
    .map((card) => {
      const overlap = (card.focus || []).filter((focus) => currentFocus.has(focus)).length;
      return { card, overlap };
    })
    .filter((row) => row.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return String(a.card.title || '').localeCompare(String(b.card.title || ''), 'ja');
    })
    .slice(0, max)
    .map((row) => row.card);
}

function buildSyntheticVoices(card, issues, supports, narratives) {
  const issueSeed = issues[0] || '業務の進め方';
  const supportSeed = supports[0] || card.quickBundle?.[0] || '運用ルールの明確化';
  const narrativeSeed = narratives[0] || '条件が揃うと継続して働ける感覚はある';
  return [
    `- 本人（仮想）: 「${issueSeed}が重なる日に失速しやすい。${narrativeSeed}」`,
    `- 上司（仮想）: 「能力評価の前に、${supportSeed}を先に運用へ落とし込みたい。」`,
    '- 支援者（仮想）: 「本人・業務・環境の条件を分けて詰めると、再現性のある配慮になる。」',
  ];
}

function buildSituationLevelBullets(card) {
  const situationLevelOrder = {
    stable: 0,
    moderate: 1,
    high: 2,
    critical: 3,
  };
  const levels = Array.isArray(card?.situationLevels) ? card.situationLevels : [];
  return [...levels]
    .sort(
      (a, b) =>
        (situationLevelOrder[String(a?.tone || '')] ?? 99) -
        (situationLevelOrder[String(b?.tone || '')] ?? 99),
    )
    .map((level) => {
      const icon = String(level?.icon || '').trim();
      const label = String(level?.label || '').trim();
      const description = String(level?.description || '').trim();
      if (!icon || !label || !description) return '';
      return `- ${icon} ${label}: ${description}`;
    })
    .filter(Boolean);
}

function buildChapterMarkdown(cards, card, index, profile, data2Entries, globalEntryScoreMap) {
  const chapterNo = String(index + 1).padStart(2, '0');
  const [cause = card.title, impact = '就業継続の見通しが下がる'] = String(card.title || '').split(
    ':',
  );
  const packages = Array.isArray(card.packages) ? card.packages : [];
  const related = pickRelatedCards(cards, card);

  const scoredRows = data2Entries.map((entry) => scoreEntryForCard(entry, profile || {}));
  const matchedRows = scoredRows.filter((row) => row.score > 0);
  const strongRows = matchedRows.filter((row) => row.strongMatch);
  const representativePool = (strongRows.length > 0 ? strongRows : matchedRows).map((row) => {
    const globalScore = globalEntryScoreMap.get(row.entryId) || row.score || 1;
    const specificity = row.score / globalScore;
    return { ...row, rank: row.score * (1 + specificity * 2) };
  });

  representativePool.sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    if (b.score !== a.score) return b.score - a.score;
    return String(a.disability).localeCompare(String(b.disability), 'ja');
  });

  const sampledIssues = pickUnique(
    representativePool.flatMap((row) => row.matchedIssueTexts),
    4,
  );
  const sampledSupports = pickUnique(
    representativePool.flatMap((row) => row.matchedSupportTexts),
    4,
  );
  const sampledNarratives = pickUnique(
    representativePool.flatMap((row) => row.matchedNarrativeTexts.map((text) => shorten(text, 72))),
    5,
  );
  const sampledDisabilities = pickUnique(
    representativePool.map((row) => row.disability),
    6,
  );
  const syntheticVoices = buildSyntheticVoices(
    card,
    sampledIssues,
    sampledSupports,
    sampledNarratives,
  );
  const situationLevels = buildSituationLevelBullets(card);

  const packageBlocks =
    packages.length === 0
      ? '（該当なし）'
      : packages
          .map((pkg, i) =>
            [
              `#### パッケージ${i + 1}: ${pkg.name}`,
              `- 目的: ${pkg.goal}`,
              '- 実施項目:',
              markdownList(pkg.components),
              '- 運用ルール:',
              markdownList(pkg.operationRules),
              '- 観測KPI:',
              markdownList(pkg.kpi),
              `- 再評価トリガー: ${pkg.recheckTrigger}`,
            ].join('\n'),
          )
          .join('\n\n');

  return [
    `## 第${chapterNo}章 ${card.title}`,
    '',
    `- フレームID: \`${card.id}\``,
    `- 推奨モード: \`${card.mode}\``,
    `- data2一致件数: ${matchedRows.length}（強一致 ${strongRows.length}）`,
    `- 代表障害類型: ${sampledDisabilities.join(' / ') || '該当なし'}`,
    '',
    '### 1. 困りごとの連鎖（典型ナラティブ）',
    `- 観測: ${card.situation || '（要追記）'}`,
    `- 連鎖: ${String(cause).trim()} が続くと、${String(impact).trim()}。`,
    `- 選び分け軸: ${card.selectionBoundary || '（要追記）'}`,
    ...(situationLevels.length > 0
      ? [
          '- 状況レベル（🟢 → 💣）: 診断の重さではなく、仕事がどれだけ詰まり、運用でどこまで吸収できているかで見る。',
          ...situationLevels,
        ]
      : []),
    `- 最初の一手: ${(card.quickBundle || []).slice(0, 3).join(' / ') || '（要追記）'}`,
    '',
    '### 2. 現場ナラティブ（data2匿名要約）',
    markdownList(sampledNarratives, '該当断片なし'),
    '',
    '### 3. 仮想の生の声（記述回答をもとにした合成）',
    '> 以下は個人特定情報を含まない合成例であり、実在個人の発言をそのまま再掲したものではありません。',
    ...syntheticVoices,
    '',
    '### 4. 実装パッケージ',
    packageBlocks,
    '',
    '### 5. 前提条件チェック',
    markdownList(card.preconditions),
    '',
    '### 6. 失敗リスク（逆効果防止）',
    markdownList(card.failureRisks),
    '',
    '### 7. 追加確認質問',
    markdownList(card.followUpQuestions),
    '',
    '### 8. 根拠トレース（内部確認用）',
    `- GLM anchor IDs: ${(card.evidenceTrace?.glm || []).join(', ') || 'なし'}`,
    `- claim IDs: ${(card.evidenceTrace?.claimIds || []).join(', ') || 'なし'}`,
    `- source regions: ${(card.evidenceTrace?.sourceRegions || []).join(', ') || 'なし'}`,
    `- data2一致素材: issue ${sampledIssues.length}件 / support ${sampledSupports.length}件 / narrative ${sampledNarratives.length}件`,
    '',
    '### 9. 関連フレーム',
    related.length > 0
      ? related.map((row) => `- ${row.title} (\`${row.id}\`)`).join('\n')
      : '- （関連フレームなし）',
    '',
    '### 10. 編集メモ（レビュー用）',
    '- この章で不足している具体例:',
    '- 読者（本人 / 上司 / 人事 / 支援者）のうち重点:',
    '- 追記する図版・チェックリスト:',
    '',
    '---',
    '',
  ].join('\n');
}

async function main() {
  const [guideText, data2Raw, commonCopyRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
    fs.readFile(COMMON_COPY_PATH, 'utf8').catch(() => ''),
  ]);

  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  const situationLevelsSource = extractObjectSource(
    guideText,
    'const CARD_SITUATION_LEVELS: Record<string, SituationSeverityLevel[]> =',
  );
  const profilesSource = extractObjectSource(
    guideText,
    'const CARD_MINING_PROFILES: Record<string, CardMiningProfile> =',
  );
  if (!cardsSource || !profilesSource) {
    throw new Error('PATTERN_CARDS or CARD_MINING_PROFILES source not found in guide.tsx');
  }
  const rawCards = new Function(`return (${cardsSource});`)();
  const situationLevels = situationLevelsSource
    ? new Function(`return (${situationLevelsSource});`)()
    : {};
  const commonCopyPayload = commonCopyRaw ? JSON.parse(commonCopyRaw) : {};
  const commonCopyRows = Array.isArray(commonCopyPayload?.cards) ? commonCopyPayload.cards : [];
  const commonCopyMap = new Map(
    commonCopyRows.map((row) => [String(row?.id || ''), row]).filter((entry) => Boolean(entry[0])),
  );
  const cards = (Array.isArray(rawCards) ? rawCards : []).map((card) => {
    const rewrite = commonCopyMap.get(String(card?.id || ''));
    return {
      ...card,
      title: String(rewrite?.title || card?.title || ''),
      situation: String(rewrite?.situation || card?.situation || ''),
      selectionBoundary: String(rewrite?.selectionBoundary || card?.selectionBoundary || ''),
      situationLevels: Array.isArray(rewrite?.situationLevels)
        ? rewrite.situationLevels
        : Array.isArray(situationLevels?.[String(card?.id || '')])
          ? situationLevels[String(card?.id || '')]
          : [],
    };
  });
  const profiles = new Function(`return (${profilesSource});`)();
  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error('No cards parsed from PATTERN_CARDS');
  }

  const data2 = JSON.parse(data2Raw);
  const data2Entries = Array.isArray(data2?.entries) ? data2.entries : [];

  const globalEntryScoreMap = new Map();
  for (const entry of data2Entries) {
    let total = 0;
    for (const card of cards) {
      total += scoreEntryForCard(entry, profiles[card.id] || {}).score;
    }
    globalEntryScoreMap.set(Number(entry?.id || 0), total);
  }

  const now = new Date().toISOString();
  const header = [
    '# JAC 26フレーム 実装ガイドブック（改訂草稿）',
    '',
    `- 生成日時: ${now}`,
    '- 生成元: `pages/jac/guide.tsx` の `PATTERN_CARDS` + `CARD_MINING_PROFILES`',
    '- 追加根拠: `references/data2/index/data2-knowledge-index.json` の匿名ナラティブ断片',
    '- 使い方: このMarkdownを原本にし、必要に応じて .docx へ変換してレビュー',
    '',
    '## 目次',
    ...cards.map((card, idx) => {
      const no = String(idx + 1).padStart(2, '0');
      const anchor = `第${no}章-${String(card.title || '')
        .replace(/[：:]/g, '')
        .replace(/[^\wぁ-んァ-ヶ一-龠ー]/g, '')}`;
      return `- [第${no}章 ${card.title}](#${anchor})`;
    }),
    '',
    '## 編集方針（今回改訂）',
    '- 各章に「根拠トレース」「匿名ナラティブ」「仮想の生の声（合成）」を追加。',
    '- 類似フレームとの境界は選び分け軸として明記し、診断名の断定推論は行わない。',
    '- 不足文脈は person/job/environment/support/time/institution/evidence の順で補完する。',
    '',
    '---',
    '',
  ].join('\n');

  const chapters = cards
    .map((card, index) =>
      buildChapterMarkdown(
        cards,
        card,
        index,
        profiles[card.id],
        data2Entries,
        globalEntryScoreMap,
      ),
    )
    .join('\n');

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${header}${chapters}`, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        chapterCount: cards.length,
        data2Entries: data2Entries.length,
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
