import WorkConditionForumTextPage, {
  type WorkConditionForumTextPageProps,
} from '@/pages/preview/work-condition-forum-text/[id]';

export { getStaticPaths, getStaticProps } from '@/pages/preview/work-condition-forum-text/[id]';

export default function WorkConditionForumEventTextPage(props: WorkConditionForumTextPageProps) {
  return (
    <WorkConditionForumTextPage
      {...props}
      seoPath={`/events/work-condition-forum/text/${props.presentation.id}`}
      noIndex={false}
      forumHubHref="/events/work-condition-forum"
      textHrefBase="/events/work-condition-forum/text"
      statusLabel="event text / boundary noted"
    />
  );
}
