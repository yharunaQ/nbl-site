import type { NextApiRequest, NextApiResponse } from 'next';
import { getFchmaCaseRepository, type FchmaCaseRecord } from '@/lib/fchma/caseRepository';
import { isFchmaIntakeDraftPayload } from '@/lib/fchma/payloadGuards';

type CasesApiResponse =
  | { cases: FchmaCaseRecord[] }
  | { caseRecord: FchmaCaseRecord }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CasesApiResponse>,
) {
  const repository = getFchmaCaseRepository();

  if (req.method === 'GET') {
    const cases = await repository.listCases();
    return res.status(200).json({ cases });
  }

  if (req.method === 'POST') {
    if (!isFchmaIntakeDraftPayload(req.body)) {
      return res.status(400).json({ error: 'Invalid intake payload' });
    }

    try {
      const caseRecord = await repository.createCase(req.body);
      return res.status(201).json({ caseRecord });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'ケースを保存できませんでした。',
      });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
