#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DISPOSITION_PATH = path.join(ROOT, 'references', 'jac', 'layer-disposition.json');
const COMMON_COPY_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const MANUSCRIPT_PATH = path.join(ROOT, 'docs', 'guidebook', 'manuscript-reader-edition.md');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'jac-26frame-update-review-memo.md');

const REVIEW_CARD_IDS = [
  'p-support-service-navigation',
  'p-worktrial-transition',
  'p-manager-checkin',
  'p-disclosure-boundary',
  'p-mental-fluctuation-plan',
];

const CARD_STATUS_NOTE = {
  'p-support-service-navigation':
    '支援接続の詳細運用はカード外へ逃がし、カード内は「期限・責任者つきで見る」までに絞った。',
  'p-worktrial-transition':
    '採用後1から4週の支援体制はカード内に残し、制度差の詳細だけを法政策ガードレール層へ寄せた。',
  'p-manager-checkin':
    '相談運用の共通部はカード外へ寄せ、カード内では外部エスカレーション先の有無だけを示す形にした。',
  'p-disclosure-boundary':
    '法政策条件と地域支援の両方がカード境界そのものなので、カード内に厚めに残した。',
  'p-mental-fluctuation-plan':
    '法政策の詳細は外へ寄せつつ、再評価導線と戻し先はカード内に残した。',
};

