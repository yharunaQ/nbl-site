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
  eyebrow: 'NBL Method and Product Stream',
  headline: 'JAC は、困りごとを条件つきの設計課題へ変換する。',
  subheadline:
    'NBL の AI チームが使う中核方法論 / product stream として、条件整理、配慮設計、見直し観点の叩き台を支える。',
  primaryCta: 'JACの考え方を見る',
  secondaryCta: 'AIチームで状況整理を始める',
  signals: [
    'JAC は常設相談窓口ではない',
    'guide / trial / guidebook の役割を混ぜない',
    'JAC だけで NBL 全体を代表させない',
  ],
};

export const jacPositioningAudiences: JacAudience[] = [
  {
    title: '企業・組織の意思決定者',
    summary: 'JAC が自組織の配慮設計にどう関係するかを、過大な promise なしで理解したい人。',
  },
  {
    title: '就労支援の実務者',
    summary: '条件整理や配慮設計の見立てを、方法論として確認したい人。',
  },
  {
    title: '研究・企画関係者',
    summary: 'JAC が知識基盤、workflow、NBL 全体の中でどう位置づくかを知りたい人。',
  },
];

export const jacPositioningCards: JacPositionCard[] = [
  {
    title: 'What JAC Is',
    summary: '困りごとを person / job / environment / support / time の条件で整理する、NBL の中核方法論 / product stream。',
  },
  {
    title: 'What JAC Is Not',
    summary: '人が常時受ける個別相談窓口でも、診断だけで答えを返すサービスでもない。',
  },
  {
    title: 'How JAC Fits In NBL',
    summary: 'JAC は NBL 全体の 1 stream であり、Resources、研究、理解促進コンテンツと並ぶ位置に置く。',
  },
];

export const jacPositioningSurfaces: JacSurface[] = [
  {
    id: 'guide',
    state: 'explain_now',
    title: 'JAC Guide',
    role: '考え方と条件整理の入口',
    summary: 'まず guide で、困りごとをどう条件つきで見るか、JAC の workflow が何かを理解する。',
    caution: 'guide の役割を超えて個別助言の promise に見せない。',
  },
  {
    id: 'trial',
    state: 'review_first',
    title: 'JAC Trial',
    role: 'review-first の限定 surface',
    summary: '試用版や draft 生成は、公開初期では condition と access policy を明示した review-first 扱いに留める。',
    caution: '`AIカウンセラー` や open trial promise と読める表現は避ける。',
  },
  {
    id: 'guidebook',
    state: 'review_first',
    title: 'JAC Guidebook',
    role: 'low-friction entry asset',
    summary: 'guidebook は sales item より先に、JAC の考え方を気軽に試すための workbook / entry asset として再整理する。',
    caution: 'buy now の checkout 導線を先に出すと、JAC 全体の位置づけが sales first に見える。',
  },
];

export const jacPositioningJourney: JacJourneyStep[] = [
  {
    step: '01',
    title: 'JAC の役割を知る',
    summary: 'JAC が何を整理し、何をまだ約束しないのかを先に理解する。',
  },
  {
    step: '02',
    title: 'guide で考え方を見る',
    summary: '困りごとをどう条件つきで捉えるか、workflow と guardrail を guide で確認する。',
  },
  {
    step: '03',
    title: '必要なら AI チーム起動へ進む',
    summary: '条件不足や設計課題が残る場合だけ、NBL 全体の AI 起動導線へつなぐ。',
  },
  {
    step: '04',
    title: 'JAC だけに閉じない',
    summary: 'Resources や研究、理解促進コンテンツと合わせて NBL 全体の文脈に戻す。',
  },
];

export const jacPositioningArtifacts: JacArtifact[] = [
  {
    title: 'condition framing',
    summary: '困りごとを person / job / environment / support / time の条件へ分けて読む。',
    whyItMatters: '診断や印象だけで結論を出さず、設計課題として会話を進めやすくなる。',
  },
  {
    title: 'layered view',
    summary: '3レイヤーや関連図を使って、何が基礎理解で、何が個別化かを分ける。',
    whyItMatters: '理解の地図と個別支援の境界が混ざりにくくなる。',
  },
  {
    title: 'next questions',
    summary: '何がまだ不明で、どの条件確認が必要かを次の問いとして残す。',
    whyItMatters: 'JAC を即答ツールでなく、設計を深める方法論として扱える。',
  },
  {
    title: 'boundary note',
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
    title: 'JAC を NBL 全体と同一視しない',
    detail: 'JAC は中核だが、NBL 全体の研究、Resources、ビジョンまで代表しきるものとしては見せない。',
  },
];

export const jacPositioningWordsToAvoid = [
  'AIカウンセラー',
  'JAC個別相談',
  'PoC相談',
  '購入してダウンロード',
  '診断名不要',
  'JAC α',
];
