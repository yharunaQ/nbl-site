#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const configPath = path.join(projectRoot, 'config', 'knowledge-sources.json');
const outputRoot = path.join(projectRoot, 'references', 'web-cache');
const manifestPath = path.join(outputRoot, 'web-fetch-manifest.json');

const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_BASE_MS = 700;
const DEFAULT_RETRY_MAX_MS = 4000;
const DEFAULT_RETRY_AFTER_MAX_MS = 30000;
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_DOMAIN_MIN_INTERVAL_MS = 400;
const DEFAULT_CRAWL_DEPTH = 1;
const DEFAULT_MAX_PAGES_PER_SOURCE = 20;
const DEFAULT_MAX_DISCOVERED_LINKS_PER_PAGE = 40;

const includeDisabled = process.env.KNOWLEDGE_FETCH_INCLUDE_DISABLED === '1';
const forceRefresh = process.env.KNOWLEDGE_FETCH_FORCE === '1';
const sourceIdFilter = parseCsvSet(process.env.KNOWLEDGE_FETCH_SOURCE_IDS || '');

const requestTimeoutMs = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_TIMEOUT_MS', DEFAULT_TIMEOUT_MS, {
    min: 1000,
    max: 180000,
});
const maxRetries = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_RETRIES', DEFAULT_MAX_RETRIES, {
    min: 0,
    max: 8,
});
const retryBaseMs = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_RETRY_BASE_MS', DEFAULT_RETRY_BASE_MS, {
    min: 100,
    max: 30000,
});
const retryMaxMs = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_RETRY_MAX_MS', DEFAULT_RETRY_MAX_MS, {
    min: retryBaseMs,
    max: 120000,
});
const retryAfterMaxMs = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_RETRY_AFTER_MAX_MS', DEFAULT_RETRY_AFTER_MAX_MS, {
    min: 1000,
    max: 300000,
});
const fetchConcurrency = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_CONCURRENCY', DEFAULT_CONCURRENCY, {
    min: 1,
    max: 12,
});
const domainMinIntervalMs = parseBoundedIntegerEnv(
    'KNOWLEDGE_FETCH_DOMAIN_MIN_INTERVAL_MS',
    DEFAULT_DOMAIN_MIN_INTERVAL_MS,
    {
        min: 0,
        max: 60000,
    },
);
const defaultCrawlDepth = parseBoundedIntegerEnv('KNOWLEDGE_FETCH_CRAWL_DEPTH', DEFAULT_CRAWL_DEPTH, {
    min: 0,
    max: 5,
});
const defaultMaxPagesPerSource = parseBoundedIntegerEnv(
    'KNOWLEDGE_FETCH_MAX_PAGES_PER_SOURCE',
    DEFAULT_MAX_PAGES_PER_SOURCE,
    {
        min: 1,
        max: 500,
    },
);
const maxDiscoveredLinksPerPage = parseBoundedIntegerEnv(
    'KNOWLEDGE_FETCH_MAX_DISCOVERED_LINKS_PER_PAGE',
    DEFAULT_MAX_DISCOVERED_LINKS_PER_PAGE,
    {
        min: 1,
        max: 200,
    },
);

