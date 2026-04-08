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
  formatIpsSEValidationForPrompt,
  formatPracticeCompassForPrompt,
  formatHwKnowledgeForPrompt,
  formatWorkshopVoicesForPrompt,
  formatInternationalEvidenceForPrompt,
  formatQ13NetworkForPrompt,
  resolveReferenceItemUrl,
  type FchmaReferenceKnowledgePack,
} from '@/lib/fchma/referenceKnowledgePack';

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export type FchmaStructuralHypothesis = {
  domainId: string;         // D1〜D8: どのドメインフレームからの仮説か
  domainLabel: string;
  motifId: string;          // M1〜M6: どの因果モチーフからの仮説か
  motifLabel: string;
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
  differentialPurpose?: string; // 1文：この質問でどの仮説を鑑別・確認するか
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
  ipsSEText: string,
  practiceCompassText: string,
  hwKnowledgeText: string,
  workshopVoicesText: string,
  internationalText: string,
  q13NetworkText: string,
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

## 実証された就労支援効果（支援者実践調査 n=3,053・ロジスティック回帰）

${supportCatalogText}

ΔはQ7課題の解決可能性認識上昇幅（外部連携型実施時 vs 自機関のみ）。ORは同条件のオッズ比。支援提案はこのエビデンスを根拠に。

## IPS/SE 8原則の日本データによる再検証

${ipsSEText}

## 実践転換の羅針盤（日本調査データより）

${practiceCompassText}

## 就労支援実践知識（ハローワーク事例から普遍化）

${hwKnowledgeText}

## ワークショップ実例知識（多職種連携・現場の声）

${workshopVoicesText}

## 機関ネットワーク参加とQ1転換効果（日本調査 Q13）

${q13NetworkText}

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
      "domainId": "D1〜D8のいずれか（この仮説のドメインフレーム）",
      "domainLabel": "ドメインのラベル",
      "motifId": "M1〜M6のいずれか（この仮説の因果モチーフ）",
      "motifLabel": "モチーフのラベル",
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
      "suggestedOptions": ["選択肢A", "選択肢B", "選択肢C"],
      "differentialPurpose": "この情報により〇〇仮説と△△仮説を鑑別します（または「△△支援の適用条件を確認します」）"
    }
  ],
  "referenceItems": [
    {
      "title": "参照している知識・資料の名称（短く簡潔に、20字以内を目安。例：AskJAN 職場配慮データベース、就労支援効果カタログ、治療と仕事の両立支援ガイドライン）",
      "summary": "内容の要点（このケースにどう関係するか）",
      "sourceType": "supports_model|hw_practice|international_guidance|guideline|manifold_pattern",
      "evidenceRole": "direct_basis|conditional_hypothesis|related_reading",
      "relevanceNote": "このケースとの関連性"
    }
  ]
}

## 4層知識の利用制約

介入案と構造仮説は、以下4層の知識から根拠を明示して取ること。一般論・印象論に圧縮してはならない。

①当事者データ: 障害者・難病当事者調査（n=4,553 / n=4,523）——どのような困難パターンが実際に観測されるか
②支援者データ: 支援者実践調査（n=3,053 ロジスティック回帰）——どの支援が効くか、なぜ実施されないか
③外部エビデンス: IPS/SE再検証・国際配慮データ（AskJAN、UK、EU等）・治療と仕事の両立支援ガイドライン
④実装主体の条件: 誰が（manager_or_hr / external_supporter / case_worker / person_self / 医療機関）実施するか、その現実的制約

各 interventionPlan の evidenceBasis には上記①〜④のどれを根拠とするかを明示すること。「一般的なアドバイス」「常識的対応」などは根拠として認めない。

## 分析の方針

【初回相談（フォローアップ履歴なし）の原則】

最初に入力された相談文は断片情報である。断片情報から仮説を一つに確定してはならない。

