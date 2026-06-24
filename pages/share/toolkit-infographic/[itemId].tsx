import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import {
  buildAxiomToolkitInfographicShareItems,
  type AxiomToolkitInfographicShareItem,
} from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import { rewriteAxiomCandidateHrefToPublished } from '@/lib/axiom/nextNblPublishedRoutes';

type ToolkitInfographicSharePageProps = {
  item: AxiomToolkitInfographicShareItem;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: buildAxiomToolkitInfographicShareItems().map((item) => ({
      params: { itemId: item.id },
    })),
  };
};

export const getStaticProps: GetStaticProps<ToolkitInfographicSharePageProps> = async ({
  params,
}) => {
  const itemId = String(params?.itemId ?? '');
  const item = buildAxiomToolkitInfographicShareItems().find(
    (candidate) => candidate.id === itemId,
  );

  if (!item) {
    return { notFound: true };
  }

  return { props: { item } };
};

export default function ToolkitInfographicSharePage({
  item,
}: ToolkitInfographicSharePageProps) {
  const targetPath = rewriteAxiomCandidateHrefToPublished(item.targetPath);

  return (
    <>
      <PageSeo
        title={`${item.title} | NBLツールキット`}
        description={item.description}
        path={item.sharePath}
        imagePath={item.imageSrc}
        imageAlt={item.imageAlt}
      />
      <main className="min-h-screen bg-[#fbfaf5] text-slate-950">
        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_1fr] md:items-center md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              NBLツールキット
            </p>
            <p className="mt-4 inline-flex rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-semibold text-teal-900">
              {item.groupTitle}
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
                図解をページで開く
              </Link>
              <Link
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                href="/toolkit-studio"
              >
                ツールキットへ
              </Link>
            </div>
          </div>
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <img alt={item.imageAlt} className="block h-auto w-full" src={item.imageSrc} />
            <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
              このページはSNS共有用の入口です。図解はツールキット上で拡大して読めます。
            </figcaption>
          </figure>
        </section>
      </main>
    </>
  );
}
