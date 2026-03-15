import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import TemporarySectionNotice from '@/components/TemporarySectionNotice';
import { getTemporaryPublicRouteBySlug } from '@/lib/publicSiteMode';

type SiteUpdateSectionPageProps = {
  sectionSlug: string;
};

export const getServerSideProps: GetServerSideProps<SiteUpdateSectionPageProps> = async ({
  params,
}) => {
  return {
    props: {
      sectionSlug: typeof params?.section === 'string' ? params.section : '',
    },
  };
};

export default function SiteUpdateSectionPage({
  sectionSlug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const route = getTemporaryPublicRouteBySlug(sectionSlug);

  return (
    <TemporarySectionNotice
      sectionLabel={route?.label ?? 'This section'}
      sectionNote={
        route?.note ?? 'temporary public-safe mode is active while the renewed site is prepared'
      }
    />
  );
}
