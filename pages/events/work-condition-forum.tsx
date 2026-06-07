import WorkConditionForumSessionPackagesPage from '@/pages/preview/work-condition-forum-session-packages';

export default function WorkConditionForumEventPage() {
  return (
    <WorkConditionForumSessionPackagesPage
      seoPath="/events/work-condition-forum"
      noIndex={false}
      presentationHrefBase="/events/work-condition-forum/text"
      footerStatus="このフォーラムはNBLのイベント型コンテンツです。"
    />
  );
}
