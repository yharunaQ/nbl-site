#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_PATH = path.join(ROOT, 'lib', 'jac', 'tagDictionary.ts');
const CASES_PATH = path.join(ROOT, 'references', 'data2', 'eval', 'jac-offline-cases.json');
const ENFORCE = process.argv.includes('--enforce');
const MIN_TAG_CASE_PASS_RATE = Number(process.env.JAC_MIN_TAG_CASE_PASS_RATE || 0.7);
const MIN_TAG_GROUP_HIT_RATE = Number(process.env.JAC_MIN_TAG_GROUP_HIT_RATE || 0.85);

const groups = ['task', 'symptom', 'environment', 'preference'];

function extractArrayConst(source, name) {
  const marker = `const ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) {
    throw new Error(`Cannot find ${name} in ${SOURCE_PATH}`);
  }
  const eqIndex = source.indexOf('=', start);
  if (eqIndex < 0) {
    throw new Error(`Cannot find assignment for ${name}`);
  }
  const firstBracket = source.indexOf('[', eqIndex);
  if (firstBracket < 0) {
    throw new Error(`Cannot find array start for ${name}`);
  }
  let depth = 0;
  for (let i = firstBracket; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '[') depth += 1;
    if (ch === ']') depth -= 1;
    if (depth === 0) {
      const literal = source.slice(firstBracket, i + 1);
      return Function(`"use strict"; return (${literal});`)();
    }
  }
  throw new Error(`Cannot parse array literal for ${name}`);
}

function clampScore(score) {
  return Math.max(0.1, Math.min(0.99, Number(score.toFixed(2))));
}

function buildSignalSuggestions(consultation, tagSignalRules) {
  const lower = String(consultation || '').toLowerCase();
  const byGroup = {
    task: [],
    symptom: [],
    environment: [],
    preference: [],
  };
  const bucket = new Map();
  for (const group of groups) bucket.set(group, new Map());

  for (const rule of tagSignalRules) {
    const matched = (rule.patterns || []).filter((pattern) =>
      lower.includes(String(pattern || '').toLowerCase()),
    );
    if (matched.length === 0) continue;
    const score = clampScore(0.45 + Math.min(0.42, matched.length * 0.17 + (rule.boost || 0)));
    bucket.get(rule.group)?.set(rule.tag, {
      tag: rule.tag,
      reason: `相談文の表現「${matched.slice(0, 2).join(' / ')}」と一致`,
      score,
    });
  }

  for (const group of groups) {
    byGroup[group] = Array.from(bucket.get(group)?.values() || [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
  return byGroup;
}

function applyStrongSignalRules(consultation, base, strongRules) {
  const lower = String(consultation || '').toLowerCase();
  const next = {
    task: [...base.task],
    symptom: [...base.symptom],
    environment: [...base.environment],
    preference: [...base.preference],
  };

  for (const rule of strongRules) {
    const matched = (rule.patterns || []).some((pattern) =>
      lower.includes(String(pattern || '').toLowerCase()),
    );
    if (!matched) continue;
    const exists = next[rule.group].some((item) => item.tag === rule.tag);
    if (!exists) {
      next[rule.group].push({
        tag: rule.tag,
        reason: rule.reason,
        score: rule.score,
      });
    } else {
      next[rule.group] = next[rule.group].map((item) =>
        item.tag === rule.tag
          ? {
              ...item,
              score: Math.max(item.score, rule.score),
              reason: rule.reason,
            }
          : item,
      );
    }
    next[rule.group] = next[rule.group].sort((a, b) => b.score - a.score).slice(0, 3);
  }

  return next;
}

function evaluateCase(caseDef, predicted) {
  const expected = caseDef?.expectedTags || {};
  const misses = [];
  let checkedGroups = 0;
  let hitGroups = 0;

  for (const group of groups) {
    const wants = Array.isArray(expected[group]) ? expected[group] : [];
    if (wants.length === 0) continue;
    checkedGroups += 1;
    const got = predicted[group].map((item) => item.tag);
    const hit = wants.some((want) => got.includes(want));
    if (hit) {
      hitGroups += 1;
      continue;
    }
    misses.push({
      group,
      expectedAny: wants,
      gotTop: got,
    });
  }

  return {
    checkedGroups,
    hitGroups,
    pass: checkedGroups === 0 ? true : hitGroups === checkedGroups,
    misses,
  };
}

function summarize(results) {
  const summary = {
    caseCount: results.length,
    casePass: 0,
    groupChecked: 0,
    groupHits: 0,
    casePassRate: 0,
    groupHitRate: 0,
    missTop: [],
  };
  const missCounter = new Map();

  for (const row of results) {
    if (row.eval.pass) summary.casePass += 1;
    summary.groupChecked += row.eval.checkedGroups;
    summary.groupHits += row.eval.hitGroups;
    for (const miss of row.eval.misses) {
      for (const want of miss.expectedAny) {
        const key = `${miss.group}\t${want}`;
        missCounter.set(key, (missCounter.get(key) || 0) + 1);
      }
    }
  }

  summary.casePassRate = summary.caseCount === 0 ? 0 : summary.casePass / summary.caseCount;
  summary.groupHitRate = summary.groupChecked === 0 ? 0 : summary.groupHits / summary.groupChecked;
  summary.missTop = [...missCounter.entries()]
    .map(([key, count]) => {
      const [group, tag] = key.split('\t');
      return { group, tag, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return summary;
}

function evaluateGate(summary) {
  if (!ENFORCE) return [];
  const failures = [];
  if (summary.casePassRate < MIN_TAG_CASE_PASS_RATE) {
    failures.push(`casePassRate ${summary.casePassRate.toFixed(3)} < ${MIN_TAG_CASE_PASS_RATE}`);
  }
  if (summary.groupHitRate < MIN_TAG_GROUP_HIT_RATE) {
    failures.push(`groupHitRate ${summary.groupHitRate.toFixed(3)} < ${MIN_TAG_GROUP_HIT_RATE}`);
  }
  return failures;
}

async function main() {
  const source = await fs.readFile(SOURCE_PATH, 'utf8');
  const cases = JSON.parse(await fs.readFile(CASES_PATH, 'utf8'));
  if (!Array.isArray(cases)) {
    throw new Error(`Invalid cases: ${CASES_PATH}`);
  }

  const tagSignalRules = extractArrayConst(source, 'TAG_SIGNAL_RULES');
  const strongSignalRules = extractArrayConst(source, 'STRONG_SIGNAL_RULES');

  const results = cases.map((caseDef) => {
    const consultation = String(caseDef?.consultation || '');
    const signal = buildSignalSuggestions(consultation, tagSignalRules);
    const predicted = applyStrongSignalRules(consultation, signal, strongSignalRules);
    const evalResult = evaluateCase(caseDef, predicted);
    return {
      id: String(caseDef?.id || ''),
      consultation,
      predicted,
      eval: evalResult,
    };
  });

  const summary = summarize(results);
  const gateFailures = evaluateGate(summary);
  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourcePath: SOURCE_PATH,
        casePath: CASES_PATH,
        enforce: ENFORCE,
        thresholds: {
          minTagCasePassRate: MIN_TAG_CASE_PASS_RATE,
          minTagGroupHitRate: MIN_TAG_GROUP_HIT_RATE,
        },
        summary,
        gateFailures,
        results,
      },
      null,
      2,
    ),
  );

  if (gateFailures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
