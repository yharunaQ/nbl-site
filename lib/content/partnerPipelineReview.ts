export type PartnerPipelineHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type PartnerPipelineSlot = {
  id: string;
  title: string;
  summary: string;
  items: string[];
  tone: 'primary' | 'secondary' | 'comparison';
};

export type PartnerPipelineAsset = {
  title: string;
  summary: string;
};

export type PartnerPipelineStep = {
  title: string;
  summary: string;
};

export const partnerPipelineHero: PartnerPipelineHero = {
  eyebrow: 'Partner Candidate Pipeline',
  headline: '実名がなくても、A1 / A2 / B1 / C1 の匿名 slot で pipeline を先に固定する。',
  subheadline:
    '候補名より先に target ratio、required evidence、red flags、tracker structure を決めて、network convenience に流されない discovery ops を作る。',
};

export const partnerPipelineSlots: PartnerPipelineSlot[] = [
  {
    id: 'A1',
    title: 'A1',
    summary: 'primary slot。employer-facing intermediary の第一候補。',
    items: [
      'employer network',
      'named operational owner',
      'contextual review capability',
      'repeated use potential',
    ],
    tone: 'primary',
  },
  {
    id: 'A2',
    title: 'A2',
    summary: 'primary slot。A1 と比較する二つ目の intermediary 候補。',
    items: [
      'employer network access',
      'low automation pressure',
      'recurring fit',
      'boundary acceptance',
    ],
    tone: 'primary',
  },
  {
    id: 'B1',
    title: 'B1',
    summary: 'secondary slot。design-forward employer の比較候補。',
    items: [
      'named internal sponsor',
      'workflow redesign appetite',
      '1 primary workflow lane',
      'boundary readiness',
    ],
    tone: 'secondary',
  },
  {
    id: 'C1',
    title: 'C1',
    summary: 'comparison slot。research / policy lighthouse の比較候補。',
    items: [
      'legitimacy / translation value',
      'field or network access',
      'learning value',
      'not the operational review owner',
    ],
    tone: 'comparison',
  },
];

export const partnerPipelineAssets: PartnerPipelineAsset[] = [
  {
    title: 'Candidate Input Sheet',
    summary: '候補を slot に入れる時点で、why now、known fit、knockout scan、next question を揃える。',
  },
  {
    title: 'Candidate List Template',
    summary: '各 slot に candidate name、source path、must validate、red flags を入れる。',
  },
  {
    title: 'Outreach Tracker',
    summary: 'status、material sent、boundary response、score を 1 つの表で追う。',
  },
  {
    title: 'Candidate Intake Checklist',
    summary: 'slot に入れる前、call を入れる前、call 後の確認を固定する。',
  },
  {
    title: 'Shortlisting Rubric',
    summary: '候補名を slot に入れる前に、knockout condition と core fit を先に判定する。',
  },
  {
    title: 'Conversation Memo Template',
    summary: 'call 後に observation、inference、risk、scorecard snapshot を同じ形で残す。',
  },
  {
    title: 'Ranking Sheet',
    summary: '4 conversation 後に total score と gate condition を並べて advance / hold / drop を決める。',
  },
  {
    title: 'Sample Filled Packet',
    summary: '匿名サンプルで、candidate input・memo・ranking がどう埋まるかの見本。',
  },
  {
    title: 'Dossier And Readout Kit',
    summary: 'live candidate を 1 枚 dossier で持ち、4 conversation 後に founder-readable な round readout へ閉じる。',
  },
];

export const partnerPipelineSteps: PartnerPipelineStep[] = [
  {
    title: 'Step 1: Fill Anonymous Slots',
    summary: 'まず shortlisting rubric を通してから、A1 / A2 / B1 / C1 の slot に実名候補を入れる。slot を増やさない。',
  },
  {
    title: 'Step 2: Send Outreach',
    summary: 'target に合った outreach note を送り、反応があれば package brief を共有する。',
  },
  {
    title: 'Step 3: Run Discovery',
    summary: 'exclusions と boundary を共有してから call を行い、8項目 scorecard を埋める。',
  },
  {
    title: 'Step 4: Rank Or Hold',
    summary: 'call 後は conversation memo を残し、ranking sheet で gate を見ながら provisional ranking を出す。stop rule に触れた candidate は hold。',
  },
];
