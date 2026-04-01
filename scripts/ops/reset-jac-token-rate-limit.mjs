import crypto from 'node:crypto';
import process from 'node:process';

function envValue(name, fallback = '') {
  return String(process.env[name] || fallback).trim();
}

function formatDayKey(date, timeZone) {
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

function hashKeyPart(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function argValue(name) {
  const index = process.argv.findIndex((item) => item === name);
  if (index === -1) return '';
  return String(process.argv[index + 1] || '').trim();
}

const upstashUrl = envValue('UPSTASH_REDIS_REST_URL');
const upstashToken = envValue('UPSTASH_REDIS_REST_TOKEN');
const jacToken = argValue('--token') || envValue('JAC_RESET_TOKEN');
const timeZone = envValue('JAC_RATE_LIMIT_TIMEZONE', 'Asia/Tokyo');
const dayKey = argValue('--day-key') || formatDayKey(new Date(), timeZone);

if (!upstashUrl || !upstashToken) {
  console.error('UPSTASH_REDIS_REST_URL と UPSTASH_REDIS_REST_TOKEN が必要です。');
  process.exit(1);
}

if (!jacToken) {
  console.error('対象トークンが必要です。`--token` か `JAC_RESET_TOKEN` を指定してください。');
  process.exit(1);
}

const tokenKey = `jac:rate-limit:${dayKey}:token:${hashKeyPart(jacToken)}`;

const response = await fetch(`${upstashUrl.replace(/\/+$/, '')}/del/${tokenKey}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${upstashToken}`,
  },
});

const payload = await response.json().catch(() => null);
if (!response.ok) {
  const message =
    payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error || '')
      : response.statusText;
  console.error(`Reset failed (${response.status}): ${message || 'unknown error'}`);
  process.exit(1);
}

console.log(`Reset token counter for ${dayKey}.`);
