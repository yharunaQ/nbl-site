import { AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE } from './falconAxiomPublicSiteUpdatePlan';

export const AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_VERSION = 'v0_2026_06_24' as const;

export const AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_BOUNDARY =
  'axiom_next_nbl_public_candidate_final_qa_is_internal_visual_copy_boundary_check_not_public_approval_publication_runtime_or_learning_update' as const;

export type AxiomNextNblFinalQaStatus =
  | 'code_contract_passed_visual_human_check_needed'
  | 'code_contract_passed_copy_boundary_check_needed'
  | 'ready_for_founder_visual_review_after_qa';

export type AxiomNextNblFinalQaPageSlug =
  | 'home'
  | 'scene-entry'
  | 'case-readings'
  | 'work-design-views-guide'
  | 'articles-social-questions'
  | 'toolkit-studio'
  | 'work-condition-window'
  | 'theory-method-trust'
  | 'about-boundary';

export type AxiomNextNblVisualQaAssetKind =
  | 'hero'
  | 'issue_map'
  | 'comic'
  | 'guide_premise'
  | 'guide_situation'
  | 'guide_design_items'
  | 'report_infographic'
  | 'toolkit_shelf';

export type AxiomNextNblVisualQaMatrixItem = {
  qaId: string;
  pageSlug: AxiomNextNblFinalQaPageSlug;
  pagePath: string;
  assetKind: AxiomNextNblVisualQaAssetKind;
  imageSrc: string;
  imageAlt: string;
  surroundingCopyJa: string;
  intendedReaderUnderstandingJa: string;
  status: AxiomNextNblFinalQaStatus;
  humanVisualCheckJa: readonly string[];
};

export type AxiomNextNblPublicLanguageRiskTerm = {
  term: string;
  readerRiskJa: string;
  replacementPrincipleJa: string;
  status: 'blocked_in_reader_copy' | 'allowed_only_in_internal_candidate_chrome';
};

export type AxiomNextNblPublicCandidateFinalQaRun = {
  runId: string;
  objectType: 'axiom_next_nbl_public_candidate_final_qa_run';
  version: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_VERSION;
  lane: 'Falcon Lab';
  status: 'internal_final_qa_contract_ready_not_public_approval';
  boundary: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_BOUNDARY;
  candidateRouteBase: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE;
  visualQaMatrix: readonly AxiomNextNblVisualQaMatrixItem[];
  publicLanguageRiskTerms: readonly AxiomNextNblPublicLanguageRiskTerm[];
  pageCoverage: readonly AxiomNextNblFinalQaPageSlug[];
  qaConclusionsJa: readonly string[];
  notNow: readonly string[];
};

export type AxiomNextNblPublicCandidateFinalQaValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_next_nbl_public_candidate_final_qa_valid'
    | 'axiom_next_nbl_public_candidate_final_qa_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_BOUNDARY;
};

const route = (slug: AxiomNextNblFinalQaPageSlug) =>
  `${AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE}/${slug}`;

export const AXIOM_NEXT_NBL_FINAL_QA_PAGE_SLUGS: readonly AxiomNextNblFinalQaPageSlug[] = [
  'home',
  'scene-entry',
  'case-readings',
  'work-design-views-guide',
  'articles-social-questions',
  'toolkit-studio',
  'work-condition-window',
  'theory-method-trust',
  'about-boundary',
] as const;

