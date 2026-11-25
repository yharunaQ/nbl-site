import AxiomArchiveFollowup, { archiveForumFollowup } from '@/components/axiom/AxiomArchiveFollowup';
import WorkConditionForumTextPage, {
  type WorkConditionForumTextPageProps,
} from '@/pages/preview/work-condition-forum-text/[id]';
import { NEXT_NBL_CARRYOVER_LINKS } from '@/lib/axiom/nextNblPublicCandidateCarryoverLinks';

export { getStaticPaths, getStaticProps } from '@/pages/preview/work-condition-forum-text/[id]';

export default function WorkConditionForumEventTextPage(props: WorkConditionForumTextPageProps) {
  return (
    <WorkConditionForumTextPage
      {...props}
      seoPath={`/events/work-condition-forum/text/${props.presentation.id}`}
      noIndex={false}
      forumHubHref="/events/work-condition-forum"
      textHrefBase="/events/work-condition-forum/text"
      statusLabel="公開記事 / 境界確認"
      siteHomeHref={NEXT_NBL_CARRYOVER_LINKS.home}
      reportHref={NEXT_NBL_CARRYOVER_LINKS.report}
      toolkitHref={NEXT_NBL_CARRYOVER_LINKS.toolkit}
      followup={
        <AxiomArchiveFollowup
          heading="発表の論点を、自分の現場で確かめる"
          links={[archiveForumFollowup(props.presentation.id)]}
          proposal="発表の前提への異論や、現場の別案を提案する"
        />
      }
    />
  );
}
