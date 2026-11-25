export const firstDayAssistance = {
  slug: 'first-day-assistance',
  href: '/preview/axiom-next-nbl-v2/first-day-assistance',
  title: '入社初日の介助は、応募を決める前に確かめられるか',
  summary: '松江のデザイナーは、通勤と勤務中の介助を使いながら、出社と在宅を組み合わせた。あなたの地域では、応募前に誰からどんな返事がもらえるだろう。',
  searchable: '松江 松江市 デザイナー 応募前 入社 初日 通勤 職場 在宅 介助 送迎 就労支援 特別事業 地域',
} as const;

export const nextSiteHome = {
  title: '望む仕事を選べる条件をつくる｜Next Being Lab',
  summary: '障害のある人が必要な支援を使いながら望む仕事を選べるように。相談事例、仕事設計ガイド、支援実践・体制改善ツールと、地域や職場への具体的な提案。',
} as const;

const base = '/preview/axiom-next-nbl-v2';
export const regionalMaterialProductionHref = `${base}/projects#regional-material-production`;
export const nextSiteFlagships = [
  {
    audience: '働く人と相談相手',
    title: '自分の選び方を考える',
    name: '相談事例',
    body: '希望と別案を比べ、誰に何を伝えるか選ぶ。',
    href: `${base}/case-readings`,
    relatedHref: `${base}/case-readings#support-response-with-person-control`,
    topicAction: '出社・在宅・保留などの案を持ち、聞きたいことと相手を自分で選ぶ。',
  },
  {
    audience: '仕事を任せる職場',
    title: '仕事と勤務を組み替える',
    name: '仕事設計ガイド',
    body: '任せる工程、勤務、引継ぎ、評価を決める。',
    href: `${base}/work-design-views-guide`,
    relatedHref: `${base}/work-design-views-guide?system=WDG2-06#guide-detail`,
    topicAction: '出社と在宅それぞれで任せる工程や設備、評価を考え、返事ができる日を示す。',
  },
  {
    audience: '支援者・機関・地域',
    title: '必要な人と予算をそろえる',
    name: '支援実践・体制改善ツール',
    body: '支援を担う人と時間、代行、費用の負担先を決める。',
    href: `${base}/support-organization-checklist`,
    relatedHref: `${base}/support-organization-checklist?theme=network&view=organization#support-workbench`,
    topicAction: '通勤と勤務中の介助を担う人、時間、代行、支払元を会議の議題にする。',
  },
] as const;

export const workForkEditions = {
  'edition-inspection': {
    issue: 'inspection',
    title: '傷に気づいた人が、次の商品会議にいない。',
    summary: '検品で品物の傷を見つけた人は、次の仕事を決める場に呼ばれるだろうか。職場で上演できる会議用の台本と、判断を持ち帰る問いを収録。',
    image: '/images/nbl-issue-box-cover.webp',
    imageWidth: 1450,
    imageHeight: 967,
    imageAlt: '検品台で二人が、角のへこんだ箱を調べている。奥では会議が進んでいる。',
    searchable: '創刊号 検品 傷 箱 商品会議 包装 仕事 参加 評価 会議 上演 台本',
  },
  'edition-ict': {
    issue: 'ict',
    title: '入力担当。けれど、操作を教わっているのは誰？',
    summary: '介護施設の事業所報告を手がかりに、同僚に端末操作を教える時間が勤務や評価に表れているかを考える。',
    image: '/images/nbl-issue-ict-cover.webp',
    imageWidth: 1200,
    imageHeight: 800,
    imageAlt: '介護施設の職員が、同僚に端末操作を説明する架空の場面を描いたイラスト。',
    searchable: '第2号 役割 評価 岩手 JEED 端末 タブレット 介護 入力 仕事 ICT 操作 教える',
  },
} as const;

export type WorkForkEditionSlug = keyof typeof workForkEditions;

export function isWorkForkEditionSlug(slug: string): slug is WorkForkEditionSlug {
  return Object.prototype.hasOwnProperty.call(workForkEditions, slug);
}
