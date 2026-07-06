export type NblVirtualNewsRealitySignal = {
  id: string;
  dateLabel: string;
  sourceName: string;
  sourceUrl: string;
  sourceStatusLabel: string;
  headline: string;
  nblReading: string;
  workConditionTags: readonly string[];
  relatedVirtualArticle: {
    label: string;
    href: string;
    description: string;
  };
  boundary: string;
};

export const nblVirtualNewsRealitySignals: readonly NblVirtualNewsRealitySignal[] = [
  {
    id: 'scsk-accommodation-guide-treatment-support-2026-07-06',
    dateLabel: '2026年7月6日',
    sourceName: '日経BP Human Capital Online',
    sourceUrl: 'https://project.nikkeibp.co.jp/HumanCapital/atcl/column/00084/070200064/',
    sourceStatusLabel: 'ユーザー提供記事 / 原文確認',
    headline: 'SCSK、合理的配慮のガイドを整備、治療との両立サポートとして支援金も',
    nblReading:
      '合理的配慮や治療との両立支援を、上司個人の理解や個別交渉だけに置かず、社内ガイド、相談線、費用支援、標準運用へ近づける動きとして読む。',
    workConditionTags: ['合理的配慮', '治療と仕事', '社内ガイド', '支援金', '相談線'],
    relatedVirtualArticle: {
      label: '関連するバーチャルニュースを読む',
      href: '/toolkit-studio/virtual-news/reasonable-accommodation-system-design',
      description:
        '架空企業A社の専門窓口・共通予算モデル。合理的配慮を個別交渉から会社の標準運用へ移す仮想ニュース。',
    },
    boundary:
      'NBLはこの記事の内容、制度適合性、企業施策の妥当性を評価・保証しません。実在ニュースは原文で確認し、ここでは仕事条件の読み方に戻すための接点として扱います。',
  },
] as const;
