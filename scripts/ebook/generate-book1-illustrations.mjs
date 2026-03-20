#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'guidebook', 'assets', 'book1');

const CHAPTERS = [
  {
    no: '01',
    title: '会議疲れを減らす会議設計',
    left: '会議過密',
    center: '分割+非同期化',
    right: '理解維持',
  },
  {
    no: '02',
    title: '体調の波を前提にした業務配分',
    left: '体調波',
    center: '負荷可変',
    right: '達成安定',
  },
  {
    no: '03',
    title: '通院と勤務を両立する時間設計',
    left: '日程衝突',
    center: '通院固定+調整',
    right: '両立',
  },
  {
    no: '04',
    title: '音・光・温度ストレスを下げる職場調整',
    left: '刺激過多',
    center: '環境調整',
    right: '集中維持',
  },
  {
    no: '05',
    title: '通勤消耗を減らす働き方設計',
    left: '通勤消耗',
    center: '時差+在宅',
    right: '日中安定',
  },
  {
    no: '06',
    title: '配慮に必要な情報だけ共有する',
    left: '共有不足/過多',
    center: '開示レイヤー',
    right: '信頼維持',
  },
  {
    no: '07',
    title: '復職初期を守る段階復帰',
    left: '早戻しリスク',
    center: '段階復帰',
    right: '定着',
  },
  {
    no: '08',
    title: '睡眠・服薬リズムを守るシフト設計',
    left: '時刻不整合',
    center: 'リズム保護',
    right: '悪化予防',
  },
  {
    no: '09',
    title: '配慮を続ける相談運用の定着',
    left: '単発相談',
    center: '運用ループ',
    right: '継続改善',
  },
];

function createSvg({ no, title, left, center, right }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="100%" stop-color="#ecfeff"/>
    </linearGradient>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 Z" fill="#0891b2"/>
    </marker>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect x="60" y="60" width="1480" height="780" rx="24" fill="#ffffff" stroke="#bae6fd" stroke-width="4"/>

  <text x="120" y="150" font-size="46" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#0f172a">第${no}章</text>
  <text x="120" y="220" font-size="54" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#0f766e">${title}</text>

  <rect x="120" y="300" width="380" height="360" rx="20" fill="#fef2f2" stroke="#fecaca"/>
  <rect x="610" y="300" width="380" height="360" rx="20" fill="#f0fdfa" stroke="#99f6e4"/>
  <rect x="1100" y="300" width="380" height="360" rx="20" fill="#eff6ff" stroke="#bfdbfe"/>

  <line x1="510" y1="480" x2="590" y2="480" stroke="#0891b2" stroke-width="8" marker-end="url(#arrow)"/>
  <line x1="1000" y1="480" x2="1080" y2="480" stroke="#0891b2" stroke-width="8" marker-end="url(#arrow)"/>

  <text x="160" y="390" font-size="34" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#7f1d1d">課題</text>
  <text x="650" y="390" font-size="34" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#115e59">配慮設計</text>
  <text x="1140" y="390" font-size="34" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#1e3a8a">改善像</text>

  <text x="160" y="500" font-size="52" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#7f1d1d">${left}</text>
  <text x="650" y="500" font-size="52" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#115e59">${center}</text>
  <text x="1140" y="500" font-size="52" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#1e3a8a">${right}</text>

  <text x="120" y="760" font-size="28" font-family="'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" fill="#475569">book1 pre-final illustration (replaceable)</text>
</svg>`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  for (const chapter of CHAPTERS) {
    const filePath = path.join(OUTPUT_DIR, `ch${chapter.no}.svg`);
    await fs.writeFile(filePath, createSvg(chapter), 'utf8');
  }
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'README.md'),
    [
      '# Book1 Illustration Assets',
      '',
      '- ch01.svg ... ch09.svg を pre-完成版の図解として使用。',
      '- 生成AIの本番画像ができたら同名で置き換え可能。',
      '- 推奨サイズ: 1600x900 (16:9)。',
      '',
    ].join('\n'),
    'utf8',
  );
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputDir: OUTPUT_DIR,
        count: CHAPTERS.length,
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

