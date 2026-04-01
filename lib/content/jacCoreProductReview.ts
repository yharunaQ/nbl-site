export type JacCorePrinciple = {
  title: string;
  summary: string;
};

export type JacCoreSurface = {
  title: string;
  state: 'keep_live' | 'rewrite_live' | 'review_first' | 'internal_tool' | 'internal_source';
  role: string;
  currentProblem: string;
  targetShape: string;
};

export type JacCoreLadderStep = {
  step: string;
  title: string;
  state: 'public_now' | 'preparing' | 'private_layer' | 'internal_support';
  userValue: string;
  businessRole: string;
  currentState: string;
  founderBoundary: string;
};

export type JacCoreInternalSupport = {
  title: string;
  detail: string;
  bullets: string[];
};

export type JacAgentRole = {
  title: string;
  responsibility: string;
  outputs: string[];
  founderBoundary: string;
};

export type JacExecutionStep = {
  step: string;
  title: string;
  detail: string;
};

export const jacCoreProductHero = {
  eyebrow: 'Work Design Core Product',
  headline: '仕事設計プロダクト群を、trial の寄せ集めではなく NBL の最重要プロダクトとして再編する。',
  subheadline:
    '旧 `/jac` 系資産は `guide`, `foundations`, `trial`, `guidebook`, `editorial base` が分かれたまま存在している。次にやるべきなのは、3/9 時点の 26カード版を本体に据え、先行5章版は開発履歴へ下げ、どの surface が何を約束する製品なのかを揃え直すこと。',
  sideEyebrow: 'Operating Rule',
  sideTitle: '先に整えるのは、売り方より surface split と naming。',
  sideBody:
    '価値の中心は `AIカウンセラー` という名前でも checkout でもなく、困りごとを条件つきの設計課題へ変換する方法論にある。だから最初に fix すべきなのは、どの route が基礎理解、どの route が review-first、どの route が内部基盤かの境界と、どの名前で public に見せるか。',
};

export const jacCorePrinciples: JacCorePrinciple[] = [
  {
    title: '1 surface, 1 promise',
    summary:
      '見取り図は基礎地図、26カード版は現在の本体、ガイドは内部チェック、配慮設計アシストは internal support、先行5章版は役割終了の試作として役割を混ぜない。',
  },
  {
    title: '1つのコア、複数の surface',
    summary:
      '見取り図と26カード版を利用者向けの公開本線に置き、ガイドと配慮設計アシストは内部側に置く。',
  },
  {
    title: '基礎地図を先に出し、promise は後ろに置く',
    summary:
      '先に public-safe な基礎地図と 26カード版を見せ、内部チェック段階の面は利用者向け導線に混ぜない。',
  },
  {
    title: 'AIは整理のために使い、過剰約束に使わない',
    summary:
      '`AIカウンセラー` のような強い naming より、条件整理、境界確認、次の問い生成という本来の価値を前に出す。',
  },
  {
    title: '編集基盤と公開面はつなぐが混ぜない',
    summary:
      '先行5章版や 26カード原稿は内部で育てつつ、public route では現在の本体と開発履歴を混ぜない。',
  },
];

export const jacCoreSurfaces: JacCoreSurface[] = [
  {
    title: '仕事設計の見取り図',
    state: 'keep_live',
    role: '仕事設計プロダクト群の土台を返す public-safe な基礎面',
    currentProblem: '存在はしているが、他の surface や現在のコアとの関係が見えにくい。',
    targetShape: '基礎地図として維持し、ガイド / 雇用設計 / resources の anchor にする。',
  },
  {
    title: '仕事設計ガイド',
    state: 'internal_source',
    role: '内部チェック用の検証面',
    currentProblem: 'debug 用の監査出力と利用者向け出力が混ざっており、現状では利用者に出せない。',
    targetShape: '内部レビュー専用の面として維持し、公開本線には混ぜない。',
  },
  {
    title: '26フレームカード版',
    state: 'review_first',
    role: '見取り図の次に置く current core の本体',
    currentProblem: '3/9 時点の card edition はあるが、表の route と公開導線での位置づけがまだ弱い。',
    targetShape: 'current core の main surface として先に立て、見取り図とガイドの間をつなぐ。',
  },
  {
    title: '配慮設計アシスト',
    state: 'internal_tool',
    role: 'Founder が外部依頼対応の中で使う internal tool',
    currentProblem: '`AIカウンセラー` や open trial promise が残ると、実際の使い方より public product に見えてしまう。',
    targetShape: '当面は Founder-operated internal tool に固定し、のちに operator-assisted -> self-serve の順で段階評価する。',
  },
  {
    title: '先行5章版アーカイブ',
    state: 'internal_source',
    role: '役割を終えた試作 / 参照資産',
    currentProblem: 'route が残っていると、いまも active な surface に見えやすい。',
    targetShape: '新たな surface としては育てず、必要時だけ参照する静かなアーカイブにする。',
  },
  {
    title: '先行5章版・26カード版の編集基盤',
    state: 'internal_source',
    role: '本文・26カード・編集 packet の内部正本',
    currentProblem: '強い本文資産があるのに、表の route と繋がって見えない。',
    targetShape: 'public route とは分けたまま、ワークブック / ガイド の source of truth として使う。',
  },
];

