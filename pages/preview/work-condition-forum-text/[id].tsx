import PageSeo from '@/components/PageSeo';
import { NEXT_NBL_CARRYOVER_LINKS } from '@/lib/axiom/nextNblPublicCandidateCarryoverLinks';
import {
  getNextWorkConditionForumPresentation,
  getWorkConditionForumPresentationById,
  workConditionForumArticleFileName,
  workConditionForumGroups,
  workConditionForumPresentations,
  youtubeEmbedUrl,
  type WorkConditionForumPresentation,
} from '@/lib/falconLab/workConditionForum';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MonitorPlay,
  ShieldCheck,
  Users,
  X,
  ZoomIn,
} from 'lucide-react';

export type StructuredArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export type StructuredArticleSection = {
  heading: string;
  blocks: StructuredArticleBlock[];
};

export type StructuredArticle = {
  title: string;
  metadata: string[];
  sections: StructuredArticleSection[];
};

export type WorkConditionForumTextPageProps = {
  presentation: WorkConditionForumPresentation;
  article: StructuredArticle;
  seoPath?: string;
  noIndex?: boolean;
  forumHubHref?: string;
  textHrefBase?: string;
  statusLabel?: string;
  siteHomeHref?: string;
  reportHref?: string;
  toolkitHref?: string;
};

type PendingBlock =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'quote'; lines: string[] }
  | { type: 'list'; lines: string[] }
  | null;

function shouldRenderArticleSection(section: StructuredArticleSection) {
  return (
    !section.heading.includes('スライド・図解とあわせて読む') &&
    !section.heading.includes('公開・個別判断')
  );
}

function splitListItemLead(item: string) {
  const match = item.match(/^([^：:]{1,36})[：:](.+)$/u);

  if (!match) {
    return null;
  }

  return {
    lead: match[1].trim(),
    body: match[2].trim(),
  };
}

function normalizeMarkdownLine(line: string) {
  return line.replace(/\s{2,}$/u, '').trim();
}

function flushPendingBlock(section: StructuredArticleSection | null, pending: PendingBlock) {
  if (!section || !pending || pending.lines.length === 0) {
    return;
  }

  if (pending.type === 'list') {
    section.blocks.push({ type: 'list', items: pending.lines });
    return;
  }

  section.blocks.push({
    type: pending.type,
    text: pending.lines.join(' ').replace(/\s+/gu, ' ').trim(),
  });
}

