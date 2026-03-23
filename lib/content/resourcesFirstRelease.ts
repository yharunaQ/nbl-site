export type ResourceCollection = {
  title: string;
  status: 'build_now' | 'review_first' | 'hold';
  summary: string;
  assets: string[];
  note: string;
  href: string;
  publicHref?: string;
};

export type ResourceReadingPath = {
  title: string;
  summary: string;
};

export type ResourceThemeTrack = {
  title: string;
  status: 'public_now' | 'next_up' | 'organizing';
  summary: string;
  signals: string[];
  note: string;
  publicHref?: string;
  ctaLabel?: string;
};

export const resourcesIntro = {
  eyebrow: 'NBL Resources',
  headline: '理解を深めるだけでなく、実装につながる resources を束ねる。',
  subheadline:
    '図解、4コマ、動画、レポートを、企業、支援者、行政、当事者が同じ地図で読める理解と方法論の series として整理して見せる。',
};

export const resourcesEditorialRules = [
  '大量の素材を直置きしない',
  'series 単位で見せる',
  '理解と方法論をつなぐ',
  '制度や体験談には注記を付ける',
];

export const resourcesReadingPaths: ResourceReadingPath[] = [
  {
    title: '基礎の地図から入る',
    summary: '合理的配慮、仕事のコンディションマップ、3レイヤーなどの core frameworks を先に見る。',
  },
  {
    title: 'シリーズで理解を深める',
    summary: '見えない障害や 4コマ、インフォグラフィックを series として読む。',
  },
  {
    title: '動画や資料で文脈を広げる',
    summary: 'YouTube や selected reports を、時点や使いどころと合わせて確認する。',
  },
];

export const resourcesThemeMapIntro =
  'content-inbox の整理軸を、そのまま公開ナビの下書きとして見える形にしました。すでに public に出せるもの、次に出せるもの、まだ文脈づけが必要なものを分けて扱います。特に雇用設計まわりは、企業課題だけでなく、制度、専門支援、慢性疾患支援まで含むテーマとして整理します。';

export const resourcesThemeTracks: ResourceThemeTrack[] = [
  {
    title: '基本概念',
    status: 'public_now',
    summary:
      '合理的配慮、相互作用モデル、医学モデルと社会モデル、エイブルイズムなど、NBL の前提をそろえる基礎群です。',
    signals: ['合理的配慮', '相互作用モデル', '医学モデルと社会モデル', 'エイブルイズム'],
    note: '最初の公開導線は、仕事設計の見取り図ページと selected explainers から先行させています。',
    publicHref: '/jac-foundations',
    ctaLabel: '基礎説明を見る',
  },
  {
    title: '難病理解',
    status: 'public_now',
    summary:
      '見えない障害、体調変動、IBD や膠原病の4コマ、支援機関との摩擦などを、理解と職場設計の両方につなげる軸です。',
    signals: [
      '見えないバックパック',
      'からだの中の天気予報',
      'IBDコミック4コマ',
      '難病就労支援ニーズ',
    ],
    note: '初回公開では「見えない障害の理解」シリーズから先に public-safe な束にしています。',
    publicHref: '/resources/invisible-disability',
    ctaLabel: 'シリーズを見る',
  },
  {
    title: '就労支援設計の変革テーマ',
    status: 'public_now',
    summary:
      '障害者雇用支援の世界標準、日本における変革課題、慢性疾患の支援、就労選択支援、標準職場設計26フレームなどを、企業、制度、専門支援、慢性疾患支援を同じ地図で読むテーマ群として整理する。',
    signals: [
      '障害者雇用支援の世界標準',
      '慢性疾患の支援',
      '日本における変革課題',
      '標準職場設計26フレーム',
    ],
    note:
      '企業向け説明だけに閉じず、制度・支援・慢性疾患支援まで含む public collection として公開しました。仕事設計の見取り図や見えない障害シリーズと往復しながら読む想定です。',
    publicHref: '/resources/work-support-transformation',
    ctaLabel: '変革テーマを見る',
  },
  {
    title: '地平2: エンゲージメント',
    status: 'organizing',
    summary:
      'AI時代の主体性、agency、働かなくていい社会の落とし穴など、NBL の思想と社会設計の論点を束ねる軸です。',
    signals: [
      'AI時代の主体性ガイド',
      '仁AI_Agency',
      '働かなくていい社会の落とし穴',
      '多様な個人が働きやすい社会設計',
    ],
    note: 'NBLらしさは強い一方で、初期公開では文脈不足になりやすいため、今は整理済みのまま温存します。',
  },
  {
    title: '公開動画',
    status: 'public_now',
    summary:
      'youtube-links の最新判断に合わせて、企業向け説明だけでなく、支援者や行政にも重要な explainers を選び、Resources 配下で束ねています。',
    signals: [
      '合理的配慮2.0',
      '相互作用モデル入門',
      '全体マップ',
      '能力主義の罠',
      '配慮疲れの神話',
    ],
    note:
      'チャンネルへ丸投げせず、現在 public_now と判断した動画だけを入口化しています。啓発系動画は企業、支援者、行政に共通する前提整理の入口として扱います。',
    publicHref: '/videos',
    ctaLabel: '動画を見る',
  },
];

