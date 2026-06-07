type OrganizationsSurfaceBoundaryNoteProps = {
  variant?: 'index' | 'design' | 'diagnosis';
};

const COPY = {
  index: {
    badge: '組織設計の入口',
    accent: 'border-emerald-200 bg-emerald-50/80',
    badgeTone: 'bg-emerald-100 text-emerald-900',
    title: '個人の努力ではなく、組織側の条件を見る',
    summary:
      '支援機関の管理職・機関長や企業の人事担当者が、記録、会議、時間、評価、外部連携などの配置を見直す入口です。',
    whatItIsNot: '組織の良し悪し、法令適合性、個別ケースの結論を判定するものではありません。',
    howToUse:
      '気になる論点を選び、次の会議や相談で「どこを変えれば支援が残るか」を話す材料にしてください。',
  },
  design: {
    badge: '組織設計ガイド',
    accent: 'border-teal-200 bg-teal-50/80',
    badgeTone: 'bg-teal-100 text-teal-900',
    title: '働き続けられる条件を、組織の仕組みとして設計する',
    summary:
      '日本の調査研究と国際的な実践知を手がかりに、支援が個人任せで終わらない組織設計の方向を整理します。',
    whatItIsNot:
      '個別組織にそのまま当てはまる完成済みの標準や、改善効果を保証する手順書ではありません。',
    howToUse:
      '自組織の制度条件、業務構造、人員配置に照らして、どの設計論点から話し合うかを絞り込んでください。',
  },
  diagnosis: {
    badge: '組織自己チェック',
    accent: 'border-indigo-200 bg-indigo-50/80',
    badgeTone: 'bg-indigo-100 text-indigo-900',
    title: 'この面は、話し合いの入口として使う自己チェックです',
    summary:
      '支援者が動きにくくなる組織側の条件を、5つの観点から会話可能な形に切り出すためのツールです。',
    whatItIsNot:
      '監査、認証、法令適合性、組織の良し悪し、改善効果を確定する判定ではありません。',
    howToUse:
      '点数を結論にせず、記録、会議、同行、学習回路のどこを話し合うかを選ぶ入口として使います。',
  },
} as const;

export default function OrganizationsSurfaceBoundaryNote({
  variant = 'index',
}: OrganizationsSurfaceBoundaryNoteProps) {
  const copy = COPY[variant];

  return (
    <section className={`rounded-[1.6rem] border px-5 py-5 shadow-sm shadow-slate-200/50 ${copy.accent}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${copy.badgeTone}`}>
          {copy.badge}
        </span>
      </div>
      <h2 className="mt-3 text-base font-semibold text-slate-950">{copy.title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
        <li>これは何か: {copy.summary}</li>
        <li>まだ何ではないか: {copy.whatItIsNot}</li>
        <li>どう使うか: {copy.howToUse}</li>
      </ul>
    </section>
  );
}
