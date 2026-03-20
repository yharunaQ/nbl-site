import { withManagedAssetVersion } from '@/lib/content/managedAssetVersion';

export type InvisibleDisabilityCard = {
  slug: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageOrientation: 'portrait' | 'landscape';
  role: string;
  whyNow: string;
  context: {
    highlight: string;
    workReason: string;
    caution: string;
    related: string;
  };
};

export type InvisibleDisabilitySection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  accent: string;
  cards: InvisibleDisabilityCard[];
};

export const invisibleDisabilityInitialLaunchSlugs = [
  'common-overview',
  'internal-weather',
  'invisible-backpack',
  'energy-wave',
  'support-friction',
] as const;

export const invisibleDisabilitySections: InvisibleDisabilitySection[] = [
  {
    id: 'intro',
    eyebrow: 'Series Intro',
    title: '病名より先に、共通する壁を見る',
    summary:
      '見えない障害の理解を、個別の病名知識だけで終わらせず、働く場で起きる共通の壁として捉え直す導入です。',
    accent: 'from-sky-100 via-cyan-50 to-white',
    cards: [
      {
        slug: 'common-overview',
        title: '難病共通',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/common-overview.png'),
        imageAlt: '難病に共通する就労上の困難をまとめた図解',
        imageOrientation: 'portrait',
        role: 'シリーズ全体の導入図',
        whyNow: '病名ごとの違いに入る前に、共通する仕事上の壁があることを示せるため。',
        context: {
          highlight: '病名が違っても、仕事上でぶつかる壁には共通構造があること。',
          workReason: '個別事情が分からなくても、仕事設計や環境条件との関係から理解を始められる。',
          caution: '困りごとの出方は、人、仕事、環境、支援の有無で変わる。',
          related: '仕事のコンディションマップ / 3層×4象限の考え方',
        },
      },
    ],
  },
  {
    id: 'hard-to-see',
    eyebrow: 'What Is Hard To See',
    title: '見えにくい負担を可視化する',
    summary:
      '外からは分かりにくい疲労、痛み、説明負荷を、その人の努力不足ではなく lived experience として見える形にするパートです。',
    accent: 'from-amber-100 via-orange-50 to-white',
    cards: [
      {
        slug: 'internal-weather',
        title: 'からだの中の天気予報',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/internal-weather.png'),
        imageAlt: '膠原病における見えない体内の不調を天気予報になぞらえた図解',
        imageOrientation: 'portrait',
        role: '見えない体内状態を伝える代表図',
        whyNow: '見た目と体内状態のズレを、もっとも直感的に伝えやすいため。',
        context: {
          highlight: '外からは見えにくくても、体内では複数の注意報が同時に起きていることがある。',
          workReason: '元気そうに見えることを理由に、必要な調整が見落とされやすい。',
          caution: 'すべての膠原病の人が同じ症状や同じ強さの困りごとを持つわけではない。',
          related: '合理的配慮の考え方 / 体調変動の前提を置く仕事設計',
        },
      },
      {
        slug: 'invisible-backpack',
        title: '見えないバックパック',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/invisible-backpack.png'),
        imageAlt: 'IBDの人が見えない負担を背負いながら働く様子を示した図解',
        imageOrientation: 'portrait',
        role: '見えない消耗を示す比喩図',
        whyNow: '元気そうと楽そうが同義ではないことを、やわらかく強く伝えられるため。',
        context: {
          highlight: '外から見えない負担を抱えながら働いていることがある。',
          workReason: '欠勤していないことと、余裕をもって働けていることは同じではない。',
          caution: 'IBD の当事者像を1つに固定しない。',
          related: '体調の波を前提にした運用設計 / 管理職向けの声かけ設計',
        },
      },
    ],
  },
  {
    id: 'misunderstandings',
    eyebrow: 'At Work',
    title: '職場で起きやすい誤解をほどく',
    summary:
      '当事者は症状そのものだけでなく、説明し続けることや通院の調整も背負っています。そこを見える化して、誤解を減らします。',
    accent: 'from-rose-100 via-pink-50 to-white',
    cards: [
      {
        slug: 'work-friction',
        title: '難病×仕事あるある',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/work-friction.png'),
        imageAlt: '難病のある人が仕事の中で直面しやすい困りごとをまとめた図解',
        imageOrientation: 'landscape',
        role: '仕事文脈の摩擦を可視化する図',
        whyNow: '企業や同僚が、どこで摩擦が起きやすいかをつかみやすいため。',
        context: {
          highlight: '日々の仕事の中で起きやすい摩擦や誤解。',
          workReason: '困りごとを個人の根性不足ではなく、仕事条件との関係で見直せる。',
          caution: 'ここにあるのは典型例であり、すべての人にそのまま当てはまるわけではない。',
          related: '仕事条件と症状の相互作用を見る視点',
        },
      },
      {
        slug: 'explanation-burden',
        title: '病名説明ルーレット',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/explanation-burden.png'),
        imageAlt: '病名や症状を説明し続ける負担を描いた4コマ漫画',
        imageOrientation: 'portrait',
        role: '説明負荷を伝える4コマ',
        whyNow: '周囲の善意だけでは解消しない負担を、印象に残る形で描けるため。',
        context: {
          highlight: '当事者が病名や困りごとを説明し続ける負担。',
          workReason: '説明負荷が高い職場ほど、本人は必要な相談をしにくくなる。',
          caution: '説明したい範囲や方法は人によって違う。',
          related: '病名ではなく、業務上必要な調整から会話を始める',
        },
      },
      {
        slug: 'medical-care-is-work',
        title: '通院も、仕事の一部',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/medical-care-is-work.png'),
        imageAlt: '通院が就労継続の条件の一部であることを描いた4コマ漫画',
        imageOrientation: 'portrait',
        role: '通院と就労の両立を伝える4コマ',
        whyNow: '理解を日常運用の話へつなげやすく、支援の必要性も見せやすいため。',
        context: {
          highlight: '通院や治療が、働き続けるための条件になっていること。',
          workReason: '通院を個人的事情とだけ見ると、継続就労の土台を見誤りやすい。',
          caution: '通院頻度や必要性は病状や時期で変わる。',
          related: '両立支援の考え方 / 配慮を前提にしたスケジュール設計',
        },
      },
    ],
  },
  {
    id: 'practice',
    eyebrow: 'What Helps',
    title: '理解を運用と支援につなげる',
    summary:
      '理解だけで終わらせず、職場での共有ルールや支援のつながり方まで見える形にするパートです。',
    accent: 'from-emerald-100 via-teal-50 to-white',
    cards: [
      {
        slug: 'energy-wave',
        title: '体調に“波”がある人と働く',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/energy-wave.png'),
        imageAlt: '体調の波を前提にした働き方の工夫を示す図解',
        imageOrientation: 'landscape',
        role: '理解から運用へ橋渡しする図',
        whyNow: '見えない障害の理解を、具体的な職場運用に結びつけられるため。',
        context: {
          highlight: '体調の波は気分ではなく、条件によって出力が急に落ちることがある。',
          workReason: '根性論ではなく、仕事の組み方や共有ルールの設計が必要になる。',
          caution: '波の出方、トリガー、必要な運用は人によって異なる。',
          related: '青黄赤の運転モード / 合図と引継ぎの設計',
        },
      },
      {
        slug: 'support-friction',
        title: '難病×支援機関あるある',
        imageSrc: withManagedAssetVersion('/resources/invisible-disability/support-friction.png'),
        imageAlt: '難病と支援機関の間で起こりやすいすれ違いをまとめた図解',
        imageOrientation: 'landscape',
        role: '支援や制度のすき間を示す図',
        whyNow: 'NBLが理解だけでなく、支援設計につなぐ存在であることを示せるため。',
        context: {
          highlight: '困りごとは本人だけでなく、支援や制度の設計にも左右される。',
          workReason: '個人の努力だけで解決しない論点を見える化できる。',
          caution: '支援資源や制度の使いやすさは地域や法域で異なる。',
          related: '難病就労連携「全体マップ」活用セミナー',
        },
      },
    ],
  },
];

export const invisibleDisabilityStats = [
  { label: 'Initial Assets', value: '8' },
  { label: 'Minimum Launch Set', value: '5' },
  { label: 'Related Videos', value: '1-2' },
];

export const invisibleDisabilityGuardrails = [
  '1つの体験を普遍化しない',
  '診断名だけで結論づけない',
  'かわいそう framing に寄せすぎない',
  '理解を職場の実装導線と切り離しすぎない',
];

export const invisibleDisabilityVideos = [
  {
    title: '難病就労連携「全体マップ」活用セミナー（導入15分）',
    url: 'https://youtu.be/dgO_MYf2T8A',
    note: '理解を支援設計につなげる補助動画。',
  },
  {
    title: '【ゆっくり解説】合理的配慮2.0入門',
    url: 'https://youtu.be/mSyzmOVP_Ek',
    note: '基礎理解を制度と運用の言葉へ接続する補助動画。',
  },
];
