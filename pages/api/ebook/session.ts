import type { NextApiRequest, NextApiResponse } from 'next';
import {
  EBOOK_PRODUCT_CODE,
  getEbookRuntimeConfig,
  resolveRequestOrigin,
} from '@/lib/ebook/config';
import { retrieveStripeCheckoutSession } from '@/lib/ebook/stripeApi';
import { buildEbookDownloadToken } from '@/lib/ebook/token';

type SessionResponse =
  | {
      ok: true;
      paid: true;
      sessionId: string;
      amountTotal: number | null;
      currency: string | null;
      customerEmail: string | null;
      downloadUrl: string;
      expiresAt: string;
    }
  | { ok: false; paid: false; error: string };

function readSessionId(req: NextApiRequest): string {
  const raw = req.query.session_id;
  if (Array.isArray(raw)) return String(raw[0] || '').trim();
  return String(raw || '').trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SessionResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, paid: false, error: 'Method not allowed' });
  }

  const sessionId = readSessionId(req);
  if (!sessionId) {
    return res.status(400).json({ ok: false, paid: false, error: 'session_id is required' });
  }

  try {
    const config = getEbookRuntimeConfig();
    const session = await retrieveStripeCheckoutSession({
      secretKey: config.stripeSecretKey,
      sessionId,
    });

    const paid = session.status === 'complete' && session.payment_status === 'paid';
    if (!paid) {
      return res.status(402).json({
        ok: false,
        paid: false,
        error: 'Payment is not completed',
      });
    }

    const productCode = String(session?.metadata?.product_code || '');
    if (productCode && productCode !== EBOOK_PRODUCT_CODE) {
      return res.status(403).json({
        ok: false,
        paid: false,
        error: 'This session is not valid for the guidebook product',
      });
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const expiresSec = nowSec + Math.max(300, Number(config.downloadTokenTtlSec || 7200));
    const token = buildEbookDownloadToken(
      {
        sid: sessionId,
        prod: EBOOK_PRODUCT_CODE,
        exp: expiresSec,
      },
      config.downloadTokenSecret,
    );

    const forcedOrigin = String(process.env.JAC_GUIDEBOOK_PUBLIC_ORIGIN || '').trim();
    const origin = forcedOrigin || resolveRequestOrigin(req);
    const downloadUrl = new URL(
      `/api/ebook/download?token=${encodeURIComponent(token)}`,
      origin,
    ).toString();

    return res.status(200).json({
      ok: true,
      paid: true,
      sessionId: sessionId,
      amountTotal: typeof session.amount_total === 'number' ? session.amount_total : null,
      currency: session.currency || null,
      customerEmail: session.customer_email || null,
      downloadUrl,
      expiresAt: new Date(expiresSec * 1000).toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      paid: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment session',
    });
  }
}
