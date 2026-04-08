export type DisabilityWorkDesignEntry = {
  slug: string;
  label: string;
  framing: string; // 「○○の問題にせず、△△を仕事設計として変える」
  imageSrc: string;
  imageAlt: string;
};

export const disabilityWorkDesignIntro = {
  eyebrow: 'NBL Resources',
  headline: '多様な障害特性を仕事設計で理解する',
  subheadline:
    '従来の「障害種類別の特性リスト」に代わる視点です。診断名から支援を決めるのではなく、どの仕事条件・環境条件・支援条件を変えれば、その人が働き続けられるかを問います。FCHMAの分析フレームを10の障害・疾患分類に適用したインフォグラフィックシリーズです。',
  framingNote:
    '各図の見方: 従来の「障害の問題」という捉え方ではなく、「仕事設計として何を変えるか」という問いに変換しています。',
};

export const disabilityWorkDesignEntries: DisabilityWorkDesignEntry[] = [
  {
    slug: 'visual-impairment',
    label: '視覚障害',
    framing: '見え方の問題にせず、情報・IT・動線を「アクセスできる仕事設計」へ変える。',
    imageSrc: '/resources/disability-work-design/visual-impairment.png',
    imageAlt: '視覚障害の仕事設計：情報アクセスと動線設計の観点からのインフォグラフィック',
  },
  {
    slug: 'hearing-impairment',
    label: '聴覚障害',
    framing: '聞こえ方の問題にせず、音声前提の仕事を「情報が届く設計」へ変える。',
    imageSrc: '/resources/disability-work-design/hearing-impairment.png',
    imageAlt: '聴覚障害の仕事設計：情報伝達と職場コミュニケーション設計のインフォグラフィック',
  },
  {
    slug: 'physical-disability',
    label: '肢体不自由',
    framing: '身体の問題にせず、動線・作業・姿勢を「続けられる仕事設計」へ変える。',
    imageSrc: '/resources/disability-work-design/physical-disability.png',
    imageAlt: '肢体不自由の仕事設計：動線・作業継続性の観点からのインフォグラフィック',
  },
  {
    slug: 'internal-disability',
    label: '内部障害',
    framing: '見えにくい身体管理条件を、本人任せにせず「働ける仕事設計」へ変換する。',
    imageSrc: '/resources/disability-work-design/internal-disability.png',
    imageAlt: '内部障害の仕事設計：体調管理と業務条件設計のインフォグラフィック',
  },
  {
    slug: 'intellectual-disability',
    label: '知的障害',
    framing: '理解力の問題にせず、仕事を「見て・試して・確認できる形」へ変える。',
    imageSrc: '/resources/disability-work-design/intellectual-disability.png',
    imageAlt: '知的障害の仕事設計：業務構造化と支援設計のインフォグラフィック',
  },
  {
    slug: 'neurodiversity',
    label: 'ニューロダイバーシティ',
    framing: '診断名の言い換えではなく、人の多様な処理特性を前提に「働ける条件」を設計する考え方。',
    imageSrc: '/resources/disability-work-design/neurodiversity.png',
    imageAlt: 'ニューロダイバーシティの仕事設計：認知特性と環境設計のインフォグラフィック',
  },
  {
    slug: 'mental-health',
    label: '精神障害',
    framing: '意欲の問題にせず、回復・仕事・支援ネットワークを同時に設計する。',
    imageSrc: '/resources/disability-work-design/mental-health.png',
    imageAlt: '精神障害の仕事設計：回復と就労継続の両立設計のインフォグラフィック',
  },
  {
    slug: 'developmental-disability',
    label: '発達障害',
    framing: '本人を変える前に、仕事の仕様と支援ネットワークを「処理できる形」に変える。',
    imageSrc: '/resources/disability-work-design/developmental-disability.png',
    imageAlt: '発達障害の仕事設計：業務仕様と支援ネットワーク設計のインフォグラフィック',
  },
  {
    slug: 'acquired-brain-injury',
    label: '高次脳機能障害',
    framing: 'ミスや物忘れの問題にせず、仕事を「記憶に頼らず進められる形」へ変える。',
    imageSrc: '/resources/disability-work-design/acquired-brain-injury.png',
    imageAlt: '高次脳機能障害の仕事設計：記憶・遂行機能への環境補完のインフォグラフィック',
  },
  {
    slug: 'intractable-disease',
    label: '難病',
    framing: '病名から支援を決めるのではなく、変動する体調を「働ける条件」に変換する。',
    imageSrc: '/resources/disability-work-design/intractable-disease.png',
    imageAlt: '難病就労支援の仕事設計：体調変動と就労継続条件のインフォグラフィック',
  },
];

export const disabilityWorkDesignGuardrails = [
  '診断名から支援を直接導かない——仕事設計として何を変えるかを問う',
  '障害の「重さ」で支援量を決めない——仕事条件のミスマッチを特定する',
  '制度・法域の注記を省略しない',
  '個人の体験談を一般化しない',
];
