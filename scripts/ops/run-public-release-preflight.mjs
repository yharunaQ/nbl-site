import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { PATHS, ROOT, formatTokyoDate, readText, writeText } from './shared.mjs';

const REPORT_ROUTES = [
  '/',
  '/work-design-studio',
  '/work-design-map',
  '/work-design-tools',
  '/policy-research',
  '/partnership',
  '/work-condition-window',
  '/projects',
  '/work-assessment-concept',
  '/about',
  '/contact',
  '/events',
  '/events/work-condition-forum',
  '/events/work-condition-forum/text/VF-01',
  '/organizations/diagnosis',
  '/resources/songs',
];
const CONTACT_EMAIL = 'info@nextbeinglab.org';
const CONTACT_ROUTE = '/contact';

const COMMANDS = [
  {
    label: 'Typecheck',
    command: 'npm',
    args: ['run', 'typecheck'],
  },
  {
    label: 'Focused tests',
    command: 'npx',
    args: [
      'jest',
      '__tests__/contact.test.tsx',
      '__tests__/falcon-next-nbl-static-site-candidate.test.tsx',
      '__tests__/next-nbl-public-migration-routes.test.ts',
      '__tests__/work-condition-forum-session-packages-page.test.tsx',
      '__tests__/work-condition-forum-text-page.test.tsx',
      '--runInBand',
    ],
  },
  {
    label: 'Production build',
    command: 'npm',
    args: ['run', 'build'],
  },
  {
    label: 'Public surface safety',
    command: 'node',
    args: ['./scripts/ops/check-public-surface-safety.mjs'],
  },
];

const FILE_CHECKS = [
  'public/robots.txt',
  'public/sitemap.xml',
  'pages/index.tsx',
  'pages/contact.tsx',
  'pages/about.tsx',
  'pages/work-design-studio.tsx',
  'pages/work-design-map.tsx',
  'pages/work-design-tools.tsx',
  'pages/policy-research.tsx',
  'pages/partnership.tsx',
  'pages/work-condition-window.tsx',
  'pages/projects/index.tsx',
  'pages/work-assessment-concept.tsx',
  'pages/events/index.tsx',
  'pages/events/work-condition-forum.tsx',
  'pages/events/work-condition-forum/text/[id].tsx',
  'pages/organizations/diagnosis.tsx',
  'pages/resources/songs/index.tsx',
  'components/falconLab/NextNblStaticSiteCandidate.tsx',
  'components/falconLab/NextNblPublicRoute.tsx',
  'lib/falconLab/nextNblPublicSiteFixtures.ts',
  'lib/falconLab/workConditionForum.ts',
  'public/images/next-nbl-work-design-hero-v1.webp',
  'public/images/work-condition-forum-virtual-city-hero-v1.webp',
];

const CONTACT_ROUTE_CHECKS = [
  'components/falconLab/NextNblStaticSiteCandidate.tsx',
  'pages/contact.tsx',
];

const EMAIL_CHECKS = ['pages/contact.tsx'];

function runCommand(step) {
  try {
    const output = execFileSync(step.command, step.args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return {
      ...step,
      status: 'passed',
      note: summarizeOutput(output),
    };
  } catch (error) {
    const stdout = typeof error.stdout === 'string' ? error.stdout : '';
    const stderr = typeof error.stderr === 'string' ? error.stderr : '';

    return {
      ...step,
      status: 'failed',
      note: summarizeOutput(`${stdout}\n${stderr}`),
    };
  }
}

function summarizeOutput(output) {
  const lines = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return 'no additional output';
  }

  return lines.slice(-4).join(' / ');
}

async function fileExists(filePath) {
  return readText(path.join(ROOT, filePath))
    .then((content) => content !== '')
    .catch(() => false);
}

async function emailCheck(filePath) {
  const content = await readText(path.join(ROOT, filePath));
  return content.includes(CONTACT_EMAIL);
}

async function routeCheck(filePath) {
  const content = await readText(path.join(ROOT, filePath));
  return content.includes(CONTACT_ROUTE);
}

async function main() {
  const today = formatTokyoDate();
  const reportPath = path.join(PATHS.publicReleasePreflightsDir, `${today}.md`);

  const commandResults = COMMANDS.map(runCommand);
  const failedCommand = commandResults.find((result) => result.status === 'failed');

  const fileResults = await Promise.all(
    FILE_CHECKS.map(async (filePath) => ({
      filePath,
      exists: await fileExists(filePath),
    })),
  );

  const contactRouteResults = await Promise.all(
    CONTACT_ROUTE_CHECKS.map(async (filePath) => ({
      filePath,
      hasRoute: await routeCheck(filePath),
    })),
  );

  const emailResults = await Promise.all(
    EMAIL_CHECKS.map(async (filePath) => ({
      filePath,
      hasEmail: await emailCheck(filePath),
    })),
  );

  const lines = [
    '# Public Release Preflight',
    '',
    `更新日: ${today}`,
    '',
    '## Scope',
    '',
    ...REPORT_ROUTES.map((route) => `- ${route}`),
    '',
    '## Command Results',
    '',
    ...commandResults.map(
      (result) => `- ${result.label}: ${result.status}${result.note ? ` (${result.note})` : ''}`,
    ),
    '',
    '## File Checks',
    '',
    ...fileResults.map(
      (result) => `- \`${result.filePath}\`: ${result.exists ? 'present' : 'missing'}`,
    ),
    '',
    '## Contact Checks',
    '',
    ...contactRouteResults.map(
      (result) =>
        `- \`${result.filePath}\`: ${result.hasRoute ? CONTACT_ROUTE : 'missing /contact link'}`,
    ),
    ...emailResults.map(
      (result) => `- \`${result.filePath}\`: ${result.hasEmail ? CONTACT_EMAIL : 'missing email'}`,
    ),
    '',
    '## Founder Boundary',
    '',
    failedCommand
      ? '- preflight failed: do not treat as release-ready until the failing check is resolved'
      : '- preflight passed: public surface is separated from review/internal routes and founder yes/no on release is the remaining boundary',
    '- public-release preflight is review evidence only, not founder release approval, merge approval, public-promise expansion, runtime/model adoption, or knowledge promotion',
    '- songs campaign lane remains internal and is not part of today’s public main lane',
    '',
  ];

  await writeText(reportPath, lines.join('\n'));
  process.stdout.write(`${reportPath}\n`);

  if (failedCommand) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
