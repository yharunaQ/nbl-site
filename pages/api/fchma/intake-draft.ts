import type { NextApiRequest, NextApiResponse } from 'next';
import {
  buildFchmaIntakeDraftPreview,
  type FchmaIntakeDraftPayload,
} from '@/lib/fchma/intakeDraft';

function isPayload(value: unknown): value is FchmaIntakeDraftPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.title === 'string' &&
    typeof candidate.primaryGoal === 'string' &&
    typeof candidate.respondentProfile === 'string' &&
    typeof candidate.healthCondition === 'string' &&
    typeof candidate.workStatus === 'string' &&
    typeof candidate.difficulty === 'string' &&
    typeof candidate.supportAndAccommodation === 'string' &&
    typeof candidate.disclosure === 'string' &&
    typeof candidate.futureOutlook === 'string' &&
    typeof candidate.narratives === 'string'
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isPayload(req.body)) {
    return res.status(400).json({ error: 'Invalid intake payload' });
  }

  return res.status(200).json(buildFchmaIntakeDraftPreview(req.body));
}
