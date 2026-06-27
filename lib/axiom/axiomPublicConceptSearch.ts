import {
  buildAxiomNblReportShareItems,
  buildAxiomToolkitInfographicShareItems,
} from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import { rewriteAxiomCandidateHrefToPublished } from './nextNblPublishedRoutes';

export type AxiomPublicConceptSearchKind =
  | 'page'
  | 'work_design_domain'
  | 'condition_window'
  | 'nbl_report'
  | 'toolkit';

export type AxiomPublicConceptSearchEntry = {
  id: string;
  kind: AxiomPublicConceptSearchKind;
  title: string;
  summary: string;
  href: string;
  keywords: readonly string[];
  concepts: readonly string[];
};

export type AxiomPublicConceptMatch = AxiomPublicConceptSearchEntry & {
  score: number;
  matchedTerms: readonly string[];
  matchedConcepts: readonly string[];
  reason: string;
};

export type AxiomPublicConceptSearchResult = {
  query: string;
  normalizedQuery: string;
  expandedTerms: readonly string[];
  expandedConcepts: readonly string[];
  matches: readonly AxiomPublicConceptMatch[];
};

type ConceptExpansion = {
  concept: string;
  triggers: readonly string[];
  expandsTo: readonly string[];
};

const conceptExpansions: readonly ConceptExpansion[] = [
  {
    concept: '難病・慢性疾患を健康時間として読む',
    triggers: ['難病', '慢性疾患', '膠原病', 'ibd', '見えない病気', '手帳がない'],
    expandsTo: [
      '健康時間',
      '治療',
      '通院',
      '定期検診',
      '症状変動',
      '体調変動',
      '疲労',
      '回復時間',
      '生活保障',
      '収入不安',
      '開示',
      '評価',
      '復職',
      '内部障害',
    ],
  },
  {
    concept: '合理的配慮を仕事条件へ翻訳する',
    triggers: ['合理的配慮', '配慮', '調整', '職場配慮'],
    expandsTo: [
      '仕事設計',
      '作業',
      '手順',
      '環境',
      '相談線',
      '評価',
      '制度',
      '職場運用',
      '情報形式',
    ],
  },
  {
    concept: '開示を目的限定の情報共有として見る',
    triggers: [
      '開示',
      '非開示',
      'オープン',
      'クローズ',
      'オープン/クローズ',
      'オープン・クローズ',
      'オープン就労',
      'クローズ就労',
      '伝える',
      '共有',
      '病名を言う',
      '障害を言う',
    ],
    expandsTo: [
      '共有範囲',
      '伝える範囲',
      '言う言わない',
      '目的限定',
      '開示境界',
      '評価不安',
      '不利益',
      'スティグマ',
      '相談線',
      '記録範囲',
    ],
  },
  {
    concept: '視覚・聴覚を情報参加の仕様として見る',
    triggers: ['視覚', '聴覚', '聞こえ', '見え', '感覚障害', '情報保障'],
    expandsTo: ['会議', '字幕', '手話', '資料', '警告', '口頭', '文字', '情報形式', '参加'],
  },
  {
    concept: '移動・通勤・道具を職場接触点として見る',
    triggers: ['通勤', '移動', '肢体', '車いす', '道具', '動線'],
    expandsTo: ['職場接触点', '休憩場所', '姿勢', '安全', '消耗', '職場内移動', '職場外移動'],
  },
  {
    concept: '精神・発達・認知を手順と環境で見る',
    triggers: ['精神', '発達', '高次脳', '知的', 'メンタル', '認知'],
    expandsTo: ['手順', '切替', '優先順位', '刺激環境', '確認', '暗黙ルール', '評価', '記憶補助'],
  },
  {
    concept: '雇用の質を採用後の参加として見る',
    triggers: ['雇用率', '採用', '定着', '雇用の質', '働き続ける'],
    expandsTo: ['役割', '評価', '成長', '賃金', '処遇', '参加の質', 'キャリア', '学習機会'],
  },
  {
    concept: '支援接続を仕事条件への翻訳として見る',
    triggers: ['支援者', '医療', '福祉', '行政', '連携', '多職種', '支援機関'],
    expandsTo: ['翻訳', '再翻訳', 'handoff', '役割境界', '制度', '会議', '研修', '相談線'],
  },
  {
    concept: '検索・SNS・AI要約を安全に読み直す',
    triggers: ['ai', '検索', 'sns', '要約', '生成ai', '偏見'],
    expandsTo: ['資料の読み方', '一面性', '根拠', '過剰一般化', 'missing context', '専門性'],
  },
  {
    concept: '就職前・復職・移行を入口から設計する',
    triggers: ['就職前', '未就業', '実習', '応募', '復職', '移行', '体験'],
    expandsTo: ['仕事像', '職場体験', '応募前', '引き継ぎ', '戻り道', '復職後', '支援接続'],
  },
] as const;

