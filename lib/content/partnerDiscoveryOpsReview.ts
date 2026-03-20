export type PartnerDiscoveryHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type PartnerDiscoveryTarget = {
  title: string;
  summary: string;
  items: string[];
  tone: 'primary' | 'secondary' | 'comparison';
};

export type PartnerDiscoveryScorecardItem = {
  title: string;
  summary: string;
};

export type PartnerDiscoverySequence = {
  title: string;
  summary: string;
};

export type PartnerDiscoveryStopRule = {
  title: string;
  summary: string;
};

export const partnerDiscoveryHero: PartnerDiscoveryHero = {
  eyebrow: 'Partner Discovery Ops',
  headline: '次の discovery は、fixed target condition と fixed scorecard で比較する。',
  subheadline:
    'network convenience で相手を選ばず、A:2 / B:1 / C:1 の比率で conversation を回し、social OS として育つ相手を見分ける。',
};

export const partnerDiscoveryTargets: PartnerDiscoveryTarget[] = [
  {
    title: 'Target A',
    summary: 'primary target は employer-facing intermediary。distribution、repeated use、boundary connection を同時に見られる。',
    items: [
      'employer network を持つ',
      'named operational owner がいる',
      'contextual review / external escalation に前向き',
      'public-good rhetoric だけで fee を薄めない',
    ],
    tone: 'primary',
  },
  {
    title: 'Target B',
    summary: 'secondary target は design-forward employer。workflow redesign appetite と sponsor clarity を確認する。',
    items: [
      'workflow redesign appetite',
      'named internal sponsor',
      '1 primary workflow lane に絞れる',
      'boundary line を受け入れる',
    ],
    tone: 'secondary',
  },
  {
    title: 'Target C',
    summary: 'comparison target は research / policy lighthouse。commercial lead ではなく legitimacy と learning の比較軸として使う。',
    items: [
      'translation value がある',
      'field or network access がある',
      'immediate revenue より learning value が高い',
      'operational review owner にはなりにくい',
    ],
    tone: 'comparison',
  },
];

export const partnerDiscoveryScorecard: PartnerDiscoveryScorecardItem[] = [
  {
    title: 'Repeated Use Potential',
    summary: 'one-off support でなく repeated use と learning loop が見込めるか。',
  },
  {
    title: 'Named Internal Owner',
    summary: '導入責任者が明確か。',
  },
  {
    title: 'Workflow Redesign Appetite',
    summary: '相談受付でなく work redesign に向いているか。',
  },
  {
    title: 'Boundary Readiness',
    summary: 'human review boundary と must-escalate line を受け入れるか。',
  },
  {
    title: 'Operational Context Access',
    summary: '必要な person / job / environment / support / time / institution を取りにいけるか。',
  },
  {
    title: 'Private Workspace Readiness',
    summary: 'private knowledge layer を持ち込めるか。',
  },
  {
    title: 'Budget Tolerance',
    summary: 'startup + recurring の hybrid を検討できるか。',
  },
  {
    title: 'Low Automation Pressure',
    summary: 'employment action support や unlimited automation を求めないか。',
  },
];

export const partnerDiscoverySequence: PartnerDiscoverySequence[] = [
  {
    title: 'Step 1: Outreach Note',
    summary: 'target condition に合わせた short outreach note を送り、fit evaluation の conversation であることを明示する。',
  },
  {
    title: 'Step 2: Package Brief',
    summary: '反応があれば one-page package brief を送り、operating layer であることを先に伝える。',
  },
  {
    title: 'Step 3: Exclusions + Boundary',
    summary: '深い話の前に exclusions list と boundary one-pager を共有し、scope と must-escalate line を固定する。',
  },
  {
    title: 'Step 4: Discovery Call',
    summary: 'call guide に沿って owner、workflow lane、repeated use、boundary fit を確認する。',
  },
  {
    title: 'Step 5: Score + Rank',
    summary: '8項目で採点し、4 conversation 後に provisional ranking を出す。',
  },
];

export const partnerDiscoveryStopRules: PartnerDiscoveryStopRule[] = [
  {
    title: 'Labor Outsourcing Drift',
    summary: '2件連続で labor outsourcing expectation が強ければ、message か target condition を見直す。',
  },
  {
    title: 'Boundary Rejection',
    summary: '2件連続で must-escalate line に同意が取れなければ、target priority を見直す。',
  },
  {
    title: 'One-Off Only Demand',
    summary: '2件連続で repeated use ではなく one-off support しか想定できなければ、package fit 仮説を下げる。',
  },
];
