import type { NextApiRequest, NextApiResponse } from 'next';
import { buildFchmaReasoningBundle } from '@/lib/fchma/orchestration';
import { isFchmaIntakeDraftPayload } from '@/lib/fchma/payloadGuards';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isFchmaIntakeDraftPayload(req.body)) {
    return res.status(400).json({ error: 'Invalid intake payload' });
  }

  return res.status(200).json(buildFchmaReasoningBundle(req.body).structurePreview);
}
