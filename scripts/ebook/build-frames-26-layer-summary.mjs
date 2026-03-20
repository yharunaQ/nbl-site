#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const INPUT_PATH = path.join(process.cwd(), 'docs', 'guidebook', 'manuscript-reader-edition.md');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'guidebook', 'frames-26-layer-summary.md');

const LAYERS = [
  { key: 'health', label: '体調レイヤー（9フレーム）' },
  { key: 'transition', label: '就職移行レイヤー（7フレーム）' },
  { key: 'operation', label: '職場運用レイヤー（10フレーム）' },
];

function clean(text) {
  return String(text || '')
    .replace(/^[-*]\s*/, '')
    .replace(/^>\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickLayerSection(allText, startLabel, nextLabels) {
  const start = allText.indexOf(`## ${startLabel}`);
  if (start < 0) return '';
  let end = allText.length;
  for (const label of nextLabels) {
    const idx = allText.indexOf(`## ${label}`, start + 1);
    if (idx >= 0 && idx < end) end = idx;
  }
  return allText.slice(start, end);
}

function normalizeSummary(rawSummary) {
  let text = clean(rawSummary);
  text = text.replace(/^就業共通設計では、人を選別する前に仕事の側を先に設計し、/, '');
  text = text.replace(
    /この設計要素は、特性差・体調変動・ライフイベントの違いがある誰にでも起こりうる。?$/,
    '',
  );
  text = text.trim();
  if (text && !/[。.!！?？]$/.test(text)) text = `${text}。`;
  return text || '（要約抽出なし）';
}

function extractBulletLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .filter((line) => line.startsWith('- '))
    .map((line) => clean(line))
    .filter(Boolean);
}

function normalizePlanPoint(text) {
  return String(text || '')
    .replace(/^(実践|個別調整)\d+\s*:\s*/, '')
    .trim();
}

function extractChapterCards(layerText) {
  const cards = [];
  const chapterRegex = /## 第\d+章\s+([^\n]+)\n([\s\S]*?)(?=\n## 第\d+章\s+|\n## [^\n]*レイヤー|$)/g;
  let m;
  while ((m = chapterRegex.exec(layerText)) !== null) {
    const title = clean(m[1]);
    const body = String(m[2] || '');
    const summaryMatch =
      body.match(/- 章のひとこと:\s*([^\n]+)/) || body.match(/- 何が起きるか:\s*([^\n]+)/);
    const connectionMatch = body.match(/- 障害者雇用との接続（多様性の例）:\s*([^\n]+)/);
    const voiceMatch = body.match(/- 当事者（仮想）:\s*「([^」]+)」/);

    const commonSectionMatch = body.match(
      /#### 共通設計（標準運用）\n([\s\S]*?)(?=\n#### 個別調整（条件適合）|\n### 6\. |\n### 7\. |$)/,
    );
    const individualSectionMatch = body.match(
      /#### 個別調整（条件適合）\n([\s\S]*?)(?=\n### 6\. |\n### 7\. |\n### 8\. |$)/,
    );

    const commonPoints = extractBulletLines(commonSectionMatch?.[1] || '')
      .map((line) => normalizePlanPoint(line))
      .slice(0, 3);
    const individualizedPoints = extractBulletLines(individualSectionMatch?.[1] || '')
      .map((line) => normalizePlanPoint(line))
      .slice(0, 2);

    cards.push({
      title,
      summary: normalizeSummary(summaryMatch?.[1] || ''),
      connection: clean(connectionMatch?.[1] || '（記載なし）'),
      voice: clean(voiceMatch?.[1] || '（生の声抽出なし）'),
      commonPoints,
      individualizedPoints,
    });
  }
  return cards;
}

async function main() {
  const source = await fs.readFile(INPUT_PATH, 'utf8');
  const output = [];
  output.push('# 3レイヤー・26フレーム一覧（要約 + 生の声 + ポイント！）');
  output.push('');
  output.push(`- 生成日時: ${new Date().toISOString()}`);
  output.push('- 出典: `docs/guidebook/manuscript-reader-edition.md`');
  output.push('- 形式: 要約は冗長句を除去し、ポイントは「共通設計 / 個別調整」に分離');
  output.push('');

  for (let i = 0; i < LAYERS.length; i += 1) {
    const current = LAYERS[i];
    const nextLabels = LAYERS.slice(i + 1).map((layer) => layer.label);
    const layerText = pickLayerSection(source, current.label, nextLabels);
    const cards = extractChapterCards(layerText);
    output.push(`## ${current.label}`);
    output.push('');
    cards.forEach((card, index) => {
      output.push(`### ${index + 1}. ${card.title}`);
      output.push(`- 要約: ${card.summary}`);
      output.push(`- 障害者雇用との接続（多様性の例）: ${card.connection}`);
      output.push(
        `- ポイント！（共通設計）: ${
          card.commonPoints.length > 0 ? card.commonPoints.join(' / ') : '（要追記）'
        }`,
      );
      output.push(
        `- ポイント！（個別調整）: ${
          card.individualizedPoints.length > 0 ? card.individualizedPoints.join(' / ') : '（要追記）'
        }`,
      );
      output.push(`- 生の声（仮想）: ${card.voice}`);
      output.push('');
    });
  }

  await fs.writeFile(OUTPUT_PATH, `${output.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        inputPath: INPUT_PATH,
        outputPath: OUTPUT_PATH,
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
