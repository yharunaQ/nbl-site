#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, 'references', 'jac', 'eval', 'field-reviews');
const OUTPUT_DIR = path.join(ROOT, 'docs', 'nbl-workspace', 'ops', 'jac-step4-field-reviews');
const SUMMARY_PATH = path.join(ROOT, 'references', 'jac', 'step4-field-review-summary.json');

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

async function safeReadDir(dirPath) {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function splitListValue(value) {
  return normalizeText(value)
    .split(/[、,]/)
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function parseMetadata(lines) {
  const metadata = {};

  for (const line of lines) {
    const match = line.match(/^- ([a-zA-Z][a-zA-Z0-9_]*):\s*(.+)$/);
    if (!match) continue;
    metadata[match[1]] = normalizeText(match[2]);
  }

  return metadata;
}

function parseSections(raw) {
  const sections = {};
  const matches = [...raw.matchAll(/^##\s+(.+)$/gm)];

  if (matches.length === 0) return sections;

  for (let index = 0; index < matches.length; index += 1) {
    const heading = normalizeText(matches[index][1]).toLowerCase();
    const start = matches[index].index + matches[index][0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : raw.length;
    sections[heading] = normalizeText(raw.slice(start, end));
  }

  return sections;
}

function classifyWeakThemes(text) {
  const normalized = normalizeText(text).toLowerCase();
  const themes = [];

  if (/(根拠|出典|reference|citation|source)/.test(normalized)) themes.push('evidence_traceability');
  if (/(一般論|抽象|generic|general)/.test(normalized)) themes.push('generality');
  if (/(実践|具体|具体策|implement|使いにく)/.test(normalized)) themes.push('practicality_gap');
  if (/(タグ|tag|step ?2|step ?3)/.test(normalized)) themes.push('step_contract_or_tag_gap');
  if (/(地域支援|支援連携|support catalog)/.test(normalized)) themes.push('support_linkage_gap');

  return themes.length > 0 ? themes : ['manual_review_needed'];
}

async function readFieldReviews() {
  const filenames = (await safeReadDir(INPUT_DIR))
    .filter((filename) => filename.endsWith('.md'))
    .filter((filename) => !['README.md', 'TEMPLATE.md'].includes(filename))
    .sort((a, b) => a.localeCompare(b, 'ja'));

  const reviews = [];
  for (const filename of filenames) {
    const filepath = path.join(INPUT_DIR, filename);
    const raw = await fs.readFile(filepath, 'utf8');
    const lines = raw.split(/\r?\n/).map((line) => line.trimRight());
    const metadata = parseMetadata(lines.slice(0, 20));
    const sections = parseSections(raw);

    const sourceHotspots = splitListValue(metadata.sourceHotspots || '');
    const review = {
      filename,
      filepath,
      caseId: normalizeText(metadata.caseId || filename.replace(/\.md$/i, '')),
      reviewedAt: normalizeText(metadata.reviewedAt || ''),
      verdict: normalizeText(metadata.verdict || 'mixed'),
      consultationSummary: normalizeText(metadata.consultationSummary || ''),
      sourceHotspots,
      worked: normalizeText(sections['what worked'] || ''),
      weak: normalizeText(sections['what felt weak'] || ''),
      missingReferences: normalizeText(sections['missing or risky references'] || ''),
      suggestedNextFix: normalizeText(sections['suggested next fix'] || ''),
    };

    reviews.push(review);
  }

  return reviews;
}

function buildSummary(reviews) {
  const verdictCounts = { usable: 0, mixed: 0, needs_revision: 0 };
  const sourceHotspotCounts = new Map();
  const weakThemeCounts = new Map();

  for (const review of reviews) {
    const verdict = ['usable', 'mixed', 'needs_revision'].includes(review.verdict)
      ? review.verdict
      : 'mixed';
    verdictCounts[verdict] += 1;

    for (const sourceId of review.sourceHotspots) {
      sourceHotspotCounts.set(sourceId, (sourceHotspotCounts.get(sourceId) || 0) + 1);
    }

    const weakThemes = classifyWeakThemes(`${review.weak} ${review.missingReferences}`);
    for (const theme of weakThemes) {
      weakThemeCounts.set(theme, (weakThemeCounts.get(theme) || 0) + 1);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    reviewCount: reviews.length,
    verdictCounts,
    sourceHotspots: [...sourceHotspotCounts.entries()]
      .map(([sourceId, count]) => ({ sourceId, count }))
      .sort((a, b) => b.count - a.count),
    weakThemes: [...weakThemeCounts.entries()]
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count),
    unresolvedCases: reviews
      .filter((review) => review.verdict !== 'usable')
      .map((review) => ({
        caseId: review.caseId,
        verdict: review.verdict,
        sourceHotspots: review.sourceHotspots,
        suggestedNextFix: review.suggestedNextFix,
      })),
    reviews,
  };
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(OUTPUT_DIR, `${today}.md`);
  const reviews = await readFieldReviews();
  const summary = buildSummary(reviews);

  await ensureDir(OUTPUT_DIR);
  await ensureDir(path.dirname(SUMMARY_PATH));
  await fs.writeFile(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push(`# JAC Step 4 Field Review Brief ${today}`);
  lines.push('');
  lines.push('## Snapshot');
  lines.push('');
  lines.push(`- field reviews: ${summary.reviewCount}`);
  lines.push(
    `- verdicts: usable ${summary.verdictCounts.usable} / mixed ${summary.verdictCounts.mixed} / needs_revision ${summary.verdictCounts.needs_revision}`,
  );

  lines.push('');
  lines.push('## Source Hotspots');
  lines.push('');
  if (summary.sourceHotspots.length === 0) {
    lines.push('- no field review source hotspots yet');
  } else {
    summary.sourceHotspots.slice(0, 5).forEach((item) => {
      lines.push(`- ${item.sourceId}: ${item.count} reviews`);
    });
  }

  lines.push('');
  lines.push('## Weak Themes');
  lines.push('');
  if (summary.weakThemes.length === 0) {
    lines.push('- no field review themes yet');
  } else {
    summary.weakThemes.slice(0, 5).forEach((item) => {
      lines.push(`- ${item.theme}: ${item.count}`);
    });
  }

  lines.push('');
  lines.push('## Unresolved Cases');
  lines.push('');
  if (summary.unresolvedCases.length === 0) {
    lines.push('- none');
  } else {
    summary.unresolvedCases.forEach((item) => {
      lines.push(
        `- ${item.caseId}: ${item.verdict}${item.sourceHotspots.length > 0 ? ` / hotspots ${item.sourceHotspots.join(', ')}` : ''}${item.suggestedNextFix ? ` / next ${item.suggestedNextFix}` : ''}`,
      );
    });
  }

  lines.push('');
  lines.push('## Next Action');
  lines.push('');
  if (summary.reviewCount === 0) {
    lines.push('- field review がまだないため、代表ケースとは別に実ケースを3件以上レビューして投入する。');
  } else if (summary.unresolvedCases.length > 0) {
    lines.push('- unresolved case の source hotspot を Step 4 action routing に照合して次の修正を選ぶ。');
  } else {
    lines.push('- field review でも stable なら source cleanup より実ケース追加と feedback ingestion を優先する。');
  }

  await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