export const jacCoreLadderIntro = {
  eyebrow: 'Canonical Ladder',
  title: 'Public foundation から private layer までの一本道を先に固定する',
  description:
    '見取り図と26カード版を公開本線として固定し、ガイドや配慮設計アシストは内部側に置く。先行5章版は本線から外し、`利用者に見せるもの` と `内部で育てるもの` を分ける。',
};

export const jacCoreLadderSteps: JacCoreLadderStep[] = [
  {
    step: '01',
    title: '仕事設計の見取り図',
    state: 'public_now',
    userValue:
      '3レイヤーと 26フレームの全体像を共有し、困りごとを仕事設計の課題として読む共通地図を返す。',
    businessRole: '最初の trust layer。記事流入や初見訪問で NBL の現在のコアを理解させる。',
    currentState: 'すでに public-safe に live。次に必要なのは他 surface との関係の明示。',
    founderBoundary: 'この面自体の go / hold は不要。コアの起点として固定することだけ合意すればよい。',
  },
  {
    step: '02',
    title: '26フレームカード版',
    state: 'preparing',
    userValue:
      '各フレームが何を見るための枠か、どこで詰まりやすいか、最初の一手をどう決めるかを利用者向けのカード版として受け取る。',
    businessRole:
      'current core の main surface。見取り図の次に、共通語彙と読み方を揃える public asset になる。',
    currentState:
      '3/9 時点の card edition はあるが、表の route と current core 上での位置づけがまだ弱い。',
    founderBoundary:
      'どこまでを current core の本体として先出しするか、その範囲をどこまでにするかの Yes / No / Adjust が必要。',
  },
  {
    step: '03',
    title: '内部チェック用の仕事設計ガイド',
    state: 'internal_support',
    userValue:
      'debug と検証のために、条件の抜けや危険な案内を洗い出す。',
    businessRole:
      '公開本線の外側で品質を点検する内部面。',
    currentState:
      'legacy 実装はあるが、現状は debug と内部チェックの色が強く、利用者向けには出せない。',
    founderBoundary:
      '直近の public 判断は不要。内部面としてどこまで維持するかだけを決めればよい。',
  },
  {
    step: '04',
    title: '個別設計の private layer',
    state: 'private_layer',
    userValue:
      '公開面では扱いきれない案件を、個別条件と high-risk boundary を含めて人が引き受ける。',
    businessRole:
      'revenue layer。startup fee / recurring fee / bounded usage が乗るのはここからで、public asset の役割とは分ける。',
    currentState:
      '企業向けの private layer 構想はあるが、仕事設計コアとの一本道としてはまだ明示が弱い。',
    founderBoundary:
      'どの route を canonical intake にするか、どこまで promise するかの Yes / No / Adjust が必要。',
  },
];

export const jacCoreInternalSupport: JacCoreInternalSupport = {
  title: 'private layer を支える internal support',
  detail:
    '配慮設計アシストは public ladder の1段ではなく、Founder や将来の operator が質問の抜け、仮説、境界を整理する delivery engine として使う。ここを product promise にしないことが重要です。',
  bullets: [
    '当面は Founder-operated internal tool に固定する。',
    '次段階は self-serve ではなく operator-assisted を先に評価する。',
    '公開 CTA や pricing 表には直接出さず、private layer の裏側に置く。',
  ],
};

