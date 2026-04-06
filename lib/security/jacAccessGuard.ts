import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { NextApiRequest } from 'next';
import { isTokenRegistered } from '@/lib/security/jacTokenRegistry';

type GuardOptions = {
    route: string;
    costly?: boolean;
    tokenLimited?: boolean;
};

type GuardResult =
    | { ok: true; forceFast: boolean }
    | { ok: false; status: number; error: string };

type RateLimitCheckResult =
    | { ok: true; globalCount: number }
    | { ok: false; status: number; error: string };

type MinuteBucket = {
    bucket: number;
    count: number;
};

type PersistedRateLimitStore = {
    version: 1;
    dayKey: string;
    updatedAt: string;
    routeDayCounts: Record<string, number>;
    globalCount: number;
    costlyTokenCounts: Record<string, number>;
};

type UpstashResponseRow = {
    result?: unknown;
    error?: string;
};

const DEFAULT_RATE_LIMIT_TIME_ZONE = 'Asia/Tokyo';
const DEFAULT_RATE_LIMIT_STORE_TTL_SEC = 3 * 24 * 60 * 60;
const RATE_LIMIT_STORE_PATH = path.join(process.cwd(), '.tmp', 'jac-rate-limit', 'daily-usage.json');
const minuteMap = new Map<string, MinuteBucket>();
const dayMap = new Map<string, { dayKey: string; count: number }>();
const globalDayMap = new Map<string, number>();
const costlyTokenDayMap = new Map<string, { dayKey: string; count: number }>();
let hydratedDayKey: string | null = null;

function resolveRateLimitTimeZone(): string {
    const raw = (process.env.JAC_RATE_LIMIT_TIMEZONE || DEFAULT_RATE_LIMIT_TIME_ZONE).trim();
    if (!raw) return DEFAULT_RATE_LIMIT_TIME_ZONE;
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: raw });
        return raw;
    } catch {
        return DEFAULT_RATE_LIMIT_TIME_ZONE;
    }
}

const rateLimitTimeZone = resolveRateLimitTimeZone();

function resolveRateLimitStorePath(): string {
    const raw = (process.env.JAC_RATE_LIMIT_STORE_PATH || '').trim();
    return raw || RATE_LIMIT_STORE_PATH;
}

function boolEnv(name: string, defaultValue: boolean): boolean {
    const raw = process.env[name];
    if (!raw) return defaultValue;
    return raw.toLowerCase() === 'true';
}

function numEnv(name: string, defaultValue: number): number {
    const raw = Number(process.env[name]);
    return Number.isFinite(raw) && raw > 0 ? raw : defaultValue;
}

function positiveInteger(input: unknown): number | null {
    const value = Number(input);
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.floor(value);
}

function emptyPersistedStore(dayKey: string): PersistedRateLimitStore {
    return {
        version: 1,
        dayKey,
        updatedAt: new Date().toISOString(),
        routeDayCounts: {},
        globalCount: 0,
        costlyTokenCounts: {},
    };
}

function normalizePersistedStore(input: unknown, fallbackDayKey: string): PersistedRateLimitStore {
    const base = emptyPersistedStore(fallbackDayKey);
    if (!input || typeof input !== 'object') return base;

    const row = input as Record<string, unknown>;
    const dayKey = typeof row.dayKey === 'string' && row.dayKey.trim() ? row.dayKey.trim() : fallbackDayKey;
    const routeDayCounts =
        row.routeDayCounts && typeof row.routeDayCounts === 'object'
            ? Object.fromEntries(
                  Object.entries(row.routeDayCounts as Record<string, unknown>)
                      .map(([key, value]) => [key, positiveInteger(value)])
                      .filter((entry): entry is [string, number] => Boolean(entry[0]) && entry[1] !== null),
              )
            : {};
    const costlyTokenCounts =
        row.costlyTokenCounts && typeof row.costlyTokenCounts === 'object'
            ? Object.fromEntries(
                  Object.entries(row.costlyTokenCounts as Record<string, unknown>)
                      .map(([key, value]) => [key, positiveInteger(value)])
                      .filter((entry): entry is [string, number] => Boolean(entry[0]) && entry[1] !== null),
              )
            : {};

    return {
        version: 1,
        dayKey,
        updatedAt: typeof row.updatedAt === 'string' && row.updatedAt.trim() ? row.updatedAt.trim() : base.updatedAt,
        routeDayCounts,
        globalCount: positiveInteger(row.globalCount) || 0,
        costlyTokenCounts,
    };
}

