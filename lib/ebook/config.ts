import type { NextApiRequest } from 'next';
import path from 'node:path';

export const EBOOK_PRODUCT_CODE = 'jac_guidebook_v1';

export type EbookRuntimeConfig = {
  stripeSecretKey: string;
  stripePriceId: string;
  downloadTokenSecret: string;
  downloadTokenTtlSec: number;
  ebookFilePath: string;
  ebookFileName: string;
  successPath: string;
  cancelPath: string;
};

function requiredEnv(name: string): string {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  const value = String(process.env[name] || '').trim();
  return value || fallback;
}

export function getEbookRuntimeConfig(): EbookRuntimeConfig {
  const ebookFilePath = path.resolve(
    process.cwd(),
    optionalEnv('JAC_GUIDEBOOK_FILE_PATH', 'public/ebooks/jac-guidebook.pdf'),
  );

  return {
    stripeSecretKey: requiredEnv('STRIPE_SECRET_KEY'),
    stripePriceId: requiredEnv('JAC_GUIDEBOOK_STRIPE_PRICE_ID'),
    downloadTokenSecret: requiredEnv('JAC_GUIDEBOOK_DOWNLOAD_TOKEN_SECRET'),
    downloadTokenTtlSec: Number(process.env.JAC_GUIDEBOOK_DOWNLOAD_TOKEN_TTL_SEC || 7200),
    ebookFilePath,
    ebookFileName: optionalEnv('JAC_GUIDEBOOK_FILE_NAME', 'jac-guidebook.pdf'),
    successPath: optionalEnv('JAC_GUIDEBOOK_SUCCESS_PATH', '/jac/guidebook/success'),
    cancelPath: optionalEnv('JAC_GUIDEBOOK_CANCEL_PATH', '/jac/guidebook?canceled=1'),
  };
}

export function resolveRequestOrigin(req: NextApiRequest): string {
  const protoHeader = String(req.headers['x-forwarded-proto'] || '').split(',')[0]?.trim();
  const hostHeader = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0]
    ?.trim();
  const protocol = protoHeader || 'https';
  if (!hostHeader) {
    throw new Error('Cannot resolve request host');
  }
  return `${protocol}://${hostHeader}`;
}
