import type { NextApiRequest, NextApiResponse } from 'next';
import { addProposalComment } from '@/lib/daoParticipationLab/store';
import type { Proposal } from '@/lib/daoParticipationLab/types';

type CommentResponse = { proposal: Proposal } | { error: string };

function readProposalId(req: NextApiRequest): string {
  const raw = req.query.proposalId;
  if (Array.isArray(raw)) return String(raw[0] || '').trim();
  return String(raw || '').trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const proposal = await addProposalComment(readProposalId(req), {
      author: String(req.body?.author || ''),
      body: String(req.body?.body || ''),
    });
    return res.status(201).json({ proposal });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'コメントを追加できませんでした。',
    });
  }
}
