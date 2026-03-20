#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const GUIDE_PATH = path.join(process.cwd(), 'pages', 'jac', 'guide.tsx');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'guidebook', 'book1-health-layer-prefinal.md');

const SHORT_TITLES = {
  '01': '会議疲れを減らす会議設計',
  '02': '体調の波を前提にした業務配分',
  '03': '通院と勤務を両立する時間設計',
  '04': '音・光・温度ストレスを下げる職場調整',
  '05': '通勤消耗を減らす働き方設計',
  '06': '配慮に必要な情報だけ共有する',
  '07': '復職初期を守る段階復帰',
  '08': '睡眠・服薬リズムを守るシフト設計',
  '09': '配慮を続ける相談運用の定着',
};

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

function toBullets(items, empty = '（要追記）') {
  if (!Array.isArray(items) || items.length === 0) return `- ${empty}`;
  return items.map((item) => `- ${String(item || '').trim()}`).join('\n');
}

function toSteps(items, empty = '（要追記）') {
  if (!Array.isArray(items) || items.length === 0) return `1. ${empty}`;
  return items.map((item, idx) => `${idx + 1}. ${String(item || '').trim()}`).join('\n');
}

function pickRelatedCards(cards, current, max = 3) {
  const currentFocus = new Set(current.focus || []);
  return cards
    .filter((card) => card.id !== current.id)
    .map((card) => ({
      card,
      overlap: (card.focus || []).filter((focus) => currentFocus.has(focus)).length,
    }))
    .filter((row) => row.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return String(a.card.title || '').localeCompare(String(b.card.title || ''), 'ja');
    })
    .slice(0, max)
    .map((row) => row.card);
}

function chapterMarkdown(cards, card, index) {
  const chapterNo = String(index + 1).padStart(2, '0');
  const conciseTitle = SHORT_TITLES[chapterNo] || card.title;
  const [cause = card.title, impact = ''] = String(card.title || '').split(':');
  const related = pickRelatedCards(cards, card);
  const packages = Array.isArray(card.packages) ? card.packages : [];

  const packageBlocks =
    packages.length === 0
      ? '（要追記）'
      : packages
          .map((pkg, i) =>
            [
              `#### パッケージ${i + 1}: ${pkg.name}`,
              `- 狙い: ${pkg.goal}`,
              '- 実装項目:',
              toBullets(pkg.components),
              '- 運用ルール:',
              toBullets(pkg.operationRules),
              '- 観測指標:',
              toBullets(pkg.kpi),
              `- 見直し条件: ${pkg.recheckTrigger}`,
            ].join('\n'),
          )
          .join('\n\n');

  return [
    `## 第${chapterNo}章 ${conciseTitle}`,
    '',
    `> 元フレーム名: ${card.title}`,
    '',
    `![第${chapterNo}章イラスト](assets/book1/ch${chapterNo}.svg)`,
    '',
    `- フレームID: \`${card.id}\``,
    `- 推奨モード: \`${card.mode}\``,
    '',
    '### この章が扱う課題',
    card.situation || '（要追記）',
    '',
    '### 因果の見取り図',
    `- 起点: ${cause.trim()}`,
    `- 連鎖: ${impact.trim() || '業務継続に負荷が連鎖する'}`,
    '',
    '### この章を選ぶ目安（他章との境界）',
    card.selectionBoundary || '（要追記）',
    '',
    '### 最初の7日アクション',
    toSteps(card.quickBundle),
    '',
    '### 1か月の定着運用',
    packageBlocks,
    '',
    '### 実装前チェック',
    toBullets(card.preconditions),
    '',
    '### つまずきやすいポイント',
    toBullets(card.failureRisks),
    '',
    '### 相談時に追加確認すること',
    toBullets(card.followUpQuestions),
    '- person: 本人の強み・疲労サイン・回復条件は何か。',
    '- job: 必須業務と代替可能業務の境界はどこか。',
    '- environment: どの環境要因がトリガーか。',
    '- support: 誰が調整責任を持つか。外部連携は必要か。',
    '- time: 週内・月内で悪化/回復のパターンはあるか。',
    '- institution: 法域・制度・就業規則の制約は何か。',
    '- evidence: 改善判定をどの指標で行うか。',
    '',
    '### 関連章',
    related.length > 0
      ? related.map((row) => `- ${row.title}（\`${row.id}\`）`).join('\n')
      : '- （関連章なし）',
    '',
    '### 根拠トレース（監修用）',
    `- GLM: ${(card.evidenceTrace?.glm || []).join(', ') || 'なし'}`,
    `- claim IDs: ${(card.evidenceTrace?.claimIds || []).join(', ') || 'なし'}`,
    `- source regions: ${(card.evidenceTrace?.sourceRegions || []).join(', ') || 'なし'}`,
    '',
    '---',
    '',
  ].join('\n');
}

async function main() {
  const guideText = await fs.readFile(GUIDE_PATH, 'utf8');
  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!cardsSource) throw new Error('PATTERN_CARDS source not found');

  const cards = new Function(`return (${cardsSource});`)();
  if (!Array.isArray(cards) || cards.length < 9) {
    throw new Error('PATTERN_CARDS parse failed');
  }

  const targetCards = cards.slice(0, 9);
  const generatedAt = new Date().toISOString();
  const markdown = [
    '# JACガイドブック 第1冊（体調レイヤー）pre-完成版',
    '',
    `- 生成日時: ${generatedAt}`,
    '- 対象: 体調レイヤー9フレーム（第01章〜第09章）',
    '- 位置づけ: 公開前の確認版（本文は読みやすさ優先、根拠IDは章末に保持）',
    '',
    '## この冊子の使い方',
    '1. まず、自分の課題に近い章を1章だけ選ぶ。',
    '2. 「最初の7日アクション」だけ先に実行する。',
    '3. 4週間運用して、章内の観測指標で再評価する。',
    '4. 境界が曖昧なときは「この章を選ぶ目安」を優先して章を切り替える。',
    '',
    '## 章一覧',
    ...targetCards.map((card, i) => {
      const chapterNo = String(i + 1).padStart(2, '0');
      return `${i + 1}. 第${chapterNo}章 ${SHORT_TITLES[chapterNo] || card.title}`;
    }),
    '',
    '---',
    '',
    ...targetCards.map((card, i) => chapterMarkdown(cards, card, i)),
    '## 巻末メモ（編集チェック用）',
    '- 章タイトルが相談者に一読で伝わるか。',
    '- 章ごとの境界がMECEに近づいているか。',
    '- 各章の7日アクションが実行単位になっているか。',
    '- 指標が現場運用で記録可能か。',
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, markdown, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        chapterCount: targetCards.length,
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

