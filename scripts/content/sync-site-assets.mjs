#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, 'content-review', 'site-assets', 'asset-source-map.json');
const DRY_RUN = process.argv.includes('--dry-run');

async function fileHash(filePath) {
  const buf = await fs.readFile(filePath);
  return createHash('md5').update(buf).digest('hex');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const raw = await fs.readFile(MAP_PATH, 'utf8');
  const map = JSON.parse(raw);
  const assets = Array.isArray(map.assets) ? map.assets : [];

  const copied = [];
  const skipped = [];
  const missingSources = [];

  for (const asset of assets) {
    const sourcePath = path.join(ROOT, asset.source);
    if (!(await fileExists(sourcePath))) {
      missingSources.push(asset.source);
      continue;
    }
    const sourceHash = await fileHash(sourcePath);

    for (const target of asset.targets || []) {
      const targetPath = path.join(ROOT, target.path);
      const targetExists = await fileExists(targetPath);
      const targetHash = targetExists ? await fileHash(targetPath) : null;
      const shouldCopy = !targetExists || sourceHash !== targetHash;

      if (!shouldCopy) {
        skipped.push(target.path);
        continue;
      }

      if (!DRY_RUN) {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(sourcePath, targetPath);
      }

      copied.push({
        id: asset.id,
        source: asset.source,
        target: target.path,
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        dryRun: DRY_RUN,
        copiedCount: copied.length,
        skippedCount: skipped.length,
        missingSourceCount: missingSources.length,
        copied,
        missingSources,
      },
      null,
      2,
    ),
  );

  if (missingSources.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
