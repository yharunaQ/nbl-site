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
const ROLE_SHEET_PATH = path.join(ROOT, 'docs', 'jac-regional-support-role-sheet-template.md');
const ROUTE_TEMPLATE_PATH = path.join(ROOT, 'docs', 'jac-support-connection-route-template.md');
const CONFERENCE_TEMPLATE_PATH = path.join(ROOT, 'docs', 'jac-case-conference-trigger-template.md');

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

function tableWithEmptyRows(headers, rowCount) {
  const lines = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
  for (let i = 0; i < rowCount; i += 1) {
    lines.push(`| ${headers.map(() => ' ').join(' | ')} |`);
  }
  return lines.join('\n');
}

function cardLabel(commonCopy, card) {
  return `${String(commonCopy?.title || card?.title || card?.id || '')} \`${String(card?.id || '')}\``;
}

function buildCardHintRows(cardMap, commonCopyMap, dispositionMap, filterFn) {
  const rows = [];
  for (const cardId of TARGET_CARD_IDS) {
    const card = cardMap.get(cardId);
    const commonCopy = commonCopyMap.get(cardId);
    const disposition = dispositionMap.get(cardId);
    if (!card || !commonCopy || !disposition) continue;
    if (!filterFn(disposition)) continue;
    const regionalDecision = normalizeDecision(disposition?.regionalSupport);
    rows.push({
      cardId,
      label: cardLabel(commonCopy, card),
      regionalDecision,
      keepInCard: unique(
        [
          ...(Array.isArray(disposition?.regionalSupport?.keepInCard) ? disposition.regionalSupport.keepInCard : []),
          ...(Array.isArray(disposition?.legalPolicy?.keepInCard) ? disposition.legalPolicy.keepInCard : []),
        ].filter(Boolean),
      ),
      followUps: unique(Array.isArray(card?.followUpQuestions) ? card.followUpQuestions : []).slice(0, 2),
      preconditions: unique(Array.isArray(card?.preconditions) ? card.preconditions : []).slice(0, 2),
      detailTarget: String(disposition?.regionalSupport?.detailTarget || disposition?.legalPolicy?.detailTarget || '').trim(),
      workflowTitles: unique(
        (CARD_WORKFLOW_MAP[cardId] || []).map((workflowId) => WORKFLOW_SPEC[workflowId]?.title).filter(Boolean),
      ),
    });
  }
  return rows;
}

