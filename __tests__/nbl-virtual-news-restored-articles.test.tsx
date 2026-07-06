import { render, screen } from '@testing-library/react';
import {
  NblVirtualNewsArticlePage,
  getStaticPaths,
  getStaticProps,
} from '@/pages/toolkit-studio/virtual-news/[articleSlug]';
import { getNblVirtualNewsArticleBySlug, nblVirtualNewsArticles } from '@/lib/content/nblVirtualNews';

describe('NBL virtual news restored articles', () => {
  it('keeps all 15 restored full article bodies available through one catalog', () => {
    const slugs = nblVirtualNewsArticles.map((article) => article.slug);

    expect(nblVirtualNewsArticles).toHaveLength(15);
    expect(new Set(slugs).size).toBe(15);
    for (const article of nblVirtualNewsArticles) {
      expect(article.articleSections.length).toBeGreaterThanOrEqual(3);
      expect(article.articleSections[0].paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(article.keyPoints.length).toBeGreaterThanOrEqual(4);
      expect(article.procedureSteps.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('renders the Japanese-style IPS article body, not only the summary card text', () => {
    const article = getNblVirtualNewsArticleBySlug('japanese-ips-integrated-employment-support');

    expect(article).not.toBeNull();
    render(<NblVirtualNewsArticlePage article={article!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '求人に人を合わせない。架空地域B市、医療・生活支援とつないで「強みから仕事」を開拓',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('日本型IPS連携プロジェクト', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('本人の強み、興味、働きたい方向', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('支援者が一堂に会するのではなく', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('医療判断、就労可否', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('IPS Employment Center: What is IPS?')).toBeInTheDocument();
  });

  it('prebuilds every restored virtual news slug', async () => {
    const paths = getStaticPaths({});

    expect(paths).toMatchObject({ fallback: false });
    expect('paths' in paths ? paths.paths : []).toHaveLength(15);

    const propsResult = await Promise.resolve(
      getStaticProps({
        params: { articleSlug: 'reasonable-accommodation-system-design' },
      } as Parameters<typeof getStaticProps>[0]),
    );

    expect(propsResult).toMatchObject({
      props: {
        article: {
          slug: 'reasonable-accommodation-system-design',
        },
      },
    });
  });
});
