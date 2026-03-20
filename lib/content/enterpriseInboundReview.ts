export type EnterpriseInboundHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type EnterpriseInboundCard = {
  title: string;
  summary: string;
};

export type EnterpriseInboundAudience = {
  title: string;
  detail: string;
};

export const enterpriseInboundHero: EnterpriseInboundHero = {
  eyebrow: 'Enterprise Inbound Prep',
  headline: '記事を読んで来る企業担当者には、`合理的配慮 = 職場設計` の入口を見せる。',
  subheadline:
    '記事ベースでは、合理的配慮を思いやりでなく仕事・情報・運用の設計として捉え、中途障害者の継続雇用、ニューロダイバーシティ、相談導線、支援連携の順序が重要論点として出ている。NBL の public entry もその論旨に合わせる。',
};

export const enterpriseInboundAudiences: EnterpriseInboundAudience[] = [
  {
    title: '人事・DEI・労務',
    detail: '合理的配慮や雇用の課題だけでなく、再現可能な運用と職場設計のヒントを探している。',
  },
  {
    title: '経営企画・DX・事業責任者',
    detail: 'AI導入を単なる効率化で終わらせず、仕事設計や組織の持続可能性に接続したい。',
  },
  {
    title: '産業保健・支援連携・現場管理',
    detail: '個別支援と現場運用の間にあるギャップを、方法論とworkflowで埋めたい。',
  },
];

export const enterpriseInboundCards: EnterpriseInboundCard[] = [
  {
    title: 'Lead With Workplace Design',
    summary: '入口では、合理的配慮を思いやりや特別対応ではなく、仕事・情報・運用の職場設計として説明する。',
  },
  {
    title: 'Start With Retention And Neurodiversity',
    summary: '企業が最初に取り組みやすい実務軸として、中途障害者の継続雇用とニューロダイバーシティを前に出す。',
  },
  {
    title: 'Make Disclosure Safety Visible',
    summary: '相談しやすい導線、秘密保持、情報共有範囲の設計を重要論点として扱い、数字だけを追うサイトに見せない。',
  },
  {
    title: 'Sequence Support After Design',
    summary: '最初から外部支援ありきにせず、まず職場設計で改善し、その次に支援連携を組み込む順序を出す。',
  },
];

export const enterpriseInboundJacNotes = [
  'JAC guide は、条件つきの職場設計を考える public method entry。',
  'JAC guidebook は sales-first checkout ではなく、仕事設計を試しに見直す low-friction trial asset として再定義する。',
  'free-first / overage-later を internal revenue posture に置く。',
  '個別ケースの最終判断や open consultation promise には寄せない。',
];
