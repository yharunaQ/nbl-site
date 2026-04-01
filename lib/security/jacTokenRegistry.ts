/**
 * JAC Token Registry
 *
 * Stores dynamically issued access tokens as SHA-256 hashes.
 * Primary store: Upstash Redis (SADD / SISMEMBER on a set key).
 * Fallback store: local JSON file (suitable for local dev and non-Vercel servers).
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REGISTRY_FILE = path.join(process.cwd(), '.tmp', 'jac-tokens', 'registry.json');
const UPSTASH_SET_KEY = 'jac:token-registry';

type UpstashConfig = { url: string; token: string };

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

function getUpstashConfig(): UpstashConfig | null {
  const url = String(process.env.UPSTASH_REDIS_REST_URL || '').trim();
  const token = String(process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

async function upstashCommand(
  config: UpstashConfig,
  command: Array<string | number>,
): Promise<unknown> {
  const response = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command]),
  });
  if (!response.ok) {
    throw new Error(`Upstash request failed (${response.status})`);
  }
  const data = (await response.json()) as Array<{ result?: unknown; error?: string }>;
  if (data[0]?.error) throw new Error(`Upstash command error: ${data[0].error}`);
  return data[0]?.result;
}

// ---------------------------------------------------------------------------
// File-backed store (local dev / fallback)
// ---------------------------------------------------------------------------

function fileReadHashes(): Set<string> {
  try {
    if (!fs.existsSync(REGISTRY_FILE)) return new Set();
    const raw = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8')) as { hashes?: string[] };
    return new Set(Array.isArray(raw.hashes) ? raw.hashes : []);
  } catch {
    return new Set();
  }
}

function fileWriteHashes(hashes: Set<string>): void {
  try {
    fs.mkdirSync(path.dirname(REGISTRY_FILE), { recursive: true });
    const tmp = `${REGISTRY_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ hashes: Array.from(hashes) }, null, 2), 'utf-8');
    fs.renameSync(tmp, REGISTRY_FILE);
  } catch {
    // best effort
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Persist a newly issued token (stores SHA-256 hash, not the raw token).
 */
export async function registerToken(token: string): Promise<void> {
  const hash = hashToken(token);
  const config = getUpstashConfig();
  if (config) {
    await upstashCommand(config, ['SADD', UPSTASH_SET_KEY, hash]);
    return;
  }
  const hashes = fileReadHashes();
  hashes.add(hash);
  fileWriteHashes(hashes);
}

/**
 * Returns true if the token was issued through the registry.
 * Falls back to the file store when Upstash is unavailable.
 */
export async function isTokenRegistered(token: string): Promise<boolean> {
  const hash = hashToken(token);
  const config = getUpstashConfig();
  if (config) {
    try {
      const result = await upstashCommand(config, ['SISMEMBER', UPSTASH_SET_KEY, hash]);
      return result === 1;
    } catch {
      // fall through to file-based check
    }
  }
  return fileReadHashes().has(hash);
}
