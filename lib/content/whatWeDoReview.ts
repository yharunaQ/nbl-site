export type WhatWeDoAudience = {
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  title: string;
  need: string;
};

export type WhatWeDoArtifact = {
  title: string;
  summary: string;
  whyItMatters: string;
};

export type WhatWeDoOffer = {
  id: string;
  state: 'offer_now' | 'explain_only' | 'hold';
  title: string;
  summary: string;
  includes: string[];
  caution: string;
};

export type WhatWeDoStep = {
  step: string;
  title: string;
  summary: string;
};

export type WhatWeDoCommercialLane = {
  title: string;
  summary: string;
  note: string;
};

export type WhatWeDoGuardrail = {
  title: string;
  detail: string;
};

export const whatWeDoPrimaryCta = {
  label: '社会OS事業として、いま公開していること',
  summary:
    'NBL の現在のコアは、働きづらさを仕事設計へ読み替えるプロダクト群と、企業・支援者・行政が共通言語を持てる公開資源です。事業の中心は、人が件数で受ける個別相談ではなく、AI チームが図解、方法論、判断境界、workflow を積み上げる社会OSの公開層と private layer を育てることにあります。',
  signals: [
    '公開コレクションと仕事設計プロダクト群を free-first で返す',
    '企業だけでなく、支援者・行政も動きやすくする共通地図を返す',
    '重要な判断や外部への約束は人が持つ',
    '有償は private layer で実装と運用を支える',
    '1件で終わらず、次にも使える社会OSの部品を残す',
  ],
};

export const whatWeDoAudiences: WhatWeDoAudience[] = [
  {
    priority: 'P1',
    title: '企業・組織の意思決定者',
    need: '障害者雇用に閉じない仕事設計や組織運用の課題にも関係ある AI チームか、どこから始められるかを知りたい。',
  },
  {
    priority: 'P1',
    title: '障害者就労支援・障害者支援・難病支援の専門支援者と行政担当者',
    need:
      '企業だけに負担を押し戻さず、制度、支援連携、仕事設計を同じ地図でどう整理できるかを知りたい。',
  },
  {
    priority: 'P2',
    title: '当事者・家族・周囲の人',
    need: 'NBL がどんな考え方で働きづらさを扱うのかを知りたい。',
  },
  {
    priority: 'P3',
    title: '研究・政策関係者',
    need: '信頼性や背景にある研究・制度整理の位置づけを知りたい。',
  },
];

export const whatWeDoOffers: WhatWeDoOffer[] = [
  {
    id: 'training',
    state: 'offer_now',
    title: '公開resources と変革コレクション',
    summary:
      '仕事設計の見取り図、就労支援設計の変革テーマ群、動画、図解、レポートを文脈付きで束ね、企業、支援者、行政が同じ地図で読める NBL の社会OSの公開知識層として返す。',
    includes: ['仕事設計の見取り図', '就労支援設計の変革テーマ群', '支援者向け図解', '動画', '説明素材'],
    caution: 'ここは trust と共通言語の層であり、単体コンテンツ販売を主軸にはしません。',
  },
  {
    id: 'jac',
    state: 'explain_only',
    title: '仕事設計の見取り図と26カード版',
    summary: '仕事設計の見取り図と 26カード版は、NBL の現在のコアとして説明する。',
    includes: ['条件の読み方', '26フレームの詳細確認', '現在のコアとしての位置づけ'],
    caution: '公開名は仕事設計系にそろえ、旧称を前面には出しません。',
  },
  {
    id: 'discovery',
    state: 'offer_now',
    title: 'AIチームによる論点整理',
    summary:
      '公開情報や状況メモをもとに、企業内の課題、支援連携、制度上の論点を AI チームが整理し、再利用可能な設計単位へ落とす。',
    includes: ['課題の見立て', '導入対象の整理', '支援連携の論点整理', '進め方の叩き台'],
    caution: '人が件数で受ける常設相談窓口として運営しているわけではありません。',
  },
  {
    id: 'pilot',
    state: 'offer_now',
    title: 'AIチームによる実装設計・試行',
    summary:
      '配慮、運用、文書、手順、支援連携の叩き台を AI チームが組み立て、小さな試行と再利用可能な workflow の形に落とす。',
    includes: ['試行の設計', '運用ルールの叩き台', '支援連携の叩き台', '見直し観点の共有'],
    caution: '期間や価格、人の伴走体制は案件ごとに整理します。これは社会OSの private layer 側です。',
  },
  {
    id: 'hold',
    state: 'hold',
    title: 'Hold 領域',
    summary:
      '価格表、alpha / beta language、認定制度、guidebook の sales-first checkout、人の相談窓口に見える表現、lab 系導線は hold に置く。',
    includes: [
      'pricing draft',
      'alpha/beta',
      'guidebook sales-first',
      'human-style consultation wording',
      'DAO / lab',
    ],
    caution: 'public truth に見える露出を避ける。',
  },
];

