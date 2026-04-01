export type ContactHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type ContactCard = {
  title: string;
  summary: string;
};

export type ContactLinkCard = {
  title: string;
  summary: string;
  href: string;
  cta: string;
};

export type ContactStep = {
  title: string;
  detail: string;
};

export const contactEntry = {
  hero: {
    eyebrow: 'Collaboration & Contact',
    headline: 'NBL と話を始めたい方へ',
    subheadline:
      'Next Being Lab では、障害・難病と仕事設計、合理的配慮、継続就労、共有資源づくり、AI運営の設計に関わる連携や対話の入口を公開しています。最初のやりとりはメールですが、その前に、扱うテーマ、公開している内容、まだ固定していない約束を整理しています。',
  } as ContactHero,
  quickPoints: [
    '最初の連絡は数行でもやりとりを始められます。',
    '初回のやりとりはメールです。',
    'Founder と NBL の背景を先に確認できます。',
    '扱う範囲と扱わない範囲を先に見られます。',
    '高リスク判断や対外約束は人が持つ前提を先に確認できます。',
  ],
  welcomeTopics: [
    {
      title: '内容確認や共同検討',
      summary:
        '公開中の図解、動画、仕事設計の見取り図を読んだうえで、実務とのつながりや次の論点を整理したいとき。',
    },
    {
      title: '登壇・研究・実装連携',
      summary:
        '障害・難病、合理的配慮、仕事設計、AI時代の人間参加に関わる企画や共同実装を相談したいとき。',
    },
    {
      title: '組織内の詰まりの整理',
      summary:
        '採用、復職、定着、相談導線、情報共有、会議運用など、どこが詰まっているかを整理したいとき。',
    },
  ] as ContactCard[],
  beforeEmailLinks: [
    {
      title: 'About',
      summary: 'NBL が何を目指し、何を目指さず、どんな地平で動いているかを確認できます。',
      href: '/about',
      cta: 'About を見る',
    },
    {
      title: 'What We Do',
      summary: '今案内している入口と、AI チームが担う範囲、まだ出していない約束を確認できます。',
      href: '/what-we-do',
      cta: 'What We Do を見る',
    },
    {
      title: '仕事設計の見取り図',
      summary: '困りごとを、個人の問題だけでなく仕事・環境・支援の条件として読む基礎ページです。',
      href: '/jac-foundations',
      cta: '基礎説明を見る',
    },
  ] as ContactLinkCard[],
  emailChecklist: [
    'ご自身の立場: 企業、支援者、当事者、研究者など',
    'いま一番詰まっている場面: 採用、復職、日常運用、相談導線など',
    'NBL と話したいこと: 内容確認、共同検討、登壇、企画相談など',
  ],
  steps: [
    {
      title: '1. 近いページを1つ見ておく',
      detail:
        'About、What We Do、仕事設計の見取り図のどれか1つでも見てから連絡すると、前提や目線がそろいやすくなります。',
    },
    {
      title: '2. 要点を数行で共有する',
      detail:
        '状況がまだ整理しきれていなくても、箇条書きや短いメモで流れを作れます。最初から完全な説明である必要はありません。',
    },
    {
      title: '3. 最初の往復はメールで進める',
      detail: '最初の往復はメールで行い、必要に応じて次の整理や連携の進め方を考えます。',
    },
  ] as ContactStep[],
  boundaries: [
    '緊急対応や危機対応の窓口ではありません。',
    '法的判断、医療判断、就労可否の最終判断をこのページで約束するものではありません。',
    '即日返信や fixed package の提供を、公開上の約束としては出していません。',
  ],
};
