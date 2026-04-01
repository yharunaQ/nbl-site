import { promises as fs } from 'node:fs';
import path from 'node:path';

type TagGroupKey = 'situation' | 'task' | 'symptom' | 'environment' | 'preference';

export type TagSelection = Record<TagGroupKey, string[]>;

export type SuggestionSeed = {
  title: string;
  reason: string;
  examples: string;
  relatedTags: string[];
  priority: number;
};

type ParsedIssue = {
  issue: string;
  supports: string[];
};

type ParsedEntry = {
  id: number;
  disability: string;
  issues: ParsedIssue[];
  narrativeHighlights: string[];
};

type MatchedIssue = {
  issue: string;
  supports: string[];
  score: number;
};

export type Data2PromptInsight = {
  id: number;
  disability: string;
  score: number;
  matchedIssues: MatchedIssue[];
  narrativeHighlights: string[];
};

export type Data2KnowledgeBundle = {
  suggestions: SuggestionSeed[];
  promptInsights: Data2PromptInsight[];
};

const DATA2_DIR = path.join(process.cwd(), 'references', 'data2');
const INDEX_PATH = path.join(DATA2_DIR, 'index', 'data2-knowledge-index.json');
const CANONICAL_CHISHIKI_DIR = path.join(DATA2_DIR, 'sanitized', 'chishiki');
const CANONICAL_KIJUTSU_DIR = path.join(DATA2_DIR, 'sanitized', 'kijutsu');
const LEGACY_CHISHIKI_DIR = path.join(DATA2_DIR, 'chishikiOut_jac');
const LEGACY_KIJUTSU_DIR = path.join(DATA2_DIR, 'kijutsuOut_jac');

const HEADER_STOP_WORDS = new Set([
  'なし',
  '特になし',
  '特に無し',
  '無',
  'n/a',
  'NA',
  '-',
  '－',
  '　',
]);

const DISABILITY_TOKEN_STOP_WORDS = new Set([
  '障害',
  '機能',
  '適用',
  '継続中',
  '開始前',
  '全体',
  'その他',
  '調査回答',
  '級',
  '等',
]);

let cachedEntries: ParsedEntry[] | null = null;
let cachePromise: Promise<ParsedEntry[]> | null = null;

function sortByNumericFileName(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const aNum = Number(a.match(/\d+/)?.[0] || 0);
    const bNum = Number(b.match(/\d+/)?.[0] || 0);
    return aNum - bNum;
  });
}

function normalize(text: string): string {
  return String(text || '').replace(/\r\n?/g, '\n');
}

function extractDisability(content: string): string {
  const match = content.match(/##機能障害・疾病:\s*「(.+?)」/);
  return match?.[1]?.trim() || '不明';
}

function parseIssuesFromChishiki(content: string): ParsedIssue[] {
  const lines = normalize(content).split('\n');
  const issues: ParsedIssue[] = [];
  let current: ParsedIssue | null = null;

  for (const line of lines) {
    const issueMatch = line.match(/^###\s+\d+\.\s*課題:\s*(.+)$/);
    if (issueMatch) {
      if (current) issues.push(current);
      current = { issue: issueMatch[1].trim(), supports: [] };
      continue;
    }

    if (!current) continue;
    if (!line.includes('「') || !line.includes('」')) continue;

    const supportMatches = [...line.matchAll(/「([^」]+)」/g)].map((m) => m[1].trim());
    if (supportMatches.length === 0) continue;
    const support = supportMatches[0];
    if (!support || current.supports.includes(support)) continue;
    current.supports.push(support);
  }

  if (current) issues.push(current);
  return issues.map((item) => ({
    issue: item.issue,
    supports: item.supports.slice(0, 5),
  }));
}

function parseNarrativeHighlights(content: string): string[] {
  const lines = normalize(content).split('\n');
  const targetSections = new Set([
    '##就職困難状況',
    '##就職後の職場配慮',
    '##就職後の職業的課題',
    '##自由記述',
  ]);

  let section = '';
  const buckets: Record<string, string[]> = {
    '##就職困難状況': [],
    '##就職後の職場配慮': [],
    '##就職後の職業的課題': [],
    '##自由記述': [],
  };

  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line) continue;
    if (line.startsWith('##')) {
      section = targetSections.has(line) ? line : '';
      continue;
    }
    if (!section) continue;
    if (line.startsWith('#')) continue;
    if (line.length < 10) continue;
    if (HEADER_STOP_WORDS.has(line)) continue;
    if (line.includes('[連絡先]') || line.includes('[住所]')) continue;
    if (!buckets[section].includes(line)) buckets[section].push(line);
  }

  return [
    ...buckets['##就職困難状況'].slice(0, 2),
    ...buckets['##就職後の職場配慮'].slice(0, 2),
    ...buckets['##就職後の職業的課題'].slice(0, 2),
    ...buckets['##自由記述'].slice(0, 2),
  ].slice(0, 6);
}