const domainCooldownUntil = new Map();
const domainLocks = new Map();
const NON_HTML_PATH_RE = /\.(pdf|docx?|xlsx?|xlsm|csv|zip|png|jpe?g|gif|svg|webp|ico|mp4|mp3|avi|mov|pptx?)(?:$|[?#])/i;

function parseBoundedIntegerEnv(name, fallback, { min, max }) {
    const raw = process.env[name];
    if (raw === undefined || raw === '') return fallback;

    const value = Number(raw);
    if (!Number.isInteger(value) || value < min || value > max) {
        throw new Error(`${name} must be an integer in [${min}, ${max}], received: ${raw}`);
    }
    return value;
}

function parseCsvSet(raw) {
    if (!raw) return null;
    const values = String(raw)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (values.length === 0) return null;
    return new Set(values);
}

function parseOptionalBoundedInteger(value, fallback, { min, max }) {
    if (value === undefined || value === null || value === '') return fallback;
    const asNumber = Number(value);
    if (!Number.isInteger(asNumber) || asNumber < min || asNumber > max) return fallback;
    return asNumber;
}

function decodeHtmlEntities(text) {
    return text
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>');
}

function stripHtml(html) {
    const noScript = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');

    return decodeHtmlEntities(noScript.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function sanitizeTitle(html) {
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!match) return '';
    return decodeHtmlEntities(match[1].replace(/\s+/g, ' ').trim()).slice(0, 120);
}

function normalizeWhitespace(value) {
    return decodeHtmlEntities(String(value || '').replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
}

function hashUrl(url) {
    return createHash('sha1').update(url).digest('hex').slice(0, 12);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function computeBackoffMs(attempt) {
    const raw = Math.min(retryMaxMs, retryBaseMs * 2 ** Math.max(0, attempt - 1));
    const jitter = Math.floor(Math.random() * Math.min(250, Math.max(1, Math.floor(raw * 0.25))));
    return raw + jitter;
}

function isRetryableStatus(status) {
    if (status === null || status === undefined) return true;
    if (status === 408 || status === 425 || status === 429) return true;
    return status >= 500 && status <= 599;
}

function extractErrorCode(error) {
    if (!error || typeof error !== 'object') return null;

    if ('code' in error && typeof error.code === 'string') {
        return error.code;
    }

    if ('cause' in error && error.cause && typeof error.cause === 'object') {
        const cause = error.cause;
        if ('code' in cause && typeof cause.code === 'string') {
            return cause.code;
        }
    }

    return null;
}

function classifyFailure(error, status, errorCode = null) {
    if (status !== null && status !== undefined) {
        if (status === 429) return 'rate_limited';
        if (status >= 500) return 'server_error';
        if (status >= 400) return 'client_error';
    }

    const normalizedCode = (errorCode || '').toUpperCase();
    if (normalizedCode === 'ETIMEDOUT' || normalizedCode === 'UND_ERR_CONNECT_TIMEOUT') return 'timeout';
    if (
        normalizedCode === 'ECONNRESET' ||
        normalizedCode === 'ECONNREFUSED' ||
        normalizedCode === 'ENOTFOUND' ||
        normalizedCode === 'EHOSTUNREACH' ||
        normalizedCode === 'EAI_AGAIN'
    ) {
        return 'network_error';
    }

    const normalized = (error || '').toLowerCase();
    if (normalized.includes('abort') || normalized.includes('timeout')) return 'timeout';
    if (
        normalized.includes('fetch failed') ||
        normalized.includes('econn') ||
        normalized.includes('network') ||
        normalized.includes('enotfound')
    ) {
        return 'network_error';
    }
    return 'unknown_error';
}

function parseRetryAfterMs(headerValue) {
    if (!headerValue) return null;
    const value = String(headerValue).trim();
    if (!value) return null;

    if (/^\d+$/.test(value)) {
        const seconds = Number(value);
        if (!Number.isFinite(seconds)) return null;
        return Math.min(retryAfterMaxMs, Math.max(0, Math.round(seconds * 1000)));
    }

    const absoluteMs = Date.parse(value);
    if (Number.isNaN(absoluteMs)) return null;

    const deltaMs = absoluteMs - Date.now();
    return Math.min(retryAfterMaxMs, Math.max(0, deltaMs));
}

function shouldRetryResult(result) {
    if (result.failureType === 'client_error') return false;
    if (result.failureType === 'unsupported_content_type') return false;
    if (result.failureType === 'invalid_url') return false;
    if (result.failureType === 'disallowed_domain') return false;
    return isRetryableStatus(result.status);
}

function getDomain(url) {
    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) return null;
        return parsed.hostname.toLowerCase();
    } catch {
        return null;
    }
}

function normalizeUrl(url) {
    try {
        const parsed = new URL(url);
        parsed.hash = '';
        return parsed.toString();
    } catch {
        return null;
    }
}

function normalizeDiscoveredUrl(rawHref, baseUrl) {
    const href = decodeHtmlEntities((rawHref || '').trim());
    if (!href) return null;
    if (href.startsWith('#')) return null;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
    if (/^\/?&+$/.test(href)) return null;

    let normalizedHref = href;
    if (
        /^[A-Za-z]{2}\//.test(normalizedHref) ||
        normalizedHref.startsWith('SiteGlobals/') ||
        normalizedHref.startsWith('SharedDocs/')
    ) {
        normalizedHref = `/${normalizedHref}`;
    }

    try {
        const parsed = new URL(normalizedHref, baseUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) return null;
        if (parsed.pathname.endsWith('/&')) return null;
        parsed.hash = '';
        const composed = `${parsed.pathname}${parsed.search}`.toLowerCase();
        if (/%22|%27|%3c|%3e/.test(composed)) return null;
        return parsed.toString();
    } catch {
        return null;
    }
}

function isLikelyHtmlUrl(url) {
    try {
        const parsed = new URL(url);
        return !NON_HTML_PATH_RE.test(parsed.pathname + parsed.search);
    } catch {
        return false;
    }
}

function extractLinksFromHtml(html, baseUrl) {
    const discovered = new Set();
    const hrefPattern = /href\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
    let match = hrefPattern.exec(html);

    while (match) {
        const rawHref = match[1] || match[2] || match[3] || '';
        const normalized = normalizeDiscoveredUrl(rawHref, baseUrl);
        if (normalized && isLikelyHtmlUrl(normalized)) {
            discovered.add(normalized);
        }
        match = hrefPattern.exec(html);
    }

    return Array.from(discovered);
}

function extractJeedSearchCaseEntries(html, baseUrl) {
    const entries = [];
    const itemPattern = /<li class="searchResult-list-listItem">([\s\S]*?)<\/li>/gi;
    let itemMatch = itemPattern.exec(html);

    while (itemMatch) {
        const block = itemMatch[1] || '';
        const hrefMatch = block.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
        if (!hrefMatch) {
            itemMatch = itemPattern.exec(html);
            continue;
        }

        const href = normalizeDiscoveredUrl(hrefMatch[1], baseUrl);
        const title = normalizeWhitespace(hrefMatch[2]);
        const year = normalizeWhitespace((block.match(/<label>\s*年度\s*<\/label>\s*<p>([\s\S]*?)<\/p>/i) || [])[1] || '');
        const industry = normalizeWhitespace((block.match(/<label>\s*業種\s*<\/label>\s*<p>([\s\S]*?)<\/p>/i) || [])[1] || '');
        const companySize = normalizeWhitespace((block.match(/<label>\s*規模\s*<\/label>\s*<p>([\s\S]*?)<\/p>/i) || [])[1] || '');
        const disability = normalizeWhitespace((block.match(/<label>\s*障害\s*<\/label>\s*<p>([\s\S]*?)<\/p>/i) || [])[1] || '');

        if (!href) {
            itemMatch = itemPattern.exec(html);
            continue;
        }

        entries.push({
            detailUrl: href,
            title,
            year,
            industry,
            companySize,
            disability,
        });

        itemMatch = itemPattern.exec(html);
    }

    return entries;
}

async function withDomainLock(domain, fn) {
    const prev = domainLocks.get(domain) || Promise.resolve();
    let release = null;
    const current = new Promise((resolve) => {
        release = resolve;
    });
    domainLocks.set(domain, prev.then(() => current));

    await prev;
    try {
        return await fn();
    } finally {
        release();
        if (domainLocks.get(domain) === current) {
            domainLocks.delete(domain);
        }
    }
}

async function waitForDomainSlot(domain) {
    return withDomainLock(domain, async () => {
        const now = Date.now();
        const blockedUntil = domainCooldownUntil.get(domain) || 0;
        const waitMs = Math.max(0, blockedUntil - now);
        if (waitMs > 0) {
            await sleep(waitMs);
        }

        const startedAt = Date.now();
        domainCooldownUntil.set(domain, startedAt + domainMinIntervalMs);
        return waitMs;
    });
}

function extendDomainCooldown(domain, cooldownMs) {
    if (!Number.isFinite(cooldownMs) || cooldownMs <= 0) return;
    const current = domainCooldownUntil.get(domain) || 0;
    const next = Date.now() + Math.min(retryAfterMaxMs, Math.floor(cooldownMs));
    if (next > current) {
        domainCooldownUntil.set(domain, next);
    }
}

function buildSourcePolicy(source) {
    const maxDepth = parseOptionalBoundedInteger(source.crawlDepth, defaultCrawlDepth, {
        min: 0,
        max: 5,
    });
    const maxPages = parseOptionalBoundedInteger(source.maxPages, defaultMaxPagesPerSource, {
        min: 1,
        max: 500,
    });

    const allowedDomains = new Set();
    const seedUrls = resolveSeedUrls(source);
    for (const value of [source.location, ...seedUrls, ...(Array.isArray(source.allowedHosts) ? source.allowedHosts : [])]) {
        const domain = getDomain(value);
        if (domain) allowedDomains.add(domain);
    }

    const allowPathPrefixes = Array.isArray(source.allowPathPrefixes)
        ? source.allowPathPrefixes
              .map((item) => (typeof item === 'string' ? item.trim() : ''))
              .filter((item) => item.length > 0)
        : [];

    return {
        sourceId: source.id,
        maxDepth,
        maxPages,
        allowedDomains,
        allowPathPrefixes,
    };
}

function resolveSeedUrls(source) {
    const explicitSeedUrls =
        Array.isArray(source.seedUrls) && source.seedUrls.length > 0 ? source.seedUrls : [source.location];
    const urls = explicitSeedUrls
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value.length > 0);

    const template = typeof source.seedUrlTemplate === 'string' ? source.seedUrlTemplate.trim() : '';
    if (!template) {
        return Array.from(new Set(urls));
    }

    const pageStart = parseOptionalBoundedInteger(source.seedPageStart, 1, {
        min: 1,
        max: 2000,
    });
    const pageEndRaw = parseOptionalBoundedInteger(source.seedPageEnd, pageStart, {
        min: 1,
        max: 2000,
    });
    const pageEnd = Math.max(pageStart, pageEndRaw);
    const pageStep = parseOptionalBoundedInteger(source.seedPageStep, 1, {
        min: 1,
        max: 100,
    });

    if (!template.includes('{page}')) {
        urls.push(template);
        return Array.from(new Set(urls));
    }

    for (let page = pageStart; page <= pageEnd; page += pageStep) {
        urls.push(template.replaceAll('{page}', String(page)));
    }

    return Array.from(new Set(urls));
}

function isJeedCasePath(pathname) {
    return /^\/(?:\d{4}\/)?\d{6,8}\.html$/i.test(pathname || '');
}

function isAllowedByPolicy(url, policy) {
    const domain = getDomain(url);
    if (!domain) return false;
    if (!policy.allowedDomains.has(domain)) return false;
    try {
        const parsed = new URL(url);
        if (policy.sourceId === 'jeed_reference' && isJeedCasePath(parsed.pathname)) {
            return true;
        }
        if (policy.allowPathPrefixes.length === 0) return true;
        return policy.allowPathPrefixes.some((prefix) => parsed.pathname.startsWith(prefix));
    } catch {
        return false;
    }
}

function scoreDiscoveredUrl(url, policy) {
    let score = 0;

    try {
        const parsed = new URL(url);
        const pathname = parsed.pathname;
        const query = parsed.search || '';

        const prefixIndex = policy.allowPathPrefixes.findIndex((prefix) => pathname.startsWith(prefix));
        if (prefixIndex >= 0) {
            score += (policy.allowPathPrefixes.length - prefixIndex) * 10;
        }

        if (isJeedCasePath(pathname)) score += 140;
        if (pathname.includes('/detail.php')) score += 120;
        if (pathname.includes('/disabilities/') || pathname.includes('/limitations/')) score += 35;
        if (pathname.includes('/publication/')) score += 32;
        if (pathname.includes('/learning-center/course/')) score += 28;
        if (
            pathname.startsWith('/page/') &&
            /(toolkit|framework|guide|checklist|playbook|neurodiversity|mental-health|accommodation|accessibility)/i.test(pathname)
        ) {
            score += 24;
        }
        if (pathname === '/publications' || pathname === '/courses' || pathname === '/mentalhealth') score += 12;
        if (pathname.startsWith('/page/') && /(newsletter|news|events|archive)/i.test(pathname)) score -= 10;
        if (pathname.includes('/search_result.php') && query.includes('page=')) score -= 20;
    } catch {
        // Keep default score.
    }

    return score;
}

function prioritizeDiscoveredUrls(urls, policy) {
    return [...urls].sort((a, b) => scoreDiscoveredUrl(b, policy) - scoreDiscoveredUrl(a, policy));
}

async function loadSources() {
    const raw = await fs.readFile(configPath, 'utf8');
    const list = JSON.parse(raw);
    const selectable = list.filter((source) => {
        if (source.kind !== 'website') return false;
        return includeDisabled ? true : Boolean(source.enabled);
    });

    if (!sourceIdFilter) {
        return selectable;
    }

    return selectable.filter((source) => sourceIdFilter.has(source.id));
}

async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const startedAt = Date.now();

    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'User-Agent': 'NBL-KnowledgeBot/0.1 (+https://nextbeinglab.org)',
                Accept: 'text/html,application/xhtml+xml',
            },
        });

        if (!response.ok) {
            const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
            return {
                ok: false,
                status: response.status,
                error: `HTTP ${response.status}`,
                errorCode: null,
                html: '',
                finalUrl: url,
                durationMs: Date.now() - startedAt,
                failureType: classifyFailure(`HTTP ${response.status}`, response.status, null),
                retryAfterMs,
            };
        }

        const contentType = response.headers.get('content-type') || '';
        if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
            return {
                ok: false,
                status: response.status,
                error: `Unsupported content-type: ${contentType || 'unknown'}`,
                errorCode: null,
                html: '',
                finalUrl: response.url || url,
                durationMs: Date.now() - startedAt,
                failureType: 'unsupported_content_type',
                retryAfterMs: null,
            };
        }

        const html = await response.text();
        return {
            ok: true,
            status: response.status,
            error: null,
            errorCode: null,
            html,
            finalUrl: response.url || url,
            durationMs: Date.now() - startedAt,
            failureType: null,
            retryAfterMs: null,
        };
    } catch (error) {
        const errorCode = extractErrorCode(error);
        const message =
            error && typeof error === 'object' && 'name' in error && error.name === 'AbortError'
                ? `Timeout after ${timeoutMs}ms`
                : error instanceof Error
                    ? error.message
                    : 'Unknown fetch error';
        return {
            ok: false,
            status: null,
            error: message,
            errorCode,
            html: '',
            finalUrl: url,
            durationMs: Date.now() - startedAt,
            failureType: classifyFailure(message, null, errorCode),
            retryAfterMs: null,
        };
    } finally {
        clearTimeout(timer);
    }
}

