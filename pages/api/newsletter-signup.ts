import type { NextApiRequest, NextApiResponse } from 'next';

function resendApiKey(): string {
  return process.env.RESEND_API_KEY || '';
}

function fromEmail(): string {
  return process.env.APPLY_FROM_EMAIL || 'noreply@send.nextbeinglab.org';
}

function notifyEmail(): string {
  return process.env.APPLY_NOTIFY_EMAIL || '';
}

async function getAudienceId(): Promise<string | null> {
  const key = resendApiKey();
  if (!key) return null;
  try {
    const res = await fetch('https://api.resend.com/audiences', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { id: string }[] };
    return json.data?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function addContact(audienceId: string, email: string): Promise<boolean> {
  const key = resendApiKey();
  if (!key) return false;
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  return res.ok;
}

async function sendConfirmation(email: string): Promise<void> {
  const key = resendApiKey();
  if (!key) return;
  const html = `
<p>ご登録ありがとうございます。</p>
<p>Next Being Lab のニュースレターにご登録いただきました。</p>
<p>仕事設計の方法論、AIツールのアップデート、新しいリソースなどをお届けします。</p>
<p style="margin-top:24px;color:#888;font-size:12px">
  Next Being Lab<br>
  https://nextbeinglab.org<br><br>
  配信停止はメール末尾のリンクからいつでも可能です。
</p>
  `.trim();
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail(),
      to: email,
      subject: '【Next Being Lab】ニュースレターにご登録いただきました',
      html,
    }),
  });
}

async function notifyOperator(email: string): Promise<void> {
  const to = notifyEmail();
  const key = resendApiKey();
  if (!to || !key) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail(),
      to,
      subject: `【NBL】ニュースレター登録: ${email}`,
      html: `<p>新しいニュースレター登録がありました。</p><p>メールアドレス: <strong>${email}</strong></p><p>日時: ${new Date().toISOString()}</p>`,
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'メールアドレスが正しくありません。' });
  }

  const audienceId = await getAudienceId();
  if (audienceId) {
    await addContact(audienceId, email);
  }

  await Promise.all([sendConfirmation(email), notifyOperator(email)]);

  return res.status(200).json({ ok: true });
}
