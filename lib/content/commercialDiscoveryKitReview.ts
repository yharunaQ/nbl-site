export type CommercialDiscoveryHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type CommercialDiscoverySection = {
  title: string;
  summary: string;
  items: string[];
};

export type CommercialDiscoveryQuestion = {
  title: string;
  summary: string;
};

export const commercialDiscoveryHero: CommercialDiscoveryHero = {
  eyebrow: 'Commercial Discovery Kit',
  headline: 'commercial package の判断を、そのまま discovery conversation で使える説明資材へ落とす。',
  subheadline:
    'one-page package brief、exclusions list、boundary one-pager、discovery call guide を一式で揃え、雰囲気営業ではなく fit evaluation を回す。',
};

export const commercialDiscoverySections: CommercialDiscoverySection[] = [
  {
    title: 'One-Page Package Brief',
    summary: 'NBL OS Pilot が何であり、何ではないかを最短で伝えるための入口。',
    items: [
      'AI-native social OS の最小導入単位',
      'issue structuring / workflow mapping / private knowledge layer / boundary design',
      'Workplace Pilot と Partner Node Pilot の wrapper difference',
    ],
  },
  {
    title: 'Exclusions List',
    summary: 'unsafe fit と scope creep を早い段階で落とすための明示リスト。',
    items: [
      'final employment decisions',
      'medical or diagnostic interpretation',
      'crisis / safety response',
      'unlimited support and white-label resale',
    ],
  },
  {
    title: 'Boundary One-Pager',
    summary: 'AI-supported zone と must-escalate zone を誤解なく示すための1枚。',
    items: [
      'AI-supported, human-decided',
      'required context: person / job / environment / support / time / institution / evidence',
      'major missing context cases must escalate',
    ],
  },
  {
    title: 'Discovery Call Guide',
    summary: '受注ではなく fit evaluation を行うための質問順と scorecard 項目。',
    items: [
      'repeated use potential',
      'named internal owner',
      'boundary readiness',
      'low automation pressure',
    ],
  },
];

export const commercialDiscoveryQuestions: CommercialDiscoveryQuestion[] = [
  {
    title: 'Where is the repeated friction?',
    summary: 'いま繰り返し起きている friction が単発か、repeated use に乗るかを確認する。',
  },
  {
    title: 'Who owns this internally?',
    summary: 'named internal owner がいるかを確認し、導入責任が曖昧な相手を早めに見分ける。',
  },
  {
    title: 'What is the first workflow lane?',
    summary: '最初に 1 本へ絞る workflow lane があるかを確認し、package scope を bounded に保つ。',
  },
  {
    title: 'Where is the human review boundary?',
    summary: '高リスク判断を誰が引き受けるかを discovery の段階で確認する。',
  },
  {
    title: 'What would break package fit?',
    summary: 'labor outsourcing expectation、unlimited support expectation、employment action support expectation を早めに見つける。',
  },
];