async function fetchWithRetry(url, timeoutMs, domain) {
    const attempts = [];

    for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
        const domainWaitMs = await waitForDomainSlot(domain);
        const attemptStartedAt = new Date().toISOString();
        const result = await fetchWithTimeout(url, timeoutMs);
        const attemptEndedAt = new Date().toISOString();
        const isRetryable = shouldRetryResult(result);
        const exceededMaxRetries = attempt > maxRetries;
        const canRetry = !result.ok && !exceededMaxRetries && isRetryable;
        const retryReason = result.ok
            ? 'success'
            : !isRetryable
                ? 'non_retryable_failure'
                : exceededMaxRetries
                    ? 'max_retries_exhausted'
                    : result.retryAfterMs !== null
                        ? 'retry_after_header'
                        : 'exponential_backoff';

        const attemptRecord = {
            attempt,
            ok: result.ok,
            status: result.status,
            error: result.error,
            errorCode: result.errorCode,
            failureType: result.failureType,
            durationMs: result.durationMs,
            startedAt: attemptStartedAt,
            endedAt: attemptEndedAt,
            domainWaitMs,
            retryAfterMs: result.retryAfterMs,
            retryDecision: canRetry ? 'retry' : 'stop',
            retryReason,
            backoffMs: null,
        };
        attempts.push(attemptRecord);

        if (result.ok) {
            return {
                ...result,
                attempts,
                retried: attempt > 1,
                domain,
            };
        }

        if (!canRetry) {
            return {
                ...result,
                attempts,
                retried: attempt > 1,
                domain,
            };
        }

        const backoffMs = result.retryAfterMs !== null ? result.retryAfterMs : computeBackoffMs(attempt);
        attemptRecord.backoffMs = backoffMs;

        if (result.retryAfterMs !== null) {
            extendDomainCooldown(domain, backoffMs);
        }

        await sleep(backoffMs);
    }

    return {
        ok: false,
        status: null,
        error: 'Unknown retry termination',
        errorCode: null,
        html: '',
        finalUrl: url,
        durationMs: 0,
        failureType: 'unknown_error',
        retryAfterMs: null,
        attempts,
        retried: attempts.length > 1,
        domain,
    };
}

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

