export type AxiomSetsutenLensId =
  | 'person_record'
  | 'work_design'
  | 'support_review'
  | 'health_time'
  | 'regional_coordination';

export type AxiomSetsutenQuestionModeId =
  | 'time_contact'
  | 'work_contact'
  | 'consent_boundary'
  | 'counter_reading';

export type AxiomSetsutenLens = {
  id: AxiomSetsutenLensId;
  label: string;
  shortLabel: string;
  status: string;
};

export type AxiomSetsutenNode = {
  id: string;
  label: string;
  lensId: AxiomSetsutenLensId;
  icfFrame: string;
  x: number;
  y: number;
  status: 'observed' | 'candidate' | 'unknown' | 'boundary';
  description: string;
};

export type AxiomSetsutenRelation = {
  id: string;
  from: string;
  to: string;
  label: string;
  relationType: string;
  status: 'observed_co_occurrence' | 'working_hypothesis' | 'counter_hypothesis';
};

export type AxiomSetsutenEvidenceStrip = {
  id: string;
  lensId: AxiomSetsutenLensId;
  title: string;
  content: string;
  boundary: string;
};

export type AxiomSetsutenReviewColumn = {
  id: string;
  label: string;
  items: string[];
};

export type AxiomSetsutenQuestionMode = {
  id: AxiomSetsutenQuestionModeId;
  label: string;
  description: string;
};

export type AxiomSetsutenSharedDataSummary = {
  fileLabel: string;
  audienceLabel: string;
  purpose: string;
  rangeLabel: string;
  includedItems: string[];
  includedNotes: string;
  shareBoundary: string;
};

export type AxiomSetsutenScenario = {
  id: string;
  title: string;
  subtitle: string;
  syntheticContext: string;
  workContactPoint: string;
  researchUseNote: string;
  sharedData: AxiomSetsutenSharedDataSummary;
  lenses: AxiomSetsutenLens[];
  nodes: AxiomSetsutenNode[];
  relations: AxiomSetsutenRelation[];
  evidenceStrips: AxiomSetsutenEvidenceStrip[];
  reviewColumns: AxiomSetsutenReviewColumn[];
  questionBank: Record<AxiomSetsutenQuestionModeId, string[]>;
};

export const AXIOM_SETSUTEN_ROUTE = '/internal/axiom-setsuten-lab';

export const AXIOM_SETSUTEN_BOUNDARY_LABELS = [
  'Falcon Lab internal prototype',
  'Axiom new app, not Waralife successor',
  'Research findings used only as bootstrap prior',
  'Synthetic cases only',
  'No real personal data',
  'No diagnosis-to-support routing',
  'No final advice or work-capacity judgment',
  'No DB, auth, external AI, API, retrieval, or model movement',
  'Human joint review owns decisions',
] as const;

export const AXIOM_SETSUTEN_AI_ALLOWED = [
  '接触点として観察候補を整理する',
  '欠けている文脈変数を指摘する',
  '対抗仮説と反証ポイントを増やす',
  '本人・支援者・職場・地域で確認する問いを分ける',
  '共有範囲と同意境界のリスクを指摘する',
] as const;

export const AXIOM_SETSUTEN_AI_FORBIDDEN = [
  '支援内容を決定する',
  '勤務可否や作業能力を判断する',
  '診断名から必要配慮を推論する',
  '職場に共有すべき情報を決める',
  '本人同意なしの共有文面を作成する',
  '仮説を事実として扱う',
  '研究成果や旧アプリの権威で結論を補強する',
] as const;

export const AXIOM_SETSUTEN_QUESTION_MODES: AxiomSetsutenQuestionMode[] = [
  {
    id: 'time_contact',
    label: '時間の接触',
    description: '朝、昼、夕方、翌日、月末など、変化が出る時間帯を分ける。',
  },
  {
    id: 'work_contact',
    label: '仕事の接触',
    description: '作業密度、対人対応、切替、突発対応、移動量を分ける。',
  },
  {
    id: 'consent_boundary',
    label: '同意と共有',
    description: '本人記録、支援者メモ、職場共有の境界を先に確認する。',
  },
  {
    id: 'counter_reading',
    label: '反証読み',
    description: '見えている相関を、別の説明で読み直す。',
  },
];

