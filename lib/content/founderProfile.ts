export type FounderProfile = {
  name: string;
  role: string;
  credential: string;
  summary: string;
  stance: string;
  focus: string[];
  researchProfileUrl: string;
  researchProfileLabel: string;
};

export const founderProfile: FounderProfile = {
  name: '春名由一郎',
  role: 'Next Being Lab 創設者',
  credential: '前・独立行政法人高齢・障害・求職者雇用支援機構 障害者職業総合センター 副統括研究員',
  summary:
    '職業リハビリテーションの研究と実務知見を土台に、障害・難病と仕事設計のギャップを、AI時代の人間参加の設計までつなげて考える。',
  stance:
    'NBL は Founder 個人への属人的な相談窓口というより、知識、方法論、共有資源、AI運営を積み上げる lab / studio として動いている。',
  focus: [
    '合理的配慮を、個別の好意ではなく職場設計として捉え直す',
    '継続就労や相談導線を、本人責任だけで終わらせない',
    'AI時代に、人が人として参加できる器を広げる',
  ],
  researchProfileUrl: 'https://researchmap.jp/yharuna',
  researchProfileLabel: '研究プロフィールを見る',
};
