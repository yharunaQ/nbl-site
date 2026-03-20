#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, 'content-review', 'site-assets', 'asset-source-map.json');
const REPORT_DIR = path.join(ROOT, 'docs', 'nbl-workspace', 'site-asset-sync-audits');

function todayStamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function fileHash(filePath) {
  const buf = await fs.readFile(filePath);
  return createHash('md5').update(buf).digest('hex');
}

async function fileStatSafe(filePath) {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

function rel(filePath) {
  return path.relative(ROOT, filePath) || '.';
}

async function main() {
  const raw = await fs.readFile(MAP_PATH, 'utf8');
  const map = JSON.parse(raw);
  const assets = Array.isArray(map.assets) ? map.assets : [];

  const rows = [];
  let targetCount = 0;
  let driftCount = 0;
  let missingSourceCount = 0;
  let missingTargetCount = 0;

  for (const asset of assets) {
    const sourcePath = path.join(ROOT, asset.source);
    const sourceStat = await fileStatSafe(sourcePath);
    const sourceHash = sourceStat ? await fileHash(sourcePath) : null;
    if (!sourceStat) missingSourceCount += 1;

    for (const target of asset.targets || []) {
      targetCount += 1;
      const targetPath = path.join(ROOT, target.path);
      const targetStat = await fileStatSafe(targetPath);
      const targetHash = targetStat ? await fileHash(targetPath) : null;
      const drift = !sourceStat || !targetStat || sourceHash !== targetHash;
      if (drift) driftCount += 1;
      if (!targetStat) missingTargetCount += 1;

      rows.push({
        id: asset.id,
        channel: target.channel || 'unknown',
        source: asset.source,
        target: target.path,
        sourceExists: Boolean(sourceStat),
        targetExists: Boolean(targetStat),
        sourceMtime: sourceStat ? sourceStat.mtime.toISOString() : null,
        targetMtime: targetStat ? targetStat.mtime.toISOString() : null,
        sourceHash,
        targetHash,
        drift,
      });
    }
  }

  await fs.mkdir(REPORT_DIR, { recursive: true });
  const reportPath = path.join(REPORT_DIR, `${todayStamp()}.md`);
  const lines = [
    '# Site Asset Sync Audit',
    '',
    `更新日: ${todayStamp()}`,
    `source map: \`${rel(MAP_PATH)}\``,
    '',
    '## Summary',
    '',
    `- mapped assets: ${assets.length}`,
    `- mapped targets: ${targetCount}`,
    `- drifted targets: ${driftCount}`,
    `- missing sources: ${missingSourceCount}`,
    `- missing targets: ${missingTargetCount}`,
    '',
    '## Target Status',
    '',
    '| id | channel | source | target | status |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const row of rows) {
    const status = !row.sourceExists
      ? 'missing_source'
      : !row.targetExists
        ? 'missing_target'
        : row.drift
          ? 'drift'
          : 'aligned';
    lines.push(
      `| ${row.id} | ${row.channel} | \`${row.source}\` | \`${row.target}\` | ${status} |`,
    );
  }

  const driftRows = rows.filter((row) => row.drift);
  if (driftRows.length > 0) {
    lines.push('', '## Drift Details', '');
    for (const row of driftRows) {
      lines.push(`### ${row.id} -> ${row.target}`);
      lines.push(`- source: \`${row.source}\``);
      lines.push(`- target: \`${row.target}\``);
      lines.push(`- source exists: ${row.sourceExists ? 'yes' : 'no'}`);
      lines.push(`- target exists: ${row.targetExists ? 'yes' : 'no'}`);
      if (row.sourceMtime) lines.push(`- source mtime: ${row.sourceMtime}`);
      if (row.targetMtime) lines.push(`- target mtime: ${row.targetMtime}`);
      if (row.sourceHash) lines.push(`- source md5: \`${row.sourceHash}\``);
      if (row.targetHash) lines.push(`- target md5: \`${row.targetHash}\``);
      lines.push('');
    }
  }

  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8');

  const summary = {
    generatedAt: new Date().toISOString(),
    mapPath: rel(MAP_PATH),
    reportPath: rel(reportPath),
    assetCount: assets.length,
    targetCount,
    driftCount,
    missingSourceCount,
    missingTargetCount,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
