/**
 * NBL Song Reactions Worker
 *
 * Endpoints:
 *   GET  /get?slug=<slug>              → { slug, likes, plays, shares }
 *   GET  /top?metric=likes&limit=5     → [{ slug, value }, ...]
 *   POST /like   { slug }              → { slug, likes }   (1回/IP/日/曲)
 *   POST /play   { slug }              → { slug, plays }   (1回/IP/10分/曲)
 *   POST /share  { slug, platform }    → { slug, shares }
 */

export interface Env {
  REACTIONS_KV: KVNamespace;
  ALLOWED_ORIGIN: string;
}

// ---------- helpers ----------

function cors(env: Env, origin: string | null): Record<string, string> {
  const allowed = env.ALLOWED_ORIGIN || '*';
  const allowedOrigin =
    allowed === '*' || (origin && origin === allowed) ? (origin ?? '*') : allowed;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

async function getCount(kv: KVNamespace, key: string): Promise<number> {
  const val = await kv.get(key);
  return val ? parseInt(val, 10) : 0;
}

async function increment(kv: KVNamespace, key: string): Promise<number> {
  const current = await getCount(kv, key);
  const next = current + 1;
  await kv.put(key, String(next));
  return next;
}

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function todayJST(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

// ---------- route handlers ----------

async function handleGet(
  url: URL,
  kv: KVNamespace,
  headers: Record<string, string>,
): Promise<Response> {
  const slug = url.searchParams.get('slug');
  if (!slug) return json({ error: 'slug required' }, 400, headers);

  const [likes, plays, shares] = await Promise.all([
    getCount(kv, `song:${slug}:likes`),
    getCount(kv, `song:${slug}:plays`),
    getCount(kv, `song:${slug}:shares`),
  ]);

  return json({ slug, likes, plays, shares }, 200, {
    ...headers,
    'Cache-Control': 'public, max-age=30',
  });
}

async function handleTop(
  url: URL,
  kv: KVNamespace,
  headers: Record<string, string>,
): Promise<Response> {
  const metric = url.searchParams.get('metric') ?? 'likes';
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '5', 10), 20);

  // Read cached top list (updated on every write)
  const cacheKey = `top:${metric}`;
  const cached = await kv.get(cacheKey);
  if (cached) {
    const data = JSON.parse(cached) as Array<{ slug: string; value: number }>;
    return json(data.slice(0, limit), 200, {
      ...headers,
      'Cache-Control': 'public, max-age=60',
    });
  }

  return json([], 200, { ...headers, 'Cache-Control': 'public, max-age=60' });
}

async function handleLike(
  body: Record<string, string>,
  req: Request,
  kv: KVNamespace,
  headers: Record<string, string>,
): Promise<Response> {
  const { slug } = body;
  if (!slug) return json({ error: 'slug required' }, 400, headers);

  // Dedup: 1 like per IP per day per slug
  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ipHash = await sha256hex(`${ip}:${slug}`);
  const day = todayJST();
  const seenKey = `seen:like:${day}:${ipHash}`;

  const seen = await kv.get(seenKey);
  if (seen) {
    // Already liked — return current count without incrementing
    const likes = await getCount(kv, `song:${slug}:likes`);
    return json({ slug, likes, duplicate: true }, 200, headers);
  }

  await kv.put(seenKey, '1', { expirationTtl: 86400 });
  const likes = await increment(kv, `song:${slug}:likes`);

  // Update top:likes cache
  await updateTopCache(kv, 'likes', slug, likes);

  return json({ slug, likes }, 200, headers);
}

async function handlePlay(
  body: Record<string, string>,
  req: Request,
  kv: KVNamespace,
  headers: Record<string, string>,
): Promise<Response> {
  const { slug } = body;
  if (!slug) return json({ error: 'slug required' }, 400, headers);

  // Dedup: 1 play per IP per 10 minutes per slug
  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ipHash = await sha256hex(`${ip}:${slug}`);
  const seenKey = `seen:play:${ipHash}`;

  const seen = await kv.get(seenKey);
  if (seen) {
    const plays = await getCount(kv, `song:${slug}:plays`);
    return json({ slug, plays, duplicate: true }, 200, headers);
  }

  await kv.put(seenKey, '1', { expirationTtl: 600 });
  const plays = await increment(kv, `song:${slug}:plays`);

  await updateTopCache(kv, 'plays', slug, plays);

  return json({ slug, plays }, 200, headers);
}

async function handleShare(
  body: Record<string, string>,
  kv: KVNamespace,
  headers: Record<string, string>,
): Promise<Response> {
  const { slug, platform = 'unknown' } = body;
  if (!slug) return json({ error: 'slug required' }, 400, headers);

  await increment(kv, `song:${slug}:shares:${platform}`);
  const shares = await increment(kv, `song:${slug}:shares`);

  return json({ slug, shares, platform }, 200, headers);
}

async function updateTopCache(kv: KVNamespace, metric: string, slug: string, newValue: number) {
  const cacheKey = `top:${metric}`;
  let top: Array<{ slug: string; value: number }> = [];

  const cached = await kv.get(cacheKey);
  if (cached) top = JSON.parse(cached);

  const existing = top.find((e) => e.slug === slug);
  if (existing) {
    existing.value = newValue;
  } else {
    top.push({ slug, value: newValue });
  }

  top.sort((a, b) => b.value - a.value);
  top = top.slice(0, 50); // keep top 50

  await kv.put(cacheKey, JSON.stringify(top));
}

// ---------- main ----------

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin');
    const corsHeaders = cors(env, origin);

    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const path = url.pathname;

    // GET endpoints
    if (req.method === 'GET') {
      if (path === '/get') return handleGet(url, env.REACTIONS_KV, corsHeaders);
      if (path === '/top') return handleTop(url, env.REACTIONS_KV, corsHeaders);
      if (path === '/health') return json({ ok: true }, 200, corsHeaders);
      return json({ error: 'not found' }, 404, corsHeaders);
    }

    // POST endpoints
    if (req.method === 'POST') {
      let body: Record<string, string> = {};
      try {
        body = await req.json();
      } catch {
        return json({ error: 'invalid json' }, 400, corsHeaders);
      }

      if (path === '/like') return handleLike(body, req, env.REACTIONS_KV, corsHeaders);
      if (path === '/play') return handlePlay(body, req, env.REACTIONS_KV, corsHeaders);
      if (path === '/share') return handleShare(body, env.REACTIONS_KV, corsHeaders);
      return json({ error: 'not found' }, 404, corsHeaders);
    }

    return json({ error: 'method not allowed' }, 405, corsHeaders);
  },
};
