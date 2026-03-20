#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, 'docs', 'guidebook', 'manuscript-reader-edition.md');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'guidebook', 'frame-rewrite-dictionary-v1.md');

const LAYER_SECTIONS = [
  { key: 'health', label: '体調レイヤー（9フレーム）' },
  { key: 'transition', label: '就職移行レイヤー（7フレーム）' },
  { key: 'operation', label: '職場運用レイヤー（10フレーム）' },
];

function escapeTableCell(value) {
  return String(value || '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
    .trim();
}

function chooseNewName(oldName) {
  return oldName
    .replace('が主因: ', 'の設計課題: ')
    .replace('が主因：', 'の設計課題：')
    .replace('主因', '設計論点');
}

function chooseRewriteDirection(oldSummary) {
  if (!oldSummary) return '条件×業務×運用の相互作用で再記述（断定回避）';
  const hints = [];
  if (/通院|治療|服薬/.test(oldSummary)) hints.push('医療リズムと業務設計の同期化');
  if (/会議|連絡|資料|指示/.test(oldSummary)) hints.push('情報処理負荷の設計最適化');
  if (/疲労|回復|変動|悪化/.test(oldSummary)) hints.push('変動前提の負荷平準化');
  if (/採用|応募|面接|実習/.test(oldSummary)) hints.push('移行工程の分断防止');
  if (/安全|事故/.test(oldSummary)) hints.push('安全条件の先行定義');
  if (hints.length === 0) hints.push('共通設計レイヤーへ抽象化');
  return hints.join(' / ');
}

function extractLayerChunk(allText, startLabel, nextLabels) {
  const start = allText.indexOf(`## ${startLabel}`);
  if (start < 0) return '';
  let end = allText.length;
  for (const label of nextLabels) {
    const idx = allText.indexOf(`## ${label}`, start + 1);
    if (idx >= 0 && idx < end) end = idx;
  }
  return allText.slice(start, end);
}

function parseCardsFromChunk(layerKey, layerLabel, chunkText) {
  const cards = [];
  const chapterRegex = /## 第(\d+)章\s+([^\n]+)\n([\s\S]*?)(?=\n## 第\d+章\s+|\n## [^\n]*レイヤー|$)/g;
  let chapterMatch;
  while ((chapterMatch = chapterRegex.exec(chunkText)) !== null) {
    const chapterNo = Number(chapterMatch[1]);
    const title = chapterMatch[2].trim();
    const body = chapterMatch[3] || '';
    const idMatch = body.match(/- フレームID:\s*`([^`]+)`/);
    const summaryMatch = body.match(/- 何が起きるか:\s*([^\n]+)/);
    const pointMatch = body.match(/- 最初の方針:\s*([^\n]+)/);

    cards.push({
      chapterNo,
      layerKey,
      layerLabel,
      id: idMatch ? idMatch[1].trim() : '',
      oldName: title,
      oldSummary: summaryMatch ? summaryMatch[1].trim() : '',
      oldPoint: pointMatch ? pointMatch[1].trim() : '',
    });
  }
  return cards;
}

async function main() {
  const source = await fs.readFile(INPUT_PATH, 'utf8');
  const allCards = [];

  for (let i = 0; i < LAYER_SECTIONS.length; i += 1) {
    const current = LAYER_SECTIONS[i];
    const nextLabels = LAYER_SECTIONS.slice(i + 1).map((item) => item.label);
    const chunk = extractLayerChunk(source, current.label, nextLabels);
    allCards.push(...parseCardsFromChunk(current.key, current.label, chunk));
  }

  const lines = [];
  lines.push('# 26フレーム言い換え辞書 v1（就業共通設計）');
  lines.push('');
  lines.push('- 生成元: `docs/guidebook/manuscript-reader-edition.md`');
  lines.push('- 生成スクリプト: `scripts/jac/build-common-design-rewrite-dictionary.mjs`');
  lines.push('- 用途: 名称/要約/ポイントの全面改修時の単一ソース');
  lines.push('');
  lines.push('## 使い方');
  lines.push('- `新名称（案）` は初期案です。確定後にガイドと冊子へ一括反映します。');
  lines.push('- `要約リライト方針` と `ポイントリライト方針` は本文編集の指針です。');
  lines.push('- `個別最適化で残す条件` は削除禁止の確認欄です。');
  lines.push('');
  lines.push('| No | レイヤー | フレームID | 旧名称 | 新名称（案） | 要約リライト方針 | ポイントリライト方針 | 個別最適化で残す条件 |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');

  for (const card of allCards) {
    const newName = chooseNewName(card.oldName);
    const summaryDirection = chooseRewriteDirection(card.oldSummary);
    const pointDirection = card.oldPoint
      ? `初手を「運用設計の標準手順」に変換（例: ${card.oldPoint}）`
      : '初手を「運用設計の標準手順」に変換';
    lines.push(
      `| ${card.chapterNo} | ${escapeTableCell(card.layerLabel)} | ${escapeTableCell(card.id)} | ${escapeTableCell(card.oldName)} | ${escapeTableCell(newName)} | ${escapeTableCell(summaryDirection)} | ${escapeTableCell(pointDirection)} | person/job/environment/support/time/institution/evidence |`,
    );
  }

  lines.push('');
  lines.push('## レビュー観点（必須）');
  lines.push('- MECE: 隣接フレームと境界が曖昧になっていないか');
  lines.push('- 安全性: 診断決め打ち・過度一般化の表現が入っていないか');
  lines.push('- 実用性: 1週間以内に試せる運用ポイントへ落ちているか');
  lines.push('- 整合性: 既存根拠（data2/raw_data/web-cache/GLM）と矛盾していないか');

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        inputPath: INPUT_PATH,
        outputPath: OUTPUT_PATH,
        cardCount: allCards.length,
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
