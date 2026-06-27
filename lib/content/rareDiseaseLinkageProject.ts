import { foundingPartnerProjectCard } from '@/lib/content/foundingPartnersProject';

export type ProjectCard = {
  title: string;
  description: string;
  href: string;
  tag?: string;
};

export type RareDiseasePageLink = {
  label: string;
  href: string;
};

export type RareDiseasePattern = {
  title: string;
  observation: string;
  response: string;
};

export type RareDiseaseResource = {
  title: string;
  target: string;
  use: string;
  status: string;
};

export type RareDiseasePartnerRole = {
  partner: string;
  role: string;
  boundary: string;
};

export const rareDiseaseProjectRoute = '/projects/rare-disease-linkage';

export const rareDiseaseMandatoryDisclaimer =
  '本資料は、医療判断、法律判断、個別の就職あっせんを行うものではありません。個別の相談は、主治医、医療機関、難病相談支援センター、ハローワーク、自治体等の適切な窓口にご相談ください。';

export const rareDiseaseNoPersonalInfoNotice =
  '個人の病状、診断名、具体的な個別相談内容、第三者の個人情報は入力しないでください。';

export const projectCards: ProjectCard[] = [
  foundingPartnerProjectCard,
  {
    title: '難病地域連携実装プロジェクト',
    description:
      '医療、福祉、雇用、生活支援のあいだで、本人が同じ説明を何度も背負わされない地域連携の型を作ります。',
    href: rareDiseaseProjectRoute,
    tag: '地域連携',
  },
  {
    title: '福祉・医療・雇用の連携設計・人材育成',
    description:
      '障害者の就労支援に関わる様々な関係者が、「働く」と「参加する」の専門支援を提供できるように応援していきます。',
    href: '/projects/employment-mobility',
    tag: '制度設計・人材育成',
  },
];

export const rareDiseasePageLinks: RareDiseasePageLink[] = [
  { label: '旗艦ページ', href: rareDiseaseProjectRoute },
  { label: '無料資料', href: `${rareDiseaseProjectRoute}/resources` },
  { label: '共同実施', href: `${rareDiseaseProjectRoute}/workshop` },
  { label: '病院向け', href: `${rareDiseaseProjectRoute}/hospital` },
  { label: 'レビュー協力', href: `${rareDiseaseProjectRoute}/partner` },
];

export const rareDiseaseHero = {
  eyebrow: 'NBL Rare Disease Linkage Project',
  title: '難病支援を、丸投げから情報付き橋渡しへ。',
  subtitle:
    '医療、福祉、雇用、生活支援のあいだで、本人が同じ説明を何度も背負わされない地域連携の型を作ります。',
  note: 'NBLは既存機関を置き換えるのではなく、相談の準備、情報付きつなぎ、役割分担、振り返りを支える共通言語と実務資料を共同設計します。',
};

export const rareDiseaseBoundaryPrinciples = [
  '本人・家族・患者会・公的支援機関は顧客ではなく、共同設計者・レビュー協力者として位置付ける。',
  '病院、研究班、企業、財団、自治体、既存研修・協議会・委託枠などを、持続可能な運営の費用負担候補として分けて考える。',
  '個別の病状判断、法律判断、就職先のあっせん、成果保証は行わない。',
  '既存機関を批判するのではなく、情報が途切れる場面と橋渡しの型を見える化する。',
  '就労を押しつけず、生活、治療、体調変動、本人の希望を含めて次の相談につなげる。',
];

export const rareDiseaseInteractionPatterns: RareDiseasePattern[] = [
  {
    title: '遅すぎる介入',
    observation: '退職、休職長期化、生活困窮が近づいてから初めて就労・生活支援につながる。',
    response: '医療機関や保健領域で、早い段階から相談先と準備情報を渡せる初動フローを作る。',
  },
  {
    title: '縦割り抱え込み',
    observation: '医療、福祉、雇用、生活支援がそれぞれ動き、本人が説明と調整を背負う。',
    response: '機関ごとの役割を責めずに整理し、情報付きつなぎシートで次の窓口に橋をかける。',
  },
  {
    title: '地理的空白と一点集中',
    observation: '専門窓口や経験者に相談が集中し、地域差がそのまま支援差になりやすい。',
    response: '地域内の相談資源を棚卸しし、難病相談支援センター等に依存しすぎない分担表を作る。',
  },
  {
    title: '企業との情報断絶',
    observation: '企業には一般論しか届かず、本人には何を伝えればよいか分からない不安が残る。',
    response: '診断名ではなく、働き方に関係する配慮事項、変動、相談窓口を伝える準備資料を整える。',
  },
  {
    title: '制度の谷間',
    observation: '障害者手帳、福祉サービス、雇用支援、医療制度の条件差で支援が途切れる。',
    response: '使える制度を断定せず、相談先、確認事項、次に聞くべき問いを整理する。',
  },
  {
    title: '医療情報と就労支援の断絶',
    observation: '医療側の情報が就労支援へ翻訳されず、就労側の困りごとが医療側に戻らない。',
    response: '医療判断そのものではなく、就労相談に必要な情報の粒度と戻し方を共同で決める。',
  },
  {
    title: '就職後フォローの空白',
    observation: '就職や復職をゴールにすると、体調変動や職場調整の見直しが遅れる。',
    response: '就職後を中間地点と見て、3か月、6か月、12か月で相談先と見直し項目を確認する。',
  },
];

