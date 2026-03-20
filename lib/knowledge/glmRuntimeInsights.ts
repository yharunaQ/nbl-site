import glmRelationsData from '@/references/GLM_resutls/nanbyo-glm-significant-relations.json';
import {
  buildGlmInsights as buildCuratedGlmInsights,
  type GlmInsight,
  type GlmInput,
  type GlmInsightResult,
} from '@/lib/knowledge/glmInsights';

type GlmRelationRow = {
  id: string;
  sheet: string;
  sheetOrder: number;
  predictorId: string;
  predictorGroup: string;
  predictor: string;
  outcome: string;
  p: number;
  b: number;
  direction: 'up' | 'down';
  summary: string;
  keywords: string[];
};

type GlmRelationPayload = {
  generatedAt: string;
  sourceFile: string;
  pThreshold: number;
  relationCount: number;
  sheetCount: number;
  relations: GlmRelationRow[];
};

const FULL_GLM_RELATIONS: GlmRelationRow[] = Array.isArray(
  (glmRelationsData as GlmRelationPayload)?.relations,
)
  ? (glmRelationsData as GlmRelationPayload).relations
  : [];

const KEYWORD_LIMIT = 18;

const GENERIC_ACTIONS_BY_SHEET: Array<{ test: RegExp; actions: string[] }> = [
  {
    test: /就労困難性発生/,
    actions: ['業務負荷とペースを再設計する', '困難が出る場面を分解して先に予防線を作る'],
  },
  {
    test: /解決可能性/,
    actions: ['外部支援と社内調整を同時に計画する', '段階的な改善計画を短い周期で見直す'],
  },
  {
    test: /症状に影響/,
    actions: ['症状悪化トリガーを避ける働き方へ調整する', '休憩導線と勤務リズムを固定化する'],
  },
  {
    test: /必要な配慮|支援/,
    actions: ['必要配慮を文書化して合意する', '配慮の効果と副作用を定期点検する'],
  },
];

const ACTION_RULES: Array<{ test: RegExp; action: string }> = [
  { test: /通院|治療|服薬/, action: '通院・治療スケジュールへの配慮を組み込む' },
  { test: /疲れ|疲労|倦怠|体調|無理/, action: '休憩導線と業務ペースを再設計する' },
  { test: /集中|注意|記憶|認知|読解|理解/, action: '情報量を減らし手順と確認点を明文化する' },
  { test: /騒音|照明|温度|刺激|環境/, action: '環境刺激（音・光・温度）を調整する' },
  { test: /就職|再就職|応募|面接/, action: '就職準備と職務要件のすり合わせを強化する' },
  { test: /孤立|疎外|人間関係|説明/, action: '配慮共有の範囲と相談ルートを事前に決める' },
  { test: /職業紹介|あっせん|相談|支援/, action: '外部支援機関との連携計画を組む' },
  { test: /自己管理|食事|トイレ|休憩/, action: '自己管理に必要な離席・休憩ルールを設定する' },
];

function normalizeText(text: string): string {
  return String(text || '').toLowerCase();
}

function buildCorpus(input: GlmInput): string {
  const joinedTags = Object.values(input.selectedTags || {})
    .flat()
    .join(' ');
  const followUps = (input.followUpAnswers || []).map((item) => item.value).join(' ');
  return normalizeText([input.consultation, input.additionalConsultation || '', joinedTags, followUps].join(' '));
}

function confidenceByPValue(p: number | null): 'high' | 'medium' {
  if (typeof p === 'number' && p <= 0.01) return 'high';
  return 'medium';
}

function tokenizeKeywordCandidates(text: string): string[] {
  const tokens = String(text || '')
    .split(/[\s、。,.()（）\[\]「」『』\/:：;；]+/)
    .map((value) => value.trim())
    .filter((value) => value.length >= 2);
  return Array.from(new Set(tokens)).slice(0, KEYWORD_LIMIT);
}

function relationKeywords(row: GlmRelationRow): string[] {
  if (Array.isArray(row.keywords) && row.keywords.length > 0) {
    return row.keywords;
  }
  return tokenizeKeywordCandidates(`${row.predictor} ${row.outcome} ${row.predictorGroup} ${row.sheet}`);
}

function inferActionTitles(row: GlmRelationRow): string[] {
  const text = `${row.predictor} ${row.outcome} ${row.predictorGroup}`;
  const picked = new Set<string>();
  for (const rule of ACTION_RULES) {
    if (rule.test.test(text)) picked.add(rule.action);
  }
  for (const rowRule of GENERIC_ACTIONS_BY_SHEET) {
    if (rowRule.test.test(row.sheet)) {
      rowRule.actions.forEach((action) => picked.add(action));
      break;
    }
  }
  return Array.from(picked).slice(0, 3);
}

function scoreRelation(row: GlmRelationRow, corpus: string): { score: number; matchedKeywords: string[] } {
  const keywords = relationKeywords(row);
  const matchedKeywords = keywords.filter((keyword) => corpus.includes(normalizeText(keyword)));
  const keywordScore = Math.min(1.8, matchedKeywords.length * 0.24);
  const effectScore = Math.min(Math.abs(Number(row.b || 0)), 1.5);
  const pValue = Number(row.p);
  const pScore = pValue <= 0.01 ? 0.45 : pValue <= 0.05 ? 0.25 : 0.05;
  const score = effectScore + keywordScore + pScore;
  return { score, matchedKeywords };
}

export function buildGlmInsights(input: GlmInput): GlmInsightResult {
  if (!Array.isArray(FULL_GLM_RELATIONS) || FULL_GLM_RELATIONS.length === 0) {
    return buildCuratedGlmInsights(input);
  }

  const corpus = buildCorpus(input);

  const scored = FULL_GLM_RELATIONS.map((row) => {
    const { score, matchedKeywords } = scoreRelation(row, corpus);
    return { row, matchedKeywords, score };
  })
    .filter((item) => item.matchedKeywords.length > 0)
    .sort((a, b) => b.score - a.score);

  const fallback = [...FULL_GLM_RELATIONS]
    .sort((a, b) => {
      if (a.p !== b.p) return a.p - b.p;
      return Math.abs(b.b) - Math.abs(a.b);
    })
    .slice(0, 8)
    .map((row) => ({ row, matchedKeywords: [], score: 0 }));

  const source = scored.length > 0 ? scored : fallback;

  const topInsights: GlmInsight[] = source.slice(0, 8).map(({ row, matchedKeywords }) => ({
    evidenceId: row.id,
    sheet: row.sheet,
    summary: row.summary,
    predictor: row.predictor,
    outcome: row.outcome,
    effect: row.b,
    pValue: row.p,
    confidence: confidenceByPValue(row.p),
    matchedKeywords,
    actionTitles: inferActionTitles(row),
  }));

  const recommendedActions = Array.from(new Set(topInsights.flatMap((item) => item.actionTitles))).slice(
    0,
    8,
  );

  return { topInsights, recommendedActions };
}