export const AXIOM_NEXT_NBL_PUBLIC_LANGUAGE_RISK_TERMS: readonly AxiomNextNblPublicLanguageRiskTerm[] =
  [
    {
      term: 'Axiom',
      readerRiskJa: '開発コードネームが漏れると、公開ページではなく内部説明に見える。',
      replacementPrincipleJa:
        '読者向けには「NBL」「このサイト」「専門知識ネットワーク」などの公開語へ置換する。',
      status: 'blocked_in_reader_copy',
    },
    {
      term: 'kernel',
      readerRiskJa: '中核技術の説明になり、読者の課題解決から遠ざかる。',
      replacementPrincipleJa: '「読み方の専門性」「仕事・参加設計の知識」へ翻訳する。',
      status: 'blocked_in_reader_copy',
    },
    {
      term: 'runtime',
      readerRiskJa: 'システム実装や運用内部の話に見える。',
      replacementPrincipleJa:
        '公開面では原則出さず、必要なら「公開運用」「個別相談機能は当面使わない」と言う。',
      status: 'blocked_in_reader_copy',
    },
    {
      term: 'publication',
      readerRiskJa: '公開承認プロセスの内部語に見える。',
      replacementPrincipleJa:
        '内部候補表示以外では「公開」「掲載」「共有」など文脈に合う日本語を使う。',
      status: 'allowed_only_in_internal_candidate_chrome',
    },
    {
      term: 'source lens',
      readerRiskJa: '情報源の偏り確認という重要内容が、技術用語で伝わらない。',
      replacementPrincipleJa: '「どの立場・時代・制度から出た情報かを見る」と説明する。',
      status: 'blocked_in_reader_copy',
    },
    {
      term: 'missing context',
      readerRiskJa: '専門用語として見え、相談者に突き放す印象を与える。',
      replacementPrincipleJa: '「まだ一緒に確認したいこと」「まだ分からない条件」と言う。',
      status: 'blocked_in_reader_copy',
    },
    {
      term: 'Founder',
      readerRiskJa: '開発体制の内部レビュー語として見える。',
      replacementPrincipleJa: '公開面では「運営責任者」「人間による確認」など役割名にする。',
      status: 'blocked_in_reader_copy',
    },
  ] as const;

const commonHumanVisualCheck = [
  '画像内の日本語が読者に自然な日本語として読めるか。',
  '画像の中心メッセージが直前直後の本文と一致しているか。',
  'altだけを読んでも、画像が伝えたい仕事条件の論点が分かるか。',
] as const;

