import path from 'node:path';
import {
  PATHS,
  classifyWorkspaceActivity,
  daysSinceTokyoDate,
  formatTokyoDate,
  getGitStatusEntries,
  listMarkdownFiles,
  readContentInventory,
  readEntriesSection,
  readText,
  summarizePaths,
  writeText,
} from './shared.mjs';

const DATED_MARKDOWN_FILE = /^\d{4}-\d{2}-\d{2}\.md$/;

function toLoopStatus(count) {
  if (count > 0) {
    return 'moving';
  }

  return 'waiting';
}

function clipText(text, limit = 88) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '';
  }

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit - 1).trimEnd()}…`;
}

function ensureSentence(text) {
  if (!text) {
    return '';
  }

  return /[。.!?]$/.test(text) ? text : `${text}。`;
}

function extractSection(content, heading) {
  if (!content) {
    return '';
  }

  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`## ${escapedHeading}\\n+([\\s\\S]*?)(\\n## |\\n# |$)`));
  return match?.[1]?.trim() ?? '';
}

function extractSectionLines(content, heading) {
  return extractSection(content, heading)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractSectionBullets(content, heading) {
  return extractSectionLines(content, heading)
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim());
}

function firstSectionBullet(content, heading, fallback = '') {
  return extractSectionBullets(content, heading)[0] ?? fallback;
}

function hasFounderAction(lines) {
  return lines.some((line) => {
    const normalized = line.toLowerCase();
    return normalized !== 'none' && normalized !== 'no founder action needed';
  });
}

async function loadLatestMemo(dirPath) {
  const files = (await listMarkdownFiles(dirPath))
    .filter((name) => DATED_MARKDOWN_FILE.test(name))
    .sort();

  if (files.length === 0) {
    return null;
  }

  const name = files[files.length - 1];
  const content = await readText(path.join(dirPath, name));

  return {
    name,
    content,
  };
}

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

function getRevivalScore(row) {
  const decision = row['Decision'] ?? '';
  const reason = row['Reason'] ?? '';
  const neededAction = row['Needed action'] ?? '';
  let score = 0;

  if (decision.includes('public_after_rewrite')) {
    score += 4;
  }

  if (decision.includes('hold')) {
    score += 3;
  }

  if (neededAction) {
    score += 2;
  }

  if (reason.includes('重要') || reason.includes('強い') || reason.includes('有望')) {
    score += 1;
  }

  if ((row['Owner'] ?? '').includes('Chief of Staff')) {
    score += 1;
  }

  return score;
}

