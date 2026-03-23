export type AboutHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type AboutKeyPoint = {
  title: string;
  summary: string;
};

export type AboutShift = {
  from: string;
  to: string;
};

export type AboutPillar = {
  title: string;
  summary: string;
};

export type AboutHorizon = {
  title: string;
  summary: string;
};

export type AboutSystemStep = {
  title: string;
  summary: string;
};

export type AboutGuardrail = {
  title: string;
  detail: string;
};

export const aboutReviewHero: AboutHero = {
  eyebrow: 'NBL Purpose',
  headline: 'AIで人を不要にするのではない。人間が人間として参加できる社会を増やす。',
  subheadline:
    'NBL は、AIで比較・整理・叩き台生成を進め、人が高リスク判断と対外責任を持つ事業を動かし、その余力で、障害や病気の有無にかかわらず個性や強みを発揮できる新しい仕事と社会設計の受け皿をつくる。',
};

export const aboutReviewKeyPoints: AboutKeyPoint[] = [
  {
    title: 'What NBL Is Not',
    summary: 'AI で人間を消す事業でも、従業員を不要にすること自体を目的にした事業でもない。',
  },
  {
    title: 'What NBL Is For',
    summary: '人間の限界を超える事業を AI で動かし、その余力を人間参加の器へ変える事業。',
  },
  {
    title: 'What The Core Mission Is',
    summary:
      '障害や病気の有無にかかわらず、個性や強みを発揮して社会参加できる新しい仕事と社会設計を生み出すこと。',
  },
  {
    title: 'What Builds Trust',
    summary:
      'AI-native だから信頼できるのではなく、どこで AI が進み、どこで人が責任を持つかを先に見せることで trust をつくる。',
  },
];

export const aboutReviewSystemSteps: AboutSystemStep[] = [
  {
    title: '現場R&D',
    summary: '障害・難病と仕事設計の現場で、何が本当に困難を生み、何が機能するかを見る。',
  },
  {
    title: '方法論化',
    summary: '見えてきた条件や介入を、仕事設計の見取り図や workflow の形へ整理し、比較可能にする。',
  },
  {
    title: '共有資源化',
    summary: '図解、動画、説明素材、boundary memo として公開・再利用可能な形にする。',
  },
  {
    title: 'participation design',
    summary: 'そこから、AI時代の新しい仕事や人間参加の器をどう増やすかへ接続する。',
  },
];

export const aboutReviewShifts: AboutShift[] = [
  {
    from: 'AIで人を不要にする',
    to: 'AIで人間の限界を超え、人が参加できる器を増やす',
  },
  {
    from: '人間が機械のように働く',
    to: '機械のように働かなくても参加できる設計をつくる',
  },
  {
    from: '個別相談を積み上げる',
    to: '知識、workflow、仕事設計の見取り図、resources を社会OSとして積み上げる',
  },
];

export const aboutReviewPillars: AboutPillar[] = [
  {
    title: 'What We Do',
    summary: 'いま動かせる支援と設計の entry point。',
  },
  {
    title: 'Methods',
    summary: '仕事設計の見取り図と設計原則を通じて、困りごとを読み替える方法論の層。',
  },
  {
    title: 'Resources',
    summary: '再利用可能な知識資源と理解促進コンテンツの層。',
  },
  {
    title: 'Operating Model',
    summary: 'AI中心でどう回り、どこで人が境界を持つかの運営層。',
  },
];

export const aboutReviewHorizons: AboutHorizon[] = [
  {
    title: 'Horizon 1: 障害・難病の雇用支援R&D',
    summary: '現在の現場で、仕事設計、相談導線、合理的配慮、継続就労、理解資源を改善する実装領域。',
  },
  {
    title: 'Horizon 2: participation design の芽出し',
    summary: 'Horizon 1 から得た知見をもとに、AI時代の新しい仕事と社会参加の器を探る次の実験領域。',
  },
];

export const aboutReviewGuardrails: AboutGuardrail[] = [
  {
    title: '反人間的に見せない',
    detail: 'AI を、人間の排除や雇用否定のために使うかのような public copy にしない。',
  },
  {
    title: '障害を欠如だけで語らない',
    detail: '障害や病気を、社会参加から外れる理由としてではなく、設計課題を見直す入口として扱う。',
  },
  {
    title: '未来予測だけで終わらせない',
    detail:
      'AGI や未来社会の抽象論だけにせず、今ある仕事設計の見取り図、resources、workflow へ接続する。',
  },
];

export const aboutReviewWordsToAvoid = ['AIで従業員不要', '人間の代替', '雇用の終わり', '労働不要'];