export const AXIOM_NEXT_NBL_VISUAL_QA_MATRIX: readonly AxiomNextNblVisualQaMatrixItem[] = [
  {
    qaId: 'visual_qa_home_hero',
    pageSlug: 'home',
    pagePath: route('home'),
    assetKind: 'hero',
    imageSrc: '/images/nbl-home-hero-candidates/next-nbl-home-hero-diverse-manifold-image2-v2.png',
    imageAlt:
      '明るい場で多様な人々の仕事、生活、移動、支援の関係がAI時代のmanifoldとして重なって見えるビジュアル',
    surroundingCopyJa: '障害者雇用・難病就労支援から、AI時代の仕事設計へ。',
    intendedReaderUnderstandingJa:
      'トップの主画像で、NBLが抽象的なAIサービスではなく、人間の生活、仕事、支援、移動、参加の関係を明るく読み直す知識ネットワークであることをつかめる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  {
    qaId: 'visual_qa_scene_issue_map',
    pageSlug: 'scene-entry',
    pagePath: route('scene-entry'),
    assetKind: 'issue_map',
    imageSrc: '/images/axiom-scene-comics/axiom-scene-old-new-issue-map-v2.png',
    imageAlt:
      '見える数字、名前、健康時間、情報分断、制度、上司依存、検索SNSAI、学びの循環という8つの古くて新しい課題を仕事条件の地図へつなぐ図',
    surroundingCopyJa: '昔から言われてきたのに解けなかった課題を、仕事条件の地図へ戻す。',
    intendedReaderUnderstandingJa:
      '8課題が普通の現場あるあるではなく、NBLが挑む「古くて新しい課題」の全体像として見える。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  ...[
    [
      'visible_participation',
      '見える数字と、見えにくい参加',
      '/images/axiom-scene-comics/axiom-scene-old-new-visible-participation-v1.png',
      '雇用率の数字から役割、評価、成長、健康時間、相談線を含む参加の質へ読み替える4コマ',
    ],
    [
      'name_stops',
      '名前で止まる',
      '/images/axiom-scene-comics/axiom-scene-old-new-name-stops-v1.png',
      '診断名を入口にしつつ、同じ名前でも通勤、仕事量、情報形式、評価、支援条件が異なることを示す4コマ',
    ],
    [
      'health_time',
      '健康時間',
      '/images/axiom-scene-comics/axiom-scene-old-new-health-time-v1.png',
      '通院、治療、回復、仕事量、評価タイミングを同じ週の勤務表へ翻訳する4コマ',
    ],
    [
      'information_fragmentation',
      '情報の分断',
      '/images/axiom-scene-comics/axiom-scene-old-new-information-fragmentation-v1.png',
      '本人、企業、医療、福祉、行政の情報を同じ仕事条件の共有マップにする4コマ',
    ],
    [
      'policy_to_practice',
      '制度から現場へ',
      '/images/axiom-scene-comics/axiom-scene-old-new-policy-to-practice-v1.png',
      '合理的配慮や制度語を作業、手順、情報、環境、支援、評価へ翻訳する4コマ',
    ],
    [
      'manager_dependence',
      '上司依存',
      '/images/axiom-scene-comics/axiom-scene-old-new-manager-dependence-v1.png',
      '理解ある上司の個別対応を、誰が代わっても見直せる仕事設計へ変える4コマ',
    ],
    [
      'search_ai_limits',
      '検索・SNS・AI要約の限界',
      '/images/axiom-scene-comics/axiom-scene-old-new-search-ai-limits-v1.png',
      '検索、SNS、AI要約を答えにせず、偏り、情報の身元、足りない確認を分けて現場の問いへ戻す4コマ',
    ],
    [
      'learning_loop',
      '学びが育たない',
      '/images/axiom-scene-comics/axiom-scene-old-new-learning-loop-v1.png',
      '相談、研修、会議、政策で生まれた誤読、沈黙、質問を記事、図解、相談事例、仕事設計、研修ワークへ循環させる4コマ',
    ],
  ].map(
    ([id, title, imageSrc, imageAlt]): AxiomNextNblVisualQaMatrixItem => ({
      qaId: `visual_qa_scene_comic_${id}`,
      pageSlug: 'scene-entry',
      pagePath: route('scene-entry'),
      assetKind: 'comic',
      imageSrc,
      imageAlt,
      surroundingCopyJa: `${title}を、認知負荷の高い構造問題として4コマで見る。`,
      intendedReaderUnderstandingJa:
        '4コマを見ただけで、見えやすい入口から仕事条件へ読み替える必要が分かる。',
      status: 'code_contract_passed_visual_human_check_needed',
      humanVisualCheckJa: commonHumanVisualCheck,
    }),
  ),
  {
    qaId: 'visual_qa_case_readings_hero',
    pageSlug: 'case-readings',
    pagePath: route('case-readings'),
    assetKind: 'hero',
    imageSrc: '/images/next-nbl-consultation-assessment-loop-hero-v1.png',
    imageAlt:
      '相談の一言を受け止め、条件を一緒に確認し、仕事・環境・支援・時間・評価を見ながら支援計画を組み直す対話型アセスメントの循環図',
    surroundingCopyJa:
      '相談の一言をつぶさず、仕事条件の設計につないでいくコミュニケーションとして読む。',
    intendedReaderUnderstandingJa:
      'このページは答え表ではなく、相談を一緒にほどくアセスメントのデモだと分かる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  {
    qaId: 'visual_qa_work_design_hero',
    pageSlug: 'work-design-views-guide',
    pagePath: route('work-design-views-guide'),
    assetKind: 'hero',
    imageSrc: '/images/axiom-work-design-guide/work-social-participation-hero-v1.png',
    imageAlt:
      '未来の仕事・社会参加設計ガイド。仕事、生活、健康、職場アクセス、評価と成長、支援と制度をつなぐ水彩調の関係地図。',
    surroundingCopyJa:
      '障害者雇用や難病就労支援で見えてきた課題を、人間の多様性を前提にした仕事と社会参加の設計図へ広げる。',
    intendedReaderUnderstandingJa:
      '障害者雇用の知見が、マイノリティ対応ではなく、これからの仕事・社会参加設計の普遍的な知見として見える。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  {
    qaId: 'visual_qa_work_design_premise_map',
    pageSlug: 'work-design-views-guide',
    pagePath: route('work-design-views-guide'),
    assetKind: 'guide_premise',
    imageSrc: '/images/axiom-work-design-guide/work-design-premise-map-v1.png',
    imageAlt:
      '狭い標準像から多様性を前提にした仕事・社会参加設計へ読み替える図。障害・難病就労で見えてきた無理を、健康時間、情報形式、移動、支援、評価の仕事条件として整理する。',
    surroundingCopyJa:
      '多くの人の生きづらさ・働きづらさは、狭い標準的職業人像への押し込みとしても読める。',
    intendedReaderUnderstandingJa:
      '障害や病気への対応で見えた知見を、誰もが活躍できる仕事・参加設計へ広げるページだと分かる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  ...[
    [
      'health_time',
      '/images/axiom-work-design-guide/health-time-design-card-v1.png',
      '健康時間を設計する。破綻・停止、高頻度支障、要調整、安定・予防の4つの状況レベルを示す図解カード。',
      '/images/axiom-work-design-guide/health-time-items-board-v1.png',
      '具体設計項目、健康時間。変動・再燃・疲労、回復余地・戻り方、通勤・移動の消耗、収入・評価との衝突を示す図解ボード。',
      '健康時間を設計する',
    ],
    [
      'treatment_time',
      '/images/axiom-work-design-guide/treatment-time-design-card-v1.png',
      '治療・検診時間を設計する。治療か仕事かの二択から、勤務表に健康時間を置く状態までを示す図解カード。',
      '/images/axiom-work-design-guide/treatment-time-items-board-v1.png',
      '具体設計項目、治療・検診時間。透析・固定治療時間、定期検診・継続管理、内部障害・身体管理を示す図解ボード。',
      '治療・検診時間を設計する',
    ],
    [
      'information_access',
      '/images/axiom-work-design-guide/information-access-design-card-v1.png',
      '情報形式を設計する。会議や連絡から外れる状態から、同じ流れを見ながら話せる状態までを示す図解カード。',
      '/images/axiom-work-design-guide/information-access-items-board-v1.png',
      '具体設計項目、情報形式。視覚情報・文書形式、聴覚・音声・会議進行、身体操作・道具操作、緊急連絡・非公式情報を示す図解ボード。',
      '情報形式を設計する',
    ],
    [
      'procedure_switching',
      '/images/axiom-work-design-guide/procedure-switching-design-card-v1.png',
      '手順と戻り方を設計する。開始・切替・完了で詰まる状態から、失敗しても仕事に戻れる状態までを示す図解カード。',
      '/images/axiom-work-design-guide/procedure-switching-items-board-v1.png',
      '具体設計項目、手順と切替。指示・手順・説明形式、切替・優先順位・例外対応、記憶・確認・ミス許容度、暗黙ルール・評価基準を示す図解ボード。',
      '手順と戻り方を設計する',
    ],
    [
      'pre_entry_transition',
      '/images/axiom-work-design-guide/pre-entry-transition-design-card-v1.png',
      '就職前から仕事像を設計する。求人語が壁になる状態から、体験を採用後へつなぐ状態までを示す図解カード。',
      '/images/axiom-work-design-guide/pre-entry-transition-items-board-v1.png',
      '具体設計項目、就職前・移行。非就労・未就業層の仕事像、応募前の条件言語化、訓練・職場体験・試行機会、家族・学校・支援から職場へを示す図解ボード。',
      '就職前から仕事像を設計する',
    ],
    [
      'worksite_access',
      '/images/axiom-work-design-guide/worksite-access-design-card-v1.png',
      '職場アクセスを設計する。情報、動線、道具、安全を仕事の接点として整える4つの状況レベル図解カード。',
      '/images/axiom-work-design-guide/worksite-contact-items-board-v1.png',
      '具体設計項目、職場接触点。作業分解・仕事密度、道具・設備・環境、職場内外の移動、安全・ミス許容度、人員余力・顧客接点、評価・役割・フィードバックを示す図解ボード。',
      '職場アクセスを設計する',
    ],
    [
      'disclosure_evaluation',
      '/images/axiom-work-design-guide/disclosure-evaluation-design-card-v1.png',
      '伝える情報を設計する。調整が動かない状態から、調整と評価を両立する状態までを示す図解カード。',
      '/images/axiom-work-design-guide/disclosure-evaluation-items-board-v1.png',
      '具体設計項目、伝える情報。目的限定の情報共有、見えにくさとスティグマ、不利益評価・過剰管理リスクを示す図解ボード。',
      '伝える情報を設計する',
    ],
    [
      'support_continuity',
      '/images/axiom-work-design-guide/support-continuity-design-card-v1.png',
      '支援を仕事条件へつなぎ直す。本人・職場・支援が別々の状態から、悪化や変更時に再調整できる状態までを示す図解カード。',
      '/images/axiom-work-design-guide/support-continuity-items-board-v1.png',
      '具体設計項目、支援の接続。言葉を仕事条件へ翻訳、handoff・役割境界、悪化・復職・配置換え後を示す図解ボード。',
      '支援を仕事条件へつなぎ直す',
    ],
    [
      'growth_quality',
      '/images/axiom-work-design-guide/growth-quality-design-card-v1.png',
      '続けるだけでなく育つ道を設計する。定着だけの状態から、役割・賃金・学びを更新する状態までを示す図解カード。',
      '/images/axiom-work-design-guide/growth-quality-items-board-v1.png',
      '具体設計項目、評価と成長。就職後の役割設計、評価・処遇・収入の公正さ、学習・キャリア・選び直しを示す図解ボード。',
      '続けるだけでなく育つ道を設計する',
    ],
    [
      'diverse_evidence',
      '/images/axiom-work-design-guide/diverse-evidence-design-card-v1.png',
      '多様な資料から全体像を設計する。一つの資料で一般化する状態から、共通構造と保留を分けて伝える状態までを示す図解カード。',
      '/images/axiom-work-design-guide/diverse-evidence-items-board-v1.png',
      '具体設計項目、資料の読み方。多数データを過大代表させない、歴史・国際資料から構造を探す、公開前の過剰一般化ブレーキを示す図解ボード。',
      '多様な資料から全体像を設計する',
    ],
  ].flatMap(([id, situationSrc, situationAlt, itemsSrc, itemsAlt, title]) => [
    {
      qaId: `visual_qa_work_design_situation_${id}`,
      pageSlug: 'work-design-views-guide' as const,
      pagePath: route('work-design-views-guide'),
      assetKind: 'guide_situation' as const,
      imageSrc: situationSrc,
      imageAlt: situationAlt,
      surroundingCopyJa: `${title}を、問題対応だけでなく早期発見・予防・成長まで含む仕事条件として読む。`,
      intendedReaderUnderstandingJa:
        '状況レベルが順番に進む段階ではなく、対応・早期発見・予防・成長を同時に見るレンズだと分かる。',
      status: 'code_contract_passed_visual_human_check_needed' as const,
      humanVisualCheckJa: commonHumanVisualCheck,
    },
    {
      qaId: `visual_qa_work_design_items_${id}`,
      pageSlug: 'work-design-views-guide' as const,
      pagePath: route('work-design-views-guide'),
      assetKind: 'guide_design_items' as const,
      imageSrc: itemsSrc,
      imageAlt: itemsAlt,
      surroundingCopyJa: `${title}を実際の仕事・参加設計へ落とすための具体項目を先に視覚化する。`,
      intendedReaderUnderstandingJa:
        '具体設計項目が単なるチェックリストではなく、仕事・参加設計の具体内容として見える。',
      status: 'code_contract_passed_visual_human_check_needed' as const,
      humanVisualCheckJa: commonHumanVisualCheck,
    },
  ]),
  {
    qaId: 'visual_qa_report_hero',
    pageSlug: 'articles-social-questions',
    pagePath: route('articles-social-questions'),
    assetKind: 'hero',
    imageSrc: '/images/next-nbl-report-hero-v1.png',
    imageAlt:
      'NBLレポート。本人の違和感、企業の迷い、支援者の翻訳負荷、政策議論、ニュースSNSを、仕事条件の問いへ戻し、読む、話す、相談へ戻す、設計へつなぐ流れを示す図解。',
    surroundingCopyJa:
      'NBLレポートは、NBLのAIネイティブエージェントと社会のコミュニケーションのプラットフォーム。',
    intendedReaderUnderstandingJa:
      '記事集が独り言ではなく、社会の問いを仕事条件の論考へ変える編集プラットフォームだと分かる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  {
    qaId: 'visual_qa_toolkit_hero',
    pageSlug: 'toolkit-studio',
    pagePath: route('toolkit-studio'),
    assetKind: 'hero',
    imageSrc: '/images/next-nbl-toolkit-hero-image2-v1.png',
    imageAlt:
      'ツールキット。言葉だけでは届きにくいことを、選別図解、4コマ・マンガ、音楽、フォーラム、チェックリストという別の形で手渡す素材棚の図解。',
    surroundingCopyJa:
      '文書や言葉だけでは分かりにくく共感しにくい内容を、図解・音楽・フェス・フォーラム等の別の形で表現する。',
    intendedReaderUnderstandingJa:
      'ツールキットが他ページのリンク集ではなく、認知負荷を下げる実験的素材棚だと分かる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  {
    qaId: 'visual_qa_condition_window_hero',
    pageSlug: 'work-condition-window',
    pagePath: route('work-condition-window'),
    assetKind: 'hero',
    imageSrc: '/images/next-nbl-condition-window-hero-image2-v1.png',
    imageAlt:
      '障害者雇用は例外対応ではなく、視覚、聴覚、肢体、内部、知的、精神、発達、高次脳、難病の入口を、誰もが活躍できる仕事・参加設計へつなぐ図解。',
    surroundingCopyJa:
      '障害者雇用はもはや特別な例外的対応ではなく、誰もが活躍できる仕事・参加設計の応用問題。',
    intendedReaderUnderstandingJa:
      '障害種類が中心ではなく、職場設計を中心に個別課題を読むページだと分かる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
  {
    qaId: 'visual_qa_theory_method_hero',
    pageSlug: 'theory-method-trust',
    pagePath: route('theory-method-trust'),
    assetKind: 'hero',
    imageSrc: '/images/next-nbl-method-trust-hero-reading-power-v1.png',
    imageAlt:
      '読む力を支援の専門性へ変える流れ。部分的な情報を相互作用として読み、人に届く形へ翻訳する図解。',
    surroundingCopyJa:
      '大量情報とAIの読解力を、偏見再生産ではなく、仮説・反対仮説・確認質問・言い切らない境界へ使う。',
    intendedReaderUnderstandingJa:
      'NBLの専門性が、単なる検索や要約ではなく、読み方の専門性と専門知識ネットワークの二層だと分かる。',
    status: 'code_contract_passed_visual_human_check_needed',
    humanVisualCheckJa: commonHumanVisualCheck,
  },
] as const;

export function buildAxiomNextNblPublicCandidateFinalQaRun(): AxiomNextNblPublicCandidateFinalQaRun {
  return {
    runId: `axiom_next_nbl_public_candidate_final_qa:${AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_VERSION}`,
    objectType: 'axiom_next_nbl_public_candidate_final_qa_run',
    version: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_VERSION,
    lane: 'Falcon Lab',
    status: 'internal_final_qa_contract_ready_not_public_approval',
    boundary: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_BOUNDARY,
    candidateRouteBase: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
    visualQaMatrix: AXIOM_NEXT_NBL_VISUAL_QA_MATRIX,
    publicLanguageRiskTerms: AXIOM_NEXT_NBL_PUBLIC_LANGUAGE_RISK_TERMS,
    pageCoverage: AXIOM_NEXT_NBL_FINAL_QA_PAGE_SLUGS,
    qaConclusionsJa: [
      '主要画像は、本文・alt・画像内日本語の三点一致を人間が最終確認できる単位に整理した。',
      '設計ガイドと8つの課題の地図は画像点数が多く、公開前QAの主対象である。',
      'NBLレポートはHeroに加え、37本の記事別インフォグラフィック一致をFinal QA surface上の全記事対応表で確認できる。',
      '内部語は公開本文ではブロックし、内部候補表示だけに閉じる。',
    ],
    notNow: [
      'no_public_approval',
      'no_publication_execution',
      'no_actual_public_navigation_change',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_source_support_validity_finality',
      'no_individual_consultation_or_case_judgment',
      'no_personal_data_collection_or_feedback_form_activation',
      'no_learning_update_from_final_qa',
    ],
  };
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

export function validateAxiomNextNblPublicCandidateFinalQaRun(
  run: AxiomNextNblPublicCandidateFinalQaRun,
): AxiomNextNblPublicCandidateFinalQaValidation {
  const errors: string[] = [];
  const matrixPageSlugs = new Set(run.visualQaMatrix.map((item) => item.pageSlug));
  const riskTerms = new Set(run.publicLanguageRiskTerms.map((item) => item.term));
  const qaIds = new Set<string>();

  pushIf(
    run.objectType !== 'axiom_next_nbl_public_candidate_final_qa_run',
    errors,
    'object_type_must_match',
  );
  pushIf(
    run.version !== AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_VERSION,
    errors,
    'version_must_match',
  );
  pushIf(run.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    run.status !== 'internal_final_qa_contract_ready_not_public_approval',
    errors,
    'status_must_not_be_public_approval',
  );
  pushIf(
    run.boundary !== AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_BOUNDARY,
    errors,
    'boundary_must_remain_final_qa_only',
  );

  for (const pageSlug of AXIOM_NEXT_NBL_FINAL_QA_PAGE_SLUGS) {
    pushIf(!run.pageCoverage.includes(pageSlug), errors, `missing_page_coverage:${pageSlug}`);
  }

  for (const pageSlug of [
    'home',
    'scene-entry',
    'case-readings',
    'work-design-views-guide',
    'articles-social-questions',
    'toolkit-studio',
    'work-condition-window',
    'theory-method-trust',
  ] as const) {
    pushIf(!matrixPageSlugs.has(pageSlug), errors, `missing_visual_qa_page:${pageSlug}`);
  }

  for (const item of run.visualQaMatrix) {
    pushIf(qaIds.has(item.qaId), errors, `duplicate_qa_id:${item.qaId}`);
    qaIds.add(item.qaId);
    pushIf(
      !item.pagePath.startsWith(run.candidateRouteBase),
      errors,
      `qa_path_must_remain_internal:${item.qaId}`,
    );
    pushIf(
      !item.imageSrc.startsWith('/images/'),
      errors,
      `qa_image_must_be_local_image:${item.qaId}`,
    );
    pushIf(item.imageAlt.length < 24, errors, `qa_alt_too_short:${item.qaId}`);
    pushIf(item.surroundingCopyJa.length < 20, errors, `qa_copy_too_short:${item.qaId}`);
    pushIf(
      item.humanVisualCheckJa.length < 3,
      errors,
      `qa_human_visual_check_must_have_three_items:${item.qaId}`,
    );
  }

  for (const requiredTerm of [
    'Axiom',
    'kernel',
    'runtime',
    'source lens',
    'missing context',
    'Founder',
  ]) {
    pushIf(
      !riskTerms.has(requiredTerm),
      errors,
      `missing_public_language_risk_term:${requiredTerm}`,
    );
  }

  for (const requiredBoundary of [
    'no_public_approval',
    'no_publication_execution',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_individual_consultation_or_case_judgment',
    'no_learning_update_from_final_qa',
  ]) {
    pushIf(!run.notNow.includes(requiredBoundary), errors, `missing_not_now:${requiredBoundary}`);
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_next_nbl_public_candidate_final_qa_valid'
        : 'axiom_next_nbl_public_candidate_final_qa_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_FINAL_QA_BOUNDARY,
  };
}
