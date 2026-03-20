#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const canonicalDir = path.join(rootDir, 'references', 'data2', 'sanitized', 'kijutsu');
const legacyDir = path.join(rootDir, 'references', 'data2', 'kijutsuOut_jac');

const enforce = process.argv.includes('--enforce');
const maxMediumRiskHits = Number(process.env.JAC_DATA2_MAX_MEDIUM_RISK_HITS || 20);

const prefNames = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

const prefRegex = new RegExp(prefNames.join('|'));
const cityRegex = /[一-龥々]{2,12}(?:市|区|町|村)/;
const regionSkipWords = new Set(['市町村', '都道府県', '地域', '各県', '各市町村', '全国']);
const standaloneLocationNames = [
  '郡山',
  '御殿場',
  '札幌',
  '仙台',
  '横浜',
  '川崎',
  '名古屋',
  '神戸',
  '広島',
  '福岡',
  '北九州',
  '熊本',
];
const standaloneLocationRegex = new RegExp(standaloneLocationNames.join('|'));

const phoneRegex = /0\d{1,4}[-(]?\d{1,4}[-)]?\d{3,4}/;
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const postalRegex = /〒?[0-9０-９]{3}[ -－]?[0-9０-９]{4}/;
const addressRegex = /[一-龥々ぁ-んァ-ヶー]{2,30}[0-9０-９]{1,4}[－-][0-9０-９]{1,4}[－-][0-9０-９]{1,4}/;
const companyRegex = /(?:株式会社|有限会社|合同会社|（株）)[^、。\s]{1,30}/;

const institutionSensitiveSections = new Set(['##就労相談先', '##具体的な就労支援内容']);
const institutionHintRegex = /(フロンティア|エンジニアリング|ワークセラー|フレンド|コロポックル)$/;
const institutionTokenRegex = /[A-Za-zＡ-Ｚａ-ｚ0-9０-９ァ-ヶー・]{4,40}/g;
const institutionCueRegex = /(相談先|あっせん|紹介|窓口|支援|利用|連携)/;

const genericInstitutionTokens = new Set([
  'ハローワーク',
  'ジョブコーチ',
  'デイケア',
  'デイサービス',
  'グループホーム',
  'ケースワーカー',
  'ソーシャルワーカー',
  'カウンセリング',
  'リハビリ',
  'トライアル',
  'トライアル雇用',
  'サポート',
  'フォロー',
  'サービス',
  'スタッフ',
  'センター',
  'クリニック',
  'スクール',
  'スーパー',
  'コンビニ',
  'キャリア',
  'キャリアアップ',
]);

function toRecord(file, lineNo, line, match, type, level) {
  return {
    file,
    line: lineNo,
    type,
    level,
    match,
    text: line.trim().slice(0, 220),
  };
}

function isLikelyInstitutionName(token) {
  if (!token) return false;
  if (token.startsWith('[') && token.endsWith(']')) return false;
  if (genericInstitutionTokens.has(token)) return false;
  if (institutionHintRegex.test(token)) return true;
  if (/[A-Za-zＡ-Ｚａ-ｚ]/.test(token)) return true;
  return false;
}

async function resolveTargetDir() {
  try {
    await fs.access(canonicalDir);
    return canonicalDir;
  } catch {
    return legacyDir;
  }
}

async function run() {
  const targetDir = await resolveTargetDir();
  const files = (await fs.readdir(targetDir))
    .filter((name) => /^\d+\.txt$/.test(name))
    .sort((a, b) => Number(a.replace('.txt', '')) - Number(b.replace('.txt', '')));

  const findings = [];

  for (const file of files) {
    const text = await fs.readFile(path.join(targetDir, file), 'utf8');
    const lines = text.split(/\r?\n/);
    let section = '';

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const lineNo = i + 1;
      const trimmed = line.trim();

      if (trimmed.startsWith('##')) {
        section = trimmed;
      }
      if (!trimmed) continue;

      if (emailRegex.test(line)) findings.push(toRecord(file, lineNo, line, 'email', 'email', 'high'));
      if (phoneRegex.test(line)) findings.push(toRecord(file, lineNo, line, 'phone', 'phone', 'high'));
      if (postalRegex.test(line)) findings.push(toRecord(file, lineNo, line, 'postal', 'postal', 'high'));
      if (addressRegex.test(line)) findings.push(toRecord(file, lineNo, line, 'street_address', 'street_address', 'high'));
      if (companyRegex.test(line)) findings.push(toRecord(file, lineNo, line, 'company_marker', 'company_marker', 'high'));

      const prefMatch = line.match(prefRegex);
      if (prefMatch) {
        findings.push(toRecord(file, lineNo, line, prefMatch[0], 'prefecture', 'high'));
      }
      const standaloneMatch = line.match(standaloneLocationRegex);
      if (standaloneMatch) {
        findings.push(toRecord(file, lineNo, line, standaloneMatch[0], 'standalone_location', 'high'));
      }

      const cityMatches = [...line.matchAll(new RegExp(cityRegex, 'g'))];
      for (const city of cityMatches) {
        const word = city[0];
        if (regionSkipWords.has(word)) continue;
        findings.push(toRecord(file, lineNo, line, word, 'city_like', 'high'));
      }

      if (institutionSensitiveSections.has(section) && institutionCueRegex.test(line)) {
        const tokens = line.match(institutionTokenRegex) || [];
        for (const token of tokens) {
          if (!isLikelyInstitutionName(token)) continue;
          findings.push(toRecord(file, lineNo, line, token, 'institution_candidate', 'medium'));
        }
      }
    }
  }

  const highRisk = findings.filter((item) => item.level === 'high');
  const mediumRisk = findings.filter((item) => item.level === 'medium');

  const byType = findings.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const result = {
    targetDir,
    checkedFiles: files.length,
    totalFindings: findings.length,
    highRiskCount: highRisk.length,
    mediumRiskCount: mediumRisk.length,
    maxMediumRiskHits,
    byType,
    samples: {
      highRisk: highRisk.slice(0, 20),
      mediumRisk: mediumRisk.slice(0, 20),
    },
  };

  console.log(JSON.stringify(result, null, 2));

  if (enforce) {
    const failed = highRisk.length > 0 || mediumRisk.length > maxMediumRiskHits;
    if (failed) {
      process.exit(1);
    }
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
