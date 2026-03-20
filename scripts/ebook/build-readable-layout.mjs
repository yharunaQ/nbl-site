#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST_DIR = path.join(process.cwd(), 'docs', 'guidebook', 'dist');

function parseCliArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const [k, v] = token.split('=');
    if (typeof v !== 'undefined') {
      args[k] = v;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[k] = next;
      i += 1;
    } else {
      args[k] = 'true';
    }
  }
  return args;
}

const cliArgs = parseCliArgs(process.argv.slice(2));
const inputArg =
  cliArgs['--input'] || path.join('docs', 'guidebook', 'manuscript-readable-sample.md');
const INPUT_PATH = path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);
const inputBaseName = path.basename(INPUT_PATH, path.extname(INPUT_PATH));
const outputBaseArg = (cliArgs['--output-base'] || '').trim();
const OUTPUT_BASE = outputBaseArg || inputBaseName;
const HTML_PATH = path.join(DIST_DIR, `${OUTPUT_BASE}.html`);
const PDF_PATH = path.join(DIST_DIR, `${OUTPUT_BASE}.pdf`);

const CHROME_CANDIDATES = [
  'google-chrome',
  'chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const FULL_CARD_LAYER_TITLES = {
  health: [
    '体調変動マネジメント',
    '治療スケジュール同期',
    '回復時間バッファ設計',
    '勤務リズム整合',
    '復職ランプ設計',
    '悪化予兆ハンドリング',
    '感覚環境チューニング',
    '通勤負荷分散',
    '移動動線最適化',
  ],
  transition: [
    '職務探索ナビゲーション',
    '応募オペレーション設計',
    '面接合意形成デザイン',
    '学習パス接続',
    '実習採用ブリッジ',
    '契約収入の安定設計',
    '支援接続アーキテクチャ',
  ],
  operation: [
    '会議処理容量設計',
    '情報開示レイヤー設計',
    '相談運用ガバナンス',
    '対人応答負荷マネジメント',
    '視覚情報アクセス設計',
    '聴覚情報アクセス設計',
    '指示明確化プロトコル',
    'タスク切替マネジメント',
    '記憶遂行サポート設計',
    '安全クリティカル運用設計',
  ],
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveMediaUrl(rawUrl, inputDir) {
  const url = String(rawUrl || '').trim();
  if (!url) return '';
  if (/^(https?:|data:|file:)/i.test(url)) return url;
  const absolutePath = path.resolve(inputDir, url);
  return pathToFileURL(absolutePath).toString();
}

function renderImageFigure(altText, srcRaw, options = {}) {
  const inputDir = options.inputDir || process.cwd();
  const src = resolveMediaUrl(srcRaw, inputDir);
  const alt = String(altText || '').trim() || 'illustration';
  return `<figure class="illustration"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />${
    alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ''
  }</figure>`;
}

function inlineMarkdown(value, options = {}) {
  let output = escapeHtml(value);
  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) =>
    renderImageFigure(alt, src, options),
  );
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return output;
}

function headingId(index) {
  return `sec-${String(index).padStart(3, '0')}`;
}

function resolveLayoutVariant({ outputBase, inputPath }) {
  const joined = `${String(outputBase || '')} ${String(inputPath || '')}`.toLowerCase();
  if (joined.includes('focus5-card-sample')) return 'focus-card-editorial';
  if (joined.includes('26-card-edition')) return 'full-card-editorial';
  return 'default';
}

function resolveLayerTheme(text, options = {}) {
  const variant = options.layoutVariant || 'default';
  if (variant !== 'full-card-editorial') {
    return { className: '', label: '' };
  }

  const value = String(text || '');
  if (value.includes('体調レイヤー')) return { className: 'layer-health', label: '体調レイヤー' };
  if (value.includes('就職移行レイヤー')) {
    return { className: 'layer-transition', label: '就職移行レイヤー' };
  }
  if (value.includes('職場運用レイヤー')) {
    return { className: 'layer-operation', label: '職場運用レイヤー' };
  }

  return { className: '', label: '' };
}

function resolveFrameTheme(text, options = {}) {
  const variant = options.layoutVariant || 'default';
  if (variant === 'full-card-editorial') {
    const value = String(text || '');
    if (FULL_CARD_LAYER_TITLES.health.some((title) => value.includes(title))) {
      return { className: 'frame-health', kindLabel: '' };
    }
    if (FULL_CARD_LAYER_TITLES.transition.some((title) => value.includes(title))) {
      return { className: 'frame-transition', kindLabel: '' };
    }
    if (FULL_CARD_LAYER_TITLES.operation.some((title) => value.includes(title))) {
      return { className: 'frame-operation', kindLabel: '' };
    }
    return { className: 'frame-common', kindLabel: '' };
  }

  if (variant !== 'focus-card-editorial') {
    return { className: '', kindLabel: '' };
  }

  const value = String(text || '');
  if (value.includes('支援接続アーキテクチャ')) {
    return { className: 'frame-route', kindLabel: '支援接続型' };
  }
  if (value.includes('実習採用ブリッジ')) {
    return { className: 'frame-bridge', kindLabel: '移行設計型' };
  }
  if (value.includes('相談運用ガバナンス')) {
    return { className: 'frame-governance', kindLabel: '運用設計型' };
  }
  if (value.includes('情報開示レイヤー設計')) {
    return { className: 'frame-boundary', kindLabel: '共有境界型' };
  }
  if (value.includes('悪化予兆ハンドリング')) {
    return { className: 'frame-signal', kindLabel: '予兆対応型' };
  }

  return { className: 'frame-common', kindLabel: '総合整理型' };
}

