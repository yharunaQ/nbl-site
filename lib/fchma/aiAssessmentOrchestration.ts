/**
 * FCHMA AI Assessment Orchestration
 *
 * This module is the core intelligence layer of the next-generation JAC.
 * It uses the FCHMA (Functional Causal Hypothesis Manifold Analysis) methodology
 * to analyze employment difficulties as causal chains rather than symptom lists.
 *
 * Knowledge sources injected into the AI:
 *   1. FCHMA Causal Framework Atlas (8 domains × 6 motifs)
 *   2. Manifold-derived respondent patterns (44 patterns from real survey data)
 *   3. Evidence-based support catalog (regression-validated interventions)
 *   4. HW practice knowledge (case-grounded support orchestration principles)
 *   5. International accommodation evidence (AskJAN, JEED, UK, EU, etc.)
 */

import { fchmaCausalFrameworkAtlas } from '@/lib/fchma/causalFrameworkAtlas';
import {
  buildFchmaMinimalSignalPreview,
  type FchmaMinimalSignalPreview,
} from '@/lib/fchma/minimalIntake';
import {
  matchFchmaRespondentPatternsForPreview,
  type FchmaRespondentPatternMatch,
} from '@/lib/fchma/respondentPatternMatcher';
import {
  getFchmaReferenceKnowledgePack,
  formatSupportCatalogForPrompt,
  formatHwKnowledgeForPrompt,
  formatInternationalEvidenceForPrompt,
  resolveReferenceItemUrl,
  type FchmaReferenceKnowledgePack,
} from '@/lib/fchma/referenceKnowledgePack';

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export type FchmaStructuralHypothesis = {
  label: string;
  rationale: string;
  causalChain: string;
  keyElements: string[];
  amplifiers: string[];
  protectors: string[];
  interventionPoints: string[];
  confidence: 'low' | 'medium' | 'high';
};

export type FchmaInterventionItem = {
  title: string;
  interventionType: 'work_design' | 'accommodation' | 'support_linkage' | 'self_management' | 'employer_engagement';
  ownerRole: string;
  rationale: string;
  implementationNotes: string[];
  evidenceBasis: string;
  feasibility: 'low' | 'medium' | 'high';
};

export type FchmaReferenceItem = {
  title: string;
  summary: string;
  sourceType: 'supports_model' | 'hw_practice' | 'international_guidance' | 'guideline' | 'manifold_pattern';
  evidenceRole: 'direct_basis' | 'conditional_hypothesis' | 'related_reading';
  relevanceNote: string;
  url?: string;
};

export type FchmaStructuredFollowupQuestion = {
  question: string;
  suggestedOptions: string[];
};

export type FchmaAiAssessment = {
  primaryDomainId: string;
  primaryDomainLabel: string;
  primaryMotifId: string;
  primaryMotifLabel: string;
  frameworkSummary: string;
  structuralHypotheses: FchmaStructuralHypothesis[];
  interventionPlan: FchmaInterventionItem[];
  followupQuestions: string[];
  structuredFollowupQuestions: FchmaStructuredFollowupQuestion[];
  referenceItems: FchmaReferenceItem[];
};

export type FchmaFullAssessment = {
  consultation: string;
  extractedSignals: FchmaMinimalSignalPreview['extractedSignals'];
  deterministicFollowupQuestions: string[];
  matchedPatterns: FchmaRespondentPatternMatch[];
  aiAssessment: FchmaAiAssessment | null;
  aiError: string | null;
  providerId: 'openai_fchma' | 'deterministic_only';
  generatedAt: string;
};

// ---------------------------------------------------------------------------
// Prompt assembly
// ---------------------------------------------------------------------------

function buildDomainSummary(): string {
  return fchmaCausalFrameworkAtlas.domains
    .map((d) => `  ${d.id}: ${d.label}（${d.node_pattern.join('→')}）`)
    .join('\n');
}

function buildMotifSummary(): string {
  return fchmaCausalFrameworkAtlas.motifs
    .map((m) => `  ${m.id}: ${m.label}（${m.summary}）`)
    .join('\n');
}

function buildPatternContext(patterns: FchmaRespondentPatternMatch[]): string {
  if (!patterns.length) return '（類似パターン照合なし）';
  return patterns
    .map(
      (p, i) =>
        `パターン${i + 1}「${p.patternKey}」score=${p.score}: ${p.causalSummary}\n  介入ポート: ${p.interventionPorts.slice(0, 3).join('、')}`,
    )
    .join('\n');
}