function selectRevivalCandidates(rows, limit = 3) {
  return rows
    .filter((row) => (row['Path or topic'] ?? '').trim() && isRevivalRow(row))
    .map((row) => ({
      row,
      score: getRevivalScore(row),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (left.row['Path or topic'] ?? '').localeCompare(right.row['Path or topic'] ?? '', 'ja');
    })
    .slice(0, limit)
    .map((entry) => entry.row);
}

function formatRevivalCandidate(row) {
  const topic = row['Path or topic'] ?? 'Untitled';
  const reason = clipText(row['Reason'] ?? '', 80);
  const neededAction = clipText(row['Needed action'] ?? '', 80);
  const decision = row['Decision'] ?? '';
  const whyNow = reason || 'inventory 上で再評価の必要が残っている。';
  const nextArtifact = neededAction || 'hidden review draft を 1 本起こして、公開境界の前まで形にする。';
  const founderBoundary = decision.includes('public_after_rewrite')
    ? 'public candidate に上げる時点で Yes / No / Adjust が必要。'
    : 'hidden review draft を作る段階までは不要。public promise に触れる時点で判断する。';

  return `- ${topic}: ${ensureSentence(whyNow)} 次の最小成果物は ${ensureSentence(nextArtifact)} Founder 判断は ${founderBoundary}`;
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
  const contentInventory = await readContentInventory();
  const inventoryAge = daysSinceTokyoDate(contentInventory.updatedAt, today);
  const holdRevivalCandidates = selectRevivalCandidates(contentInventory.rows);
  const latestExternalMemo = await loadLatestMemo(PATHS.externalSignalDigestsDir);
  const latestPartnerMemo = await loadLatestMemo(PATHS.partnerDiscoveryLoopsDir);

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
    `- Chief of Staff Loop: ${toLoopStatus(chiefOfStaffCount)}。ops docs と Founder input の受付面は稼働している。`,
    `- Public Narrative Loop: ${toLoopStatus(publicNarrativeCount)}。主な更新は ${summarizePaths(grouped.find((group) => group.key === 'publicNarrative')?.matchingPaths ?? [])}。`,
    `- Business Validation Loop: ${toLoopStatus(businessValidationCount)}。named candidate 進行より前の基盤が中心。`,
    `- Knowledge And Method Loop: ${toLoopStatus(knowledgeMethodCount)}。素材・JAC・resources 側は${knowledgeMethodCount > 0 ? '動いている' : '今週は静か'}。`,
    `- Next Horizon Loop: ${toLoopStatus(nextHorizonCount)}。Horizon 2 は必要時に進める待機姿勢。`,
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

  if (holdRevivalCandidates.length > 0) {
    compoundingSignals.push(
      '- `hold` を放置棚ではなく再起動キューとして扱えるようになり、weekly から hidden review draft 候補を起こせる状態に近づいた。',
    );
  }

  const externalRealityInterface = latestExternalMemo
    ? [
        `- latest digest: \`${latestExternalMemo.name}\`。 strongest structural signal は ${ensureSentence(clipText(firstSectionBullet(latestExternalMemo.content, 'What Seems Structural', '外部 signal の構造変化はまだ要約されていない'), 92))}`,
        `- next validation move: ${ensureSentence(clipText(firstSectionBullet(latestExternalMemo.content, 'Next Validation Move', '次の検証 move はまだ明示されていない'), 92))}`,
      ]
    : ['- external signal digest がまだない。外部現実の監視面が空白なので、weekly synthesis の解像度が落ちる。'];

  const partnerDiscoveryStatus = latestPartnerMemo
    ? [
        `- latest loop: \`${latestPartnerMemo.name}\`。 next outreach-ready lane は ${ensureSentence(clipText(firstSectionBullet(latestPartnerMemo.content, 'Next Outreach-Ready Candidate', '次の候補 lane はまだ明示されていない'), 92))}`,
        `- fit / drift indicator: ${ensureSentence(clipText(firstSectionBullet(latestPartnerMemo.content, 'Fit Or Drift Indicators', 'fit / drift indicator はまだ整理されていない'), 92))}`,
      ]
    : ['- partner discovery loop がまだない。named / anonymous lane の比較と priority が弱くなる。'];

  const risksAndDrifts = [
    '- daily / weekly automation が動いていても、primary workspace に成果物が見えなければ silent failure に気づきにくい。',
    '- business / partner 側は named candidate を入れるまでは waiting が混じる。',
  ];

  if (inventoryAge !== null && inventoryAge >= 7) {
    risksAndDrifts.push(
      `- \`content-inventory.md\` の更新日が \`${contentInventory.updatedAt}\` のままで ${inventoryAge} 日経過している。hold 棚の再評価が stale になっていないか weekly で確認が必要。`,
    );
  }

  const holdRevivalSection =
    holdRevivalCandidates.length > 0
      ? holdRevivalCandidates.map((row) => formatRevivalCandidate(row))
      : ['- 今週は再起動候補を新しく上げる段階ではない。'];

  const founderDecisionQueue = [];
  const externalFounderBoundary = latestExternalMemo
    ? extractSectionBullets(latestExternalMemo.content, 'Founder Boundary')
    : [];
  const partnerFounderBoundary = latestPartnerMemo
    ? extractSectionBullets(latestPartnerMemo.content, 'Founder Boundary')
    : [];

  if (hasFounderAction(externalFounderBoundary)) {
    founderDecisionQueue.push(
      `- Decision: employer-facing wording audit を今週の固定タスクに入れるか。 Recommended: Yes。 Why now: ${ensureSentence(clipText(firstSectionBullet(latestExternalMemo?.content ?? '', 'Next Validation Move', externalFounderBoundary[0] ?? '外部 signal に public framing の見直し余地が出ている'), 84))} Default if no reply: AI は内部監査メモと修正候補の比較表まで進め、public promise の変更は保留する。`,
    );
  }

  if (hasFounderAction(partnerFounderBoundary)) {
    founderDecisionQueue.push(
      `- Decision: 次の real-name outreach を今週進めるか。 Recommended: Adjust。 Why now: ${ensureSentence(clipText(partnerFounderBoundary[0] ?? 'partner discovery 側で Founder 境界が発生している', 84))} Default if no reply: AI は匿名 lane の条件整理と候補比較まで進め、実名 contact は保留する。`,
    );
  }

  if (founderDecisionQueue.length === 0) {
    founderDecisionQueue.push('- no founder action needed');
  }

  const founderReplyFormat =
    founderDecisionQueue.length === 1 && founderDecisionQueue[0] === '- no founder action needed'
      ? ['- no reply needed this week']
      : founderDecisionQueue.map((_, index) => `- ${index + 1}. Yes / No / Adjust: ...`);

  const aiAutonomousMoves = [];

  if (holdRevivalCandidates.length > 0) {
    aiAutonomousMoves.push(
      '- hold 棚から 1 件だけ hidden review draft 候補を起こし、public promise の手前まで AI 側で整える。',
    );
  }

  if (latestExternalMemo) {
    aiAutonomousMoves.push(
      `- external digest \`${latestExternalMemo.name}\` を基準に、function-first wording と evidence boundary の内部監査を進める。`,
    );
  }

  if (latestPartnerMemo) {
    aiAutonomousMoves.push(
      `- partner loop \`${latestPartnerMemo.name}\` を基準に、A1 / A2 の target-condition を sharpen し、実名 invent はしない。`,
    );
  }

  if (aiAutonomousMoves.length === 0) {
    aiAutonomousMoves.push(
      '- 次レビューまでの下準備、比較表、hidden review draft の起案は AI 側で先に進める。',
    );
  }

  const next7Days = [
    '- `ops:snapshot:daily` の出力が main workspace に見えているかを毎回確認する。',
    '- `ops:snapshot:weekly` を基準に、Founder が見る weekly red-signal 面を安定させる。',
    '- 自走ループの目的を見失わず、relaunch public candidate と operating layer を接続し続ける。',
  ];

  if (holdRevivalCandidates.length > 0) {
    next7Days[0] =
      '- hold 棚から 1 件だけ hidden review draft 候補を起こし、public 境界に触れる前まで AI 側で整える。';
  }

  const content = `# Weekly Loop Report ${today}

## Loop-By-Loop Status

${loopStatuses.join('\n')}

## External Reality Interface

${externalRealityInterface.join('\n')}

## Partner Discovery Status

${partnerDiscoveryStatus.join('\n')}

## Artifacts Created

${artifactsCreated.join('\n')}

## Compounding Signals

${compoundingSignals.join('\n')}

## Risks And Drifts

${risksAndDrifts.join('\n')}

## Hold Revival Candidates

${holdRevivalSection.join('\n')}

## Founder Decision Queue

${founderDecisionQueue.join('\n')}

## Founder Reply Format

${founderReplyFormat.join('\n')}

## AI Autonomous Moves Before Next Review

${aiAutonomousMoves.join('\n')}

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
