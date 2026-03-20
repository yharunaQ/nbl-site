export type ValidationHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type ValidationHypothesis = {
  title: string;
  summary: string;
};

export type ValidationPartnerType = {
  title: string;
  summary: string;
  fit: 'strong' | 'medium' | 'weak';
};

export type ValidationRevenueHypothesis = {
  id: string;
  title: string;
  summary: string;
  note: string;
};

export type ValidationBoundary = {
  title: string;
  summary: string;
};

export type ValidationEscalation = {
  title: string;
  items: string[];
};

export const businessValidationHero: ValidationHero = {
  eyebrow: 'Business Validation',
  headline: '社会OSの思想を、最初に試せる事業仮説へ落とす。',
  subheadline:
    'design partner、recurring fee、partner boundary、high-risk escalation を先に切り、理念を回る構造へ変換する。',
};

export const businessValidationHypotheses: ValidationHypothesis[] = [
  {
    title: 'Design Partner First',
    summary: '最初は design partner 1-3組に絞り、distribution より learning speed を優先する。',
  },
  {
    title: 'Recurring Layer Matters',
    summary: '相談料より recurring platform fee を軸にしないと、社会OSでなく受託相談に戻りやすい。',
  },
  {
    title: 'Boundary Is Product',
    summary: 'AI core / partner edge / human review の責任線自体が product quality を決める。',
  },
];

export const businessValidationPartnerTypes: ValidationPartnerType[] = [
  {
    title: 'Design-forward employer',
    summary: '働きづらさの friction を workflow redesign で解こうとする企業。',
    fit: 'strong',
  },
  {
    title: 'Support / workforce intermediary',
    summary: '支援機関や technical assistance 的な中間層。contextualization と network を持つ。',
    fit: 'strong',
  },
  {
    title: 'Research / policy lighthouse',
    summary: 'legitimacy と evidence translation を補うが、初期 revenue は弱い。',
    fit: 'medium',
  },
  {
    title: 'Price-only buyer',
    summary: '価格比較だけで導入を決め、設計や境界に関心が薄い相手。',
    fit: 'weak',
  },
];

export const businessValidationRevenue: ValidationRevenueHypothesis[] = [
  {
    id: 'h1',
    title: 'H1 Startup + recurring is default',
    summary: 'startup package で初期設定し、recurring platform fee で knowledge と workflow を更新する。',
    note: '最初の commercial shape として最も自然。',
  },
  {
    id: 'h2',
    title: 'H2 Usage should be bounded',
    summary: 'included entitlement を超えた分だけ overage または credits で扱う。',
    note: 'open-ended usage は原価も責任も読みにくい。',
  },
  {
    id: 'h3',
    title: 'H3 Outcome pricing is narrow',
    summary: 'workflow output のような限定タスクには使えても、accommodation result 全体には使わない。',
    note: '高リスク判断と outcome pricing を混ぜない。',
  },
];

export const businessValidationBoundaries: ValidationBoundary[] = [
  {
    title: 'AI core',
    summary: 'knowledge synthesis, workflow scaffolding, JAC logic, documentation drafts, resource packaging.',
  },
  {
    title: 'Partner edge',
    summary: 'organizational context, implementation, stakeholder alignment, external escalation, institutional adaptation.',
  },
  {
    title: 'Human review boundary',
    summary: 'legal-sensitive interpretation, employment action implications, high-risk case review, crisis / safety judgment.',
  },
];

export const businessValidationEscalation: ValidationEscalation[] = [
  {
    title: 'Must escalate',
    items: [
      'hiring, firing, demotion, discipline, return-to-work final decisions',
      'medical or diagnostic interpretation',
      'crisis, self-harm, acute safety, abuse, violence',
      'major missing context across person / job / environment / support / time / institution',
    ],
  },
  {
    title: 'Can stay AI-supported',
    items: [
      'issue structuring',
      'workflow mapping',
      'resource suggestion',
      'first-draft documentation',
      'question generation for missing context',
    ],
  },
];

export const businessValidationNextChecks = [
  'design partner scorecard',
  'recurring fee envelope',
  'usage entitlement design',
  'partner contract boundary',
  'high-risk escalation protocol',
];
