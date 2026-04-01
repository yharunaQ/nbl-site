#!/usr/bin/env node
/**
 * 配慮設計アシスト フィードバック分析スクリプト
 *
 * references/jac/feedback/*.md を読み込み、OpenAI で構造化して
 * references/jac/feedback-insights.json に蓄積する。
 * 処理済みファイルはスキップされる（差分処理）。
 *
 * 使い方:
 *   npm run jac:feedback:analyze
 *   npm run jac:feedback:analyze -- --reprocess  # 全ファイルを再処理
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const WORKSPACE_FEEDBACK_DIR = path.join(process.cwd(), 'references', 'jac', 'feedback');
const RUNTIME_FEEDBACK_DIR = path.join(process.cwd(), '.tmp', 'jac-feedback');
const INSIGHTS_PATH = path.join(process.cwd(), 'references', 'jac', 'feedback-insights.json');

const reprocess = process.argv.includes('--reprocess');

// ── 既存インサイトの読み込み ────────────────────────────────────────────

async function loadExistingInsights() {
  try {
    const raw = await fs.readFile(INSIGHTS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      generatedAt: null,
      processedFiles: [],
      frameInsights: {},
      crossCuttingThemes: [],
    };
  }
}

// ── フィードバックファイルの収集 ────────────────────────────────────────

async function safeReadDir(dirPath) {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

function buildFileId(entry) {
  return `${entry.bucket}:${entry.filename}`;
}

async function collectFeedbackFiles(processedFiles) {
  const workspaceEntries = (await safeReadDir(WORKSPACE_FEEDBACK_DIR))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((filename) => ({
      bucket: 'workspace',
      kind: 'md',
      filename,
      filepath: path.join(WORKSPACE_FEEDBACK_DIR, filename),
    }));

  const runtimeEntries = (await safeReadDir(RUNTIME_FEEDBACK_DIR))
    .filter((f) => f.endsWith('.json'))
    .map((filename) => ({
      bucket: 'runtime',
      kind: 'json',
      filename,
      filepath: path.join(RUNTIME_FEEDBACK_DIR, filename),
    }));

  return [...workspaceEntries, ...runtimeEntries]
    .filter((entry) => reprocess || !processedFiles.includes(buildFileId(entry)))
    .sort((a, b) => a.filename.localeCompare(b.filename, 'ja'));
}

async function readFeedbackContent(entry) {
  const raw = await fs.readFile(entry.filepath, 'utf8');
  if (entry.kind === 'md') {
    return raw;
  }

  const parsed = JSON.parse(raw);
  const timestamp = String(parsed.timestamp || '').trim() || entry.filename;
  const feedbackText = String(parsed.feedbackText || '').trim();
  return `# ${timestamp}

## フィードバック元
配慮設計アシスト フォーム

## 内容
${feedbackText}
`;
}

// ── OpenAI プロンプト ────────────────────────────────────────────────────

const FRAME_IDS = [
  'p-fatigue-pacing', 'p-medical-schedule', 'p-internal-treatment-compatibility',
  'p-shift-rhythm-guard', 'p-return-to-work-ramp', 'p-mental-fluctuation-plan',
  'p-environment-sensory', 'p-commute-hybrid', 'p-physical-mobility-route',
  'p-jobmatch-exploration', 'p-application-contact-flow', 'p-interview-self-advocacy',
  'p-skill-building-path', 'p-worktrial-transition', 'p-income-condition-stability',
  'p-support-service-navigation', 'p-meeting-overload', 'p-disclosure-boundary',
  'p-manager-checkin', 'p-customer-facing-load', 'p-visual-document-access',
  'p-hearing-meeting-access', 'p-intellectual-task-clarity', 'p-developmental-switch-load',
  'p-higher-brain-memory-support', 'p-safety-critical-operations',
];

function buildSystemPrompt() {
  return `あなたは就労支援AIツール「配慮設計アシスト」のフレーム品質を管理するアナリストです。

Founderが利用者から受け取ったフィードバックを自由テキストで書き留めたノートを受け取ります。
以下の作業を行ってください：

1. フレームID別に言及されている内容を抽出する
2. フィードバックのパターンを分類する（例: 見立てが実態と合わない / 優先順位がずれている / 調整案が現場で使いにくい / 有効だった）
3. 複数フレームに共通するテーマを抽出する
4. 各フレームについて、フレームデータの改善候補（あれば）を短く提案する

有効なフレームIDの一覧:
${FRAME_IDS.join(', ')}

フレームIDが明示されていない場合でも、内容から該当フレームを推定してください。
推定できない場合は frameId を null にしてください。`;
}

function buildUserPrompt(filename, content) {
  return `以下はフィードバックノート「${filename}」の内容です：

---
${content}
---

このノートを分析して、指定のJSON形式で返してください。`;
}

function buildSchema() {
  return {
    type: 'object',
    properties: {
      frameMentions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            frameId: { type: ['string', 'null'] },
            pattern: {
              type: 'string',
              enum: ['inaccurate_assessment', 'priority_mismatch', 'hard_to_implement', 'effective', 'other'],
            },
            patternNote: { type: 'string' },
            suggestedRevision: { type: ['string', 'null'] },
          },
          required: ['frameId', 'pattern', 'patternNote', 'suggestedRevision'],
          additionalProperties: false,
        },
      },
      crossCuttingThemes: {
        type: 'array',
        items: { type: 'string' },
      },
      summary: { type: 'string' },
    },
    required: ['frameMentions', 'crossCuttingThemes', 'summary'],
    additionalProperties: false,
  };
}

// ── OpenAI 呼び出し ──────────────────────────────────────────────────────

function buildFallbackAnalysis(filename, content) {
  const themes = [];
  const normalized = String(content || '');

  if (/(タグ|tag|分類|label)/i.test(normalized)) {
    themes.push('tag quality review');
  }
  if (/(根拠|出典|source|evidence|citation)/i.test(normalized)) {
    themes.push('evidence traceability');
  }
  if (/(使いにく|複雑|分かりにく|わかりにく|迷う)/i.test(normalized)) {
    themes.push('usability friction');
  }
  if (/(ずれ|合っていない|的外れ|priority|優先)/i.test(normalized)) {
    themes.push('assessment mismatch');
  }
  if (/(実装しにく|現場で使いにく|hard to implement)/i.test(normalized)) {
    themes.push('implementation friction');
  }

  return {
    frameMentions: [],
    crossCuttingThemes: themes.length > 0 ? themes : ['manual review needed'],
    summary: `OpenAI API key unavailable. Stored fallback themes for ${filename}.`,
  };
}

async function analyzeFile(filename, content) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackAnalysis(filename, content);
  }

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(filename, content) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'feedback_analysis',
          strict: true,
          schema: buildSchema(),
        },
      },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API エラー: ${response.status} ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error('OpenAI からの応答が空です。');
  return JSON.parse(raw);
}

// ── インサイトのマージ ────────────────────────────────────────────────────

function mergeInsights(existing, filename, analysis) {
  const { frameMentions, crossCuttingThemes, summary } = analysis;

  for (const mention of frameMentions) {
    const { frameId, pattern, patternNote, suggestedRevision } = mention;
    if (!frameId) continue;

    if (!existing.frameInsights[frameId]) {
      existing.frameInsights[frameId] = {
        feedbackCount: 0,
        patterns: [],
        notes: [],
        suggestedRevisions: [],
      };
    }

    const fi = existing.frameInsights[frameId];
    fi.feedbackCount += 1;
    if (!fi.patterns.includes(pattern)) fi.patterns.push(pattern);
    fi.notes.push({ file: filename, pattern, note: patternNote });
    if (suggestedRevision) fi.suggestedRevisions.push({ file: filename, text: suggestedRevision });
  }

  // クロスカッティングテーマの追加（重複除去）
  for (const theme of crossCuttingThemes) {
    if (!existing.crossCuttingThemes.includes(theme)) {
      existing.crossCuttingThemes.push(theme);
    }
  }

  // 最新サマリーを記録
  if (!existing.fileSummaries) existing.fileSummaries = {};
  existing.fileSummaries[filename] = summary;
}

// ── メイン ──────────────────────────────────────────────────────────────

async function main() {
  const insights = await loadExistingInsights();
  const files = await collectFeedbackFiles(reprocess ? [] : insights.processedFiles);

  if (files.length === 0) {
    console.log('新しいフィードバックファイルはありません。');
    return;
  }

  console.log(`処理対象: ${files.length} ファイル`);

  for (const entry of files) {
    const content = await readFeedbackContent(entry);
    const fileId = buildFileId(entry);

    process.stdout.write(`  ${fileId} ... `);

    try {
      const analysis = await analyzeFile(fileId, content);
      mergeInsights(insights, fileId, analysis);

      if (!insights.processedFiles.includes(fileId)) {
        insights.processedFiles.push(fileId);
      }

      const count = analysis.frameMentions.filter((m) => m.frameId).length;
      console.log(`OK (${count} フレーム言及)`);
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
    }
  }

  insights.generatedAt = new Date().toISOString().slice(0, 10);
  await fs.writeFile(INSIGHTS_PATH, JSON.stringify(insights, null, 2), 'utf8');
  console.log(`\n出力: ${INSIGHTS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
