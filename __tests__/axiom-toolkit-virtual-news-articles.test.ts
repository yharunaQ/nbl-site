import {
  buildToolkitVirtualNewsArticleHref,
  getToolkitVirtualNewsArticleBySlug,
  toolkitVirtualNewsArticles,
} from '@/lib/axiom/toolkitVirtualNewsArticles';

describe('toolkit virtual news article catalog', () => {
  it('publishes stable slugs for every virtual news article', () => {
    const slugs = toolkitVirtualNewsArticles.map((article) => article.slug);

    expect(toolkitVirtualNewsArticles).toHaveLength(15);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs[0]).toBe('reasonable-accommodation-system-design');
    expect(slugs).toContain('accommodation-dialogue-work-design');
  });

  it('builds public article links from the shared catalog', () => {
    const article = getToolkitVirtualNewsArticleBySlug('reasonable-accommodation-system-design');

    expect(article?.title).toContain('障害のある社員への配慮');
    expect(article ? buildToolkitVirtualNewsArticleHref(article) : '').toBe(
      '/toolkit-studio/virtual-news/reasonable-accommodation-system-design',
    );
    expect(getToolkitVirtualNewsArticleBySlug('not-a-real-article')).toBeUndefined();
  });
});
