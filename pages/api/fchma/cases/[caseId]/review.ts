import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFchmaCaseRepository,
  type FchmaCaseRecord,
  type SaveFchmaCaseReviewInput,
} from '@/lib/fchma/caseRepository';

type CaseReviewApiResponse = { caseRecord: FchmaCaseRecord } | { error: string };

function isReviewInput(value: unknown): value is SaveFchmaCaseReviewInput {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.reviewerDecision === 'string' &&
    (candidate.reviewNotes === undefined || typeof candidate.reviewNotes === 'string') &&
    (candidate.selectedHypotheses === undefined || Array.isArray(candidate.selectedHypotheses)) &&
    (candidate.selectedInterventions === undefined ||
      Array.isArray(candidate.selectedInterventions))
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CaseReviewApiResponse>,
) {
  const repository = getFchmaCaseRepository();
  const caseId = String(req.query.caseId || '').trim();
  if (!caseId) {
    return res.status(400).json({ error: 'Case id is required' });
  }

  if (req.method === 'GET') {
    const caseRecord = await repository.getCase(caseId);
    if (!caseRecord) {
      return res.status(404).json({ error: 'Case not found' });
    }

    return res.status(200).json({ caseRecord });
  }

  if (req.method === 'POST') {
    if (!isReviewInput(req.body)) {
      return res.status(400).json({ error: 'Invalid review payload' });
    }

    const caseRecord = await repository.saveReview(caseId, req.body);
    if (!caseRecord) {
      return res.status(404).json({ error: 'Case not found' });
    }

    return res.status(200).json({ caseRecord });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
