#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCES_PATH = path.join(ROOT, 'config', 'knowledge-sources.json');
const NORMALIZED_MANIFEST_PATH = path.join(ROOT, 'references', 'index', 'normalized-manifest.json');
const CLAIMS_MANIFEST_PATH = path.join(ROOT, 'references', 'index', 'knowledge-claims-manifest.json');
const FEEDBACK_INSIGHTS_PATH = path.join(ROOT, 'references', 'jac', 'feedback-insights.json');
const STEP4_EVAL_SUMMARY_PATH = path.join(ROOT, 'references', 'jac', 'step4-eval-summary.json');
const STEP4_FIELD_REVIEW_SUMMARY_PATH = path.join(
  ROOT,
  'references',
  'jac',
  'step4-field-review-summary.json',
);
const OUTPUT_DIR = path.join(ROOT, 'docs', 'nbl-workspace', 'ops', 'jac-evidence-briefs');

const CANDIDATE_LANES = [
  {
    title: '配慮プロセスの見える化',
    formats: 'infographic / short explainer video',
    sourceIds: [
      'askjan_website',
      'uk_gov_disability_employment',
      'australia_jobaccess_guidance',
      'canada_duty_to_accommodate',
      'eu_reasonable_accommodation',
    ],
    why: 'request recognition, interactive process, documentation, monitoring を比較しやすい。',
  },
  {
    title: '助成・外部支援・費用負担の比較',
    formats: 'comparison graphic / FAQ video',
    sourceIds: [
      'uk_gov_disability_employment',
      'australia_jobaccess_guidance',
      'canada_duty_to_accommodate',
      'eu_reasonable_accommodation',
    ],
    why: '企業が最初に気にする費用・助成・外部支援の不安を下げやすい。',
  },
  {
    title: '見えない負荷とモニタリング設計',
    formats: 'case-style infographic / practice video',
    sourceIds: [
      'askearn_employer_guidance',
      'uk_headway_brain_injury_work',
      'askjan_website',
      'canada_duty_to_accommodate',
    ],
    why: 'mental health, neurodiversity, brain injury, ongoing review を実務へ落とし込みやすい。',
  },
  {
    title: '小さく始める low-cost adjustment 集',
    formats: 'checklist graphic / short practical reel',
    sourceIds: [
      'askjan_website',
      'askearn_employer_guidance',
      'uk_gov_disability_employment',
      'australia_jobaccess_guidance',
    ],
    why: '中小規模の支援者・企業にとって試しやすい改善案に変換しやすい。',
  },
];

function formatTokyoDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function daysSince(dateString, referenceDateString = formatTokyoDate()) {
  if (!dateString) return null;
  const start = new Date(String(dateString).slice(0, 10) + 'T00:00:00+09:00');
  const end = new Date(referenceDateString + 'T00:00:00+09:00');
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function toCountMap(raw) {
  return raw && typeof raw === 'object' ? raw : {};
}

function scoreLane(lane, normalizedBySource, claimsBySource, feedbackThemes) {
  let score = 0;
  for (const sourceId of lane.sourceIds) {
    const records = Number(normalizedBySource[sourceId] || 0);
    const claims = Number(claimsBySource[sourceId] || 0);
    score += Math.min(records, 80) / 80;
    score += Math.min(claims, 120) / 120;
  }

  const feedbackText = feedbackThemes.join(' ').toLowerCase();
  if (
    lane.title.includes('モニタリング') &&
    /(優先|精度|ずれ|使いにく|運用|更新)/.test(feedbackText)
  ) {
    score += 0.6;
  }

  return Number(score.toFixed(2));
}

function pickExternalUpdateFocus(coverageRows, step4EvalSummary, normalizedAge, claimsAge) {
  const items = [];

  if ((normalizedAge !== null && normalizedAge >= 7) || (claimsAge !== null && claimsAge >= 7)) {
    items.push({
      priority: 1000,
      text: 'web source refresh と claim rebuild を優先し、AskJAN / EARN / JobAccess / Canada など主要 lane の差分を再取得する。',
    });
  }

  const sourceActionQueue =
    step4EvalSummary && Array.isArray(step4EvalSummary.sourceActionQueue)
      ? step4EvalSummary.sourceActionQueue
      : [];
  sourceActionQueue.slice(0, 3).forEach((item, index) => {
    items.push({
      priority: 900 - index,
      text: `${item.sourceName || item.sourceId}: Step 4 影響が大きいため、最新情報の差分確認と source-family rule の見直しを優先する。`,
    });
  });

  coverageRows
    .filter((row) => row.records < 12 || row.claims < 12)
    .slice(0, 3)
    .forEach((row) => {
      items.push({
        priority: 700,
        text: `${row.name}: coverage が薄いため、fetch 対象 URL・抽出ルール・lane 継続価値を再点検する。`,
      });
    });

  const unique = [];
  const seen = new Set();
  for (const item of items.sort((a, b) => b.priority - a.priority)) {
    if (seen.has(item.text)) continue;
    seen.add(item.text);
    unique.push(item.text);
  }

  return unique.slice(0, 5);
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(OUTPUT_DIR, `${today}.md`);

  const sourceConfig = await readJson(SOURCES_PATH, []);
  const normalizedManifest = await readJson(NORMALIZED_MANIFEST_PATH, {});
  const claimsManifest = await readJson(CLAIMS_MANIFEST_PATH, {});
  const feedbackInsights = await readJson(FEEDBACK_INSIGHTS_PATH, {
    generatedAt: null,
    processedFiles: [],
    frameInsights: {},
    crossCuttingThemes: [],
  });
  const step4EvalSummary = await readJson(STEP4_EVAL_SUMMARY_PATH, null);
  const step4FieldReviewSummary = await readJson(STEP4_FIELD_REVIEW_SUMMARY_PATH, null);

  const enabledWebsiteSources = Array.isArray(sourceConfig)
    ? sourceConfig.filter((source) => source.enabled && source.kind === 'website')
    : [];

  const normalizedBySource = toCountMap(normalizedManifest.bySourceId);
  const claimsBySource = toCountMap(claimsManifest.bySourceId);
  const feedbackThemes = Array.isArray(feedbackInsights.crossCuttingThemes)
    ? feedbackInsights.crossCuttingThemes
    : [];
  const frameInsights =
    feedbackInsights.frameInsights && typeof feedbackInsights.frameInsights === 'object'
      ? feedbackInsights.frameInsights
      : {};

  const coverageRows = enabledWebsiteSources.map((source) => ({
    id: source.id,
    name: source.name,
    refresh: source.refresh,
    records: Number(normalizedBySource[source.id] || 0),
    claims: Number(claimsBySource[source.id] || 0),
  }));

  const lowCoverageRows = coverageRows.filter((row) => row.records < 12 || row.claims < 12);
  const normalizedAge = daysSince(normalizedManifest.generatedAt, today);
  const claimsAge = daysSince(claimsManifest.generatedAt, today);
  const feedbackAge = daysSince(feedbackInsights.generatedAt, today);

  const topCandidateLanes = [...CANDIDATE_LANES]
    .map((lane) => ({
      ...lane,
      score: scoreLane(lane, normalizedBySource, claimsBySource, feedbackThemes),
      supports: lane.sourceIds
        .map((sourceId) => coverageRows.find((row) => row.id === sourceId))
        .filter(Boolean)
        .map((row) => `${row.name} (${row.records} records / ${row.claims} claims)`),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const externalUpdateFocus = pickExternalUpdateFocus(
    coverageRows,
    step4EvalSummary,
    normalizedAge,
    claimsAge,
  );

  const frameHotspots = Object.entries(frameInsights)
    .map(([frameId, value]) => ({
      frameId,
      feedbackCount: Number(value?.feedbackCount || 0),
      patterns: Array.isArray(value?.patterns) ? value.patterns : [],
    }))
    .sort((a, b) => b.feedbackCount - a.feedbackCount)
    .slice(0, 5);

  const lines = [];

  lines.push(`# JAC Evidence Refresh Brief ${today}`);
  lines.push('');
  lines.push('## Coverage Snapshot');
  lines.push('');
  if (coverageRows.length === 0) {
    lines.push('- enabled website source はまだない。');
  } else {
    coverageRows.forEach((row) => {
      lines.push(
        `- ${row.name}: ${row.records} records / ${row.claims} claims / refresh ${row.refresh}`,
      );
    });
  }

  lines.push('');
  lines.push('## Freshness And Risks');
  lines.push('');
  lines.push(
    `- normalized manifest: ${normalizedManifest.generatedAt || 'unknown'}${normalizedAge !== null ? ` (${normalizedAge} days old)` : ''}`,
  );
  lines.push(
    `- claims manifest: ${claimsManifest.generatedAt || 'unknown'}${claimsAge !== null ? ` (${claimsAge} days old)` : ''}`,
  );
  lines.push(
    `- feedback insights: ${feedbackInsights.generatedAt || 'unknown'}${feedbackAge !== null ? ` (${feedbackAge} days old)` : ''}`,
  );
  if (lowCoverageRows.length > 0) {
    lines.push(
      `- low coverage source: ${lowCoverageRows
        .map((row) => `${row.name} (${row.records}/${row.claims})`)
        .join(', ')}`,
    );
  } else {
    lines.push('- enabled website sources は最低限の coverage を持っている。');
  }
  if ((normalizedAge !== null && normalizedAge >= 7) || (claimsAge !== null && claimsAge >= 7)) {
    lines.push('- manifests が stale。web refresh と claim rebuild を優先したい。');
  }

  lines.push('');
  lines.push('## Product Feedback Signals');
  lines.push('');
  if (frameHotspots.length === 0 && feedbackThemes.length === 0) {
    lines.push('- まだ structured feedback signal が薄い。フォーム由来 feedback を継続収集する。');
  } else {
    if (feedbackThemes.length > 0) {
      lines.push(`- cross-cutting themes: ${feedbackThemes.join(' / ')}`);
    }
    frameHotspots.forEach((item) => {
      lines.push(
        `- ${item.frameId}: ${item.feedbackCount} feedback / patterns ${item.patterns.join(', ') || 'none'}`,
      );
    });
  }

  lines.push('');
  lines.push('## External Source Update Focus');
  lines.push('');
  if (externalUpdateFocus.length === 0) {
    lines.push('- external source lane は大きな stale signal なし。定例 refresh を維持する。');
  } else {
    externalUpdateFocus.forEach((item) => {
      lines.push(`- ${item}`);
    });
  }

  lines.push('');
  lines.push('## Step 4 Eval Snapshot');
  lines.push('');
  if (!step4EvalSummary) {
    lines.push('- step4 eval summary is not available yet. Run `npm run jac:eval:step4:brief` first.');
  } else {
    if (step4EvalSummary.phaseGate) {
      lines.push(
        `- phase gate: ${step4EvalSummary.phaseGate.status || 'unknown'} / ${step4EvalSummary.phaseGate.recommendation || 'n/a'}`,
      );
    }
    lines.push(
      `- generatedAt: ${step4EvalSummary.generatedAt || 'unknown'} / representative cases ${Number(step4EvalSummary.caseCount || 0)} / tests ${Number(step4EvalSummary.totalTests || 0)} / pass ${Number(step4EvalSummary.passedTests || 0)} / fail ${Number(step4EvalSummary.failedTests || 0)}`,
    );
    lines.push(
      `- related_reading: ${Number(step4EvalSummary.relatedReadingCount || 0)} / duplicate same-source statements ${Number(step4EvalSummary.duplicateSameSourceStatementCount || 0)}`,
    );
    const hotspotSources = Array.isArray(step4EvalSummary.relatedReadingHotspots)
      ? step4EvalSummary.relatedReadingHotspots
      : [];
    if (hotspotSources.length > 0) {
      lines.push(
        `- related_reading hotspots: ${hotspotSources
          .map((item) => `${item.sourceName || item.sourceId} (${Number(item.count || 0)})`)
          .join(', ')}`,
      );
    }
    const failedRepresentativeCases = Array.isArray(step4EvalSummary.representativeCases)
      ? step4EvalSummary.representativeCases.filter((item) => item.status !== 'passed')
      : [];
    const failedAudits = Array.isArray(step4EvalSummary.audits)
      ? step4EvalSummary.audits.filter((item) => item.status !== 'passed')
      : [];
    if (failedRepresentativeCases.length === 0 && failedAudits.length === 0) {
      lines.push('- representative Step 4 cases and artifact audits are currently passing.');
    } else {
      if (failedRepresentativeCases.length > 0) {
        lines.push(
          `- failed representative cases: ${failedRepresentativeCases
            .map((item) => item.title)
            .join(', ')}`,
        );
      }
      if (failedAudits.length > 0) {
        lines.push(`- failed artifact audits: ${failedAudits.map((item) => item.title).join(', ')}`);
      }
    }
  }

  lines.push('');
  lines.push('## Step 4 Field Review Snapshot');
  lines.push('');
  if (!step4FieldReviewSummary) {
    lines.push(
      '- field review summary is not available yet. Run `npm run jac:eval:step4:field` after adding reviews to `references/jac/eval/field-reviews/`.',
    );
  } else {
    const verdictCounts =
      step4FieldReviewSummary.verdictCounts && typeof step4FieldReviewSummary.verdictCounts === 'object'
        ? step4FieldReviewSummary.verdictCounts
        : {};
    lines.push(
      `- generatedAt: ${step4FieldReviewSummary.generatedAt || 'unknown'} / field reviews ${Number(step4FieldReviewSummary.reviewCount || 0)} / usable ${Number(verdictCounts.usable || 0)} / mixed ${Number(verdictCounts.mixed || 0)} / needs_revision ${Number(verdictCounts.needs_revision || 0)}`,
    );
    const fieldHotspots = Array.isArray(step4FieldReviewSummary.sourceHotspots)
      ? step4FieldReviewSummary.sourceHotspots
      : [];
    if (fieldHotspots.length > 0) {
      lines.push(
        `- field review hotspots: ${fieldHotspots
          .slice(0, 5)
          .map((item) => `${item.sourceId} (${Number(item.count || 0)})`)
          .join(', ')}`,
      );
    } else {
      lines.push('- field review hotspots: none yet');
    }
    const weakThemes = Array.isArray(step4FieldReviewSummary.weakThemes)
      ? step4FieldReviewSummary.weakThemes
      : [];
    if (weakThemes.length > 0) {
      lines.push(
        `- weak themes: ${weakThemes
          .slice(0, 5)
          .map((item) => `${item.theme} (${Number(item.count || 0)})`)
          .join(', ')}`,
      );
    } else {
      lines.push('- weak themes: none yet');
    }
    const unresolvedCases = Array.isArray(step4FieldReviewSummary.unresolvedCases)
      ? step4FieldReviewSummary.unresolvedCases
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
    if (Number(step4FieldReviewSummary.reviewCount || 0) === 0) {
      lines.push('- next field step: representative case とは別に実ケースを3件以上レビューして投入する。');
    } else if (unresolvedCases.length > 0) {
      lines.push('- next field step: unresolved case の hotspot を Step 4 action routing に照合して次修正を選ぶ。');
    } else {
      lines.push('- next field step: field review でも stable なら cleanup より実ケース追加と feedback ingestion を優先する。');
    }
  }

  lines.push('');
  lines.push('## Step 4 Ops Focus');
  lines.push('');
  if (!step4EvalSummary || !Array.isArray(step4EvalSummary.sourceActionQueue) || step4EvalSummary.sourceActionQueue.length === 0) {
    lines.push('- source-family action queue is not available yet.');
  } else {
    [...step4EvalSummary.sourceActionQueue]
      .sort((a, b) => {
        const priorityDiff = Number(b?.priorityScore || 0) - Number(a?.priorityScore || 0);
        if (priorityDiff !== 0) return priorityDiff;
        const unresolvedDiff =
          Number(b?.unresolvedFieldCaseCount || 0) - Number(a?.unresolvedFieldCaseCount || 0);
        if (unresolvedDiff !== 0) return unresolvedDiff;
        const fieldDiff = Number(b?.fieldReviewCount || 0) - Number(a?.fieldReviewCount || 0);
        if (fieldDiff !== 0) return fieldDiff;
        return Number(b?.count || 0) - Number(a?.count || 0);
      })
      .slice(0, 5)
      .forEach((item) => {
      const impact =
        Number(item.impactCaseCount || 0) > 0
          ? ` / impacts ${Number(item.impactCaseCount || 0)} cases (${(item.impactCaseTitles || []).join(', ')})`
          : '';
      const fieldImpact =
        Number(item.unresolvedFieldCaseCount || 0) > 0
          ? ` / unresolved field cases ${Number(item.unresolvedFieldCaseCount || 0)} (${(item.unresolvedFieldCaseIds || []).join(', ')})`
          : Number(item.fieldReviewCount || 0) > 0
            ? ` / field review mentions ${Number(item.fieldReviewCount || 0)}`
            : '';
      lines.push(
        `- ${item.sourceName || item.sourceId}: ${item.actionType || 'review'}${impact}${fieldImpact}. ${item.suggestedAction || ''} Why: ${item.why || 'n/a'}`,
      );
    });
  }

  lines.push('');
  lines.push('## Candidate Infographic And Video Lanes');
  lines.push('');
  topCandidateLanes.forEach((lane, index) => {
    lines.push(
      `- ${index + 1}. ${lane.title}: ${lane.formats}. Why: ${lane.why} Supporting sources: ${lane.supports.join(' / ') || 'none'}. Score ${lane.score}.`,
    );
  });

  lines.push('');
  lines.push('## Next Automation Run');
  lines.push('');
  lines.push('- light refresh: `npm run jac:evidence:refresh:light`');
  lines.push('- full refresh: `npm run jac:evidence:refresh:full`');
  lines.push('- field review only: `npm run jac:eval:step4:field`');
  lines.push('- after refresh, review the newest file in `docs/nbl-workspace/ops/jac-evidence-briefs/`');

  lines.push('');
  lines.push('## Founder Boundary');
  lines.push('');
  if (Array.isArray(step4EvalSummary?.founderBoundary) && step4EvalSummary.founderBoundary.length > 0) {
    step4EvalSummary.founderBoundary.forEach((item) => {
      lines.push(`- ${item}`);
    });
  } else {
    lines.push('- none');
  }

  lines.push('');
  lines.push('## Exit Rule');
  lines.push('');
  lines.push('- Step 4 は phase gate が `evaluation_ready` になったら source cleanup の無限継続を止め、以後は representative case と実ケース評価を主軸にする。');

  await ensureDir(OUTPUT_DIR);
  await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
