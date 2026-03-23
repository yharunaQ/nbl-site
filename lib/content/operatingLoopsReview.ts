export type OperatingLoopsHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type OperatingLoop = {
  title: string;
  cadence: string;
  owner: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  founderNeeded: string;
};

export type FounderBoundary = {
  title: string;
  aiCanDo: string[];
  founderDecides: string[];
};

export type OperatingTrigger = {
  title: string;
  when: string;
  action: string;
};

export type OperatingRisk = {
  title: string;
  detail: string;
};

export const operatingLoopsHero: OperatingLoopsHero = {
  eyebrow: 'Operating Model',
  headline: 'AIが進め、人が止める。NBLの公開運営原則',
  subheadline:
    '公開ページ、方法論、公開資源の改善はAI中心で進めつつ、高リスク判断と対外責任は人が持つ。NBL はその境界だけを公開しています。',
};

export const operatingLoops: OperatingLoop[] = [
  {
    title: '公開情報を更新する',
    cadence: '随時',
    owner: 'NBL',
    purpose: '公開ページと説明文を見直し、今の約束と公開中の入口をそろえる。',
    inputs: ['公開ページ', '公開資源', '新しく得た知見や反応'],
    outputs: ['更新された説明', '公開上の境界整理', '次に読むべき入口'],
    founderNeeded: '公開約束や対外説明のトーンが変わるとき。',
  },
  {
    title: '方法論と資源を改善する',
    cadence: '継続',
    owner: 'NBL',
    purpose: '仕事設計の見取り図、図解、動画、補足ページを改善し、再利用できる資源を増やす。',
    inputs: ['方法論ページ', '図解・動画', '現場で得た論点'],
    outputs: ['改善された方法論', '公開資源', '補足ページ'],
    founderNeeded: 'どこまで public に出すかの線引きが変わるとき。',
  },
  {
    title: '高リスク判断を人に戻す',
    cadence: '必要時',
    owner: 'Human review',
    purpose: '法的・医療的・個別事情の重い判断は、AIだけで進めず人が確認する。',
    inputs: ['高リスクの個別事情', '外部への正式回答', '不可逆な判断'],
    outputs: ['人が確認した判断', '公開しない論点の切り分け', '必要な連携先'],
    founderNeeded: '高リスク判断や対外責任を伴うとき。',
  },
];

export const founderBoundaries: FounderBoundary[] = [
  {
    title: 'AIが進めてよい領域',
    aiCanDo: [
      '公開情報の整理',
      '比較、下書き、記録化',
      '方法論ページや公開資源の改善',
      '公開上の境界メモの更新',
    ],
    founderDecides: [],
  },
  {
    title: '人が決める領域',
    aiCanDo: [],
    founderDecides: [
      '公開約束をどこまで広げるか',
      '法的・医療的な最終判断',
      '個別ケースの高リスク判断',
      '外部への正式な回答や対外責任',
    ],
  },
];

export const operatingTriggers: OperatingTrigger[] = [
  {
    title: '公開内容にズレが出た',
    when: 'トップと各ページの説明がずれたとき',
    action: '説明と導線をそろえ直し、今の約束を一本化する。',
  },
  {
    title: '個別事情が重い',
    when: '法的・医療的・支援連携の高リスク判断が必要なとき',
    action: 'AIだけで進めず、人が確認するか既存支援へつなぐ。',
  },
  {
    title: '公開資源だけでは足りない',
    when: '関係者調整や個別連携が必要になったとき',
    action: '連携・お問い合わせか、適切な既存支援への接続に切り替える。',
  },
];

export const operatingRisks: OperatingRisk[] = [
  {
    title: 'AIに判断を寄せすぎる',
    detail:
      '法的・医療的・個別事情の重い判断まで AI に寄せると、便利さより先に trust が壊れる。',
  },
  {
    title: '公開約束が実態を超える',
    detail:
      'いま返せる範囲以上のことを public に言うと、説明のきれいさより先に齟齬が出る。',
  },
  {
    title: '実物より説明が先に立つ',
    detail:
      '方法論や運営の説明だけが増えて、何が公開されているかが見えなくなると迷路感が強まる。',
  },
];
