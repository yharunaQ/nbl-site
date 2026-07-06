import { nblVirtualNewsArticles } from '@/lib/content/nblVirtualNews';

export const TOOLKIT_VIRTUAL_NEWS_BASE_PATH = '/toolkit-studio/virtual-news';

export type ToolkitVirtualNewsArticle = {
  slug: string;
  label: string;
  duration: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

export const toolkitVirtualNewsArticles = nblVirtualNewsArticles.map((article) => ({
  slug: article.slug,
  label: article.issueLabel,
  duration: article.readingTime,
  title: article.title,
  body: article.subtitle,
  image: article.heroImage.src,
  imageAlt: article.heroImage.alt,
})) satisfies ToolkitVirtualNewsArticle[];

export function buildToolkitVirtualNewsArticleHref(article: Pick<ToolkitVirtualNewsArticle, 'slug'>) {
  return `${TOOLKIT_VIRTUAL_NEWS_BASE_PATH}/${article.slug}`;
}

export function getToolkitVirtualNewsArticleBySlug(slug: string) {
  return toolkitVirtualNewsArticles.find((article) => article.slug === slug);
}