function resolveHeadingClass(level, text, options = {}) {
  const variant = options.layoutVariant || 'default';
  if (variant === 'full-card-editorial') {
    const value = String(text || '');
    if (level === 2) return 'layer-heading';
    if (level === 4) {
      if (value.includes('こんな場面で起きやすい')) return 'section-heading section-scene';
      if (value.includes('鑑別診断')) return 'section-heading section-diagnosis';
      if (value.includes('具体的な取組み内容')) return 'section-heading section-action';
    }
    if (level === 5) {
      if (value.includes('このフレームを使うとき')) return 'subheading sub-use';
      if (value.includes('近いフレームとの見分け方')) return 'subheading sub-diff';
      if (value.includes('最初にやること')) return 'subheading sub-first';
      if (value.includes('見落としやすい点')) return 'subheading sub-risk';
      if (value.includes('補足して理解したいこと') || value.includes('設計の考え方')) {
        return 'subheading sub-context';
      }
      if (value.includes('外部と一緒に考える場面')) return 'subheading sub-support';
    }
    return '';
  }

  if (variant !== 'focus-card-editorial') return '';

  const value = String(text || '');
  if (level === 3) {
    if (value.includes('こんな場面で起きやすい')) return 'section-heading section-scene';
    if (value.includes('鑑別診断')) return 'section-heading section-diagnosis';
    if (value.includes('具体的な取組み内容')) return 'section-heading section-action';
  }
  if (level === 4) {
    if (value.includes('このフレームを使うとき')) return 'subheading sub-use';
    if (value.includes('近いフレームとの見分け方')) return 'subheading sub-diff';
    if (value.includes('最初にやること')) return 'subheading sub-first';
    if (value.includes('見落としやすい点')) return 'subheading sub-risk';
    if (value.includes('補足して理解したいこと') || value.includes('設計の考え方')) {
      return 'subheading sub-context';
    }
    if (value.includes('外部と一緒に考える場面')) return 'subheading sub-support';
  }
  return '';
}

function renderHeading(level, text, id, options = {}) {
  const variant = options.layoutVariant || 'default';
  if (variant === 'focus-card-editorial' && level === 2) {
    const frameMatch = text.match(/^フレーム\s*([0-9０-９]+)\s+(.+)$/);
    const frameTheme = resolveFrameTheme(text, options);
    if (frameMatch) {
      return `<h2 id="${id}" class="frame-heading"><span class="frame-kicker">FRAME ${escapeHtml(
        frameMatch[1],
      )}</span><span class="frame-meta">${escapeHtml(frameTheme.kindLabel)}</span><span class="frame-title">${inlineMarkdown(
        frameMatch[2],
        options,
      )}</span></h2>`;
    }
  }
  if (variant === 'full-card-editorial' && level === 3) {
    const frameMatch = text.match(/^フレーム\s*([0-9０-９]+)\s+(.+)$/);
    if (frameMatch) {
      return `<h3 id="${id}" class="frame-heading"><span class="frame-kicker">FRAME ${escapeHtml(
        frameMatch[1],
      )}</span><span class="frame-title">${inlineMarkdown(frameMatch[2], options)}</span></h3>`;
    }
  }
  const headingClass = resolveHeadingClass(level, text, options);
  const classAttr = headingClass ? ` class="${headingClass}"` : '';
  return `<h${level} id="${id}"${classAttr}>${inlineMarkdown(text, options)}</h${level}>`;
}

