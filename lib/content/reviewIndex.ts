export type ReviewCategory = {
  id: string;
  title: string;
  summary: string;
  items: ReviewIndexItem[];
};

export type ReviewIndexItem = {
  href: string;
  title: string;
  summary: string;
  status: 'foundational' | 'important' | 'operational';
};

export const reviewIndexCategories: ReviewCategory[] = [
  {
    id: 'site',
    title: 'Site And Public Narrative',
    summary: 'NBL を public にどう見せるか、サイト全体をどう組み立てるかの drafts。',
    items: [
      {
        href: '/review/relaunch-home',
        title: 'Relaunch Home',
        summary: '新生NBLの入口として、全体ビジョンと5つの stream を束ね直す draft。',
        status: 'foundational',
      },
      {
        href: '/review/relaunch-public-home',
        title: 'Relaunch Public Home',
        summary: 'temporary public site を置き換える将来の完成版トップに近い hidden draft。',
        status: 'foundational',
      },
      {
        href: '/review/showcase-direction',
        title: 'Showcase Direction',
        summary: 'プロのマルチエージェント視点で、NBL サイトを新時代の showcase にするための統合方針。',
        status: 'foundational',
      },
      {
        href: '/review/operating-loops',
        title: 'Operating Loops',
        summary: 'Founderが毎回指示しなくても回るための、NBLの定常ループと判断境界の draft。',
        status: 'foundational',
      },
      {
        href: '/review/value-compounding',
        title: 'Value Compounding',
        summary: 'NBL が何を倍々で増やすべきか、Founder role と自動運転 cadence を含めて整理した operating draft。',
        status: 'foundational',
      },
      {
        href: '/review/snapshot-automation',
        title: 'Snapshot Automation',
        summary: 'daily snapshot と weekly loop report を recurring job として固定するための operating draft。',
        status: 'foundational',
      },
      {
        href: '/review/site-architecture',
        title: 'Site Architecture',
        summary: 'Home / What We Do / Resources / 仕事設計 / About の全体地図。',
        status: 'foundational',
      },
      {
        href: '/review/core-content-status',
        title: 'Core Content Status',
        summary: '雇用設計コレクション、仕事設計の見取り図、26カード版、ガイド、配慮設計アシスト、先行5章版アーカイブの現状態と確認順を一枚で見る review。',
        status: 'foundational',
      },
      {
        href: '/review/work-design-frame-reference',
        title: '26フレームカード版',
        summary: '見取り図の次に置く、3/9 時点の card edition を基にした current core の hidden review。',
        status: 'important',
      },
      {
        href: '/review/work-design-guide',
        title: '仕事設計ガイド',
        summary: '利用者向けにはまだ出さない前提で、debug output と内部チェック観点を整理する review。',
        status: 'important',
      },
      {
        href: '/review/jac-core-product',
        title: '仕事設計コアプロダクト',
        summary: '仕事設計プロダクト群を最重要プロダクトとして再編するための agent 編成、surface matrix、critical path。',
        status: 'foundational',
      },
      {
        href: '/review/what-we-do',
        title: 'What We Do',
        summary: 'NBL が何を提供するかを public promise に落とした draft。',
        status: 'foundational',
      },
      {
        href: '/review/home-first-release',
        title: 'Home First Release',
        summary: '初回公開ホームの役割と導線の draft。',
        status: 'important',
      },
      {
        href: '/review/march20-release',
        title: 'March 20 Release',
        summary: '3月20日までにいったん public に出せる面と review 対象を束ねた sprint draft。',
        status: 'important',
      },
      {
        href: '/review/enterprise-inbound',
        title: 'Enterprise Inbound',
        summary: '3月20日以降の企業流入を前提に、入口と仕事設計領域の位置づけを調整する draft。',
        status: 'important',
      },
      {
        href: '/review/resources-first-release',
        title: 'Resources First Release',
        summary: '見えない障害、基礎図解、動画、資料をどう束ねるかの draft。',
        status: 'important',
      },
      {
        href: '/review/invisible-disability',
        title: 'Invisible Disability Series',
        summary: '見えない障害の理解シリーズの review draft。',
        status: 'important',
      },
      {
        href: '/review/employment-design',
        title: '雇用設計コレクション',
        summary: 'インフォグラフィック群から、雇用設計の読み方を 1 つの collection として束ね直す hidden review draft。',
        status: 'important',
      },
      {
        href: '/review/jac-positioning',
        title: '仕事設計領域の位置づけ',
        summary: '仕事設計プロダクト群を NBL 全体の中でどう位置づけるかの draft。',
        status: 'important',
      },
      {
        href: '/review/about',
        title: 'About',
        summary: 'NBL の本丸と AI 運営モデルを public にどう名乗るかの draft。',
        status: 'important',
      },
      {
        href: '/review/next-horizon',
        title: 'Next Horizon',
        summary: '当面の雇用R&Dと、その次の participation design の芽出しをどう並走させるかの draft。',
        status: 'important',
      },
    ],
  },
  {
    id: 'business',
    title: 'Business And Management',
    summary: 'NBL の事業構造、収益、design partner、package を詰めた drafts。',
    items: [
      {
        href: '/review/business-structure',
        title: 'Business Structure',
        summary: 'AI core / partner edge / human review boundary と revenue shape の整理。',
        status: 'foundational',
      },
      {
        href: '/review/business-validation',
        title: 'Business Validation',
        summary: 'design partner、recurring fee、boundary 仮説の検証用 draft。',
        status: 'important',
      },
      {
        href: '/review/design-partner-round',
        title: 'Design Partner Round',
        summary: '最初の design partner をどの相手に置くかの統合判断。',
        status: 'important',
      },
      {
        href: '/review/commercial-package-round',
        title: 'Commercial Package Round',
        summary: 'NBL OS Pilot と wrapper 設計の draft。',
        status: 'important',
      },
    ],
  },
  {
    id: 'ops',
    title: 'Discovery And Ops',
    summary: '実際の partner discovery をどう回すかの運用 drafts。',
    items: [
      {
        href: '/review/commercial-discovery-kit',
        title: 'Commercial Discovery Kit',
        summary: 'package brief、exclusions、boundary、call guide の一式。',
        status: 'operational',
      },
      {
        href: '/review/partner-discovery-ops',
        title: 'Partner Discovery Ops',
        summary: 'target condition、scorecard、outreach sequence、stop rules。',
        status: 'operational',
      },
      {
        href: '/review/partner-pipeline',
        title: 'Partner Pipeline',
        summary: 'A1 / A2 / B1 / C1 の匿名 slot で回す candidate pipeline。',
        status: 'operational',
      },
      {
        href: '/review/partner-sample-packet',
        title: 'Partner Sample Packet',
        summary: '匿名サンプルで、candidate input と ranking がどう埋まるかを見る。',
        status: 'operational',
      },
      {
        href: '/review/partner-dossier-kit',
        title: 'Partner Dossier Kit',
        summary: 'live candidate を dossier と round readout で founder-readable に持つための運用 draft。',
        status: 'operational',
      },
    ],
  },
];

export const reviewReadingOrder = [
  '/review/relaunch-home',
  '/review/relaunch-public-home',
  '/review/showcase-direction',
  '/review/operating-loops',
  '/review/value-compounding',
  '/review/snapshot-automation',
  '/review/site-architecture',
  '/review/core-content-status',
  '/review/work-design-frame-reference',
  '/review/work-design-guide',
  '/review/jac-core-product',
  '/review/what-we-do',
  '/review/march20-release',
  '/review/enterprise-inbound',
  '/review/employment-design',
  '/review/next-horizon',
  '/review/business-structure',
  '/review/design-partner-round',
  '/review/commercial-package-round',
  '/review/commercial-discovery-kit',
  '/review/partner-discovery-ops',
  '/review/partner-pipeline',
  '/review/partner-sample-packet',
  '/review/partner-dossier-kit',
];