1. まず8ドメイン×6モチーフのアトラス全体を走査し、相談文から「活性化している可能性があるドメインとモチーフの組み合わせ」を複数特定する。これが競合仮説フレームのスキャンである

2. structuralHypotheses は必ず異なる domainId × motifId の組み合わせから2〜3件設定する。各仮説は独立したフレームからの解釈であり、同じ primaryDomain の言い換えや詳細化ではない。すべての仮説の confidence は low を基本とし、高くとも medium まで。断片情報で high は付けない

3. primaryDomain と primaryMotif は「最も可能性の高い競合仮説の代表フレーム」として選択する——確定ではなく、追加情報で別フレームに更新されることを前提とする

4. structuredFollowupQuestions の各質問には differentialPurpose を必ず付与し、「この回答で○○仮説（D?×M?）と△△仮説（D?×M?）を鑑別します」と、どのフレーム間の鑑別かを明示する。一つの仮説に決め打ちした前提の質問は不可

【フォローアップ情報がある場合】

5. 追加情報を踏まえて確信度を積極的に更新する。情報が揃ったフレームの仮説は low → medium → high に引き上げ、否定されたフレームの仮説は残さない
6. 既に回答済みの質問（追加情報の履歴に記録されているもの）は structuredFollowupQuestions に絶対に含めない
7. structuralHypotheses の中で最高 confidence が medium 以上になった時点で structuredFollowupQuestions を空配列 [] にすること。全仮説がまだ low の場合は引き続き鑑別質問を生成する（フォローアップ回数ではなく仮説の確信度で判断する）
8. medium 確信度は就労支援の現場では十分に行動可能な仮説であり「不完全」ではない。interventionPlan を強化・具体化することを優先する

【共通】

9. 介入案は2〜4件、必ず4層知識の根拠を明示して導出する
10. followupQuestions は不足シグナルを1文の質問リストで最大4件。structuredFollowupQuestions は同じ質問を選択肢付きで提示——各質問に suggestedOptions を2〜4件付ける（選択肢は短く具体的に、「その他・自由記述」は含めない）
11. 参照資料は evidenceRole を必ず分類する（根拠と参考読み物を混ぜない）
12. 「症状がある→配慮が必要」ではなく「どの因果経路で何が困難になるか」を起点にする`;
}

function buildUserPrompt(
  consultation: string,
  signals: FchmaMinimalSignalPreview,
  patterns: FchmaRespondentPatternMatch[],
  additionalContext?: string,
): string {
  const { extractedSignals } = signals;

  const additionalSection = additionalContext
    ? `\n## フォローアップ履歴（確認済みQ&A）\n\n【指示】以下は既に回答された内容です。(1) これらと同一または類似の質問を structuredFollowupQuestions に含めないこと。(2) これらの回答を踏まえ、仮説の確信度を積極的に更新すること。\n\n${additionalContext}\n`
    : '';

  const finalInstruction = additionalContext
    ? `上記の情報をもとに、FCHMAアセスメントを生成してください。フォローアップ履歴の回答を反映して確信度を更新し、確認済みの質問は絶対に繰り返さないこと。`
    : `上記の情報をもとに、FCHMAアセスメントを生成してください。`;

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

${finalInstruction}`;
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
  const ipsSEText = formatIpsSEValidationForPrompt(pack.ipsSEValidation);
  const practiceCompassText = formatPracticeCompassForPrompt(pack.practiceCompass);
  const hwKnowledgeText = formatHwKnowledgeForPrompt(pack.hwPractice);
  const workshopVoicesText = formatWorkshopVoicesForPrompt(pack.workshopVoices);
  const internationalText = formatInternationalEvidenceForPrompt(pack.internationalEvidence);
  const q13NetworkText = formatQ13NetworkForPrompt(pack.q13NetworkData);

  // Step 4: Build prompts and call AI
  const systemPrompt = buildSystemPrompt(supportCatalogText, ipsSEText, practiceCompassText, hwKnowledgeText, workshopVoicesText, internationalText, q13NetworkText);
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