function normalizeIndexEntry(raw: unknown): ParsedEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const id = Number(obj.id || 0);
  if (!Number.isFinite(id) || id <= 0) return null;

  const disability = String(obj.disability || '不明').trim() || '不明';
  const issuesRaw = Array.isArray(obj.issues) ? obj.issues : [];
  const narrativeRaw = Array.isArray(obj.narrativeHighlights) ? obj.narrativeHighlights : [];

  const issues: ParsedIssue[] = issuesRaw
    .map((issue) => {
      if (!issue || typeof issue !== 'object') return null;
      const issueObj = issue as Record<string, unknown>;
      const issueText = String(issueObj.issue || '').trim();
      if (!issueText) return null;
      const supportsRaw = Array.isArray(issueObj.supports) ? issueObj.supports : [];
      const supports = supportsRaw
        .map((support) => String(support || '').trim())
        .filter(Boolean)
        .slice(0, 5);
      return { issue: issueText, supports };
    })
    .filter((item): item is ParsedIssue => Boolean(item));

  const narrativeHighlights = narrativeRaw
    .map((line) => String(line || '').trim())
    .filter((line) => line.length >= 2)
    .slice(0, 6);

  return {
    id,
    disability,
    issues,
    narrativeHighlights,
  };
}

async function resolveKnowledgeDirs(): Promise<{ chishikiDir: string; kijutsuDir: string }> {
  try {
    await fs.access(CANONICAL_CHISHIKI_DIR);
    await fs.access(CANONICAL_KIJUTSU_DIR);
    return {
      chishikiDir: CANONICAL_CHISHIKI_DIR,
      kijutsuDir: CANONICAL_KIJUTSU_DIR,
    };
  } catch {
    return {
      chishikiDir: LEGACY_CHISHIKI_DIR,
      kijutsuDir: LEGACY_KIJUTSU_DIR,
    };
  }
}

async function readEntry(
  id: number,
  dirs: { chishikiDir: string; kijutsuDir: string },
): Promise<ParsedEntry | null> {
  const chishikiPath = path.join(dirs.chishikiDir, `sogo${id}.txt`);
  const kijutsuPath = path.join(dirs.kijutsuDir, `${String(id).padStart(2, '0')}.txt`);

  let chishiki = '';
  let kijutsu = '';
  try {
    chishiki = await fs.readFile(chishikiPath, 'utf8');
  } catch {
    return null;
  }
  try {
    kijutsu = await fs.readFile(kijutsuPath, 'utf8');
  } catch {
    kijutsu = '';
  }

  return {
    id,
    disability: extractDisability(chishiki),
    issues: parseIssuesFromChishiki(chishiki),
    narrativeHighlights: parseNarrativeHighlights(kijutsu),
  };
}

async function loadFromIndex(): Promise<ParsedEntry[] | null> {
  try {
    const raw = await fs.readFile(INDEX_PATH, 'utf8');
    const parsed = JSON.parse(raw) as { entries?: unknown[] } | unknown[];
    const rows = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { entries?: unknown[] }).entries)
        ? (parsed as { entries: unknown[] }).entries
        : [];
    const entries = rows
      .map((row) => normalizeIndexEntry(row))
      .filter((row): row is ParsedEntry => Boolean(row));
    return entries.length > 0 ? entries : null;
  } catch {
    return null;
  }
}

async function loadFromSanitizedFiles(): Promise<ParsedEntry[]> {
  const dirs = await resolveKnowledgeDirs();
  const files = await fs.readdir(dirs.chishikiDir).catch(() => []);
  const target = sortByNumericFileName(files.filter((name) => /^sogo\d+\.txt$/.test(name)));
  const entries: ParsedEntry[] = [];

  for (const file of target) {
    const id = Number(file.match(/\d+/)?.[0] || 0);
    if (!id) continue;
    const parsed = await readEntry(id, dirs);
    if (!parsed) continue;
    entries.push(parsed);
  }

  return entries;
}