export const rareDiseaseImplementationLayers = [
  {
    title: '本人・家族レベル',
    points: ['相談準備', '説明負担の軽減', '希望と不安の言語化', '次に聞く問いの整理'],
  },
  {
    title: '支援者・機関レベル',
    points: ['役割分担', '情報付きつなぎ', '初動フロー', '振り返りの型'],
  },
  {
    title: '地域・制度レベル',
    points: ['資源の棚卸し', '協議会・研修への接続', '実装レビュー', '継続費用の分担'],
  },
];

export const rareDiseaseResources: RareDiseaseResource[] = [
  {
    title: '情報付きつなぎシート',
    target: '医療、保健、福祉、雇用の次の窓口につなぐ担当者',
    use: '本人に同じ説明を繰り返させず、次の相談に必要な範囲の情報だけを整理する。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '本人・家族向け相談準備シート',
    target: '本人、家族、患者会、相談前の支援者',
    use: '病名や詳しい病状ではなく、相談したいこと、働き方の希望、不安、確認事項を整理する。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '地域連携フロー作成ワークシート',
    target: '自治体、協議会、支援機関、研究班',
    use: '地域で誰がどの段階を担うかを、初動、相談、就職後、見直しに分けて可視化する。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '緊急介入トリガー一覧',
    target: '医療、保健、相談支援、職場関係者',
    use: '生活困窮、退職危機、孤立、体調悪化など、早めにつなぐべき場面を共通化する。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '機関別役割分担表',
    target: '地域連携に参加する複数機関',
    use: '医療機関、保健所、難病相談支援センター、ハローワーク、就業・生活支援センター等の役割を整理する。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '院内初動フロー作成シート',
    target: '病院、医療相談室、地域連携室、研究班',
    use: '外来、相談室、地域連携室から次の相談先へつなぐ初動の流れを整える。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '自治体・協議会向け企画書テンプレート',
    target: '自治体、協議会、委託事業の検討者',
    use: '地域連携の目的、参加者、成果物、レビュー手順を短く説明する。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '病院向け院内・地域連携研修企画書テンプレート',
    target: '病院、研究班、医療相談部門',
    use: '院内研修や既存会議に組み込みやすい形で、情報付き橋渡しを扱う。',
    status: 'v0.1レビュー準備',
  },
  {
    title: 'ワークショップ進行台本',
    target: '共同実施先、ファシリテーター、レビュー協力者',
    use: '講義販売ではなく、地域の実務者が同じ事例構造を見ながらフローを作る。',
    status: 'v0.1レビュー準備',
  },
  {
    title: '無料説明会スライド原稿',
    target: '協力候補、レビュー協力者、費用負担候補',
    use: 'NBLの役割、やらないこと、共同設計の進め方を誤解なく伝える。',
    status: 'v0.1レビュー準備',
  },
];

export const workshopFormats = [
  {
    title: '地域連携フロー作成ワークショップ',
    detail: '参加機関の役割、つなぎ方、戻し方を見える化し、地域版の初期フロー案を残します。',
  },
  {
    title: '情報付きつなぎシート共同レビュー',
    detail: '本人・家族、患者会、支援機関、医療側の視点で、危険な表現や使いにくい項目を直します。',
  },
  {
    title: '既存研修・協議会への組み込み',
    detail: 'すでにある会議、研修、委託枠に、資料レビューと小さな実装検討を差し込みます。',
  },
];

export const hospitalSupportItems = [
  {
    title: '院内初動フローの整理',
    detail: '外来、医療相談室、地域連携室、就労相談先の接続を、無理のない初動手順としてまとめる。',
  },
  {
    title: '就労相談へ渡す情報粒度の設計',
    detail: '診断名中心ではなく、相談に必要な範囲、本人確認、伝えてはいけない情報を分ける。',
  },
  {
    title: '地域連携先とのレビュー会',
    detail: '難病相談支援センター、ハローワーク、就業・生活支援センター等と、つなぎ方を確認する。',
  },
  {
    title: '院内研修への組み込み',
    detail: '商業研修としてではなく、既存の院内研修、研究班、地域連携会議で扱える形にする。',
  },
];

export const rareDiseasePartnerRoles: RareDiseasePartnerRole[] = [
  {
    partner: '本人・家族・患者会',
    role: '資料の言葉、相談準備シート、就労圧力に見える箇所のレビュー',
    boundary: '個別の病状や相談内容を集めず、表現と使いやすさの確認に絞る。',
  },
  {
    partner: '難病相談支援センター・保健所・自治体',
    role: '地域資源の棚卸し、既存窓口との接続、協議会・委託枠への組み込み検討',
    boundary: '既存機関批判ではなく、橋渡し資料の改善と役割分担の確認を行う。',
  },
  {
    partner: '医療機関・研究班',
    role: '院内初動フロー、医療情報の扱い、地域連携レビューの共同設計',
    boundary: '医療判断は行わず、相談につなぐための情報整理に限定する。',
  },
  {
    partner: 'ハローワーク・就労支援機関・企業',
    role: '就労相談や職場調整に必要な情報の粒度、就職後フォローの見直し項目を確認',
    boundary: '個別の就職あっせんや成果保証ではなく、相談準備と連携の型を扱う。',
  },
  {
    partner: '財団・企業・自治体・委託事業の検討者',
    role: '無料資料を維持するための費用負担、共同実施、既存研修枠での支援',
    boundary: '本人・家族・患者会を費用負担先として扱わない。',
  },
];

export const fundingCandidates = [
  '病院・医療機関の院内研修や地域連携会議',
  '研究班や共同研究に付随する実装・普及枠',
  '企業のDEI、健康経営、両立支援、社会貢献枠',
  '財団助成、自治体委託、協議会・地域事業の枠',
  '既存研修・検討会への共同実施としての組み込み',
];
