import path from 'node:path';
import {
  PATHS,
  classifyWorkspaceActivity,
  formatTokyoDate,
  getGitStatusEntries,
  listMarkdownFiles,
  readEntriesSection,
  summarizePaths,
  writeText,
} from './shared.mjs';

function toLoopStatus(label, count) {
  if (count > 0) {
    return 'moving';
  }

  return 'waiting';
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(PATHS.weeklyLoopReportsDir, `${today}.md`);
  const gitEntries = getGitStatusEntries();
  const changedPaths = gitEntries.map((entry) => entry.filePath);
  const grouped = classifyWorkspaceActivity(changedPaths);
  const dailySnapshots = await listMarkdownFiles(PATHS.dailySnapshotsDir);
  const datedDailySnapshots = dailySnapshots.filter((name) => /^\d{4}-\d{2}-\d{2}\.md$/.test(name));
  const founderNewContent = await readEntriesSection(PATHS.founderNewContentLog);
  const founderSiteFeedback = await readEntriesSection(PATHS.founderSiteFeedbackLog);

  const chiefOfStaffCount =
    (grouped.find((group) => group.key === 'ops')?.count ?? 0) +
    (founderNewContent.length > 0 ? 1 : 0) +
    (founderSiteFeedback.length > 0 ? 1 : 0);
  const publicNarrativeCount = grouped.find((group) => group.key === 'publicNarrative')?.count ?? 0;
  const businessValidationCount =
    grouped.find((group) => group.key === 'businessValidation')?.count ?? 0;
  const knowledgeMethodCount = grouped.find((group) => group.key === 'knowledgeMethod')?.count ?? 0;
  const nextHorizonCount = grouped.find((group) => group.key === 'nextHorizon')?.count ?? 0;

  const loopStatuses = [
    `- Chief of Staff Loop: ${toLoopStatus('Chief of Staff Loop', chiefOfStaffCount)}。ops docs と Founder input の受付面は稼働している。`,
    `- Public Narrative Loop: ${toLoopStatus('Public Narrative Loop', publicNarrativeCount)}。主な更新は ${summarizePaths(grouped.find((group) => group.key === 'publicNarrative')?.matchingPaths ?? [])}。`,
    `- Business Validation Loop: ${toLoopStatus('Business Validation Loop', businessValidationCount)}。named candidate 進行より前の基盤が中心。`,
    `- Knowledge And Method Loop: ${toLoopStatus('Knowledge And Method Loop', knowledgeMethodCount)}。素材・JAC・resources 側は ${knowledgeMethodCount > 0 ? '動いている' : '今週は静か'}。`,
    `- Next Horizon Loop: ${toLoopStatus('Next Horizon Loop', nextHorizonCount)}。Horizon 2 は必要時に進める待機姿勢。`,
  ];

  const artifactsCreated = [
    '- recurring ops 用の template 一式',
    '- `snapshot-automation` hidden review page',
    '- Founder input と ops output をつなぐ operating docs',
  ];

  if (datedDailySnapshots.length > 0) {
    artifactsCreated.push(
      `- daily snapshot file: \`${datedDailySnapshots.sort().slice(-1)[0]}\``,
    );
  }

  const compoundingSignals = [
    '- recurring artifacts が増え、daily / weekly / monthly の output path が固定された。',
    '- Founder の役割が `daily operator` から `weekly red-signal reviewer` へ寄った。',
    '- public relaunch と operating layer が同じ review index でつながった。',
  ];

  const risksAndDrifts = [
    '- daily / weekly automation が動いていても、primary workspace に成果物が見えなければ silent failure に気づきにくい。',
    '- business / partner 側は named candidate を入れるまでは waiting が混じる。',
  ];

  const founderBoundary = ['- no founder action needed'];

  const next7Days = [
    '- `ops:snapshot:daily` の出力が main workspace に見えているかを毎回確認する。',
    '- `ops:snapshot:weekly` を基準に、Founder が見る weekly red-signal 面を安定させる。',
    '- 自走ループの目的を見失わず、relaunch public candidate と operating layer を接続し続ける。',
  ];

  const content = `# Weekly Loop Report ${today}

## Loop-By-Loop Status

${loopStatuses.join('\n')}

## Artifacts Created

${artifactsCreated.join('\n')}

## Compounding Signals

${compoundingSignals.join('\n')}

## Risks And Drifts

${risksAndDrifts.join('\n')}

## Founder Boundary This Week

${founderBoundary.join('\n')}

## Next 7 Days

${next7Days.join('\n')}
`;

  await writeText(outputPath, content);
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