async function loadAllEntriesUncached(): Promise<ParsedEntry[]> {
  const indexed = await loadFromIndex();
  if (indexed && indexed.length > 0) return indexed;
  return loadFromSanitizedFiles();
}

async function loadAllEntries(): Promise<ParsedEntry[]> {
  if (cachedEntries) return cachedEntries;
  if (cachePromise) return cachePromise;

  cachePromise = loadAllEntriesUncached()
    .then((entries) => {
      cachedEntries = entries;
      return entries;
    })
    .finally(() => {
      cachePromise = null;
    });

  return cachePromise;
}

function tokenizeInput(consultation: string, selectedTags: TagSelection): string[] {
  const texts = [consultation, ...Object.values(selectedTags || {}).flat()].filter(Boolean);
  const tokens = new Set<string>();

  for (const text of texts) {
    const normalized = String(text || '').trim();
    if (!normalized) continue;
    if (normalized.length >= 3) tokens.add(normalized);

    normalized
      .split(/[・／/（）()「」『』、,\s　]+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 2)
      .forEach((item) => tokens.add(item));
  }

  return [...tokens];
}

function normalizeLookup(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[\s　・／/（）()「」『』、,\-]/g, '');
}

function buildDisabilityNeedles(disability: string): string[] {
  const raw = String(disability || '').trim();
  if (!raw) return [];
  const needles = new Set<string>();

  const normalizedRaw = normalizeLookup(raw);
  if (normalizedRaw.length >= 2) needles.add(normalizedRaw);

  raw
    .split(/[・／/（）()「」『』、,\s　]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)
    .forEach((item) => {
      if (DISABILITY_TOKEN_STOP_WORDS.has(item)) return;
      const normalized = normalizeLookup(item);
      if (normalized.length >= 2 && !DISABILITY_TOKEN_STOP_WORDS.has(normalized)) {
        needles.add(normalized);
      }
    });

  return [...needles];
}

function hasDisabilityMention(consultation: string, disability: string): boolean {
  const haystack = normalizeLookup(consultation);
  if (!haystack) return false;
  const needles = buildDisabilityNeedles(disability);
  return needles.some((needle) => haystack.includes(needle));
}

function scoreIssue(
  issue: ParsedIssue,
  disability: string,
  highlights: string[],
  keywords: string[],
  disabilityMentioned: boolean,
): number {
  let score = 0;
  const issueText = issue.issue;
  const supportText = issue.supports.join(' / ');
  const highlightText = highlights.join(' / ');

  for (const keyword of keywords) {
    if (disability.includes(keyword)) score += 3;
    if (issueText.includes(keyword)) score += 4;
    if (supportText.includes(keyword)) score += 2;
    if (highlightText.includes(keyword)) score += 1;
  }

  if (disabilityMentioned) score += 9;
  if (issue.supports.length >= 2) score += 1;
  return score;
}

function inferRelatedTags(texts: string[]): string[] {
  const joined = texts.join(' / ');
  const related = new Set<string>();

  const map: Array<{ keywords: string[]; tag: string }> = [
    {
      keywords: ['会議', '対話', 'コミュニケーション', '説明', '面接'],
      tag: '会議・対話',
    },
    {
      keywords: ['集中', '注意', '認知', '判断', '記憶'],
      tag: '注意集中の波・認知負荷',
    },
    {
      keywords: ['疲労', '体調', '波', '悪化', 'ストレス'],
      tag: '疲労・倦怠（慢性疲労含む）',
    },
    {
      keywords: ['通院', '治療', '服薬', '主治医', '専門医'],
      tag: '睡眠リズム・通院/治療スケジュール',
    },
    {
      keywords: ['騒音', '音', '光', '温度', '環境', '配席'],
      tag: '騒音・音環境',
    },
    {
      keywords: ['フルタイム', '短時間勤務', '時短', '勤務時間', '勤務日数', '週20時間', '週30時間'],
      tag: '勤務時間・勤務日数（フルタイム/短時間）',
    },
    {
      keywords: ['シフト', '夜勤', '交代勤務', '早番', '遅番', '勤務時間帯', '時差'],
      tag: 'シフト・夜勤・勤務時刻',
    },
    {
      keywords: ['残業', '連勤', '長時間労働', '休日出勤'],
      tag: '残業・連続勤務',
    },
    {
      keywords: ['立ち仕事', '立位', '運搬', '重量物', '手作業', '細かい作業', '反復動作'],
      tag: '身体操作・実作業負荷（立位・運搬・手作業）',
    },
    {
      keywords: ['危険', '事故', '緊急', '避難', 'フォークリフト', '機械', '運転'],
      tag: '安全・危険業務・緊急対応',
    },
    {
      keywords: ['納期', '締切', '期限', '急ぎ'],
      tag: '時間制約・納期',
    },
    {
      keywords: ['通勤', '移動', '外出', '交通'],
      tag: '通勤負荷（時間/混雑/距離）',
    },
    {
      keywords: ['読み', '文章', '文書', '書類'],
      tag: '文章作成・読解',
    },
    {
      keywords: ['曖昧指示', '手順書', '見本', 'チェックリスト', '完了条件', 'マニュアル'],
      tag: '指示・連絡の明確さ（手順書/見本/確認）',
    },
    {
      keywords: ['裁量', '意思', '希望', '自己決定'],
      tag: '裁量・自己決定を重視',
    },
  ];

  for (const row of map) {
    if (row.keywords.some((keyword) => joined.includes(keyword))) {
      related.add(row.tag);
    }
  }

  return [...related];
}

