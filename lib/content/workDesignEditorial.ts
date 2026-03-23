export type FrameReferenceEntry = {
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  diversityExamples: string;
  commonDesign: string;
  individualAdjustment: string;
  voice: string;
};

export type FrameReferenceLayer = {
  title: string;
  frameCount: string;
  entries: FrameReferenceEntry[];
};

export type WorkbookChapterSection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export type WorkbookChapter = {
  chapterLabel: string;
  title: string;
  intro: string[];
  sections: WorkbookChapterSection[];
};

export type CardEditionFrame = {
  id: string;
  title: string;
  intro: string;
  jacInsight: string;
  context: string;
  severityLevels: string[];
  useWhen: string[];
  distinguish: string[];
  firstActions: string[];
  pitfalls: string[];
  designThinking: string;
  externalCollab: string[];
};

export type CardEditionLayer = {
  title: string;
  summary: string;
  frames: CardEditionFrame[];
};

function normalizeMarkdownLine(line: string): string {
  return line.replace(/\*\*/g, '').trim();
}

function parseLayerHeading(raw: string): { title: string; frameCount: string } {
  const match = raw.match(/^(.+?)（(.+?)）$/);
  if (!match) {
    return { title: raw.trim(), frameCount: '' };
  }

  return {
    title: match[1].trim(),
    frameCount: match[2].trim(),
  };
}

function parseFrameHeading(raw: string): { index: string; title: string; subtitle: string } {
  const match = raw.match(/^(\d+)\.\s+(.+?)(?:（(.+?)）)?$/);
  if (!match) {
    return {
      index: '',
      title: raw.trim(),
      subtitle: '',
    };
  }

  return {
    index: match[1].trim(),
    title: match[2].trim(),
    subtitle: (match[3] || '').trim(),
  };
}

export function parseFrameReferenceMarkdown(markdown: string): FrameReferenceLayer[] {
  const layers: FrameReferenceLayer[] = [];
  let currentLayer: FrameReferenceLayer | null = null;
  let currentEntry: FrameReferenceEntry | null = null;

  const flushEntry = () => {
    if (!currentLayer || !currentEntry) return;
    currentLayer.entries.push(currentEntry);
    currentEntry = null;
  };

  const flushLayer = () => {
    flushEntry();
    if (!currentLayer) return;
    layers.push(currentLayer);
    currentLayer = null;
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = normalizeMarkdownLine(rawLine);
    if (!line) continue;

    if (line.startsWith('## ')) {
      flushLayer();
      const heading = parseLayerHeading(line.slice(3).trim());
      currentLayer = {
        title: heading.title,
        frameCount: heading.frameCount,
        entries: [],
      };
      continue;
    }

    if (line.startsWith('### ')) {
      flushEntry();
      const heading = parseFrameHeading(line.slice(4).trim());
      currentEntry = {
        index: heading.index,
        title: heading.title,
        subtitle: heading.subtitle,
        summary: '',
        diversityExamples: '',
        commonDesign: '',
        individualAdjustment: '',
        voice: '',
      };
      continue;
    }

    if (!currentEntry) {
      continue;
    }

    if (line.startsWith('- 要約:')) {
      currentEntry.summary = line.replace('- 要約:', '').trim();
      continue;
    }

    if (line.startsWith('- 障害者雇用との接続（多様性の例）:')) {
      currentEntry.diversityExamples = line
        .replace('- 障害者雇用との接続（多様性の例）:', '')
        .trim();
      continue;
    }

    if (line.startsWith('- ポイント！（共通設計）:')) {
      currentEntry.commonDesign = line.replace('- ポイント！（共通設計）:', '').trim();
      continue;
    }

    if (line.startsWith('- ポイント！（個別調整）:')) {
      currentEntry.individualAdjustment = line.replace('- ポイント！（個別調整）:', '').trim();
      continue;
    }

    if (line.startsWith('- 生の声（仮想）:')) {
      currentEntry.voice = line.replace('- 生の声（仮想）:', '').trim();
    }
  }

  flushLayer();
  return layers;
}

export function parseWorkbookSampleMarkdown(markdown: string): WorkbookChapter[] {
  const chapters: WorkbookChapter[] = [];
  const blocks = markdown.split(/^## /m).slice(1);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const rawHeading = normalizeMarkdownLine(lines.shift() || '');
    if (!rawHeading) continue;

    const chapterMatch = rawHeading.match(/^(第\d+章)\s+(.+)$/);
    const chapter: WorkbookChapter = {
      chapterLabel: chapterMatch ? chapterMatch[1] : '',
      title: chapterMatch ? chapterMatch[2] : rawHeading,
      intro: [],
      sections: [],
    };

    let currentSection: WorkbookChapterSection | null = null;

    const flushSection = () => {
      if (!currentSection) return;
      chapter.sections.push(currentSection);
      currentSection = null;
    };

    for (const rawLine of lines) {
      const line = normalizeMarkdownLine(rawLine);
      if (!line || line === '---') continue;

      if (line.startsWith('### ')) {
        flushSection();
        currentSection = {
          title: line.slice(4).trim(),
          paragraphs: [],
          bullets: [],
        };
        continue;
      }

      if (line.startsWith('- ')) {
        const content = line.slice(2).trim();
        if (currentSection) {
          currentSection.bullets.push(content);
        } else {
          chapter.intro.push(content);
        }
        continue;
      }

      if (currentSection) {
        currentSection.paragraphs.push(line);
      } else {
        chapter.intro.push(line);
      }
    }

    flushSection();
    chapters.push(chapter);
  }

  return chapters;
}

