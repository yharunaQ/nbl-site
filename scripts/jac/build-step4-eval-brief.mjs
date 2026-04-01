#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const TEST_FILE = '__tests__/jac-step4-reference-evals.test.ts';
const CASE_FILE = path.join(ROOT, 'references', 'jac', 'eval', 'step4-representative-cases.json');
const SOURCES_PATH = path.join(ROOT, 'config', 'knowledge-sources.json');
const CLAIMS_PATH = path.join(ROOT, 'references', 'index', 'knowledge-claims.jsonl');
const STEP4_FIELD_REVIEW_SUMMARY_PATH = path.join(
  ROOT,
  'references',
  'jac',
  'step4-field-review-summary.json',
);
const OUTPUT_DIR = path.join(ROOT, 'docs', 'nbl-workspace', 'ops', 'jac-step4-evals');
const SUMMARY_PATH = path.join(ROOT, 'references', 'jac', 'step4-eval-summary.json');
const ENFORCE = process.argv.includes('--enforce');

const STEP4_PHASE_CRITERIA = {
  relatedReadingTarget: 80,
  maxHotspotTarget: 30,
  duplicateSameSourceStatementTarget: 0,
};

function formatTokyoDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function readJsonl(filePath, fallback = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return fallback;
  }
}

function summarizeAssertions(jestJson) {
  const assertions = (jestJson.testResults || []).flatMap((suite) => suite.assertionResults || []);
  const representativeCases = assertions
    .filter((row) => String(row.title || '').startsWith('case: '))
    .map((row) => ({
      title: String(row.title || '').replace(/^case:\s*/, ''),
      status: row.status || 'unknown',
      duration_ms: Number(row.duration || 0),
      failure_summary: Array.isArray(row.failureMessages) && row.failureMessages.length > 0
        ? String(row.failureMessages[0] || '').split('\n')[0]
        : null,
    }));

  const audits = assertions
    .filter((row) => String(row.title || '').startsWith('artifact: '))
    .map((row) => ({
      title: String(row.title || '').replace(/^artifact:\s*/, ''),
      status: row.status || 'unknown',
      duration_ms: Number(row.duration || 0),
      failure_summary: Array.isArray(row.failureMessages) && row.failureMessages.length > 0
        ? String(row.failureMessages[0] || '').split('\n')[0]
        : null,
    }));

  return {
    totalTests: Number(jestJson.numTotalTests || assertions.length || 0),
    passedTests: Number(jestJson.numPassedTests || 0),
    failedTests: Number(jestJson.numFailedTests || 0),
    representativeCases,
    audits,
  };
}