function buildSuggestionsFromInsights(
  insights: Data2PromptInsight[],
  maxCount: number,
): SuggestionSeed[] {
  const suggestions: SuggestionSeed[] = [];

  for (const insight of insights) {
    for (const matched of insight.matchedIssues.slice(0, 2)) {
      const primarySupport = matched.supports[0] || '個別調整';
      const title = `${matched.issue}に対する実行候補: ${primarySupport}`;
      const examples = [
        `関連支援: ${matched.supports.join(' / ')}`,
        insight.narrativeHighlights.length > 0
          ? `現場記述: ${insight.narrativeHighlights.slice(0, 2).join(' / ')}`
          : '',
      ]
        .filter(Boolean)
        .join(' | ');

      suggestions.push({
        title,
        reason: `障害種類「${insight.disability}」の回答群では、「${matched.issue}」に対して上記支援が軽減に関係しやすい仮説が示されているため。`,
        examples,
        relatedTags: inferRelatedTags([
          matched.issue,
          ...matched.supports,
          ...insight.narrativeHighlights,
        ]),
        priority: matched.score >= 8 ? 1 : 2,
      });
    }
  }

  const deduped = new Map<string, SuggestionSeed>();
  for (const item of suggestions) {
    if (!deduped.has(item.title)) {
      deduped.set(item.title, item);
      continue;
    }
    const prev = deduped.get(item.title)!;
    deduped.set(item.title, {
      ...prev,
      priority: Math.min(prev.priority, item.priority),
      relatedTags: Array.from(new Set([...prev.relatedTags, ...item.relatedTags])),
    });
  }

  return [...deduped.values()].slice(0, maxCount);
}

function rankInsights(
  entries: ParsedEntry[],
  consultation: string,
  selectedTags: TagSelection,
): Data2PromptInsight[] {
  const keywords = tokenizeInput(consultation, selectedTags);
  if (keywords.length === 0) return [];

  const ranked: Data2PromptInsight[] = [];

  for (const entry of entries) {
    const disabilityMentioned = hasDisabilityMention(consultation, entry.disability);
    const matchedIssues = entry.issues
      .map((issue) => ({
        issue: issue.issue,
        supports: issue.supports,
        score: scoreIssue(
          issue,
          entry.disability,
          entry.narrativeHighlights,
          keywords,
          disabilityMentioned,
        ),
      }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matchedIssues.length === 0) continue;
    const score =
      matchedIssues.slice(0, 3).reduce((sum, row) => sum + row.score, 0) +
      (disabilityMentioned ? 12 : 0);
    ranked.push({
      id: entry.id,
      disability: entry.disability,
      score,
      matchedIssues: matchedIssues.slice(0, 3),
      narrativeHighlights: entry.narrativeHighlights.slice(0, 3),
    });
  }

  return ranked.sort((a, b) => b.score - a.score);
}

export async function getData2KnowledgeBundle(
  consultation: string,
  selectedTags: TagSelection,
  options?: { maxInsights?: number; maxSuggestions?: number },
): Promise<Data2KnowledgeBundle> {
  const entries = await loadAllEntries();
  const ranked = rankInsights(entries, consultation, selectedTags);
  const maxInsights = options?.maxInsights ?? 6;
  const maxSuggestions = options?.maxSuggestions ?? 10;

  const promptInsights = ranked.slice(0, maxInsights);
  const suggestions = buildSuggestionsFromInsights(promptInsights, maxSuggestions);

  return {
    suggestions,
    promptInsights,
  };
}