export function countWorkbookFrames(markdown: string): number {
  const matches = markdown.match(/^### フレーム\d+/gm);
  return matches ? matches.length : 0;
}

export function parseCardEditionMarkdown(markdown: string): CardEditionLayer[] {
  const layers: CardEditionLayer[] = [];
  let currentLayer: CardEditionLayer | null = null;
  let currentFrame: CardEditionFrame | null = null;
  let currentSection = '';
  let currentSubsection = '';
  let layerSummaryBuffer: string[] = [];
  let frameIntroBuffer: string[] = [];
  let designThinkingBuffer: string[] = [];

  const flushFrame = () => {
    if (!currentLayer || !currentFrame) return;
    currentFrame.intro = frameIntroBuffer.join(' ').trim();
    currentFrame.designThinking = designThinkingBuffer.join(' ').trim();
    currentLayer.frames.push(currentFrame);
    currentFrame = null;
    currentSection = '';
    currentSubsection = '';
    frameIntroBuffer = [];
    designThinkingBuffer = [];
  };

  const flushLayer = () => {
    flushFrame();
    if (!currentLayer) return;
    currentLayer.summary = layerSummaryBuffer.join(' ').trim();
    layers.push(currentLayer);
    currentLayer = null;
    layerSummaryBuffer = [];
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = normalizeMarkdownLine(rawLine);
    if (!line || line === '---') continue;

    if (line.startsWith('## ')) {
      flushLayer();
      currentLayer = {
        title: line.slice(3).trim(),
        summary: '',
        frames: [],
      };
      continue;
    }

    if (line.startsWith('### ')) {
      flushFrame();
      const match = line.slice(4).trim().match(/^(フレーム\d+)\s+(.+)$/);
      currentFrame = {
        id: match?.[1] || '',
        title: match?.[2] || line.slice(4).trim(),
        intro: '',
        jacInsight: '',
        context: '',
        severityLevels: [],
        useWhen: [],
        distinguish: [],
        firstActions: [],
        pitfalls: [],
        designThinking: '',
        externalCollab: [],
      };
      continue;
    }

    if (!currentFrame) {
      if (currentLayer) {
        layerSummaryBuffer.push(line);
      }
      continue;
    }

    if (line.startsWith('> JACの着眼点:')) {
      currentFrame.jacInsight = line.replace('> JACの着眼点:', '').trim();
      continue;
    }

    if (line.startsWith('#### ')) {
      currentSection = line.slice(5).trim();
      currentSubsection = '';
      continue;
    }

    if (line.startsWith('##### ')) {
      currentSubsection = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('- ')) {
      const item = line.slice(2).trim();
      if (currentSection === 'こんな場面で起きやすい' && currentSubsection.startsWith('状況レベル')) {
        currentFrame.severityLevels.push(item);
        continue;
      }
      if (currentSection === '鑑別診断 / 問題の切り分け' && currentSubsection === 'このフレームを使うとき') {
        currentFrame.useWhen.push(item);
        continue;
      }
      if (
        currentSection === '鑑別診断 / 問題の切り分け' &&
        currentSubsection === '近いフレームとの見分け方'
      ) {
        currentFrame.distinguish.push(item);
        continue;
      }
      if (currentSection === '具体的な取組み内容' && currentSubsection === '最初にやること') {
        currentFrame.firstActions.push(item);
        continue;
      }
      if (currentSection === '具体的な取組み内容' && currentSubsection === '見落としやすい点') {
        currentFrame.pitfalls.push(item);
        continue;
      }
      if (currentSection === '具体的な取組み内容' && currentSubsection === '外部と一緒に考える場面') {
        currentFrame.externalCollab.push(item);
      }
      continue;
    }

    if (currentSection === 'こんな場面で起きやすい' && line.startsWith('先に見えやすい文脈:')) {
      currentFrame.context = line.replace('先に見えやすい文脈:', '').trim();
      continue;
    }

    if (!currentSection) {
      frameIntroBuffer.push(line);
      continue;
    }

    if (currentSection === '具体的な取組み内容' && currentSubsection === '設計の考え方') {
      designThinkingBuffer.push(line);
    }
  }

  flushLayer();
  return layers;
}