async function writeSnapshot(sourceId, url, html, text, title, finalUrl, structuredMetadata = null) {
    const sourceDir = path.join(outputRoot, sourceId);
    await ensureDir(sourceDir);

    const digest = hashUrl(url);
    const txtPath = path.join(sourceDir, `${digest}.txt`);
    const metaPath = path.join(sourceDir, `${digest}.meta.json`);

    if (!forceRefresh) {
        try {
            await fs.access(txtPath);
            try {
                await fs.access(metaPath);
            } catch {
                await fs.writeFile(
                    metaPath,
                    JSON.stringify(
                        {
                            sourceId,
                            url,
                            finalUrl,
                            title: title || 'n/a',
                            fetchedAt: new Date().toISOString(),
                            structuredMetadata,
                        },
                        null,
                        2,
                    ),
                    'utf8',
                );
            }
            return {
                skipped: true,
                txtPath,
                metaPath,
            };
        } catch {
            // File not found, continue.
        }
    }

    const payload = [
        `source_id: ${sourceId}`,
        `url: ${url}`,
        `final_url: ${finalUrl}`,
        `title: ${title || 'n/a'}`,
        `fetched_at: ${new Date().toISOString()}`,
        '',
        text,
    ].join('\n');

    await fs.writeFile(txtPath, payload, 'utf8');
    await fs.writeFile(
        metaPath,
        JSON.stringify(
            {
                sourceId,
                url,
                finalUrl,
                title: title || 'n/a',
                fetchedAt: new Date().toISOString(),
                structuredMetadata,
            },
            null,
            2,
        ),
        'utf8',
    );

    return {
        skipped: false,
        txtPath,
        metaPath,
        htmlChars: html.length,
        textChars: text.length,
    };
}

