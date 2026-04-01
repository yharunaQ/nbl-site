import type { NextApiRequest, NextApiResponse } from 'next';
import { buildFchmaMinimalSignalPreview } from '@/lib/fchma/minimalIntake';
import { matchFchmaRespondentPatternsForPreview } from '@/lib/fchma/respondentPatternMatcher';

type MinimalPreviewRequestBody = {
  consultation: string;
};

function isMinimalPreviewRequestBody(value: unknown): value is MinimalPreviewRequestBody {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof (value as Record<string, unknown>).consultation === 'string';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isMinimalPreviewRequestBody(req.body)) {
    return res.status(400).json({ error: 'Invalid minimal preview request' });
  }

  const consultation = req.body.consultation.trim();
  if (consultation.length < 8) {
    return res.status(400).json({ error: 'Consultation is too short' });
  }

  const preview = buildFchmaMinimalSignalPreview(consultation);
  const matchedPatterns = await matchFchmaRespondentPatternsForPreview(preview);

  return res.status(200).json({
    ...preview,
    matchedPatterns,
  });
}
