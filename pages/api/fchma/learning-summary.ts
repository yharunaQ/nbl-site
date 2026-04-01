import type { NextApiRequest, NextApiResponse } from 'next';
import { getFchmaCaseRepository } from '@/lib/fchma/caseRepository';
import {
  buildFchmaLearningSummary,
  type FchmaLearningSummary,
} from '@/lib/fchma/learningSummary';

type LearningSummaryApiResponse = FchmaLearningSummary | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LearningSummaryApiResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const repository = getFchmaCaseRepository();
  const cases = await repository.listCases();
  return res.status(200).json(buildFchmaLearningSummary(cases));
}