async function processTask(task, policy) {
    const domain = getDomain(task.url);
    if (!domain) {
        const now = new Date().toISOString();
        return {
            row: {
                sourceId: task.sourceId,
                domain: 'invalid',
                url: task.url,
                depth: task.depth,
                ok: false,
                status: null,
                error: 'Invalid URL',
                failureType: 'invalid_url',
                attempts: [
                    {
                        attempt: 1,
                        ok: false,
                        status: null,
                        error: 'Invalid URL',
                        errorCode: null,
                        failureType: 'invalid_url',
                        durationMs: 0,
                        startedAt: now,
                        endedAt: now,
                        domainWaitMs: 0,
                        retryAfterMs: null,
                        retryDecision: 'stop',
                        retryReason: 'invalid_url',
                        backoffMs: null,
                    },
                ],
                retried: false,
                linksExtracted: 0,
                linksQueued: 0,
            },
            discoveredUrls: [],
        };
    }

    if (!policy.allowedDomains.has(domain)) {
        const now = new Date().toISOString();
        return {
            row: {
                sourceId: task.sourceId,
                domain,
                url: task.url,
                depth: task.depth,
                ok: false,
                status: null,
                error: `Disallowed domain: ${domain}`,
                failureType: 'disallowed_domain',
                attempts: [
                    {
                        attempt: 1,
                        ok: false,
                        status: null,
                        error: `Disallowed domain: ${domain}`,
                        errorCode: null,
                        failureType: 'disallowed_domain',
                        durationMs: 0,
                        startedAt: now,
                        endedAt: now,
                        domainWaitMs: 0,
                        retryAfterMs: null,
                        retryDecision: 'stop',
                        retryReason: 'disallowed_domain',
                        backoffMs: null,
                    },
                ],
                retried: false,
                linksExtracted: 0,
                linksQueued: 0,
            },
            discoveredUrls: [],
        };
    }

    const result = await fetchWithRetry(task.url, requestTimeoutMs, domain);
    if (!result.ok) {
        return {
            row: {
                sourceId: task.sourceId,
                domain,
                url: task.url,
                depth: task.depth,
                ok: false,
                status: result.status,
                error: result.error,
                errorCode: result.errorCode,
                failureType: result.failureType,
                attempts: result.attempts,
                retried: result.retried,
                linksExtracted: 0,
                linksQueued: 0,
            },
            discoveredUrls: [],
        };
    }

    const title = sanitizeTitle(result.html);
    const text = stripHtml(result.html);
    const structuredMetadata =
        task.sourceId === 'jeed_reference' && (result.finalUrl || task.url).includes('/search_result.php')
            ? {
                  jeedSearchCases: extractJeedSearchCaseEntries(result.html, result.finalUrl || task.url),
              }
            : null;
    const snapshot = await writeSnapshot(
        task.sourceId,
        task.url,
        result.html,
        text,
        title,
        result.finalUrl,
        structuredMetadata,
    );
    const canExtractLinks = task.depth < policy.maxDepth;
    const extractedLinks = canExtractLinks ? extractLinksFromHtml(result.html, result.finalUrl || task.url) : [];
    const structuredCaseLinks =
        canExtractLinks && structuredMetadata && Array.isArray(structuredMetadata.jeedSearchCases)
            ? structuredMetadata.jeedSearchCases
                  .map((entry) => (entry && typeof entry.detailUrl === 'string' ? entry.detailUrl.trim() : ''))
                  .filter((value) => value.length > 0)
            : [];
    const discoveredUrls =
        structuredCaseLinks.length > 0 ? Array.from(new Set([...extractedLinks, ...structuredCaseLinks])) : extractedLinks;

    return {
        row: {
            sourceId: task.sourceId,
            domain,
            url: task.url,
            depth: task.depth,
            finalUrl: result.finalUrl,
            ok: true,
            status: result.status,
            skipped: snapshot.skipped,
            textPath: snapshot.txtPath,
            title,
            textChars: snapshot.textChars ?? 0,
            attempts: result.attempts,
            retried: result.retried,
            linksExtracted: discoveredUrls.length,
            linksQueued: 0,
            structuredEntryCount:
                structuredMetadata && Array.isArray(structuredMetadata.jeedSearchCases)
                    ? structuredMetadata.jeedSearchCases.length
                    : 0,
        },
        discoveredUrls,
    };
}

