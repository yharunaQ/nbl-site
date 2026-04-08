import type { NextApiRequest, NextApiResponse } from 'next';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';

type SynthesisRequest = {
  consultation: string;
  frameworkSummary: string;
  selectedHypotheses: Array<{ label: string; causalChain?: string }>;
  selectedInterventions: Array<{ title: string; ownerRole?: string }>;
};

type SynthesisResponse = { synthesis: string } | { error: string };

function buildSynthesisPrompt(req: SynthesisRequest): string {
  const hypothesesText = req.selectedHypotheses
    .map((h, i) => `  ${i + 1}. ${h.label}${h.causalChain ? `（${h.causalChain}）` : ''}`)
    .join('\n');

  const interventionsText = req.selectedInterventions
    .map((v, i) => `  ${i + 1}. ${v.title}${v.ownerRole ? `（担当: ${v.ownerRole}）` : ''}`)
    .join('\n');

  return `以下の就労支援相談の内容と見立てをもとに、総合的な解説を日本語で4〜6文で書いてください。

## 相談内容

${req.consultation}

## AIの見立て要旨

${req.frameworkSummary || '（なし）'}

## 相談者が選択した仮説

${hypothesesText || '（選択なし）'}

## 相談者が選択した支援案

${interventionsText || '（選択なし）'}

## 出力のルール

- 「今回の相談から〜」「選択された仮説に基づき〜」など、文書として自然な書き出しにする
- 選択された仮説と支援案の関係を説明し、なぜその支援が有効かを簡潔に述べる
- 専門用語をそのまま使わず、支援者・当事者双方が読める平易な日本語にする
- 最後の文で「最終的な判断と実施は支援者が行う」という趣旨を一文含める
- JSONや箇条書きではなく、地の文のみで返す`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SynthesisResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const guard = await guardJacApiRequest(req, { route: 'jac-synthesis', costly: true });
  if (!guard.ok) {
    return res.status(guard.status).json({ error: guard.error });
  }

  const body = req.body as Partial<SynthesisRequest>;
  if (!body.consultation) {
    return res.status(400).json({ error: 'consultation が必要です。' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY が設定されていません。' });
  }

  const prompt = buildSynthesisPrompt({
    consultation: body.consultation,
    frameworkSummary: body.frameworkSummary ?? '',
    selectedHypotheses: body.selectedHypotheses ?? [],
    selectedInterventions: body.selectedInterventions ?? [],
  });

  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return res.status(502).json({ error: `OpenAI API error ${response.status}: ${errText}` });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const synthesis = data.choices?.[0]?.message?.content?.trim() ?? '';
    if (!synthesis) {
      return res.status(502).json({ error: 'AI応答が空です。' });
    }

    return res.status(200).json({ synthesis });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
