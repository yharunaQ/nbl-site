import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  buildRegionalSupportSuggestionReason,
  REGIONAL_SUPPORT_EXAMPLE_NOTE,
} from '@/lib/jac/regionalSupportPositioning';

type TagSelection = Record<string, string[]>;

export type SupportCatalogSuggestionSeed = {
  title: string;
  reason: string;
  examples: string;
  relatedTags: string[];
  priority: number;
};

export type SupportCatalogPromptSupport = {
  title: string;
  score: number;
  coefficient: number | null;
  summary: string;
  fallbackQuestion: string;
  relatedTags: string[];
};

export type SupportCatalogPromptIssue = {
  title: string;
  score: number;
  summary: string;
  recommendedSupports: SupportCatalogPromptSupport[];
};

export type SupportCatalogBundle = {
  suggestions: SupportCatalogSuggestionSeed[];
  promptIssues: SupportCatalogPromptIssue[];
  followupHints: string[];
};

type ParsedSupportItem = {
  title: string;
  coefficient: number | null;
};

type ParsedIssue = {
  title: string;
  summary: string;
  supports: ParsedSupportItem[];
};

type ParsedCatalog = {
  issues: ParsedIssue[];
  supportDetails: Map<string, string>;
};

const SUPPORTS_PATH = path.join(process.cwd(), 'references', 'supporter', 'supports.md');

const ISSUE_TAG_HINTS: Record<string, { relatedTags: string[]; fallbackQuestion: string }> = {
  '障害理解・対処・職業準備性': {
    relatedTags: [
      '就職準備中（支援機関利用・手帳取得中）',
      '知的特性（理解速度・手順保持）',
      '高次脳機能（記憶・注意・遂行）',
      '発達特性（切替・実行機能・段取り）',
      '内部障害（透析・循環器・呼吸器等）',
      '難病・慢性疾患（指定難病・免疫疾患等）',
    ],
    fallbackQuestion:
      '障害や体調の特徴、得意不得意、働く準備でまだ整理しきれていない点はどこですか？',
  },
  就職活動の実施: {
    relatedTags: [
      '就職活動中（求人探し・応募・面接）',
      '就職準備中（支援機関利用・手帳取得中）',
      '会議・対話',
      '文章作成・読解',
    ],
    fallbackQuestion: '応募先の探し方や応募書類、面接での説明で、どこが一番止まりやすいですか？',
  },
  採用決定: {
    relatedTags: ['就職活動中（求人探し・応募・面接）', '就職準備中（支援機関利用・手帳取得中）'],
    fallbackQuestion:
      '実習や面接、トライアル雇用から採用につなげるうえで、今いちばん難しい部分は何ですか？',
  },
  就職後の体調管理とストレス対処: {
    relatedTags: [
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '疲労・倦怠（慢性疲労含む）',
      '痛み・体調変動（波がある）',
      '不安・緊張・メンタル負荷',
      '睡眠リズム・通院/治療スケジュール',
    ],
    fallbackQuestion:
      '就職後や復職後を見据えたとき、体調管理やストレス対処で特に不安な場面はどこですか？',
  },
  '職場定着・就業継続': {
    relatedTags: [
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '離職後・次のステップを考えている',
      '時間制約・納期',
      '安全・危険業務・緊急対応',
      '対人調整・感情労働',
    ],
    fallbackQuestion: '続けて働くうえで、数週間から数か月の単位で崩れやすい条件は何ですか？',
  },
};

const SUPPORT_GUIDANCE: Record<
  string,
  { displayTitle: string; relatedTags: string[]; fallbackQuestion: string }
