import type { NextApiRequest, NextApiResponse } from 'next';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';
import { getSupportCatalogBundle } from '@/lib/jac/supportCatalog';
import {
  buildRegionalSupportPromptGuidance,
  REGIONAL_SUPPORT_POSITIONING_DETAIL,
  REGIONAL_SUPPORT_PROMPT_RULES,
} from '@/lib/jac/regionalSupportPositioning';
import {
  buildSelectedTagContractSummary,
  buildStepContractPromptGuidance,
} from '@/lib/jac/stepContract';
import type { TagGroupKey } from '@/lib/jac/tagTaxonomy';

export type FollowupSuggestResponse = {
  hypotheses: string[];
  questions: string[];
  regional_support_hints: string[];
};

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_TIMEOUT_MS = 8000;

function dedupeQuestions(items: string[], maxCount = 4): string[] {
  return Array.from(new Set(items.filter((item) => typeof item === 'string' && item.trim()))).slice(
    0,
    maxCount,
  );
}

function buildFallback(regionalSupportHints: string[] = []): FollowupSuggestResponse {
  const normalizedRegionalSupportHints = dedupeQuestions(regionalSupportHints);
  return {
    hypotheses: [],
    questions: dedupeQuestions([
      '困りごとが出やすい場面・タイミング・頻度は？',
      '体調や症状の出方のパターンは？（時間帯・悪化しやすい条件など）',
      'これまで試した工夫や配慮で、効果があったこと・うまくいかなかったことは？',
      '変えたくないこと、または優先して守りたい条件は？',
    ]),
    regional_support_hints: normalizedRegionalSupportHints,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FollowupSuggestResponse | { error: string }>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const guard = await guardJacApiRequest(req, {
    route: 'jac-followup-suggest',
    costly: true,
    tokenLimited: false,
  });
  if (!guard.ok) {
    return res.status(guard.status).json({ error: guard.error });
  }

  const consultation = String(req.body?.consultation || '').trim();
  const selectedTags = req.body?.selectedTags || {};

  if (!consultation) {
    return res.status(400).json({ error: 'consultation が必要です。' });
  }

  const tagSummary = Object.entries(selectedTags as Record<string, string[]>)
    .filter(([, tags]) => tags.length > 0)
    .map(([group, tags]) => `${group}: ${tags.join('、')}`)
    .join('\n');
  const supportCatalogBundle = await getSupportCatalogBundle(consultation, selectedTags, {
    maxIssues: 3,
    maxSuggestions: 4,
    maxQuestions: 4,
  }).catch(() => ({ suggestions: [], promptIssues: [], followupHints: [] }));
  const regionalSupportHints = dedupeQuestions(supportCatalogBundle.followupHints);

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json(buildFallback(regionalSupportHints));
  }

  const systemPrompt = `あなたは職業リハビリテーションの専門家です。
相談文と選択されたタグをもとに、以下を順に行ってください：

1. 職業的課題として考えられる仮説を2〜3つ立てる（例：発達特性による実行機能の困難、不安障害による対人回避など）
2. それらの仮説を鑑別・確定するために相談文から読み取れない情報を特定する
3. その情報を引き出す追加質問を2〜4問生成する

【制約】
- 相談文にすでに記載されている情報を再確認しない
- 各質問は特定の仮説の鑑別に直結する具体的な問いにする
- 「わかる範囲で」答えられる問い方にする
- selected_tags は見落とし防止の粗い入口情報であり、タグの再確認を目的にしない
- support_catalog_context がある場合は、職場での個別調整を地域支援がどう支えられるかという文脈で必要な不足情報を問う
- 地域支援への接続それ自体を目的化せず、どの個別調整を、どの場面で、どう支える必要があるかにつなげる
- 地域支援を独立した解決レーンとして扱わない

${buildRegionalSupportPromptGuidance()}
${buildStepContractPromptGuidance()}
- JSONのみ出力`;

  const userPrompt = JSON.stringify({
    consultation,
    selected_tags: tagSummary || '（未選択）',
    selected_tag_contract: buildSelectedTagContractSummary(
      (selectedTags as Record<TagGroupKey, string[]>) || {
        situation: [],
        task: [],
        symptom: [],
        environment: [],
        preference: [],
      },
    ),
    support_catalog_context: {
      positioning_summary: REGIONAL_SUPPORT_POSITIONING_DETAIL,
      reasoning_rules: REGIONAL_SUPPORT_PROMPT_RULES,
      prompt_issues: supportCatalogBundle.promptIssues,
      followup_hints: supportCatalogBundle.followupHints,
    },
  });

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'jac_followup_suggest',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                hypotheses: { type: 'array', items: { type: 'string' } },
                questions: { type: 'array', items: { type: 'string' } },
              },
              required: ['hypotheses', 'questions'],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
    });

    if (!response.ok) {
      return res.status(200).json(buildFallback(regionalSupportHints));
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(200).json(buildFallback(regionalSupportHints));
    }

    const parsed = JSON.parse(content) as { hypotheses?: unknown; questions?: unknown };
    const hypotheses = Array.isArray(parsed.hypotheses)
      ? (parsed.hypotheses.filter((h) => typeof h === 'string') as string[]).slice(0, 3)
      : [];
    const questions = Array.isArray(parsed.questions)
      ? (parsed.questions.filter((q) => typeof q === 'string') as string[]).slice(0, 4)
      : [];

    if (questions.length === 0) {
      return res.status(200).json(buildFallback(regionalSupportHints));
    }

    return res.status(200).json({
      hypotheses,
      questions: dedupeQuestions(questions),
      regional_support_hints: regionalSupportHints,
    });
  } catch {
    return res.status(200).json(buildFallback(regionalSupportHints));
  }
}