export const jacAgentRoles: JacAgentRole[] = [
  {
    title: 'Product Orchestrator',
    responsibility: '見取り図 / 26カード版 / ガイド / 配慮設計アシストを 1 製品として束ね、優先順位と判断線を管理する。',
    outputs: ['surface matrix', 'critical path', 'founder decision pack'],
    founderBoundary: '各 surface の public / review-first / internal の切り替え時に Founder へ返す。',
  },
  {
    title: 'Surface Strategist',
    responsibility: '各 route の役割と CTA を定義し、何を live に残し何を rewrite するかを決める。公開名から旧 `jac` を外す線もここで管理する。',
    outputs: ['route posture brief', 'CTA hierarchy', 'link cleanup plan'],
    founderBoundary: 'canonical public entry をどこに置くかの時点で Founder 判断が要る。',
  },
  {
    title: 'Safety And Promise Auditor',
    responsibility: '`AIカウンセラー`, `個別相談`, `buy now` などの危険な promise を洗い出し、公開境界を監査する。',
    outputs: ['no-go wording list', 'boundary memo', 'must-rewrite inventory'],
    founderBoundary: 'high-risk promise を残すか消すかの時点で Founder へ escalation。',
  },
  {
    title: 'Editorial Architect',
    responsibility: '26カード版、先行5章版、仕事設計ガイドの知識資産を整理し、現在の本体と開発履歴を切り分ける。',
    outputs: ['editorial packet', 'card-edition cleanup', 'archive note'],
    founderBoundary: 'どの editorial slice を public face に使うかで Founder が選ぶ。',
  },
  {
    title: 'Implementation Operator',
    responsibility: 'route rewrite、redirect、gating、build、preflight を実装し、表の見え方を壊さず差し替える。',
    outputs: ['page rewrites', 'route gating', 'preflight report'],
    founderBoundary: 'public route を切り替える直前の final go / hold。',
  },
  {
    title: 'Founder',
    responsibility: 'public posture、命名、trial の開き方、26カード版を本体に据える線を切る。',
    outputs: ['Yes / No / Adjust on key boundaries'],
    founderBoundary: 'これが唯一の最終境界。その他の draft 化までは AI 側で進める。',
  },
];

export const jacExecutionSteps: JacExecutionStep[] = [
  {
    step: '1',
    title: 'Canonical ladder と surface matrix を確定する',
    detail:
      '`見取り図 -> 26カード版` を公開本線として固定し、その外側に `仕事設計ガイド = 内部チェック`, `配慮設計アシスト = internal tool`, `先行5章版 = 役割終了の試作`, `編集基盤 = internal source` を置く。',
  },
  {
    step: '2',
    title: 'No-go promise を route ごとに掃除する',
    detail:
      '`AIカウンセラー`, `JAC個別相談`, `購入してダウンロード` など、今の capacity とズレる表現を surface ごとに洗い出して除去順を決める。',
  },
  {
    step: '3',
    title: '26カード版を current core の本体として切り出す',
    detail:
      '3/9 時点の `jac-26-card-edition` を基に、まず public-safe な 26カード版を current core の本体として切り出す。',
  },
  {
    step: '4',
    title: '先行5章版を役割終了の試作として退避する',
    detail:
      '`先行5章版アーカイブ` は新たな surface としては扱わず、必要時の参照資産としてだけ残す。',
  },
  {
    step: '5',
    title: '`/jac/guide` を内部チェック面として整理する',
    detail:
      '26カード版より前に出る旧導線を整理し、利用者向け導線には戻さず、debug と内部レビューの面として整理する。',
  },
  {
    step: '6',
    title: 'private layer と internal support の境界を固定する',
    detail:
      '個別設計の route で promise することと、配慮設計アシストを internal support に留めることを同時に fix し、相談事業への逆戻りを防ぐ。',
  },
  {
    step: '7',
    title: 'Founder Decision Pack を切る',
    detail:
      '最後に Founder が決めるのは少数の境界だけに絞る。26カード版、guide、canonical intake、命名の最終線を切る。',
  },
];

export const jacFounderDecisionGates = [
  '26フレームカード版を current core の本体としてどこまで先に出すか。',
  '個別設計の canonical intake をどこに置くか。enterprise/contact 中心にするか、別の route を用意するか。',
  '配慮設計アシストを internal tool に固定し、次段階を operator-assisted にするか later self-serve にするか。',
  '`AIカウンセラー` と `jac` のような naming を完全に止めるか、限定的に残すか。',
];

export const jacNoGoPromises = [
  'jac 公開名',
  'AIカウンセラー',
  'JAC個別相談',
  '購入してダウンロード',
  'open trial promise',
  'guidebook paid-first',
];