function buildSystemPrompt(
  supportCatalogText: string,
  hwKnowledgeText: string,
  internationalText: string,
): string {
  return `あなたはFCHMA（Functional Causal Hypothesis Manifold Analysis）に基づく就労支援専門家アシスタントです。

## FCHMAの分析原則

就労困難は症状リストではなく「因果連鎖」として分析します。
- 問題の根源（Health / Environment / Person）が何で
- どの因果経路（活動困難→参加不安定化、環境ギャップ→困難増幅 など）を通じて
- 就労継続または就職に影響しているか

ICF（国際生活機能分類）相互作用モデルが分析の基盤です。
- Health Condition → Activities ⇄ Participation
- Environmental Factors（促進/阻害） / Personal Factors（強み/脆弱性）が相互作用

## FCHMA Causal Framework Atlas

### 8つの問題ドメイン
${buildDomainSummary()}

### 6つの因果モチーフ
${buildMotifSummary()}

分析では必ず primaryDomain（D1〜D8）と primaryMotif（M1〜M6）を特定してください。

## 実証された就労支援効果（回帰モデル検証済み）

${supportCatalogText}

係数が大きいほど支援効果が強い。支援提案はこのエビデンスを根拠に。

## 就労支援実践知識（ハローワーク事例から普遍化）

${hwKnowledgeText}

## 国際的配慮・支援エビデンス

${internationalText}

## 出力形式

以下のJSONを厳密に返してください（他のテキストは不要）:

{
  "primaryDomainId": "D1〜D8のいずれか",
  "primaryDomainLabel": "ドメインのラベル",
  "primaryMotifId": "M1〜M6のいずれか",
  "primaryMotifLabel": "モチーフのラベル",
  "frameworkSummary": "このケースの因果構造を1〜2文で説明",
  "structuralHypotheses": [
    {
      "label": "仮説の見出し（日本語で20字以内、例：活動制限から参加不安定へ）",
      "rationale": "なぜこの仮説が成立するかの説明（3〜5文）",
      "causalChain": "A → B → C 形式の因果連鎖",
      "keyElements": ["関与するICF要素の配列"],
      "amplifiers": ["困難を増幅する条件"],
      "protectors": ["困難を緩和する保護因子"],
      "interventionPoints": ["介入可能な連鎖上のポイント"],
      "confidence": "low|medium|high"
    }
  ],
  "interventionPlan": [
    {
      "title": "介入タイトル",
      "interventionType": "work_design|accommodation|support_linkage|self_management|employer_engagement",
      "ownerRole": "manager_or_hr|external_supporter|case_worker|person_self|医療機関",
      "rationale": "なぜこの介入が有効かの説明",
      "implementationNotes": ["具体的な実施ステップの配列"],
      "evidenceBasis": "どのエビデンスに基づくか（supports_model/hw_practice/international等）",
      "feasibility": "low|medium|high"
    }
  ],
  "followupQuestions": ["追加確認が必要な質問（必要なもののみ、最大4件）"],
  "structuredFollowupQuestions": [
    {
      "question": "追加確認の質問文",
      "suggestedOptions": ["選択肢A", "選択肢B", "選択肢C"]
    }
  ],
  "referenceItems": [
    {
      "title": "参照している具体的な知識・資料の名称（日本語で記述。例：AskJAN 職場配慮データベース、GLM回帰検証済み支援カタログ、治療と仕事の両立支援ガイドライン）",
      "summary": "内容の要点（このケースにどう関係するか）",
      "sourceType": "supports_model|hw_practice|international_guidance|guideline|manifold_pattern",
      "evidenceRole": "direct_basis|conditional_hypothesis|related_reading",
      "relevanceNote": "このケースとの関連性"
    }
  ]
}

## 分析の方針

1. まず primaryDomain と primaryMotif を決定する
2. 構造仮説は2〜3件、主仮説と対抗仮説を含める
3. 介入案は2〜4件、主仮説から導出し supports.md のエビデンスで根拠づける
4. followupQuestions は不足シグナルを1文の質問リストで最大4件。structuredFollowupQuestions は同じ質問を選択肢付きで提示——各質問に suggestedOptions を2〜4件付ける（選択肢は短く具体的に、「その他・自由記述」は含めない）
5. 参照資料は evidenceRole を必ず分類する（根拠と参考読み物を混ぜない）
6. 「症状がある→配慮が必要」ではなく「どの因果経路で何が困難になるか」を起点にする`;
}