const COMMON_LENSES: AxiomSetsutenLens[] = [
  {
    id: 'person_record',
    label: '本人記録',
    shortLabel: '本人',
    status: '一次体感と選んだ共有範囲',
  },
  {
    id: 'work_design',
    label: '仕事条件',
    shortLabel: '仕事',
    status: '作業、時間、役割、評価の条件',
  },
  {
    id: 'support_review',
    label: '支援レビュー',
    shortLabel: '支援',
    status: '解釈候補と確認質問',
  },
  {
    id: 'health_time',
    label: '健康時間',
    shortLabel: '時間',
    status: '回復、通院、疲労蓄積、持ち越し',
  },
  {
    id: 'regional_coordination',
    label: '地域連携',
    shortLabel: '地域',
    status: '医療、福祉、雇用、交通、生活資源',
  },
];

export const AXIOM_SETSUTEN_SCENARIOS: AxiomSetsutenScenario[] = [
  {
    id: 'morning_commute_contact',
    title: '朝の立ち上がりと通勤が仕事条件にぶつかる',
    subtitle: '波そのものではなく、波が仕事条件と接触する場所を見る',
    syntheticContext:
      '架空ケースA。本人は朝に体が重く、通勤後の立ち上がりに時間がかかる。午後は戻る日もあるが、早番の日だけ説明し直しが増える。',
    workContactPoint: '起床、通勤混雑、到着後の立ち上がり、早番、作業開始',
    researchUseNote:
      '日々の変化を複数層で見る研究成果は参照するが、旧アプリの後継ではなく、Axiomの接触点レビューとして再設計する。',
    sharedData: {
      fileLabel: 'naminote-share-sample-a.json',
      audienceLabel: '支援者',
      purpose: '早番前後の波を相談したい',
      rangeLabel: '直近28日',
      includedItems: ['睡眠', '疲れ・体力', '移動・通勤', '仕事の量や負担'],
      includedNotes: 'ふりかえりノート 2件',
      shareBoundary: '職場共有は未選択。本人記録と支援者レビュー用。',
    },
    lenses: COMMON_LENSES,
    nodes: [
      {
        id: 'wake_load',
        label: '起床時の重さ',
        lensId: 'person_record',
        icfFrame: '心身機能 / 個人文脈',
        x: 14,
        y: 26,
        status: 'observed',
        description: '本人が朝に変化を感じているが、原因は未確定。',
      },
      {
        id: 'crowded_commute',
        label: '通勤混雑',
        lensId: 'health_time',
        icfFrame: '環境因子 / 時間因子',
        x: 35,
        y: 18,
        status: 'unknown',
        description: '混雑、移動量、到着後の余白はまだ分けて見ていない。',
      },
      {
        id: 'startup_gap',
        label: '到着後の立ち上がり',
        lensId: 'work_design',
        icfFrame: '活動 / 仕事設計',
        x: 55,
        y: 35,
        status: 'candidate',
        description: '開始直後の集中、切替、準備時間が接触点かもしれない。',
      },
      {
        id: 'support_after_drop',
        label: '低下後の支援接触',
        lensId: 'support_review',
        icfFrame: '環境因子 / 支援',
        x: 76,
        y: 60,
        status: 'observed',
        description: '支援接触は低下後に寄っているが、原因とは限らない。',
      },
      {
        id: 'clinic_schedule',
        label: '通院・生活予定',
        lensId: 'regional_coordination',
        icfFrame: '制度・地域連携',
        x: 30,
        y: 78,
        status: 'unknown',
        description: '月末や通院予定との重なりは未確認。',
      },
    ],
    relations: [
      {
        id: 'r_wake_commute',
        from: 'wake_load',
        to: 'crowded_commute',
        label: '同じ朝に重なる可能性',
        relationType: 'co_occurs_with',
        status: 'working_hypothesis',
      },
      {
        id: 'r_commute_startup',
        from: 'crowded_commute',
        to: 'startup_gap',
        label: '到着後の余白を狭めるか',
        relationType: 'may_constrain',
        status: 'working_hypothesis',
      },
      {
        id: 'r_start_support',
        from: 'startup_gap',
        to: 'support_after_drop',
        label: '低下後に支援接触が増える',
        relationType: 'observed_after',
        status: 'observed_co_occurrence',
      },
      {
        id: 'r_clinic_counter',
        from: 'clinic_schedule',
        to: 'wake_load',
        label: '仕事以外の説明も残る',
        relationType: 'counter_hypothesis',
        status: 'counter_hypothesis',
      },
    ],
    evidenceStrips: [
      {
        id: 'ev_person_morning',
        lensId: 'person_record',
        title: '本人記録の見え方',
        content: '朝の重さと到着後の戻りにくさが記録されている。',
        boundary: '体感の記録であり、勤務能力判断ではない。',
      },
      {
        id: 'ev_work_shift',
        lensId: 'work_design',
        title: '仕事条件の見え方',
        content: '早番の日だけ作業開始の余白が少ない可能性がある。',
        boundary: '早番が原因とはまだ言えない。',
      },
      {
        id: 'ev_support_after',
        lensId: 'support_review',
        title: '支援接触の見え方',
        content: '支援接触は低下後に増えている。',
        boundary: '支援接触の増加を原因と読まない。',
      },
    ],
    reviewColumns: [
      {
        id: 'observed',
        label: '観察できること',
        items: [
          '朝、通勤、到着後、作業開始が同じ時間帯に集まっている。',
          '低下後に支援接触が増えている。',
          '本人がどの情報を共有したいかは未確認。',
        ],
      },
      {
        id: 'structure',
        label: '構造仮説候補',
        items: [
          '朝の体感変化が、通勤と作業開始の余白不足で増幅されている可能性がある。',
          '支援接触の量よりも、接触のタイミングと本人主導性が論点かもしれない。',
        ],
      },
      {
        id: 'counter',
        label: '対抗仮説',
        items: [
          '月末、家庭予定、通院予定が同時期に重なっているだけかもしれない。',
          '記録しやすい出来事だけが強く見えている可能性がある。',
        ],
      },
      {
        id: 'next',
        label: '次の共同レビュー',
        items: [
          '起床、家を出る時刻、混雑、到着後、作業開始を分けて聞く。',
          '本人が職場に見せたい情報と見せたくない情報を分ける。',
        ],
      },
    ],
    questionBank: {
      time_contact: [
        '低下は起床時、通勤中、到着後、作業開始後、帰宅後のどこで強く出ますか。',
        '早番の前夜と当日朝で、睡眠や準備時間に違いはありますか。',
        '翌日に持ち越す低下と、当日だけの低下は分けられそうですか。',
      ],
      work_contact: [
        '作業密度の中身は、集中作業、対人対応、切替、突発対応、移動量のどれに近いですか。',
        '開始直後に必要な準備や確認は、本人に見える形で整理されていますか。',
        '早番の日だけ変わる仕事条件は何ですか。',
      ],
      consent_boundary: [
        '本人記録のうち、職場に共有してよい範囲はどこまでですか。',
        '支援者だけで確認する情報と、職場に見せる情報は分けられていますか。',
        '共有しない情報があることを、レビューの前提として守れていますか。',
      ],
      counter_reading: [
        '仕事条件ではなく、家庭予定や通院予定との重なりで説明できますか。',
        '記録が細かい日ほど低下が強く見えている可能性はありますか。',
        '支援接触の増加は原因ではなく、低下後の結果ではありませんか。',
      ],
    },
  },
  {
    id: 'interpretation_collision',
    title: '本人記録と支援者解釈が同じ言葉に見えない',
    subtitle: '意欲や態度に見える前に、観察と推論を分ける',
    syntheticContext:
      '架空ケースB。午後に報告が遅れ、支援者メモでは意欲低下と読まれたが、本人は休憩後の戻りにくさと説明している。',
    workContactPoint: '昼休憩、午後再開、報告締切、声かけ、評価感',
    researchUseNote:
      '本人記録と支援者解釈を並べる知見は使うが、旧アプリの評価画面ではなく、解釈衝突をほどく新規キャンバスとして扱う。',
    sharedData: {
      fileLabel: 'naminote-share-sample-b.json',
      audienceLabel: '支援者',
      purpose: '午後の報告が遅れる日の見え方を相談したい',
      rangeLabel: '直近14日',
      includedItems: ['集中', '気持ちの落ち着き', '仕事の量や負担', '相談できる相手'],
      includedNotes: 'ふりかえりノート 1件',
      shareBoundary: '評価者共有は未承認。支援者との共同確認用。',
    },
    lenses: COMMON_LENSES,
    nodes: [
      {
        id: 'after_lunch_reentry',
        label: '休憩後の戻りにくさ',
        lensId: 'person_record',
        icfFrame: '心身機能 / 活動',
        x: 15,
        y: 36,
        status: 'observed',
        description: '本人説明では午後の再開が焦点。',
      },
      {
        id: 'report_deadline',
        label: '報告締切',
        lensId: 'work_design',
        icfFrame: '活動 / 仕事設計',
        x: 43,
        y: 26,
        status: 'candidate',
        description: '締切と状態変化の接触点を確認する。',
      },
      {
        id: 'motivation_label',
        label: '意欲低下という推論',
        lensId: 'support_review',
        icfFrame: '支援者解釈',
        x: 70,
        y: 42,
        status: 'boundary',
        description: '観察ではなく推論として扱う。',
      },
      {
        id: 'voice_tone',
        label: '声かけの届き方',
        lensId: 'support_review',
        icfFrame: '環境因子 / 対人環境',
        x: 58,
        y: 72,
        status: 'unknown',
        description: '相談として届くか評価として届くかを確認する。',
      },
      {
        id: 'afternoon_fatigue',
        label: '午後の疲労',
        lensId: 'health_time',
        icfFrame: '心身機能 / 時間因子',
        x: 30,
        y: 72,
        status: 'candidate',
        description: '午後固有か、午前からの蓄積かは未確認。',
      },
    ],
    relations: [
      {
        id: 'r_reentry_deadline',
        from: 'after_lunch_reentry',
        to: 'report_deadline',
        label: '再開と締切が重なる',
        relationType: 'co_occurs_with',
        status: 'working_hypothesis',
      },
      {
        id: 'r_deadline_label',
        from: 'report_deadline',
        to: 'motivation_label',
        label: '遅れが意欲推論に変換される',
        relationType: 'interpretation_shift',
        status: 'working_hypothesis',
      },
      {
        id: 'r_tone_counter',
        from: 'voice_tone',
        to: 'motivation_label',
        label: '声かけ側の条件も関係する',
        relationType: 'counter_hypothesis',
        status: 'counter_hypothesis',
      },
    ],
    evidenceStrips: [
      {
        id: 'ev_person_reentry',
        lensId: 'person_record',
        title: '本人説明',
        content: '昼休憩後に頭が戻りにくいという説明がある。',
        boundary: '意欲の有無とは分けて扱う。',
      },
      {
        id: 'ev_support_label',
        lensId: 'support_review',
        title: '支援者メモ',
        content: '意欲低下という言葉が出ている。',
        boundary: 'これは観察ではなく推論ラベル。',
      },
      {
        id: 'ev_work_report',
        lensId: 'work_design',
        title: '仕事条件',
        content: '午後の報告締切が状態変化と重なる可能性がある。',
        boundary: '締切変更の提案ではなく、確認すべき条件。',
      },
    ],
    reviewColumns: [
      {
        id: 'observed',
        label: '観察できること',
        items: ['午後の報告遅れが見える。', '本人説明と支援者解釈がずれている。'],
      },
      {
        id: 'structure',
        label: '構造仮説候補',
        items: [
          '午後再開と報告締切の接触が、説明負荷を上げている可能性がある。',
          '支援者の声かけが、相談ではなく評価として届いている可能性がある。',
        ],
      },
      {
        id: 'counter',
        label: '対抗仮説',
        items: [
          '報告方法ではなく午後業務そのものが合っていない可能性がある。',
          '本人の説明がまだ言語化途中で、支援者側も確認不足かもしれない。',
        ],
      },
      {
        id: 'next',
        label: '次の共同レビュー',
        items: [
          '支援者メモを観察欄と推論欄に分ける。',
          '本人が訂正したい言葉と、まだ保留したい情報を分ける。',
        ],
      },
    ],
    questionBank: {
      time_contact: [
        '午後の低下は昼休憩直後、報告直前、退勤前のどこで出やすいですか。',
        '午前からの蓄積と、昼休憩後の再開しにくさは分けられますか。',
      ],
      work_contact: [
        '報告の負担は、時間、形式、相手、内容量のどれに近いですか。',
        '午後業務の中で切替回数や突発対応は増えていますか。',
      ],
      consent_boundary: [
        '支援者メモのどの表現を本人と一緒に見直せますか。',
        '評価者に共有する前に、本人が訂正できる欄はありますか。',
      ],
      counter_reading: [
        '意欲低下ではなく、報告方法や声かけ方法の不一致で説明できますか。',
        '本人側だけでなく、支援者側の期待水準が変わった可能性はありますか。',
      ],
    },
  },
  {
    id: 'coordination_boundary_map',
    title: '地域・医療・職場の情報境界が本人に戻ってくる',
    subtitle: '連携を増やす前に、本人が選べる共有境界を地図化する',
    syntheticContext:
      '架空ケースC。通院、交通、職場シフト、地域支援が別々に動き、本人が毎回同じ説明をしている。',
    workContactPoint: '通院予定、交通手段、シフト調整、地域支援窓口、共有同意',
    researchUseNote:
      '生活・医療・仕事の接続を見る研究成果は先行知見として使うが、本人同意と共有境界を中心にしたAxiom新規設計とする。',
    sharedData: {
      fileLabel: 'naminote-share-sample-c.pdf',
      audienceLabel: '支援者',
      purpose: '通院日と勤務調整の説明し直しを減らしたい',
      rangeLabel: '直近28日',
      includedItems: ['移動・通勤', '生活リズム', '仕事の量や負担', '相談できる相手'],
      includedNotes: '共有シート印刷版',
      shareBoundary: '医療情報の職場共有は未選択。共有先ごとの再同意が必要。',
    },
    lenses: COMMON_LENSES,
    nodes: [
      {
        id: 'repeat_explanation',
        label: '説明し直し',
        lensId: 'person_record',
        icfFrame: '活動 / 参加',
        x: 15,
        y: 48,
        status: 'observed',
        description: '本人に説明負荷が戻っている。',
      },
      {
        id: 'clinic_day',
        label: '通院予定',
        lensId: 'health_time',
        icfFrame: '健康時間 / 制度',
        x: 35,
        y: 20,
        status: 'observed',
        description: '通院日は時間条件として扱う。',
      },
      {
        id: 'shift_window',
        label: 'シフト調整窓口',
        lensId: 'work_design',
        icfFrame: '仕事設計 / 環境因子',
        x: 58,
        y: 34,
        status: 'unknown',
        description: '誰が何を決めるか未確認。',
      },
      {
        id: 'regional_contact',
        label: '地域支援者',
        lensId: 'regional_coordination',
        icfFrame: '地域連携 / 支援資源',
        x: 76,
        y: 64,
        status: 'candidate',
        description: '連絡窓口を増やすことが負担増になる可能性もある。',
      },
      {
        id: 'consent_map',
        label: '共有範囲',
        lensId: 'support_review',
        icfFrame: '同意境界 / 監査',
        x: 40,
        y: 76,
        status: 'boundary',
        description: '本人が選ぶ共有先と共有粒度を先に置く。',
      },
    ],
    relations: [
      {
        id: 'r_clinic_shift',
        from: 'clinic_day',
        to: 'shift_window',
        label: '予定と調整が接触',
        relationType: 'depends_on',
        status: 'working_hypothesis',
      },
      {
        id: 'r_shift_repeat',
        from: 'shift_window',
        to: 'repeat_explanation',
        label: '窓口不明で説明が戻る',
        relationType: 'may_amplify',
        status: 'working_hypothesis',
      },
      {
        id: 'r_consent_regional',
        from: 'consent_map',
        to: 'regional_contact',
        label: '共有先ごとに境界が必要',
        relationType: 'boundary_condition',
        status: 'working_hypothesis',
      },
    ],
    evidenceStrips: [
      {
        id: 'ev_person_repeat',
        lensId: 'person_record',
        title: '本人負荷',
        content: '同じ説明を何度もしている。',
        boundary: '本人の準備不足として読まない。',
      },
      {
        id: 'ev_region',
        lensId: 'regional_coordination',
        title: '地域連携',
        content: '医療、職場、地域支援の情報が別々にある。',
        boundary: '横流し共有は不可。',
      },
      {
        id: 'ev_consent',
        lensId: 'support_review',
        title: '共有境界',
        content: '誰に何を共有してよいかは未整理。',
        boundary: '本人同意なしに共有範囲を決めない。',
      },
    ],
    reviewColumns: [
      {
        id: 'observed',
        label: '観察できること',
        items: ['通院日とシフト調整が重なる。', '本人が説明し直している。'],
      },
      {
        id: 'structure',
        label: '構造仮説候補',
        items: [
          '本人の困りごとは、情報境界と窓口未設計で増幅している可能性がある。',
          '連携を増やす前に、共有粒度と撤回可能性を確認する必要がある。',
        ],
      },
      {
        id: 'counter',
        label: '対抗仮説',
        items: [
          '共有先を増やすことで本人の同意管理負担が上がる可能性がある。',
          '地域資源の不足は、アプリ内整理だけでは変わらないかもしれない。',
        ],
      },
      {
        id: 'next',
        label: '次の共同レビュー',
        items: [
          '共有したい情報、共有したくない情報、都度確認したい情報を分ける。',
          '医療、職場、地域支援の窓口と本人の確認権限を並べる。',
        ],
      },
    ],
    questionBank: {
      time_contact: [
        '通院日、移動時間、勤務時間、連絡待ち時間はどこで重なりますか。',
        '説明し直しは予定前、当日、予定後のどこで増えていますか。',
      ],
      work_contact: [
        'シフト調整で本人が毎回説明している内容は何ですか。',
        '職場側で決められることと、地域側の条件に依存することは分けられますか。',
      ],
      consent_boundary: [
        '医療情報のうち、職場に共有してよい範囲はどこまでですか。',
        '本人を飛ばして共有してはいけない情報は何ですか。',
        '撤回や更新を本人がどう伝えられるとよいですか。',
      ],
      counter_reading: [
        '連絡カードを増やすこと自体が、本人の負担になる可能性はありますか。',
        '地域資源の不足を本人の説明努力の問題として読んでいませんか。',
      ],
    },
  },
];