function collectRelatedReadingSnapshot(claims, sourceConfig) {
  const sourceNameById = new Map(
    (Array.isArray(sourceConfig) ? sourceConfig : []).map((source) => [source.id, source.name]),
  );
  const relatedClaims = (Array.isArray(claims) ? claims : []).filter(
    (claim) => claim?.provenance?.evidenceRole === 'related_reading',
  );
  const bySource = new Map();
  const duplicateBuckets = new Map();

  for (const claim of relatedClaims) {
    const statement = String(claim?.statement || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!statement) continue;

    for (const sourceId of Array.isArray(claim?.sourceIds) ? claim.sourceIds : []) {
      const normalizedSourceId = String(sourceId || '').trim();
      if (!normalizedSourceId) continue;
      bySource.set(normalizedSourceId, (bySource.get(normalizedSourceId) || 0) + 1);
      const duplicateKey = `${normalizedSourceId}|||${statement}`;
      duplicateBuckets.set(duplicateKey, (duplicateBuckets.get(duplicateKey) || 0) + 1);
    }
  }

  const hotspots = [...bySource.entries()]
    .map(([sourceId, count]) => ({
      sourceId,
      sourceName: sourceNameById.get(sourceId) || sourceId,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const duplicateGroups = [...duplicateBuckets.entries()]
    .filter(([, count]) => count > 1)
    .map(([key, count]) => {
      const [sourceId, statement] = key.split('|||');
      return {
        sourceId,
        sourceName: sourceNameById.get(sourceId) || sourceId,
        statement,
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    relatedReadingCount: relatedClaims.length,
    relatedReadingHotspots: hotspots,
    duplicateSameSourceStatementCount: duplicateGroups.length,
    duplicateSameSourceStatementGroups: duplicateGroups,
  };
}

function buildCaseSourceIndex(caseDefs) {
  const index = new Map();

  for (const caseDef of Array.isArray(caseDefs) ? caseDefs : []) {
    const title = String(caseDef?.title || caseDef?.id || '').trim();
    for (const sourceId of Array.isArray(caseDef?.enabledSourceIds) ? caseDef.enabledSourceIds : []) {
      const normalizedSourceId = String(sourceId || '').trim();
      if (!normalizedSourceId) continue;
      const current = index.get(normalizedSourceId) || { impactCaseCount: 0, impactCaseTitles: [] };
      current.impactCaseCount += 1;
      if (title && !current.impactCaseTitles.includes(title)) {
        current.impactCaseTitles.push(title);
      }
      index.set(normalizedSourceId, current);
    }
  }

  return index;
}

function buildFieldReviewSourceIndex(fieldReviewSummary) {
  const summary = fieldReviewSummary && typeof fieldReviewSummary === 'object' ? fieldReviewSummary : {};
  const hotspotCounts = new Map();
  const unresolvedCounts = new Map();
  const unresolvedCaseIds = new Map();

  for (const item of Array.isArray(summary.sourceHotspots) ? summary.sourceHotspots : []) {
    const sourceId = String(item?.sourceId || '').trim();
    if (!sourceId) continue;
    hotspotCounts.set(sourceId, Number(item?.count || 0));
  }

  for (const item of Array.isArray(summary.unresolvedCases) ? summary.unresolvedCases : []) {
    const caseId = String(item?.caseId || '').trim();
    for (const sourceId of Array.isArray(item?.sourceHotspots) ? item.sourceHotspots : []) {
      const normalizedSourceId = String(sourceId || '').trim();
      if (!normalizedSourceId) continue;
      unresolvedCounts.set(normalizedSourceId, (unresolvedCounts.get(normalizedSourceId) || 0) + 1);
      const cases = unresolvedCaseIds.get(normalizedSourceId) || [];
      if (caseId && !cases.includes(caseId)) {
        cases.push(caseId);
      }
      unresolvedCaseIds.set(normalizedSourceId, cases);
    }
  }

  return {
    reviewCount: Number(summary.reviewCount || 0),
    hotspotCounts,
    unresolvedCounts,
    unresolvedCaseIds,
    unresolvedCaseCount: Array.isArray(summary.unresolvedCases) ? summary.unresolvedCases.length : 0,
    needsRevisionCount: Number(summary?.verdictCounts?.needs_revision || 0),
    mixedCount: Number(summary?.verdictCounts?.mixed || 0),
    weakThemes: Array.isArray(summary.weakThemes) ? summary.weakThemes : [],
  };
}

function sourceActionTemplate(sourceId) {
  switch (String(sourceId || '').trim()) {
    case 'canada_duty_to_accommodate':
      return {
        actionType: 'tighten_dialogue_review_lane',
        why: '対話・見直しに有用だが、HR 相談や制度一般論が残りやすい。',
        suggestedAction: 'HR specialist / recourse / program-design line を抑え、dialogue / review line を優先する。',
      };
    case 'australia_jobaccess_guidance':
      return {
        actionType: 'tighten_trial_lane',
        why: '試行候補に強いが、save/navigation/template boilerplate が再混入しやすい。',
        suggestedAction: 'schedule / task / physical adjustment を残し、save / event / template line は文脈つき表示に寄せる。',
      };
    case 'askearn_employer_guidance':
      return {
        actionType: 'demote_org_generality',
        why: '組織運用や雇用一般論が混ざりやすく、相談直結の具体策が埋もれやすい。',
        suggestedAction: 'newsletter / legal-risk / org-program line を落とし、場面別の具体 adjustment line を優先する。',
      };
    case 'eu_reasonable_accommodation':
      return {
        actionType: 'keep_case_usable_measures_only',
        why: '制度比較の軸として有用だが、一般論や employer-benefit line が残りやすい。',
        suggestedAction: 'measure / concrete example を残し、systemic/general benefit line は related_reading から外す。',
      };
    case 'uk_gov_disability_employment':
      return {
        actionType: 'keep_adjustment_examples_only',
        why: 'administrative flow と eligibility 説明が practical lane を汚しやすい。',
        suggestedAction: 'adjustment example 以外の apply / claim / eligibility line は出さない。',
      };
    default:
      return {
        actionType: 'review_source_family_rules',
        why: 'hotspot source として残っているため、source-family rule の再点検価値がある。',
        suggestedAction: 'representative case と照合し、generality と practical line の境界を見直す。',
      };
  }
}

function buildSourceActionQueue(hotspots, caseDefs, fieldReviewSummary) {
  const caseSourceIndex = buildCaseSourceIndex(caseDefs);
  const fieldReviewIndex = buildFieldReviewSourceIndex(fieldReviewSummary);
  const sourceNameById = new Map();
  const relatedCountBySource = new Map();

  for (const item of Array.isArray(hotspots) ? hotspots : []) {
    const sourceId = String(item?.sourceId || '').trim();
    if (!sourceId) continue;
    sourceNameById.set(sourceId, item?.sourceName || sourceId);
    relatedCountBySource.set(sourceId, Number(item?.count || 0));
  }

  for (const [sourceId] of fieldReviewIndex.hotspotCounts.entries()) {
    if (!sourceNameById.has(sourceId)) {
      sourceNameById.set(sourceId, sourceId);
    }
  }

  return [...sourceNameById.keys()]
    .map((sourceId) => {
      const caseImpact = caseSourceIndex.get(sourceId) || { impactCaseCount: 0, impactCaseTitles: [] };
      const template = sourceActionTemplate(sourceId);
      const relatedReadingCount = Number(relatedCountBySource.get(sourceId) || 0);
      const fieldReviewCount = Number(fieldReviewIndex.hotspotCounts.get(sourceId) || 0);
      const unresolvedFieldCaseCount = Number(fieldReviewIndex.unresolvedCounts.get(sourceId) || 0);
      const unresolvedFieldCaseIds = (fieldReviewIndex.unresolvedCaseIds.get(sourceId) || []).slice(0, 5);
      const priorityScore =
        unresolvedFieldCaseCount * 100 + fieldReviewCount * 20 + caseImpact.impactCaseCount * 10 + relatedReadingCount;

      return {
        sourceId,
        sourceName: sourceNameById.get(sourceId) || sourceId,
        count: relatedReadingCount,
        fieldReviewCount,
        unresolvedFieldCaseCount,
        unresolvedFieldCaseIds,
        impactCaseCount: caseImpact.impactCaseCount,
        impactCaseTitles: caseImpact.impactCaseTitles.slice(0, 5),
        priorityScore,
        ...template,
      };
    })
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      if (b.unresolvedFieldCaseCount !== a.unresolvedFieldCaseCount) {
        return b.unresolvedFieldCaseCount - a.unresolvedFieldCaseCount;
      }
      if (b.fieldReviewCount !== a.fieldReviewCount) return b.fieldReviewCount - a.fieldReviewCount;
      return b.count - a.count;
    })
    .slice(0, 8);
}

function buildFounderBoundary(summary, sourceActionQueue, fieldReviewSummary) {
  const boundary = [];
  const fieldReviewIndex = buildFieldReviewSourceIndex(fieldReviewSummary);

  if (Number(summary?.failedTests || 0) > 0) {
    boundary.push(
      'representative case または artifact audit が失敗したため、Step 4 の public presentation 境界を founder と再確認する。',
    );
  }

  const unstableHighImpactSource = (Array.isArray(sourceActionQueue) ? sourceActionQueue : []).find(
    (item) => Number(item?.count || 0) >= 30 && Number(item?.impactCaseCount || 0) >= 3,
  );
  if (Number(summary?.failedTests || 0) > 0 && unstableHighImpactSource) {
    boundary.push(
      `${unstableHighImpactSource.sourceName} は複数代表ケースに影響するため、public Step 4 に残す source lane の境界判断が必要。`,
    );
  }

  const fieldReviewCriticalSource = (Array.isArray(sourceActionQueue) ? sourceActionQueue : []).find(
    (item) => Number(item?.unresolvedFieldCaseCount || 0) >= 2 && Number(item?.impactCaseCount || 0) >= 2,
  );
  if (
    fieldReviewIndex.reviewCount > 0 &&
    fieldReviewIndex.needsRevisionCount > 0 &&
    fieldReviewCriticalSource
  ) {
    boundary.push(
      `${fieldReviewCriticalSource.sourceName} は実ケースでも繰り返し弱さが出ているため、Step 4 にどこまで残すかの境界を founder と確認する。`,
    );
  }

  return boundary;
}

function evaluateStep4PhaseGate(summary, relatedReadingSnapshot, founderBoundary, fieldReviewSummary) {
  const failedTests = Number(summary?.failedTests || 0);
  const failedRepresentativeCases = Array.isArray(summary?.representativeCases)
    ? summary.representativeCases.filter((item) => item.status !== 'passed').length
    : 0;
  const failedAudits = Array.isArray(summary?.audits)
    ? summary.audits.filter((item) => item.status !== 'passed').length
    : 0;
  const relatedReadingCount = Number(relatedReadingSnapshot?.relatedReadingCount || 0);
  const duplicateSameSourceStatementCount = Number(
    relatedReadingSnapshot?.duplicateSameSourceStatementCount || 0,
  );
  const topHotspotCount = Number(relatedReadingSnapshot?.relatedReadingHotspots?.[0]?.count || 0);
  const founderBoundaryCount = Array.isArray(founderBoundary) ? founderBoundary.length : 0;
  const fieldReviewIndex = buildFieldReviewSourceIndex(fieldReviewSummary);
  const fieldReviewActive = fieldReviewIndex.reviewCount > 0;

  const checks = [
    {
      key: 'representative_cases_green',
      label: 'representative cases are all passing',
      passed: failedRepresentativeCases === 0,
      actual: failedRepresentativeCases,
      target: 0,
    },
    {
      key: 'artifact_audits_green',
      label: 'artifact audits are all passing',
      passed: failedAudits === 0,
      actual: failedAudits,
      target: 0,
    },
    {
      key: 'related_reading_under_target',
      label: 'related_reading count is below the cleanup target',
      passed: relatedReadingCount <= STEP4_PHASE_CRITERIA.relatedReadingTarget,
      actual: relatedReadingCount,
      target: STEP4_PHASE_CRITERIA.relatedReadingTarget,
    },
    {
      key: 'top_hotspot_under_target',
      label: 'top hotspot source is below the concentration target',
      passed: topHotspotCount <= STEP4_PHASE_CRITERIA.maxHotspotTarget,
      actual: topHotspotCount,
      target: STEP4_PHASE_CRITERIA.maxHotspotTarget,
    },
    {
      key: 'duplicates_cleared',
      label: 'same-source duplicate statements are cleared',
      passed:
        duplicateSameSourceStatementCount <= STEP4_PHASE_CRITERIA.duplicateSameSourceStatementTarget,
      actual: duplicateSameSourceStatementCount,
      target: STEP4_PHASE_CRITERIA.duplicateSameSourceStatementTarget,
    },
    {
      key: 'founder_boundary_clear',
      label: 'founder boundary is clear',
      passed: founderBoundaryCount === 0,
      actual: founderBoundaryCount,
      target: 0,
    },
  ];

  if (fieldReviewActive) {
    checks.push({
      key: 'field_review_clear',
      label: 'field reviews do not show unresolved real-case issues',
      passed: fieldReviewIndex.unresolvedCaseCount === 0,
      actual: fieldReviewIndex.unresolvedCaseCount,
      target: 0,
    });
  }

  let status = 'continue_cleanup';
  let recommendation =
    'source-family cleanup を継続しつつ、representative case の失敗や hotspot concentration を優先して下げる。';

  if (failedTests > 0 || failedRepresentativeCases > 0 || failedAudits > 0) {
    status = 'needs_structural_fix';
    recommendation =
      'Step 4 の構造的な修正を優先し、presentation tuning や追加 source 投入は後回しにする。';
  } else if (fieldReviewActive && fieldReviewIndex.unresolvedCaseCount > 0) {
    status = 'field_revision_needed';
    recommendation =
      'representative case は安定しているが、実ケースで unresolved があるため、field review hotspot を優先して修正する。';
  } else if (checks.every((check) => check.passed)) {
    status = 'evaluation_ready';
    recommendation =
      'Step 4 は cleanup 無限ループに入らず、以後は representative case と実ケース評価を主軸に運用する。';
  }

  return {
    status,
    recommendation,
    checks,
    thresholds: {
      ...STEP4_PHASE_CRITERIA,
      representativeCaseFailuresTarget: 0,
      artifactAuditFailuresTarget: 0,
      founderBoundaryTarget: 0,
      fieldReviewUnresolvedTarget: 0,
    },
  };
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(OUTPUT_DIR, `${today}.md`);
  const jestOutputPath = path.join(os.tmpdir(), `jac-step4-eval-${Date.now()}.json`);
  const caseDefs = await readJson(CASE_FILE, []);
  const sourceConfig = await readJson(SOURCES_PATH, []);
  const fieldReviewSummary = await readJson(STEP4_FIELD_REVIEW_SUMMARY_PATH, null);

  const run = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['jest', TEST_FILE, '--runInBand', '--json', `--outputFile=${jestOutputPath}`],
    {
      cwd: ROOT,
      encoding: 'utf8',
    },
  );

  const jestJson = await readJson(jestOutputPath, {
    success: false,
    numTotalTests: 0,
    numPassedTests: 0,
    numFailedTests: 0,
    testResults: [],
  });
  const claims = await readJsonl(CLAIMS_PATH, []);

  const summary = summarizeAssertions(jestJson);
  const relatedReadingSnapshot = collectRelatedReadingSnapshot(claims, sourceConfig);
  const sourceActionQueue = buildSourceActionQueue(
    relatedReadingSnapshot.relatedReadingHotspots,
    caseDefs,
    fieldReviewSummary,
  );
  const founderBoundary = buildFounderBoundary(summary, sourceActionQueue, fieldReviewSummary);
  const phaseGate = evaluateStep4PhaseGate(
    summary,
    relatedReadingSnapshot,
    founderBoundary,
    fieldReviewSummary,
  );
  const passRate =
    summary.totalTests > 0 ? Number((summary.passedTests / summary.totalTests).toFixed(3)) : 0;
  const output = {
    generatedAt: new Date().toISOString(),
    testFile: TEST_FILE,
    caseFile: CASE_FILE,
    caseCount: Array.isArray(caseDefs) ? caseDefs.length : 0,
    passRate,
    commandExitCode: Number(run.status ?? 1),
    stdout: String(run.stdout || '').trim(),
    stderr: String(run.stderr || '').trim(),
    fieldReviewSummary:
      fieldReviewSummary && typeof fieldReviewSummary === 'object'
        ? {
            generatedAt: fieldReviewSummary.generatedAt || null,
            reviewCount: Number(fieldReviewSummary.reviewCount || 0),
            verdictCounts: fieldReviewSummary.verdictCounts || {},
            weakThemes: Array.isArray(fieldReviewSummary.weakThemes)
              ? fieldReviewSummary.weakThemes
              : [],
            unresolvedCases: Array.isArray(fieldReviewSummary.unresolvedCases)
              ? fieldReviewSummary.unresolvedCases
              : [],
          }
        : null,
    ...relatedReadingSnapshot,
    sourceActionQueue,
    founderBoundary,
    phaseGate,
    ...summary,
  };

  await ensureDir(OUTPUT_DIR);
  await ensureDir(path.dirname(SUMMARY_PATH));
  await fs.writeFile(SUMMARY_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push(`# JAC Step 4 Eval Brief ${today}`);
  lines.push('');
  lines.push('## Snapshot');
  lines.push('');
  lines.push(`- representative cases: ${output.caseCount}`);
  lines.push(`- tests: ${output.totalTests} total / ${output.passedTests} passed / ${output.failedTests} failed`);
  lines.push(`- pass rate: ${output.passRate}`);
  lines.push(`- summary json: \`references/jac/step4-eval-summary.json\``);

  lines.push('');
  lines.push('## Phase Gate');
  lines.push('');
  lines.push(`- status: ${output.phaseGate.status}`);
  lines.push(`- recommendation: ${output.phaseGate.recommendation}`);
  output.phaseGate.checks.forEach((check) => {
    lines.push(
      `- ${check.label}: ${check.passed ? 'passed' : 'not yet'} (actual ${check.actual} / target ${check.target})`,
    );
  });

  lines.push('');
  lines.push('## Representative Cases');
  lines.push('');
  if (output.representativeCases.length === 0) {
    lines.push('- no representative case results found');
  } else {
    output.representativeCases.forEach((item) => {
      lines.push(
        `- ${item.title}: ${item.status}${item.failure_summary ? ` / ${item.failure_summary}` : ''}`,
      );
    });
  }

  lines.push('');
  lines.push('## Artifact Audits');
  lines.push('');
  if (output.audits.length === 0) {
    lines.push('- no artifact audits found');
  } else {
    output.audits.forEach((item) => {
      lines.push(
        `- ${item.title}: ${item.status}${item.failure_summary ? ` / ${item.failure_summary}` : ''}`,
      );
    });
  }

  lines.push('');
  lines.push('## Related Reading Snapshot');
  lines.push('');
  lines.push(`- related_reading claims: ${output.relatedReadingCount}`);
  lines.push(`- duplicate same-source statements: ${output.duplicateSameSourceStatementCount}`);
  if (Array.isArray(output.relatedReadingHotspots) && output.relatedReadingHotspots.length > 0) {
    lines.push(
      `- hotspot sources: ${output.relatedReadingHotspots
        .map((item) => `${item.sourceName} (${item.count})`)
        .join(', ')}`,
    );
  } else {
    lines.push('- hotspot sources: none');
  }
  if (
    Array.isArray(output.duplicateSameSourceStatementGroups) &&
    output.duplicateSameSourceStatementGroups.length > 0
  ) {
    output.duplicateSameSourceStatementGroups.forEach((item) => {
      lines.push(`- duplicate: ${item.sourceName} (${item.count}) / ${item.statement}`);
    });
  }

  lines.push('');
  lines.push('## Field Review Signals');
  lines.push('');
  if (!output.fieldReviewSummary) {
    lines.push('- field review summary: none');
  } else {
    const verdictCounts =
      output.fieldReviewSummary.verdictCounts && typeof output.fieldReviewSummary.verdictCounts === 'object'
        ? output.fieldReviewSummary.verdictCounts
        : {};
    lines.push(
      `- field reviews: ${Number(output.fieldReviewSummary.reviewCount || 0)} / usable ${Number(verdictCounts.usable || 0)} / mixed ${Number(verdictCounts.mixed || 0)} / needs_revision ${Number(verdictCounts.needs_revision || 0)}`,
    );
    const unresolvedCases = Array.isArray(output.fieldReviewSummary.unresolvedCases)
      ? output.fieldReviewSummary.unresolvedCases
      : [];
    if (unresolvedCases.length > 0) {
      lines.push(
        `- unresolved cases: ${unresolvedCases
          .slice(0, 5)
          .map((item) => `${item.caseId} (${item.verdict})`)
          .join(', ')}`,
      );
    } else {
      lines.push('- unresolved cases: none');
    }
    const weakThemes = Array.isArray(output.fieldReviewSummary.weakThemes)
      ? output.fieldReviewSummary.weakThemes
      : [];
    if (weakThemes.length > 0) {
      lines.push(
        `- weak themes: ${weakThemes
          .slice(0, 5)
          .map((item) => `${item.theme} (${Number(item.count || 0)})`)
          .join(', ')}`,
      );
    } else {
      lines.push('- weak themes: none');
    }
  }

  lines.push('');
  lines.push('## Action Routing');
  lines.push('');
  if (Array.isArray(output.sourceActionQueue) && output.sourceActionQueue.length > 0) {
    output.sourceActionQueue.forEach((item) => {
      const impact =
        Number(item.impactCaseCount || 0) > 0
          ? ` / impacts ${item.impactCaseCount} representative cases (${(item.impactCaseTitles || []).join(', ')})`
          : '';
      const fieldImpact =
        Number(item.unresolvedFieldCaseCount || 0) > 0
          ? ` / unresolved field cases ${item.unresolvedFieldCaseCount} (${(item.unresolvedFieldCaseIds || []).join(', ')})`
          : Number(item.fieldReviewCount || 0) > 0
            ? ` / field review mentions ${item.fieldReviewCount}`
            : '';
      lines.push(
        `- ${item.sourceName} (${item.count})${impact}${fieldImpact} / ${item.suggestedAction} Why: ${item.why}`,
      );
    });
  } else {
    lines.push('- no source-family action queue');
  }

  lines.push('');
  lines.push('## Next Action');
  lines.push('');
  if (output.failedTests > 0) {
    lines.push('- failed representative cases or artifact audits should be treated as Step 4 backlog before more wording tweaks');
  } else if (Array.isArray(output.fieldReviewSummary?.unresolvedCases) && output.fieldReviewSummary.unresolvedCases.length > 0) {
    lines.push('- representative case pass だけで進めず、field review unresolved case の hotspot source を優先して修正する');
  } else {
    lines.push('- Step 4 representative cases are stable at this snapshot; use hotspot source deltas and action routing to choose the next source-family fix');
  }

  lines.push('');
  lines.push('## Founder Boundary');
  lines.push('');
  if (Array.isArray(output.founderBoundary) && output.founderBoundary.length > 0) {
    output.founderBoundary.forEach((item) => {
      lines.push(`- ${item}`);
    });
  } else {
    lines.push('- none');
  }

  await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
  process.stdout.write(`${outputPath}\n`);

  if (ENFORCE && (run.status !== 0 || output.failedTests > 0)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
