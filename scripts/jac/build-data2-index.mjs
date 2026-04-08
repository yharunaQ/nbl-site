#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const data2Dir = path.join(root, 'references', 'data2');
const indexDir = path.join(data2Dir, 'index');
const indexPath = path.join(indexDir, 'data2-knowledge-index.json');

const canonicalChishikiDir = path.join(data2Dir, 'sanitized', 'chishiki');
const canonicalKijutsuDir = path.join(data2Dir, 'sanitized', 'kijutsu');
const legacyChishikiDir = path.join(data2Dir, 'chishikiOut_jac');
const legacyKijutsuDir = path.join(data2Dir, 'kijutsuOut_jac');

const HEADER_STOP_WORDS = new Set(['なし', '特になし', '特に無し', '無', 'n/a', 'NA', '-', '－', '　']);

function normalize(text) {
  return String(text || '').replace(/\r\n?/g, '\n');
}

function sortNumericByFileName(files) {
  return [...files].sort((a, b) => {
    const aNum = Number(a.match(/\d+/)?.[0] || 0);
    const bNum = Number(b.match(/\d+/)?.[0] || 0);
    return aNum - bNum;
  });
}

async function resolveDir(primary, fallback, label) {
  try {
    await fs.access(primary);
    return primary;
  } catch {
    try {
      await fs.access(fallback);
      return fallback;
    } catch {
      throw new Error(`${label} directory not found: ${primary} | ${fallback}`);
    }
  }
}

function extractDisability(content) {
  const match = content.match(/##機能障害・疾病:\s*「(.+?)」/);
  return match?.[1]?.trim() || '不明';
}

function parseIssuesFromChishiki(content) {
  const lines = normalize(content).split('\n');
  const issues = [];
  let current = null;

  for (const line of lines) {
    const issueMatch = line.match(/^###\s+\d+\.\s*課題:\s*(.+)$/);
    if (issueMatch) {
      if (current) issues.push(current);
      current = { issue: issueMatch[1].trim(), supports: [] };
      continue;
    }

    if (!current) continue;
    if (!line.includes('「') || !line.includes('」')) continue;

    const supportMatches = [...line.matchAll(/「([^」]+)」/g)].map((m) => m[1].trim());
    if (supportMatches.length === 0) continue;
    const support = supportMatches[0];
    if (!support || current.supports.includes(support)) continue;
    current.supports.push(support);
  }

  if (current) issues.push(current);

  return issues.map((item) => ({
    issue: item.issue,
    supports: item.supports.slice(0, 5),
  }));
}

function parseNarrativeHighlights(content) {
  const lines = normalize(content).split('\n');
  const targetSections = new Set(['##就職困難状況', '##就職後の職場配慮', '##就職後の職業的課題', '##自由記述']);

  let section = '';
  const buckets = {
    '##就職困難状況': [],
    '##就職後の職場配慮': [],
    '##就職後の職業的課題': [],
    '##自由記述': [],
  };

  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line) continue;
    if (line.startsWith('##')) {
      section = targetSections.has(line) ? line : '';
      continue;
    }
    if (!section) continue;
    if (line.startsWith('#')) continue;
    if (line.length < 10) continue;
    if (HEADER_STOP_WORDS.has(line)) continue;
    if (line.includes('[連絡先]') || line.includes('[住所]')) continue;
    if (!buckets[section].includes(line)) buckets[section].push(line);
  }

  return [
    ...buckets['##就職困難状況'].slice(0, 2),
    ...buckets['##就職後の職場配慮'].slice(0, 2),
    ...buckets['##就職後の職業的課題'].slice(0, 2),
    ...buckets['##自由記述'].slice(0, 2),
  ].slice(0, 6);
}

async function main() {
  // If data2 directories are absent (e.g. renamed to xx_data2/), skip gracefully.
  const hasChishiki = await fs.access(canonicalChishikiDir).then(() => true).catch(() =>
    fs.access(legacyChishikiDir).then(() => true).catch(() => false)
  );
  if (!hasChishiki) {
    console.log(JSON.stringify({ message: 'data2 index source not found — skipped.' }));
    return;
  }

  const chishikiDir = await resolveDir(canonicalChishikiDir, legacyChishikiDir, 'chishiki');
  const kijutsuDir = await resolveDir(canonicalKijutsuDir, legacyKijutsuDir, 'kijutsu');

  const files = await fs.readdir(chishikiDir);
  const targetFiles = sortNumericByFileName(files.filter((name) => /^sogo\d+\.txt$/.test(name)));

  const entries = [];

  for (const file of targetFiles) {
    const id = Number(file.match(/\d+/)?.[0] || 0);
    if (!id) continue;

    const chishikiPath = path.join(chishikiDir, file);
    const kijutsuPath = path.join(kijutsuDir, `${String(id).padStart(2, '0')}.txt`);

    let chishiki = '';
    let kijutsu = '';

    try {
      chishiki = await fs.readFile(chishikiPath, 'utf8');
    } catch {
      continue;
    }
    try {
      kijutsu = await fs.readFile(kijutsuPath, 'utf8');
    } catch {
      kijutsu = '';
    }

    entries.push({
      id,
      disability: extractDisability(chishiki),
      issues: parseIssuesFromChishiki(chishiki),
      narrativeHighlights: parseNarrativeHighlights(kijutsu),
    });
  }

  const payload = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      chishikiDir,
      kijutsuDir,
    },
    counts: {
      entries: entries.length,
    },
    entries,
  };

  await fs.mkdir(indexDir, { recursive: true });
  await fs.writeFile(indexPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(
    JSON.stringify(
      {
        message: 'Built data2 knowledge index.',
        indexPath,
        counts: payload.counts,
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
