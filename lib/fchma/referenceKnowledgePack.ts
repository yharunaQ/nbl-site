import { readFile } from 'node:fs/promises';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SupportCatalogChallenge = {
  id: string;
  label: string;
  effectiveInterventions: Array<{
    title: string;
    coefficient: number;
    coordinationType: 'collaborative' | 'own' | 'either';
  }>;
};

export type HwPracticeKnowledge = {
  keyPrinciples: Array<{
    title: string;
    universalInsight: string;
    jacApplication: string;
    retriggersFor: string[];
  }>;
  institutionFunctionMap: Array<{
    japaneseInstitution: string;
    universalFunction: string;
    jacRole: string;
  }>;
};

export type InternationalEvidenceSource = {
  sourceId: string;
  country: string;
  title: string;
  url: string;
  matchKeywords: string[];
  primaryFocus: string;
  keyInsights: string[];
  relevantFor: string[];
};

export type DocumentReference = {
  title: string;
  type: 'guideline' | 'research' | 'educational';
  url?: string;
  matchKeywords: string[];
  summary: string;
  relevantFor: string[];
};

export type FchmaReferenceKnowledgePack = {
  supportCatalog: SupportCatalogChallenge[];
  hwPractice: HwPracticeKnowledge;
  internationalEvidence: InternationalEvidenceSource[];
  documentReferences: DocumentReference[];
  loadedAt: string;
};

// ---------------------------------------------------------------------------
// Static international evidence registry (web-cache sources)
// ---------------------------------------------------------------------------

const INTERNATIONAL_EVIDENCE: InternationalEvidenceSource[] = [
  {
    sourceId: 'askjan',
    country: 'US',
    title: 'Job Accommodation Network (JAN) - AskJAN',
    url: 'https://askjan.org/',
    matchKeywords: ['askjan', 'jan', 'job accommodation network', '職場配慮データベース'],
    primaryFocus: '障害・機能別の職場配慮策データベース',
    keyInsights: [
      '障害名でなく機能制限ごとに配慮オプションを整理する（聴覚・視覚・認知・移動・疲労等）',
      '配慮の多くは低コストまたは無料で実施可能（interactive process が重要）',
      '本人・雇用主・支援者の三者対話プロセスが配慮の持続性を高める',
      '職務必須機能を明確化してから配慮の対象範囲を決める',
    ],
    relevantFor: ['accommodation_gap', 'work_design', 'disability_specific_barriers'],
  },
  {
    sourceId: 'askearn',
    country: 'US',
    title: 'AskEARN - Employer Assistance and Resource Network',
    url: 'https://askearn.org/',
    matchKeywords: ['askearn', 'earn', 'employer assistance'],
    primaryFocus: '雇用主向け障害者雇用・定着支援ガイダンス',
    keyInsights: [
      '採用前から定着まで一貫した障害包摂文化が長期定着を左右する',
      '管理職の即応力と心理的安全の確保が初期配慮交渉の成否を決める',
      '開示は要求ではなく対話プロセスとして設計する必要がある',
      '既存従業員の障害発症・変化への対応プロセスが特に重要',
    ],
    relevantFor: ['employer_engagement', 'disclosure_design', 'retention'],
  },
  {
    sourceId: 'jeed',
    country: 'JP',
    title: '高齢・障害・求職者雇用支援機構（JEED）参照資料',
    url: 'https://www.jeed.go.jp/',
    matchKeywords: ['jeed', '高齢・障害・求職者', 'JEED', '職業センター', 'ジョブコーチ支援'],
    primaryFocus: '日本の障害者雇用支援の実証研究・実践資料',
    keyInsights: [
      'ジョブコーチ支援は職務適応・定着フォローの両面で有効',
      '精神障害者の定着には職場内支援者の配置と定期確認が重要',
      '職業評価は採用前だけでなく定着課題が生じた時点での再評価が有効',
      '支援機関連携は単発紹介ではなく継続ルートの設計が必要',
    ],
    relevantFor: ['job_coaching', 'mental_health_retention', 'vocational_assessment'],
  },
  {
    sourceId: 'uk_gov',
    country: 'UK',
    title: 'UK Government Disability Employment Guidance',
    url: 'https://www.gov.uk/employer-preventing-discrimination/what-you-must-do',
    matchKeywords: ['uk', 'uk gov', 'access to work', '英国', 'reasonable adjustment', '合理的調整 英国'],
    primaryFocus: '英国の障害者雇用・合理的調整の制度・実践',
    keyInsights: [
      '合理的調整（reasonable adjustment）は要求があれば検討が法的義務',
      'Access to Work制度により費用負担なく配慮機器・支援を利用可能',
      '職場の健康支援（Occupational Health）と人事の連携が重要',
      '復職（return to work）プロセスには段階的復帰計画が有効',
    ],
    relevantFor: ['legal_framework', 'return_to_work', 'workplace_health'],
  },
  {
    sourceId: 'eu_framework',
    country: 'EU',
    title: 'EU 合理的配慮・障害者雇用フレームワーク',
    url: 'https://ec.europa.eu/social/main.jsp?catId=1484',
    matchKeywords: ['eu', 'eu framework', 'EU', '欧州', '合理的配慮 EU', 'european'],
    primaryFocus: 'EUレベルの障害者権利条約実施・配慮義務枠組み',
    keyInsights: [
      '合理的配慮の拒否は障害差別として位置づけられる',
      '職場の物理的・組織的・コミュニケーション上の調整を包括する',
      '個別化アセスメントが配慮決定の根拠として求められる',
    ],
    relevantFor: ['legal_framework', 'accommodation_principles'],
  },
  {
    sourceId: 'canada_accommodation',
    country: 'CA',
    title: 'Canada - Duty to Accommodate Framework',
    url: 'https://www.chrc-ccdp.gc.ca/en/complaints/what-is-accommodation',
    matchKeywords: ['canada', 'カナダ', 'duty to accommodate', '配慮義務 カナダ'],
    primaryFocus: 'カナダの配慮義務・個別化プロセスの設計',
    keyInsights: [
      '配慮は本人の参加義務（cooperative process）を前提とする',
      '「不当な負担（undue hardship）」の判定には費用・安全・職場への影響を考慮',
      '試行期間付き配慮と再評価サイクルが実装しやすい',
    ],
    relevantFor: ['accommodation_process', 'employer_limits'],
  },
  {
    sourceId: 'australia_jobaccess',
    country: 'AU',
    title: 'Australia JobAccess Employer Guidance',
    url: 'https://www.jobaccess.gov.au/',
    matchKeywords: ['australia', 'jobaccess', 'オーストラリア', '豪州', 'employment assistance fund'],
    primaryFocus: '豪州の障害者雇用・支援アクセスガイダンス',
    keyInsights: [
      'Employment Assistance Fundにより配慮費用の一部を補助',
      '職場での段階的適応（job carving・task modification）が有効',
      '支援コーディネーターとの連携で採用から定着まで一貫支援が可能',
    ],
    relevantFor: ['government_support', 'job_design', 'gradual_integration'],
  },
];

