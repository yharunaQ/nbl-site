import { render, screen } from '@testing-library/react';
import {
  NblVirtualNewsArticlePage,
  getStaticPaths,
  getStaticProps,
} from '@/pages/toolkit-studio/virtual-news/[articleSlug]';
import {
  getNblVirtualNewsArticleBySlug,
  nblVirtualNewsArticles,
} from '@/lib/content/nblVirtualNews';

describe('NBL virtual news restored articles', () => {
  it('keeps all 19 restored full article bodies available through one catalog', () => {
    const slugs = nblVirtualNewsArticles.map((article) => article.slug);

    expect(nblVirtualNewsArticles).toHaveLength(19);
    expect(new Set(slugs).size).toBe(19);
    expect(slugs).toEqual(
      expect.arrayContaining([
        'team-fairness-work-allocation-redesign',
        'medical-information-work-condition-translation',
        'information-access-meeting-emergency-standard',
        'no-handbook-rare-disease-work-difficulty',
      ]),
    );
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
    expect(
      screen.getByText('本人の強み、興味、働きたい方向', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('支援者が一堂に会するのではなく', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('医療判断、就労可否', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('IPS Employment Center: What is IPS?')).toBeInTheDocument();
  });

  it('renders the three priority virtual news additions as full articles', () => {
    for (const slug of [
      'team-fairness-work-allocation-redesign',
      'medical-information-work-condition-translation',
      'information-access-meeting-emergency-standard',
    ]) {
      const article = getNblVirtualNewsArticleBySlug(slug);

      expect(article).not.toBeNull();
      expect(article?.notice).toContain('実在');
      expect(article?.boundary).toMatch(/法的判断|医療判断|人事評価|就労可否/);
    }

    expect(
      getNblVirtualNewsArticleBySlug('team-fairness-work-allocation-redesign')?.sourceLinks,
    ).toHaveLength(0);
    expect(
      getNblVirtualNewsArticleBySlug('information-access-meeting-emergency-standard')?.sourceLinks,
    ).toHaveLength(0);
    expect(
      getNblVirtualNewsArticleBySlug('medical-information-work-condition-translation')?.sourceLinks,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000115267.html',
        }),
        expect.objectContaining({
          href: 'https://chiryoutoshigoto.mhlw.go.jp/files/pdf/support_guideline_full.pdf',
        }),
      ]),
    );

    const teamArticle = getNblVirtualNewsArticleBySlug('team-fairness-work-allocation-redesign');
    render(<NblVirtualNewsArticlePage article={teamArticle!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '配慮の後、誰が何を引き受けたか。架空企業N社、「見えない応援」を業務表に戻す',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('不満の原因を、誰かの性格ではなく仕事の移動として読む。'),
    ).toBeInTheDocument();
    expect(screen.getByText('付箋を囲む研修ではなく', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('ツールキット内の棚')).not.toBeInTheDocument();
  });

  it('uses the current shared infographics for the regional employment article', () => {
    const article = getNblVirtualNewsArticleBySlug(
      'regional-employment-continuity-council',
    );

    expect(article?.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: '/images/axiom-toolkit-selected-infographics/top-08.png',
          alt: '就労選択支援の重要性を示した図解',
        }),
        expect.objectContaining({
          src: '/images/axiom-toolkit-selected-infographics/top-10.png',
          alt: '基礎的研修から始まることを示した図解',
        }),
      ]),
    );
  });

  it('keeps the medical information article framed as news copy, not Axiom promotion copy', () => {
    const article = getNblVirtualNewsArticleBySlug(
      'medical-information-work-condition-translation',
    );

    expect(article).not.toBeNull();
    const { container } = render(<NblVirtualNewsArticlePage article={article!} />);
    const pageText = container.textContent ?? '';

    expect(pageText).toContain('病名ではなく、仕事の接触点を見た');
    expect(pageText).not.toContain('Axiom');
    expect(pageText).not.toContain('Axiom/NBL');
    expect(pageText).not.toContain('NBLが');
    expect(pageText).not.toContain('NBLはこれを置き換えず');
  });

  it('prebuilds every restored virtual news slug', async () => {
    const paths = getStaticPaths({});

    expect(paths).toMatchObject({ fallback: false });
    expect('paths' in paths ? paths.paths : []).toHaveLength(19);

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
