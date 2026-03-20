import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createProposal,
  listProposals,
} from '@/lib/daoParticipationLab/store';
import type { Proposal } from '@/lib/daoParticipationLab/types';

type ProposalsResponse =
  | { proposals: Proposal[] }
  | { proposal: Proposal }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProposalsResponse>,
) {
  if (req.method === 'GET') {
    const proposals = await listProposals();
    return res.status(200).json({ proposals });
  }

  if (req.method === 'POST') {
    try {
      const proposal = await createProposal({
        title: String(req.body?.title || ''),
        summary: String(req.body?.summary || ''),
        proposer: String(req.body?.proposer || ''),
      });
      return res.status(201).json({ proposal });
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : '提案を作成できませんでした。',
      });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