export const whatWeDoWorkflow: WhatWeDoStep[] = [
  {
    step: '01',
    title: '課題を整理する',
    summary: '人、仕事、環境、支援、時間の条件を見ながら、何が起きているかを整理する。',
  },
  {
    step: '02',
    title: '配慮や運用を設計する',
    summary: '単発の配慮で終わらせず、現場で続けられる形の叩き台を設計する。',
  },
  {
    step: '03',
    title: '小さく試して見直す',
    summary: 'いきなり固定せず、小さな試行案を動かしながら改善点を見ていく。',
  },
  {
    step: '04',
    title: '共有と評価につなげる',
    summary: '必要な文書化や振り返りの観点を持ち、次の改善につなげる。',
  },
];

export const whatWeDoCommercialLanes: WhatWeDoCommercialLane[] = [
  {
    title: '社会OSの公開層',
    summary:
      '仕事設計の見取り図、26カード版、就労支援設計の変革テーマ群、公開 resources のような free-first の入口で、企業、支援者、行政に先に共通言語を返す。',
    note: 'ここは trust と理解のレイヤー。小売相談や単発売りより、社会OSの公開知識層として育てる。',
  },
  {
    title: '有償の private layer',
    summary:
      'initial design pack、private workspace、workflow setup、recurring updates のような private layer で実装と運用を支える。',
    note: '収益の主軸は `startup fee + recurring fee + bounded private usage` に置く。',
  },
  {
    title: '内部ツール',
    summary:
      '条件整理ドラフトは、当面は Founder が外部依頼対応の中で使う internal tool として扱い、外向け商品にはしない。',
    note: '将来は operator-assisted、その先で self-serve の順に評価する。',
  },
];

export const whatWeDoArtifacts: WhatWeDoArtifact[] = [
  {
    title: '条件の見取り図',
    summary: '人・仕事・環境・支援・時間の条件を分けて読む見取り図。',
    whyItMatters: '診断や印象だけで conclusion を出さず、次の対話の土台を残せる。',
  },
  {
    title: '運用のたたき台',
    summary: '相談導線、配慮運用、共有順序を現場で回る形へ落とした叩き台。',
    whyItMatters: 'その場しのぎの助言で終わらず、次のケースにも再利用しやすい。',
  },
  {
    title: '説明資源',
    summary: '図解、動画、説明素材、理解促進コンテンツを文脈付きで束ねた資源。',
    whyItMatters: '関係者が共通言語を持ちやすくなり、実装の前提が揃う。',
  },
  {
    title: '判断メモ',
    summary: 'どこまで AI が進め、どこで人が決めるかを示した判断メモ。',
    whyItMatters: '信頼を落とさず、Human-in-Command を運用で残せる。',
  },
];

export const whatWeDoGuardrails: WhatWeDoGuardrail[] = [
  {
    title: '診断決め打ちを避ける',
    detail: '`診断名不要` や `病名を扱わず` のような断定は避け、個別事情と制度文脈を省略しない。',
  },
  {
    title: '期間と価格を promise にしない',
    detail: '固定期間や価格カードは、整備前の promise に見えるため初期公開では出さない。',
  },
  {
    title: '単体コンテンツ販売を主軸にしない',
    detail:
      '26カード版や各種資料は理解と trust の入口に使い、収益の主軸は private workspace や recurring 運用に置く。',
  },
  {
    title: '条件整理ドラフトを公開商品にしない',
    detail:
      '条件整理ドラフトは、当面 Founder-operated internal tool として扱い、open trial や常設サービスとして見せない。',
  },
  {
    title: '現在のコアとして前面に出す',
    detail:
      '仕事設計プロダクト群は NBL の現在のコアとして明示する。ただし、研究、理解資源、運営モデルとの接続も同時に見えるようにする。',
  },
  {
    title: '障害者雇用だけに閉じた組織と誤解させない',
    detail:
      '障害や病気の文脈を重要な実装領域として扱いつつ、仕事設計や組織運用の課題とも接続して説明する。',
  },
  {
    title: '研究と現場を両方示す',
    detail: '研究だけ、あるいは啓発だけに寄らず、実装との接続を同時に示す。',
  },
  {
    title: 'AI 運営主体を隠さない',
    detail: 'AI チームが担うこと、人が常時対応するわけではないことを public copy で曖昧にしない。',
  },
];

export const whatWeDoWordsToAvoid = [
  'alpha / beta language',
  'PoC 募集中',
  '診断名不要',
  '病名を扱わず',
  '認定(仮)',
  '価格目安',
];

export const whatWeDoCopy = {
  headline: '仕事設計、公開コレクション、支援連携のOSを積み上げる社会OS事業。',
  subheadline:
    'NBL の現在のコアは、働きづらさを仕事・環境・支援・時間・制度の条件で読み直す仕事設計プロダクト群です。そこに、就労支援設計の変革テーマ群のような公開コレクションと、企業・支援者・行政が動きやすくなる支援連携のOSを重ねて、再利用可能な知識、workflow、判断境界を増やしていきます。AI が比較・下書き・記録化を進め、人が高リスク判断と対外責任を持つことで、AI時代の社会OSを設計します。',
};
