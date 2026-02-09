import type { NextApiRequest } from 'next';

type GuardOptions = {
    route: string;
    costly?: boolean;
};

type GuardResult =
    | { ok: true; forceFast: boolean }
    | { ok: false; status: number; error: string };

type MinuteBucket = {
    bucket: number;
    count: number;
};

const minuteMap = new Map<string, MinuteBucket>();
const dayMap = new Map<string, { dayKey: string; count: number }>();
const globalDayMap = new Map<string, number>();

function boolEnv(name: string, defaultValue: boolean): boolean {
    const raw = process.env[name];
    if (!raw) return defaultValue;
    return raw.toLowerCase() === 'true';
}

function numEnv(name: string, defaultValue: number): number {
    const raw = Number(process.env[name]);
    return Number.isFinite(raw) && raw > 0 ? raw : defaultValue;
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
    const now = new Date();
    return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
}

function currentMinuteBucket(): number {
    return Math.floor(Date.now() / 60000);
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

function enforceRateLimit(ip: string, route: string): GuardResult {
    const perMinuteLimit = numEnv('JAC_RATE_LIMIT_PER_MINUTE', 8);
    const perDayLimit = numEnv('JAC_RATE_LIMIT_PER_DAY', 120);
    const globalPerDayLimit = numEnv('JAC_GLOBAL_RATE_LIMIT_PER_DAY', 3000);

    const minuteBucket = currentMinuteBucket();
    const minuteKey = `${ip}:${route}`;
    const minute = minuteMap.get(minuteKey);
    if (!minute || minute.bucket !== minuteBucket) {
        minuteMap.set(minuteKey, { bucket: minuteBucket, count: 1 });
    } else {
        minute.count += 1;
        minuteMap.set(minuteKey, minute);
        if (minute.count > perMinuteLimit) {
            return {
                ok: false,
                status: 429,
                error: `Rate limit exceeded (${perMinuteLimit}/min). Please retry shortly.`,
            };
        }
    }

    const dayKey = currentDayKey();
    const dayCounterKey = `${ip}:${route}`;
    const day = dayMap.get(dayCounterKey);
    if (!day || day.dayKey !== dayKey) {
        dayMap.set(dayCounterKey, { dayKey, count: 1 });
    } else {
        day.count += 1;
        dayMap.set(dayCounterKey, day);
        if (day.count > perDayLimit) {
            return {
                ok: false,
                status: 429,
                error: `Daily limit exceeded (${perDayLimit}/day).`,
            };
        }
    }

    const globalCount = (globalDayMap.get(dayKey) || 0) + 1;
    globalDayMap.set(dayKey, globalCount);
    if (globalCount > globalPerDayLimit) {
        return {
            ok: false,
            status: 429,
            error: `Global daily limit exceeded (${globalPerDayLimit}/day).`,
        };
    }

    return { ok: true, forceFast: false };
}

export function guardJacApiRequest(req: NextApiRequest, options: GuardOptions): GuardResult {
    const publicEnabled = boolEnv('JAC_PUBLIC_ENABLED', false);
    const requiredToken = (process.env.JAC_ACCESS_TOKEN || '').trim();
    const tokenProvided = extractToken(req);
    const forceFastWhenHighUsage = boolEnv('JAC_FORCE_FAST_WHEN_HIGH_USAGE', true);
    const globalFastThreshold = numEnv('JAC_FORCE_FAST_THRESHOLD_PER_DAY', 1800);

    if (!publicEnabled) {
        if (!requiredToken) {
            return {
                ok: false,
                status: 503,
                error: 'JAC API is private. Set JAC_ACCESS_TOKEN on server.',
            };
        }
        if (!tokenProvided) {
            return {
                ok: false,
                status: 401,
                error: 'Access token required.',
            };
        }
        if (tokenProvided !== requiredToken) {
            return {
                ok: false,
                status: 403,
                error: 'Invalid access token.',
            };
        }
    }

    const ip = getIp(req);
    const rate = enforceRateLimit(ip, options.route);
    if (!rate.ok) return rate;

    const dayKey = currentDayKey();
    const globalCount = globalDayMap.get(dayKey) || 0;
    const forceFast = Boolean(options.costly && forceFastWhenHighUsage && globalCount >= globalFastThreshold);
    return { ok: true, forceFast };
}