async function crawlSource(source, policy) {
    const seedUrls = resolveSeedUrls(source);
    const queue = [];
    const seen = new Set();
    let tasksPrepared = 0;
    let discoveredLinksEnqueued = 0;

    for (const seedUrl of seedUrls) {
        const normalized = normalizeUrl(seedUrl);
        if (!normalized) continue;
        if (!isAllowedByPolicy(normalized, policy)) continue;
        if (seen.has(normalized)) continue;
        seen.add(normalized);
        queue.push({ sourceId: source.id, url: normalized, depth: 0 });
        tasksPrepared += 1;
    }

    const results = [];
    let processed = 0;

    while (queue.length > 0 && processed < policy.maxPages) {
        const remainingCapacity = policy.maxPages - processed;
        const batchSize = Math.min(fetchConcurrency, queue.length, remainingCapacity);
        const batch = queue.splice(0, batchSize);

        const batchResults = await Promise.all(batch.map((task) => processTask(task, policy)));

        for (const [index, outcome] of batchResults.entries()) {
            const task = batch[index];
            const row = outcome.row;
            const candidates = prioritizeDiscoveredUrls(outcome.discoveredUrls, policy);

            if (row.ok && task.depth < policy.maxDepth) {
                let queuedFromPage = 0;
                for (const candidate of candidates) {
                    if (!isAllowedByPolicy(candidate, policy)) continue;
                    if (seen.has(candidate)) continue;
                    if (queuedFromPage >= maxDiscoveredLinksPerPage) break;
                    if (tasksPrepared >= policy.maxPages) break;
                    seen.add(candidate);
                    queue.push({
                        sourceId: source.id,
                        url: candidate,
                        depth: task.depth + 1,
                    });
                    tasksPrepared += 1;
                    discoveredLinksEnqueued += 1;
                    row.linksQueued += 1;
                    queuedFromPage += 1;
                    if (queue.length + processed >= policy.maxPages) break;
                }
            }

            results.push(row);
        }

        processed += batch.length;
    }

    const sourceStats = {
        policy: {
            maxDepth: policy.maxDepth,
            maxPages: policy.maxPages,
            allowedDomains: Array.from(policy.allowedDomains),
            allowPathPrefixes: policy.allowPathPrefixes,
        },
        tasksPrepared,
        results: results.length,
        discoveredLinksEnqueued,
        pagesFetched: results.filter((row) => row.ok && !row.skipped).length,
        pagesSkipped: results.filter((row) => row.ok && row.skipped).length,
        failures: results.filter((row) => !row.ok).length,
    };

    return {
        results,
        tasksPrepared,
        discoveredLinksEnqueued,
        sourceStats,
    };
}

