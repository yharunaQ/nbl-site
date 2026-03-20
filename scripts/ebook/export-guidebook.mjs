#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const INPUT_PATH = path.join(process.cwd(), 'docs', 'guidebook', 'manuscript.md');
const DIST_DIR = path.join(process.cwd(), 'docs', 'guidebook', 'dist');
const DOCX_PATH = path.join(DIST_DIR, 'jac-guidebook-review.docx');
const PDF_PATH = path.join(DIST_DIR, 'jac-guidebook.pdf');
const PUBLISH_PATH = path.join(process.cwd(), 'public', 'ebooks', 'jac-guidebook.pdf');

function hasCommand(command) {
  const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
  return result.status === 0;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  return result.status === 0;
}

async function fileExists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await fileExists(INPUT_PATH))) {
    throw new Error(`Manuscript not found: ${INPUT_PATH}`);
  }

  await fs.mkdir(DIST_DIR, { recursive: true });
  await fs.mkdir(path.dirname(PUBLISH_PATH), { recursive: true });

  const pandocAvailable = hasCommand('pandoc');
  const sofficeAvailable = hasCommand('soffice');
  const textutilAvailable = hasCommand('textutil');

  let docxCreated = false;
  let pdfCreated = false;

  if (pandocAvailable) {
    docxCreated = run('pandoc', [INPUT_PATH, '-o', DOCX_PATH]);
  } else {
    console.log('[warn] pandoc not found.');
  }

  if (!docxCreated && textutilAvailable) {
    docxCreated = run('textutil', ['-convert', 'docx', '-output', DOCX_PATH, INPUT_PATH]);
    if (docxCreated) {
      console.log('[info] Generated docx via textutil fallback.');
    }
  } else if (!docxCreated) {
    console.log('[warn] textutil not found. skip docx build.');
  }

  if (docxCreated && sofficeAvailable) {
    const ok = run('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', DIST_DIR, DOCX_PATH]);
    if (ok && (await fileExists(PDF_PATH))) {
      pdfCreated = true;
    }
  }

  if (!pdfCreated && pandocAvailable) {
    const ok = run('pandoc', [INPUT_PATH, '-o', PDF_PATH]);
    if (ok && (await fileExists(PDF_PATH))) {
      pdfCreated = true;
    }
  }

  if (pdfCreated) {
    await fs.copyFile(PDF_PATH, PUBLISH_PATH);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        input: INPUT_PATH,
        docxCreated,
        pdfCreated,
        engines: {
          pandocAvailable,
          textutilAvailable,
          sofficeAvailable,
        },
        docxPath: DOCX_PATH,
        pdfPath: PDF_PATH,
        publishPath: pdfCreated ? PUBLISH_PATH : null,
        hints: [
          ...(docxCreated
            ? []
            : [
                'Install pandoc (or macOS textutil) to generate .docx automatically.',
              ]),
          ...(pdfCreated
            ? []
            : [
                'Install LibreOffice (soffice) or pandoc PDF engine to generate .pdf automatically.',
              ]),
        ],
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
