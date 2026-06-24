import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import {
  buildAxiomNblReportShareItems,
  type AxiomNblReportShareItem,
} from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import { rewriteAxiomCandidateHrefToPublished } from '@/lib/axiom/nextNblPublishedRoutes';

type NblReportSharePageProps = {
  item: AxiomNblReportShareItem;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: buildAxiomNblReportShareItems().map((item) => ({
      params: { articleId: item.id },
    })),
  };
};

export const getStaticProps: GetStaticProps<NblReportSharePageProps> = async ({ params }) => {
  const articleId = String(params?.articleId ?? '');
  const item = buildAxiomNblReportShareItems().find((candidate) => candidate.id === articleId);

  if (!item) {
    return { notFound: true };
  }

  return { props: { item } };
};

export default function NblReportSharePage({ item }: NblReportSharePageProps) {
  const targetPath = rewriteAxiomCandidateHrefToPublished(item.targetPath);

  return (
    <>
      <PageSeo
        title={`${item.title} | NBLレポート`}
        description={item.description}
        path={item.sharePath}
        imagePath={item.imageSrc}
        imageAlt={item.imageAlt}
        type="article"
      />
      <main className="min-h-screen bg-[#fbfaf5] text-slate-950">
        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              NBLレポート
            </p>
            <h1 className="mt-4 break-words text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              {item.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{item.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
                href={targetPath}
              >
                記事本文を読む
              </Link>
              <Link
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                href="/articles-social-questions"
              >
                NBLレポート一覧へ
              </Link>
            </div>
          </div>
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <img alt={item.imageAlt} className="block h-auto w-full" src={item.imageSrc} />
            <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
              このページはSNS共有用の入口です。詳しい本文はNBLレポートで読めます。
            </figcaption>
          </figure>
        </section>
      </main>
    </>
  );
}
