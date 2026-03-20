#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const generatedPaths = ['references/data2/sanitized', 'references/data2/index'];
const includeLegacyCompat = process.env.JAC_INCLUDE_LEGACY_COMPAT_IN_CLEAN_CHECK === '1';
if (includeLegacyCompat) {
  generatedPaths.push('references/data2/chishikiOut_jac', 'references/data2/kijutsuOut_jac');
}

function runGitStatus() {
  try {
    const output = execFileSync(
      'git',
      ['status', '--porcelain', '--untracked-files=all', '--', ...generatedPaths],
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    return output.trim();
  } catch (error) {
    const stderr = String(error?.stderr || '').trim();
    const message = stderr || 'Failed to run git status.';
    throw new Error(message);
  }
}

function main() {
  const dirty = runGitStatus();
  const ok = dirty.length === 0;

  const payload = {
    generatedPaths,
    ok,
    dirtyLines: ok ? [] : dirty.split('\n'),
  };

  console.log(JSON.stringify(payload, null, 2));

  if (!ok) {
    console.error(
      'Generated data2 artifacts are not clean. Run `npm run jac:data2:refresh` and commit updated files.',
    );
    process.exit(1);
  }
}

main();