function unique(items) {
  return [...new Set((Array.isArray(items) ? items : []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function normalizeDecision(detail) {
  const value = String(detail?.disposition || '').trim();
  if (value === 'move_to_shared_layer' || value === 'move_to_separate_guide' || value === 'keep_in_card') {
    return value;
  }
  return 'keep_in_card';
}

function decisionLabel(decision) {
  if (decision === 'move_to_shared_layer') return '共通レイヤーへ寄せる';
  if (decision === 'move_to_separate_guide') return '別ガイドへ寄せる';
  return 'カード内に残す';
}

function displayModeForDecision(decision, layer) {
  if (layer === 'legal') {
    return decision === 'keep_in_card' ? '適用条件（法政策・詳細表示）' : '適用条件（法政策・判断線のみ）';
  }
  return decision === 'keep_in_card' ? '実施条件（地域支援・詳細表示）' : '実施条件（地域支援・判断線のみ）';
}

function bullets(items, fallback = '（該当なし）') {
  const rows = unique(items);
  if (rows.length === 0) return `- ${fallback}`;
  return rows.map((item) => `- ${item}`).join('\n');
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findLine(lines, pattern, startIndex = 0) {
  for (let i = startIndex; i < lines.length; i += 1) {
    if (pattern.test(lines[i])) return i + 1;
  }
  return null;
}

function findChapterLines(lines, title) {
  const chapterLine = findLine(lines, new RegExp(`^## 第\\d+章 ${escapeRegExp(title)}（`));
  const section4Line = chapterLine
    ? findLine(lines, /^### 4\. 進める前に外せない条件$/, Math.max(chapterLine - 1, 0))
    : null;
  return { chapterLine, section4Line };
}

function formatLocation(chapterLine, section4Line) {
  if (!chapterLine && !section4Line) return '（未検出）';
  if (chapterLine && section4Line) {
    return `manuscript-reader-edition.md:${chapterLine}（章頭） / manuscript-reader-edition.md:${section4Line}（4節）`;
  }
  if (chapterLine) return `manuscript-reader-edition.md:${chapterLine}（章頭）`;
  return `manuscript-reader-edition.md:${section4Line}（4節）`;
}

async function main() {
  const [dispositionRaw, commonCopyRaw, manuscriptRaw] = await Promise.all([
    fs.readFile(DISPOSITION_PATH, 'utf8'),
    fs.readFile(COMMON_COPY_PATH, 'utf8'),
    fs.readFile(MANUSCRIPT_PATH, 'utf8'),
  ]);

  const dispositionPayload = JSON.parse(dispositionRaw);
  const dispositionMap = new Map(
    (Array.isArray(dispositionPayload?.cards) ? dispositionPayload.cards : [])
      .map((row) => [String(row?.cardId || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const commonCopyPayload = JSON.parse(commonCopyRaw);
  const commonCopyMap = new Map(
    (Array.isArray(commonCopyPayload?.cards) ? commonCopyPayload.cards : [])
      .map((row) => [String(row?.id || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );

  const manuscriptLines = manuscriptRaw.split(/\r?\n/);
  const section4Count = manuscriptLines.filter((line) => line.trim() === '### 4. 進める前に外せない条件').length;

  const lines = [];
  lines.push('# JAC 26フレーム 更新確認メモ');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: review');
  lines.push('');
  lines.push('## 目的');
  lines.push('');
  lines.push('- 今回のデータ追加と改修が、26フレームのガイドとガイドブック冊子へどう反映されたかを確認するためのメモ。');
  lines.push('- 試験利用やフィードバック回収の仕組みではなく、更新反映の見どころを絞るための確認資料。');
  lines.push('');
  lines.push('## 全体状況');
  lines.push('');
  lines.push('- ガイド: 各カードで、`適用条件（法政策）` と `実施条件（地域支援）` を、詳細表示か判断線のみかで出し分ける状態。');
  lines.push(`- 冊子: 26章すべてに ` + '`### 4. 進める前に外せない条件`' + ` が入り、問い順の章構成で確認できる状態。現在の章数は ${section4Count} 件。`);
  lines.push('- 構造判断: 法政策差は別ガードレール層、地域支援オーケストレーションは共通レイヤーまたは別ガイドで扱う方針に揃っている。');
  lines.push('');
  lines.push('## まず見るべき5カード');
  lines.push('');
  lines.push('| カード | 法政策 | 地域支援 | ガイド表示 | 冊子確認位置 |');
  lines.push('| --- | --- | --- | --- | --- |');

  for (const cardId of REVIEW_CARD_IDS) {
    const disposition = dispositionMap.get(cardId);
    const commonCopy = commonCopyMap.get(cardId);
    if (!disposition || !commonCopy) continue;
    const legalDecision = normalizeDecision(disposition?.legalPolicy);
    const regionalDecision = normalizeDecision(disposition?.regionalSupport);
    const title = String(commonCopy?.title || cardId);
    const { chapterLine, section4Line } = findChapterLines(manuscriptLines, title);

    lines.push(
      `| ${title} \`${cardId}\` | ${decisionLabel(legalDecision)} | ${decisionLabel(regionalDecision)} | ${displayModeForDecision(legalDecision, 'legal')} / ${displayModeForDecision(regionalDecision, 'regional')} | ${formatLocation(chapterLine, section4Line)} |`,
    );
  }

  lines.push('');
  lines.push('## カード別の見方');
  lines.push('');

  for (const cardId of REVIEW_CARD_IDS) {
    const disposition = dispositionMap.get(cardId);
    const commonCopy = commonCopyMap.get(cardId);
    if (!disposition || !commonCopy) continue;
    const title = String(commonCopy?.title || cardId);
    const legalDecision = normalizeDecision(disposition?.legalPolicy);
    const regionalDecision = normalizeDecision(disposition?.regionalSupport);
    const legalKeep = unique(disposition?.legalPolicy?.keepInCard);
    const regionalKeep = unique(disposition?.regionalSupport?.keepInCard);
    const { chapterLine, section4Line } = findChapterLines(manuscriptLines, title);

    lines.push(`### ${title} \`${cardId}\``);
    lines.push('');
    lines.push(`- 更新の要点: ${CARD_STATUS_NOTE[cardId] || '（未設定）'}`);
    lines.push(`- 法政策: ${decisionLabel(legalDecision)} / カード内に残す点: ${legalKeep.join(' / ') || '（該当なし）'}`);
    lines.push(`- 地域支援: ${decisionLabel(regionalDecision)} / カード内に残す点: ${regionalKeep.join(' / ') || '（該当なし）'}`);
    lines.push(`- ガイドでの見え方: ${displayModeForDecision(legalDecision, 'legal')} と ${displayModeForDecision(regionalDecision, 'regional')} の組み合わせで表示される。`);
    lines.push(`- 冊子での確認位置: ${formatLocation(chapterLine, section4Line)}`);
    lines.push('');
  }

  lines.push('## 今の段階で特に問題がないか');
  lines.push('');
  lines.push('- 大きな構造破綻は見えていない。');
  lines.push('- ガイドと冊子で、法政策差と地域支援レイヤーの出し分け方針は揃っている。');
  lines.push('- テンプレートと記入例まで進めたことで、別ガイドへ逃がした内容も机上で埋められる状態になっている。');
  lines.push('');
  lines.push('## 気にしている点');
  lines.push('');
  lines.push('- まだ `実地で1ケース使った結果` は入っていない。現場で使うと、テンプレートの行数や補助欄の過不足が出る可能性がある。');
  lines.push('- 法政策ガードレールは分離方針まで固まっているが、法域別の実務確認項目まではまだ厚くしていない。');
  lines.push('- 地域資源の実名ディレクトリはまだ入れていない。ここを入れる段階で、自治体差と更新運用の問題が出る。');
  lines.push('');
  lines.push('## 次に確認をお願いしたい段階');
  lines.push('');
  lines.push('- 重点5カードについて、今回の出し分けが「薄すぎる / 厚すぎる」かを見る段階。');
  lines.push('- 特に [manuscript-reader-edition.md](/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/docs/guidebook/manuscript-reader-edition.md) の該当章を見て、');
  lines.push('  `p-support-service-navigation` は外へ逃がしすぎていないか、`p-disclosure-boundary` はカード内に残しすぎていないか、を確認する。');
  lines.push('');
  lines.push('## 関連資料');
  lines.push('');
  lines.push(bullets([
    'docs/jac-layer-disposition-matrix.md',
    'docs/jac-regional-support-orchestration-guide.md',
    'docs/jac-regional-support-template-examples.md',
    'docs/guidebook/manuscript-reader-edition.md',
    'pages/jac/guide.tsx',
  ]));
  lines.push('');

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        section4Count,
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
