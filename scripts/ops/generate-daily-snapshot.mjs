import path from 'node:path';
import {
  EXECUTION_ROOT,
  PATHS,
  ROOT,
  classifyWorkspaceActivity,
  formatTokyoDate,
  getGitStatusEntries,
  getNewFilePaths,
  readEntriesSection,
  summarizePaths,
  writeText,
} from './shared.mjs';

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(PATHS.dailySnapshotsDir, `${today}.md`);
  const gitEntries = getGitStatusEntries();
  const changedPaths = gitEntries.map((entry) => entry.filePath);
  const newPaths = getNewFilePaths(gitEntries);
  const grouped = classifyWorkspaceActivity(changedPaths);
  const founderNewContent = await readEntriesSection(PATHS.founderNewContentLog);
  const founderSiteFeedback = await readEntriesSection(PATHS.founderSiteFeedbackLog);

  const changedBullets = grouped
    .filter((group) => group.count > 0)
    .slice(0, 4)
    .map(
      (group) =>
        `- ${group.label}: ${group.count} 件の更新。主な対象は ${summarizePaths(group.matchingPaths)}。`,
    );

  if (founderNewContent.length > 0) {
    changedBullets.push(`- Founder new content input: ${founderNewContent.length} 件の structured entry。`);
  }

  if (founderSiteFeedback.length > 0) {
    changedBullets.push(`- Founder site feedback: ${founderSiteFeedback.length} 件の structured entry。`);
  }

  if (changedBullets.length === 0) {
    changedBullets.push('- 目立つ workspace 変更は検出されなかった。');
  }

  const accumulatedBullets = [];

  if (newPaths.length > 0) {
    accumulatedBullets.push(`- 新しい reusable artifact 候補: ${summarizePaths(newPaths)}。`);
  }

  const opsPaths = grouped.find((group) => group.key === 'ops')?.matchingPaths ?? [];
  if (opsPaths.length > 0) {
    accumulatedBullets.push(
      `- Operating layer の部品が増えた: ${summarizePaths(opsPaths)}。`,
    );
  }

  if (accumulatedBullets.length === 0) {
    accumulatedBullets.push('- 新しい reusable artifact はこの snapshot では明確に検出されなかった。');
  }

  const blockedBullets = [];

  if (ROOT !== EXECUTION_ROOT) {
    blockedBullets.push(
      `- automation は linked worktree から起動されても、primary workspace \`${ROOT}\` を正本として読む・書く必要がある。`,
    );
  }

  blockedBullets.push(
    '- daily automation は動いていても、main workspace に当日の snapshot が見えなければ運用上は failure と同じ。',
  );
  blockedBullets.push(
    '- 可視化を弱くすると、silent failure や worktree drift に気づきにくい。',
  );

  const nextBestRound =
    '- Automation Visibility Hardening: primary workspace を正本に固定し、`today file exists` と `weekly red-signal view` を最低監視線にする。';

  const founderBoundaryLines = [];
  if (founderNewContent.length > 0 || founderSiteFeedback.length > 0) {
    founderBoundaryLines.push(
      '- structured founder input は入っているが、この snapshot では不可逆判断を要する赤信号は検出されなかった。',
    );
  } else {
    founderBoundaryLines.push('- none');
  }

  const evidencePointers = [
    `- \`docs/nbl-workspace/snapshot-automation-design-2026-03-17.md\``,
    `- \`scripts/ops/shared.mjs\``,
    `- \`pages/review/snapshot-automation.tsx\``,
    `- \`lib/content/snapshotAutomationReview.ts\``,
    `- \`docs/nbl-workspace/decision-log.md\``,
  ];

  const content = `# Daily Snapshot ${today}

## What Changed

${changedBullets.join('\n')}

## What Accumulated

${accumulatedBullets.join('\n')}

## Blocked Or Drifting

${blockedBullets.join('\n')}

## Next Best Round

${nextBestRound}

## Founder Boundary

${founderBoundaryLines.join('\n')}

## Evidence Pointers

${evidencePointers.join('\n')}
`;

  await writeText(outputPath, content);
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
