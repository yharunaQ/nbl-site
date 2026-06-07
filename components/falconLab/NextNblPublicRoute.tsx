import PageSeo from '@/components/PageSeo';
import {
  getNextNblPreviewPageBySlug,
  NextNblStaticSiteHomeCandidate,
  NextNblStaticSiteNotFound,
  NextNblStaticSitePageCandidate,
} from '@/components/falconLab/NextNblStaticSiteCandidate';

const publicSeoImage = '/images/next-nbl-work-design-hero-v1.webp';
const publicSeoImageAlt =
  '企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト';

export function NextNblPublicHomeRoute() {
  return (
    <>
      <PageSeo
        title="働きづらさを、仕事条件から考える。"
        description="働きづらさを、本人の状態だけでなく、仕事の時間、作業、情報、環境、支援、評価の重なりとして読み直す入口です。"
        path="/"
        imagePath={publicSeoImage}
        imageAlt={publicSeoImageAlt}
      />
      <NextNblStaticSiteHomeCandidate routeBase="" />
    </>
  );
}

export function NextNblPublicDetailRoute({ slug, path }: { slug: string; path: string }) {
  const page = getNextNblPreviewPageBySlug(slug);

  if (!page) {
    return (
      <>
        <PageSeo
          title="ページが見つかりません"
          description="指定されたページはありません。"
          path={path}
          noIndex
        />
        <NextNblStaticSiteNotFound routeBase="" />
      </>
    );
  }

  return (
    <>
      <PageSeo
        title={page.headline}
        description={page.lead}
        path={path}
        imagePath={publicSeoImage}
        imageAlt={publicSeoImageAlt}
      />
      <NextNblStaticSitePageCandidate page={page} routeBase="" />
    </>
  );
}
