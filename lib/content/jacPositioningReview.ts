export type JacHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  signals: string[];
};

export type JacAudience = {
  title: string;
  summary: string;
};

export type JacPositionCard = {
  title: string;
  summary: string;
};

export type JacSurface = {
  id: string;
  state: 'explain_now' | 'review_first' | 'hold';
  title: string;
  role: string;
  summary: string;
  caution: string;
};

export type JacJourneyStep = {
  step: string;
  title: string;
  summary: string;
};

export type JacArtifact = {
  title: string;
  summary: string;
  whyItMatters: string;
};

export type JacGuardrail = {
  title: string;
  detail: string;
};

export const jacPositioningHero: JacHero = {
  eyebrow: 'NBL Work Design Core',
  headline: '仕事設計プロダクト群は、困りごとを条件つきの設計課題へ変換する。',
  subheadline:
    '旧 JAC 系資産を、NBL の現在のコアである仕事設計プロダクト群として再配置する。条件整理、配慮設計、見直し観点の叩き台を支えるが、公開名には `jac` を使わない。',
  primaryCta: '仕事設計の考え方を見る',
  secondaryCta: 'AIチームで状況整理を始める',
  signals: [
    '現在のコアは仕事設計プロダクト群である',
    '常設相談窓口ではない',
    '26カード版 / guide / draft / archive の役割を混ぜない',
  ],
};

export const jacPositioningAudiences: JacAudience[] = [
  {
    title: '企業・組織の意思決定者',
    summary: '仕事設計プロダクト群が自組織の配慮設計にどう関係するかを、過大な promise なしで理解したい人。',
  },
  {
    title: '就労支援の実務者',
    summary: '条件整理や配慮設計の見立てを、方法論として確認したい人。',
  },
  {
    title: '研究・企画関係者',
    summary: '仕事設計プロダクト群が知識基盤、workflow、NBL 全体の中でどう位置づくかを知りたい人。',
  },
];

export const jacPositioningCards: JacPositionCard[] = [
  {
    title: 'これは何か',
    summary: '困りごとを person / job / environment / support / time の条件で整理する、NBL の現在のコアである仕事設計プロダクト群。',
  },
  {
    title: 'これは何ではないか',
    summary: '人が常時受ける個別相談窓口でも、診断だけで答えを返すサービスでもない。',
  },
  {
    title: 'NBL 全体の中での位置',
    summary: '仕事設計プロダクト群は NBL の現在のコアだが、それだけで NBL 全体を言い切るのではなく、Resources、研究、理解促進コンテンツとつないで置く。',
  },
];

export const jacPositioningSurfaces: JacSurface[] = [
  {
    id: 'card-edition',
    state: 'review_first',
    title: '26フレームカード版',
    role: '現在の本体',
    summary: '見取り図の次に置き、各フレームをどう読むかを利用者向けに整える本体 surface。',
    caution: '旧 summary 版より後退させず、先行5章版より前に出る本体として扱う。',
  },
  {
    id: 'guide',
    state: 'explain_now',
    title: '仕事設計ガイド',
    role: '考え方と条件整理の入口',
    summary: '26カード版の次に、困りごとをどう条件つきで見るか、追加確認と次の一手を整理する。',
    caution: 'guide の役割を超えて個別助言の promise に見せない。',
  },
  {
    id: 'trial',
    state: 'hold',
    title: '配慮設計アシスト',
    role: 'Founder-operated internal tool',
    summary:
      '当面は Founder が外部依頼対応の中で使い、ノウハウを蓄積する内部ツールとして扱う。公開 product にはしない。',
    caution: '`AIカウンセラー` や open trial promise と読める表現は避け、将来も operator-assisted -> self-serve の順で段階を切る。',
  },
  {
    id: 'guidebook',
    state: 'review_first',
    title: '先行5章版アーカイブ',
    role: '開発履歴 / 編集資産',
    summary:
      '重点5章の試作を開発履歴として残し、ここで有効だったまとめ方だけを 26カード版や他の前段へ逆輸入する。',
    caution: '本体や公開候補と混ぜず、checkout や単体商品として前に出さない。',
  },
];

export const jacPositioningJourney: JacJourneyStep[] = [
  {
    step: '01',
    title: '仕事設計プロダクト群の役割を知る',
    summary: '現在のコアが何を整理し、何をまだ約束しないのかを先に理解する。',
  },
  {
    step: '02',
    title: '26カード版で共通語彙をつかむ',
    summary: '各フレームが何を見る枠なのか、どこで詰まりやすいか、最初の一手をどう決めるかを確認する。',
  },
  {
    step: '03',
    title: 'ガイドで条件不足を確かめる',
    summary: '困りごとをどう条件つきで捉えるか、追加確認と guardrail を guide で確認する。',
  },
  {
    step: '04',
    title: '必要なら AI チーム起動へ進む',
    summary: '条件不足や設計課題が残る場合だけ、NBL 全体の AI 起動導線へつなぐ。',
  },
  {
    step: '05',
    title: '現在のコアだけに閉じない',
    summary: 'Resources や研究、理解促進コンテンツと合わせて NBL 全体の文脈に戻す。',
  },
];

export const jacPositioningArtifacts: JacArtifact[] = [
  {
    title: '条件の見立て',
    summary: '困りごとを person / job / environment / support / time の条件へ分けて読む。',
    whyItMatters: '診断や印象だけで結論を出さず、設計課題として会話を進めやすくなる。',
  },
  {
    title: 'レイヤー地図',
    summary: '3レイヤーや関連図を使って、何が基礎理解で、何が個別化かを分ける。',
    whyItMatters: '理解の地図と個別支援の境界が混ざりにくくなる。',
  },
  {
    title: '次の問い',
    summary: '何がまだ不明で、どの条件確認が必要かを次の問いとして残す。',
    whyItMatters: '仕事設計プロダクト群を即答ツールでなく、設計を深める方法論として扱える。',
  },
  {
    title: '境界メモ',
    summary: 'どこまで guide で説明し、どこから AIチーム起動や人の確認が要るかを整理する。',
    whyItMatters: 'trial や public promise が過剰にならず、信頼を保ちやすい。',
  },
];

export const jacPositioningGuardrails: JacGuardrail[] = [
  {
    title: '個別相談 promise をしない',
    detail: '`JAC個別相談` のような表現は、常設の人的対応を誤認させるため初期公開では使わない。',
  },
  {
    title: '診断決め打ちを避ける',
    detail: '`診断名不要` のような断定ではなく、条件整理と制度文脈の確認が必要だと書く。',
  },
  {
    title: 'guide / trial / guidebook を混ぜない',
    detail: '知識入口、限定 trial、low-friction entry asset の役割を混ぜると責任範囲が曖昧になる。',
  },
  {
    title: '収益の主軸を単体コンテンツに置かない',
    detail:
      '26カード版や関連資料は trust と理解の入口に使い、収益の主軸は startup fee / recurring fee / bounded private usage に置く。',
  },
  {
    title: '公開名に jac を残さない',
    detail: 'legacy route や内部識別子は残っても、公開では仕事設計系の名前にそろえる。lineage は Methods のどこか 1 か所で説明する。',
  },
];

export const jacPositioningWordsToAvoid = [
  'JAC',
  'AIカウンセラー',
  'JAC個別相談',
  'PoC相談',
  '購入してダウンロード',
  '診断名不要',
  'JAC α',
];
