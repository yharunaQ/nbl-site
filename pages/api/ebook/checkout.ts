import type { NextApiRequest, NextApiResponse } from 'next';
import {
  EBOOK_PRODUCT_CODE,
  getEbookRuntimeConfig,
  resolveRequestOrigin,
} from '@/lib/ebook/config';
import { createStripeCheckoutSession } from '@/lib/ebook/stripeApi';

type CheckoutResponse =
  | { checkoutUrl: string; sessionId: string }
  | { error: string };

function buildSuccessUrl(origin: string, successPath: string): string {
  const url = new URL(successPath, origin);
  url.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
  return url.toString();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = getEbookRuntimeConfig();
    const forcedOrigin = String(process.env.JAC_GUIDEBOOK_PUBLIC_ORIGIN || '').trim();
    const origin = forcedOrigin || resolveRequestOrigin(req);
    const successUrl = buildSuccessUrl(origin, config.successPath);
    const cancelUrl = new URL(config.cancelPath, origin).toString();

    const session = await createStripeCheckoutSession({
      secretKey: config.stripeSecretKey,
      priceId: config.stripePriceId,
      successUrl,
      cancelUrl,
      productCode: EBOOK_PRODUCT_CODE,
    });

    if (!session.url) {
      return res.status(502).json({ error: 'Stripe checkout URL is not available' });
    }

    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: String(session.id || ''),
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    });
  }
}