function getIp(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded[0]) {
        return forwarded[0];
    }
    return req.socket?.remoteAddress || 'unknown';
}

function currentDayKey(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: rateLimitTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const year = parts.find((part) => part.type === 'year')?.value || '0000';
    const month = parts.find((part) => part.type === 'month')?.value || '00';
    const day = parts.find((part) => part.type === 'day')?.value || '00';
    return `${year}-${month}-${day}`;
}

function currentMinuteBucket(): number {
    return Math.floor(Date.now() / 60000);
}

function rateLimitResetLabel(): string {
    if (rateLimitTimeZone === 'Asia/Tokyo') {
        return '翌日0時（日本時間）';
    }
    if (rateLimitTimeZone.toUpperCase() === 'UTC') {
        return '翌日0時（UTC）';
    }
    return `翌日0時（${rateLimitTimeZone}）`;
}

function readPersistedStore(dayKey: string): PersistedRateLimitStore {
    const storePath = resolveRateLimitStorePath();
    try {
        if (!fs.existsSync(storePath)) {
            return emptyPersistedStore(dayKey);
        }
        const raw = fs.readFileSync(storePath, 'utf8');
        return normalizePersistedStore(JSON.parse(raw), dayKey);
    } catch {
        return emptyPersistedStore(dayKey);
    }
}

function persistDailyState(dayKey: string): void {
    const storePath = resolveRateLimitStorePath();
    const routeDayCounts: Record<string, number> = {};
    const costlyTokenCounts: Record<string, number> = {};

    for (const [key, entry] of dayMap.entries()) {
        if (entry.dayKey === dayKey && entry.count > 0) {
            routeDayCounts[key] = entry.count;
        }
    }

    for (const [token, entry] of costlyTokenDayMap.entries()) {
        if (entry.dayKey === dayKey && entry.count > 0) {
            costlyTokenCounts[token] = entry.count;
        }
    }

    const payload: PersistedRateLimitStore = {
        version: 1,
        dayKey,
        updatedAt: new Date().toISOString(),
        routeDayCounts,
        globalCount: globalDayMap.get(dayKey) || 0,
        costlyTokenCounts,
    };

    try {
        fs.mkdirSync(path.dirname(storePath), { recursive: true });
        const tempPath = `${storePath}.${process.pid}.tmp`;
        fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
        fs.renameSync(tempPath, storePath);
    } catch {
        // Best effort persistence only.
    }
}

function hydrateDailyState(dayKey: string): void {
    if (hydratedDayKey === dayKey) return;

    dayMap.clear();
    globalDayMap.clear();
    costlyTokenDayMap.clear();

    const persisted = readPersistedStore(dayKey);
    if (persisted.dayKey === dayKey) {
        for (const [key, count] of Object.entries(persisted.routeDayCounts)) {
            dayMap.set(key, { dayKey, count });
        }
        if (persisted.globalCount > 0) {
            globalDayMap.set(dayKey, persisted.globalCount);
        }
        for (const [token, count] of Object.entries(persisted.costlyTokenCounts)) {
            costlyTokenDayMap.set(token, { dayKey, count });
        }
    }

    hydratedDayKey = dayKey;
}

function extractToken(req: NextApiRequest): string {
    const headerToken = req.headers['x-jac-access-token'];
    if (typeof headerToken === 'string') return headerToken.trim();
    if (Array.isArray(headerToken) && headerToken[0]) return headerToken[0].trim();
    const queryToken = req.query.accessToken;
    if (typeof queryToken === 'string') return queryToken.trim();
    if (Array.isArray(queryToken) && queryToken[0]) return queryToken[0].trim();
    return '';
}

