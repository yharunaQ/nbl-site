import path from 'node:path';
import {
  EXECUTION_ROOT,
  PATHS,
  ROOT,
  classifyWorkspaceActivity,
  daysSinceTokyoDate,
  formatTokyoDate,
  getGitStatusEntries,
  getNewFilePaths,
  readContentInventory,
  readEntriesSection,
  summarizePaths,
  writeText,
} from './shared.mjs';

function isRevivalRow(row) {
  const decision = (row['Decision'] ?? '').toLowerCase();
  const reason = (row['Reason'] ?? '').toLowerCase();

  return (
    decision.includes('hold') ||
    decision.includes('public_after_rewrite') ||
    reason.includes('hold') ||
    reason.includes('public_after_rewrite')
  );
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(PATHS.dailySnapshotsDir, `${today}.md`);
  const gitEntries = getGitStatusEntries();
  const changedPaths = gitEntries.map((entry) => entry.filePath);
  const newPaths = getNewFilePaths(gitEntries);
  const grouped = classifyWorkspaceActivity(changedPaths);
  const founderNewContent = await readEntriesSection(PATHS.founderNewContentLog);
  const founderSiteFeedback = await readEntriesSection(PATHS.founderSiteFeedbackLog);
  const contentInventory = await readContentInventory();
  const revivalRows = contentInventory.rows.filter(isRevivalRow);

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

  const holdSignals = [];
  const inventoryAge = daysSinceTokyoDate(contentInventory.updatedAt, today);

  if (revivalRows.length > 0) {
    holdSignals.push(
      `- content inventory 上に hold / public_after_rewrite 系の候補が ${revivalRows.length} 件ある。weekly ではこの棚から 1-3 件を再起動候補として選ぶ前提にする。`,
    );
  }

  if (inventoryAge !== null && inventoryAge >= 7) {
    holdSignals.push(
      `- \`content-inventory.md\` の更新日が \`${contentInventory.updatedAt}\` のままで ${inventoryAge} 日経過している。保留棚の再評価が stale になっていないか確認が必要。`,
    );
  }

  if (founderNewContent.length > 0 || founderSiteFeedback.length > 0) {
    holdSignals.push(
      '- Founder input が追加されているため、保留棚に接続する再評価候補が増えている可能性がある。weekly で hold revival candidate に反映する。',
    );
  }

  if (holdSignals.length === 0) {
    holdSignals.push('- 今回の snapshot で、保留棚を動かし直す新しい signal は明確に検出されなかった。');
  }

  const nextBestRound =
    revivalRows.length > 0
      ? '- Hold Revival Queue: inventory 上の hold / public_after_rewrite 棚から 1 件だけ hidden review draft 候補を起こし、Founder 境界に触れる前まで進める。'
      : '- Automation Visibility Hardening: primary workspace を正本に固定し、`today file exists` と `weekly red-signal view` を最低監視線にする。';

  const founderBoundaryLines = [];
  if (founderNewContent.length > 0 || founderSiteFeedback.length > 0) {
    founderBoundaryLines.push(
      '- structured founder input は入っているが、この snapshot では不可逆判断を要する赤信号は検出されなかった。hold 候補の hidden review draft 化までは Founder 判断なしで進められる。',
    );
  } else {
    founderBoundaryLines.push('- none');
  }

  const aiAutonomousMoves = [];

  if (revivalRows.length > 0) {
    aiAutonomousMoves.push(
      '- hold 棚から 1 件だけ hidden review draft 候補を起こし、public candidate に触れる手前まで AI 側で整える。',
    );
  }

  if (opsPaths.length > 0) {
    aiAutonomousMoves.push(
      '- primary workspace 正本チェックと recurring artifact の見える化を継続し、silent failure を減らす。',
    );
  }

  const publicNarrativePaths =
    grouped.find((group) => group.key === 'publicNarrative')?.matchingPaths ?? [];
  if (publicNarrativePaths.length > 0) {
    aiAutonomousMoves.push(
      '- public narrative の更新は AI 側で整理を続け、Founder には public promise 境界だけを返す。',
    );
  }

  if (aiAutonomousMoves.length === 0) {
    aiAutonomousMoves.push(
      '- 次の round の下準備、比較表づくり、hidden review draft 化は AI 側で先に進める。',
    );
  }

  const evidencePointers = [
    `- \`docs/nbl-workspace/content-inventory.md\``,
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

## Hold Signals

${holdSignals.join('\n')}

## Next Best Round

${nextBestRound}

## AI Autonomous Moves Today

${aiAutonomousMoves.join('\n')}

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
