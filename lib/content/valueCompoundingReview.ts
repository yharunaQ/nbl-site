export type ValueCompoundingHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type CompoundingLayer = {
  title: string;
  summary: string;
  signals: string[];
};

export type FounderRole = {
  title: string;
  aiOwns: string[];
  founderOwns: string[];
};

export type FounderAction = {
  frequency: string;
  title: string;
  detail: string;
  trigger: string;
};

export type CadenceBlock = {
  title: string;
  cadence: string;
  purpose: string;
  outputs: string[];
};

export type MetricStage = {
  stage: string;
  timeframe: string;
  question: string;
  metrics: string[];
};

export type AutomationCandidate = {
  title: string;
  purpose: string;
  frequency: string;
};

export type AgiPosture = {
  title: string;
  summary: string;
};

export const valueCompoundingHero: ValueCompoundingHero = {
  eyebrow: 'Value Compounding',
  headline: 'NBL は、収益そのものより先に、価値を倍々で生み出す仕組みを起動する。',
  subheadline:
    '重要なのは、単月売上の大小より、AI運営によって artifact、判断機構、distribution、trust、revenue capacity が複利で増えているかどうか。Founder の役割も、その複利を止めない位置に置き直す必要がある。',
};

export const compoundingLayers: CompoundingLayer[] = [
  {
    title: 'Artifact Compounding',
    summary:
      '条件マップ、workflow、図解、動画、boundary memo が、次の案件や次の公開資源の部品として再利用される状態。',
    signals: [
      '新規成果物のうち既存部品を使う割合',
      '1 artifact あたり Founder 関与時間',
      '1週間で増えた reusable asset 数',
    ],
  },
  {
    title: 'Loop Compounding',
    summary:
      'Chief of Staff / Public Narrative / Business Validation / Knowledge & Method / Next Horizon の5 loopが、会話のたびに止まらず、定常的に次の artifact を生む状態。',
    signals: [
      'Founder がトリガーしなくても進んだ round 数',
      '各 loop ごとの未処理 backlog の減少',
      'decision log と review page の更新頻度',
    ],
  },
  {
    title: 'Trust Compounding',
    summary:
      'NBL が何を約束し、何を約束しないかが明確であることで、誤解のない期待と再訪が積み上がる状態。',
    signals: [
      '同じ訪問者 / 組織からの再訪',
      '公開資源からの次アクション発生率',
      'boundary explanation 後の離脱ではなく理解の深まり',
    ],
  },
  {
    title: 'Distribution Compounding',
    summary:
      '1つの公開資源や1つのパートナー対話が、その後の inbound や partner discovery の母集団を増やす状態。',
    signals: [
      '公開資源ごとの inbound 数',
      '1件の conversation から派生した次候補数',
      '企業 / intermediary / research での紹介連鎖',
    ],
  },
  {
    title: 'Revenue Capacity Compounding',
    summary:
      'まだ売上が小さくても、startup fee + recurring + bounded usage を載せられるだけの仕組みが積み上がっている状態。',
    signals: [
      '有料化可能な package の明確さ',
      '同一相手が recurring で持ちたくなる理由の数',
      '1件の revenue が生まれたときに再現できる運用部品の数',
    ],
  },
];

export const founderRole: FounderRole[] = [
  {
    title: 'Founder が持つべきもの',
    aiOwns: [],
    founderOwns: [
      'public に本当に約束する文言',
      '外部連絡と実名候補への接続',
      '思想や経営判断として採る / 捨てるの最終判断',
      '高リスク境界と human review boundary の確定',
      'NBL が今後も存在し続けるべきかを含む上位方針',
    ],
  },
  {
    title: 'Founder が手放すべきもの',
    aiOwns: [
      'round の下準備',
      '比較表、scorecard、tracker の整備',
      'hidden review page と draft copy の作成',
      '素材棚卸し、route proposal、artifact 化',
      '定期レビュー用 snapshot の作成',
    ],
    founderOwns: [],
  },
];

export const founderActions: FounderAction[] = [
  {
    frequency: '随時 / 呼ばれたときだけ',
    title: 'Yes / No / Name を返す',
    detail:
      'AI側が止まるのは、public promise、外部連絡、実名候補、高リスク境界だけ。ここでは長文より `進める / 止める / 誰にする` を短く返せば十分。',
    trigger: 'external action、public promise、named partner、high-risk boundary',
  },
  {
    frequency: '週1回 15-20分',
    title: 'Weekly founder review を見る',
    detail:
      'weekly loop report を見て、赤信号の論点だけを処理する。赤信号がなければ何もしないでよい。',
    trigger: 'weekly loop report に Founder boundary 項目があるとき',
  },
  {
    frequency: '月1回 30-45分',
    title: 'Compounding dashboard を判定する',
    detail:
      '売上だけでなく、artifact / loop / trust / distribution / revenue capacity が立ち上がっているかを見て、continue / adjust / stop を決める。',
    trigger: 'monthly compounding dashboard 更新時',
  },
  {
    frequency: '四半期ごと 60分',
    title: '器そのものを見直す',
    detail:
      'NBL という形がまだ最適か、Horizon 1 と Horizon 2 の比重をどうするか、より上位の基盤へ吸収されるならどう縮退するかを決める。',
    trigger: 'quarterly direction reset 時',
  },
];

