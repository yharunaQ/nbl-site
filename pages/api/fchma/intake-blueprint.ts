import type { NextApiRequest, NextApiResponse } from 'next';
import { buildFchmaIntakeBlueprint } from '@/lib/fchma/intakeBlueprint';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json(buildFchmaIntakeBlueprint());
}
