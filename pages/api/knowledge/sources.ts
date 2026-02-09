import type { NextApiRequest, NextApiResponse } from 'next';
import { listKnowledgeSources } from '@/lib/knowledge/sourceRegistry';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
    return res.status(200).json({
        sources: listKnowledgeSources(),
    });
}
