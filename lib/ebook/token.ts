import crypto from 'node:crypto';

type EbookTokenPayload = {
  sid: string;
  prod: string;
  exp: number;
};

function toBase64Url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function sign(value: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function buildEbookDownloadToken(
  payload: EbookTokenPayload,
  secret: string,
): string {
  const serialized = JSON.stringify(payload);
  const encoded = toBase64Url(serialized);
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyEbookDownloadToken(
  token: string,
  secret: string,
): EbookTokenPayload | null {
  const [encoded, signature] = String(token || '').split('.');
  if (!encoded || !signature) return null;
  const expectedSignature = sign(encoded, secret);

  const a = new Uint8Array(Buffer.from(signature));
  const b = new Uint8Array(Buffer.from(expectedSignature));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as EbookTokenPayload;
    if (!payload || typeof payload !== 'object') return null;
    if (!payload.sid || !payload.prod || !payload.exp) return null;
    if (Number(payload.exp) <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
