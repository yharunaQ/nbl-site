import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { registerToken } from '@/lib/security/jacTokenRegistry';

const APPLY_DIR = path.join(process.cwd(), '.tmp', 'jac-apply');

function resendApiKey(): string {
  return process.env.RESEND_API_KEY || '';
}

function notifyEmail(): string {
  return process.env.APPLY_NOTIFY_EMAIL || '';
}

function fromEmail(): string {
  return process.env.APPLY_FROM_EMAIL || 'noreply@send.nextbeinglab.org';
}

function siteOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nextbeinglab.org').trim();
  return raw.replace(/\/+$/, '');
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const key = resendApiKey();
  if (!key || !to) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromEmail(), to, subject, html }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = String(req.body?.email || '').trim();
  const name = String(req.body?.name || '').trim();
  const role = String(req.body?.role || '').trim();
  const memo = String(req.body?.memo || '').slice(0, 400).trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'メールアドレスが正しくありません。' });
  }

  const timestamp = new Date().toISOString();

  // Generate access token
  const token = crypto.randomUUID();
  await registerToken(token);

  // ファイル保存（ローカル・VPS環境向け。Vercelでは揮発するが害はない）
  try {
    fs.mkdirSync(APPLY_DIR, { recursive: true });
    const filename = `${timestamp.replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 7)}.json`;
    fs.writeFileSync(
      path.join(APPLY_DIR, filename),
      JSON.stringify({ timestamp, email, name, role, memo, tokenIssued: true }, null, 2),
      'utf-8',
    );
  } catch {
    // ファイル保存失敗はサイレントに無視（Vercel等では正常）
  }

  const toolUrl = `${siteOrigin()}/jac/next`;

  // 申込者へのトークン発行メール
  const confirmHtml = `
<p>${name ? `${name} さん、` : ''}お申込みありがとうございます。</p>
<p>Next Being Lab の「就労支援見立てサポート」のアクセストークンを発行しました。</p>

<p style="margin:20px 0">
  <strong style="font-size:14px;color:#1e293b">アクセストークン：</strong><br>
  <code style="display:block;margin-top:8px;padding:12px 16px;background:#f1f5f9;border-radius:8px;font-size:15px;color:#0f172a;word-break:break-all">${token}</code>
</p>

<p>ツールを使うには以下のリンクにアクセスし、入力フォームの下にある「アクセストークンを入力」欄にコードを貼り付けてください。</p>
<p><a href="${toolUrl}" style="color:#0891b2">${toolUrl}</a></p>

<ul style="font-size:13px;color:#64748b;margin-top:20px;padding-left:20px;line-height:2">
  <li>利用上限：アセスメント実行 1日20件（日本時間0時リセット）</li>
  <li>用途：就労支援業務での相談整理に限る</li>
  <li>このトークンは個人単位です。第三者への共有はご遠慮ください。</li>
</ul>

<p style="margin-top:24px;color:#94a3b8;font-size:12px">
  Next Being Lab<br>
  ${siteOrigin()}
</p>
  `.trim();

  await sendEmail(
    email,
    '【Next Being Lab】就労支援見立てサポート アクセストークンを発行しました',
    confirmHtml,
  );

  // 運営への通知メール（参考記録）
  const notifyTo = notifyEmail();
  if (notifyTo) {
    const notifyHtml = `
<p>利用申込が届き、トークンを自動発行しました。</p>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">
  <tr><td style="color:#666">日時</td><td>${timestamp}</td></tr>
  <tr><td style="color:#666">メール</td><td>${email}</td></tr>
  <tr><td style="color:#666">氏名</td><td>${name || '（未記入）'}</td></tr>
  <tr><td style="color:#666">役割</td><td>${role || '（未記入）'}</td></tr>
  <tr><td style="color:#666">備考</td><td style="white-space:pre-wrap">${memo || '（なし）'}</td></tr>
</table>
<p style="margin-top:16px;color:#555;font-size:13px">
  トークンは自動発行済みです。不正利用が疑われる場合は Upstash の <code>jac:token-registry</code> セットから該当ハッシュを削除してください。
</p>
    `.trim();
    await sendEmail(notifyTo, `【NBL申込】${name || email} さんから利用申込（自動発行済み）`, notifyHtml);
  }

  return res.status(200).json({ ok: true });
}
