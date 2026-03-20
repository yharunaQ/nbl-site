export type SnapshotAutomationHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type SnapshotJob = {
  title: string;
  cadence: string;
  purpose: string;
  reads: string[];
  writes: string[];
  founderOnlyIf: string;
};

export type SnapshotSection = {
  title: string;
  description: string;
  bullets: string[];
};

export type SnapshotEscalationRule = {
  title: string;
  severity: string;
  when: string;
  action: string;
};

export type AutomationSpec = {
  title: string;
  cadence: string;
  deliverable: string;
  rules: string[];
};

export const snapshotAutomationHero: SnapshotAutomationHero = {
  eyebrow: 'Snapshot Automation',
  headline: 'NBL の daily / weekly 運転を、automation-ready な recurring job にする。',
  subheadline:
    '最初に固定すべきなのは、毎日と毎週に何を読み、何を書き、どのときだけ Founder に返すか。daily snapshot と weekly loop report が回れば、NBL は会話トリガー待ちからかなり抜けられる。',
};

export const snapshotJobs: SnapshotJob[] = [
  {
    title: 'Daily Snapshot',
    cadence: '平日朝 1回',
    purpose: '昨日から何が増え、何が止まり、今日どの loop を1つ進めるべきかを 1 枚にまとめる。',
    reads: [
      '`content-inbox/` の新規追加',
      '`content-review/` の更新',
      '`docs/nbl-workspace/decision-log.md`',
      '`pages/review/` と `lib/content/` の主要差分',
      '`content-inbox/founder-site-feedback-log.md`',
    ],
    writes: [
      '`docs/nbl-workspace/ops/daily-snapshots/YYYY-MM-DD.md`',
      '`what changed`',
      '`what accumulated`',
      '`blocked or drifting`',
      '`next best round`',
      '`Founder boundary`',
    ],
    founderOnlyIf: 'Founder boundary が空でないとき、または build / safety / public promise に赤信号があるときだけ。',
  },
  {
    title: 'Weekly Loop Report',
    cadence: '毎週月曜朝 1回',
    purpose: '5 loop をまとめてレビューし、複利、drift、priority、Founder boundary を週単位で整える。',
    reads: [
      '当週の daily snapshots',
      '`decision-log.md`',
      '`partner` 関連の pipeline / dossier / outreach assets',
      '`pages/review/` と `lib/content/` の主要更新',
      'Founder input logs',
    ],
    writes: [
      '`docs/nbl-workspace/ops/weekly-loop-reports/YYYY-MM-DD.md`',
      '`loop-by-loop status`',
      '`artifacts created`',
      '`compounding signals`',
      '`risks and drifts`',
      '`Founder boundary this week`',
      '`next 7 days`',
    ],
    founderOnlyIf: 'Founder boundary this week が空でないとき、または continue / adjust / stop を前倒しで求めるべき signal があるときだけ。',
  },
];

export const dailySnapshotSections: SnapshotSection[] = [
  {
    title: 'What Changed',
    description: '昨日から増えたものを短く押さえる。',
    bullets: [
      '新しいコンテンツや原稿',
      '新しい hidden review page や public candidate',
      '意思決定や release 状態の変化',
    ],
  },
  {
    title: 'What Accumulated',
    description: '単発対応でなく、何が reusable asset として残ったかを見る。',
    bullets: [
      '新しく使い回せる template, memo, shell',
      'decision log に残った判断',
      '次の page や business round に流用できる部品',
    ],
  },
  {
    title: 'Blocked Or Drifting',
    description: '止まっていることと、consulting drift の兆候を早めに拾う。',
    bullets: [
      '7日以上 next best round が出ていない',
      '都度対応だけ増えて artifact が残っていない',
      'public candidate が build / copy / boundary のどこかで止まっている',
    ],
  },
  {
    title: 'Next Best Round',
    description: '今日進める問いは必ず1つに絞る。',
    bullets: [
      'Chief of Staff が進めるべき次の 1 round',
      'その理由',
      'Founder を止めずに進められるかどうか',
    ],
  },
];