function buildUserPrompt(
  consultation: string,
  signals: FchmaMinimalSignalPreview,
  patterns: FchmaRespondentPatternMatch[],
  additionalContext?: string,
): string {
  const { extractedSignals } = signals;

  const additionalSection = additionalContext
    ? `\n## 追加情報（フォローアップ回答）\n\n${additionalContext}\n`
    : '';

  return `## 相談内容

${consultation}
${additionalSection}
## 抽出されたシグナル

- 健康・体調: ${extractedSignals.healthConditions.join('、') || '（未検出）'}
- 仕事・場面: ${extractedSignals.workContext.join(' / ') || '（未検出）'}
- 困難: ${extractedSignals.difficultyContext.join(' / ') || '（未検出）'}
- 支援・配慮: ${extractedSignals.supportContext.join(' / ') || '（未検出）'}
- 開示状況: ${extractedSignals.disclosureContext.join(' / ') || '（未検出）'}
- 今後の希望: ${extractedSignals.futureContext.join(' / ') || '（未検出）'}

## マニフォールド由来パターン照合（実データ44パターンより）

${buildPatternContext(patterns)}

上記の情報をもとに、FCHMAアセスメントを生成してください。`;
}

// ---------------------------------------------------------------------------
// OpenAI API call
// ---------------------------------------------------------------------------

type OpenAiMessage = { role: 'system' | 'user'; content: string };

async function callOpenAiFchmaAssessment(
  messages: OpenAiMessage[],
  timeoutMs = 75000,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY が設定されていません。');

  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenAI API error ${response.status}: ${errText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenAI 応答が空です。');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

function enrichReferenceUrls(
  assessment: FchmaAiAssessment,
  pack: FchmaReferenceKnowledgePack,
): FchmaAiAssessment {
  return {
    ...assessment,
    referenceItems: assessment.referenceItems.map((item) => ({
      ...item,
      url: item.url ?? resolveReferenceItemUrl(item.sourceType, item.title, pack),
    })),
  };
}

function parseAiAssessmentResponse(raw: string): FchmaAiAssessment {
  const parsed = JSON.parse(raw) as Partial<FchmaAiAssessment>;

  return {
    primaryDomainId: parsed.primaryDomainId ?? 'D2',
    primaryDomainLabel: parsed.primaryDomainLabel ?? '仕事要求ミスマッチ',
    primaryMotifId: parsed.primaryMotifId ?? 'M1',
    primaryMotifLabel: parsed.primaryMotifLabel ?? '増幅',
    frameworkSummary: parsed.frameworkSummary ?? '',
    structuralHypotheses: Array.isArray(parsed.structuralHypotheses)
      ? parsed.structuralHypotheses
      : [],
    interventionPlan: Array.isArray(parsed.interventionPlan) ? parsed.interventionPlan : [],
    followupQuestions: Array.isArray(parsed.followupQuestions) ? parsed.followupQuestions : [],
    structuredFollowupQuestions: Array.isArray(parsed.structuredFollowupQuestions)
      ? parsed.structuredFollowupQuestions
      : [],
    referenceItems: Array.isArray(parsed.referenceItems) ? parsed.referenceItems : [],
  };
}

// ---------------------------------------------------------------------------
// Main orchestration entry point
// ---------------------------------------------------------------------------

export async function buildFchmaFullAssessment(
  consultation: string,
  additionalContext?: string,
): Promise<FchmaFullAssessment> {
  const generatedAt = new Date().toISOString();

  // Step 1: Deterministic signal extraction and minimal preview (fast, no API call)
  const signalPreview = buildFchmaMinimalSignalPreview(consultation);

  // Step 2: Manifold pattern matching (reads local JSON file)
  const matchedPatterns = await matchFchmaRespondentPatternsForPreview(signalPreview, 3);

  // Step 3: Load reference knowledge packs
  const pack = await getFchmaReferenceKnowledgePack();
  const supportCatalogText = formatSupportCatalogForPrompt(pack.supportCatalog);
  const hwKnowledgeText = formatHwKnowledgeForPrompt(pack.hwPractice);
  const internationalText = formatInternationalEvidenceForPrompt(pack.internationalEvidence);

  // Step 4: Build prompts and call AI
  const systemPrompt = buildSystemPrompt(supportCatalogText, hwKnowledgeText, internationalText);
  const userPrompt = buildUserPrompt(consultation, signalPreview, matchedPatterns, additionalContext);

  let aiAssessment: FchmaAiAssessment | null = null;
  let aiError: string | null = null;

  try {
    const rawResponse = await callOpenAiFchmaAssessment([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    const parsed = parseAiAssessmentResponse(rawResponse);
    aiAssessment = enrichReferenceUrls(parsed, pack);
  } catch (err) {
    aiError = err instanceof Error ? err.message : 'AI アセスメントの生成に失敗しました。';
  }

  return {
    consultation: consultation.trim(),
    extractedSignals: signalPreview.extractedSignals,
    deterministicFollowupQuestions: signalPreview.followupQuestions,
    matchedPatterns,
    aiAssessment,
    aiError,
    providerId: aiAssessment ? 'openai_fchma' : 'deterministic_only',
    generatedAt,
  };
}

