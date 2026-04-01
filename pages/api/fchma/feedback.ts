import type { NextApiRequest, NextApiResponse } from 'next';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';

type FeedbackPayload = {
  generatedAt?: string;
  selectedItems: Array<{
    title: string;
    interventionType: string;
    ownerRole: string;
  }>;
};

type ResponseBody = { ok: true } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const guard = await guardJacApiRequest(req, {
    route: 'fchma-feedback',
    costly: false,
    tokenLimited: false,
  });

  if (!guard.ok) {
    res.status(guard.status).json({ error: guard.error });
    return;
  }

  const body = req.body as Partial<FeedbackPayload>;
  const selectedItems = Array.isArray(body.selectedItems) ? body.selectedItems : [];

  if (!selectedItems.length) {
    res.status(200).json({ ok: true });
    return;
  }

  const record = {
    recordedAt: new Date().toISOString(),
    generatedAt: body.generatedAt ?? null,
    selectedItems,
  };

  try {
    const dir = path.join(process.cwd(), 'references', 'jac', 'feedback');
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, 'agreement-selections.jsonl');
    await appendFile(file, JSON.stringify(record) + '\n', 'utf-8');
  } catch {
    // Logging is best-effort — don't fail the user request
  }

  res.status(200).json({ ok: true });
}
