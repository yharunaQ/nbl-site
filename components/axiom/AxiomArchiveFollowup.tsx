import Link from 'next/link';

type Followup = { href: string; label: string };

export const archiveFollowups = {
  work: { href: '/work-design-views-guide?system=WDG2-03#guide-detail', label: '作業の指示・確認・評価を職場で決める' },
  time: { href: '/work-design-views-guide?system=WDG2-04#time-prepare', label: '体調に合わせて勤務時間と仕事量を組み直す' },
  access: { href: '/work-design-views-guide?system=WDG2-05#access-real-work', label: '会議と作業に必要な情報の渡し方を整える' },
  choice: { href: '/case-readings?case=person-controlled-coordination#case-detail', label: '本人が共有する相手と範囲を選ぶ事例を読む' },
  start: { href: '/first-day-assistance', label: '働き始める日に必要な介助と手配を確かめる' },
  team: { href: '/practice-workbook', label: '会議で担当・必要な時間・結果の見直し方を決める' },
  song: { href: '/resources/songs/mienai-nimotsu-no-hero', label: '「見えない荷物のヒーロー」を聴く' },
  comic: { href: '/toolkit-studio?image=ibd-02#toolkit-selected-infographic-library', label: '四コマ「初出勤とトイレマップ」を読む' },
} satisfies Record<string, Followup>;

const workDesignArticle: Record<string, Followup> = {
  'updating-low-expectation-jobs': archiveFollowups.work,
  'hiring-work-condition-entry': archiveFollowups.work,
  'rework-return-to-work-redesign': archiveFollowups.time,
  'work-environment-first-disability-employment': archiveFollowups.work,
  'neurodiversity-craft-specialist-hiring': archiveFollowups.work,
  'accommodation-dialogue-work-design': archiveFollowups.choice,
  'medical-information-work-condition-translation': archiveFollowups.choice,
  'information-access-meeting-emergency-standard': archiveFollowups.access,
  'no-handbook-rare-disease-work-difficulty': archiveFollowups.time,
};

export function archiveArticleFollowup(slug: string) {
  return workDesignArticle[slug] ?? archiveFollowups.team;
}

const forumPresentation: Record<string, Followup> = {
  'VF-05': archiveFollowups.work,
  'VF-06': archiveFollowups.choice,
  'VF-09': archiveFollowups.time,
  'VF-13': archiveFollowups.start,
  'VF-15': archiveFollowups.access,
  'VF-17': archiveFollowups.work,
};

export function archiveForumFollowup(id: string) {
  return forumPresentation[id.toUpperCase()] ?? archiveFollowups.team;
}

export default function AxiomArchiveFollowup({
  heading,
  links,
  proposal,
}: {
  heading: string;
  links: readonly Followup[];
  proposal?: string;
}) {
  return (
    <section aria-label={heading} className="mx-auto my-8 w-full max-w-4xl rounded-xl border border-teal-900/20 bg-[#f5f9f5] px-5 py-4 text-slate-900 sm:my-10 sm:px-6">
      <h2 className="text-base font-bold sm:text-lg">{heading}</h2>
      <ul className="mt-2 grid gap-1 text-sm leading-6 sm:text-base">
        {links.map(({ href, label }) => (
          <li key={href}><Link className="inline-block py-1 font-semibold text-teal-900 underline underline-offset-4" href={href}>{label}</Link></li>
        ))}
        {proposal && (
          <li><Link className="inline-block py-1 font-semibold text-teal-900 underline underline-offset-4" href="/public-collaboration#proposal">{proposal}</Link></li>
        )}
      </ul>
    </section>
  );
}
