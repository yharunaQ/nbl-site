import type { NextApiRequest, NextApiResponse } from 'next';
import { getFchmaCaseRepository, type FchmaCaseRecord } from '@/lib/fchma/caseRepository';

type CaseApiResponse = { caseRecord: FchmaCaseRecord } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CaseApiResponse>,
) {
  const repository = getFchmaCaseRepository();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const caseId = String(req.query.caseId || '').trim();
  if (!caseId) {
    return res.status(400).json({ error: 'Case id is required' });
  }

  const caseRecord = await repository.getCase(caseId);
  if (!caseRecord) {
    return res.status(404).json({ error: 'Case not found' });
  }

  return res.status(200).json({ caseRecord });
}
