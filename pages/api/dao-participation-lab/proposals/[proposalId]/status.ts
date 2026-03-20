import type { NextApiRequest, NextApiResponse } from 'next';
import { updateProposalStatus } from '@/lib/daoParticipationLab/store';
import { isProposalStatus, type Proposal } from '@/lib/daoParticipationLab/types';

type StatusResponse = { proposal: Proposal } | { error: string };

function readProposalId(req: NextApiRequest): string {
  const raw = req.query.proposalId;
  if (Array.isArray(raw)) return String(raw[0] || '').trim();
  return String(raw || '').trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse>,
) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const status = String(req.body?.status || '').trim();
  if (!isProposalStatus(status)) {
    return res.status(400).json({ error: '不正な状態です。' });
  }

  try {
    const proposal = await updateProposalStatus(readProposalId(req), status);
    return res.status(200).json({ proposal });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : '状態を更新できませんでした。',
    });
  }
}
