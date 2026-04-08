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
  'テーマ別に整理した公開コンテンツの全体地図です。すでに公開しているもの、近日公開予定のもの、まだ整理中のものを分けて示します。';

export const resourcesThemeTracks: ResourceThemeTrack[] = [
  {
    title: '仕事設計の基礎フレーム',
    status: 'public_now',
    summary:
      '就労困難を個人の問題ではなく仕事・環境・支援の設計課題として読み替える27のフレーム。合理的配慮・相互作用モデル・ICFフレームなどの基礎概念も含む。',
    signals: ['27フレーム', '合理的配慮', '相互作用モデル', 'ICF'],
    note: 'Webで各フレームを読む、PDFでまとめて使う、の両方に対応しています。',
    publicHref: '/guide',
    ctaLabel: 'ガイドブックを見る',
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
    title: '障害別 仕事設計の見取り図',
    status: 'public_now',
    summary:
      '視覚・聴覚・肢体・内部・知的・精神・発達・高次脳機能・難病・ニューロダイバーシティの10分類を、従来の「障害特性リスト」ではなく「仕事設計として何を変えるか」の視点で整理したインフォグラフィックシリーズ。FCHMAの分析フレームを障害別に適用した実践的な見取り図です。',
    signals: ['診断名から支援を決めない', '仕事条件のミスマッチを特定', 'ICFベース', '10分類'],
    note: '27フレームガイドブックおよびはたらく相談室の知識ベースと接続しています。',
    publicHref: '/resources/disability-work-design',
    ctaLabel: '障害別 仕事設計を見る',
  },
  {
    title: '社会参加・主体性',
    status: 'organizing',
    summary:
      'AI時代の主体性、働き方の多様性、社会設計の論点を束ねる軸。就労支援の先にある参加設計の議論。',
    signals: [
      'AI時代の主体性',
      'agency',
      '多様な個人が働きやすい社会設計',
    ],
    note: '整理中。他のテーマと文脈をそろえながら順次公開します。',
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
    href: '/resources/work-design-foundations',
    publicHref: '/resources/work-design-foundations',
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
    title: '障害別 仕事設計ガイド',
    status: 'build_now',
    summary:
      '10の障害・疾患分類を、診断名からではなく「仕事設計として何を変えるか」の問いで整理したインフォグラフィックシリーズ。FCHMAの分析フレームを障害別に適用した実践的な見取り図です。',
    assets: [
      '視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害',
      'ニューロダイバーシティ', '精神障害', '発達障害', '高次脳機能障害', '難病',
    ],
    note: '27フレームガイドブック・はたらく相談室・見えない障害シリーズと往復しながら読む想定です。',
    href: '/resources/disability-work-design',
    publicHref: '/resources/disability-work-design',
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
  'Resources は知識ネットワークから生まれたコンテンツの配布ハブです。アーカイブとしてではなく、実践者がすぐに使えるシリーズ・ツール・資料を束ねる場所として機能させます。見せ方に迷う素材は整理中として明示します。';