export function parseStructuredArticleMarkdown(markdown: string): StructuredArticle {
  const lines = markdown.split(/\r?\n/u);
  const metadata: string[] = [];
  const sections: StructuredArticleSection[] = [];
  let title = '';
  let currentSection: StructuredArticleSection | null = null;
  let pending: PendingBlock = null;

  const flush = () => {
    flushPendingBlock(currentSection, pending);
    pending = null;
  };

  for (const rawLine of lines) {
    const line = normalizeMarkdownLine(rawLine);

    if (line.startsWith('# ')) {
      title = line.replace(/^#\s+/u, '');
      continue;
    }

    if (line.startsWith('## ')) {
      flush();
      currentSection = { heading: line.replace(/^##\s+/u, ''), blocks: [] };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      if (line) {
        metadata.push(line);
      }
      continue;
    }

    if (!line) {
      flush();
      continue;
    }

    if (line.startsWith('- ')) {
      if (!pending || pending.type !== 'list') {
        flush();
        pending = { type: 'list', lines: [] };
      }
      pending.lines.push(line.replace(/^-\s+/u, ''));
      continue;
    }

    if (line.startsWith('> ')) {
      if (!pending || pending.type !== 'quote') {
        flush();
        pending = { type: 'quote', lines: [] };
      }
      pending.lines.push(line.replace(/^>\s+/u, ''));
      continue;
    }

    if (!pending || pending.type !== 'paragraph') {
      flush();
      pending = { type: 'paragraph', lines: [] };
    }
    pending.lines.push(line);
  }

  flush();

  return {
    title,
    metadata: metadata.filter((line) => !line.startsWith('Status:')),
    sections,
  };
}

export default function WorkConditionForumTextPage({
  presentation,
  article,
  seoPath,
  noIndex = true,
  forumHubHref = '/preview/work-condition-forum-session-packages',
  textHrefBase = '/preview/work-condition-forum-text',
  statusLabel = '本文記事 / 境界確認',
  siteHomeHref = NEXT_NBL_CARRYOVER_LINKS.home,
  reportHref = NEXT_NBL_CARRYOVER_LINKS.report,
  toolkitHref = NEXT_NBL_CARRYOVER_LINKS.toolkit,
}: WorkConditionForumTextPageProps) {
  const [isInfographicOpen, setIsInfographicOpen] = useState(false);
  const group =
    workConditionForumGroups.find((candidate) => candidate.id === presentation.groupId) ??
    workConditionForumGroups[0];
  const nextPresentation = getNextWorkConditionForumPresentation(presentation.id);
  const visibleSections = article.sections.filter(shouldRenderArticleSection);
  const forumSessionHref = `${forumHubHref}#${presentation.groupId}`;
  const presentationTextHref = (id: string) => `${textHrefBase}/${encodeURIComponent(id)}`;

  return (
    <>
      <PageSeo
        title={`${presentation.title}｜仕事条件デザイン・バーチャルフォーラム本文`}
        description={`${presentation.summary} 仕事条件デザイン・バーチャルフォーラムの本文ページです。`}
        path={seoPath ?? presentation.textHref}
        imagePath={presentation.presenterImagePath}
        imageAlt={`${presentation.id} ${presentation.presenter}の発表風景`}
        type="article"
        noIndex={noIndex}
      />
      <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#f8f3e9] text-slate-950 [overflow-wrap:anywhere]">
        <section
          className="relative overflow-hidden bg-slate-950 bg-cover bg-no-repeat text-white"
          style={{
            backgroundImage: `url(${presentation.presenterImagePath})`,
            backgroundPosition: presentation.photoPosition,
          }}
        >
          <div className="absolute inset-0 bg-slate-950/78" />
          <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-5 md:px-8 lg:px-10">
            <header className="flex flex-col gap-3 border-b border-white/18 pb-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <nav
                className="flex flex-wrap items-center gap-3 text-white/78"
                aria-label="フォーラム本文とNBLサイトのナビゲーション"
              >
                <a
                  href={forumSessionHref}
                  className="inline-flex w-fit items-center gap-2 font-semibold text-cyan-100 hover:text-white"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  フォーラム一覧へ戻る
                </a>
                <span className="hidden h-4 w-px bg-white/22 sm:inline-block" aria-hidden="true" />
                <a href={siteHomeHref} className="hover:text-white">
                  NBLトップ
                </a>
                <a href={reportHref} className="hover:text-white">
                  NBLレポート
                </a>
                <a href={toolkitHref} className="hover:text-white">
                  ツールキット
                </a>
              </nav>
              <span className="w-fit border border-white/20 px-3 py-1 text-white/72">
                {statusLabel}
              </span>
            </header>

            <div className="grid gap-8 py-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-end">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                  {presentation.id} / Session {group.number} / {group.label}
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                  {presentation.title}
                </h1>
                <p className="mt-5 flex gap-2 text-sm font-semibold leading-6 text-white/86">
                  <Users size={16} className="mt-1 shrink-0 text-cyan-100" aria-hidden="true" />
                  <span>
                    {presentation.presenter} / {presentation.style}
                  </span>
                </p>
              </div>

              <div className="border border-white/24 bg-slate-950/64 p-5 shadow-2xl backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-[0.16em] text-cyan-100">
                  ARTICLE SUMMARY
                </p>
                <p className="mt-3 text-lg font-semibold leading-9 text-white/88">
                  {presentation.summary}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-300 bg-white py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-5 md:px-8">
            <p className="text-sm font-semibold tracking-[0.14em] text-cyan-900">INFOGRAPHIC</p>
            <button
              type="button"
              onClick={() => setIsInfographicOpen(true)}
              className="mt-4 block w-full overflow-hidden border border-slate-300 bg-slate-100 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-600 hover:shadow-lg"
              aria-label={`${presentation.id}のインフォグラフィックを拡大表示する`}
            >
              <img
                src={presentation.infographicHref}
                alt={`${presentation.id} ${presentation.title} のインフォグラフィック`}
                className="w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <span className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
                図解をクリックして拡大表示
                <ZoomIn size={18} aria-hidden="true" />
              </span>
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="#forum-video"
                className="inline-flex items-center justify-center gap-2 border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-950 hover:bg-rose-100"
              >
                <MonitorPlay size={16} aria-hidden="true" />
                動画へ
              </a>
            </div>
          </div>
        </section>

        {isInfographicOpen ? (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/88 p-4 text-white"
            role="dialog"
            aria-modal="true"
            aria-label={`${presentation.id} インフォグラフィック拡大表示`}
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-[0.14em] text-cyan-100">
                  {presentation.id} INFOGRAPHIC
                </p>
                <button
                  type="button"
                  onClick={() => setIsInfographicOpen(false)}
                  className="inline-flex items-center gap-2 border border-white/24 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white hover:text-slate-950"
                >
                  <X size={16} aria-hidden="true" />
                  閉じる
                </button>
              </div>
              <img
                src={presentation.infographicHref}
                alt={`${presentation.id} ${presentation.title} のインフォグラフィック拡大表示`}
                className="w-full bg-white"
              />
            </div>
          </div>
        ) : null}

        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-5 md:px-8">
          <div className="space-y-12">
            {visibleSections.map((section) => (
              <section key={section.heading}>
                <h2 className="border-l-4 border-cyan-700 pl-4 text-2xl font-semibold leading-snug tracking-normal text-slate-950 md:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-5">
                  {section.blocks.map((block, index) => {
                    if (block.type === 'quote') {
                      return (
                        <blockquote
                          key={`${section.heading}-${block.type}-${index}`}
                          className="border-l-4 border-slate-400 bg-white px-5 py-4 text-lg font-semibold leading-9 text-slate-800 shadow-sm"
                        >
                          {block.text}
                        </blockquote>
                      );
                    }

                    if (block.type === 'list') {
                      return (
                        <ul
                          key={`${section.heading}-${block.type}-${index}`}
                          className="space-y-3 border border-slate-200 bg-white p-5 text-base leading-8 text-slate-700 shadow-sm"
                        >
                          {block.items.map((item) => {
                            const splitItem = splitListItemLead(item);

                            return (
                              <li key={item} className="grid grid-cols-[auto_1fr] gap-3">
                                <span className="mt-3 h-2 w-2 rounded-full bg-cyan-700" />
                                <span>
                                  {splitItem ? (
                                    <>
                                      <span className="font-semibold text-slate-950">
                                        {splitItem.lead}
                                      </span>
                                      <span className="text-slate-500">： </span>
                                      <span>{splitItem.body}</span>
                                    </>
                                  ) : (
                                    item
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }

                    return (
                      <p
                        key={`${section.heading}-${block.type}-${index}`}
                        className="text-base leading-8 text-slate-700 md:text-lg md:leading-9"
                      >
                        {block.text}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </article>

        <section id="forum-video" className="border-t border-slate-300 bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-5 md:px-8">
            <p className="text-sm font-semibold tracking-[0.14em] text-rose-900">VIDEO</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950">
              解説動画で振り返る
            </h2>
            <div className="mt-5 aspect-video overflow-hidden border border-slate-300 bg-slate-950 shadow-sm">
              <iframe
                title={`${presentation.id} ${presentation.title} 解説動画`}
                src={youtubeEmbedUrl(presentation.videoUrl)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-300 bg-[#f8f3e9] py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-5 md:px-8">
            {nextPresentation ? (
              <a
                href={presentationTextHref(nextPresentation.id)}
                className="grid gap-4 border border-slate-300 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-600 hover:shadow-lg md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="text-sm font-semibold tracking-[0.14em] text-cyan-900">
                    NEXT PRESENTATION / {nextPresentation.id}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                    {nextPresentation.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {nextPresentation.summary}
                  </p>
                </div>
                <span className="inline-flex items-center justify-center gap-2 border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-950">
                  次の発表に進む
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </a>
            ) : (
              <a
                href={forumHubHref}
                className="inline-flex items-center justify-center gap-2 border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-cyan-950 shadow-sm hover:bg-cyan-50"
              >
                フォーラム一覧へ戻る
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </section>

        <section className="bg-slate-950 py-10 text-white">
          <div className="mx-auto grid max-w-4xl gap-5 px-4 sm:px-5 md:px-8">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-cyan-100">
              <ShieldCheck size={18} aria-hidden="true" />
              BOUNDARY
            </p>
            <div className="grid gap-3 text-sm leading-7 text-white/72 md:grid-cols-3">
              <p className="border border-white/16 bg-white/8 p-4">
                この本文は、NBL仕事条件デザイン・バーチャルフォーラムの発表を、公開記事として読める形に整理したものです。
              </p>
              <p className="border border-white/16 bg-white/8 p-4">
                公式見解、査読済み論文、法的・医学的・雇用上の助言、個別の合理的配慮判断ではありません。
              </p>
              <p className="border border-white/16 bg-white/8 p-4">
                現行制度、統計、助成金、公式ガイダンスを説明する場合は、公開時点で別途確認が必要です。
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: workConditionForumPresentations.map((presentation) => ({
      params: { id: presentation.id },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<WorkConditionForumTextPageProps> = async (context) => {
  const id = String(context.params?.id ?? '');
  const presentation = getWorkConditionForumPresentationById(id);

  if (!presentation) {
    return { notFound: true };
  }

  const [{ readFile }, path] = await Promise.all([import('node:fs/promises'), import('node:path')]);
  const articlePath = path.join(
    process.cwd(),
    'docs',
    'nbl-workspace',
    'work-condition-forum',
    'structured-articles',
    workConditionForumArticleFileName(presentation),
  );
  const markdown = await readFile(articlePath, 'utf8');

  return {
    props: {
      presentation,
      article: parseStructuredArticleMarkdown(markdown),
    },
  };
};