function normalizeToken(raw: string): string {
    const trimmed = raw.trim();
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1).trim().replace(/\s+/g, '');
    }
    return trimmed.replace(/\s+/g, '');
}

function getAcceptedTokens(): string[] {
    const single = normalizeToken(process.env.JAC_ACCESS_TOKEN || '');
    const multi = (process.env.JAC_ACCESS_TOKENS || '')
        .split(',')
        .map((item) => normalizeToken(item))
        .filter(Boolean);
    const set = new Set<string>();
    if (single) set.add(single);
    for (const token of multi) set.add(token);
    return Array.from(set);
}

function hashKeyPart(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function rateLimitStoreTtlSec(): number {
    return numEnv('JAC_RATE_LIMIT_STORE_TTL_SEC', DEFAULT_RATE_LIMIT_STORE_TTL_SEC);
}

function getUpstashConfig(): { url: string; token: string } | null {
    const url = String(process.env.UPSTASH_REDIS_REST_URL || '').trim();
    const token = String(process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
    if (!url || !token) return null;
    return {
        url: url.replace(/\/+$/, ''),
        token,
    };
}

function buildDistributedRateLimitKeys(dayKey: string, ip: string, route: string, costlyUsageKey: string) {
    const routeHash = hashKeyPart(`${ip}:${route}`);
    const tokenHash = costlyUsageKey ? hashKeyPart(costlyUsageKey) : '';
    return {
        routeKey: `jac:rate-limit:${dayKey}:route:${routeHash}`,
        globalKey: `jac:rate-limit:${dayKey}:global`,
        tokenKey: tokenHash ? `jac:rate-limit:${dayKey}:token:${tokenHash}` : '',
    };
}

function costlyUsageLimitKey(ip: string, route: string, tokenProvided: string): string {
    if (tokenProvided) {
        return tokenProvided;
    }
    return `public:${hashKeyPart(`${ip}:${route}`)}`;
}

async function runUpstashTransaction(commands: Array<Array<string | number>>): Promise<UpstashResponseRow[]> {
    const config = getUpstashConfig();
    if (!config) {
        throw new Error('Upstash Redis is not configured.');
    }

    const response = await fetch(`${config.url}/multi-exec`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands),
    });

    const payload = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
        const message =
            payload && typeof payload === 'object' && 'error' in payload
                ? String((payload as { error?: unknown }).error || '')
                : response.statusText;
        throw new Error(`Upstash Redis request failed (${response.status}): ${message || 'unknown error'}`);
    }

    if (Array.isArray(payload)) {
        return payload as UpstashResponseRow[];
    }

    if (payload && typeof payload === 'object' && 'error' in payload) {
        throw new Error(String((payload as { error?: unknown }).error || 'Upstash Redis transaction failed.'));
    }

    throw new Error('Unexpected Upstash Redis response.');
}

function readUpstashCounter(rows: UpstashResponseRow[], index: number): number {
    const row = rows[index];
    if (!row) {
        throw new Error(`Upstash Redis response missing row ${index}.`);
    }
    if (row.error) {
        throw new Error(`Upstash Redis command failed: ${row.error}`);
    }
    const value = Number(row.result);
    if (!Number.isFinite(value)) {
        throw new Error(`Unexpected Upstash Redis counter value at row ${index}.`);
    }
    return value;
}

function allowLocalFallbackOnStoreError(): boolean {
    const raw = process.env.JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK;
    if (typeof raw === 'string' && raw.trim()) {
        return raw.toLowerCase() === 'true';
    }
    return process.env.VERCEL === '1' ? false : true;
}

