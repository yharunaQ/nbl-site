import fs from 'node:fs';
import path from 'node:path';

const ORIGINAL_ENV = process.env;
const ORIGINAL_FETCH = global.fetch;

function buildRequest(token: string | null = 'persist-token', ip = '127.0.0.1') {
  return {
    headers: {
      ...(token ? { 'x-jac-access-token': token } : {}),
    },
    query: {},
    socket: {
      remoteAddress: ip,
    },
  };
}

function formatDayKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value || '0000';
  const month = parts.find((part) => part.type === 'month')?.value || '00';
  const day = parts.find((part) => part.type === 'day')?.value || '00';
  return `${year}-${month}-${day}`;
}

describe('jac access guard persistence', () => {
  let storeDir: string;
  let storePath: string;

  beforeEach(() => {
    jest.resetModules();
    storeDir = path.join(
      process.cwd(),
      '.tmp',
      'jest-jac-rate-limit',
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    storePath = path.join(storeDir, 'daily-usage.json');

    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: 'test',
      JAC_PUBLIC_ENABLED: 'false',
      JAC_ACCESS_TOKEN_REQUIRED: 'false',
      JAC_ACCESS_TOKENS: 'persist-token',
      JAC_COSTLY_RATE_LIMIT_PER_TOKEN_PER_DAY: '2',
      JAC_RATE_LIMIT_STORE_PATH: storePath,
      JAC_RATE_LIMIT_TIMEZONE: 'Asia/Tokyo',
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    global.fetch = ORIGINAL_FETCH;
    jest.restoreAllMocks();
    fs.rmSync(storeDir, { recursive: true, force: true });
  });

  it('persists the per-token daily count across module reloads', async () => {
    const { guardJacApiRequest } = require('@/lib/security/jacAccessGuard');

    await expect(
      guardJacApiRequest(buildRequest(), {
        route: 'jac-assess',
        costly: true,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    await expect(
      guardJacApiRequest(buildRequest(), {
        route: 'jac-assess',
        costly: true,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    const persisted = JSON.parse(fs.readFileSync(storePath, 'utf8')) as {
      costlyTokenCounts: Record<string, number>;
      globalCount: number;
    };
    expect(persisted.costlyTokenCounts['persist-token']).toBe(2);
    expect(persisted.globalCount).toBe(2);

    jest.resetModules();
    const reloaded = require('@/lib/security/jacAccessGuard');
    const result = await reloaded.guardJacApiRequest(buildRequest(), {
      route: 'jac-assess',
      costly: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(429);
      expect(result.error).toContain('1日の利用上限（2件）');
    }
  });

  it('ignores stale persisted counts from a previous day', async () => {
    fs.mkdirSync(storeDir, { recursive: true });
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    fs.writeFileSync(
      storePath,
      JSON.stringify(
        {
          version: 1,
          dayKey: formatDayKey(yesterday, 'Asia/Tokyo'),
          updatedAt: yesterday.toISOString(),
          routeDayCounts: {
            '127.0.0.1:jac-assess': 99,
          },
          globalCount: 99,
          costlyTokenCounts: {
            'persist-token': 99,
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    const { guardJacApiRequest } = require('@/lib/security/jacAccessGuard');
    const result = await guardJacApiRequest(buildRequest(), {
      route: 'jac-assess',
      costly: true,
    });

    expect(result).toEqual({ ok: true, forceFast: false });

    const persisted = JSON.parse(fs.readFileSync(storePath, 'utf8')) as {
      dayKey: string;
      costlyTokenCounts: Record<string, number>;
      globalCount: number;
      routeDayCounts: Record<string, number>;
    };

    expect(persisted.dayKey).toBe(formatDayKey(new Date(), 'Asia/Tokyo'));
    expect(persisted.costlyTokenCounts['persist-token']).toBe(1);
    expect(persisted.globalCount).toBe(1);
    expect(persisted.routeDayCounts['127.0.0.1:jac-assess']).toBe(1);
  });

  it('uses Upstash Redis when configured', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example-redis.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret-token';
    process.env.JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK = 'false';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { result: 1 },
        { result: 1 },
        { result: 1 },
        { result: 1 },
        { result: 1 },
        { result: 1 },
      ],
    }) as unknown as typeof fetch;

    const { guardJacApiRequest } = require('@/lib/security/jacAccessGuard');
    const result = await guardJacApiRequest(buildRequest(), {
      route: 'jac-assess',
      costly: true,
    });

    expect(result).toEqual({ ok: true, forceFast: false });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example-redis.upstash.io/multi-exec',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer secret-token',
          'Content-Type': 'application/json',
        }),
      }),
    );

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const commands = JSON.parse(String(options.body)) as Array<Array<string | number>>;
    expect(commands[0][0]).toBe('INCR');
    expect(commands[2]).toEqual(['INCR', expect.any(String)]);
    expect(commands[4][0]).toBe('INCR');
  });

  it('does not consume the per-token quota when tokenLimited is false', async () => {
    const { guardJacApiRequest } = require('@/lib/security/jacAccessGuard');

    await expect(
      guardJacApiRequest(buildRequest(), {
        route: 'jac-tag-suggest',
        costly: true,
        tokenLimited: false,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    await expect(
      guardJacApiRequest(buildRequest(), {
        route: 'jac-tag-suggest',
        costly: true,
        tokenLimited: false,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    await expect(
      guardJacApiRequest(buildRequest(), {
        route: 'jac-tag-suggest',
        costly: true,
        tokenLimited: false,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    const persisted = JSON.parse(fs.readFileSync(storePath, 'utf8')) as {
      costlyTokenCounts: Record<string, number>;
      routeDayCounts: Record<string, number>;
    };

    expect(persisted.routeDayCounts['127.0.0.1:jac-tag-suggest']).toBe(3);
    expect(persisted.costlyTokenCounts['persist-token']).toBeUndefined();
  });

  it('allows public requests without an access token and still applies costly daily limits', async () => {
    const { guardJacApiRequest } = require('@/lib/security/jacAccessGuard');

    await expect(
      guardJacApiRequest(buildRequest(null), {
        route: 'jac-assess',
        costly: true,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    await expect(
      guardJacApiRequest(buildRequest(null), {
        route: 'jac-assess',
        costly: true,
      }),
    ).resolves.toEqual({ ok: true, forceFast: false });

    const result = await guardJacApiRequest(buildRequest(null), {
      route: 'jac-assess',
      costly: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(429);
      expect(result.error).toContain('1日の利用上限（2件）');
    }

    const persisted = JSON.parse(fs.readFileSync(storePath, 'utf8')) as {
      costlyTokenCounts: Record<string, number>;
    };
    expect(Object.values(persisted.costlyTokenCounts)).toContain(3);
  });

  it('requires a token only when explicit private mode is enabled', async () => {
    process.env.JAC_ACCESS_TOKEN_REQUIRED = 'true';

    const { guardJacApiRequest } = require('@/lib/security/jacAccessGuard');
    const result = await guardJacApiRequest(buildRequest(null), {
      route: 'jac-assess',
      costly: true,
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      error: 'Access token required.',
    });
  });
});
