#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const data2Dir = path.join(root, 'references', 'data2');

const legacyChishikiDir = path.join(data2Dir, 'chishikiOut');
const legacyKijutsuDir = path.join(data2Dir, 'kijutsuOut');

const rawBaseDir = path.join(data2Dir, 'raw');
const rawChishikiDir = path.join(rawBaseDir, 'chishikiOut');
const rawKijutsuDir = path.join(rawBaseDir, 'kijutsuOut');

async function copyMissingFiles(srcDir, dstDir, filePattern) {
  await fs.mkdir(dstDir, { recursive: true });
  const files = await fs.readdir(srcDir).catch(() => []);
  const targets = files.filter((name) => filePattern.test(name));

  let copied = 0;
  let skipped = 0;

  for (const name of targets) {
    const src = path.join(srcDir, name);
    const dst = path.join(dstDir, name);
    try {
      await fs.access(dst);
      skipped += 1;
      continue;
    } catch {
      // copy only when destination is missing
    }
    await fs.copyFile(src, dst);
    copied += 1;
  }

  return { total: targets.length, copied, skipped };
}

async function main() {
  const chishiki = await copyMissingFiles(legacyChishikiDir, rawChishikiDir, /^sogo\d+\.txt$/);
  const kijutsu = await copyMissingFiles(legacyKijutsuDir, rawKijutsuDir, /^\d+\.txt$/);

  console.log(
    JSON.stringify(
      {
        message: 'Initialized data2 raw layout.',
        outputs: {
          rawChishikiDir,
          rawKijutsuDir,
        },
        counts: {
          chishiki,
          kijutsu,
        },
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