> = {
  '企業へのアプローチ（連携）': {
    displayTitle: '企業との調整や職場開拓を支援機関と進める',
    relatedTags: [
      '就職活動中（求人探し・応募・面接）',
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '知的特性（理解速度・手順保持）',
      '高次脳機能（記憶・注意・遂行）',
      '内部障害（透析・循環器・呼吸器等）',
      '難病・慢性疾患（指定難病・免疫疾患等）',
      '身体操作・実作業負荷（立位・運搬・手作業）',
      '安全・危険業務・緊急対応',
      '段差・エレベータ・トイレ等の物理アクセス',
      '指示・連絡の明確さ（手順書/見本/確認）',
      '字幕・文字起こし・テキスト連絡導線',
    ],
    fallbackQuestion:
      '企業側への説明や見学・実習、配慮の調整を一緒に進めてくれる支援機関はありますか？',
  },
  '職業場面を踏まえた職業評価（連携）': {
    displayTitle: '実際の仕事に近い職業評価を地域支援と行う',
    relatedTags: [
      '就職準備中（支援機関利用・手帳取得中）',
      '反復手順作業（工程順守・確認）',
      '記憶保持が必要な作業（抜け漏れリスク）',
      '知的特性（理解速度・手順保持）',
      '高次脳機能（記憶・注意・遂行）',
      '発達特性（切替・実行機能・段取り）',
      '移動・外出・現場',
      '身体操作・実作業負荷（立位・運搬・手作業）',
      '安全・危険業務・緊急対応',
      '指示・連絡の明確さ（手順書/見本/確認）',
    ],
    fallbackQuestion: '実際の作業や模擬場面で、得意・苦手や必要な配慮を確認したことはありますか？',
  },
  '障害理解・対処・家族支援（連携）': {
    displayTitle: '障害理解・自己対処・家族支援を連携して整える',
    relatedTags: [
      '知的特性（理解速度・手順保持）',
      '高次脳機能（記憶・注意・遂行）',
      '発達特性（切替・実行機能・段取り）',
      '精神症状の波（気分・幻覚妄想・陰性症状等）',
      '不安・緊張・メンタル負荷',
      '内部障害（透析・循環器・呼吸器等）',
      '難病・慢性疾患（指定難病・免疫疾患等）',
      '発作・急変リスク（てんかん等）',
    ],
    fallbackQuestion:
      '自分の障害や体調変動の説明、対処のコツ、家族の理解の状況はどこまで整理できていますか？',
  },
  '就職後の自己管理支援・検査（自前）': {
    displayTitle: '就職後の自己管理支援や検査につなぐ',
    relatedTags: [
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '疲労・倦怠（慢性疲労含む）',
      '痛み・体調変動（波がある）',
      '睡眠リズム・通院/治療スケジュール',
      '発作・急変リスク（てんかん等）',
    ],
    fallbackQuestion:
      '就職後の体調管理や自己管理について、医療・心理面を含めて確認できていることはありますか？',
  },
  '職業場面を踏まえた職業評価（自前）': {
    displayTitle: '自機関で職業場面に即した評価や訓練を行う',
    relatedTags: [
      '就職準備中（支援機関利用・手帳取得中）',
      '知的特性（理解速度・手順保持）',
      '高次脳機能（記憶・注意・遂行）',
      '発達特性（切替・実行機能・段取り）',
      '反復手順作業（工程順守・確認）',
      '記憶保持が必要な作業（抜け漏れリスク）',
      '身体操作・実作業負荷（立位・運搬・手作業）',
      '安全・危険業務・緊急対応',
      '指示・連絡の明確さ（手順書/見本/確認）',
    ],
    fallbackQuestion: '作業評価や訓練を自機関で継続して行える環境はありますか？',
  },
  '個性強み興味把握（自前重視）': {
    displayTitle: '本人の強み・興味・希望を丁寧に整理する',
    relatedTags: [
      '就職準備中（支援機関利用・手帳取得中）',
      '離職後・次のステップを考えている',
      '役割・専門性を維持したい',
      '成長機会・挑戦を続けたい',
      '裁量・自己決定を重視',
    ],
    fallbackQuestion: '得意なこと、興味が続くこと、避けたい条件はどこまで言語化できていますか？',
  },
  '就労・生活一体相談（連携）': {
    displayTitle: '就労と生活を一体で相談できる支援につなぐ',
    relatedTags: [
      '就職準備中（支援機関利用・手帳取得中）',
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '離職後・次のステップを考えている',
      '生活リズムを守りたい',
      '収入・雇用条件を守りたい',
      '通勤負荷（時間/混雑/距離）',
    ],
    fallbackQuestion:
      '就労だけでなく生活、通院、経済面も含めて一緒に相談できる支援先はありますか？',
  },
  '就職後継続的な職場・本人支援（自前）': {
    displayTitle: '就職後も職場と本人を継続フォローする',
    relatedTags: [
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '離職後・次のステップを考えている',
      '対人関係の安定を重視',
      '対人調整・感情労働',
    ],
    fallbackQuestion: '就職後に本人と職場の両方を継続フォローしてくれる支援先はありますか？',
  },
  '就労情報提供（連携重視）': {
    displayTitle: '就労支援や復職支援の情報提供を受ける',
    relatedTags: [
      '就職活動中（求人探し・応募・面接）',
      '就職準備中（支援機関利用・手帳取得中）',
      '休職中・復職を検討している',
      '離職後・次のステップを考えている',
    ],
    fallbackQuestion: '地域の就職・復職支援の情報を、どこからどの程度得られていますか？',
  },
  '就労障害者との交流・情報収集（自前）': {
    displayTitle: '同じ立場で働く人の情報や交流機会につなぐ',
    relatedTags: [
      '離職後・次のステップを考えている',
      '就職準備中（支援機関利用・手帳取得中）',
      '対人関係の安定を重視',
      '裁量・自己決定を重視',
    ],
    fallbackQuestion: '似た状況で働いている人の事例やピア情報に触れたことはありますか？',
  },
};

