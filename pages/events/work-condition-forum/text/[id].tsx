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
    />
  );
}
