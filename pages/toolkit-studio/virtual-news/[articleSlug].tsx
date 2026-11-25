import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ClipboardList,
  FileText,
  Layers3,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import {
  getNblVirtualNewsArticleBySlug,
  nblVirtualNewsArticles,
  type NblVirtualNewsArticle,
} from '@/lib/content/nblVirtualNews';

type NblVirtualNewsArticlePageProps = {
  article: NblVirtualNewsArticle;
};

function NewsPill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mt-12 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
      {children}
    </h2>
  );
}

function ArticleFigure({ image }: { image: NblVirtualNewsArticle['images'][number] }) {
  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#f7f4ec] p-3">
        <img
          alt={image.alt}
          className="mx-auto block w-full rounded-md object-contain"
          src={image.src}
        />
      </div>
      <figcaption className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
        {image.caption}
      </figcaption>
    </figure>
  );
}

function getFiguresAfterSection(article: NblVirtualNewsArticle, sectionIndex: number) {
  return article.images.filter((image, imageIndex) => {
    if (image.afterSection !== undefined) {
      return image.afterSection === sectionIndex;
    }

    return imageIndex === sectionIndex;
  });
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: nblVirtualNewsArticles.map((article) => ({
    params: { articleSlug: article.slug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<NblVirtualNewsArticlePageProps> = ({ params }) => {
  const articleSlug = String(params?.articleSlug ?? '');
  const article = getNblVirtualNewsArticleBySlug(articleSlug);

  if (!article) {
    return { notFound: true };
  }

  return { props: { article } };
};

export function NblVirtualNewsArticlePage({ article }: NblVirtualNewsArticlePageProps) {
  return (
    <>
      <PageSeo
        title={`${article.title} | ${article.seriesLabel} | Next Being Lab`}
        description={article.dek}
        path={article.path}
        imagePath={article.heroImage.src}
        imageAlt={article.heroImage.alt}
        type="article"
      />

      <main className="w-full max-w-[100vw] overflow-x-hidden break-words bg-[#f7f4ec] text-slate-950 [overflow-wrap:anywhere] [&_*]:min-w-0">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <NextLink
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-900"
              href="/"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white">
                N
              </span>
              Next Being Lab
            </NextLink>
            <nav aria-label="記事周辺リンク" className="flex flex-wrap gap-2 text-sm font-semibold">
              <NextLink
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                href="/virtual-news"
              >
                <ArrowLeft size={15} />
                バーチャルニュース
              </NextLink>
              <NextLink
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                href="/work-design-views-guide"
              >
                仕事設計ガイド
                <ArrowRight size={15} />
              </NextLink>
            </nav>
          </div>
        </header>

        <section
          aria-labelledby="virtual-news-title"
          className="border-b border-slate-200 bg-white"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <NewsPill>{article.seriesLabel}</NewsPill>
                <NewsPill>{article.issueLabel}</NewsPill>
                <NewsPill>{article.publishedAt}</NewsPill>
                <NewsPill>{article.readingTime}</NewsPill>
              </div>
              <h1
                className="mt-6 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] sm:text-4xl md:text-6xl"
                id="virtual-news-title"
              >
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl text-xl font-semibold leading-9 text-teal-950">
                {article.subtitle}
              </p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
                {article.dek}
              </p>
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 shrink-0 text-amber-800" size={18} />
                  <p>{article.notice}</p>
                </div>
              </div>
            </div>

            <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img
                alt={article.heroImage.alt}
                className="aspect-[16/9] w-full object-cover"
                src={article.heroImage.src}
              />
              <figcaption className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
                {article.heroImage.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#eef5f1]" aria-label="記事の要点">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Quick read
              </p>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
                {article.quickReadTitle}
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {article.keyPoints.map((point) => (
                <div
                  className="flex gap-3 rounded-lg border border-teal-100 bg-white p-4 text-sm leading-7 text-slate-700"
                  key={point}
                >
                  <Check className="mt-1 shrink-0 text-teal-800" size={17} />
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            {article.articleSections.map((section, sectionIndex) => (
              <section key={section.heading}>
                <SectionHeading>{section.heading}</SectionHeading>
                <div className="mt-5 space-y-5 text-base leading-9 text-slate-700 md:text-lg">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {getFiguresAfterSection(article, sectionIndex).map((image) => (
                  <ArticleFigure image={image} key={image.src} />
                ))}
              </section>
            ))}

            <section>
              <SectionHeading>標準体制として見る部品</SectionHeading>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {article.systemPillars.map((pillar) => (
                  <div
                    className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5"
                    key={pillar.title}
                  >
                    <h3 className="text-lg font-semibold leading-7 text-slate-950">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{pillar.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>現場で使うなら、手順はこの順番</SectionHeading>
              <div className="mt-6 grid gap-4">
                {article.procedureSteps.map((step) => (
                  <div
                    className="grid gap-4 rounded-lg border border-teal-100 bg-[#eef5f1] p-5 md:grid-cols-[220px_1fr] md:items-start"
                    key={step.title}
                  >
                    <h3 className="text-lg font-semibold leading-7 text-teal-950">{step.title}</h3>
                    <p className="text-sm leading-7 text-slate-700">{step.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>読後に話す問い</SectionHeading>
              <ul className="mt-6 grid gap-3">
                {article.discussionQuestions.map((question) => (
                  <li
                    className="flex gap-3 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4 text-sm leading-7 text-slate-700"
                    key={question}
                  >
                    <ClipboardList className="mt-1 shrink-0 text-teal-800" size={17} />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                Article boundary
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-950">
                これは判断記事ではありません。
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{article.boundary}</p>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                Shift
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-950">
                誰か一人に寄せない。
              </h2>
              <div className="mt-4 grid gap-3">
                {article.burdenShiftCards.map((card, index) => {
                  const Icon = index === 0 ? UsersRound : index === 1 ? Building2 : Layers3;

                  return (
                    <div
                      className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4"
                      key={card.title}
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-teal-800 shadow-sm">
                          <Icon size={17} />
                        </span>
                        <h3 className="text-sm font-semibold leading-6 text-slate-950">
                          {card.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                Related
              </p>
              <div className="mt-4 grid gap-3">
                {article.relatedLinks.map((link) => (
                  <NextLink
                    className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-4 transition hover:border-teal-500 hover:bg-white"
                    href={link.href}
                    key={link.href}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-950">{link.label}</span>
                      <ArrowRight
                        className="text-teal-800 transition group-hover:translate-x-0.5"
                        size={15}
                      />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-slate-700">
                      {link.description}
                    </span>
                  </NextLink>
                ))}
              </div>
            </section>

            {article.sourceLinks.length > 0 ? (
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                  Source lens
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-950">
                  参照情報は、実装モデルとして読む。
                </h2>
                <div className="mt-4 grid gap-3">
                  {article.sourceLinks.map((source) => (
                    <a
                      className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-4 transition hover:border-teal-500 hover:bg-white"
                      href={source.href}
                      key={source.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-950">{source.label}</span>
                        <ArrowRight
                          className="text-teal-800 transition group-hover:translate-x-0.5"
                          size={15}
                        />
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-700">
                        {source.description}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>

        <section className="border-t border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[0.72fr_1.28fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-100">
                NBL Virtual News
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-normal md:text-3xl">
                架空記事を、職場で話すための素材にする。
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-white/8 p-4">
                <FileText className="text-amber-100" size={20} />
                <p className="mt-3 text-sm leading-7 text-slate-100">
                  実在企業の成功談に見せず、具体的な体制・予算・手順を想像できるニュース形式にしています。
                </p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/8 p-4">
                <ShieldCheck className="text-amber-100" size={20} />
                <p className="mt-3 text-sm leading-7 text-slate-100">
                  医療、法務、人事、合理的配慮妥当性の判断は扱わず、仕事条件を話す入口として使います。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default function ToolkitVirtualNewsArticlePage({
  article,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <NblVirtualNewsArticlePage article={article} />;
}