function parseMarkdownToHtml(markdown, options = {}) {
  const lines = String(markdown || '')
    .replace(/\r\n/g, '\n')
    .split('\n');
  const headings = [];
  const html = [];

  let paragraph = [];
  let listType = null;
  let blockquote = [];
  let codeFence = false;
  let codeLines = [];
  let codeLang = '';
  let chapterOpen = false;
  let layerOpen = false;
  let cardOpen = false;
  let headingCount = 0;
  let firstH1Captured = false;
  let documentTitle = 'JAC Guidebook';

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    closeList();
    html.push(`<p>${inlineMarkdown(paragraph.join(' '), options)}</p>`);
    paragraph = [];
  };

  const flushBlockquote = () => {
    if (blockquote.length === 0) return;
    flushParagraph();
    closeList();
    html.push(`<blockquote><p>${inlineMarkdown(blockquote.join(' '), options)}</p></blockquote>`);
    blockquote = [];
  };

  const flushCodeFence = () => {
    if (!codeFence) return;
    flushParagraph();
    closeList();
    flushBlockquote();
    const langClass = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
    html.push(`<pre><code${langClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeFence = false;
    codeLines = [];
    codeLang = '';
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (codeFence) {
        flushCodeFence();
      } else {
        flushParagraph();
        closeList();
        flushBlockquote();
        codeFence = true;
        codeLines = [];
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }
    if (codeFence) {
      codeLines.push(rawLine);
      continue;
    }

    const headingMatch = line.match(/^(#{1,5})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      flushBlockquote();

      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();

      if (level === 1 && !firstH1Captured) {
        documentTitle = text;
        firstH1Captured = true;
        continue;
      }

      headingCount += 1;
      const id = headingId(headingCount);
      headings.push({ level, text, id });

      if (options.layoutVariant === 'full-card-editorial') {
        if (level === 2) {
          if (cardOpen) {
            html.push('</article>');
            cardOpen = false;
          }
          if (layerOpen) html.push('</section>');
          const layerTheme = resolveLayerTheme(text, options);
          const sectionClasses = ['layer'];
          if (layerTheme.className) sectionClasses.push(layerTheme.className);
          html.push(`<section class="${sectionClasses.join(' ')}">`);
          layerOpen = true;
        }
        if (level === 3) {
          if (cardOpen) html.push('</article>');
          const frameTheme = resolveFrameTheme(text, options);
          const sectionClasses = ['chapter', 'card'];
          if (frameTheme.className) sectionClasses.push(frameTheme.className);
          html.push(`<article class="${sectionClasses.join(' ')}">`);
          cardOpen = true;
        }
      } else if (level === 2) {
        if (chapterOpen) html.push('</section>');
        const frameTheme = resolveFrameTheme(text, options);
        const sectionClasses = ['chapter'];
        if (frameTheme.className) sectionClasses.push(frameTheme.className);
        html.push(`<section class="${sectionClasses.join(' ')}">`);
        chapterOpen = true;
      }

      html.push(renderHeading(level, text, id, options));
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeList();
      flushBlockquote();
      html.push('<hr />');
      continue;
    }

    const imageOnlyMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageOnlyMatch) {
      flushParagraph();
      closeList();
      flushBlockquote();
      html.push(renderImageFigure(imageOnlyMatch[1], imageOnlyMatch[2], options));
      continue;
    }

    const blockquoteMatch = line.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      flushParagraph();
      closeList();
      blockquote.push(blockquoteMatch[1]);
      continue;
    } else {
      flushBlockquote();
    }

    const ulMatch = line.match(/^\s*-\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (listType !== 'ul') {
        closeList();
        html.push('<ul>');
        listType = 'ul';
      }
      html.push(`<li>${inlineMarkdown(ulMatch[1].trim(), options)}</li>`);
      continue;
    }

    const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (listType !== 'ol') {
        closeList();
        html.push('<ol>');
        listType = 'ol';
      }
      html.push(`<li>${inlineMarkdown(olMatch[1].trim(), options)}</li>`);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    paragraph.push(line);
  }

  flushCodeFence();
  flushBlockquote();
  flushParagraph();
  closeList();
  if (cardOpen) html.push('</article>');
  if (layerOpen) html.push('</section>');
  if (chapterOpen) html.push('</section>');

  return {
    title: documentTitle,
    headings,
    contentHtml: html.join('\n'),
  };
}

function buildToc(headings, layoutVariant) {
  if (layoutVariant === 'full-card-editorial') {
    const layers = [];
    let currentLayer = null;
    for (const row of headings) {
      if (row.level === 2) {
        currentLayer = {
          ...resolveLayerTheme(row.text, { layoutVariant }),
          text: row.text,
          cards: [],
        };
        layers.push(currentLayer);
        continue;
      }
      if (row.level === 3 && currentLayer) {
        currentLayer.cards.push(row);
      }
    }
    if (layers.length === 0) return '<p class="toc-empty">目次はありません。</p>';
    return `<div class="toc-groups">${layers
      .map((layer) => {
        const groupClass = ['toc-group', layer.className || ''].filter(Boolean).join(' ');
        return `<section class="${groupClass}"><h3>${escapeHtml(layer.text)}</h3><ol class="toc-list">${layer.cards
          .map((row) => `<li><a href="#${row.id}">${escapeHtml(row.text)}</a></li>`)
          .join('\n')}</ol></section>`;
      })
      .join('\n')}</div>`;
  }

  const chapterHeadings = headings.filter((row) => row.level === 2);
  if (chapterHeadings.length === 0) return '<p class="toc-empty">目次はありません。</p>';
  return `<ol class="toc-list">${chapterHeadings
    .map((row) => `<li><a href="#${row.id}">${escapeHtml(row.text)}</a></li>`)
    .join('\n')}</ol>`;
}

function buildHtmlDocument({ title, tocHtml, contentHtml, layoutVariant }) {
  const variant = layoutVariant || 'default';
  const bodyClass = variant === 'default' ? '' : ` class="theme-${escapeHtml(variant)}"`;
  const coverEyebrow =
    variant === 'focus-card-editorial'
      ? 'JAC FIELD GUIDE / CARD EDITION'
      : variant === 'full-card-editorial'
        ? 'JAC FIELD GUIDE / 26 CARD EDITION'
        : 'JAC GUIDEBOOK / READABLE EDITION';
  const coverSubtitle =
    variant === 'focus-card-editorial'
      ? '重点5フレームの編集試作。内容の流れだけでなく、カードとしての見え方と判断しやすさを検討するための版。'
      : variant === 'full-card-editorial'
        ? '重点5で検証したカード構造を、3レイヤーを保ったまま26フレーム全体へ広げた版。カードで引き、レイヤーで全体を見るための構成。'
        : 'Web版ガイドを、現場で読み進めやすい章構成に再編集した版';
  const coverFormat =
    variant === 'focus-card-editorial'
      ? '形式: 編集試作レイアウト'
      : variant === 'full-card-editorial'
        ? '形式: 26カード本番ドラフト'
        : '形式: 試作レイアウト';
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --ink: #1f2937;
      --subtle: #6b7280;
      --line: #d1d5db;
      --accent: #0f766e;
      --paper: #ffffff;
      --bg: #f8fafc;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--bg);
      font-family: "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif;
      line-height: 1.85;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .book {
      width: 210mm;
      margin: 0 auto;
      background: var(--paper);
      box-shadow: 0 6px 30px rgba(15, 23, 42, 0.08);
      min-height: 100vh;
      padding: 24mm 18mm 20mm;
    }
    .cover {
      min-height: 220mm;
      display: grid;
      align-content: center;
      gap: 10mm;
      border: 1px solid var(--line);
      padding: 16mm;
      background: linear-gradient(160deg, #f0fdfa, #ffffff 56%, #ecfeff);
    }
    .cover .eyebrow {
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 12px;
      letter-spacing: .08em;
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
    }
    .cover h1 {
      margin: 0;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 33px;
      line-height: 1.35;
      letter-spacing: 0.01em;
    }
    .cover p {
      margin: 0;
      font-size: 13px;
      color: var(--subtle);
    }
    .meta-block {
      display: grid;
      gap: 6px;
      font-size: 12px;
    }
    .toc {
      margin-top: 14mm;
      padding-top: 10mm;
      border-top: 1px solid var(--line);
    }
    .toc h2 {
      margin: 0 0 6mm;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 20px;
    }
    .toc-list {
      margin: 0;
      padding-left: 20px;
      columns: 2;
      column-gap: 16mm;
      font-size: 12px;
    }
    .toc-list li {
      break-inside: avoid;
      margin: 0 0 4px;
      padding-right: 10px;
    }
    .toc-list a {
      color: var(--ink);
      text-decoration: none;
      border-bottom: 1px solid transparent;
    }
    .toc-list a:hover {
      border-bottom-color: var(--line);
    }
    .content {
      margin-top: 16mm;
      font-size: 13px;
    }
    .chapter {
      break-before: page;
      page-break-before: always;
      padding-top: 2mm;
    }
    h2, h3, h4, h5 {
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      line-height: 1.5;
      margin-top: 0;
      margin-bottom: 4mm;
    }
    h2 {
      font-size: 24px;
      margin-bottom: 1.5mm;
    }
    .chapter > h2 + p {
      border-bottom: 2px solid #99f6e4;
      padding-bottom: 3mm;
      margin-bottom: 4.6mm;
    }
    h3 { font-size: 17px; margin-top: 7mm; }
    h4 { font-size: 14px; margin-top: 5mm; }
    h5 { font-size: 13px; margin-top: 4mm; }
    p { margin: 0 0 3.4mm; }
    ul, ol {
      margin: 0 0 4mm;
      padding-left: 20px;
    }
    li { margin-bottom: 2mm; }
    blockquote {
      margin: 0 0 4.2mm;
      padding: 4mm 4.5mm;
      border-left: 4px solid #99f6e4;
      background: #f0fdfa;
      color: #334155;
    }
    hr {
      border: 0;
      border-top: 1px solid var(--line);
      margin: 8mm 0;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.9em;
      background: #f1f5f9;
      border-radius: 4px;
      padding: 1px 4px;
    }
    pre {
      margin: 0 0 4mm;
      background: #0f172a;
      color: #e2e8f0;
      padding: 4mm;
      border-radius: 8px;
      overflow: auto;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }
    figure.illustration {
      margin: 0 0 6mm;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 3mm;
      background: #f8fafc;
    }
    figure.illustration img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 6px;
      background: #eef2ff;
    }
    figure.illustration figcaption {
      margin-top: 2mm;
      font-size: 11px;
      color: var(--subtle);
      text-align: center;
    }
    body.theme-focus-card-editorial {
      color: #2f261d;
      background:
        radial-gradient(circle at top left, #e8decf 0, #f4eee5 42%, #edf3f0 100%);
    }
    body.theme-focus-card-editorial .book {
      width: 206mm;
      background: linear-gradient(180deg, #fbf8f1 0, #f7f1e7 100%);
      box-shadow: 0 22px 56px rgba(60, 42, 18, 0.14);
      padding: 18mm 14mm 16mm;
    }
    body.theme-focus-card-editorial .cover {
      min-height: 0;
      position: relative;
      overflow: hidden;
      padding: 18mm 18mm 16mm;
      border: 1px solid #d7c7b0;
      border-radius: 24px;
      background:
        linear-gradient(135deg, rgba(15, 118, 110, 0.10), rgba(15, 23, 42, 0.04) 46%, rgba(183, 131, 56, 0.11) 100%),
        linear-gradient(180deg, #fffdf8 0, #f7efe1 100%);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
    }
    body.theme-focus-card-editorial .cover::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 38mm;
      background: linear-gradient(180deg, #0f766e 0, #164e63 100%);
      opacity: 0.92;
    }
    body.theme-focus-card-editorial .cover::after {
      content: "EDITORIAL SAMPLE";
      position: absolute;
      top: 18mm;
      right: -14mm;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 11px;
      letter-spacing: 0.22em;
      color: rgba(255, 255, 255, 0.88);
      transform: rotate(90deg);
      transform-origin: center;
    }
    body.theme-focus-card-editorial .cover .eyebrow,
    body.theme-focus-card-editorial .cover h1,
    body.theme-focus-card-editorial .cover p,
    body.theme-focus-card-editorial .cover .meta-block {
      position: relative;
      z-index: 1;
      max-width: 126mm;
    }
    body.theme-focus-card-editorial .cover .eyebrow {
      font-size: 11px;
      letter-spacing: 0.16em;
      color: #0f766e;
    }
    body.theme-focus-card-editorial .cover h1 {
      font-size: 41px;
      line-height: 1.22;
      letter-spacing: 0.02em;
      color: #1f2b26;
    }
    body.theme-focus-card-editorial .cover p:not(.eyebrow) {
      font-size: 14px;
      line-height: 1.85;
      color: #645645;
    }
    body.theme-focus-card-editorial .meta-block {
      gap: 4px;
      margin-top: 3mm;
      padding-top: 4mm;
      border-top: 1px solid rgba(112, 95, 66, 0.26);
      color: #6d5c49;
    }
    body.theme-focus-card-editorial .toc {
      margin-top: 10mm;
      padding: 8mm 9mm 7mm;
      border-top: 0;
      border: 1px solid #d8c9b3;
      border-radius: 18px;
      background: rgba(255, 252, 246, 0.86);
    }
    body.theme-focus-card-editorial .toc h2 {
      margin-bottom: 5mm;
      font-size: 12px;
      letter-spacing: 0.18em;
      color: #0f766e;
    }
    body.theme-focus-card-editorial .toc-list {
      columns: initial;
      list-style: none;
      padding-left: 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2mm 10mm;
      counter-reset: toc;
      font-size: 12px;
    }
    body.theme-focus-card-editorial .toc-list li {
      counter-increment: toc;
      position: relative;
      margin: 0;
      padding: 3mm 0 3mm 11mm;
      border-top: 1px solid #e3d7c5;
      break-inside: avoid;
    }
    body.theme-focus-card-editorial .toc-list li::before {
      content: counter(toc, decimal-leading-zero);
      position: absolute;
      top: 3mm;
      left: 0;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: #0f766e;
      font-weight: 700;
    }
    body.theme-focus-card-editorial .toc-list a {
      display: inline-block;
      color: #2f261d;
    }
    body.theme-focus-card-editorial .content {
      margin-top: 10mm;
    }
    body.theme-focus-card-editorial .content > p:first-child {
      margin-bottom: 3mm;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 11px;
      letter-spacing: 0.12em;
      color: #776655;
      text-transform: uppercase;
    }
    body.theme-focus-card-editorial .content > p:nth-child(2) {
      max-width: 142mm;
      margin-bottom: 8mm;
      padding: 5mm 6mm;
      border: 1px solid #ded0bc;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.74);
      font-size: 14px;
      line-height: 1.95;
      color: #4d4134;
    }
    body.theme-focus-card-editorial .content > hr:first-of-type {
      display: none;
    }
    body.theme-focus-card-editorial .chapter {
      --frame-accent: #0f766e;
      --frame-accent-2: #2563eb;
      --frame-accent-soft: #e9f5f1;
      --frame-accent-line: #9bd8d4;
      --frame-marker: #d7b271;
      padding: 12mm 11mm 10mm 13mm;
      border: 1px solid #ddceb7;
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.90), rgba(248, 243, 234, 0.98));
      box-shadow: 0 14px 34px rgba(58, 42, 20, 0.09);
      position: relative;
      overflow: hidden;
    }
    body.theme-focus-card-editorial .chapter::before {
      content: "";
      position: absolute;
      left: 0;
      top: 11mm;
      bottom: 11mm;
      width: 4px;
      border-radius: 999px;
      background: linear-gradient(180deg, var(--frame-accent) 0, var(--frame-accent-2) 100%);
    }
    body.theme-focus-card-editorial .chapter.frame-route {
      --frame-accent: #0f766e;
      --frame-accent-2: #1d4ed8;
      --frame-accent-soft: #e6f6f2;
      --frame-accent-line: #9bd8d4;
      --frame-marker: #b7791f;
    }
    body.theme-focus-card-editorial .chapter.frame-bridge {
      --frame-accent: #b45309;
      --frame-accent-2: #d97706;
      --frame-accent-soft: #fbeddc;
      --frame-accent-line: #efc48a;
      --frame-marker: #8c5a16;
    }
    body.theme-focus-card-editorial .chapter.frame-governance {
      --frame-accent: #1d4ed8;
      --frame-accent-2: #0f766e;
      --frame-accent-soft: #e8efff;
      --frame-accent-line: #b8c7f0;
      --frame-marker: #4f46e5;
    }
    body.theme-focus-card-editorial .chapter.frame-boundary {
      --frame-accent: #9a3412;
      --frame-accent-2: #be123c;
      --frame-accent-soft: #fbe9e4;
      --frame-accent-line: #efb6a8;
      --frame-marker: #b45309;
    }
    body.theme-focus-card-editorial .chapter.frame-signal {
      --frame-accent: #047857;
      --frame-accent-2: #b91c1c;
      --frame-accent-soft: #e7f6ef;
      --frame-accent-line: #9fd7bf;
      --frame-marker: #b91c1c;
    }
    body.theme-focus-card-editorial .chapter > hr {
      display: none;
    }
    body.theme-focus-card-editorial .chapter > h2:not(.frame-heading) {
      font-size: 26px;
      margin-bottom: 4mm;
      padding-bottom: 3mm;
      border-bottom: 2px solid #9bd8d4;
      color: #1e2d2a;
    }
    body.theme-focus-card-editorial .frame-heading {
      display: grid;
      gap: 1.6mm;
      margin-bottom: 1.8mm;
    }
    body.theme-focus-card-editorial .frame-kicker {
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--frame-accent);
      font-weight: 700;
    }
    body.theme-focus-card-editorial .frame-meta {
      display: inline-flex;
      width: fit-content;
      padding: 1mm 2.8mm;
      border-radius: 999px;
      border: 1px solid var(--frame-accent-line);
      background: var(--frame-accent-soft);
      color: var(--frame-accent);
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 10px;
      letter-spacing: 0.12em;
      font-weight: 700;
    }
    body.theme-focus-card-editorial .frame-title {
      display: block;
      font-size: 29px;
      line-height: 1.24;
      letter-spacing: 0.01em;
      color: #1d2b28;
    }
    body.theme-focus-card-editorial .chapter > h2 + p {
      max-width: 136mm;
      padding-bottom: 4mm;
      margin-bottom: 7mm;
      border-bottom: 2px solid var(--frame-accent-line);
      font-size: 15px;
      line-height: 1.86;
      color: #4c4035;
    }
    body.theme-focus-card-editorial h3 {
      display: inline-flex;
      align-items: center;
      margin-top: 8mm;
      margin-bottom: 3mm;
      padding: 1.2mm 4mm;
      border-radius: 999px;
      border: 1px solid var(--frame-accent-line);
      background: var(--frame-accent-soft);
      font-size: 12px;
      letter-spacing: 0.12em;
      color: var(--frame-accent);
    }
    body.theme-focus-card-editorial h3.section-heading::before {
      margin-right: 2.4mm;
      font-size: 9px;
      letter-spacing: 0.14em;
      font-weight: 700;
      opacity: 0.82;
    }
    body.theme-focus-card-editorial h3.section-scene::before {
      content: "SCENE";
    }
    body.theme-focus-card-editorial h3.section-diagnosis::before {
      content: "TRIAGE";
    }
    body.theme-focus-card-editorial h3.section-action::before {
      content: "ACTION";
    }
    body.theme-focus-card-editorial h3.section-action {
      background: #f6ecdc;
      border-color: #e2c79b;
      color: #8a5a15;
    }
    body.theme-focus-card-editorial h4 {
      margin-top: 4.8mm;
      margin-bottom: 2.2mm;
      padding-left: 3.2mm;
      border-left: 3px solid var(--frame-marker);
      font-size: 13px;
      color: #6c4f25;
    }
    body.theme-focus-card-editorial h4.sub-diff {
      border-left-color: var(--frame-accent);
      color: var(--frame-accent);
    }
    body.theme-focus-card-editorial h4.sub-first {
      border-left-color: #b45309;
      color: #8a5a15;
    }
    body.theme-focus-card-editorial h4.sub-risk {
      border-left-color: #b91c1c;
      color: #8a1c1c;
    }
    body.theme-focus-card-editorial h4.sub-support {
      border-left-color: #1d4ed8;
      color: #1e40af;
    }
    body.theme-focus-card-editorial p {
      max-width: 136mm;
      font-size: 13.2px;
    }
    body.theme-focus-card-editorial .content ul,
    body.theme-focus-card-editorial .content ol {
      margin: 0 0 4.4mm;
      padding-left: 0;
      list-style: none;
    }
    body.theme-focus-card-editorial .content li {
      position: relative;
      margin-bottom: 2.6mm;
      padding-left: 5mm;
    }
    body.theme-focus-card-editorial .content li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.92em;
      width: 2.2mm;
      height: 2.2mm;
      border-radius: 50%;
      background: var(--frame-accent);
      transform: translateY(-50%);
    }
    body.theme-focus-card-editorial code {
      background: #f3ede3;
      border: 1px solid #e5d8c4;
      color: #43352a;
    }
    @media print {
      body.theme-focus-card-editorial {
        background: white;
      }
      body.theme-focus-card-editorial .book {
        width: auto;
        box-shadow: none;
        padding: 0;
        background: white;
      }
      body.theme-focus-card-editorial .cover,
      body.theme-focus-card-editorial .toc,
      body.theme-focus-card-editorial .chapter,
      body.theme-focus-card-editorial .content > p:nth-child(2) {
        box-shadow: none;
      }
      body.theme-focus-card-editorial .cover {
        border-radius: 0;
      }
      body.theme-focus-card-editorial .chapter {
        border-radius: 12px;
        background: white;
      }
    }
    body.theme-full-card-editorial {
      color: #2a2f33;
      background:
        radial-gradient(circle at top left, #e6eef2 0, #f4f1ea 42%, #eef3f7 100%);
    }
    body.theme-full-card-editorial .book {
      width: 206mm;
      background: linear-gradient(180deg, #fbfaf7 0, #f4f1eb 100%);
      box-shadow: 0 20px 50px rgba(27, 39, 49, 0.12);
      padding: 18mm 14mm 18mm;
    }
    body.theme-full-card-editorial .cover {
      min-height: 0;
      position: relative;
      overflow: hidden;
      padding: 18mm 18mm 16mm;
      border: 1px solid #d3dbe3;
      border-radius: 24px;
      background:
        linear-gradient(145deg, rgba(29, 78, 216, 0.08), rgba(15, 118, 110, 0.05) 48%, rgba(180, 83, 9, 0.10) 100%),
        linear-gradient(180deg, #fffefd 0, #f5f2ec 100%);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
    }
    body.theme-full-card-editorial .cover::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 34mm;
      background: linear-gradient(180deg, #1d4ed8 0, #0f766e 48%, #b45309 100%);
      opacity: 0.9;
    }
    body.theme-full-card-editorial .cover .eyebrow,
    body.theme-full-card-editorial .cover h1,
    body.theme-full-card-editorial .cover p,
    body.theme-full-card-editorial .cover .meta-block {
      position: relative;
      z-index: 1;
      max-width: 138mm;
      margin-left: 18mm;
    }
    body.theme-full-card-editorial .cover .eyebrow {
      font-size: 11px;
      letter-spacing: 0.18em;
      color: #1d4ed8;
    }
    body.theme-full-card-editorial .cover h1 {
      font-size: 39px;
      line-height: 1.24;
      color: #1d2730;
    }
    body.theme-full-card-editorial .cover p:not(.eyebrow) {
      font-size: 14px;
      line-height: 1.9;
      color: #56616d;
    }
    body.theme-full-card-editorial .meta-block {
      margin-top: 2mm;
      padding-top: 4mm;
      border-top: 1px solid rgba(110, 123, 137, 0.24);
      color: #647180;
    }
    body.theme-full-card-editorial .toc {
      margin-top: 10mm;
      padding: 8mm 9mm 8mm;
      border: 1px solid #d6dde4;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.72);
    }
    body.theme-full-card-editorial .toc h2 {
      margin-bottom: 5mm;
      font-size: 12px;
      letter-spacing: 0.18em;
      color: #475569;
    }
    body.theme-full-card-editorial .toc-groups {
      display: grid;
      gap: 5mm;
    }
    body.theme-full-card-editorial .toc-group {
      padding: 4mm 4.5mm 3.5mm;
      border-radius: 16px;
      border: 1px solid #dde4ea;
      background: rgba(255, 255, 255, 0.8);
    }
    body.theme-full-card-editorial .toc-group h3 {
      display: block;
      margin: 0 0 3mm;
      padding: 0 0 2.2mm;
      border-bottom: 1px solid rgba(148, 163, 184, 0.24);
      font-size: 13px;
      letter-spacing: 0.12em;
      color: #334155;
    }
    body.theme-full-card-editorial .toc-group.layer-health h3 {
      color: #0f766e;
    }
    body.theme-full-card-editorial .toc-group.layer-transition h3 {
      color: #b45309;
    }
    body.theme-full-card-editorial .toc-group.layer-operation h3 {
      color: #1d4ed8;
    }
    body.theme-full-card-editorial .toc-list {
      columns: initial;
      list-style: none;
      padding-left: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2mm 8mm;
      counter-reset: toc;
      font-size: 12px;
    }
    body.theme-full-card-editorial .toc-list li {
      counter-increment: toc;
      position: relative;
      margin: 0;
      padding: 2.6mm 0 2.6mm 11mm;
      border-top: 1px solid rgba(148, 163, 184, 0.16);
      break-inside: avoid;
    }
    body.theme-full-card-editorial .toc-list li::before {
      content: counter(toc, decimal-leading-zero);
      position: absolute;
      top: 2.7mm;
      left: 0;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: #64748b;
      font-weight: 700;
    }
    body.theme-full-card-editorial .toc-list a {
      display: inline-block;
      color: #2a2f33;
    }
    body.theme-full-card-editorial .content {
      margin-top: 10mm;
    }
    body.theme-full-card-editorial .content > p:first-child {
      margin-bottom: 3mm;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 11px;
      letter-spacing: 0.12em;
      color: #64748b;
      text-transform: uppercase;
    }
    body.theme-full-card-editorial .content > p:nth-child(2) {
      max-width: 146mm;
      margin-bottom: 8mm;
      padding: 5mm 6mm;
      border: 1px solid #d7dfe6;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.78);
      font-size: 14px;
      line-height: 1.92;
      color: #46525e;
    }
    body.theme-full-card-editorial .content > hr:first-of-type {
      display: none;
    }
    body.theme-full-card-editorial .layer {
      --layer-accent: #0f766e;
      --layer-soft: #e8f5f2;
      --layer-line: #a7d7cf;
      break-before: page;
      page-break-before: always;
      margin-top: 0;
      padding-top: 0;
    }
    body.theme-full-card-editorial .layer.layer-transition {
      --layer-accent: #b45309;
      --layer-soft: #fbf1e5;
      --layer-line: #e9c89b;
    }
    body.theme-full-card-editorial .layer.layer-operation {
      --layer-accent: #1d4ed8;
      --layer-soft: #ebf1ff;
      --layer-line: #bbcbf6;
    }
    body.theme-full-card-editorial .layer-heading {
      margin-bottom: 4mm;
      padding: 6mm 7mm 5.5mm;
      border: 1px solid var(--layer-line);
      border-radius: 20px;
      background: linear-gradient(180deg, var(--layer-soft), rgba(255, 255, 255, 0.95));
      font-size: 26px;
      color: var(--layer-accent);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
    }
    body.theme-full-card-editorial .layer > h2 + p {
      max-width: 148mm;
      margin-bottom: 6mm;
      color: #55616c;
      font-size: 14px;
      line-height: 1.9;
    }
    body.theme-full-card-editorial .card {
      --frame-accent: var(--layer-accent);
      --frame-accent-soft: var(--layer-soft);
      --frame-accent-line: var(--layer-line);
      --frame-marker: #64748b;
      margin-top: 6mm;
      padding: 10mm 10.5mm 9mm 12mm;
      border: 1px solid #d9e0e6;
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98));
      box-shadow: 0 12px 30px rgba(31, 41, 55, 0.08);
      position: relative;
      overflow: hidden;
      break-inside: avoid;
    }
    body.theme-full-card-editorial .card::before {
      content: "";
      position: absolute;
      left: 0;
      top: 10mm;
      bottom: 10mm;
      width: 4px;
      border-radius: 999px;
      background: var(--frame-accent);
    }
    body.theme-full-card-editorial .card.frame-health {
      --frame-accent: #0f766e;
      --frame-accent-soft: #e8f5f2;
      --frame-accent-line: #a7d7cf;
      --frame-marker: #0f766e;
    }
    body.theme-full-card-editorial .card.frame-transition {
      --frame-accent: #b45309;
      --frame-accent-soft: #fbf1e5;
      --frame-accent-line: #e9c89b;
      --frame-marker: #b45309;
    }
    body.theme-full-card-editorial .card.frame-operation {
      --frame-accent: #1d4ed8;
      --frame-accent-soft: #ebf1ff;
      --frame-accent-line: #bbcbf6;
      --frame-marker: #1d4ed8;
    }
    body.theme-full-card-editorial .frame-heading {
      display: grid;
      gap: 1.2mm;
      margin-bottom: 2mm;
    }
    body.theme-full-card-editorial .frame-kicker {
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--frame-accent);
      font-weight: 700;
    }
    body.theme-full-card-editorial .frame-title {
      display: block;
      font-size: 28px;
      line-height: 1.25;
      letter-spacing: 0.01em;
      color: #1d2730;
    }
    body.theme-full-card-editorial .card > h3 + p {
      max-width: 138mm;
      padding-bottom: 4mm;
      margin-bottom: 5mm;
      border-bottom: 2px solid var(--frame-accent-line);
      font-size: 15px;
      line-height: 1.88;
      color: #46525e;
    }
    body.theme-full-card-editorial blockquote {
      margin: 0 0 5mm;
      padding: 4mm 4.5mm;
      border: 1px solid var(--frame-accent-line);
      border-left: 0;
      border-radius: 14px;
      background: var(--frame-accent-soft);
      color: #334155;
    }
    body.theme-full-card-editorial blockquote p {
      max-width: none;
      margin: 0;
      font-size: 12.8px;
      line-height: 1.82;
    }
    body.theme-full-card-editorial h4 {
      display: inline-flex;
      align-items: center;
      margin-top: 7mm;
      margin-bottom: 3mm;
      padding: 1.2mm 4mm;
      border-radius: 999px;
      border: 1px solid var(--frame-accent-line);
      background: var(--frame-accent-soft);
      font-size: 12px;
      letter-spacing: 0.12em;
      color: var(--frame-accent);
    }
    body.theme-full-card-editorial h4.section-heading::before {
      margin-right: 2.4mm;
      font-size: 9px;
      letter-spacing: 0.14em;
      font-weight: 700;
      opacity: 0.82;
    }
    body.theme-full-card-editorial h4.section-scene::before {
      content: "SCENE";
    }
    body.theme-full-card-editorial h4.section-diagnosis::before {
      content: "TRIAGE";
    }
    body.theme-full-card-editorial h4.section-action::before {
      content: "ACTION";
    }
    body.theme-full-card-editorial h4.section-action {
      background: #f5efe4;
      border-color: #dfccaa;
      color: #8a5a15;
    }
    body.theme-full-card-editorial h5 {
      margin-top: 4.5mm;
      margin-bottom: 2.2mm;
      padding-left: 3.2mm;
      border-left: 3px solid var(--frame-marker);
      font-size: 13px;
      color: #526070;
    }
    body.theme-full-card-editorial h5.sub-diff {
      border-left-color: var(--frame-accent);
      color: var(--frame-accent);
    }
    body.theme-full-card-editorial h5.sub-first {
      border-left-color: #b45309;
      color: #8a5a15;
    }
    body.theme-full-card-editorial h5.sub-risk {
      border-left-color: #b91c1c;
      color: #8a1c1c;
    }
    body.theme-full-card-editorial h5.sub-support {
      border-left-color: #1d4ed8;
      color: #1e40af;
    }
    body.theme-full-card-editorial p {
      max-width: 138mm;
      font-size: 13.2px;
    }
    body.theme-full-card-editorial .content ul,
    body.theme-full-card-editorial .content ol {
      margin: 0 0 4.2mm;
      padding-left: 0;
      list-style: none;
    }
    body.theme-full-card-editorial .content li {
      position: relative;
      margin-bottom: 2.6mm;
      padding-left: 5mm;
    }
    body.theme-full-card-editorial .content li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.92em;
      width: 2.2mm;
      height: 2.2mm;
      border-radius: 50%;
      background: var(--frame-accent);
      transform: translateY(-50%);
    }
    body.theme-full-card-editorial code {
      background: #f3f5f7;
      border: 1px solid #dbe4ea;
      color: #334155;
    }
    @media print {
      body.theme-full-card-editorial {
        background: white;
      }
      body.theme-full-card-editorial .book {
        width: auto;
        box-shadow: none;
        padding: 0;
        background: white;
      }
      body.theme-full-card-editorial .cover,
      body.theme-full-card-editorial .toc,
      body.theme-full-card-editorial .toc-group,
      body.theme-full-card-editorial .layer-heading,
      body.theme-full-card-editorial .card,
      body.theme-full-card-editorial .content > p:nth-child(2) {
        box-shadow: none;
      }
      body.theme-full-card-editorial .cover,
      body.theme-full-card-editorial .toc,
      body.theme-full-card-editorial .toc-group,
      body.theme-full-card-editorial .layer-heading,
      body.theme-full-card-editorial .card {
        border-radius: 0;
        background: white;
      }
    }
    @media print {
      @page {
        size: A4;
        margin: 12mm 10mm 14mm;
      }
      body {
        background: white;
      }
      .book {
        width: auto;
        min-height: auto;
        margin: 0;
        box-shadow: none;
        padding: 0;
      }
      .cover {
        min-height: 0;
        border: 0;
        padding: 0;
        background: white;
      }
      .content {
        margin-top: 10mm;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  </style>
</head>
<body${bodyClass}>
  <main class="book">
    <section class="cover">
      <p class="eyebrow">${coverEyebrow}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${coverSubtitle}</p>
      <div class="meta-block">
        <span>発行: Next Being Lab</span>
        <span>${coverFormat}</span>
      </div>
    </section>
    <section class="toc">
      <h2>目次</h2>
      ${tocHtml}
    </section>
    <article class="content">
      ${contentHtml}
    </article>
  </main>
</body>
</html>`;
}

function resolveChromeCommand() {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate.startsWith('/')) {
      const result = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
      if (result.status === 0) return candidate;
      continue;
    }
    const result = spawnSync('which', [candidate], { stdio: 'ignore' });
    if (result.status === 0) return candidate;
  }
  return null;
}

