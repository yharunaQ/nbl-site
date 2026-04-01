import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFchmaCaseRepository,
  type AppendFchmaCaseFeedbackInput,
  type FchmaCaseRecord,
} from '@/lib/fchma/caseRepository';

type CaseFeedbackApiResponse = { caseRecord: FchmaCaseRecord } | { error: string };

function isFeedbackInput(value: unknown): value is AppendFchmaCaseFeedbackInput {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.selectedInterventionTitle === 'string' &&
    typeof candidate.implemented === 'boolean' &&
    (candidate.implementationNotes === undefined ||
      typeof candidate.implementationNotes === 'string') &&
    (candidate.observedEffect === undefined || typeof candidate.observedEffect === 'string') &&
    (candidate.unresolvedIssues === undefined ||
      typeof candidate.unresolvedIssues === 'string') &&
    (candidate.updatedStructureNotes === undefined ||
      typeof candidate.updatedStructureNotes === 'string') &&
    (candidate.reviewerSummary === undefined || typeof candidate.reviewerSummary === 'string')
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CaseFeedbackApiResponse>,
) {
  const repository = getFchmaCaseRepository();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const caseId = String(req.query.caseId || '').trim();
  if (!caseId) {
    return res.status(400).json({ error: 'Case id is required' });
  }

  if (!isFeedbackInput(req.body)) {
    return res.status(400).json({ error: 'Invalid feedback payload' });
  }

  try {
    const caseRecord = await repository.appendFeedback(caseId, req.body);
    if (!caseRecord) {
      return res.status(404).json({ error: 'Case not found' });
    }

    return res.status(200).json({ caseRecord });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Feedback save failed',
    });
  }
}
