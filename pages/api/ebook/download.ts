import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'node:fs';
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { EBOOK_PRODUCT_CODE, getEbookRuntimeConfig } from '@/lib/ebook/config';
import { verifyEbookDownloadToken } from '@/lib/ebook/token';

function readToken(req: NextApiRequest): string {
  const raw = req.query.token;
  if (Array.isArray(raw)) return String(raw[0] || '').trim();
  return String(raw || '').trim();
}

function contentTypeByExt(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.epub') return 'application/epub+zip';
  if (ext === '.txt') return 'text/plain; charset=utf-8';
  return 'application/octet-stream';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = getEbookRuntimeConfig();
    const token = readToken(req);
    if (!token) {
      return res.status(400).json({ error: 'token is required' });
    }

    const payload = verifyEbookDownloadToken(token, config.downloadTokenSecret);
    if (!payload) {
      return res.status(403).json({ error: 'Invalid or expired download token' });
    }
    if (payload.prod !== EBOOK_PRODUCT_CODE) {
      return res.status(403).json({ error: 'Token product mismatch' });
    }

    let stat;
    try {
      stat = await fsp.stat(config.ebookFilePath);
      if (!stat.isFile()) {
        return res.status(503).json({ error: 'Guidebook file is not configured' });
      }
    } catch {
      return res.status(503).json({ error: 'Guidebook file is not configured' });
    }

    res.setHeader('Content-Type', contentTypeByExt(config.ebookFilePath));
    res.setHeader('Content-Length', String(stat.size));
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${config.ebookFileName}"; filename*=UTF-8''${encodeURIComponent(
        config.ebookFileName,
      )}`,
    );

    const stream = fs.createReadStream(config.ebookFilePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream ebook file' });
      } else {
        res.destroy();
      }
    });
    stream.pipe(res);
    return;
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to deliver guidebook',
    });
  }
}
