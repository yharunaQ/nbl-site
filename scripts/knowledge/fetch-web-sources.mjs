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
const includeDisabled = process.env.KNOWLEDGE_FETCH_INCLUDE_DISABLED === '1';
const forceRefresh = process.env.KNOWLEDGE_FETCH_FORCE === '1';
const requestTimeoutMs = Number(process.env.KNOWLEDGE_FETCH_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
const maxRetries = Number(process.env.KNOWLEDGE_FETCH_RETRIES || DEFAULT_MAX_RETRIES);
const retryBaseMs = Number(process.env.KNOWLEDGE_FETCH_RETRY_BASE_MS || DEFAULT_RETRY_BASE_MS);
const retryMaxMs = Number(process.env.KNOWLEDGE_FETCH_RETRY_MAX_MS || DEFAULT_RETRY_MAX_MS);

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
    const jitter = Math.floor(Math.random() * Math.min(250, Math.floor(raw * 0.25)));
    return raw + jitter;
}

function isRetryableStatus(status) {
    if (status === null || status === undefined) return true;
    if (status === 408 || status === 425 || status === 429) return true;
    return status >= 500 && status <= 599;
}

function classifyFailure(error, status) {
    if (status !== null && status !== undefined) {
        if (status === 429) return 'rate_limited';
        if (status >= 500) return 'server_error';
        if (status >= 400) return 'client_error';
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

async function loadSources() {
    const raw = await fs.readFile(configPath, 'utf8');
    const list = JSON.parse(raw);
    return list.filter((source) => {
        if (source.kind !== 'website') return false;
        return includeDisabled ? true : Boolean(source.enabled);
    });
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
            return {
                ok: false,
                status: response.status,
                error: `HTTP ${response.status}`,
                html: '',
                finalUrl: url,
                durationMs: Date.now() - startedAt,
                failureType: classifyFailure(`HTTP ${response.status}`, response.status),
            };
        }

        const contentType = response.headers.get('content-type') || '';
        if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
            return {
                ok: false,
                status: response.status,
                error: `Unsupported content-type: ${contentType || 'unknown'}`,
                html: '',
                finalUrl: response.url || url,
                durationMs: Date.now() - startedAt,
                failureType: 'unsupported_content_type',
            };
        }

        const html = await response.text();
        return {
            ok: true,
            status: response.status,
            error: null,
            html,
            finalUrl: response.url || url,
            durationMs: Date.now() - startedAt,
            failureType: null,
        };
    } catch (error) {
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
            html: '',
            finalUrl: url,
            durationMs: Date.now() - startedAt,
            failureType: classifyFailure(message, null),
        };
    } finally {
        clearTimeout(timer);
    }
}

async function fetchWithRetry(url, timeoutMs) {
    const attempts = [];

    for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
        const result = await fetchWithTimeout(url, timeoutMs);
        attempts.push({
            attempt,
            ok: result.ok,
            status: result.status,
            error: result.error,
            failureType: result.failureType,
            durationMs: result.durationMs,
        });

        if (result.ok) {
            return {
                ...result,
                attempts,
                retried: attempt > 1,
            };
        }

        const canRetry = attempt <= maxRetries && isRetryableStatus(result.status);
        if (!canRetry) {
            return {
                ...result,
                attempts,
                retried: attempt > 1,
            };
        }

        await sleep(computeBackoffMs(attempt));
    }

    return {
        ok: false,
        status: null,
        error: 'Unknown retry termination',
        html: '',
        finalUrl: url,
        durationMs: 0,
        failureType: 'unknown_error',
        attempts,
        retried: attempts.length > 1,
    };
}

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

async function writeSnapshot(sourceId, url, html, text, title, finalUrl) {
    const sourceDir = path.join(outputRoot, sourceId);
    await ensureDir(sourceDir);

    const digest = hashUrl(url);
    const txtPath = path.join(sourceDir, `${digest}.txt`);

    if (!forceRefresh) {
        try {
            await fs.access(txtPath);
            return {
                skipped: true,
                txtPath,
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

    return {
        skipped: false,
        txtPath,
        htmlChars: html.length,
        textChars: text.length,
    };
}

async function main() {
    const sources = await loadSources();
    const startedAt = new Date().toISOString();
    const results = [];

    if (sources.length === 0) {
        await ensureDir(outputRoot);
        await fs.writeFile(
            manifestPath,
            JSON.stringify(
                {
                    generatedAt: startedAt,
                    includeDisabled,
                    sourcesProcessed: 0,
                    pagesFetched: 0,
                    pagesSkipped: 0,
                    failures: 0,
                    results: [],
                },
                null,
                2,
            ),
            'utf8',
        );
        console.log('No website sources selected. Nothing fetched.');
        return;
    }

    for (const source of sources) {
        const seedUrls = Array.isArray(source.seedUrls) && source.seedUrls.length > 0 ? source.seedUrls : [source.location];
        for (const url of seedUrls) {
            const result = await fetchWithRetry(url, requestTimeoutMs);
            if (!result.ok) {
                results.push({
                    sourceId: source.id,
                    url,
                    ok: false,
                    status: result.status,
                    error: result.error,
                    failureType: result.failureType,
                    attempts: result.attempts,
                    retried: result.retried,
                });
                continue;
            }

            const title = sanitizeTitle(result.html);
            const text = stripHtml(result.html);
            const snapshot = await writeSnapshot(source.id, url, result.html, text, title, result.finalUrl);

            results.push({
                sourceId: source.id,
                url,
                finalUrl: result.finalUrl,
                ok: true,
                status: result.status,
                skipped: snapshot.skipped,
                textPath: snapshot.txtPath,
                title,
                textChars: snapshot.textChars ?? 0,
                attempts: result.attempts,
                retried: result.retried,
            });
        }
    }

    const pagesFetched = results.filter((row) => row.ok && !row.skipped).length;
    const pagesSkipped = results.filter((row) => row.ok && row.skipped).length;
    const failures = results.filter((row) => !row.ok).length;

    await ensureDir(outputRoot);
    await fs.writeFile(
        manifestPath,
        JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                includeDisabled,
                forceRefresh,
                requestTimeoutMs,
                maxRetries,
                sourcesProcessed: sources.length,
                pagesFetched,
                pagesSkipped,
                failures,
                results,
            },
            null,
            2,
        ),
        'utf8',
    );

    console.log(`Sources processed: ${sources.length}`);
    console.log(`Pages fetched: ${pagesFetched}`);
    console.log(`Pages skipped: ${pagesSkipped}`);
    console.log(`Failures: ${failures}`);
    console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
