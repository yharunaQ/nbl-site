#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DISPOSITION_PATH = path.join(ROOT, 'references', 'jac', 'layer-disposition.json');
const COPY_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'jac-layer-disposition-matrix.md');

function unique(items) {
  return [...new Set((Array.isArray(items) ? items : []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function bullets(items, fallback = '（該当なし）') {
  const rows = unique(items);
  if (rows.length === 0) return `- ${fallback}`;
  return rows.map((item) => `- ${item}`).join('\n');
}

async function main() {
  const [rawDisposition, rawCopy] = await Promise.all([
    fs.readFile(DISPOSITION_PATH, 'utf8'),
    fs.readFile(COPY_PATH, 'utf8'),
  ]);

  const disposition = JSON.parse(rawDisposition);
  const copy = JSON.parse(rawCopy);
  const labelMap = disposition?.dispositionLabels || {};
  const copyMap = new Map(
    (Array.isArray(copy?.cards) ? copy.cards : [])
      .map((row) => [String(row?.id || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );

  const lines = [];
  lines.push('# JAC レイヤー重点判定マトリクス');
  lines.push('');
  lines.push(`更新日: ${String(disposition?.updatedAt || '').trim() || new Date().toISOString().slice(0, 10)}`);
  lines.push(`状態: ${String(disposition?.status || 'proposed')}`);
  lines.push('');
  lines.push('## 位置づけ');
  lines.push('');
  lines.push('- `docs/jac-layer-review-sheet.md` のレビュー観点を、実装に使える暫定判定へ変換したもの。');
  lines.push('- ガイド本文やガイドブック冊子へ反映する前に、どのレイヤーをカード内に残すかを固定する。');
  lines.push('');
  lines.push('## 全体原則');
  lines.push('');
  lines.push(`- 法政策: ${String(disposition?.principle?.legalPolicyGuardrail || '（未設定）')}`);
  lines.push(`- 地域支援: ${String(disposition?.principle?.regionalSupportOverlay || '（未設定）')}`);
  lines.push('');
  lines.push('## 一覧');
  lines.push('');
  lines.push('| カード | 法政策 | 地域支援 | 次に寄せる先 |');
  lines.push('| --- | --- | --- | --- |');

  for (const row of Array.isArray(disposition?.cards) ? disposition.cards : []) {
    const cardId = String(row?.cardId || '');
    const title = String(copyMap.get(cardId)?.title || cardId);
    const legalDecision = String(row?.legalPolicy?.disposition || '');
    const regionalDecision = String(row?.regionalSupport?.disposition || '');
    const legal = String(labelMap?.[legalDecision] || legalDecision || '');
    const regional = String(labelMap?.[regionalDecision] || regionalDecision || '');
    const nextArtifact = unique(row?.nextArtifact).join(' / ') || '（未設定）';
    lines.push(`| ${title} \`${cardId}\` | ${legal} | ${regional} | ${nextArtifact} |`);
  }

  lines.push('');
  lines.push('## カード別メモ');
  lines.push('');

  for (const row of Array.isArray(disposition?.cards) ? disposition.cards : []) {
    const cardId = String(row?.cardId || '');
    const title = String(copyMap.get(cardId)?.title || cardId);
    const legalDecision = String(row?.legalPolicy?.disposition || '');
    const regionalDecision = String(row?.regionalSupport?.disposition || '');
    const legal = String(labelMap?.[legalDecision] || legalDecision || '');
    const regional = String(labelMap?.[regionalDecision] || regionalDecision || '');

    lines.push(`## ${title} \`${cardId}\``);
    lines.push('');
    lines.push(`- 法政策判定: ${legal}`);
    lines.push(`- 地域支援判定: ${regional}`);
    lines.push('- カード内に残す最小要素（法政策）:');
    lines.push(bullets(row?.legalPolicy?.keepInCard));
    lines.push('- カード内に残す最小要素（地域支援）:');
    lines.push(bullets(row?.regionalSupport?.keepInCard));
    if (String(row?.legalPolicy?.detailTarget || '').trim()) {
      lines.push(`- 法政策の詳細先: ${String(row?.legalPolicy?.detailTarget || '').trim()}`);
    }
    if (String(row?.regionalSupport?.detailTarget || '').trim()) {
      lines.push(`- 地域支援の詳細先: ${String(row?.regionalSupport?.detailTarget || '').trim()}`);
    }
    lines.push(`- 理由: ${String(row?.rationale || '（未設定）')}`);
    lines.push('- 次に寄せる先:');
    lines.push(bullets(row?.nextArtifact));
    lines.push('');
  }

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        cardCount: Array.isArray(disposition?.cards) ? disposition.cards.length : 0,
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