function enforceMinuteLimit(ip: string, route: string): GuardResult | { ok: true } {
    const perMinuteLimit = numEnv('JAC_RATE_LIMIT_PER_MINUTE', 8);
    const minuteBucket = currentMinuteBucket();
    const minuteKey = `${ip}:${route}`;
    const minute = minuteMap.get(minuteKey);

    if (!minute || minute.bucket !== minuteBucket) {
        minuteMap.set(minuteKey, { bucket: minuteBucket, count: 1 });
        return { ok: true };
    }

    minute.count += 1;
    minuteMap.set(minuteKey, minute);
    if (minute.count > perMinuteLimit) {
        return {
            ok: false,
            status: 429,
            error: `Rate limit exceeded (${perMinuteLimit}/min). Please retry shortly.`,
        };
    }

    return { ok: true };
}

function enforceFileBackedDailyLimit(
    ip: string,
    route: string,
    tokenProvided: string,
    tokenLimited: boolean,
): RateLimitCheckResult {
    const perDayLimit = numEnv('JAC_RATE_LIMIT_PER_DAY', 120);
    const globalPerDayLimit = numEnv('JAC_GLOBAL_RATE_LIMIT_PER_DAY', 3000);
    const costlyPerTokenLimit = numEnv('JAC_COSTLY_RATE_LIMIT_PER_TOKEN_PER_DAY', 20);
    const dayKey = currentDayKey();

    hydrateDailyState(dayKey);

    const dayCounterKey = `${ip}:${route}`;
    const day = dayMap.get(dayCounterKey);
    const nextRouteCount = !day || day.dayKey !== dayKey ? 1 : day.count + 1;
    dayMap.set(dayCounterKey, { dayKey, count: nextRouteCount });
    if (nextRouteCount > perDayLimit) {
        persistDailyState(dayKey);
        return {
            ok: false,
            status: 429,
            error: `Daily limit exceeded (${perDayLimit}/day).`,
        };
    }

    const nextGlobalCount = (globalDayMap.get(dayKey) || 0) + 1;
    globalDayMap.set(dayKey, nextGlobalCount);
    if (nextGlobalCount > globalPerDayLimit) {
        persistDailyState(dayKey);
        return {
            ok: false,
            status: 429,
            error: `Global daily limit exceeded (${globalPerDayLimit}/day).`,
        };
    }

    if (tokenLimited && tokenProvided) {
        const entry = costlyTokenDayMap.get(tokenProvided);
        const nextTokenCount = !entry || entry.dayKey !== dayKey ? 1 : entry.count + 1;
        costlyTokenDayMap.set(tokenProvided, { dayKey, count: nextTokenCount });
        if (nextTokenCount > costlyPerTokenLimit) {
            persistDailyState(dayKey);
            return {
                ok: false,
                status: 429,
                error: `1日の利用上限（${costlyPerTokenLimit}件）に達しました。${rateLimitResetLabel()}にリセットされます。`,
            };
        }
    }

    persistDailyState(dayKey);
    return { ok: true, globalCount: nextGlobalCount };
}

async function enforceDistributedDailyLimit(
    ip: string,
    route: string,
    tokenProvided: string,
    tokenLimited: boolean,
): Promise<RateLimitCheckResult> {
    const perDayLimit = numEnv('JAC_RATE_LIMIT_PER_DAY', 120);
    const globalPerDayLimit = numEnv('JAC_GLOBAL_RATE_LIMIT_PER_DAY', 3000);
    const costlyPerTokenLimit = numEnv('JAC_COSTLY_RATE_LIMIT_PER_TOKEN_PER_DAY', 20);
    const dayKey = currentDayKey();
    const ttlSec = rateLimitStoreTtlSec();
    const { routeKey, globalKey, tokenKey } = buildDistributedRateLimitKeys(dayKey, ip, route, tokenProvided);

    const commands: Array<Array<string | number>> = [
        ['INCR', routeKey],
        ['EXPIRE', routeKey, ttlSec],
        ['INCR', globalKey],
        ['EXPIRE', globalKey, ttlSec],
    ];

    const tokenResultIndex = commands.length;
    if (tokenLimited && tokenProvided && tokenKey) {
        commands.push(['INCR', tokenKey]);
        commands.push(['EXPIRE', tokenKey, ttlSec]);
    }

    const rows = await runUpstashTransaction(commands);
    const routeCount = readUpstashCounter(rows, 0);
    const globalCount = readUpstashCounter(rows, 2);
    const tokenCount =
        tokenLimited && tokenProvided && tokenKey ? readUpstashCounter(rows, tokenResultIndex) : null;

    if (routeCount > perDayLimit) {
        return {
            ok: false,
            status: 429,
            error: `Daily limit exceeded (${perDayLimit}/day).`,
        };
    }

    if (globalCount > globalPerDayLimit) {
        return {
            ok: false,
            status: 429,
            error: `Global daily limit exceeded (${globalPerDayLimit}/day).`,
        };
    }

    if (tokenCount !== null && tokenCount > costlyPerTokenLimit) {
        return {
            ok: false,
            status: 429,
            error: `1日の利用上限（${costlyPerTokenLimit}件）に達しました。${rateLimitResetLabel()}にリセットされます。`,
        };
    }

    return { ok: true, globalCount };
}

