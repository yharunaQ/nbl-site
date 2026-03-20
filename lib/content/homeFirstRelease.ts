export type HomeAudience = {
  title: string;
  description: string;
};

export type HomeOfferCard = {
  title: string;
  summary: string;
};

export type HomeStreamCard = {
  title: string;
  summary: string;
  href: string;
};

export const homeFirstReleaseHero = {
  eyebrow: 'Next Being Lab | AI-Native Social OS for Work Design',
  headline: '働きづらさを、個人の問題だけにしない。',
  subheadline:
    'NBL は、AI運営のバーチャルチームとして、論点整理、JAC、図解、workflow を積み上げ、AI時代の社会OSを設計します。',
  primaryCta: 'AIチームで状況整理を始める',
  secondaryCta: 'What We Do を見る',
};

export const homeFirstReleaseAudiences: HomeAudience[] = [
  {
    title: '企業・組織の意思決定者',
    description: '人事、DEI、産業保健、DX、経営企画などの立場から、何を整理できるか、どこから始めるかを短時間で理解したい人。',
  },
  {
    title: '支援者・実務者',
    description: '方法論や支援設計を現場にどう活かせるかを知りたい人。',
  },
  {
    title: '当事者・周囲の人',
    description: 'NBL がどんな考え方で働きづらさを扱うのかを知りたい人。',
  },
  {
    title: '研究・政策関係者',
    description: '背景にある研究や制度整理とのつながりを知りたい人。',
  },
];

export const homeFirstReleaseOffers: HomeOfferCard[] = [
  {
    title: 'AIチームによる論点整理',
    summary: '現場の困りごとを整理し、どこから進めるかの叩き台を AI チームが作る。',
  },
  {
    title: 'AIチームによる実装設計・試行',
    summary: '小さく試す前提で、配慮と運用の形を AI チームが設計する。',
  },
  {
    title: '公開resources と AI教材',
    summary: '合理的配慮、仕事設計、働き方の見直しに関わる図解、動画、レポートを、最初の役立ちとして広く共有する。',
  },
];

export const homeFirstReleaseProofPoints = [
  'AI チームで research と implementation の両方を扱う',
  '個別対応を超えて、再利用可能な社会OSの部品を蓄積する',
  '障害者雇用だけに閉じず、仕事設計と組織運用まで視野に入れる',
  '図解、動画、資料を resources として束ねている',
  'JAC を方法論 / product stream として位置づけている',
  '人の相談窓口ではなく、AI 起動から見直しまでの流れを設計対象として扱う',
];

export const homeFirstReleaseStreams: HomeStreamCard[] = [
  {
    title: 'What We Do',
    summary: '支援内容、進め方、方法論の中核ページ。',
    href: '/review/what-we-do',
  },
  {
    title: 'Resources',
    summary: '図解、4コマ、動画、レポートをシリーズ単位で束ねる。',
    href: '/review/invisible-disability',
  },
  {
    title: 'JAC',
    summary: 'NBL 全体の中の 1 stream として位置づける。method / product stream としての見せ方を review する。',
    href: '/review/jac-positioning',
  },
  {
    title: 'About',
    summary: 'NBL の本丸、Vision、運営のスタンスを置く。`AIで人を不要にする` 誤読を止める。',
    href: '/review/about',
  },
];

export const homeFirstReleaseHoldItems = [
  'pricing',
  'alpha / beta',
  'guidebook sales-first checkout',
  'DAO / lab',
  '長い vision explanation',
];
