import type { NextApiRequest, NextApiResponse } from 'next';
import { buildAgenticPlan } from '@/lib/knowledge/agenticPlanner';
import { PlannerInput } from '@/lib/knowledge/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body as PlannerInput;
    if (!body?.query || body.query.trim().length === 0) {
        return res.status(400).json({ error: 'query is required' });
    }

    const plan = buildAgenticPlan(body);
    return res.status(200).json({ plan });
}
