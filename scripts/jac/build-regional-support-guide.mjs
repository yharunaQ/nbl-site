#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  CARD_WORKFLOW_MAP,
  REGIONAL_ROUTING_LABEL,
  TARGET_CARD_IDS,
  WORKFLOW_ORDER,
  WORKFLOW_SPEC,
} from './regional-support-orchestration-spec.mjs';

const ROOT = process.cwd();
const GUIDE_PATH = path.join(ROOT, 'pages', 'jac', 'guide.tsx');
const COMMON_COPY_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const DISPOSITION_PATH = path.join(ROOT, 'references', 'jac', 'layer-disposition.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'jac-regional-support-orchestration-guide.md');

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

function normalizeDecision(detail) {
  const value = String(detail?.disposition || '').trim();
  if (value === 'move_to_shared_layer' || value === 'move_to_separate_guide' || value === 'keep_in_card') {
    return value;
  }
  return 'keep_in_card';
}

function buildCardRoutingRow(card, commonCopy, dispositionRow) {
  const regionalDecision = normalizeDecision(dispositionRow?.regionalSupport);
  const keepInCard = unique(dispositionRow?.regionalSupport?.keepInCard);
  const detailTarget = String(dispositionRow?.regionalSupport?.detailTarget || 'JACカード本文').trim();
  return `| ${String(commonCopy?.title || card?.title || card?.id || '')} \`${card?.id}\` | ${REGIONAL_ROUTING_LABEL[regionalDecision]} | ${keepInCard.join(' / ') || '（該当なし）'} | ${detailTarget} |`;
}

async function main() {
  const [guideText, commonCopyRaw, dispositionRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(COMMON_COPY_PATH, 'utf8'),
    fs.readFile(DISPOSITION_PATH, 'utf8'),
  ]);

  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!cardsSource) {
    throw new Error('PATTERN_CARDS not found in guide.tsx');
  }

  const cards = new Function(`return (${cardsSource});`)();
  const commonCopyPayload = JSON.parse(commonCopyRaw);
  const commonCopyMap = new Map(
    (Array.isArray(commonCopyPayload?.cards) ? commonCopyPayload.cards : [])
      .map((row) => [String(row?.id || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const dispositionPayload = JSON.parse(dispositionRaw);
  const dispositionMap = new Map(
    (Array.isArray(dispositionPayload?.cards) ? dispositionPayload.cards : [])
      .map((row) => [String(row?.cardId || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const cardMap = new Map(
    (Array.isArray(cards) ? cards : []).map((card) => [String(card?.id || ''), card]).filter((entry) => Boolean(entry[0])),
  );

  const lines = [];
  lines.push('# JAC 地域支援オーケストレーション別ガイド（最小骨格）');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: draft');
  lines.push('');
  lines.push('## Holistic Positioning');
  lines.push(`- Scope of source: JAC 26フレームのうち、地域支援レイヤー圧が高い5カードを対象に、カード外へ逃がす実装運用を再整理した最小骨格。`);
  lines.push('- Covered lenses: difficulty_resolution / support_need_formation / symptom_work_interaction (partial)');
  lines.push('- Missing lenses: difficulty_occurrence の個別 task 条件、自治体ごとの支援資源差、法政策上の義務判断');
  lines.push('');
  lines.push('## What is currently usable');
  lines.push('- Usable now (with conditions): JAC提案と同時に、地域支援体制、役割分担、戻し先をセットで示す共通運用。');
  lines.push('- Not yet usable: 地域機関名のディレクトリ、自治体別制度要件、法的助言そのもの。');
  lines.push('');
  lines.push('## Bias/Discrimination Risk');
  lines.push('- Risk level: medium');
  lines.push('- Risk factors: 地域資源の有無や企業側の実装余力を省略すると、「支援体制があれば実施できる」と過大評価しやすい。');
  lines.push('');
  lines.push('## Additional information required');
  lines.push('- Must-have questions: 既存支援者は誰か / 情報共有同意の範囲はどこか / 企業内担当者は誰か / 地域で使える資源は何か / 法域はどこか');
  lines.push('- Nice-to-have questions: これまで試した支援の履歴 / 定着支援の頻度 / 再評価の閾値 / 通院や生活変動との関係');
  lines.push('');
  lines.push('## Provisional next action');
  lines.push('- Minimal safe action now: 企業へ重い配慮案を出す前に、役割分担と戻し先を1枚で固定する。');
  lines.push('- Re-evaluation trigger: 役割未確定、同意未確定、期限未設定、地域資源未確認のまま進みそうな時。');
  lines.push('');
  lines.push('## 1. JACカードとの接続マップ');
  lines.push('');
  lines.push('| JACカード | 地域支援の扱い | カード内に残す最小要素 | 詳細先 |');
  lines.push('| --- | --- | --- | --- |');

  for (const cardId of TARGET_CARD_IDS) {
    const card = cardMap.get(cardId);
    const commonCopy = commonCopyMap.get(cardId);
    const dispositionRow = dispositionMap.get(cardId);
    if (!card || !commonCopy || !dispositionRow) continue;
    lines.push(buildCardRoutingRow(card, commonCopy, dispositionRow));
  }

  lines.push('');
  lines.push('## 2. 共通運用レイヤー');
  lines.push('');

  for (const workflowId of WORKFLOW_ORDER) {
    const workflow = WORKFLOW_SPEC[workflowId];
    lines.push(`### ${workflow.title}`);
    lines.push('');
    lines.push(`- 目的: ${workflow.purpose}`);
    lines.push('- JACが担うこと:');
    lines.push(bullets(workflow.jacRole));
    lines.push('- 地域支援者が担うこと:');
    lines.push(bullets(workflow.regionalRole));
    lines.push('- 企業内で担うこと:');
    lines.push(bullets(workflow.employerRole));
    lines.push(`- 最小成果物: ${workflow.artifact}`);
    lines.push(`- 戻して見直す条件: ${workflow.recheckTrigger}`);
    lines.push('');
  }

  lines.push('## 3. カード別接続メモ');
  lines.push('');

  for (const cardId of TARGET_CARD_IDS) {
    const card = cardMap.get(cardId);
    const commonCopy = commonCopyMap.get(cardId);
    const dispositionRow = dispositionMap.get(cardId);
    if (!card || !commonCopy || !dispositionRow) continue;
    const regionalDecision = normalizeDecision(dispositionRow?.regionalSupport);
    const overlay = commonCopy?.regionalSupportOverlay || {};
    const workflowIds = CARD_WORKFLOW_MAP[cardId] || [];
    const workflowTitles = workflowIds
      .map((workflowId) => WORKFLOW_SPEC[workflowId]?.title)
      .filter(Boolean);

    lines.push(`### ${String(commonCopy?.title || card?.title || cardId)} \`${cardId}\``);
    lines.push('');
    lines.push(`- 地域支援の扱い: ${REGIONAL_ROUTING_LABEL[regionalDecision]}`);
    lines.push(`- カードの役割: ${String(commonCopy?.situation || card?.situation || '').trim() || '（未設定）'}`);
    lines.push(`- このガイドで重点的に見る範囲: ${String(dispositionRow?.regionalSupport?.detailTarget || 'JACカード本文').trim()}`);
    lines.push('- カード内に残す最小要素:');
    lines.push(bullets(dispositionRow?.regionalSupport?.keepInCard));
    lines.push('- 関連する共通運用:');
    lines.push(bullets(workflowTitles));
    lines.push(`- 地域支援レイヤーの要約: ${String(overlay?.summary || '（未設定）')}`);
    lines.push('- JACが担う部分:');
    lines.push(bullets(overlay?.jacRole));
    lines.push('- 地域支援者が担う部分:');
    lines.push(bullets(overlay?.regionalRole));
    lines.push(`- 止まった時の戻し先: ${String(overlay?.returnPath || '（未設定）')}`);
    lines.push('- 個別相談で必ず確認する質問:');
    lines.push(bullets(Array.isArray(card?.followUpQuestions) ? card.followUpQuestions.slice(0, 3) : []));
    lines.push('- 前提条件:');
    lines.push(bullets(Array.isArray(card?.preconditions) ? card.preconditions.slice(0, 3) : []));
    lines.push('');
  }

  lines.push('## 4. 先に作るべき実務テンプレート');
  lines.push('');
  lines.push('- [役割分担シートテンプレート](./jac-regional-support-role-sheet-template.md): `配慮内容 / 企業内担当 / 地域支援担当 / 止まった時の戻し先` を固定する。');
  lines.push('- [ケース会議トリガー表テンプレート](./jac-case-conference-trigger-template.md): `症状・業務・連絡・制度` の4起点で再評価を発動する条件を固定する。');
  lines.push('- [支援接続ルート図テンプレート](./jac-support-connection-route-template.md): `今止まっている手続き / 次アクション / 期限 / 責任者` を1枚で見る。');
  lines.push('- [テンプレート記入例](./jac-regional-support-template-examples.md): `p-support-service-navigation` と `p-mental-fluctuation-plan` の仮想記入例。');
  lines.push('');
  lines.push('## 5. ここで扱わないこと');
  lines.push('');
  lines.push('- 法的義務判断そのもの');
  lines.push('- 自治体・機関名つきの地域資源ディレクトリ');
  lines.push('- 医療的判断や診断確定');
  lines.push('');

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        cardCount: TARGET_CARD_IDS.length,
        workflowCount: WORKFLOW_ORDER.length,
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
