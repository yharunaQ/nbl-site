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

export type WhatWeDoGuardrail = {
  title: string;
  detail: string;
};

export const whatWeDoPrimaryCta = {
  label: 'いま一緒に整理を始められること',
  summary:
    '初期公開では、人が常時対応する相談窓口を前面に出すのではなく、AI チームが論点整理や叩き台生成を担い、それを次にも使える形へ残していく入口を中心に案内しています。',
  signals: [
    '公開情報や状況メモをもとに論点を整理する',
    '重要な判断や外部への約束は人が持つ',
    '1件で終わらず、次にも使える形を残す',
  ],
};

export const whatWeDoAudiences: WhatWeDoAudience[] = [
  {
    priority: 'P1',
    title: '企業・組織の意思決定者',
    need: '障害者雇用に閉じない仕事設計や組織運用の課題にも関係ある AI チームか、どこから始められるかを知りたい。',
  },
  {
    priority: 'P2',
    title: '支援者・実務者',
    need: '方法論や支援設計を AI チームでどう整理できるかを知りたい。',
  },
  {
    priority: 'P3',
    title: '当事者・周囲の人',
    need: 'NBL がどんな考え方で働きづらさを扱うのかを知りたい。',
  },
  {
    priority: 'P4',
    title: '研究・政策関係者',
    need: '信頼性や背景にある研究・制度整理の位置づけを知りたい。',
  },
];

export const whatWeDoOffers: WhatWeDoOffer[] = [
  {
    id: 'discovery',
    state: 'offer_now',
    title: 'AIチームによる論点整理',
    summary:
      '公開情報や状況メモをもとに、何が論点か、どこから始めるかを AI チームが整理し、再利用可能な設計単位へ落とす。',
    includes: ['課題の見立て', '導入対象の整理', '進め方の叩き台'],
    caution: '人が常時対応する個別相談窓口として運営しているわけではありません。',
  },
  {
    id: 'pilot',
    state: 'offer_now',
    title: 'AIチームによる実装設計・試行',
    summary:
      '配慮、運用、文書、手順の叩き台を AI チームが組み立て、小さな試行と再利用可能な workflow の形に落とす。',
    includes: ['試行の設計', '運用ルールの叩き台', '見直し観点の共有'],
    caution: '期間や価格、人の伴走体制は案件ごとに整理します。',
  },
  {
    id: 'training',
    state: 'offer_now',
    title: '公開resources と AI教材',
    summary:
      '合理的配慮、仕事設計、働き方の見直しに関する図解、動画、レポートを AI チームが文脈付きで束ね、社会OSの共有資源にする。',
    includes: ['図解', '動画', 'レポート', '説明素材'],
    caution: '現時点では、公開中の図解・動画・資料を中心に案内しています。',
  },
  {
    id: 'jac',
    state: 'explain_only',
    title: '仕事設計の見取り図と方法論',
    summary: '仕事設計の見取り図は、NBL の中核にある方法論の一つとして説明する。',
    includes: ['条件の読み方', '進め方の考え方', 'NBL 全体との関係'],
    caution: '初回の入口というより、方法論の基礎説明として位置づけています。',
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
    title: 'この方法論を NBL 全体に吸収させない',
    detail: '仕事設計の見取り図は重要だが、NBL 全体の支援を代表しきるものとしては見せない。',
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
  'JAC α',
  'PoC 募集中',
  '診断名不要',
  '病名を扱わず',
  '認定(仮)',
  '価格目安',
];

export const whatWeDoCopy = {
  headline: '合理的配慮と仕事設計を、単発対応で終わらせず次に使える部品へ。',
  subheadline:
    'NBL は、AI運営のバーチャルチームとして、論点整理、仕事設計の見取り図、workflow、図解や説明資源を積み上げ、AI時代の社会OSを設計します。',
};
