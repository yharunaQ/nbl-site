import { spawn } from 'node:child_process';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { PATHS, ROOT, formatTokyoDate, writeText } from './shared.mjs';

const PORT = 3210;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  '/',
  '/work-design-studio',
  '/work-design-map',
  '/work-design-tools',
  '/policy-research',
  '/partnership',
  '/work-condition-window',
  '/work-assessment-concept',
  '/about',
  '/contact',
  '/events',
  '/events/work-condition-forum',
  '/events/work-condition-forum/text/VF-01',
  '/organizations/diagnosis',
  '/resources/songs',
];

const BLOCKED_PATTERNS = [
  { label: 'review route leak', pattern: '/review/' },
  { label: 'review index label', pattern: 'Review Index' },
  { label: 'showcase direction label', pattern: 'Showcase Direction' },
  { label: 'internal workspace path leak', pattern: 'docs/nbl-workspace' },
  { label: 'content-review path leak', pattern: 'content-review/' },
  { label: 'falcon lab label leak', pattern: 'Falcon Lab' },
  { label: 'unapproved status label leak', pattern: 'public未承認' },
  { label: 'notebook production label leak', pattern: 'NotebookLM' },
  { label: 'manual posting queue leak', pattern: '手動投稿キュー' },
  { label: 'internal-ready status leak', pattern: 'internal-ready' },
  { label: 'oauth ops leak', pattern: 'OAuth' },
  { label: 'platform token ops leak', pattern: 'platform_access_tokens' },
  { label: 'candidate pattern ops leak', pattern: 'candidate_pattern' },
  { label: 'source validity ops leak', pattern: 'source/support validity' },
];

function startServer() {
  const child = spawn('npx', ['next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let logs = '';
  const appendLogs = (chunk) => {
    logs += chunk.toString();
    if (logs.length > 4000) {
      logs = logs.slice(-4000);
    }
  };

  child.stdout.on('data', appendLogs);
  child.stderr.on('data', appendLogs);

  return { child, getLogs: () => logs };
}

async function waitForServer(child, getLogs) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`next start exited early\n${getLogs()}`);
    }

    try {
      const response = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
      if (response.ok || response.status === 308 || response.status === 307) {
        return;
      }
    } catch {}

    await delay(500);
  }

  throw new Error(`timed out waiting for next start\n${getLogs()}`);
}

async function fetchRoute(route) {
  const response = await fetch(`${BASE_URL}${route}`, { redirect: 'follow' });
  const body = await response.text();
  return {
    route,
    status: response.status,
    body,
  };
}

function collectLeaks(result) {
  if (result.status >= 400) {
    return [`http ${result.status}`];
  }

  return BLOCKED_PATTERNS.filter((entry) => result.body.includes(entry.pattern)).map(
    (entry) => entry.label,
  );
}

async function main() {
  const today = formatTokyoDate();
  const reportPath = path.join(PATHS.publicReleasePreflightsDir, `${today}-surface.md`);
  const { child, getLogs } = startServer();

  try {
    await waitForServer(child, getLogs);

    const results = [];
    for (const route of ROUTES) {
      const fetched = await fetchRoute(route);
      results.push({
        route,
        status: fetched.status,
        leaks: collectLeaks(fetched),
      });
    }

    const leakingRoutes = results.filter((result) => result.leaks.length > 0);

    const lines = [
      '# Public Surface Safety Check',
      '',
      `更新日: ${today}`,
      '',
      '## Scope',
      '',
      ...ROUTES.map((route) => `- ${route}`),
      '',
      '## Results',
      '',
      ...results.map((result) => {
        const suffix =
          result.leaks.length > 0
            ? `blocked (${result.leaks.join(', ')})`
            : `ok (http ${result.status})`;
        return `- ${result.route}: ${suffix}`;
      }),
      '',
      '## Gate',
      '',
      leakingRoutes.length > 0
        ? '- failed: public surface still leaks review or internal-only signals'
        : '- passed: public surface is separated from review/internal routes for this scope',
      '',
    ];

    await writeText(reportPath, lines.join('\n'));
    process.stdout.write(
      `${leakingRoutes.length > 0 ? 'failed' : 'passed'} public surface check -> ${reportPath}\n`,
    );

    if (leakingRoutes.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    child.kill('SIGTERM');
    await delay(300);
    if (child.exitCode === null) {
      child.kill('SIGKILL');
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