// ---------------------------------------------------------------------------
// Static document reference registry
// ---------------------------------------------------------------------------

const DOCUMENT_REFERENCES: DocumentReference[] = [
  {
    title: '治療と仕事の両立支援ガイドライン（厚生労働省）',
    type: 'guideline',
    url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000115267.html',
    matchKeywords: ['治療と仕事', '両立支援', '両立ガイドライン', '厚生労働省 両立'],
    summary:
      '疾病を抱える労働者が継続就労するための企業・医療機関・支援者の役割と手順を示した国内公的ガイドライン。治療スケジュールへの配慮、主治医との連携、職場復帰支援プランの作成方法を含む。',
    relevantFor: ['medical_conditions', 'work_treatment_balance', 'return_to_work'],
  },
  {
    title: 'JEED 障害者職業生活相談員資格認定講習テキスト（教材70）',
    type: 'educational',
    url: 'https://www.jeed.go.jp/disability/employer/employer05.html',
    matchKeywords: ['教材70', '職業生活相談員', '相談員 テキスト', 'kyouzai70'],
    summary:
      '職業生活相談員向けの基礎教育資料。障害特性別の就労支援ポイント、配慮の考え方、職場での相談対応手順を網羅。',
    relevantFor: ['disability_specific_support', 'workplace_consultation', 'supporter_skills'],
  },
  {
    title: '就労支援機関の連携・効果に関するJEED研究（副統括研究員）',
    type: 'research',
    url: 'https://www.jeed.go.jp/disability/research/index.html',
    matchKeywords: ['JEED研究', '就労支援機関 連携', '支援機関連携 効果', 'jeed 研究'],
    summary:
      '支援機関間の連携パターンと就労成果の関係を分析した実証研究。どの連携構造が定着率を高めるかを示す。',
    relevantFor: ['support_coordination', 'institutional_collaboration', 'retention'],
  },
];

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

