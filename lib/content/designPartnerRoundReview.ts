export type DesignPartnerHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type DesignPartnerDecisionCard = {
  title: string;
  label: string;
  summary: string;
  tone: 'strong' | 'medium' | 'avoid';
};

export type DesignPartnerAgentInsight = {
  role: string;
  strongest: string;
  risky: string;
  needsToBeTrue: string;
  recommendation: string;
};

export type DesignPartnerScorecardItem = {
  title: string;
  summary: string;
};

export type DesignPartnerExperimentStep = {
  title: string;
  summary: string;
};

export type DesignPartnerBoundary = {
  title: string;
  items: string[];
};

export const designPartnerHero: DesignPartnerHero = {
  eyebrow: 'Design Partner Round',
  headline: '最初の design partner は、employer network を持つ intermediary を第一候補に置く。',
  subheadline:
    '速い受注より、recurring layer、cross-case learning、partner edge と human review boundary を安全に組める相手を優先する。',
};

export const designPartnerDecisionCards: DesignPartnerDecisionCard[] = [
  {
    title: 'First Candidate',
    label: 'Intermediary First',
    summary:
      '複数 employer context を横断でき、public resources から private layer への橋を作りやすい employer-facing intermediary を最優先にする。',
    tone: 'strong',
  },
  {
    title: 'Second-Best',
    label: 'Employer Direct',
    summary:
      'internal sponsor と workflow redesign appetite を持つ design-forward employer は有力だが、custom consulting trap に戻りやすい。',
    tone: 'medium',
  },
  {
    title: 'Avoid',
    label: 'Unsafe Fit',
    summary:
      'price-only buyer、white-label resale only intermediary、AI で雇用削減を前面に出す employer は初期 partner に向かない。',
    tone: 'avoid',
  },
];

export const designPartnerAgentInsights: DesignPartnerAgentInsight[] = [
  {
    role: 'Distribution Lead',
    strongest:
      'intermediary は trust channel と revenue channel を分けやすく、resources から discovery へ自然に接続しやすい。',
    risky:
      '意思決定 owner が曖昧だと導入が止まりやすく、公益性だけで fee を薄められると成立しにくい。',
    needsToBeTrue:
      'employer-facing の owner がいて、単発相談ではなく repeated use を前提にできること。',
    recommendation:
      '最初の outreach は intermediary 2 件、employer 1 件の比率で打つ。',
  },
  {
    role: 'Revenue Architect',
    strongest:
      'startup + recurring + bounded usage は、複数ケースの再利用を前提にできる intermediary の方が説明しやすい。',
    risky:
      'employer direct は custom support の追加期待が出やすく、intermediary は低単価包括支援に流れると危うい。',
    needsToBeTrue:
      '料金対象が人月ではなく、private workspace と workflow layer に紐づいていること。',
    recommendation:
      'generic pricing はまだ出さず、invitation-only で revenue fit を見る。',
  },
  {
    role: 'Partnership Lead',
    strongest:
      'intermediary は contextualization、implementation、external escalation を担う partner edge として相性が良い。',
    risky:
      'white-label resale になると NBL の core intelligence が薄まり、単なる下請けに見えやすい。',
    needsToBeTrue:
      'AI core、partner edge、human review boundary の責任分界が契約と説明で一致していること。',
    recommendation:
      'first partner は employer network と contextual review capability の両方を持つ相手に絞る。',
  },
  {
    role: 'Safety and Boundary Lead',
    strongest:
      'intermediary first は human review boundary を外部接続しやすく、major missing context のときに止まりやすい。',
    risky:
      'diagnosis-based の一般論を複数 employer に横流しすると、context collapse と discrimination risk が上がる。',
    needsToBeTrue:
      'person / job / environment / support / time / institution を確認する運用と、must-escalate line への同意があること。',
    recommendation:
      'boundary capability がない intermediary は、employer より安全とはみなさない。',
  },
  {
    role: 'Validation Ops Lead',
    strongest:
      '2 週間で intermediary 2 件、employer 1 件、lighthouse 1 件を比較すれば、仮説を感覚でなく evidence で絞れる。',
    risky:
      '最初から売り込みに寄ると scorecard と falsification trigger が機能しなくなる。',
    needsToBeTrue:
      'discovery の目的を受注でなく fit evaluation に固定し、5-8 項目の scorecard で比較すること。',
    recommendation:
      'first candidate を決める前に、boundary acceptance と repeated use potential を必ず採点する。',
  },
];

export const designPartnerScorecard: DesignPartnerScorecardItem[] = [
  {
    title: 'Repeated Use Potential',
    summary: '単発案件ではなく、複数ケースや複数組織へ learning loop を回せるか。',
  },
  {
    title: 'Named Internal Owner',
    summary: '導入責任を持ち、意思決定を前に進める owner が明確か。',
  },
  {
    title: 'Workflow Redesign Appetite',
    summary: '相談受付ではなく、仕事設計や運用フローの変更に意思があるか。',
  },
  {
    title: 'Boundary Readiness',
    summary: 'human review boundary と must-escalate line を維持する姿勢があるか。',
  },
  {
    title: 'Operational Context Access',
    summary: 'employer context や repeated operational contexts に継続的に触れられるか。',
  },
  {
    title: 'Private Workspace Readiness',
    summary: 'private knowledge pack や workflow setup を受け入れられるか。',
  },
  {
    title: 'Budget Tolerance',
    summary: 'startup + recurring の hybrid を現実的に検討できるか。',
  },
  {
    title: 'Low Automation Pressure',
    summary: 'employment action や accommodation judgment の自動化を急がないか。',
  },
];

export const designPartnerExperiment: DesignPartnerExperimentStep[] = [
  {
    title: 'Step 1: Discovery Outreach',
    summary: 'intermediary 2 件、design-forward employer 1 件、research / policy lighthouse 1 件へ打診する。',
  },
  {
    title: 'Step 2: Scorecard Review',
    summary: '各相手を 8 項目で採点し、repeated use、boundary acceptance、owner clarity を比較する。',
  },
  {
    title: 'Step 3: First Offer Envelope',
    summary: 'first candidate にだけ invitation-only の startup + recurring envelope を仮提示する。',
  },
  {
    title: 'Step 4: Falsification Check',
    summary: 'consulting demand、unsafe automation pressure、one-off support expectation が強ければ仮説を下げる。',
  },
];

export const designPartnerBoundaries: DesignPartnerBoundary[] = [
  {
    title: 'Must Escalate',
    items: [
      'hiring, firing, demotion, discipline, return-to-work final decisions',
      'medical or diagnostic interpretation',
      'crisis, self-harm, abuse, acute safety',
      'major missing context across person / job / environment / support / time / institution',
    ],
  },
  {
    title: 'Can Stay AI-Supported',
    items: [
      'issue structuring',
      'workflow mapping',
      'resource suggestion',
      'first-draft documentation',
      'missing-context question generation',
    ],
  },
];