export const resourcesCollections: ResourceCollection[] = [
  {
    title: '見えない障害の理解',
    status: 'build_now',
    summary: '4コマとインフォグラフィックを通して、見えにくい困りごとと誤解をほどくシリーズ。',
    assets: ['難病共通', 'からだの中の天気予報', '見えないバックパック', '難病×支援機関あるある'],
    note: '理解だけで終わらせず、支援設計や職場運用への橋渡しを意識する。',
    href: '/review/invisible-disability',
    publicHref: '/resources/invisible-disability',
  },
  {
    title: 'Core Frameworks And Methods',
    status: 'build_now',
    summary: '合理的配慮、仕事のコンディションマップ、3層 / 4象限など、NBL の基礎図解群。',
    assets: [
      '合理的配慮',
      '就労選択支援',
      '仕事のコンディションマップ',
      '障害者雇用の正常化',
      '障害者雇用の質の指標',
    ],
    note: '企業向けには、まず「障害者雇用の正常化」を入口に置き、その次に「質の指標」へ進める順がよい。',
    href: '/jac-foundations',
    publicHref: '/jac-foundations',
  },
  {
    title: '就労支援設計の変革テーマ群',
    status: 'build_now',
    summary:
      '障害者雇用支援の世界標準、日本における変革課題、慢性疾患の支援を、企業課題だけでなく制度・専門支援の課題まで含む public collection として整理したシリーズ。',
    assets: ['障害者雇用支援の世界標準', '日本における変革課題', '慢性疾患の支援'],
    note:
      '単発の制度批評や啓発画像としてではなく、NBL の社会OS事業における公開知識層として、仕事設計や Resources の他系列と接続して公開する。',
    href: '/review/employment-design',
    publicHref: '/resources/work-support-transformation',
  },
  {
    title: 'Selected Explainers',
    status: 'build_now',
    summary: 'YouTube の中から、初期公開に使いやすい基礎理解と方法論の動画を絞って見せる。',
    assets: [
      '合理的配慮入門',
      '相互作用モデル入門',
      '企業向け実践ガイド',
      '雇用の質',
      '難病就労連携',
    ],
    note: '制度、時点、体験談の注記を足しながら掲載する。',
    href: '/videos',
    publicHref: '/videos',
  },
  {
    title: 'Reports And Materials',
    status: 'review_first',
    summary: 'レポート、研究会まとめ、講演資料を、時点と文脈を添えて見せる。',
    assets: ['国際比較レポート', '研究会まとめ', '巻頭言', '講演資料'],
    note: '資料アーカイブではなく、主要なものだけを選抜する。',
    href: '/review/about',
  },
  {
    title: 'Hold',
    status: 'hold',
    summary: 'thought pieces、WIP、時点依存が強い制度図、未整理画像群は hold に置く。',
    assets: ['thought pieces', 'WIP PNGs', 'time-dependent policy graphics'],
    note: 'public truth に見える露出を避ける。',
    href: '/review/showcase-direction',
  },
];

export const resourcesGuardrails = [
  '体験談を一般化しない',
  '制度や法域の注記を省略しない',
  'WIP を直置きしない',
  'シリーズ単位で見せる',
];

export const resourcesReleaseRule =
  '初期公開では、Resources をアーカイブとして作らず、理解のシリーズと方法論の series を束ねる最小構成にとどめる。見せ方に迷う素材は、いったん hold に戻す。';
