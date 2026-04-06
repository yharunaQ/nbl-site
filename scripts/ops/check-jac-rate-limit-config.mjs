import process from 'node:process';

function truthy(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === 'true';
}

function envValue(name) {
  return String(process.env[name] || '').trim();
}

function printLine(label, value) {
  console.log(`${label}: ${value}`);
}

const isVercel = envValue('VERCEL') === '1';
const upstashUrl = envValue('UPSTASH_REDIS_REST_URL');
const upstashToken = envValue('UPSTASH_REDIS_REST_TOKEN');
const rateLimitTimeZone = envValue('JAC_RATE_LIMIT_TIMEZONE') || 'Asia/Tokyo';
const costlyLimit = envValue('JAC_COSTLY_RATE_LIMIT_PER_TOKEN_PER_DAY') || '20';
const fallbackRaw = envValue('JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK');
const accessTokenRequired = truthy(envValue('JAC_ACCESS_TOKEN_REQUIRED'));
const fallbackEnabled =
  fallbackRaw === '' ? !isVercel : truthy(fallbackRaw);

const issues = [];
const notes = [];

if (isVercel && !upstashUrl) {
  issues.push('`UPSTASH_REDIS_REST_URL` が未設定です。Vercel 本番では共有 rate-limit store が必要です。');
}

if (isVercel && !upstashToken) {
  issues.push('`UPSTASH_REDIS_REST_TOKEN` が未設定です。Vercel 本番では共有 rate-limit store が必要です。');
}

if (!/^https:\/\//.test(upstashUrl) && upstashUrl) {
  issues.push('`UPSTASH_REDIS_REST_URL` は `https://...` 形式で設定してください。');
}

if (isVercel && fallbackEnabled) {
  issues.push('Vercel では `JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK=false` を推奨します。');
}

if (rateLimitTimeZone !== 'Asia/Tokyo') {
  notes.push(`現在のリセット基準は ${rateLimitTimeZone} です。日本向け運用なら Asia/Tokyo 推奨です。`);
}

if (costlyLimit !== '20') {
  notes.push(`現在の 1日上限は ${costlyLimit} 件です。想定とずれていないか確認してください。`);
}

if (accessTokenRequired) {
  notes.push('`JAC_ACCESS_TOKEN_REQUIRED=true` のため、公開 /jac/next でもアクセストークンが必要になります。');
}

printLine('JAC Rate Limit Mode', isVercel ? 'vercel' : 'local_or_vps');
printLine('UPSTASH_REDIS_REST_URL', upstashUrl ? 'set' : 'missing');
printLine('UPSTASH_REDIS_REST_TOKEN', upstashToken ? 'set' : 'missing');
printLine('JAC_RATE_LIMIT_TIMEZONE', rateLimitTimeZone);
printLine('JAC_COSTLY_RATE_LIMIT_PER_TOKEN_PER_DAY', costlyLimit);
printLine('JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK', fallbackEnabled ? 'true' : 'false');
printLine('JAC_ACCESS_TOKEN_REQUIRED', accessTokenRequired ? 'true' : 'false');

if (issues.length === 0) {
  console.log('');
  console.log('Status: READY');
} else {
  console.log('');
  console.log('Status: NOT READY');
  for (const issue of issues) {
    console.log(`- ${issue}`);
  }
}

if (notes.length > 0) {
  console.log('');
  console.log('Notes:');
  for (const note of notes) {
    console.log(`- ${note}`);
  }
}

if (issues.length > 0) {
  process.exitCode = 1;
}
