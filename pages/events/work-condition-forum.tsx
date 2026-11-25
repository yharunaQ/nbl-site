import AxiomArchiveFollowup, { archiveFollowups } from '@/components/axiom/AxiomArchiveFollowup';
import WorkConditionForumSessionPackagesPage from '@/pages/preview/work-condition-forum-session-packages';
import { NEXT_NBL_CARRYOVER_LINKS } from '@/lib/axiom/nextNblPublicCandidateCarryoverLinks';

export default function WorkConditionForumEventPage() {
  return (
    <WorkConditionForumSessionPackagesPage
      seoPath="/events/work-condition-forum"
      noIndex={false}
      presentationHrefBase="/events/work-condition-forum/text"
      footerStatus="このフォーラムはNBLのイベント型コンテンツです。"
      siteHomeHref={NEXT_NBL_CARRYOVER_LINKS.home}
      reportHref={NEXT_NBL_CARRYOVER_LINKS.report}
      toolkitHref={NEXT_NBL_CARRYOVER_LINKS.toolkit}
      followup={
        <AxiomArchiveFollowup
          heading="フォーラムで読んだテーマを会議に持ち帰る"
          links={[archiveFollowups.team]}
          proposal="次に取り上げたい議題や、現場の別案を提案する"
        />
      }
    />
  );
}