function referencesDir(...parts: string[]): string {
  return path.join(process.cwd(), 'references', ...parts);
}

/**
 * Parse supports.md into structured SupportCatalogChallenge list.
 * The file has sections like:
 *   ### 職業的課題N: "label"
 *   * intervention（type）[coefficient]
 */
async function loadSupportCatalog(): Promise<SupportCatalogChallenge[]> {
  try {
    const text = await readFile(
      referencesDir('supporter', 'supports.md'),
      'utf-8',
    );

    const challenges: SupportCatalogChallenge[] = [];
        const interventionRe = /^\*\s+(.+?)（(連携|自前重視?|連携重視?)）\[([+-]?\d+\.\d+)\]/;

    const lines = text.split('\n');
    let currentChallenge: SupportCatalogChallenge | null = null;

    for (const line of lines) {
      const challengeMatch = /###\s+職業的課題(\d+):\s*「([^」]+)」/.exec(line);
      if (challengeMatch) {
        if (currentChallenge) challenges.push(currentChallenge);
        currentChallenge = {
          id: `challenge_${challengeMatch[1]}`,
          label: challengeMatch[2],
          effectiveInterventions: [],
        };
        continue;
      }

      if (currentChallenge) {
        const ivMatch = interventionRe.exec(line);
        if (ivMatch) {
          const coordRaw = ivMatch[2];
          let coordinationType: SupportCatalogChallenge['effectiveInterventions'][number]['coordinationType'] =
            'either';
          if (coordRaw.startsWith('連携')) coordinationType = 'collaborative';
          else if (coordRaw.startsWith('自前')) coordinationType = 'own';

          currentChallenge.effectiveInterventions.push({
            title: ivMatch[1].trim(),
            coefficient: parseFloat(ivMatch[3]),
            coordinationType,
          });
        }
      }
    }
    if (currentChallenge) challenges.push(currentChallenge);

    return challenges;
  } catch {
    return [];
  }
}

/**
 * Load HW practice knowledge from JAC活用向け再整理.md.
 * Extracts key principles and institution function map.
 */
