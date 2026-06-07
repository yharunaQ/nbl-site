import type { GetStaticPaths, GetStaticProps } from 'next';
import PageSeo from '@/components/PageSeo';
import {
  getNextNblPreviewPageBySlug,
  getNextNblPreviewSlug,
  NextNblStaticSiteNotFound,
  NextNblStaticSitePageCandidate,
} from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

type FalconNextNblPreviewPageProps = {
  slug: string;
};

const explicitPreviewPageIds = new Set(['NS-01', 'NS-02', 'NS-03', 'NS-04', 'NS-05', 'NS-06', 'NS-07']);

export const getStaticPaths: GetStaticPaths = () => ({
  paths: nextSiteCandidatePages
    .filter((page) => !explicitPreviewPageIds.has(page.id))
    .map((page) => ({
      params: { slug: getNextNblPreviewSlug(page) },
    })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<FalconNextNblPreviewPageProps> = ({ params }) => ({
  props: {
    slug: String(params?.slug ?? ''),
  },
});

export default function FalconNextNblPreviewDetailPage({
  slug,
}: FalconNextNblPreviewPageProps) {
  const page = getNextNblPreviewPageBySlug(slug);

  if (!page) {
    return (
      <>
        <PageSeo
          title="ページが見つかりません"
          description="指定されたページは、このプレビューにはありません。"
          path={`/preview/falcon-next-nbl/${slug}`}
          noIndex
        />
        <NextNblStaticSiteNotFound />
      </>
    );
  }

  return (
    <>
      <PageSeo
        title={`${page.headline}`}
        description={page.lead}
        path={`/preview/falcon-next-nbl/${slug}`}
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