export const cadenceBlocks: CadenceBlock[] = [
  {
    title: 'Daily Operating Snapshot',
    cadence: '毎日',
    purpose:
      '前日から増えた asset、止まっている loop、Founder に戻すべき論点を短く可視化し、会話トリガーがなくても進むようにする。',
    outputs: ['daily snapshot', 'blocked items', 'next best round'],
  },
  {
    title: 'Weekly Loop Review',
    cadence: '毎週',
    purpose:
      '5 loop それぞれで、何が input され、何が artifact になり、何が Founder boundary に達したかを見直す。',
    outputs: ['weekly loop report', 'priority reset', 'PDCA memo'],
  },
  {
    title: 'Monthly Compounding Review',
    cadence: '毎月',
    purpose:
      '収益だけでなく、artifact、trust、distribution、partner pipeline が複利で立ち上がっているかを確認する。',
    outputs: ['compound dashboard', 'continue / adjust / stop judgment'],
  },
  {
    title: 'Quarterly Direction Reset',
    cadence: '四半期ごと',
    purpose:
      'NBL という器がまだ最適か、別の形へ進化すべきか、Horizon 1 と Horizon 2 の比重を変えるかを判断する。',
    outputs: ['strategy memo', 'horizon rebalance', 'structure decision'],
  },
];

export const metricStages: MetricStage[] = [
  {
    stage: 'Stage 1',
    timeframe: '0-6週間',
    question: 'AI運営は Founder の手数を超え始めたか。',
    metrics: [
      'artifact 数 / 週',
      'Founder 1時間あたりの成果物数',
      'Founder トリガーなしで進んだ round 比率',
      '同じ素材から派生した再利用成果物数',
    ],
  },
  {
    stage: 'Stage 2',
    timeframe: '6-12週間',
    question: '部品の複利が立ち上がったか。',
    metrics: [
      '既存部品の再利用率',
      '公開資源 -> 次の対話 の発生数',
      '新規ページ / 文書における shared shell 利用率',
      '1 round あたり decision log 追加数',
    ],
  },
  {
    stage: 'Stage 3',
    timeframe: '3-6か月',
    question: '市場がその複利を価値として認識し始めたか。',
    metrics: [
      '有望 conversation 数',
      'A1 / A2 / B1 / C1 pipeline の進捗',
      '再訪する相手の数',
      '公開資源経由の partner / enterprise inbound',
    ],
  },
  {
    stage: 'Stage 4',
    timeframe: '6-12か月',
    question: '収益化しても仕組みが崩れないか。',
    metrics: [
      'revenue / Founder hour',
      'recurring へ移行した相手の数',
      'AIツール費に対する売上倍率',
      '1 revenue event から再利用された artifact 数',
    ],
  },
];

export const automationCandidates: AutomationCandidate[] = [
  {
    title: 'Chief of Staff daily snapshot',
    purpose: '現在地、詰まり、次ラウンドを毎日まとめる。',
    frequency: 'daily',
  },
  {
    title: 'Weekly loop monitor',
    purpose: '5 loop の進捗、未処理、Founder boundary 到達点を点検する。',
    frequency: 'weekly',
  },
  {
    title: 'Monthly compounding dashboard',
    purpose: 'artifact / trust / distribution / revenue capacity の複利を記録する。',
    frequency: 'monthly',
  },
  {
    title: 'Quarterly horizon review',
    purpose: 'Horizon 1 と Horizon 2 の比重、NBL の器そのものの必要性を見直す。',
    frequency: 'quarterly',
  },
];

export const agiPostures: AgiPosture[] = [
  {
    title: 'NBL の目的は組織延命ではない',
    summary:
      'NBL 自体を永続企業にすることより、価値が生まれ続ける仕組みと参加設計を残すことを優先する。',
  },
  {
    title: 'AGI/ASI で NBL の形が不要になるなら、それも成功に含む',
    summary:
      'もしより上位の基盤が NBL の機能を吸収するなら、NBL は method steward、boundary steward、participation design seed の役割に縮退してよい。',
  },
  {
    title: '最後まで残るのは boundary と participation design',
    summary:
      '知的生産の多くが自動化されても、何を守り、誰が参加でき、どの器を残すかという設計は引き続き重要になる。',
  },
];
