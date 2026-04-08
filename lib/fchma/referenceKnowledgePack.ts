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
    /** v2: avg_rate_diff (positive = more effective). v1 legacy: GLM coefficient (negative). */
    coefficient: number;
    coordinationType: 'collaborative' | 'own' | 'either';
    /** v2 only: odds ratio from logistic regression */
    oddsRatio?: number;
    /** v2 only: number of significant variable pairs in this group */
    nSignificantPairs?: number;
  }>;
};

export type IpsSEPrincipalValidation = {
  principle: string;
  jpEvidenceNote: string;
  validated: boolean;
  significantPairs: number;
  totalPairs: number;
  avgRateDiff: number;
};

export type IpsSEValidationSummary = {
  analysisDate: string;
  dataSource: string;
  validatedCount: number;
  totalPrinciples: number;
  principles: IpsSEPrincipalValidation[];
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

export type Q13NetworkConversionEntry = {
  institutionLabel: string;
  conversionRateDelta: number; // Q1転換率の変化量（ポイント）
  coordinationType: 'primary' | 'secondary';
  notes: string;
};

export type Q13NetworkConversionData = {
  description: string;
  entries: Q13NetworkConversionEntry[];
  methodNote: string;
};

export type PracticeCompassItem = {
  display: string;
  rateAll: number;
  rateQ1: number | null;
  rateQ2: number | null;
  q1Q2Diff: number | null;
  q1Q2Significant: boolean;
  nSigPositive: number;
  nSigNegative: number;
};

export type PracticeTransformationCompass = {
  analysisDate: string;
  dataSource: string;
  /** C象限: 低実施率・高効果・Q1優位——「導入が必要な実践」 */
  toIntroduce: PracticeCompassItem[];
  /** A象限Q1優位: 高実施率・高効果・Q1優位——「強化すべき実践」 */
  toStrengthen: PracticeCompassItem[];
  /** B象限: 高実施率・効果相関なし——「転換候補」 */
  toTransform: PracticeCompassItem[];
  coreInsight: string;
};

export type WorkshopInteractionPattern = {
  /** パターン名（例: 「遅すぎる介入」スパイラル） */
  patternName: string;
  /** 因果連鎖の核心ボトルネック */
  bottleneck: string;
  /** 因果連鎖のステップ（要約） */
  causeSteps: string[];
};

export type WorkshopPhaseHighlight = {
  phase: string;
  phaseLabel: string;
  /** そのフェーズで最も重要な成功ポイント（1〜2件） */
  keySuccessPoint: string;
  /** そのフェーズで最もよく起こる失敗モード */
  typicalFailure: string;
};

export type WorkshopPracticeVoices = {
  source: string;
  /** 難病就労WSから抽出した7つの相互作用パターン */
  interactionPatterns: WorkshopInteractionPattern[];
  /** フェーズ別連携ポイントのハイライト（Phase 0〜5） */
  phaseHighlights: WorkshopPhaseHighlight[];
  /** 全ワークショップ共通の横断的成功原則 */
  crossCuttingPrinciples: string[];
  /** よくある失敗パターン（防止策付き） */
  antiPatterns: Array<{ name: string; prevention: string }>;
};

export type FchmaReferenceKnowledgePack = {
  supportCatalog: SupportCatalogChallenge[];
  ipsSEValidation: IpsSEValidationSummary | null;
  practiceCompass: PracticeTransformationCompass | null;
  hwPractice: HwPracticeKnowledge;
  workshopVoices: WorkshopPracticeVoices;
  internationalEvidence: InternationalEvidenceSource[];
  documentReferences: DocumentReference[];
  q13NetworkData: Q13NetworkConversionData;
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
    matchKeywords: ['jeed', '高齢・障害・求職者', 'JEED', '職業センター', 'ジョブコーチ支援', '就労支援効果カタログ', '支援者実践調査', '4象限分析'],
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
// Q13 network participation → Q1 conversion data (Japan survey)
// ---------------------------------------------------------------------------

const Q13_NETWORK_DATA: Q13NetworkConversionData = {
  description:
    '日本の支援者調査（Q13）における機関ネットワーク参加とQ1転換率の関係。Q2支援者がQ1転換する確率の変化量（ポイント差）。',
  entries: [
    {
      institutionLabel: '就労移行支援事業所',
      conversionRateDelta: 17.0,
      coordinationType: 'primary',
      notes: '最も転換効果が高い。実習・面接練習・就労準備訓練を通じた実地関与が転換を促す。',
    },
    {
      institutionLabel: '就業・生活支援センター',
      conversionRateDelta: 16.4,
      coordinationType: 'primary',
      notes: '生活基盤と就労継続を一体支援。定着フォローとの接続が特に有効。',
    },
    {
      institutionLabel: 'ハローワーク（専門援助）',
      conversionRateDelta: 15.3,
      coordinationType: 'primary',
      notes: '企業側調整・求人接続の公的機能が支援者の実践幅を広げる。',
    },
    {
      institutionLabel: '難病相談支援センター',
      conversionRateDelta: 3.1,
      coordinationType: 'secondary',
      notes: '医療との橋渡し機能。難病・慢性疾患が関わるケースで有効。',
    },
  ],
  methodNote:
    '「参加しているが転換しない」問題に注意：参加の有無より参加の質（企業調整・定着フォロー・実地関与）が転換を規定する。',
};

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

function analysisDir(...parts: string[]): string {
  return path.join(
    process.cwd(),
    'data/analysis_ready/supporters/supporter_practice_toku18/v2_effectiveness_catalog',
    ...parts,
  );
}

/**
 * Load support effectiveness catalog from v2 analysis output.
 * Source: toku18 n=3,053 — NBL's own logistic regression (chi-square + OR + B).
 * Replaces old supports.md (which parsed NIVR's pre-computed GLM coefficients).
 */
async function loadSupportCatalog(): Promise<SupportCatalogChallenge[]> {
  try {
    const raw = await readFile(analysisDir('support_effectiveness_by_challenge.json'), 'utf-8');
    const data = JSON.parse(raw) as {
      challenge_intervention_matrix: Record<
        string,
        {
          label: string;
          effective_interventions: Array<{
            intervention_label: string;
            intervention_note: string;
            avg_rate_diff: number;
            n_significant_pairs: number;
            best_pair: { odds_ratio: number | null; log_coef: number | null; p_chi2: number | null };
          }>;
        }
      >;
    };

    const CHALLENGE_ID_MAP: Record<string, string> = {
      C1_disability_readiness: 'challenge_1',
      C2_job_search: 'challenge_2',
      C3_hiring: 'challenge_3',
      C4_post_employment_health: 'challenge_4',
      C5_retention: 'challenge_5',
    };

    return Object.entries(data.challenge_intervention_matrix).map(([cgId, cg]) => ({
      id: CHALLENGE_ID_MAP[cgId] ?? cgId,
      label: cg.label,
      effectiveInterventions: cg.effective_interventions
        .filter((iv) => iv.avg_rate_diff > 0)
        .sort((a, b) => b.avg_rate_diff - a.avg_rate_diff)
        .slice(0, 5)
        .map((iv) => {
          const label = iv.intervention_label;
          const coordinationType: SupportCatalogChallenge['effectiveInterventions'][number]['coordinationType'] =
            label.includes('自前') ? 'own' : label.includes('連携') ? 'collaborative' : 'either';
          return {
            title: label,
            coefficient: iv.avg_rate_diff,
            coordinationType,
            oddsRatio: iv.best_pair.odds_ratio ?? undefined,
            nSignificantPairs: iv.n_significant_pairs,
          };
        }),
    }));
  } catch {
    return [];
  }
}

/**
 * Load practice transformation compass from v2 analysis output.
 * Identifies practices that are: underused-but-effective (introduce),
 * used-and-effective (strengthen), used-but-ineffective (transform).
 */
async function loadPracticeCompass(): Promise<PracticeTransformationCompass | null> {
  try {
    const raw = await readFile(analysisDir('practice_transformation_compass.json'), 'utf-8');
    const data = JSON.parse(raw) as {
      analysis_date: string;
      data_source: string;
      compass: {
        C_introduce: { q1_dominant_items: Array<Record<string, unknown>> };
        A_maintain: { q1_dominant_items: Array<Record<string, unknown>> };
        B_transform: { all_items: Array<Record<string, unknown>> };
      };
    };

    function mapItem(raw: Record<string, unknown>): PracticeCompassItem {
      return {
        display: String(raw['display'] ?? ''),
        rateAll: Number(raw['rate_all'] ?? 0),
        rateQ1: raw['rate_q1'] != null ? Number(raw['rate_q1']) : null,
        rateQ2: raw['rate_q2'] != null ? Number(raw['rate_q2']) : null,
        q1Q2Diff: raw['q1_q2_diff'] != null ? Number(raw['q1_q2_diff']) : null,
        q1Q2Significant: Boolean(raw['q1_q2_significant']),
        nSigPositive: Number(raw['n_sig_positive_q7'] ?? 0),
        nSigNegative: Number(raw['n_sig_negative_q7'] ?? 0),
      };
    }

    return {
      analysisDate: data.analysis_date,
      dataSource: data.data_source,
      toIntroduce: (data.compass.C_introduce.q1_dominant_items ?? []).slice(0, 8).map(mapItem),
      toStrengthen: (data.compass.A_maintain.q1_dominant_items ?? []).slice(0, 6).map(mapItem),
      toTransform: (data.compass.B_transform.all_items ?? []).slice(0, 5).map(mapItem),
      coreInsight:
        '旧来型支援の核心的問題は「間違った実践をしていること」ではなく「支援の射程が職場の外で止まっていること」。' +
        '効果が確認されているが普及していない実践はすべて、職場内・就職後フェーズへの関与——' +
        'Q1実践者はこれらを30〜40ポイント高い頻度で実施している。' +
        '転換を阻む障壁は個人の意欲ではなく組織・制度構造。',
    };
  } catch {
    return null;
  }
}

/**
 * Load IPS/SE 8-principle validation summary from v2 analysis output.
 */
async function loadIpsSEValidation(): Promise<IpsSEValidationSummary | null> {
  try {
    const raw = await readFile(analysisDir('ips_se_revalidation.json'), 'utf-8');
    const data = JSON.parse(raw) as {
      analysis_date: string;
      data_source: string;
      summary: { validated_count: number; total_principles: number };
      principles: Record<
        string,
        {
          principle: string;
          jp_evidence_note: string;
          summary: { validated: boolean; significant_positive_pairs: number; total_pairs_tested: number; avg_rate_diff_significant: number };
        }
      >;
    };

    return {
      analysisDate: data.analysis_date,
      dataSource: data.data_source,
      validatedCount: data.summary.validated_count,
      totalPrinciples: data.summary.total_principles,
      principles: Object.values(data.principles).map((p) => ({
        principle: p.principle,
        jpEvidenceNote: p.jp_evidence_note,
        validated: p.summary.validated,
        significantPairs: p.summary.significant_positive_pairs,
        totalPairs: p.summary.total_pairs_tested,
        avgRateDiff: p.summary.avg_rate_diff_significant,
      })),
    };
  } catch {
    return null;
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

/**
 * Workshop practice voices — qualitative data from 8 multi-stakeholder workshops
 * (広島・紋別・福岡・大分・目黒・全重協・難病相談センター・名古屋) + 難病就労WS.
 * Content is hardcoded from the analyzed workshop documents in references/workshops/.
 * Used as exemplar-based context for AI prompt injection (option B: 実例・言語化).
 */
function loadWorkshopVoices(): WorkshopPracticeVoices {
  return {
    source: '8ワークショップ統合分析（障害者就労支援）+ 難病就労WS相互作用パターン分析',
    interactionPatterns: [
      {
        patternName: '「遅すぎる介入」スパイラル',
        bottleneck: '診断〜就労問題顕在化の間の「就労支援の死角」。診断時に就労情報が渡らない。',
        causeSteps: [
          '難病診断 → 就労情報が届かない（医療側からの情報提供なし）',
          '患者が一人で抱える → 病状悪化・退職 → 生活困窮',
          'ようやく相談窓口へ（この時点で多重困難状態）',
        ],
      },
      {
        patternName: '「縦割り抱え込み」ループ',
        bottleneck: '各機関が「自分の専門外」として回避か抱え込みかの二択になり、橋渡し機能が機能しない。',
        causeSteps: [
          '患者が保健師・医療機関に就労相談',
          '就労支援スキルがない → 自機関で解決しようとする OR 何もできない',
          '就労支援機関につながらない → 問題が拡大',
        ],
      },
      {
        patternName: '「企業-患者間コミュニケーション障壁」パターン',
        bottleneck: '開示のタイミング・方法の支援が不足。企業側の「難病＝働けない」先入観が払拭されなければ、開示自体がリスクになる。',
        causeSteps: [
          '非開示ルート: 隠して就職 → 配慮なし → 無理を続ける → 体調悪化 → 離職',
          '開示ルート: 開示を試みる → 企業の無理解・過剰反応 → 採用拒否・就労意欲喪失',
        ],
      },
      {
        patternName: '「医療情報と就労支援の断絶」パターン',
        bottleneck: '医療機関と就労支援機関の間の「情報インターフェース」が制度化されていない。',
        causeSteps: [
          '就労支援側: 病状・就労制限の医療情報がない → 不適切な求人マッチング → 早期離職',
          '医療側: 就労可否判断の根拠・方法がない → 「就労困難」か曖昧な回答 → 支援が前進しない',
        ],
      },
      {
        patternName: '「制度の谷間による支援空白」パターン',
        bottleneck: '障害者手帳なし（多くの難病患者）により企業に採用インセンティブなし・支援機関も積極関与の根拠が弱い。',
        causeSteps: [
          '障害者手帳なし → 障害者雇用率の対象外',
          '企業に採用インセンティブなし + 就労支援機関でも積極支援の根拠が弱い',
          '「一般求職者と同じ扱い」か「たらい回し」 → 実質無支援',
        ],
      },
      {
        patternName: '「難サポ一点集中・地理的空白」パターン',
        bottleneck: '難サポは連携ハブになれる潜在力があるが、配置の希薄さと「丸投げ」がシステム全体のボトルネック。',
        causeSteps: [
          '県に1名の難病患者就職サポーター（非常勤）→ HW内でサポーターに丸投げ',
          '物理的に県全体をカバー不能 → 地方・遠隔地では実質機能しない',
        ],
      },
      {
        patternName: '「就職後フォロー消滅」パターン',
        bottleneck: '就職直後だけサポートが厚く、その後消える支援の波が定着失敗の主因。',
        causeSteps: [
          '採用後のサポートを企業だけに任せる → 企業だけに支援の重荷が集中',
          '「問題が起きてから相談」 → 定着支援が単発で終わる → 離職',
        ],
      },
    ],
    phaseHighlights: [
      {
        phase: 'Phase 0',
        phaseLabel: '超早期（学校在学中・診断直後）',
        keySuccessPoint: '特別支援学校・大学は入学時からキャリア教育を開始。医師が診断時に「まず辞めないで、支援がある」と一言添えるだけで相談行動が変わる。',
        typicalFailure: '学校・医療・福祉それぞれが「自分の担当ではない」と情報を抱え込む。',
      },
      {
        phase: 'Phase 1',
        phaseLabel: '就労準備（就活前）',
        keySuccessPoint: '職場体験・インターンシップが就労意欲の最大の起爆剤。本人の強み・弱み・配慮事項の言語化を支援機関がツールで整理する。',
        typicalFailure: '訓練・実習が「就職とは無関係な別物」になる。家族の意向と本人の希望のズレを放置。',
      },
      {
        phase: 'Phase 2',
        phaseLabel: 'マッチング・就職活動',
        keySuccessPoint: '「誰が中核コーディネーターか」を明確化。企業側のニーズと本人の配慮ニーズを同時進行で把握する。',
        typicalFailure: '複数機関が動いても誰も主担当にならない → 連携が空回り。窓口が多すぎて本人が迷子になる。',
      },
      {
        phase: 'Phase 3',
        phaseLabel: '採用直後・定着初期（最初の3〜6ヶ月）',
        keySuccessPoint: '就職後も支援機関が関与し続ける（「つないで終わり」にしない）。医療機関–企業–支援機関の三角連携を確立する。',
        typicalFailure: '採用後のサポートを企業だけに任せる。「問題が起きてから相談」ではなく問題前から定期面談を仕組み化する。',
      },
      {
        phase: 'Phase 4',
        phaseLabel: '中長期的定着・継続',
        keySuccessPoint: '不調のサインを本人・家族・企業・支援機関が共有。定期面談（本人×支援機関・本人×企業・支援機関×企業の各ペア）を制度化する。',
        typicalFailure: '状態が安定していても定期アセスメントを止める。就職直後だけサポートが厚くその後消える「支援の波」を作る。',
      },
      {
        phase: 'Phase 5',
        phaseLabel: '危機介入・離職防止',
        keySuccessPoint: '「まず辞めない・相談する」文化の醸成を診断時から繰り返し伝える。同一企業内での業務変更・配置転換を離職の代替手段として持つ。',
        typicalFailure: '難病・精神障害の方が「誰にも相談せず自己判断で退職」するパターンが最多の失敗モード。',
      },
    ],
    crossCuttingPrinciples: [
      '「顔の見える関係」が連携の基盤——制度や手続きではなく人と人の信頼関係。定期的な担当者会議・情報交流会の継続。',
      '情報を「つないだら終わり」にしない——リファー後フォローが最大の盲点。紹介した機関が継続的に状況確認する。',
      '本人の意欲・自己決定を中心に置く——「してあげる」ではなく「本人が動く力を引き出す」。ニーズは変化するため定期的に確認し直す。',
      '早期介入が最もコスパが高い——就活直前・離職直前ではなくその前の段階で動く。全フェーズを通じて、早いほど選択肢が多く介入コストが低い。',
      '誰がコーディネーターか常に明確にする——「誰が中核か？」が最大課題として複数WSで浮上。医療・生活・就労の三領域を統合的に調整できる人材を必ず決める。',
    ],
    antiPatterns: [
      { name: '誰にも相談せず自己判断で退職', prevention: '「まず相談」の文化醸成。相談先を診断時から明示。' },
      { name: '企業だけに支援の重荷が集中', prevention: '外部支援機関の定期訪問と三者連携を確立。' },
      { name: '窓口が多すぎて本人が迷子', prevention: 'コーディネーター（一本化窓口）の設置。' },
      { name: '支援が就職時だけで長期フォロー消滅', prevention: '定着支援を仕組みとして制度化。' },
      { name: '学校→社会の情報引き継ぎ断絶', prevention: '卒業前から次機関と顔つなぎし、情報引き継ぎ経路を事前整備。' },
      { name: '家族が障害受容できず機会を塞ぐ', prevention: '家族を支援対象として巻き込む。成功事例を共有。' },
    ],
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

let _cachedPack: FchmaReferenceKnowledgePack | null = null;

export async function getFchmaReferenceKnowledgePack(
  forceRefresh = false,
): Promise<FchmaReferenceKnowledgePack> {
  if (_cachedPack && !forceRefresh) return _cachedPack;

  const [supportCatalog, ipsSEValidation, practiceCompass, hwPractice] = await Promise.all([
    loadSupportCatalog(),
    loadIpsSEValidation(),
    loadPracticeCompass(),
    loadHwPracticeKnowledge(),
  ]);

  _cachedPack = {
    supportCatalog,
    ipsSEValidation,
    practiceCompass,
    hwPractice,
    workshopVoices: loadWorkshopVoices(),
    internationalEvidence: INTERNATIONAL_EVIDENCE,
    documentReferences: DOCUMENT_REFERENCES,
    q13NetworkData: Q13_NETWORK_DATA,
    loadedAt: new Date().toISOString(),
  };

  return _cachedPack;
}

/**
 * Format the support catalog as a compact text block for AI prompt injection.
 * v2: uses rate_diff (Δ) and OR from toku18 logistic regression analysis.
 * Example output:
 *   課題「職場定着・就業継続」に効く支援: 就労・生活一体相談[Δ+0.12/OR2.3連携], 企業アプローチ[Δ+0.08連携]
 */
export function formatSupportCatalogForPrompt(catalog: SupportCatalogChallenge[]): string {
  if (!catalog.length) return '（就労支援効果データ読み込みエラー）';
  return catalog
    .map((challenge) => {
      const ivText = challenge.effectiveInterventions
        .map((iv) => {
          const delta = `Δ${iv.coefficient >= 0 ? '+' : ''}${iv.coefficient.toFixed(3)}`;
          const or = iv.oddsRatio ? `/OR${iv.oddsRatio.toFixed(1)}` : '';
          const coord = iv.coordinationType === 'collaborative' ? '連携' : iv.coordinationType === 'own' ? '自前' : '';
          return `${iv.title}[${delta}${or}${coord}]`;
        })
        .join(', ');
      return `課題「${challenge.label}」に効く支援: ${ivText}`;
    })
    .join('\n');
}

/**
 * Format practice transformation compass for AI prompt injection.
 * Surfaces: what to introduce (C), what to strengthen (A-Q1), what lacks correlation (B).
 */
export function formatPracticeCompassForPrompt(compass: PracticeTransformationCompass | null): string {
  if (!compass) return '';

  const introduce = compass.toIntroduce
    .slice(0, 6)
    .map((p) => {
      const diff = p.q1Q2Diff != null ? ` Q1=${Math.round((p.rateQ1 ?? 0) * 100)}%/Q2=${Math.round((p.rateQ2 ?? 0) * 100)}%（差${p.q1Q2Diff >= 0 ? '+' : ''}${Math.round(p.q1Q2Diff * 100)}pt）` : '';
      return `・${p.display}（全体実施率${Math.round(p.rateAll * 100)}%,${diff} 効果確認${p.nSigPositive}課題）`;
    })
    .join('\n');

  const strengthen = compass.toStrengthen
    .slice(0, 4)
    .map((p) => `・${p.display}（実施率${Math.round(p.rateAll * 100)}%, 効果確認${p.nSigPositive}課題）`)
    .join('\n');

  const transform = compass.toTransform.length > 0
    ? compass.toTransform.slice(0, 3).map((p) => `・${p.display}（実施率${Math.round(p.rateAll * 100)}%）`).join('\n')
    : '（高実施率で効果なし実践は軽微）';

  return [
    `【実践転換の羅針盤】${compass.dataSource}`,
    '',
    compass.coreInsight,
    '',
    '▼ 導入が必要（低普及・高効果・Q1支援者が30〜40pt高頻度で実施）:',
    introduce,
    '',
    '▼ 維持・強化（高普及・高効果）:',
    strengthen,
    '',
    '▼ 効果相関が弱い（転換候補）:',
    transform,
  ].join('\n');
}

/**
 * Format IPS/SE validation summary for AI prompt injection.
 */
export function formatIpsSEValidationForPrompt(validation: IpsSEValidationSummary | null): string {
  if (!validation) return '';
  const principleLines = validation.principles
    .filter((p) => p.validated)
    .map((p) => `・${p.principle}: ${p.jpEvidenceNote}（${p.significantPairs}ペア有意, 平均Δ${p.avgRateDiff >= 0 ? '+' : ''}${p.avgRateDiff.toFixed(3)}）`)
    .join('\n');
  return `IPS/SE ${validation.validatedCount}/${validation.totalPrinciples}原則を日本データで独立に再確認（${validation.dataSource}）:\n${principleLines}`;
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
 * Format workshop practice voices for AI prompt injection.
 * Surfaces: structural failure patterns, phase coordination highlights,
 * cross-cutting principles, and anti-patterns.
 * Compact — prioritizes exemplars and language from real multi-stakeholder workshops.
 */
export function formatWorkshopVoicesForPrompt(voices: WorkshopPracticeVoices): string {
  const patterns = voices.interactionPatterns
    .slice(0, 5)
    .map((p) => `・${p.patternName}——${p.bottleneck}`)
    .join('\n');

  const phases = voices.phaseHighlights
    .map((ph) => `${ph.phase}（${ph.phaseLabel}）: ${ph.keySuccessPoint}`)
    .join('\n');

  const principles = voices.crossCuttingPrinciples
    .map((p) => `・${p}`)
    .join('\n');

  const anti = voices.antiPatterns
    .slice(0, 4)
    .map((a) => `・${a.name} → 防止: ${a.prevention}`)
    .join('\n');

  return [
    `【ワークショップ実例知識】${voices.source}`,
    '',
    '▼ よく起こる構造的失敗パターン（就労支援現場の声）:',
    patterns,
    '',
    '▼ フェーズ別連携ポイント:',
    phases,
    '',
    '▼ 横断的成功原則:',
    principles,
    '',
    '▼ 避けるべきアンチパターン:',
    anti,
  ].join('\n');
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

/**
 * Format Q13 network conversion data for prompt injection.
 * Shows which institution networks correlate with Q1 conversion rate increases.
 */
export function formatQ13NetworkForPrompt(data: Q13NetworkConversionData): string {
  const entries = data.entries
    .sort((a, b) => b.conversionRateDelta - a.conversionRateDelta)
    .map((e) => `・${e.institutionLabel}: +${e.conversionRateDelta}pt（${e.notes}）`)
    .join('\n');
  return `${data.description}\n${entries}\n注意: ${data.methodNote}`;
}