async function enforceDailyLimit(
    ip: string,
    route: string,
    tokenProvided: string,
    tokenLimited: boolean,
): Promise<RateLimitCheckResult> {
    if (!getUpstashConfig()) {
        return enforceFileBackedDailyLimit(ip, route, tokenProvided, tokenLimited);
    }

    try {
        return await enforceDistributedDailyLimit(ip, route, tokenProvided, tokenLimited);
    } catch (error) {
        if (allowLocalFallbackOnStoreError()) {
            return enforceFileBackedDailyLimit(ip, route, tokenProvided, tokenLimited);
        }
        return {
            ok: false,
            status: 503,
            error:
                error instanceof Error
                    ? `利用状況の確認に失敗しました。しばらくしてから再度お試しください。 (${error.message})`
                    : '利用状況の確認に失敗しました。しばらくしてから再度お試しください。',
        };
    }
}

export async function guardJacApiRequest(
    req: NextApiRequest,
    options: GuardOptions,
): Promise<GuardResult> {
    const acceptedTokens = getAcceptedTokens();
    const tokenProvided = normalizeToken(extractToken(req));
    const forceFastWhenHighUsage = boolEnv('JAC_FORCE_FAST_WHEN_HIGH_USAGE', true);
    const globalFastThreshold = numEnv('JAC_FORCE_FAST_THRESHOLD_PER_DAY', 1800);
    const tokenLimited = typeof options.tokenLimited === 'boolean' ? options.tokenLimited : Boolean(options.costly);
    const ip = getIp(req);
    const usageLimitKey = costlyUsageLimitKey(ip, options.route, tokenProvided);

    if (boolEnv('JAC_ACCESS_TOKEN_REQUIRED', false)) {
        if (acceptedTokens.length === 0) {
            return {
                ok: false,
                status: 503,
                error: 'JAC API is private. Set JAC_ACCESS_TOKEN or JAC_ACCESS_TOKENS on server.',
            };
        }
        if (!tokenProvided) {
            return {
                ok: false,
                status: 401,
                error: 'Access token required.',
            };
        }
        if (!acceptedTokens.includes(tokenProvided)) {
            const registered = await isTokenRegistered(tokenProvided);
            if (!registered) {
                const devHint =
                    process.env.NODE_ENV !== 'production'
                        ? ` (provided length: ${tokenProvided.length})`
                        : '';
                return {
                    ok: false,
                    status: 403,
                    error: `Invalid access token.${devHint}`,
                };
            }
        }
    }

    const minute = enforceMinuteLimit(ip, options.route);
    if (!minute.ok) return minute;

    const daily = await enforceDailyLimit(ip, options.route, usageLimitKey, tokenLimited);
    if (!daily.ok) return daily;

    const forceFast = Boolean(
        options.costly && forceFastWhenHighUsage && daily.globalCount >= globalFastThreshold,
    );
    return { ok: true, forceFast };
}
