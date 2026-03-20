#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const referencesRoot = path.join(projectRoot, 'references');
const outputDir = path.join(referencesRoot, 'index');
const outputFile = path.join(outputDir, 'local-catalog.json');

const allowedExtensions = new Set(['.txt', '.md', '.pdf', '.xlsm', '.sav']);

function shouldIncludeFile(entryName) {
  const extension = path.extname(entryName).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    return false;
  }

  // Treat authored markdown notes as knowledge inputs, but skip operational READMEs.
  if (extension === '.md' && entryName.toLowerCase() === 'readme.md') {
    return false;
  }

  return true;
}

async function walk(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(fullPath);
      files.push(...nested);
      continue;
    }

    if (!shouldIncludeFile(entry.name)) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    const stats = await fs.stat(fullPath);
    files.push({
      path: fullPath,
      extension,
      sizeBytes: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    });
  }

  return files;
}

function summarizeByExtension(files) {
  const summary = {};
  for (const file of files) {
    const current = summary[file.extension] ?? { count: 0, totalSizeBytes: 0 };
    current.count += 1;
    current.totalSizeBytes += file.sizeBytes;
    summary[file.extension] = current;
  }
  return summary;
}

async function main() {
  const files = await walk(referencesRoot);
  const payload = {
    generatedAt: new Date().toISOString(),
    root: referencesRoot,
    fileCount: files.length,
    byExtension: summarizeByExtension(files),
    files,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`Catalog generated: ${outputFile}`);
  console.log(`Files indexed: ${files.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
