import PageSeo from '@/components/PageSeo';
import {
  getNextNblPreviewPageBySlug,
  NextNblStaticSiteHomeCandidate,
  NextNblStaticSiteNotFound,
  NextNblStaticSitePageCandidate,
} from '@/components/falconLab/NextNblStaticSiteCandidate';

const publicHomeSeoImage =
  '/images/nbl-home-hero-candidates/next-nbl-home-hero-diverse-manifold-image2-v2.png';
const publicHomeSeoImageAlt =
  '明るい場で多様な人々の仕事、生活、移動、支援の関係がAI時代のmanifoldとして重なって見えるビジュアル';
const publicDefaultSeoImage = '/images/next-nbl-work-design-hero-v1.webp';
const publicDefaultSeoImageAlt =
  '企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト';

export function NextNblPublicHomeRoute() {
  return (
    <>
      <PageSeo
        title="働きづらさを、仕事条件から考える。"
        description="働きづらさを、本人の状態だけでなく、仕事の時間、作業、情報、環境、支援、評価の重なりとして読み直す入口です。"
        path="/"
        imagePath={publicHomeSeoImage}
        imageAlt={publicHomeSeoImageAlt}
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
        imagePath={publicDefaultSeoImage}
        imageAlt={publicDefaultSeoImageAlt}
      />
      <NextNblStaticSitePageCandidate page={page} routeBase="" />
    </>
  );
}