export function getAxiomSetsutenScenarioById(scenarioId: string): AxiomSetsutenScenario {
  return (
    AXIOM_SETSUTEN_SCENARIOS.find((scenario) => scenario.id === scenarioId) ??
    AXIOM_SETSUTEN_SCENARIOS[0]
  );
}

export function getVisibleAxiomSetsutenNodes(
  scenario: AxiomSetsutenScenario,
  activeLensIds: AxiomSetsutenLensId[],
): AxiomSetsutenNode[] {
  const active = new Set(activeLensIds);
  return scenario.nodes.filter((node) => active.has(node.lensId));
}

export function buildAxiomSetsutenReviewPacket(
  scenario: AxiomSetsutenScenario,
  activeLensIds: AxiomSetsutenLensId[],
  questionModeId: AxiomSetsutenQuestionModeId,
): string {
  const active = new Set(activeLensIds);
  const visibleLenses = scenario.lenses
    .filter((lens) => active.has(lens.id))
    .map((lens) => `- ${lens.label}: ${lens.status}`)
    .join('\n');
  const visibleNodes = getVisibleAxiomSetsutenNodes(scenario, activeLensIds)
    .map((node) => `- ${node.label} [${node.icfFrame} / ${node.status}]: ${node.description}`)
    .join('\n');
  const evidence = scenario.evidenceStrips
    .filter((strip) => active.has(strip.lensId))
    .map((strip) => `- ${strip.title}: ${strip.content} / boundary: ${strip.boundary}`)
    .join('\n');
  const questions = scenario.questionBank[questionModeId]
    .map((question) => `- ${question}`)
    .join('\n');
  const allowed = AXIOM_SETSUTEN_AI_ALLOWED.map((item) => `- ${item}`).join('\n');
  const forbidden = AXIOM_SETSUTEN_AI_FORBIDDEN.map((item) => `- ${item}`).join('\n');

  return [
    '# Axiom Setsuten Lab review packet',
    '',
    `scenario_id: ${scenario.id}`,
    'status: synthetic_internal_review_packet_only',
    'app_position: axiom_new_app_not_waralife_successor',
    'research_use: bootstrap_prior_only_not_authority',
    'boundary: contact_points_questions_and_counter_hypotheses_only',
    '',
    '## AI may',
    allowed,
    '',
    '## AI must not',
    forbidden,
    '',
    '## Work contact point',
    scenario.workContactPoint,
    '',
    '## Active source lenses',
    visibleLenses || '- no_lens_selected',
    '',
    '## Contact nodes for human review',
    visibleNodes || '- no_node_visible',
    '',
    '## Evidence strips',
    evidence || '- no_evidence_strip_visible',
    '',
    '## Questions for human joint review',
    questions,
    '',
    '## Final constraint',
    'AI may only add missing variables, safer questions, alternative hypotheses, and drift flags. Human review owns any interpretation, sharing, or action.',
  ].join('\n');
}
