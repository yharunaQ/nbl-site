export type PartnerSampleHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type PartnerSampleCard = {
  title: string;
  summary: string;
  notes: string[];
  tone: 'strong' | 'caution' | 'compare' | 'drop';
};

export type PartnerSampleRanking = {
  slot: string;
  candidate: string;
  score: string;
  decision: string;
};

export const partnerSampleHero: PartnerSampleHero = {
  eyebrow: 'Partner Sample Packet',
  headline: '実名候補を入れる前に、匿名サンプルで埋まり方を先に見る。',
  subheadline:
    'A1 / A2 / B1 / C1 が実際にどう記入され、どう比較されるかの見本を先に作ることで、候補投入時の迷いを減らす。',
};

export const partnerSampleCards: PartnerSampleCard[] = [
  {
    title: 'A1 Sample',
    summary: '広域の employer support network を持つ intermediary。primary slot の strong candidate 例。',
    notes: ['repeated use potential strong', 'owner clarity strong', 'boundary readiness partial', 'provisional keep'],
    tone: 'strong',
  },
  {
    title: 'A2 Sample',
    summary: 'nationwide service desk 型 intermediary。scale はあるが drift risk が高い例。',
    notes: ['labor outsourcing expectation high', 'boundary readiness weak', 'low automation pressure weak', 'gate failure risk'],
    tone: 'drop',
  },
  {
    title: 'B1 Sample',
    summary: 'work redesign appetite を持つ mid-size employer。secondary lane の比較例。',
    notes: ['sponsor clarity strong', 'repeated use medium', 'boundary medium', 'provisional keep'],
    tone: 'caution',
  },
  {
    title: 'C1 Sample',
    summary: 'translation value の高い research / policy consortium。comparison only の例。',
    notes: ['learning value strong', 'boundary strong', 'commercial lead not assumed', 'comparison only'],
    tone: 'compare',
  },
];

export const partnerSampleRanking: PartnerSampleRanking[] = [
  {
    slot: 'A1',
    candidate: '広域の employer support network を持つ intermediary',
    score: '20 / 24',
    decision: 'advance',
  },
  {
    slot: 'A2',
    candidate: 'nationwide service desk 型 intermediary',
    score: '16 / 24',
    decision: 'drop',
  },
  {
    slot: 'B1',
    candidate: 'work redesign appetite を持つ mid-size employer',
    score: '17 / 24',
    decision: 'hold',
  },
  {
    slot: 'C1',
    candidate: 'translation value の高い research / policy consortium',
    score: '17 / 24',
    decision: 'comparison only',
  },
];
