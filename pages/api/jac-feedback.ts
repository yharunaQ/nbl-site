import type { NextApiRequest, NextApiResponse } from 'next';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';
import fs from 'fs';
import path from 'path';

const FEEDBACK_DIR = path.join(process.cwd(), '.tmp', 'jac-feedback');
const FEEDBACK_ARCHIVE_DIR = path.join(process.cwd(), 'references', 'jac', 'feedback');

function buildMarkdownSnapshot(timestamp: string, feedbackText: string) {
  return `# ${timestamp}

## フィードバック元
配慮設計アシスト フォーム

## 内容
${feedbackText}
`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const guard = await guardJacApiRequest(req, { route: 'jac-feedback', costly: false });
  if (!guard.ok) {
    return res.status(guard.status).json({ error: guard.error });
  }

  const feedbackText = String(req.body?.feedbackText || '').trim();

  if (!feedbackText) {
    return res.status(400).json({ error: 'feedbackText が必要です。' });
  }

  try {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
    fs.mkdirSync(FEEDBACK_ARCHIVE_DIR, { recursive: true });
    const timestamp = new Date().toISOString();
    const suffix = Math.random().toString(36).slice(2, 7);
    const jsonFilename = `${timestamp.replace(/[:.]/g, '-')}-${suffix}.json`;
    const markdownFilename = `${timestamp.slice(0, 10)}-${suffix}.md`;
    const filepath = path.join(FEEDBACK_DIR, jsonFilename);
    fs.writeFileSync(
      filepath,
      JSON.stringify({ timestamp, feedbackText }, null, 2),
      'utf-8',
    );
    fs.writeFileSync(
      path.join(FEEDBACK_ARCHIVE_DIR, markdownFilename),
      buildMarkdownSnapshot(timestamp, feedbackText),
      'utf-8',
    );
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: '保存に失敗しました。' });
  }
}