const curatedEntries: readonly AxiomPublicConceptSearchEntry[] = [
  {
    id: 'home',
    kind: 'page',
    title: 'トップページ',
    summary: '働きづらさを人の問題で終わらせず、仕事条件の地図として読む入口。',
    href: '/',
    keywords: ['トップ', '入口', '全体', '仕事条件', '働きづらさ', '参加'],
    concepts: ['仕事条件', '社会参加', '多様性'],
  },
  {
    id: 'old-new-issues',
    kind: 'page',
    title: '8つの課題',
    summary: '昔から語られてきたが解けにくかった課題を、4コマと仕事条件で読み直す。',
    href: '/scene-entry',
    keywords: ['古くて新しい課題', '雇用の質', '名前で止まる', '健康時間', '情報の分断', '制度', '上司依存', 'SNS', 'AI'],
    concepts: ['課題ショーケース', '認知負荷', '仕事条件'],
  },
  {
    id: 'case-readings',
    kind: 'page',
    title: '相談事例',
    summary: '相談の一言をつぶさず、仕事条件の設計へつなげるアセスメントの入口。',
    href: '/case-readings#consultation-finder',
    keywords: ['相談', 'アセスメント', '見立て', '確認したいこと', '支援計画', '本人', '企業', '支援者', '行政'],
    concepts: ['相談', '見立て', '仕事条件', '支援計画'],
  },
  {
    id: 'work-design-guide',
    kind: 'page',
    title: '未来の仕事・社会参加設計ガイド',
    summary: '人間の多様性を前提に、仕事と社会参加を設計し直すための実用ガイド。',
    href: '/work-design-views-guide',
    keywords: ['設計ガイド', '仕事設計', '社会参加', '多様性', '標準的な職業人', 'マスタープラン'],
    concepts: ['仕事設計', '社会参加', '多様性'],
  },
  {
    id: 'domain-pre-entry-transition',
    kind: 'work_design_domain',
    title: '就職前・入口・移行を設計する',
    summary: '求人、職場体験、面接、復職、移行支援を、仕事条件を試せる入口に変える。',
    href: '/work-design-views-guide#work-design-domain-pre-entry-transition',
    keywords: ['就職前', '入口', '移行', '応募', '実習', '職場体験', '復職', '仕事像'],
    concepts: ['就職前・復職・移行を入口から設計する'],
  },
  {
    id: 'domain-health-time-livelihood',
    kind: 'work_design_domain',
    title: '健康時間・生活保障・仕事密度を設計する',
    summary: '体調変動、治療、回復、通勤、収入不安、評価時期を、仕事の時間設計として扱う。',
    href: '/work-design-views-guide#work-design-domain-health-time-livelihood',
    keywords: ['健康時間', '体調変動', '治療', '通院', '回復', '通勤', '収入不安', '評価', '生活保障', '仕事密度'],
    concepts: ['難病・慢性疾患を健康時間として読む'],
  },
  {
    id: 'domain-worksite-access-operations',
    kind: 'work_design_domain',
    title: '情報・手順・接触点を設計する',
    summary: '情報アクセス、手順理解、職場内外の移動、道具、安全を、仕事の接点として整える。',
    href: '/work-design-views-guide#work-design-domain-worksite-access-operations',
    keywords: ['情報', '手順', '接触点', '視覚', '聴覚', '認知', '移動', '通勤', '道具', '安全'],
    concepts: ['視覚・聴覚を情報参加の仕様として見る', '移動・通勤・道具を職場接触点として見る'],
  },
  {
    id: 'domain-relationship-evaluation-growth',
    kind: 'work_design_domain',
    title: '開示・評価・役割・成長を設計する',
    summary: '情報共有、評価、役割、成長を、善意や理解だけに預けない仕事条件として扱う。',
    href: '/work-design-views-guide#work-design-domain-relationship-evaluation-growth',
    keywords: ['開示', '評価', '役割', '成長', '賃金', '処遇', 'キャリア', '情報共有'],
    concepts: ['開示を目的限定の情報共有として見る', '雇用の質を採用後の参加として見る'],
  },
  {
    id: 'domain-support-institution-learning',
    kind: 'work_design_domain',
    title: '支援・制度・知識更新を設計する',
    summary: '本人、職場、医療・福祉・教育、行政、研究、制度情報を、現場で使える仕事条件へ翻訳する。',
    href: '/work-design-views-guide#work-design-domain-support-institution-learning',
    keywords: ['支援', '制度', '医療', '福祉', '教育', '行政', '研究', '研修', '翻訳', '連携'],
    concepts: ['支援接続を仕事条件への翻訳として見る'],
  },
  {
    id: 'nbl-report',
    kind: 'page',
    title: 'NBLレポート',
    summary: '現場、政策、社会の問いを、仕事条件の論考として読み直す記事集。',
    href: '/articles-social-questions#nbl-report-editorial-map',
    keywords: ['記事', '論考', 'レポート', '政策', '社会問題', 'SNS', 'ニュース'],
    concepts: ['検索・SNS・AI要約を安全に読み直す', '仕事条件'],
  },
  {
    id: 'toolkit',
    kind: 'page',
    title: 'ツールキット',
    summary: '図解、4コマ、音楽、フォーラム、資料を、会議や研修で使える形に並べた入口。',
    href: '/toolkit-studio#toolkit-studio-modules',
    keywords: ['図解', '4コマ', '音楽', 'フォーラム', '資料', '研修', '会議', 'チェックリスト'],
    concepts: ['認知負荷', '素材', '研修'],
  },
  {
    id: 'projects',
    kind: 'page',
    title: 'プロジェクト',
    summary:
      '仕事と参加の条件デザイン研究会、難病地域連携、福祉・医療・雇用の連携設計・人材育成の協働入口。',
    href: '/projects',
    keywords: [
      'プロジェクト',
      '研究会',
      '仲間',
      '協働',
      'パートナー',
      '難病地域連携',
      '福祉',
      '医療',
      '雇用',
      '人材育成',
      '共同実装',
      '制度設計',
      '問い合わせ',
    ],
    concepts: ['協働', '研究会', '共同実装', '人材育成'],
  },
  {
    id: 'condition-window',
    kind: 'page',
    title: '障害種類から見る',
    summary: '障害種類や疾病名から入り、例外的対応ではなく職場設計として読み直す入口。',
    href: '/work-condition-window#condition-window-categories',
    keywords: ['障害種類', '疾病名', '病名', '視覚', '聴覚', '肢体', '内部', '知的', '精神', '発達', '高次脳', '難病'],
    concepts: ['障害種類', '職場設計'],
  },
  {
    id: 'condition-visual',
    kind: 'condition_window',
    title: '視覚障害から見る',
    summary: '見え方、文書形式、画面、移動、掲示、会議情報を、職場の情報設計として確認する。',
    href: '/work-condition-window#condition-window-visual-impairment',
    keywords: ['視覚障害', '見え方', '画面', '文書', '掲示', '移動', '会議'],
    concepts: ['視覚・聴覚を情報参加の仕様として見る'],
  },
  {
    id: 'condition-hearing',
    kind: 'condition_window',
    title: '聴覚・平衡機能障害から見る',
    summary: '聞こえ、会議、警告音、口頭連絡、雑談、平衡感覚を、情報参加の条件として見る。',
    href: '/work-condition-window#condition-window-hearing-balance-impairment',
    keywords: ['聴覚障害', '聞こえ', '平衡機能', '会議', '警告音', '口頭', '字幕', '手話'],
    concepts: ['視覚・聴覚を情報参加の仕様として見る'],
  },
  {
    id: 'condition-physical',
    kind: 'condition_window',
    title: '肢体不自由から見る',
    summary: '職場内外の移動、姿勢、道具、接触点、安全、休憩場所を仕事条件として見る。',
    href: '/work-condition-window#condition-window-physical-disability',
    keywords: ['肢体不自由', '移動', '通勤', '動線', '姿勢', '道具', '休憩場所', '安全'],
    concepts: ['移動・通勤・道具を職場接触点として見る'],
  },
  {
    id: 'condition-internal',
    kind: 'condition_window',
    title: '内部障害から見る',
    summary: '定期検診、治療時間、疲労、身体管理、職務密度、勤務外の回復条件を見る。',
    href: '/work-condition-window#condition-window-internal-disability',
    keywords: ['内部障害', '定期検診', '治療', '通院', '疲労', '身体管理', '回復'],
    concepts: ['難病・慢性疾患を健康時間として読む'],
  },
  {
    id: 'condition-intellectual',
    kind: 'condition_window',
    title: '知的障害から見る',
    summary: '説明形式、反復、役割設計、周囲の翻訳条件を、仕事の分かりやすさとして確認する。',
    href: '/work-condition-window#condition-window-intellectual-disability',
    keywords: ['知的障害', '説明', '反復', '役割', '分かりやすさ', '支援'],
    concepts: ['精神・発達・認知を手順と環境で見る'],
  },
  {
    id: 'condition-mental',
    kind: 'condition_window',
    title: '精神障害から見る',
    summary: '症状、刺激環境、相談線、評価、支援接続、悪化前の早期対応を仕事条件として見る。',
    href: '/work-condition-window#condition-window-mental-disability',
    keywords: ['精神障害', 'メンタルヘルス', '刺激環境', '相談線', '評価', '早期対応', '悪化'],
    concepts: ['精神・発達・認知を手順と環境で見る'],
  },
  {
    id: 'condition-developmental',
    kind: 'condition_window',
    title: '発達障害から見る',
    summary: '予測可能性、手順、切替、暗黙ルール、刺激環境、評価を仕事の仕様として見る。',
    href: '/work-condition-window#condition-window-developmental-disability',
    keywords: ['発達障害', '予測可能性', '手順', '切替', '暗黙ルール', '刺激', '評価'],
    concepts: ['精神・発達・認知を手順と環境で見る'],
  },
  {
    id: 'condition-higher-brain',
    kind: 'condition_window',
    title: '高次脳機能障害から見る',
    summary: '記憶、注意、遂行機能、確認手順、周囲の翻訳条件を仕事条件として見る。',
    href: '/work-condition-window#condition-window-higher-brain-dysfunction',
    keywords: ['高次脳機能障害', '記憶', '注意', '確認', '遂行機能', '手順'],
    concepts: ['精神・発達・認知を手順と環境で見る'],
  },
  {
    id: 'condition-intractable-disease',
    kind: 'condition_window',
    title: '難病から見る',
    summary: '体調変動、予測困難性、治療、開示、収入不安、戻り回路を区別して見る。',
    href: '/work-condition-window#condition-window-intractable-disease',
    keywords: ['難病', '慢性疾患', '体調変動', '症状変動', '治療', '通院', '開示', '収入不安', '戻り道'],
    concepts: ['難病・慢性疾患を健康時間として読む'],
  },
  {
    id: 'theory-method-trust',
    kind: 'page',
    title: 'NBLの専門性',
    summary: '専門情報を安全に読み、複雑な仕事条件を人に使える形へ翻訳する専門性。',
    href: '/theory-method-trust',
    keywords: ['専門性', '読み方', 'AI', '専門知識ネットワーク', 'ICF', '仮説', '反対仮説', 'missing context'],
    concepts: ['検索・SNS・AI要約を安全に読み直す', '専門情報の読解規律'],
  },
  {
    id: 'about-boundary',
    kind: 'page',
    title: 'サイト情報',
    summary: '運営目的、責任者、問い合わせ、免責、著作権、SNS発信の扱い。',
    href: '/about-boundary',
    keywords: ['運営', '責任者', '問い合わせ', '免責', '著作権', 'SNS', 'プロフィール'],
    concepts: ['運営情報'],
  },
] as const;