let cachedCatalog: ParsedCatalog | null = null;
let catalogPromise: Promise<ParsedCatalog> | null = null;

function normalizeLine(text: string): string {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLookup(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[\s　・／/（）()「」『』、,.:：\-]/g, '');
}

function tokenize(text: string): string[] {
  const normalized = String(text || '').trim();
  if (!normalized) return [];

  const items = new Set<string>();
  if (normalized.length >= 2) items.add(normalized);

  normalized
    .split(/[・／/（）()「」『』、,.:：\s　]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)
    .forEach((item) => items.add(item));

  return Array.from(items);
}

function tokenizeInput(consultation: string, selectedTags: TagSelection): string[] {
  const tokens = new Set<string>();
  [consultation, ...Object.values(selectedTags || {}).flat()]
    .flatMap((value) => tokenize(String(value || '')))
    .forEach((value) => tokens.add(value));
  return Array.from(tokens);
}

function normalizeTitleKey(title: string): string {
  return normalizeLookup(title);
}

function summarize(text: string, maxLength = 140): string {
  const compact = normalizeLine(text);
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1)}…`;
}

function extractIssueTitle(line: string): string | null {
  const match = normalizeLine(line).match(/^###\s+職業的課題\d+:\s*「(.+?)」$/);
  return match?.[1]?.trim() || null;
}

function extractSupportHeading(line: string): string | null {
  const normalized = normalizeLine(line);
  if (!normalized.startsWith('### ')) return null;
  if (normalized.startsWith('### 職業的課題')) return null;
  return normalized.replace(/^###\s+/, '').trim() || null;
}

function extractSupportItem(line: string): ParsedSupportItem | null {
  const match = normalizeLine(line).match(/^\*\s+(.+?)(?:\s*\[(-?\d+(?:\.\d+)?)\])?$/);
  if (!match) return null;
  return {
    title: match[1].trim(),
    coefficient: match[2] ? Number(match[2]) : null,
  };
}

function scoreTextMatch(text: string, tokens: string[], weight: number): number {
  if (!text) return 0;
  const haystack = normalizeLookup(text);
  if (!haystack) return 0;

  let score = 0;
  for (const token of tokens) {
    const needle = normalizeLookup(token);
    if (!needle || needle.length < 2) continue;
    if (haystack.includes(needle)) {
      score += weight;
    }
  }
  return score;
}

function dedupeSuggestions(items: SupportCatalogSuggestionSeed[], maxCount: number) {
  const byTitle = new Map<string, SupportCatalogSuggestionSeed>();

  for (const item of items) {
    const key = item.title.trim();
    if (!key) continue;
    const prev = byTitle.get(key);
    if (!prev) {
      byTitle.set(key, item);
      continue;
    }
    byTitle.set(key, {
      ...prev,
      priority: Math.min(prev.priority, item.priority),
      relatedTags: Array.from(new Set([...prev.relatedTags, ...item.relatedTags])),
      reason: prev.reason.length >= item.reason.length ? prev.reason : item.reason,
      examples: prev.examples.length >= item.examples.length ? prev.examples : item.examples,
    });
  }

  return Array.from(byTitle.values())
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxCount);
}

async function parseSupportCatalog(): Promise<ParsedCatalog> {
  if (cachedCatalog) return cachedCatalog;
  if (catalogPromise) return catalogPromise;

  catalogPromise = fs
    .readFile(SUPPORTS_PATH, 'utf8')
    .then((raw) => {
      const lines = raw.split(/\r?\n/);
      const issues: ParsedIssue[] = [];
      const supportDetails = new Map<string, string>();

      let section: 'issues' | 'details' = 'issues';
      let currentIssue: ParsedIssue | null = null;
      let currentSupportTitle: string | null = null;
      let currentSupportLines: string[] = [];

      const flushIssue = () => {
        if (!currentIssue) return;
        currentIssue.summary = normalizeLine(currentIssue.summary);
        issues.push(currentIssue);
        currentIssue = null;
      };

      const flushSupport = () => {
        if (!currentSupportTitle) return;
        supportDetails.set(currentSupportTitle, normalizeLine(currentSupportLines.join(' ')));
        currentSupportTitle = null;
        currentSupportLines = [];
      };

      for (const rawLine of lines) {
        const line = normalizeLine(rawLine);
        if (!line) continue;

        if (line === '## 効果的就労支援の具体的内容') {
          flushIssue();
          flushSupport();
          section = 'details';
          continue;
        }

        if (section === 'issues') {
          const issueTitle = extractIssueTitle(line);
          if (issueTitle) {
            flushIssue();
            currentIssue = { title: issueTitle, summary: '', supports: [] };
            continue;
          }

          if (!currentIssue) continue;
          const support = extractSupportItem(line);
          if (support) {
            currentIssue.supports.push(support);
            continue;
          }
          if (/^###\s+/.test(line) || /^##\s+/.test(line)) continue;
          currentIssue.summary = `${currentIssue.summary} ${line}`.trim();
          continue;
        }

        const supportTitle = extractSupportHeading(line);
        if (supportTitle) {
          flushSupport();
          currentSupportTitle = supportTitle;
          continue;
        }

        if (!currentSupportTitle || line.startsWith('## ')) continue;
        currentSupportLines.push(line);
      }

      flushIssue();
      flushSupport();

      cachedCatalog = { issues, supportDetails };
      return cachedCatalog;
    })
    .finally(() => {
      catalogPromise = null;
    });

  return catalogPromise;
}

export async function getSupportCatalogBundle(
  consultation: string,
  selectedTags: TagSelection,
  options?: { maxIssues?: number; maxSuggestions?: number; maxQuestions?: number },
): Promise<SupportCatalogBundle> {
  const catalog = await parseSupportCatalog();
  const tokens = tokenizeInput(consultation, selectedTags);
  if (tokens.length === 0) {
    return { suggestions: [], promptIssues: [], followupHints: [] };
  }

  const selectedTagList = Object.values(selectedTags || {}).flat();
  const matchedIssues = catalog.issues
    .map((issue) => {
      const issueHint = ISSUE_TAG_HINTS[issue.title];
      let score = 0;
      score += scoreTextMatch(issue.title, tokens, 6);
      score += scoreTextMatch(issue.summary, tokens, 4);

      if (issueHint) {
        score += issueHint.relatedTags.filter((tag) => selectedTagList.includes(tag)).length * 3;
      }

      const recommendedSupports = issue.supports
        .map((support) => {
          const detail = catalog.supportDetails.get(support.title) || '';
          const guidance = SUPPORT_GUIDANCE[support.title];
          const supportTags = guidance?.relatedTags || [];
          const supportScore =
            scoreTextMatch(support.title, tokens, 5) +
            scoreTextMatch(detail, tokens, 3) +
            supportTags.filter((tag) => selectedTagList.includes(tag)).length * 2 +
            (support.coefficient !== null ? Math.max(0, 0.25 - Math.abs(support.coefficient)) : 0);

          return {
            title: support.title,
            score: Number(supportScore.toFixed(2)),
            coefficient: support.coefficient,
            summary: summarize(detail || `${support.title} を支援候補として検討する。`, 160),
            fallbackQuestion:
              guidance?.fallbackQuestion ||
              issueHint?.fallbackQuestion ||
              'この支援を使うとしたら、どんな場面で役立ちそうですか？',
            relatedTags: supportTags,
          };
        })
        .filter((support) => support.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const issueScore =
        score +
        recommendedSupports.slice(0, 2).reduce((sum, support) => sum + support.score, 0) +
        (issue.supports.length >= 3 ? 1 : 0);

      return {
        title: issue.title,
        score: Number(issueScore.toFixed(2)),
        summary: summarize(issue.summary, 180),
        recommendedSupports,
      };
    })
    .filter((issue) => issue.score > 0 && issue.recommendedSupports.length > 0)
    .sort((a, b) => b.score - a.score);

  const maxIssues = options?.maxIssues ?? 3;
  const maxSuggestions = options?.maxSuggestions ?? 8;
  const maxQuestions = options?.maxQuestions ?? 4;
  const promptIssues = matchedIssues.slice(0, maxIssues);

  const suggestions = dedupeSuggestions(
    promptIssues.flatMap((issue) =>
      issue.recommendedSupports.map((support) => {
        const guidance = SUPPORT_GUIDANCE[support.title];
        const issueHint = ISSUE_TAG_HINTS[issue.title];
        const detail = catalog.supportDetails.get(support.title) || support.summary;
        const priority =
          support.coefficient !== null && support.coefficient <= -0.1
            ? 1
            : support.coefficient !== null && support.coefficient <= -0.06
              ? 2
              : 3;

        return {
          title: guidance?.displayTitle || support.title,
          reason: buildRegionalSupportSuggestionReason(issue.title, support.title),
          examples: [
            `支援の中身: ${summarize(detail, 120)}`,
            support.coefficient !== null ? `推定係数: ${support.coefficient}` : '',
            REGIONAL_SUPPORT_EXAMPLE_NOTE,
          ]
            .filter(Boolean)
            .join(' | '),
          relatedTags: Array.from(
            new Set([...(guidance?.relatedTags || []), ...(issueHint?.relatedTags || [])]),
          ),
          priority,
        } satisfies SupportCatalogSuggestionSeed;
      }),
    ),
    maxSuggestions,
  );

  const followupHints = Array.from(
    new Set(
      promptIssues.flatMap((issue) => {
        const issueHint = ISSUE_TAG_HINTS[issue.title];
        return [
          issueHint?.fallbackQuestion || '',
          ...issue.recommendedSupports.map((support) => support.fallbackQuestion),
        ].filter(Boolean);
      }),
    ),
  ).slice(0, maxQuestions);

  return {
    suggestions,
    promptIssues,
    followupHints,
  };
}