export const weeklyLoopSections: SnapshotSection[] = [
  {
    title: 'Loop-By-Loop Status',
    description: '5 loop を `moving / blocked / waiting / drift risk` で見る。',
    bullets: [
      'Chief of Staff Loop',
      'Public Narrative Loop',
      'Business Validation Loop',
      'Knowledge And Method Loop',
      'Next Horizon Loop',
    ],
  },
  {
    title: 'Compounding Signals',
    description: '毎週、何の複利が立ち上がっているかを確認する。',
    bullets: [
      'artifact が増えたか',
      'Founder 関与あたりの output が上がったか',
      '公開資源や対話から次の input が生まれたか',
    ],
  },
  {
    title: 'Founder Boundary This Week',
    description: 'Founder はここだけ見ればよい。',
    bullets: [
      'public promise の変更',
      '外部連絡が必要な named case',
      '高リスク境界の escalation',
      '`no founder action needed` の明記',
    ],
  },
  {
    title: 'Next 7 Days',
    description: '次週の priority は 3 項目以内に絞る。',
    bullets: [
      '進める round',
      '止めるもの',
      '保留してよいもの',
    ],
  },
];

export const snapshotEscalationRules: SnapshotEscalationRule[] = [
  {
    title: 'Public Promise Drift',
    severity: 'High',
    when: 'public に見せる約束や tone が変わる必要が出たとき',
    action: 'Founder boundary に載せて、短く Yes / No / Adjust を返してもらう。',
  },
  {
    title: 'Named External Action',
    severity: 'High',
    when: '実名候補、外部連絡、公開前提の相手先が出てきたとき',
    action: 'daily では flag、weekly では decision item として固定する。',
  },
  {
    title: 'Unsafe Automation Pressure',
    severity: 'High',
    when: '障害 / 雇用 / 支援の判断を AI に寄せすぎている兆候があるとき',
    action: 'must-escalate とし、Founder と human review boundary を確認する。',
  },
  {
    title: 'Loop Silence',
    severity: 'Medium',
    when: '7日以上 next best round が更新されていないとき',
    action: 'Chief of Staff loop の blocked item に置き、weekly で優先的に再起動する。',
  },
  {
    title: 'Artifact Drought',
    severity: 'Medium',
    when: '都度対応だけが増え、reusable asset が残っていないとき',
    action: 'drift risk として weekly report に入れ、next 7 days を調整する。',
  },
];

export const automationSpecs: AutomationSpec[] = [
  {
    title: 'NBL Daily Snapshot',
    cadence: '平日朝',
    deliverable: '`docs/nbl-workspace/ops/daily-snapshots/YYYY-MM-DD.md`',
    rules: [
      'Founder boundary が空なら `none` と明記する',
      '`next best round` は必ず 1 つに絞る',
      '既存ファイルがある日は上書きでなく update を優先する',
    ],
  },
  {
    title: 'NBL Weekly Loop Report',
    cadence: '毎週月曜朝',
    deliverable: '`docs/nbl-workspace/ops/weekly-loop-reports/YYYY-MM-DD.md`',
    rules: [
      '各 loop を `moving / blocked / waiting / drift risk` のどれかで判定する',
      'Founder boundary がなければ `no founder action needed` と明記する',
      '`next 7 days` は 3 項目以内に絞る',
    ],
  },
  {
    title: 'NBL Monthly Compounding Dashboard',
    cadence: '月初',
    deliverable: '`docs/nbl-workspace/ops/monthly-compounding/YYYY-MM.md`',
    rules: [
      'artifact / loop / trust / distribution / revenue capacity を分けて書く',
      '最後は `keep / adjust / stop` の判定に落とす',
      'daily / weekly が安定してから activation する',
    ],
  },
];
