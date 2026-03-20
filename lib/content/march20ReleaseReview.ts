export type March20Hero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type March20Bucket = {
  title: string;
  items: string[];
};

export const march20ReleaseHero: March20Hero = {
  eyebrow: 'March 20 Release Sprint',
  headline: '3月20日までに、いったん public に出せる面を仕上げる。',
  subheadline:
    '全部を完成させるのではなく、記事読者がトップで追加情報を自然に得られ、JAC や補足説明も review できる状態まで揃えた上で、2026-03-20 朝の preflight まで迷わず回せるようにする。',
};

export const march20ReleaseBuckets: March20Bucket[] = [
  {
    title: 'Tonight 2026-03-19',
    items: [
      'top / for-enterprise / jac-foundations の読み順を最終確認',
      'public-safe な補足説明ノートを review 可能にしておく',
      'songs は内部整理のままにして main lane に混ぜない',
      'Founder が Yes / No だけ返せる状態にする',
    ],
  },
  {
    title: 'Morning Of 2026-03-20',
    items: [
      '`release:public:preflight` を回す',
      'top、for-enterprise、jac-foundations、resources、videos を目視する',
      '問い合わせ導線と sitemap / robots を確認する',
      '新聞読者が迷わず次のページに行けるかを見る',
    ],
  },
  {
    title: 'Hold Through March 20',
    items: [
      'pricing の公開',
      'open trial promise',
      'guidebook checkout の前面化',
      'JAC 個別相談 wording',
      'songs campaign lane の public main 導線化',
      'lab / DAO / experiment surfaces',
    ],
  },
];