const kindLabels: Record<AxiomPublicConceptSearchKind, string> = {
  page: 'ページ',
  work_design_domain: '設計領域',
  condition_window: '障害種類入口',
  nbl_report: 'NBLレポート',
  toolkit: 'ツールキット',
};

function normalize(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function unique(values: readonly string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function entryText(entry: AxiomPublicConceptSearchEntry) {
  return normalize(
    [
      entry.title,
      entry.summary,
      ...entry.keywords,
      ...entry.concepts,
    ].join(' '),
  );
}

function expandQuery(query: string) {
  const normalizedQuery = normalize(query);
  const directTerms = normalizedQuery ? normalizedQuery.split(' ').filter(Boolean) : [];
  const expandedConcepts: string[] = [];
  const expandedTerms: string[] = [...directTerms];

  for (const expansion of conceptExpansions) {
    const matched = expansion.triggers.some((trigger) =>
      normalizedQuery.includes(normalize(trigger)),
    );

    if (matched) {
      expandedConcepts.push(expansion.concept);
      expandedTerms.push(...expansion.triggers, ...expansion.expandsTo);
    }
  }

  return {
    normalizedQuery,
    expandedConcepts: unique(expandedConcepts),
    expandedTerms: unique(expandedTerms.map(normalize)),
  };
}

function scoreEntry(
  entry: AxiomPublicConceptSearchEntry,
  expandedTerms: readonly string[],
  expandedConcepts: readonly string[],
) {
  const text = entryText(entry);
  const normalizedTitle = normalize(entry.title);
  const normalizedKeywords = entry.keywords.map(normalize);
  const normalizedConcepts = entry.concepts.map(normalize);
  const matchedTerms: string[] = [];
  const matchedConcepts: string[] = [];
  let score = 0;

  for (const term of expandedTerms) {
    if (!term || term.length < 1) {
      continue;
    }

    if (normalizedTitle.includes(term)) {
      score += 18;
      matchedTerms.push(term);
      continue;
    }

    if (normalizedKeywords.some((keyword) => keyword.includes(term) || term.includes(keyword))) {
      score += 12;
      matchedTerms.push(term);
      continue;
    }

    if (normalizedConcepts.some((concept) => concept.includes(term) || term.includes(concept))) {
      score += 10;
      matchedTerms.push(term);
      continue;
    }

    if (text.includes(term)) {
      score += 5;
      matchedTerms.push(term);
    }
  }

  for (const concept of expandedConcepts) {
    const normalizedConcept = normalize(concept);
    if (
      normalizedConcepts.some(
        (entryConcept) =>
          entryConcept.includes(normalizedConcept) || normalizedConcept.includes(entryConcept),
      ) ||
      text.includes(normalizedConcept)
    ) {
      score += 16;
      matchedConcepts.push(concept);
    }
  }

  if (entry.kind === 'page' && score > 0) {
    score += 2;
  }

  return {
    score,
    matchedTerms: unique(matchedTerms),
    matchedConcepts: unique(matchedConcepts),
  };
}

function reasonForMatch(
  entry: AxiomPublicConceptSearchEntry,
  matchedTerms: readonly string[],
  matchedConcepts: readonly string[],
) {
  if (matchedConcepts.length > 0) {
    return `${matchedConcepts[0]}という文脈で、${entry.title}を関連情報として表示しています。`;
  }

  const term = matchedTerms[0];
  if (term) {
    return `「${term}」に近い語が、${entry.title}の説明・関連語に含まれています。`;
  }

  return `${entry.title}は、サイト全体の主要入口です。`;
}

function articleEntries(): readonly AxiomPublicConceptSearchEntry[] {
  return buildAxiomNblReportShareItems().map((item) => ({
    id: `article:${item.id}`,
    kind: 'nbl_report',
    title: item.title,
    summary: item.description,
    href: rewriteAxiomCandidateHrefToPublished(item.targetPath),
    keywords: [item.title, item.description],
    concepts: ['NBLレポート', '仕事条件', '論考'],
  }));
}

function toolkitEntries(): readonly AxiomPublicConceptSearchEntry[] {
  return buildAxiomToolkitInfographicShareItems().map((item) => ({
    id: `toolkit:${item.id}`,
    kind: 'toolkit',
    title: item.title,
    summary: item.description,
    href: rewriteAxiomCandidateHrefToPublished(item.targetPath),
    keywords: [item.title, item.description, item.imageAlt],
    concepts: ['ツールキット', '図解', '4コマ', '研修素材'],
  }));
}

export function buildAxiomPublicConceptSearchIndex(): readonly AxiomPublicConceptSearchEntry[] {
  return [...curatedEntries, ...articleEntries(), ...toolkitEntries()];
}

export function searchAxiomPublicConceptIndex(
  query: string,
  options: { limit?: number } = {},
): AxiomPublicConceptSearchResult {
  const limit = options.limit ?? 24;
  const { normalizedQuery, expandedConcepts, expandedTerms } = expandQuery(query);
  const index = buildAxiomPublicConceptSearchIndex();

  if (!normalizedQuery) {
    const matches = index.slice(0, limit).map((entry, indexPosition) => ({
      ...entry,
      score: 100 - indexPosition,
      matchedTerms: [],
      matchedConcepts: [],
      reason: reasonForMatch(entry, [], []),
    }));

    return {
      query,
      normalizedQuery,
      expandedTerms,
      expandedConcepts,
      matches,
    };
  }

  const matches = index
    .map((entry) => {
      const { score, matchedTerms, matchedConcepts } = scoreEntry(
        entry,
        expandedTerms,
        expandedConcepts,
      );

      return {
        ...entry,
        score,
        matchedTerms,
        matchedConcepts,
        reason: reasonForMatch(entry, matchedTerms, matchedConcepts),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ja'))
    .slice(0, limit);

  return {
    query,
    normalizedQuery,
    expandedTerms,
    expandedConcepts,
    matches,
  };
}

export function axiomPublicConceptSearchKindLabel(kind: AxiomPublicConceptSearchKind) {
  return kindLabels[kind];
}

export const axiomPublicConceptSearchSuggestions = [
  '難病',
  '合理的配慮',
  '通勤',
  'オープン/クローズ',
  '評価',
  '聴覚障害',
  '発達障害',
  '支援者',
  'AI要約',
] as const;