async function printPdfWithChrome(chromeCommand, htmlPath, pdfPath) {
  const fileUrl = `file://${htmlPath}`;
  const argSets = [
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      fileUrl,
    ],
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      fileUrl,
    ],
  ];

  const attempts = [];
  for (const args of argSets) {
    const result = spawnSync(chromeCommand, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 45000,
    });
    const exists = await fileExists(pdfPath);
    const fileSizeBytes = exists ? await fileSize(pdfPath) : 0;
    attempts.push({
      mode: args[0],
      status: result.status,
      signal: result.signal || null,
      timedOut: Boolean(result.error && result.error.code === 'ETIMEDOUT'),
      stderrTail: String(result.stderr || '')
        .split('\n')
        .filter(Boolean)
        .slice(-4)
        .join('\n'),
      fileCreated: exists,
      fileSizeBytes,
    });
    // In restricted environments Chrome can output a valid PDF but still return non-zero.
    // Treat as success when a non-trivial PDF file is generated.
    if (exists && fileSizeBytes >= 10240) {
      return { ok: true, attempts };
    }
  }

  return { ok: false, attempts };
}

async function fileExists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function fileSize(targetPath) {
  try {
    const stat = await fs.stat(targetPath);
    return Number(stat.size || 0);
  } catch {
    return 0;
  }
}

