type StripeCheckoutSession = {
  id: string;
  url: string | null;
  status: string | null;
  payment_status: string | null;
  amount_total: number | null;
  currency: string | null;
  customer_email: string | null;
  metadata?: Record<string, string>;
};

async function stripeFetch(
  endpoint: string,
  options: {
    method: 'GET' | 'POST';
    secretKey: string;
    body?: URLSearchParams;
  },
): Promise<unknown> {
  const response = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${options.secretKey}`,
      ...(options.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: options.body ? options.body.toString() : undefined,
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
    [key: string]: unknown;
  };
  if (!response.ok) {
    const reason = payload?.error?.message || `Stripe API request failed (${response.status})`;
    throw new Error(reason);
  }
  return payload;
}

export async function createStripeCheckoutSession(params: {
  secretKey: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  productCode: string;
}): Promise<StripeCheckoutSession> {
  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('line_items[0][price]', params.priceId);
  body.set('line_items[0][quantity]', '1');
  body.set('success_url', params.successUrl);
  body.set('cancel_url', params.cancelUrl);
  body.set('metadata[product_code]', params.productCode);
  body.set('allow_promotion_codes', 'true');

  const raw = (await stripeFetch('checkout/sessions', {
    method: 'POST',
    secretKey: params.secretKey,
    body,
  })) as StripeCheckoutSession;

  return raw;
}

export async function retrieveStripeCheckoutSession(params: {
  secretKey: string;
  sessionId: string;
}): Promise<StripeCheckoutSession> {
  const raw = (await stripeFetch(`checkout/sessions/${encodeURIComponent(params.sessionId)}`, {
    method: 'GET',
    secretKey: params.secretKey,
  })) as StripeCheckoutSession;

  return raw;
}