function buildFailureTypeBreakdown(results) {
    const breakdown = {};
    for (const row of results) {
        if (row.ok) continue;
        const key = row.failureType || 'unknown_error';
        breakdown[key] = (breakdown[key] || 0) + 1;
    }
    return breakdown;
}

function buildDomainStats(results) {
    const stats = {};

    for (const row of results) {
        const domain = row.domain || 'unknown';
        if (!stats[domain]) {
            stats[domain] = {
                tasks: 0,
                successes: 0,
                skipped: 0,
                failures: 0,
                retried: 0,
                totalAttempts: 0,
                avgAttemptDurationMs: 0,
                failuresByType: {},
                statusBuckets: {},
                _durationSum: 0,
            };
        }

        const target = stats[domain];
        target.tasks += 1;
        if (row.ok) {
            target.successes += 1;
            if (row.skipped) target.skipped += 1;
        } else {
            target.failures += 1;
            const failureType = row.failureType || 'unknown_error';
            target.failuresByType[failureType] = (target.failuresByType[failureType] || 0) + 1;
        }

        if (row.retried) {
            target.retried += 1;
        }

        const attempts = Array.isArray(row.attempts) ? row.attempts : [];
        target.totalAttempts += attempts.length;

        for (const attempt of attempts) {
            if (typeof attempt.durationMs === 'number') {
                target._durationSum += attempt.durationMs;
            }
            if (typeof attempt.status === 'number') {
                const bucket = `${Math.floor(attempt.status / 100)}xx`;
                target.statusBuckets[bucket] = (target.statusBuckets[bucket] || 0) + 1;
            }
        }
    }

    for (const value of Object.values(stats)) {
        value.avgAttemptDurationMs =
            value.totalAttempts > 0 ? Math.round(value._durationSum / value.totalAttempts) : 0;
        delete value._durationSum;
    }

    return stats;
}

