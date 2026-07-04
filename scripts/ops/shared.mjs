import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const EXECUTION_ROOT = process.cwd();
export const EXPLICIT_ROOT_ENV = 'NBL_OPS_ROOT';

function parseWorktreeEntries(output) {
  return output
    .trim()
    .split('\n\n')
    .map((block) => {
      const lines = block.split('\n');
      const worktreeLine = lines.find((line) => line.startsWith('worktree '));

      return {
        path: worktreeLine ? worktreeLine.slice('worktree '.length).trim() : null,
      };
    })
    .filter((entry) => entry.path);
}

function resolvePrimaryWorkspaceRoot(startCwd) {
  const explicitRoot = process.env[EXPLICIT_ROOT_ENV];
  if (explicitRoot) {
    return path.resolve(explicitRoot);
  }

  try {
    const output = execFileSync('git', ['worktree', 'list', '--porcelain'], {
      cwd: startCwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const entries = parseWorktreeEntries(output);
    const primaryEntry =
      entries.find(
        (entry) => !entry.path.includes(`${path.sep}.codex${path.sep}worktrees${path.sep}`),
      ) ?? entries[0];

    return primaryEntry?.path ?? startCwd;
  } catch {
    return startCwd;
  }
}

export const ROOT = resolvePrimaryWorkspaceRoot(EXECUTION_ROOT);

export const PATHS = {
  decisionLog: path.join(ROOT, 'docs/nbl-workspace/decision-log.md'),
  contentInventory: path.join(ROOT, 'docs/nbl-workspace/content-inventory.md'),
  founderNewContentLog: path.join(ROOT, 'content-inbox/founder-new-content-log.md'),
  founderSiteFeedbackLog: path.join(ROOT, 'content-inbox/founder-site-feedback-log.md'),
  dailySnapshotsDir: path.join(ROOT, 'docs/nbl-workspace/ops/daily-snapshots'),
  weeklyLoopReportsDir: path.join(ROOT, 'docs/nbl-workspace/ops/weekly-loop-reports'),
  externalSignalDigestsDir: path.join(ROOT, 'docs/nbl-workspace/ops/external-signal-digests'),
  partnerDiscoveryLoopsDir: path.join(ROOT, 'docs/nbl-workspace/ops/partner-discovery-loops'),
  publicReleasePreflightsDir: path.join(ROOT, 'docs/nbl-workspace/ops/public-release-preflights'),
};

export function formatTokyoDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatTokyoMonth(date = new Date()) {
  return formatTokyoDate(date).slice(0, 7);
}

export function daysSinceTokyoDate(dateString, referenceDateString = formatTokyoDate()) {
  if (!dateString) {
    return null;
  }

  const start = new Date(`${dateString}T00:00:00+09:00`);
  const end = new Date(`${referenceDateString}T00:00:00+09:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readText(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

export async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
}

export function getGitStatusEntries() {
  try {
    const output = execFileSync('git', ['status', '--short'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return output
      .split('\n')
      .map((line) => line.trimEnd())
      .filter(Boolean)
      .map((line) => ({
        status: line.slice(0, 2).trim() || '??',
        filePath: line.slice(3).trim(),
      }));
  } catch {
    return [];
  }
}

export function getNewFilePaths(entries) {
  return entries
    .filter((entry) => entry.status.includes('?') || entry.status.startsWith('A'))
    .map((entry) => entry.filePath);
}

export function isUnder(filePath, prefixes) {
  return prefixes.some((prefix) => filePath === prefix || filePath.startsWith(`${prefix}/`));
}

export function summarizePaths(paths, limit = 5) {
  const unique = [...new Set(paths)];
  if (unique.length === 0) {
    return 'none';
  }

  const shown = unique
    .slice(0, limit)
    .map((filePath) => `\`${filePath}\``)
    .join(', ');
  if (unique.length <= limit) {
    return shown;
  }

  return `${shown} ほか ${unique.length - limit} 件`;
}

export async function readEntriesSection(filePath) {
  const content = await readText(filePath);
  const match = content.match(/## Entries\n([\s\S]*?)(\n## |\n# |$)/);

  if (!match) {
    return [];
  }

  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') && !line.includes('ここに追記'));
}

function parseMarkdownTableRow(line) {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

export async function readContentInventory(filePath = PATHS.contentInventory) {
  const content = await readText(filePath);
  const updatedAt = content.match(/更新日:\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
  const match = content.match(/## Inventory\n([\s\S]*?)(\n## |\n# |$)/);

  if (!match) {
    return {
      updatedAt,
      rows: [],
    };
  }

  const tableLines = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  if (tableLines.length < 3) {
    return {
      updatedAt,
      rows: [],
    };
  }

  const headers = parseMarkdownTableRow(tableLines[0]);
  const rows = tableLines
    .slice(2)
    .map((line) => parseMarkdownTableRow(line))
    .filter((cells) => cells.some(Boolean))
    .map((cells) =>
      Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])),
    );

  return {
    updatedAt,
    rows,
  };
}

export function classifyWorkspaceActivity(filePaths) {
  const groups = [
    {
      key: 'ops',
      label: 'Operating Layer',
      prefixes: [
        'docs/nbl-workspace/ops',
        'docs/nbl-workspace/decision-log.md',
        'docs/nbl-workspace/snapshot-automation-design-2026-03-17.md',
        'docs/nbl-workspace/operating-loops-round-2026-03-17.md',
        'docs/nbl-workspace/value-compounding-operating-system-2026-03-17.md',
        'NBL-EXECUTIVE-START-HERE.md',
        'NBL-FOUNDER-INPUT-GUIDE.md',
        'pages/review/operating-loops.tsx',
        'pages/review/value-compounding.tsx',
        'pages/review/snapshot-automation.tsx',
        'lib/content/operatingLoopsReview.ts',
        'lib/content/valueCompoundingReview.ts',
        'lib/content/snapshotAutomationReview.ts',
        'scripts/ops',
      ],
    },
    {
      key: 'publicNarrative',
      label: 'Public Narrative',
      prefixes: [
        'pages/index.tsx',
        'pages/review',
        'pages/for-enterprise.tsx',
        'pages/videos.tsx',
        'pages/resources/work-design-foundations.tsx',
        'components',
        'lib/content',
      ],
    },
    {
      key: 'businessValidation',
      label: 'Business Validation',
      prefixes: [
        'docs/nbl-workspace/business',
        'docs/nbl-workspace/design-partner',
        'docs/nbl-workspace/commercial',
        'docs/nbl-workspace/partner',
        'content-review/commercial-discovery-kit',
        'content-review/partner-discovery-ops',
      ],
    },
    {
      key: 'knowledgeMethod',
      label: 'Knowledge And Method',
      prefixes: [
        'pages/jac',
        'lib/jac',
        'docs/jac',
        'content-inbox',
        'content-review/invisible-disability-series',
        'references/jac',
        'references/index',
      ],
    },
    {
      key: 'nextHorizon',
      label: 'Next Horizon',
      prefixes: [
        'docs/nbl-workspace/next-horizon',
        'pages/review/next-horizon.tsx',
        'dao-participation-lab',
        'pages/dao-participation-lab.tsx',
        'lib/daoParticipationLab',
      ],
    },
  ];

  return groups.map((group) => {
    const matchingPaths = filePaths.filter((filePath) => isUnder(filePath, group.prefixes));
    return {
      ...group,
      matchingPaths,
      count: matchingPaths.length,
    };
  });
}

export function latestDateStrings(dirEntries, fallbackDate) {
  const dated = dirEntries
    .map((name) => name.match(/(\d{4}-\d{2}-\d{2}|\d{4}-\d{2})/)?.[1] ?? null)
    .filter(Boolean)
    .sort();

  return dated.length > 0 ? dated : [fallbackDate];
}

export async function listMarkdownFiles(dirPath) {
  try {
    return (await fs.readdir(dirPath)).filter((name) => name.endsWith('.md'));
  } catch {
    return [];
  }
}