function buildRoleSheetMarkdown(cardMap, commonCopyMap, dispositionMap) {
  const cardHints = buildCardHintRows(
    cardMap,
    commonCopyMap,
    dispositionMap,
    () => true,
  );
  const lines = [];
  lines.push('# JAC 地域支援 役割分担シート テンプレート');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: template');
  lines.push('');
  lines.push('## 使いどころ');
  lines.push('');
  lines.push('- 企業単独では重い配慮や支援案を出す前に、誰が何を持つかを先に固定したい時。');
  lines.push('- `p-support-service-navigation`、`p-worktrial-transition`、`p-manager-checkin`、`p-disclosure-boundary`、`p-mental-fluctuation-plan` のいずれかが関わる時。');
  lines.push('- person / job / environment / support / time / institution / evidence の確認が揃う前に、責任線だけでも崩さず進めたい時。');
  lines.push('');
  lines.push('## 最低限埋める項目');
  lines.push('');
  lines.push('- 法域');
  lines.push('- 本人同意の範囲');
  lines.push('- 企業内担当');
  lines.push('- 地域支援担当');
  lines.push('- 止まった時の戻し先');
  lines.push('- 次回見直し日');
  lines.push('');
  lines.push('## 基本情報');
  lines.push('');
  lines.push('- 相談ID:');
  lines.push('- 作成日:');
  lines.push('- 法域:');
  lines.push('- 対象カード:');
  lines.push('- 本人同意の範囲:');
  lines.push('- 次回見直し日:');
  lines.push('- 企業内の主担当:');
  lines.push('- 地域支援の主担当:');
  lines.push('');
  lines.push('## 役割分担表');
  lines.push('');
  lines.push(
    tableWithEmptyRows(['配慮内容', '企業内担当', '地域支援担当', '止まった時の戻し先'], 5),
  );
  lines.push('');
  lines.push('## 補助欄');
  lines.push('');
  lines.push('- 期限:');
  lines.push('- 確認指標:');
  lines.push('- 制度・法政策メモ:');
  lines.push('- 共有しない情報:');
  lines.push('- ケース会議が必要になる条件:');
  lines.push('');
  lines.push('## 記入ヒント');
  lines.push('');
  for (const row of cardHints) {
    lines.push(`### ${row.label}`);
    lines.push('');
    lines.push(`- カード内に残す最小要素: ${row.keepInCard.join(' / ') || '（該当なし）'}`);
    lines.push(`- 先に確認する質問: ${row.followUps.join(' / ') || '（該当なし）'}`);
    lines.push(`- 前提条件: ${row.preconditions.join(' / ') || '（該当なし）'}`);
    lines.push(`- 関連する共通運用: ${row.workflowTitles.join(' / ') || '（該当なし）'}`);
    if (row.detailTarget) lines.push(`- 詳細の置き場: ${row.detailTarget}`);
    lines.push('');
  }
  lines.push('## 完了判定');
  lines.push('');
  lines.push('- 「誰がやるか」が空欄のまま残っていない');
  lines.push('- 企業内担当と地域支援担当が重複していない');
  lines.push('- 戻し先が具体的な担当または会議単位で書かれている');
  lines.push('- 法域と本人同意の範囲が未確認のままになっていない');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function buildRouteTemplateMarkdown(cardMap, commonCopyMap, dispositionMap) {
  const routeHints = buildCardHintRows(
    cardMap,
    commonCopyMap,
    dispositionMap,
    (disposition) =>
      normalizeDecision(disposition?.regionalSupport) === 'move_to_separate_guide' ||
      String(disposition?.cardId || '') === 'p-support-service-navigation',
  );
  const lines = [];
  lines.push('# JAC 支援接続ルート図 テンプレート');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: template');
  lines.push('');
  lines.push('## 使いどころ');
  lines.push('');
  lines.push('- 制度、相談窓口、支援機関が分散していて、どこで止まっているか見えない時。');
  lines.push('- `p-support-service-navigation` をカード本文だけでは回しきれず、別ガイドで支援接続を整理する時。');
  lines.push('- ケース会議前に、次アクションと期限だけは1枚で共有したい時。');
  lines.push('');
  lines.push('## 基本情報');
  lines.push('');
  lines.push('- 相談ID:');
  lines.push('- 作成日:');
  lines.push('- 法域 / 自治体:');
  lines.push('- いま止まっていること:');
  lines.push('- 本人同意の範囲:');
  lines.push('- 次に最初に動く人:');
  lines.push('');
  lines.push('## ルート図本体');
  lines.push('');
  lines.push(
    tableWithEmptyRows(['今止まっている手続き', '次アクション', '期限', '責任者', '共有範囲', '止まった時の戻し先'], 6),
  );
  lines.push('');
  lines.push('## 補助欄');
  lines.push('');
  lines.push('- 制度要件の確認先:');
  lines.push('- 企業内で判断できる範囲:');
  lines.push('- 地域支援者に依頼する範囲:');
  lines.push('- 再評価が必要になる条件:');
  lines.push('');
  lines.push('## 記入ヒント');
  lines.push('');
  for (const row of routeHints) {
    lines.push(`### ${row.label}`);
    lines.push('');
    lines.push(`- 地域支援の扱い: ${REGIONAL_ROUTING_LABEL[row.regionalDecision] || '（該当なし）'}`);
    lines.push(`- カード内に残す最小要素: ${row.keepInCard.join(' / ') || '（該当なし）'}`);
    lines.push(`- 先に確認する質問: ${row.followUps.join(' / ') || '（該当なし）'}`);
    if (row.detailTarget) lines.push(`- 詳細の置き場: ${row.detailTarget}`);
    lines.push('');
  }
  lines.push('## 完了判定');
  lines.push('');
  lines.push('- すべての行に `次アクション / 期限 / 責任者` が入っている');
  lines.push('- 共有範囲が空欄のまま進む行がない');
  lines.push('- 止まった時の戻し先が人または会議名で書かれている');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function buildConferenceTemplateMarkdown(cardMap, commonCopyMap, dispositionMap) {
  const conferenceHints = buildCardHintRows(
    cardMap,
    commonCopyMap,
    dispositionMap,
    (disposition) => {
      const cardId = String(disposition?.cardId || '');
      return ['p-manager-checkin', 'p-disclosure-boundary', 'p-mental-fluctuation-plan'].includes(cardId);
    },
  );
  const lines = [];
  lines.push('# JAC ケース会議トリガー表 テンプレート');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: template');
  lines.push('');
  lines.push('## 使いどころ');
  lines.push('');
  lines.push('- 迷った時に誰を呼ぶか、いつ戻すかを事前に決めておきたい時。');
  lines.push('- `p-manager-checkin`、`p-disclosure-boundary`、`p-mental-fluctuation-plan` で、支援判断を企業だけに閉じたくない時。');
  lines.push('- 不調再発、共有範囲の迷い、連絡遅延、制度条件不明が起きた時の再評価条件を固定したい時。');
  lines.push('');
  lines.push('## 基本情報');
  lines.push('');
  lines.push('- 相談ID:');
  lines.push('- 作成日:');
  lines.push('- 法域:');
  lines.push('- 本人同意の範囲:');
  lines.push('- ケース会議の主催候補:');
  lines.push('- 緊急連絡先:');
  lines.push('');
  lines.push('## ケース会議トリガー表');
  lines.push('');
  lines.push(
    tableWithEmptyRows(['起点', '発動条件', '誰が判断するか', '誰を呼ぶか', '24-72時間でやること', '戻し先'], 4),
  );
  lines.push('');
  lines.push('起点の例: `症状 / 業務 / 連絡 / 制度`');
  lines.push('');
  lines.push('## 会議前の最低確認');
  lines.push('');
  lines.push('- 現時点で共有してよい情報は何か');
  lines.push('- いまの業務影響はどこに出ているか');
  lines.push('- 会議なしで戻せる論点か、専門見立てが必要な論点か');
  lines.push('- 会議後に誰が社内実装を引き取るか');
  lines.push('');
  lines.push('## 記入ヒント');
  lines.push('');
  for (const row of conferenceHints) {
    lines.push(`### ${row.label}`);
    lines.push('');
    lines.push(`- カード内に残す最小要素: ${row.keepInCard.join(' / ') || '（該当なし）'}`);
    lines.push(`- 先に確認する質問: ${row.followUps.join(' / ') || '（該当なし）'}`);
    lines.push(`- 前提条件: ${row.preconditions.join(' / ') || '（該当なし）'}`);
    lines.push(`- 関連する共通運用: ${row.workflowTitles.join(' / ') || '（該当なし）'}`);
    if (row.detailTarget) lines.push(`- 詳細の置き場: ${row.detailTarget}`);
    lines.push('');
  }
  lines.push('## 完了判定');
  lines.push('');
  lines.push('- 発動条件が抽象語だけで終わっていない');
  lines.push('- 誰が判断するかと戻し先が同じ人に集中しすぎていない');
  lines.push('- 24-72時間でやることが空欄になっていない');
  lines.push('');
  return `${lines.join('\n')}\n`;
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
  const cardMap = new Map(
    (Array.isArray(cards) ? cards : []).map((card) => [String(card?.id || ''), card]).filter((entry) => Boolean(entry[0])),
  );
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

  await Promise.all([
    fs.writeFile(ROLE_SHEET_PATH, buildRoleSheetMarkdown(cardMap, commonCopyMap, dispositionMap), 'utf8'),
    fs.writeFile(ROUTE_TEMPLATE_PATH, buildRouteTemplateMarkdown(cardMap, commonCopyMap, dispositionMap), 'utf8'),
    fs.writeFile(
      CONFERENCE_TEMPLATE_PATH,
      buildConferenceTemplateMarkdown(cardMap, commonCopyMap, dispositionMap),
      'utf8',
    ),
  ]);

  console.log(
    JSON.stringify(
      {
        ok: true,
        outputs: [ROLE_SHEET_PATH, ROUTE_TEMPLATE_PATH, CONFERENCE_TEMPLATE_PATH],
        targetCards: TARGET_CARD_IDS.length,
        workflows: WORKFLOW_ORDER.length,
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