async function main() {
  const markdown = await fs.readFile(INPUT_PATH, 'utf8');
  await fs.mkdir(DIST_DIR, { recursive: true });
  const layoutVariant = resolveLayoutVariant({
    outputBase: OUTPUT_BASE,
    inputPath: INPUT_PATH,
  });

  const parsed = parseMarkdownToHtml(markdown, {
    inputDir: path.dirname(INPUT_PATH),
    layoutVariant,
  });
  const tocHtml = buildToc(parsed.headings, layoutVariant);
  const html = buildHtmlDocument({
    title: parsed.title,
    tocHtml,
    contentHtml: parsed.contentHtml,
    layoutVariant,
  });
  await fs.writeFile(HTML_PATH, html, 'utf8');

  const chromeCommand = resolveChromeCommand();
  let pdfCreated = false;
  let chromeAttempts = [];

  if (await fileExists(PDF_PATH)) {
    await fs.unlink(PDF_PATH);
  }

  if (chromeCommand) {
    const printResult = await printPdfWithChrome(chromeCommand, HTML_PATH, PDF_PATH);
    pdfCreated = printResult.ok;
    chromeAttempts = printResult.attempts;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        inputPath: INPUT_PATH,
        htmlPath: HTML_PATH,
        pdfPath: PDF_PATH,
        pdfCreated,
        chromeCommand: chromeCommand || null,
        chromeAttempts,
        hints: pdfCreated
          ? []
          : [
              'Google Chrome (headless) でのPDF化に失敗しました。',
              'macOSのサンドボックス環境では失敗する場合があります。',
              'HTMLは生成済みなので、ブラウザで開いて印刷(PDF保存)も可能です。',
            ],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
