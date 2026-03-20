#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GUIDE_PATH = path.join(ROOT, 'pages', 'jac', 'guide.tsx');
const COMMON_COPY_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'jac-layer-review-sheet.md');

const REVIEW_CARD_IDS = [
  'p-support-service-navigation',
  'p-worktrial-transition',
  'p-manager-checkin',
  'p-disclosure-boundary',
  'p-mental-fluctuation-plan',
];

const REVIEW_RATIONALE = {
  'p-support-service-navigation': '制度探索だけでなく、窓口順序・期限・役割分担までJAC側で見せる必要がある。',
  'p-worktrial-transition': '実習評価から採用後運用への橋渡しで、企業内担当と外部定着支援の接続が重要。',
  'p-manager-checkin': '社内面談運用と外部エスカレーションの境界を誤ると、企業負担が過大になりやすい。',
  'p-disclosure-boundary': '個人情報・健康情報の共有範囲は法域差が大きく、別レイヤー判断が必要。',
  'p-mental-fluctuation-plan': '悪化時運用を企業単独に閉じると再現性が落ち、外部支援の再評価導線が必要。',
};

function extractArraySource(text, marker) {
  const start = text.indexOf(marker);
  if (start < 0) return null;
  const equalIndex = text.indexOf('=', start);
  if (equalIndex < 0) return null;
  const bracketStart = text.indexOf('[', equalIndex);
  if (bracketStart < 0) return null;

  let depth = 0;
  let inString = false;
  let quote = '';
  for (let i = bracketStart; i < text.length; i += 1) {
    const ch = text[i];
    const prev = text[i - 1];
    if (inString) {
      if (ch === quote && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    if (ch === ']') depth -= 1;
    if (depth === 0) return text.slice(bracketStart, i + 1);
  }
  return null;
}

function unique(items) {
  return [...new Set((Array.isArray(items) ? items : []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function bullets(items, fallback = '（該当なし）') {
  const rows = unique(items);
  if (rows.length === 0) return `- ${fallback}`;
  return rows.map((item) => `- ${item}`).join('\n');
}

async function main() {
  const [guideText, commonCopyRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(COMMON_COPY_PATH, 'utf8'),
  ]);
  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!cardsSource) {
    throw new Error('PATTERN_CARDS not found in guide.tsx');
  }

  const cards = new Function(`return (${cardsSource});`)();
  const commonCopy = JSON.parse(commonCopyRaw);
  const commonCopyMap = new Map(
    (Array.isArray(commonCopy?.cards) ? commonCopy.cards : [])
      .map((row) => [String(row?.id || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const cardMap = new Map(
    (Array.isArray(cards) ? cards : []).map((card) => [String(card?.id || ''), card]).filter((entry) => Boolean(entry[0])),
  );

  const lines = [];
  lines.push('# JAC レイヤー重点レビューシート');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('## 位置づけ');
  lines.push('');
  lines.push('- このシートは、ガイド本体やガイドブック冊子へ全面反映する前に、');
  lines.push('  法政策ガードレール層と地域支援オーケストレーション層が構造として成立しているかを確認するための中間成果物。');
  lines.push('- 対象は、レイヤー圧が特に高い5カードのみ。');
  lines.push('');
  lines.push('## いま分かっていること');
  lines.push('');
  lines.push('- `observation`: 26フレーム本体は維持したまま、法政策差と地域支援体制を薄い補助レイヤーとして差し込める状態になった。');
  lines.push('- `inference`: まず5カードで構造破綻がないかを確認できれば、残り21カードは共通文型中心で展開しやすい。');
  lines.push('- `normative`: 法政策差はフレーム本体で吸収せず、別ガードレール層として扱う。地域支援はJACを支える共通実装レイヤーとして扱う。');
  lines.push('- `recommendation`: 冊子文面に入る前に、この5カードだけを `keep_in_card / move_to_shared_layer / move_to_separate_guide` で判定する。');
  lines.push('');
  lines.push('## 判定ルール');
  lines.push('');
  lines.push('- `keep_in_card`: このカードで読むと判断しやすく、他カードへ重複波及しない。');
  lines.push('- `move_to_shared_layer`: 全カード共通で持てば足り、カード個別に厚く書く必要がない。');
  lines.push('- `move_to_separate_guide`: 地域支援者向け運用ガイドに逃がした方が責務分担が明確。');
  lines.push('');
  lines.push('## レビュー対象');
  lines.push('');

  for (const cardId of REVIEW_CARD_IDS) {
    const card = cardMap.get(cardId);
    const rewrite = commonCopyMap.get(cardId);
    if (!card || !rewrite) continue;

    const title = String(rewrite?.title || card?.title || '');
    const situation = String(rewrite?.situation || card?.situation || '');
    const selectionBoundary = String(rewrite?.selectionBoundary || card?.selectionBoundary || '');
    const legal = rewrite?.legalPolicyGuardrail || {};
    const regional = rewrite?.regionalSupportOverlay || {};
    const followUpQuestions = unique(card?.followUpQuestions).slice(0, 3);

    lines.push(`## ${title} \`${cardId}\``);
    lines.push('');
    lines.push(`- 見る理由: ${REVIEW_RATIONALE[cardId] || 'レイヤー圧が高いカード。'}`);
    lines.push(`- カードの役割: ${situation || '（未設定）'}`);
    if (selectionBoundary) {
      lines.push(`- 境界: ${selectionBoundary}`);
    }
    lines.push('');
    lines.push('### 法政策ガードレール');
    lines.push('');
    lines.push(`- 要約: ${String(legal?.summary || '（未設定）')}`);
    lines.push('- 最低確認事項:');
    lines.push(bullets(legal?.checks));
    lines.push(`- 迷う時の戻し先: ${String(legal?.escalation || '（未設定）')}`);
    lines.push('');
    lines.push('### 地域支援オーケストレーション');
    lines.push('');
    lines.push(`- 要約: ${String(regional?.summary || '（未設定）')}`);
    lines.push('- JACが担う部分:');
    lines.push(bullets(regional?.jacRole));
    lines.push('- 地域支援者が担う部分:');
    lines.push(bullets(regional?.regionalRole));
    lines.push(`- 止まった時の戻し先: ${String(regional?.returnPath || '（未設定）')}`);
    lines.push('');
    lines.push('### 個別相談で残す確認');
    lines.push('');
    lines.push(bullets(followUpQuestions, '既存 follow-up question なし'));
    lines.push('');
    lines.push('### レビュー観点');
    lines.push('');
    lines.push('- 法政策差の話が、課題の型そのものに見えてしまっていないか。');
    lines.push('- 地域支援体制を添えることで、企業負担や実施難度の見え方が下がっているか。');
    lines.push('- JAC / 企業 / 地域支援者の役割が混ざっていないか。');
    lines.push('- 冊子本文へ入れるには重すぎる場合、共通レイヤーまたは別ガイドへ逃がすべき点はどこか。');
    lines.push('');
    lines.push('### 判定メモ');
    lines.push('');
    lines.push('- 判定: `keep_in_card / move_to_shared_layer / move_to_separate_guide`');
    lines.push('- コメント:');
    lines.push('');
  }

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        reviewCardCount: REVIEW_CARD_IDS.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
