import type { NextApiRequest, NextApiResponse } from 'next';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';
import {
  buildFchmaFullAssessment,
  type FchmaFullAssessment,
} from '@/lib/fchma/aiAssessmentOrchestration';

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FchmaFullAssessment | ErrorResponse>,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const guard = await guardJacApiRequest(req, {
    route: 'fchma-assess',
    costly: true,
    tokenLimited: true,
  });

  if (!guard.ok) {
    res.status(guard.status).json({ error: guard.error });
    return;
  }

  const { consultation, additionalContext } = req.body as {
    consultation?: unknown;
    additionalContext?: unknown;
  };

  if (typeof consultation !== 'string' || consultation.trim().length < 8) {
    res.status(400).json({ error: '相談文は8文字以上で入力してください。' });
    return;
  }

  if (consultation.length > 8000) {
    res.status(400).json({ error: '相談文は8000文字以内にしてください。' });
    return;
  }

  const additionalCtx =
    typeof additionalContext === 'string' && additionalContext.trim().length > 0
      ? additionalContext.trim().slice(0, 2000)
      : undefined;

  try {
    const assessment = await buildFchmaFullAssessment(consultation.trim(), additionalCtx);
    res.status(200).json(assessment);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'アセスメントの生成に失敗しました。';
    res.status(500).json({ error: message });
  }
}
