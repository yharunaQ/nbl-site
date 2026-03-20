#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ENFORCE = process.argv.includes('--enforce');
const MAX_UNCOVERED_ROWS = Number(process.env.JAC_MAX_UNCOVERED_ROWS || 8);

const GUIDE_PATH = path.join(process.cwd(), 'pages', 'jac', 'guide.tsx');
const DATA2_INDEX_PATH = path.join(
  process.cwd(),
  'references',
  'data2',
  'index',
  'data2-knowledge-index.json',
);

function normalize(value) {
  return String(value || '').toLowerCase();
}

function countKeywordMatches(text, keywords) {
  const normalized = normalize(text);
  return (Array.isArray(keywords) ? keywords : []).reduce((count, keyword) => {
    if (!keyword) return count;
    return normalized.includes(normalize(keyword)) ? count + 1 : count;
  }, 0);
}

function extractObjectSource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const braceStart = fileText.indexOf('{', markerIndex);
  if (braceStart < 0) return null;

  let depth = 0;
  let braceEnd = -1;
  for (let index = braceStart; index < fileText.length; index += 1) {
    const ch = fileText[index];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        braceEnd = index;
        break;
      }
    }
  }
  if (braceEnd < 0) return null;
  return fileText.slice(braceStart, braceEnd + 1);
}

function classifyIssue(issue, count) {
  if (/乗り物|フォークリフト|危険/.test(issue)) return 'new_card_candidate';
  if (/独立起業|自営|企業ニーズ|社会に役立つ|責任に十分に応える/.test(issue)) {
    return 'lexical_absorb_existing';
  }
  if (/手と手指/.test(issue)) return count <= 1 ? 'noise_candidate' : 'lexical_absorb_existing';
  return count <= 1 ? 'review' : 'lexical_absorb_existing';
}

async function main() {
  const [guideText, data2Raw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
  ]);

  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES');
  if (!profilesSource) {
    throw new Error('CARD_MINING_PROFILES not found in guide.tsx');
  }
  const profiles = new Function(`return (${profilesSource});`)();
  const allProfiles = Object.values(profiles);

  const parsed = JSON.parse(data2Raw);
  const entries = Array.isArray(parsed?.entries) ? parsed.entries : [];

  let totalIssueRows = 0;
  let coveredIssueRows = 0;
  const uncoveredRows = [];

  for (const entry of entries) {
    for (const issueRow of entry?.issues || []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      totalIssueRows += 1;

      const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
      const covered = allProfiles.some((profile) => {
        const issueScore = countKeywordMatches(issue, profile?.issueKeywords || []);
        const supportScore = supports.reduce((sum, support) => {
          return sum + countKeywordMatches(String(support || ''), profile?.supportKeywords || []);
        }, 0);
        return issueScore > 0 || supportScore > 0;
      });

      if (covered) {
        coveredIssueRows += 1;
        continue;
      }

      uncoveredRows.push({
        entryId: Number(entry?.id || 0),
        disability: String(entry?.disability || '不明'),
        issue,
        supports,
      });
    }
  }

  const issueMap = new Map();
  for (const row of uncoveredRows) {
    const current = issueMap.get(row.issue) || { issue: row.issue, count: 0, rows: [] };
    current.count += 1;
    current.rows.push(row);
    issueMap.set(row.issue, current);
  }

  const issueSummaries = Array.from(issueMap.values())
    .map((item) => ({
      issue: item.issue,
      count: item.count,
      action: classifyIssue(item.issue, item.count),
      disabilities: Array.from(new Set(item.rows.map((row) => row.disability))),
      supports: Array.from(new Set(item.rows.flatMap((row) => row.supports))).slice(0, 5),
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.issue.localeCompare(b.issue, 'ja');
    });

  const actionCounts = issueSummaries.reduce((acc, row) => {
    acc[row.action] = (acc[row.action] || 0) + row.count;
    return acc;
  }, {});

  const summary = {
    generatedAt: new Date().toISOString(),
    totalIssueRows,
    coveredIssueRows,
    uncoveredRows: uncoveredRows.length,
    coverageRate: totalIssueRows === 0 ? 0 : Number((coveredIssueRows / totalIssueRows).toFixed(3)),
    maxUncoveredRowsThreshold: MAX_UNCOVERED_ROWS,
    actionCounts,
    issueSummaries,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (ENFORCE && uncoveredRows.length > MAX_UNCOVERED_ROWS) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