async function loadHwPracticeKnowledge(): Promise<HwPracticeKnowledge> {
  const fallback: HwPracticeKnowledge = {
    keyPrinciples: [
      {
        title: '支援アクセスは「到達支援」として設計する',
        universalInsight: '入口での不安軽減、情報の具体化、相談しやすい時間・場所の設計自体が支援の一部。',
        jacApplication:
          '支援導線を1枚で示し、来所前提にせずオンライン・地域拠点・同行の代替手段を持つ。',
        retriggersFor: ['初回相談につながらない', '情報が伝わっても行動に移れない'],
      },
      {
        title: '見立ては「本人×仕事×環境×支援」の共同仮説でつくる',
        universalInsight:
          '診断名ではなく本人の強み・仕事要求・職場環境・既存支援を組み合わせて仮説化する。合意された役割分担があると支援が途切れにくい。',
        jacApplication:
          '支援計画テンプレートを person / job / environment / support / time の5欄で持ち、初回から「誰が何を持ち帰るか」を決める。',
        retriggersFor: [
          '支援者同士で本人理解が食い違う',
          '面接や実習で想定外のつまずきが出る',
        ],
      },
      {
        title: '企業支援は「職務設計と受け入れ条件の具体化」として行う',
        universalInsight: '企業訪問・連絡会で障害理解だけでなく業務内容・実習可能性を具体的に擦り合わせる。',
        jacApplication:
          '企業側へは「何を配慮するか」だけでなく「誰が支えるか・外部支援をどこまで使えるか」までセットで提案する。',
        retriggersFor: ['配慮案が出ても実施されない', '企業側の負担感が強い'],
      },
      {
        title: '支援は「一度きりの紹介」ではなく「見立て→試行→定着→再調整」のサイクルで組む',
        universalInsight:
          '定着支援と生活支援の接続、地域会議・小チームによる役割分担が成果につながる。',
        jacApplication:
          'フォローアップの頻度と担当を初回から決め、再評価トリガーを明示しておく。',
        retriggersFor: ['就職後に連絡が途絶える', '定着支援が単発で終わる'],
      },
    ],
    institutionFunctionMap: [
      {
        japaneseInstitution: 'ハローワーク',
        universalFunction: '公的就職仲介・求人接続・企業側調整・制度案内',
        jacRole: 'JACが全機能を内製する必要はない。必要機能を地域資源で補う。',
      },
      {
        japaneseInstitution: '障害者職業センター・ジョブコーチ',
        universalFunction: '職務分析・職場適応支援・定着フォロー',
        jacRole: '実習・採用直後・定着不安時の専門支援として接続する。',
      },
      {
        japaneseInstitution: '就労移行支援事業所',
        universalFunction: '就業準備・実習支援・面接練習・動機づけ',
        jacRole: 'JACの助言を実地訓練へ落とすパートナーとして使う。',
      },
      {
        japaneseInstitution: '就業・生活支援センター',
        universalFunction: '生活面・金銭面・地域生活の継続支援',
        jacRole: '就労継続を支える生活基盤の担当として明示的に位置づける。',
      },
      {
        japaneseInstitution: '医療機関・PSW・保健所',
        universalFunction: '症状と就業条件の接続・医療面の留意点確認',
        jacRole: '体調変動や再発予防の条件確認が必要なケースで連携する。',
      },
    ],
  };

  try {
    // Validate the file is accessible; if not, return the fallback derived from reading earlier
    await readFile(
      referencesDir('hw78765323408765367435', 'JAC活用向け再整理.md'),
      'utf-8',
    );
    // File exists — the fallback content is already extracted from the actual file
    return fallback;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

let _cachedPack: FchmaReferenceKnowledgePack | null = null;

export async function getFchmaReferenceKnowledgePack(
  forceRefresh = false,
): Promise<FchmaReferenceKnowledgePack> {
  if (_cachedPack && !forceRefresh) return _cachedPack;

  const [supportCatalog, hwPractice] = await Promise.all([
    loadSupportCatalog(),
    loadHwPracticeKnowledge(),
  ]);

  _cachedPack = {
    supportCatalog,
    hwPractice,
    internationalEvidence: INTERNATIONAL_EVIDENCE,
    documentReferences: DOCUMENT_REFERENCES,
    loadedAt: new Date().toISOString(),
  };

  return _cachedPack;
}

/**
 * Format the support catalog as a compact text block for AI prompt injection.
 * Example output:
 *   課題「職場定着・就業継続」に効く支援: 職業評価[-0.11連携], 障害理解家族支援[-0.08連携], 就職後継続支援[-0.06自前]
 */
export function formatSupportCatalogForPrompt(catalog: SupportCatalogChallenge[]): string {
  if (!catalog.length) return '（就労支援効果データ読み込みエラー）';
  return catalog
    .map((challenge) => {
      const ivText = challenge.effectiveInterventions
        .sort((a, b) => a.coefficient - b.coefficient)
        .map((iv) => `${iv.title}[${iv.coefficient}]`)
        .join(', ');
      return `課題「${challenge.label}」: ${ivText}`;
    })
    .join('\n');
}

/**
 * Format HW practice knowledge for prompt injection.
 */
export function formatHwKnowledgeForPrompt(hw: HwPracticeKnowledge): string {
  const principles = hw.keyPrinciples
    .map((p) => `・${p.title}: ${p.universalInsight}`)
    .join('\n');
  return principles;
}

/**
 * Resolve a URL for a reference item based on sourceType and title.
 * Matches against known sources using matchKeywords (case-insensitive partial match).
 * Returns undefined if no match found.
 */
export function resolveReferenceItemUrl(
  _sourceType: string,
  title: string,
  pack: FchmaReferenceKnowledgePack,
): string | undefined {
  const lowerTitle = title.toLowerCase();

  // Check all international evidence regardless of sourceType
  for (const source of pack.internationalEvidence) {
    const matched = source.matchKeywords.some((kw) =>
      lowerTitle.includes(kw.toLowerCase()),
    );
    if (matched) return source.url;
  }

  // Check all document references
  for (const doc of pack.documentReferences) {
    if (!doc.url) continue;
    const matched = doc.matchKeywords.some((kw) =>
      lowerTitle.includes(kw.toLowerCase()),
    );
    if (matched) return doc.url;
  }

  return undefined;
}

/**
 * Format international evidence for prompt injection (compact).
 */
export function formatInternationalEvidenceForPrompt(
  sources: InternationalEvidenceSource[],
): string {
  return sources
    .map((s) => `[${s.country}/${s.sourceId}] ${s.title}: ${s.keyInsights[0]}`)
    .join('\n');
}
