/**
 * Parser for docs/guidebook/jac-27-frame-edition.md
 *
 * Extracts the 27 frames (Ⅰ-01…Ⅲ-09) into structured data
 * suitable for static page generation.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GuideFrameSection = {
  heading: string;      // e.g. '外部と一緒に考える場面'
  level: 4 | 5;
  body: string;         // raw markdown body (may contain bullet lists, paragraphs)
};

export type GuideFrame = {
  id: string;           // URL slug  e.g. 'i-01'
  number: string;       // display   e.g. 'Ⅰ-01'
  title: string;        // e.g. '体調変動の設計'
  layer: 1 | 2 | 3;
  layerLabel: string;   // e.g. '設計層Ⅰ 症状・経過との共存設計'
  layerIntro: string;   // layer intro paragraph
  description: string;  // first non-heading line of the frame
  focus: string;        // 着眼点 text (from > 着眼点: …)
  sceneContext: string; // 先に見えやすい文脈:
  sections: GuideFrameSection[];
};

export type GuideLayer = {
  number: 1 | 2 | 3;
  label: string;
  romanLabel: string;   // 'Ⅰ' | 'Ⅱ' | 'Ⅲ'
  intro: string;
  frames: GuideFrame[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LAYER_MAP: Record<string, { number: 1 | 2 | 3; romanLabel: string }> = {
  'Ⅰ': { number: 1, romanLabel: 'Ⅰ' },
  'Ⅱ': { number: 2, romanLabel: 'Ⅱ' },
  'Ⅲ': { number: 3, romanLabel: 'Ⅲ' },
};

function romanToSlug(roman: string): string {
  if (roman === 'Ⅰ') return 'i';
  if (roman === 'Ⅱ') return 'ii';
  if (roman === 'Ⅲ') return 'iii';
  return roman.toLowerCase();
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/**
 * Parse the full guidebook markdown text into layers + frames.
 */
export function parseGuideBook(mdText: string): GuideLayer[] {
  const lines = mdText.split('\n');
  const layers: GuideLayer[] = [];
  let currentLayer: GuideLayer | null = null;
  let currentFrameLines: string[] = [];
  let currentFrameHeader: string | null = null;

  function finalizeFrame() {
    if (!currentLayer || !currentFrameHeader) return;
    const frame = parseFrame(currentFrameHeader, currentFrameLines, currentLayer);
    if (frame) currentLayer.frames.push(frame);
    currentFrameLines = [];
    currentFrameHeader = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Layer header: `## 設計層Ⅰ：...` or `## 設計層Ⅱ：...`
    const layerMatch = /^## 設計層([ⅠⅡⅢ])[:：](.+)$/.exec(line);
    if (layerMatch) {
      finalizeFrame();

      const roman = layerMatch[1];
      const layerSuffix = layerMatch[2].trim();
      const { number, romanLabel } = LAYER_MAP[roman] ?? { number: 1, romanLabel: roman };

      // Collect layer intro (lines until next heading or ---)
      const introLines: string[] = [];
      while (i + 1 < lines.length) {
        const next = lines[i + 1];
        if (next.startsWith('#') || next.startsWith('---') || /^###\s+[ⅠⅡⅢ]/.test(next)) break;
        i++;
        if (lines[i].trim()) introLines.push(lines[i].trim());
      }

      currentLayer = {
        number,
        label: `設計層${roman} ${layerSuffix}`,
        romanLabel,
        intro: introLines.join(' ').trim(),
        frames: [],
      };
      layers.push(currentLayer);
      continue;
    }

    // Frame header: `### Ⅰ-01 体調変動の設計`
    const frameMatch = /^### ([ⅠⅡⅢ]-\d{2})\s+(.+)$/.exec(line);
    if (frameMatch) {
      finalizeFrame();
      currentFrameHeader = line;
      continue;
    }

    // Accumulate frame body lines
    if (currentFrameHeader) {
      currentFrameLines.push(line);
    }
  }

  finalizeFrame();
  return layers;
}

function parseFrame(
  headerLine: string,
  bodyLines: string[],
  layer: GuideLayer,
): GuideFrame | null {
  const headerMatch = /^### ([ⅠⅡⅢ])-(\d{2})\s+(.+)$/.exec(headerLine);
  if (!headerMatch) return null;

  const roman = headerMatch[1];
  const num = headerMatch[2];
  const title = headerMatch[3].trim();
  const id = `${romanToSlug(roman)}-${num}`;
  const number = `${roman}-${num}`;

  // First non-empty, non-heading, non-quote line is the description
  let description = '';
  let focus = '';
  let sceneContext = '';

  const sections: GuideFrameSection[] = [];
  let currentSection: GuideFrameSection | null = null;

  let descParsed = false;

  function finalizeSection() {
    if (currentSection) {
      currentSection.body = currentSection.body.trimEnd();
      sections.push(currentSection);
      currentSection = null;
    }
  }

  for (const line of bodyLines) {
    // Skip separator
    if (line.startsWith('---')) {
      finalizeSection();
      continue;
    }

    // h4 heading
    const h4 = /^#### (.+)$/.exec(line);
    if (h4) {
      finalizeSection();
      currentSection = { heading: h4[1].trim(), level: 4, body: '' };
      continue;
    }

    // h5 heading
    const h5 = /^##### (.+)$/.exec(line);
    if (h5) {
      finalizeSection();
      currentSection = { heading: h5[1].trim(), level: 5, body: '' };
      continue;
    }

    // > 着眼点: …
    const focusMatch = /^>\s*着眼点:\s*(.+)$/.exec(line);
    if (focusMatch) {
      focus = focusMatch[1].trim();
      continue;
    }

    // 先に見えやすい文脈:
    const sceneMatch = /^先に見えやすい文脈:\s*(.+)$/.exec(line);
    if (sceneMatch) {
      sceneContext = sceneMatch[1].trim();
      if (currentSection) currentSection.body += `先に見えやすい文脈: ${sceneContext}\n`;
      continue;
    }

    // Description: first non-empty line before any heading/quote
    if (!descParsed && !currentSection && line.trim() && !line.startsWith('#') && !line.startsWith('>')) {
      description = line.trim();
      descParsed = true;
      continue;
    }

    // Append to current section
    if (currentSection) {
      currentSection.body += line + '\n';
    }
  }

  finalizeSection();

  return {
    id,
    number,
    title,
    layer: layer.number,
    layerLabel: layer.label,
    layerIntro: layer.intro,
    description,
    focus,
    sceneContext,
    sections,
  };
}

// ---------------------------------------------------------------------------
// File loader
// ---------------------------------------------------------------------------

let _cachedLayers: GuideLayer[] | null = null;

export async function loadGuideBook(forceRefresh = false): Promise<GuideLayer[]> {
  if (_cachedLayers && !forceRefresh) return _cachedLayers;
  const mdPath = path.join(process.cwd(), 'docs', 'guidebook', 'jac-27-frame-edition.md');
  const text = await readFile(mdPath, 'utf-8');
  _cachedLayers = parseGuideBook(text);
  return _cachedLayers;
}

export async function loadAllFrames(forceRefresh = false): Promise<GuideFrame[]> {
  const layers = await loadGuideBook(forceRefresh);
  return layers.flatMap((l) => l.frames);
}

export async function loadFrameById(id: string): Promise<GuideFrame | undefined> {
  const frames = await loadAllFrames();
  return frames.find((f) => f.id === id);
}