function buildSourceStats(results) {
    const stats = {};
    for (const row of results) {
        const sourceId = row.sourceId || 'unknown';
        if (!stats[sourceId]) {
            stats[sourceId] = {
                tasks: 0,
                successes: 0,
                skipped: 0,
                failures: 0,
                discoveredLinks: 0,
                queuedLinks: 0,
            };
        }

        const target = stats[sourceId];
        target.tasks += 1;
        if (row.ok) {
            target.successes += 1;
            if (row.skipped) target.skipped += 1;
        } else {
            target.failures += 1;
        }
        target.discoveredLinks += row.linksExtracted || 0;
        target.queuedLinks += row.linksQueued || 0;
    }
    return stats;
}

async function writeManifest({
    generatedAt,
    sourcesProcessed,
    tasksPrepared,
    pagesFetched,
    pagesSkipped,
    failures,
    totalAttempts,
    failureTypeBreakdown,
    domainStats,
    sourceStats,
    sourceCrawlStats,
    discoveredLinksEnqueued,
    results,
}) {
    await ensureDir(outputRoot);
    await fs.writeFile(
        manifestPath,
        JSON.stringify(
            {
                generatedAt,
                includeDisabled,
                forceRefresh,
                requestTimeoutMs,
                maxRetries,
                retryBaseMs,
                retryMaxMs,
                retryAfterMaxMs,
                fetchConcurrency,
                domainMinIntervalMs,
                defaultCrawlDepth,
                defaultMaxPagesPerSource,
                maxDiscoveredLinksPerPage,
                sourcesProcessed,
                tasksPrepared,
                pagesFetched,
                pagesSkipped,
                failures,
                totalAttempts,
                discoveredLinksEnqueued,
                failureTypeBreakdown,
                domainStats,
                sourceStats,
                sourceCrawlStats,
                results,
            },
            null,
            2,
        ),
        'utf8',
    );
}

async function main() {
    const sources = await loadSources();
    const startedAt = new Date().toISOString();

    if (sources.length === 0) {
        await writeManifest({
            generatedAt: startedAt,
            sourcesProcessed: 0,
            tasksPrepared: 0,
            pagesFetched: 0,
            pagesSkipped: 0,
            failures: 0,
            totalAttempts: 0,
            discoveredLinksEnqueued: 0,
            failureTypeBreakdown: {},
            domainStats: {},
            sourceStats: {},
            sourceCrawlStats: {},
            results: [],
        });
        console.log('No website sources selected. Nothing fetched.');
        return;
    }

    if (sourceIdFilter) {
        const selected = Array.from(sourceIdFilter);
        const actual = new Set(sources.map((source) => source.id));
        const missing = selected.filter((id) => !actual.has(id));
        if (missing.length > 0) {
            console.warn(`Requested source IDs were not selected: ${missing.join(', ')}`);
        }
        console.log(`Source filter: ${selected.join(', ')}`);
    }

    const allResults = [];
    let tasksPrepared = 0;
    let discoveredLinksEnqueued = 0;
    const sourceCrawlStats = {};

    for (const source of sources) {
        const policy = buildSourcePolicy(source);
        const outcome = await crawlSource(source, policy);
        allResults.push(...outcome.results);
        tasksPrepared += outcome.tasksPrepared;
        discoveredLinksEnqueued += outcome.discoveredLinksEnqueued;
        sourceCrawlStats[source.id] = outcome.sourceStats;
    }

    const pagesFetched = allResults.filter((row) => row.ok && !row.skipped).length;
    const pagesSkipped = allResults.filter((row) => row.ok && row.skipped).length;
    const failures = allResults.filter((row) => !row.ok).length;
    const totalAttempts = allResults.reduce(
        (sum, row) => sum + (Array.isArray(row.attempts) ? row.attempts.length : 0),
        0,
    );
    const failureTypeBreakdown = buildFailureTypeBreakdown(allResults);
    const domainStats = buildDomainStats(allResults);
    const sourceStats = buildSourceStats(allResults);

    await writeManifest({
        generatedAt: new Date().toISOString(),
        sourcesProcessed: sources.length,
        tasksPrepared,
        pagesFetched,
        pagesSkipped,
        failures,
        totalAttempts,
        discoveredLinksEnqueued,
        failureTypeBreakdown,
        domainStats,
        sourceStats,
        sourceCrawlStats,
        results: allResults,
    });

    console.log(`Sources processed: ${sources.length}`);
    console.log(`Tasks prepared: ${tasksPrepared}`);
    console.log(`Pages fetched: ${pagesFetched}`);
    console.log(`Pages skipped: ${pagesSkipped}`);
    console.log(`Failures: ${failures}`);
    console.log(`Total attempts: ${totalAttempts}`);
    console.log(`Discovered links enqueued: ${discoveredLinksEnqueued}`);
    console.log(`Concurrency: ${fetchConcurrency}`);
    console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
