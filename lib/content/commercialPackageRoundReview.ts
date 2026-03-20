export type CommercialPackageHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type CommercialPackageDecision = {
  title: string;
  label: string;
  summary: string;
  tone: 'strong' | 'medium' | 'warning';
};

export type CommercialPackageSection = {
  title: string;
  items: string[];
};

export type CommercialPackageWrapper = {
  title: string;
  summary: string;
  assumptions: string[];
};

export type CommercialPackageAgentInsight = {
  role: string;
  strongest: string;
  risky: string;
  needsToBeTrue: string;
  recommendation: string;
};

export type CommercialPackageExperiment = {
  title: string;
  summary: string;
};

export const commercialPackageHero: CommercialPackageHero = {
  eyebrow: 'Commercial Package Round',
  headline: '最初の commercial package は、1つの core package と 2つの narrow wrapper に保つ。',
  subheadline:
    'separate products に分けるのではなく、shared core を守りながら employer と intermediary の入口だけを出し分ける。',
};

export const commercialPackageDecisions: CommercialPackageDecision[] = [
  {
    title: 'Core Package',
    label: 'Shared Core',
    summary:
      'smallest sellable package は仮に `NBL OS Pilot`。AI core、workflow、private workspace、boundary design を共通コアにする。',
    tone: 'strong',
  },
  {
    title: 'Employer Wrapper',
    label: 'Workplace Pilot',
    summary:
      '1 organization、1 named sponsor、1 primary workflow lane を前提にした employer 向け wrapper。',
    tone: 'medium',
  },
  {
    title: 'Intermediary Wrapper',
    label: 'Partner Node Pilot',
    summary:
      '1 intermediary team、1 named operational owner、1 network-facing workflow lane を前提にした intermediary 向け wrapper。',
    tone: 'medium',
  },
  {
    title: 'What We Avoid',
    label: 'No Split Products',
    summary:
      'partner type ごとの別 product 化は consulting drift と delivery duplication を招きやすいので、初期は採らない。',
    tone: 'warning',
  },
];

export const commercialPackageSections: CommercialPackageSection[] = [
  {
    title: 'Included',
    items: [
      'AI team startup',
      'private workspace setup',
      'issue and workflow map',
      'knowledge pack initialization',
      'boundary and escalation pack',
      'bounded agent usage entitlement',
      'first operating review memo',
    ],
  },
  {
    title: 'Excluded',
    items: [
      'live case-by-case individual advice',
      'hiring, firing, demotion, discipline, return-to-work final decisions',
      'medical or diagnostic interpretation',
      'unlimited meetings or unlimited revisions',
      'white-label resale rights',
      'open-ended custom implementation labor',
    ],
  },
  {
    title: 'Conditional',
    items: [
      'additional workflow lanes',
      'additional organization contexts',
      'approved partner review connection',
      'system integration work after pilot',
    ],
  },
];

export const commercialPackageWrappers: CommercialPackageWrapper[] = [
  {
    title: 'Workplace Pilot',
    summary: 'design-forward employer 向けの wrapper。core package は同じまま、導入コンテキストだけを employer 仕様にする。',
    assumptions: ['1 organization', '1 named sponsor', '1 primary workflow lane'],
  },
  {
    title: 'Partner Node Pilot',
    summary: 'employer-facing intermediary 向けの wrapper。network-facing workflow を前提にするが、package 自体は license 化しない。',
    assumptions: ['1 intermediary team', '1 named operational owner', '1 network-facing workflow lane'],
  },
];

export const commercialPackageAgentInsights: CommercialPackageAgentInsight[] = [
  {
    role: 'Offer Packaging Lead',
    strongest:
      '1 core + 2 wrappers にすると、NBL が売る対象を AI core / workflow / private workspace / boundary design に固定しやすい。',
    risky:
      '別 product 化や伴走表現が前面に出ると、営業のたびに package が consulting へ戻りやすい。',
    needsToBeTrue:
      'wrapper 差分が owner type と rollout assumption に限定され、human labor promise を増やさないこと。',
    recommendation:
      '最初の commercial package は shared core を守り、public name より scope を先に固定する。',
  },
  {
    role: 'Revenue Architect',
    strongest:
      'one core package にすると、startup + recurring + bounded usage の revenue stack をそのまま維持できる。',
    risky:
      'public pricing を急ぐと、相手が system layer より値引き条件に注目しやすくなる。',
    needsToBeTrue:
      '料金対象が advisory availability ではなく workspace、knowledge、workflow layer に紐づいていること。',
    recommendation:
      '料金は invitation-only の internal envelope に留め、separate products は作らない。',
  },
  {
    role: 'Safety and Boundary Lead',
    strongest:
      'boundary and escalation pack を included に入れることで、package 自体が unsafe automation へ流れにくくなる。',
    risky:
      'intermediary wrapper が network-wide support、employer wrapper が HR automation と誤読されると高リスク。',
    needsToBeTrue:
      'must-escalate line と review boundary owner が package 外ではなく前提条件として明示されること。',
    recommendation:
      'words to avoid を先に決め、high-risk review labor を package に暗黙で含めない。',
  },
  {
    role: 'Validation Ops Lead',
    strongest:
      '同じ core package を wrapper だけ変えて見せると、discovery call で何が理解され、何が誤読されるか比較しやすい。',
    risky:
      'name だけが先行すると、また雰囲気営業に戻って confirm / falsify が取れなくなる。',
    needsToBeTrue:
      'next calls では core、wrapper、exclusions の順で説明し、fit evaluation を記録すること。',
    recommendation:
      '次の 4 conversation で同じ core package を見せ、反応差分を scorecard に残す。',
  },
];

export const commercialPackageWordsToAvoid = [
  'consultation service',
  'unlimited support',
  'outsourced expert desk',
  'fully automated accommodation',
  'compliance guarantee',
  'AIが最終判断する',
];

export const commercialPackageExperiments: CommercialPackageExperiment[] = [
  {
    title: 'Step 1: One-Page Brief',
    summary: 'core package、wrapper difference、excluded items を1ページに圧縮する。',
  },
  {
    title: 'Step 2: Wrapper-Specific Covers',
    summary: 'employer には Workplace Pilot、intermediary には Partner Node Pilot の cover だけを変えて見せる。',
  },
  {
    title: 'Step 3: Fit Capture',
    summary: 'core package understanding、wrapper fit、recurring fit、exclusion acceptance を記録する。',
  },
  {
    title: 'Step 4: Falsification',
    summary: 'labor outsourcing や unlimited support expectation が強ければ package 仮説を下げる。',
  },
];
