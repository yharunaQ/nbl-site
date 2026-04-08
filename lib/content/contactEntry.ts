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
      'Next Being Lab では、はたらく相談室（AI就労支援）・27フレームガイドブック・実践知識の3つの入口を公開しています。研究連携・組織での展開・知識の活用について話を始めたい方は、まずこのページで扱うテーマと初回連絡の目安を確認してください。',
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
      title: 'はたらく相談室の活用',
      summary:
        '相談室を支援現場・組織導入・研修素材として使いたいとき。AIが出す見立ての構造や知識ベースについて確認したいとき。',
    },
    {
      title: '研究・登壇・実装連携',
      summary:
        '障害・難病、合理的配慮、仕事設計、就労支援のAI活用に関わる企画や共同実装を相談したいとき。',
    },
    {
      title: '組織・職場への展開',
      summary:
        '採用、復職、定着、相談導線、合理的配慮の運用など、職場・組織の設計課題として話を整理したいとき。',
    },
  ] as ContactCard[],
  beforeEmailLinks: [
    {
      title: 'About',
      summary: 'NBL が何を目指し、どんな知識ネットワークを基盤にしているかを確認できます。',
      href: '/about',
      cta: 'About を見る',
    },
    {
      title: '27フレーム ガイドブック',
      summary: '就労困難を仕事・環境・支援の設計課題として読む27のフレーム。基礎的な前提として先に見ておくと目線がそろいやすくなります。',
      href: '/guide',
      cta: 'ガイドブックを見る',
    },
    {
      title: '実践知識',
      summary: '71.9%問題・地域格差・連携効果のエビデンス。データが示す就労支援の構造を確認できます。',
      href: '/knowledge',
      cta: '実践知識を見る',
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
        'About、27フレームガイドブック、実践知識のどれか1つでも見てから連絡すると、前提や目線がそろいやすくなります。',
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
