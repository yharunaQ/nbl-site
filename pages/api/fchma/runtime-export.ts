import type { NextApiRequest, NextApiResponse } from 'next';
import { getFchmaCaseRepository } from '@/lib/fchma/caseRepository';
import {
  buildFchmaRuntimePostgresExportBundle,
  type FchmaRuntimePostgresExportBundle,
} from '@/lib/fchma/runtimePostgresExport';

type RuntimeExportApiResponse =
  | { summary: FchmaRuntimePostgresExportBundle['summary']; contractVersion: string; generatedAt: string }
  | FchmaRuntimePostgresExportBundle
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RuntimeExportApiResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const includeRows = String(req.query.includeRows || '').trim() === '1';
  const repository = getFchmaCaseRepository();
  const bundle = buildFchmaRuntimePostgresExportBundle(await repository.listCases());

  if (includeRows) {
    return res.status(200).json(bundle);
  }

  return res.status(200).json({
    summary: bundle.summary,
    contractVersion: bundle.contractVersion,
    generatedAt: bundle.generatedAt,
  });
}
