export type RelaunchHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type RelaunchPosition = {
  title: string;
  detail: string;
};

export type RelaunchReason = {
  title: string;
  detail: string;
};

export type RelaunchAudience = {
  title: string;
  detail: string;
};

export type RelaunchOffer = {
  title: string;
  detail: string;
  note: string;
};

export type RelaunchImplementationPoint = {
  title: string;
  detail: string;
};

export type RelaunchStream = {
  title: string;
  summary: string;
  href: string;
};

export type RelaunchPhase = {
  phase: string;
  title: string;
  detail: string;
};

export type RelaunchGuardrail = {
  title: string;
  detail: string;
};

export const relaunchHomeHero: RelaunchHero = {
  eyebrow: 'NBL Relaunch',
  headline: 'AIが働く時代に、人間の参加を設計し直す。',
  subheadline:
    '新生NBLは、障害就労や合理的配慮を重要な実装領域として扱いながら、仕事設計、参加設計、再利用可能な社会OSの部品を積み上げる AI-native team として組み直す。',
};

export const relaunchHomePositions: RelaunchPosition[] = [
  {
    title: 'AIで人を不要にするのではない',
    detail:
      '目指すのは、人間を消すことではなく、AIで人間の限界を超える実装を進めながら、人が人として参加できる器を広げることです。',
  },
  {
    title: '障害就労は重要な実装領域の一つ',
    detail:
      '障害や病気のある人の働きづらさは、仕事や社会の設計課題が見えやすく現れる領域です。そこを入口に、より広い participation design と次の芽出しへ接続します。',
  },
  {
    title: '個別相談を積み上げるだけでは終わらない',
    detail:
      '知識、workflow、JAC、resources を再利用可能な社会OSの部品として蓄積し、毎回ゼロから始めない運営へ寄せます。',
  },
];

export const relaunchHomeReasons: RelaunchReason[] = [
  {
    title: '働きづらさは設計の歪みが見えやすい',
    detail:
      '個人の問題に見えやすい困りごとほど、仕事、情報、運用、支援の設計課題が表に出やすくなります。',
  },
  {
    title: 'いま役立つことと長期ビジョンをつなげやすい',
    detail:
      '合理的配慮、継続就労、相談導線の改善は、当面の実務支援であると同時に、人間参加の設計を更新する実験でもあります。',
  },
  {
    title: 'AI時代の Human-in-Command を具体化できる',
    detail:
      '高リスク判断を機械任せにしない境界や、AIが担う部分と人が担う部分の切り分けを、現実の運用で鍛えられます。',
  },
];

export const relaunchHomeAudiences: RelaunchAudience[] = [
  {
    title: '企業・組織の意思決定者',
    detail:
      '人事、DEI、産業保健、DX、経営企画などの立場から、どこから設計を見直せるかを知りたい人。',
  },
  {
    title: '支援者・実務者',
    detail:
      '方法論、図解、支援設計の資源を現場へどう接続するかを知りたい人。',
  },
  {
    title: '当事者・周囲の人',
    detail:
      'NBL がどんな考え方で働きづらさを扱い、どんな参加のあり方を目指しているかを知りたい人。',
  },
  {
    title: '研究・政策関係者',
    detail:
      '背景にある研究、制度整理、国際比較と、実装のつながりを見たい人。',
  },
];

export const relaunchHomeOffers: RelaunchOffer[] = [
  {
    title: 'AIチームによる論点整理',
    detail:
      '公開情報や状況メモをもとに、何が論点か、どこから始めるかを AI チームが整理し、設計単位へ落とします。',
    note: '人が常時受ける相談窓口のようには見せない。',
  },
  {
    title: 'AIチームによる実装設計・試行',
    detail:
      '配慮、運用、文書、手順の叩き台を組み立て、小さな試行と再利用可能な workflow の形へ変えます。',
    note: '期間や人の伴走を fixed promise として先に売らない。',
  },
  {
    title: '公開resources と AI教材',
    detail:
      '図解、動画、基礎資料、説明素材を文脈つきで束ね、現場で再利用できる社会OSの共有資源にします。',
    note: 'sales-first より、まず役立ちが広がる入口として公開する。',
  },
];

export const relaunchHomeImplementationPoints: RelaunchImplementationPoint[] = [
  {
    title: '働きづらさは設計の歪みが見えやすい',
    detail:
      '困りごとが個人の問題に見える場面ほど、仕事、情報、運用、支援の設計課題が表に出やすくなります。',
  },
  {
    title: '合理的配慮は参加設計の具体例になる',
    detail:
      '合理的配慮、継続就労、相談導線、秘密保持の設計は、AI時代の人間参加を現実の実務へつなぐ入口です。',
  },
  {
    title: '見えない障害やニューロダイバーシティを扱える',
    detail:
      '見えにくい困難の理解と環境調整を扱うことで、標準化しすぎた働き方から離れた新しい仕事設計を考えられます。',
  },
];

export const relaunchHomeStreams: RelaunchStream[] = [
  {
    title: 'What We Do',
    summary: 'NBL が今、外部に約束できる支援内容と導入の考え方。',
    href: '/review/what-we-do',
  },
  {
    title: 'Methods & Frameworks',
    summary: 'JAC、仕事のコンディションマップ、合理的配慮の設計原則などの方法論。',
    href: '/review/jac-positioning',
  },
  {
    title: 'Resources & Understanding',
    summary: '見えない障害、図解、動画、基礎資料をシリーズ単位で束ねる層。',
    href: '/review/resources-first-release',
  },
  {
    title: 'Vision & Participation Design',
    summary: 'AIが働く時代の人間参加、新しい仕事、社会設計の本丸を扱う層。',
    href: '/review/about',
  },
  {
    title: 'Business & Operating Model',
    summary: 'AI-native team としてどう回すか、事業構造をどう作るかの層。',
    href: '/review/business-structure',
  },
];

export const relaunchHomePhases: RelaunchPhase[] = [
  {
    phase: 'Now',
    title: 'Public-safe な入口を揃える',
    detail:
      'トップ、JAC foundations、動画一覧、企業向け整理など、誤解を生みにくい入口を先に整える。',
  },
  {
    phase: 'Next',
    title: '新生NBLの中核ページを hidden review で組む',
    detail:
      'What We Do、Resources、About、JAC を再統合し、temporary public site を置き換えられる骨格を作る。',
  },
  {
    phase: 'Later',
    title: '本公開へ段階的に差し替える',
    detail:
      'temporary public mode を外し、整理済みの relaunch pages から順に公開へ戻していく。',
  },
];

export const relaunchHomeGuardrails: RelaunchGuardrail[] = [
  {
    title: '反人間的に見せない',
    detail: 'AI を、人間の排除や雇用否定のために使うかのような public copy にしない。',
  },
  {
    title: '障害就労だけに閉じない',
    detail:
      '障害や病気の文脈を重要な実装領域として扱いつつ、仕事設計や参加設計の大きな問いとの関係を見失わない。',
  },
  {
    title: '未来思想だけで終わらせない',
    detail: '大きなビジョンだけでなく、JAC、resources、workflow、企業向け整理など今ある入口へ接続する。',
  },
  {
    title: 'AI運営主体を曖昧にしない',
    detail: 'AI チームが担うことと、人が常時対応するわけではないことを隠さずに示す。',
  },
  {
    title: '診断や高リスク判断を機械任せにしない',
    detail: '診断決め打ちや個別判断の自動化を promise にせず、境界と review の必要性を先に示す。',
  },
];
