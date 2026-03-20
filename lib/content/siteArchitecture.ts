export type SiteAudience = {
  title: string;
  reason: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
};

export type SitePillar = {
  id: string;
  title: string;
  summary: string;
  primaryPage: string;
  currentAssets: string[];
  publishState: 'build_now' | 'review_first' | 'hold';
  note: string;
};

export type SitePageBrief = {
  slug: string;
  title: string;
  role: string;
  include: string[];
  avoid: string[];
  cta: string;
};

export const siteAudiences: SiteAudience[] = [
  {
    priority: 'P1',
    title: '企業・組織の意思決定者',
    reason: '初期リリースで最も AI チーム起動や導入整理につながりやすい主対象。',
  },
  {
    priority: 'P2',
    title: '支援者・実務者',
    reason: '方法論、図解、支援設計の資源を利用する中核読者。',
  },
  {
    priority: 'P3',
    title: '当事者・周囲の人',
    reason: '理解促進コンテンツの重要な読者であり、NBLの社会的意義を伝える層。',
  },
  {
    priority: 'P4',
    title: '研究・政策関係者',
    reason: '信頼性、根拠、国際比較、制度整理を補強する読者層。',
  },
];

export const sitePillars: SitePillar[] = [
  {
    id: 'offers',
    title: 'Offers & Implementation',
    summary: 'NBLが今、外部に約束できる支援内容と導入導線。',
    primaryPage: 'What We Do',
    currentAssets: ['AIチーム起動導線', 'サービス説明', 'JAC導入文脈', '企業向け実践ガイド動画'],
    publishState: 'build_now',
    note: '初期サイトでは最優先。何が提供可能かを曖昧にしない。',
  },
  {
    id: 'methods',
    title: 'Methods & Frameworks',
    summary: 'JAC、Playbook、仕事のコンディションマップ、合理的配慮の設計原則。',
    primaryPage: 'What We Do / JAC',
    currentAssets: ['JAC workflow', '体調レイヤー', '就職移行レイヤー', '職場運用レイヤー'],
    publishState: 'build_now',
    note: '理解だけでなく、どう設計するかを示す中核レイヤー。',
  },
  {
    id: 'resources',
    title: 'Resources & Understanding Content',
    summary: '見えない障害の理解、インフォグラフィック、4コマ、解説動画、資料。',
    primaryPage: 'Resources',
    currentAssets: ['見えない障害の理解 series', '図解群', 'YouTube explainers', 'レポート・資料'],
    publishState: 'review_first',
    note: '量が多いのでシリーズ単位に束ねて出す。',
  },
  {
    id: 'research',
    title: 'Research & Policy',
    summary: '国際比較、制度整理、ICF/EBPM、研究会資料、政策的論点。',
    primaryPage: 'Resources / Research',
    currentAssets: ['国際比較レポート', '研究会まとめ', '巻頭言', '政策・制度図解'],
    publishState: 'review_first',
    note: '時点や法域の注記が必要なものが多い。',
  },
  {
    id: 'vision',
    title: 'Vision & Narrative',
    summary: 'Next Being、CAN BY DESIGN、ポスト労働社会の受け皿、新しい仕事と社会設計のレイヤー。',
    primaryPage: 'About',
    currentAssets: ['Vision', 'Campaign', 'Founder note', '一部の思想系図版'],
    publishState: 'review_first',
    note: 'NBLらしさの核。初期サイトでは、誤読を止めつつ本丸が伝わる形に圧縮する。',
  },
  {
    id: 'labs',
    title: 'Next Horizon, Labs & Internal Incubation',
    summary: 'participation design の芽出し、DAO系試作、価格ドラフト、販売導線の試作、実験ページ。',
    primaryPage: 'Hold',
    currentAssets: ['DAO Participation Lab', 'guidebook sales MVP', 'pricing draft', 'market sizing draft'],
    publishState: 'hold',
    note: 'raw prototype を public truth としては出さないが、次の芽出しとして internal incubation を続ける。',
  },
];

export const sitePageBriefs: SitePageBrief[] = [
  {
    slug: 'home',
    title: 'Home',
    role: 'NBLの立ち位置、対象、主導線を最短で伝える。',
    include: [
      '何をしている組織か',
      '主対象は誰か',
      '今の主要CTA',
      '信頼の根拠を最小限に',
    ],
    avoid: [
      '大量のコンテンツ列挙',
      'pricing draft',
      '長いAGI思想説明',
      '未承認のlab導線',
    ],
    cta: 'AIチーム起動 / What We Do に絞る',
  },
  {
    slug: 'what-we-do',
    title: 'What We Do',
    role: '支援内容、方法論、導入の考え方をまとめる中核ページ。',
    include: [
      'Offers & Implementation',
      'Methods & Frameworks',
      '試行の進め方',
      'JACとの関係',
    ],
    avoid: [
      '資料アーカイブ化',
      '思想寄りコンテンツの過多',
    ],
    cta: 'AIチーム起動 / JAC詳細',
  },
  {
    slug: 'resources',
    title: 'Resources',
    role: '図解、4コマ、解説動画、レポートをシリーズ単位で束ねる。',
    include: [
      '見えない障害の理解 series',
      '基礎図解',
      '選抜動画',
      '主要レポート',
    ],
    avoid: [
      '未整理素材の直置き',
      'WIP画像',
      '法域注記なしの制度断定',
    ],
    cta: '関連リソースを見る / 考え方を深掘る',
  },
  {
    slug: 'jac',
    title: 'JAC',
    role: 'JACをNBL全体の中の1プロダクト/方法論として見せる。',
    include: [
      'JACの目的',
      'workflow',
      'guide / trial / guidebook の役割分担',
      '利用条件や現状',
      '導入とのつながり',
    ],
    avoid: [
      'NBL全体をJACに吸収させる見せ方',
      'AIカウンセラーや個別相談の promise',
      '未整備の販売導線',
    ],
    cta: 'JACガイド / AIチーム起動',
  },
  {
    slug: 'about',
    title: 'About',
    role: 'NBLの背景、ビジョン、運営者情報、長期方向を置く。',
    include: [
      'AIで人を不要にするのではないという説明',
      '新しい仕事と社会設計の本丸',
      'Founder',
      'Vision',
      'CAN BY DESIGN',
      '研究・実装のスタンス',
    ],
    avoid: [
      '市場試算や価格ドラフトの露出',
      '反人間的に見える automation rhetoric',
      '思索だけで終わる構成',
    ],
    cta: '本丸を知る / 運営モデルを知る',
  },
];

export const siteHoldItems = [
  'Raw DAO Participation Lab prototype',
  'Guidebook sales MVP',
  'Pricing draft',
  'Market sizing draft',
  '思想・創作寄りの単発図版',
];
