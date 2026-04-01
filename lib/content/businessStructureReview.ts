export type BusinessVerdict = {
  title: string;
  summary: string;
};

export type BusinessModelCard = {
  title: string;
  summary: string;
};

export type BusinessStep = {
  step: string;
  title: string;
  summary: string;
};

export type BusinessRevenueLayer = {
  title: string;
  summary: string;
  note: string;
};

export type BusinessPartnerClass = {
  title: string;
  role: string;
};

export type BusinessGuardrail = {
  title: string;
  detail: string;
};

export const businessStructureVerdict: BusinessVerdict = {
  title: 'NBL は相談事業としては弱いが、AIネイティブな社会OS事業としては成立余地がある。',
  summary:
    '成立条件は、単発相談や未完成 product の販売ではなく、再利用可能な methods / workflows / resources / 仕事設計プロダクト群 を system layer として売れること。単体コンテンツ販売は主軸ではなく、収益は private layer に置く。',
};

export const businessStructureModelCards: BusinessModelCard[] = [
  {
    title: 'AI-operated core',
    summary: '知識基盤、workflow、agent orchestration、仕事設計プロダクト群、resources を中核で運営する。',
  },
  {
    title: 'Partner-enabled edge',
    summary: '企業、支援機関、研究者、技術パートナーが distribution と contextualization を補う。',
  },
  {
    title: 'Human review boundary',
    summary: '雇用上の最終判断や高リスクケースは AI 単独で確定しない。',
  },
];

export const businessStructureDistribution: BusinessStep[] = [
  {
    step: '01',
    title: 'Public resources',
    summary: '図解、動画、series、selected reports、見取り図、26カード版、method entry で trust と入口をつくる。',
  },
  {
    step: '02',
    title: 'Method entry',
    summary: 'What We Do、仕事設計の見取り図、26カード版で方法論を理解させる。',
  },
  {
    step: '03',
    title: 'Enterprise/private layer',
    summary: 'private workspace、knowledge pack、workflow setup で有償化する。',
  },
  {
    step: '04',
    title: 'Partner expansion',
    summary: '企業、支援機関、公共/研究ネットワーク、tech partner へ広げる。',
  },
];

export const businessStructureRevenue: BusinessRevenueLayer[] = [
  {
    title: 'Startup fee',
    summary: 'AI チーム起動、private knowledge / workflow setup、initial design pack。',
    note: '人月型相談料ではなく、OS 導入の初期設定費として扱う。',
  },
  {
    title: 'Recurring platform fee',
    summary: 'private workspace、knowledge updates、workflow maintenance。',
    note: '初期の主軸になりやすい recurring layer。',
  },
  {
    title: 'Bounded usage',
    summary: 'Founder-operated internal tool runs、agent runs、private workflow calls。',
    note: 'public entry は generous / free-to-start にしつつ、flat fee + overage か usage entitlement で private depth を課金するのが相性よい。単体コンテンツ販売を primary revenue にしない。',
  },
  {
    title: 'Later outcome-linked layer',
    summary: '限定的な operational outcome のみ後段で対象にする。',
    note: 'accommodation judgment や雇用意思決定は outcome pricing にしない。',
  },
];

export const businessStructurePartners: BusinessPartnerClass[] = [
  {
    title: 'Employer partners',
    role: '実装現場と enterprise design partner。',
  },
  {
    title: 'Support / workforce partners',
    role: 'contextualization、external re-evaluation、導入支援。',
  },
  {
    title: 'Research / policy partners',
    role: '根拠、legitimacy、policy translation。',
  },
  {
    title: 'Technology partners',
    role: 'billing、workflow、AI、accessibility stack。',
  },
];

export const businessStructureGuardrails: BusinessGuardrail[] = [
  {
    title: 'Pure consulting dependency に戻らない',
    detail: '人手の件数だけで revenue を作ると、社会OSではなく受託相談へ戻る。',
  },
  {
    title: 'Accommodation judgment を自動化しない',
    detail: 'reasonable accommodation は個別的であり、高リスク判断の完全自動化は避ける。',
  },
  {
    title: '未完成 product を sales first にしない',
    detail: 'unfinished trial や pricing draft を先に売らない。',
  },
  {
    title: '入口資産の不足を小売で埋めない',
    detail:
      'free asset が弱いからといって、単体コンテンツ販売を主収益に据えると、private layer の価値設計が遅れる。',
  },
  {
    title: 'AI-only rhetoric を避ける',
    detail: 'partner edge と human review boundary を曖昧にしない。',
  },
];

export const businessStructureValidationQueue = [
  'design partner 仮説',
  'recurring fee 仮説',
  'usage meter 仮説',
  'partner boundary 仮説',
  'high-risk escalation 仮説',
];
