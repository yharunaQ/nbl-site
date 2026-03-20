export type NextHorizonHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type NextHorizonTrack = {
  title: string;
  role: string;
  currentForm: string;
  value: string;
};

export type NextHorizonReason = {
  title: string;
  detail: string;
};

export type NextHorizonQuestion = {
  title: string;
  detail: string;
};

export type NextHorizonGuardrail = {
  title: string;
  detail: string;
};

export const nextHorizonHero: NextHorizonHero = {
  eyebrow: 'Next Horizon',
  headline: '当面のR&Dと、その次の芽出しを、同時に持つ。',
  subheadline:
    '新生NBLは、障害・難病の雇用支援を重要な R&D 領域として深めながら、その先にある participation design の芽出しも止めない。DAO は一案にすぎず、個人の強み・興味と社会ニーズの新しい接続を試す実験群として再定義する。',
};

export const nextHorizonTracks: NextHorizonTrack[] = [
  {
    title: 'Horizon 1: 障害・難病の雇用支援を R&D にする',
    role:
      '合理的配慮、継続就労、見えない障害理解、JAC、仕事設計を通じて、現実の働きづらさを設計課題として扱う。',
    currentForm: 'What We Do / JAC / Resources / Enterprise inbound にすでに接続している。',
    value: 'いま役立つ実務と、再利用可能な社会OSの部品を同時に蓄積できる。',
  },
  {
    title: 'Horizon 2: participation design の次の芽を育てる',
    role:
      '既存の雇用制度だけに収まらない参加の形を、小さな実験として探索する。個人の強み・興味と社会ニーズの新しいマッチングを試す。',
    currentForm: 'DAO に限定せず、lab、matching experiment、small governance test など複数形式を許容する。',
    value: '指数関数的発展の最初の段階を、いまの事業の外側ではなく、内部の次期種まきとして始められる。',
  },
];

export const nextHorizonReasons: NextHorizonReason[] = [
  {
    title: '当面の実務だけでは本丸に届かない',
    detail:
      '障害・難病の雇用支援は重要な実装領域だが、それだけでは AI 時代の人間参加をどう作り直すかという本丸の問いを取り切れない。',
  },
  {
    title: 'それでも現実の R&D から離れてはいけない',
    detail:
      '未来の参加形態を考えるほど、person / job / environment / support / time の条件が見える現場から学ぶ必要がある。障害就労領域はその学習に強い入口になる。',
  },
  {
    title: '次の芽は、早い段階から小さく回す方がよい',
    detail:
      '完成形を先に決めるより、現実のニーズや反応を見ながら、matching、governance、contribution の最小実験を並走させる方が NBL らしい。',
  },
];

export const nextHorizonQuestions: NextHorizonQuestion[] = [
  {
    title: 'どうすれば強み・興味と社会ニーズを、雇用以外も含めて接続できるか',
    detail:
      '従来の job description や雇用区分だけでなく、micro contribution、project、learning、support exchange など複数単位で考える必要がある。',
  },
  {
    title: 'どんな小さな参加が価値として可視化されるか',
    detail:
      '成果物、レビュー、継続性、相互支援など、賃金や役職以外の評価軸をどう持つかが次の論点になる。',
  },
  {
    title: '人とAIの役割分担を、参加設計の中でどう引くか',
    detail:
      'AI が matching や叩き台生成を担い、人が意思決定や review を担う境界を、事業と同様に participation design 側でも整える必要がある。',
  },
  {
    title: 'どの制度や運営形態なら、現実の支援と未来の参加を橋渡しできるか',
    detail:
      'DAO は一案だが固定しない。community node、partner network、lab governance などを比較できる余地を残す。',
  },
];

export const nextHorizonGuardrails: NextHorizonGuardrail[] = [
  {
    title: '障害領域から全社会へ安易に一般化しない',
    detail:
      '障害・難病の現場は重要な R&D 領域だが、そこから得た知見をそのまま全員に当てはめず、条件差を明示して広げる。',
  },
  {
    title: 'DAO という形式を先に目的化しない',
    detail:
      '必要なのは参加設計の実験であり、DAO はその一手段にすぎない。raw prototype を public truth にしない。',
  },
  {
    title: '当面の実務支援を軽視しない',
    detail:
      '未来の participation design を語るほど、現在の雇用支援、合理的配慮、継続就労の学びを深める姿勢が必要になる。',
  },
  {
    title: '高リスク判断や制度判断を自動化しない',
    detail:
      '参加設計の実験でも、支援や権利に関わる高リスク判断は AI 任せにせず、review 境界を明確にする。',
  },
];
