export type OperatingLoopsHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type OperatingLoop = {
  title: string;
  cadence: string;
  owner: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  founderNeeded: string;
};

export type FounderBoundary = {
  title: string;
  aiCanDo: string[];
  founderDecides: string[];
};

export type OperatingTrigger = {
  title: string;
  when: string;
  action: string;
};

export type OperatingRisk = {
  title: string;
  detail: string;
};

export const operatingLoopsHero: OperatingLoopsHero = {
  eyebrow: 'Operating Loops',
  headline: 'NBLを、Founderの逐次指示ではなく、定常ループで回す。',
  subheadline:
    'マルチエージェントの要点は、役割名を並べることではなく、問いの選定、比較、統合、公開判断、実験、記録が繰り返し回ることにある。NBLでは、Chief of Staff を中心に複数の loop を定義し、Founder は本当に必要な判断だけを担う。',
};

export const operatingLoops: OperatingLoop[] = [
  {
    title: 'Chief of Staff Loop',
    cadence: '常時 / 新しい入力ごと',
    owner: 'Chief of Staff',
    purpose: 'Inbox を整理し、今どの問いを1つ進めるかを決め、各 loop に渡す。',
    inputs: [
      'ユーザー発話',
      'public / business / R&D の新情報',
      '既存 decision log',
      'review drafts の進捗',
    ],
    outputs: [
      '今ラウンドの問い',
      '進める loop の指定',
      'decision log 更新',
      'founder に戻すべき論点の明示',
    ],
    founderNeeded: '分岐が大きい経営判断、外部行動、実名情報が必要なときだけ。',
  },
  {
    title: 'Public Narrative Loop',
    cadence: '週次 + release 前',
    owner: 'Editorial / CX / Communications',
    purpose: 'Home、What We Do、JAC、Resources、About の narrative を整え、public promise を更新する。',
    inputs: [
      'relaunch home',
      'site architecture',
      'march 20 public surfaces',
      'resource / JAC / About drafts',
    ],
    outputs: [
      'hidden review page',
      'page brief',
      'public copy',
      '公開可否メモ',
    ],
    founderNeeded: 'public に本当に約束する表現と、思想の最終トーンを決めるとき。',
  },
  {
    title: 'Business Validation Loop',
    cadence: '週次',
    owner: 'Operating Model / Revenue / Partnership / Validation Ops',
    purpose: 'design partner、package、discovery、ranking を更新し、事業仮説を前に進める。',
    inputs: [
      'business structure',
      'design partner round',
      'commercial package',
      'dossier / readout / scorecard',
    ],
    outputs: [
      'next experiment',
      'partner ranking',
      'advancement memo',
      'commercial boundary update',
    ],
    founderNeeded: '実在候補名、外部連絡、advance / hold の最終判断。',
  },
  {
    title: 'Knowledge And Method Loop',
    cadence: '週次',
    owner: 'Method / Evidence / Implementation',
    purpose: 'JAC、guide、図解、動画、知識基盤を改善し、再利用可能な社会OSの部品を増やす。',
    inputs: [
      'references / JAC assets',
      'resource inventory',
      'guide performance / UX 課題',
      'new research or content',
    ],
    outputs: [
      'JAC update',
      'resource curation',
      'guide improvement',
      'method memo',
    ],
    founderNeeded: '研究・方法論としてどこまで public に出すかを決めるとき。',
  },
  {
    title: 'Next Horizon Loop',
    cadence: '隔週',
    owner: 'Vision / R&D / Chief of Staff',
    purpose: 'Horizon 1 の学びを踏まえながら、participation design の次の芽出しを小さく設計する。',
    inputs: [
      'next horizon round',
      'About / participation vision',
      '現場R&Dからの知見',
      'internal incubation ideas',
    ],
    outputs: [
      'small experiment brief',
      'guardrails',
      'future public narrative candidate',
      'internal incubation queue',
    ],
    founderNeeded: '思想の採否、実験を本当に始めるか、外部に説明するかを決めるとき。',
  },
];

export const founderBoundaries: FounderBoundary[] = [
  {
    title: 'AIが進めてよい領域',
    aiCanDo: [
      '問いの整理',
      '比較表・scorecard・checklist の整備',
      'hidden review page の作成',
      'copy draft と decision memo の更新',
      'JAC / resources / business docs の改善',
    ],
    founderDecides: [],
  },
  {
    title: 'Founderが決める領域',
    aiCanDo: [],
    founderDecides: [
      '実名候補に連絡するか',
      'public に本当に約束するか',
      '思想や経営判断として採るか',
      '実験を外に出すか',
      '人間レビュー境界をどこに置くか',
    ],
  },
];

export const operatingTriggers: OperatingTrigger[] = [
  {
    title: '新しい情報が入った',
    when: '新しいコンテンツ、外部反応、ユーザー発話が来たとき',
    action: 'Chief of Staff が該当 loop を選び、1 round の問いへ落とす。',
  },
  {
    title: '判断が provisional で止まっている',
    when: 'docs や review page が増えるだけで統合が見えなくなったとき',
    action: 'relaunch home / operating loops / decision log に戻して統合する。',
  },
  {
    title: 'Founder情報が必要になった',
    when: '実名候補、外部行動、不可逆な public promise が必要なとき',
    action: 'その論点だけ Founder に戻し、他は止めずに進める。',
  },
  {
    title: 'public へ出せる状態になった',
    when: 'copy / boundary / implementation の3点が揃ったとき',
    action: 'temporary public mode のどこを置き換えるかを release 単位で決める。',
  },
];

export const operatingRisks: OperatingRisk[] = [
  {
    title: 'Founder chat が trigger になりすぎる',
    detail:
      '毎回の `進めて` を待つ運用に戻ると、AIチームの速度ではなく会話ターンが律速になる。loop ごとの次アクションを先回りで持つ必要がある。',
  },
  {
    title: 'loop が consulting drift する',
    detail:
      '都度の案件対応だけが増えると、社会OSの部品が残らない。各 loop は必ず reusable asset か decision log を残す。',
  },
  {
    title: 'vision と実務が切れる',
    detail:
      'Next Horizon だけ、または Horizon 1 だけに寄ると NBL の本丸が崩れる。二層を同時に追うことが必要。',
  },
  {
    title: 'unsafe automation pressure が上がる',
    detail:
      '障害・雇用・支援の高リスク判断を AI に寄せすぎると、事業速度よりも先に信頼が壊れる。must-escalate を維持する。',
  },
];
