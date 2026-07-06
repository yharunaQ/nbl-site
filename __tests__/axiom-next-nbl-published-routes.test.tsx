import { render, screen, within } from '@testing-library/react';
import AxiomNextNblPublishedSitePage from '@/components/axiom/AxiomNextNblPublishedSitePage';
import {
  AXIOM_NEXT_NBL_PUBLISHED_SLUGS,
  getAxiomNextNblPublishedPath,
  rewriteAxiomCandidateHrefToPublished,
} from '@/lib/axiom/nextNblPublishedRoutes';
import { nblVirtualNewsArticles } from '@/lib/content/nblVirtualNews';
import { nblVirtualNewsRealitySignals } from '@/lib/content/nblVirtualNewsRealitySignals';

function expectDesignGuideBeforeConsultation(nav: HTMLElement) {
  const labels = Array.from(nav.querySelectorAll('a')).map((link) => link.textContent);

  expect(labels.indexOf('設計ガイド')).toBeGreaterThanOrEqual(0);
  expect(labels.indexOf('相談事例')).toBeGreaterThanOrEqual(0);
  expect(labels.indexOf('設計ガイド')).toBeLessThan(labels.indexOf('相談事例'));
}

function expectNoIssueMapInMenu(nav: HTMLElement) {
  expect(within(nav).queryByRole('link', { name: '課題地図' })).not.toBeInTheDocument();
}

describe('Axiom next NBL published routes', () => {
  it('rewrites internal candidate hrefs to published public paths', () => {
    expect(
      rewriteAxiomCandidateHrefToPublished('/internal/axiom-next-nbl-public-candidate/home'),
    ).toBe('/');
    expect(
      rewriteAxiomCandidateHrefToPublished(
        '/internal/axiom-next-nbl-public-candidate/case-readings#consultation-finder',
      ),
    ).toBe('/case-readings#consultation-finder');
  });

  it('renders published navigation without internal candidate links', () => {
    render(<AxiomNextNblPublishedSitePage slug="work-design-views-guide" />);

    expect(screen.getAllByRole('link', { name: 'トップ' })[0]).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: 'バーチャルニュース' })[0]).toHaveAttribute(
      'href',
      '/virtual-news',
    );
    expect(screen.getAllByRole('link', { name: '相談事例' })[0]).toHaveAttribute(
      'href',
      '/case-readings',
    );
    expect(screen.getAllByRole('link', { name: '設計ガイド' })[0]).toHaveAttribute(
      'href',
      '/work-design-views-guide',
    );
    expect(screen.getAllByRole('link', { name: 'NBLレポート' })[0]).toHaveAttribute(
      'href',
      '/articles-social-questions',
    );
    const desktopNav = screen.getByRole('navigation', { name: 'NBL site navigation' });
    expect(within(desktopNav).getByRole('link', { name: 'バーチャルニュース' })).toHaveAttribute(
      'href',
      '/virtual-news',
    );
    expect(within(desktopNav).getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expectDesignGuideBeforeConsultation(desktopNav);
    expect(
      within(desktopNav).queryByRole('link', { name: 'プロジェクト' }),
    ).not.toBeInTheDocument();
    expect(
      within(
        screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
      ).getByRole('link', { name: 'プロジェクト' }),
    ).toHaveAttribute('href', '/projects');
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expectNoIssueMapInMenu(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expect(
      within(screen.getByRole('navigation', { name: 'NBL site mobile navigation' })).getByRole(
        'link',
        { name: 'プロジェクト' },
      ),
    ).toHaveAttribute('href', '/projects');
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', { name: 'NBL site mobile navigation' }),
    );
    expectNoIssueMapInMenu(screen.getByRole('navigation', { name: 'NBL site mobile navigation' }));
    expect(
      screen
        .getAllByRole('link')
        .every(
          (link) =>
            !(link.getAttribute('href') ?? '').startsWith(
              '/internal/axiom-next-nbl-public-candidate',
            ),
        ),
    ).toBe(true);
  });

  it('renders the published home as a why, how, what sequence', () => {
    const { container } = render(<AxiomNextNblPublishedSitePage slug="home" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /障害者雇用・\s*難病就労支援から、\s*AI時代の\s*仕事設計へ。/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('AIが仕事や社会を急速に変える時代には', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('仕事・環境・支援の組み合わせから、働き方と社会参加を設計する力', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '膨大で偏りを含む情報を、実践できる仕事条件の地図へ。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '6つの入口で、NBLが扱う問題空間を見渡す。',
      }),
    ).toBeInTheDocument();
    const hero = screen.getByRole('region', {
      name: /障害者雇用・\s*難病就労支援から、\s*AI時代の仕事設計へ。/,
    });
    expect(within(hero).getByRole('link', { name: /サイト情報/ })).toHaveAttribute(
      'href',
      '/about-boundary',
    );
    expect(within(hero).queryByRole('link', { name: /プロジェクト/ })).not.toBeInTheDocument();
    expect(within(hero).getByRole('img', { name: /断片的な情報/ })).toHaveAttribute(
      'src',
      '/images/next-nbl-home-why-hero-imagegen-v1.png',
    );
    expect(
      screen.queryByRole('img', { name: /働きづらさを仕事条件の地図へ変換/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /現実の課題を、ニュース像として先に読む/ }),
    ).toHaveAttribute('href', '/virtual-news');
    expect((container.textContent ?? '').indexOf('誰もが活躍できる仕事・参加設計へ')).toBeLessThan(
      (container.textContent ?? '').indexOf('一言の相談を、見立てと支援計画へほどく'),
    );
    expect(
      screen.getByText('関心のある入口から、働きづらさの見え方を変える。'),
    ).toBeInTheDocument();
    expect(screen.getByText('NBLを一緒に育てる実装テーマ', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('入口カード自体が地図になる。')).not.toBeInTheDocument();
    expect(screen.queryByText('8つの課題の地図で、問題空間を見渡す')).not.toBeInTheDocument();
    expect(screen.queryByText('ハブを開く')).not.toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link')
        .every(
          (link) =>
            !(link.getAttribute('href') ?? '').startsWith(
              '/internal/axiom-next-nbl-public-candidate',
            ),
        ),
    ).toBe(true);
  });

  it('renders virtual news as a top-level hub while preserving article paths', () => {
    const { container } = render(<AxiomNextNblPublishedSitePage slug="virtual-news" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'NBLバーチャル・ニュース' }),
    ).toBeInTheDocument();
    const forms = Array.from(container.querySelectorAll('form'));
    expect(forms).toHaveLength(1);
    expect(forms[0]).toHaveAttribute('action', '/search');
    const searchInput = container.querySelector('input[name="q"]');
    expect(searchInput).toHaveAttribute('type', 'search');
    expect(searchInput).toHaveAttribute('aria-label', 'サイト内検索');
    expect(
      screen.getByText('制度、職場運用、地域連携、相談線、予算、評価。', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('職場の困りごとを、道具、予算、手順、支援線の問題として読み直す。', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('記事の焦点は付箋を囲む会議ではなく', { exact: false }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('バーチャルニュースに近づいた実ニュース。')).toBeInTheDocument();
    expect(
      (container.textContent ?? '').indexOf('実装されたらニュースになる課題から読む。'),
    ).toBeLessThan(
      (container.textContent ?? '').indexOf('バーチャルニュースに近づいた実ニュース。'),
    );
    expect(screen.getByText('いま現場に近い3つの未解決接点。')).toBeInTheDocument();
    const priorityCards = Array.from(
      container.querySelectorAll('[data-virtual-news-priority-card]'),
    );
    expect(priorityCards).toHaveLength(3);
    expect(priorityCards.map((card) => card.querySelector('a')?.getAttribute('href'))).toEqual([
      '/toolkit-studio/virtual-news/team-fairness-work-allocation-redesign',
      '/toolkit-studio/virtual-news/medical-information-work-condition-translation',
      '/toolkit-studio/virtual-news/information-access-meeting-emergency-standard',
    ]);
    expect(container.querySelectorAll('[data-virtual-news-reality-signal]')).toHaveLength(
      nblVirtualNewsRealitySignals.length,
    );
    expect(
      screen.getByText('SCSK、合理的配慮のガイドを整備、治療との両立サポートとして支援金も'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('NBLはこの記事の内容、制度適合性、企業施策の妥当性を評価・保証しません。', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /原文を開く/ })).toHaveAttribute(
      'href',
      'https://project.nikkeibp.co.jp/HumanCapital/atcl/column/00084/070200064/',
    );
    expect(
      screen.queryByText('個別記事のURLは当面、既存のツールキット内パスを維持しています。'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('現実接点の強い上位入口として読むためのハブです。', { exact: false }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('実在ニュースではありません')).toBeInTheDocument();
    expect(screen.getByText('判断記事ではありません')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-virtual-news-hub-card]')).toHaveLength(
      nblVirtualNewsArticles.length,
    );
    expect(screen.getByRole('link', { name: /障害のある社員への配慮/ })).toHaveAttribute(
      'href',
      '/toolkit-studio/virtual-news/reasonable-accommodation-system-design',
    );
    const desktopNav = screen.getByRole('navigation', { name: 'NBL site navigation' });
    expect(within(desktopNav).getByRole('link', { name: 'バーチャルニュース' })).toHaveAttribute(
      'href',
      '/virtual-news',
    );
    expectDesignGuideBeforeConsultation(desktopNav);
    expectNoIssueMapInMenu(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
  });

  it('defines all eleven published public paths including virtual news and projects', () => {
    expect(
      AXIOM_NEXT_NBL_PUBLISHED_SLUGS.map((slug) => getAxiomNextNblPublishedPath(slug)),
    ).toEqual([
      '/',
      '/virtual-news',
      '/scene-entry',
      '/work-design-views-guide',
      '/case-readings',
      '/articles-social-questions',
      '/toolkit-studio',
      '/work-condition-window',
      '/theory-method-trust',
      '/projects',
      '/about-boundary',
    ]);
  });

  it('renders the published NBL expertise page with the animated hero demo', () => {
    render(<AxiomNextNblPublishedSitePage slug="theory-method-trust" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /部分的な\s*情報を、\s*仕事と参加の\s*専門知識へ/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'NBLの専門性を伝える約1分のデモ' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'デモを一時停止' })).toBeInTheDocument();
  });

  it('renders the projects page inside the Axiom published page wrapper', () => {
    render(<AxiomNextNblPublishedSitePage slug="projects" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '3つのプロジェクトを軸に、一緒に作る人を探しています。',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'プロジェクト' })[0]).toHaveAttribute(
      'href',
      '/projects',
    );
    const desktopNav = screen.getByRole('navigation', { name: 'NBL site navigation' });
    expect(within(desktopNav).getByRole('link', { name: 'バーチャルニュース' })).toHaveAttribute(
      'href',
      '/virtual-news',
    );
    expect(within(desktopNav).getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expectDesignGuideBeforeConsultation(desktopNav);
    expectNoIssueMapInMenu(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expect(
      within(desktopNav).queryByRole('link', { name: 'プロジェクト' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('この入口の位置づけ')).not.toBeInTheDocument();
    expect(
      screen.getByAltText('白い壁を楽しそうに塗る少年と、参加したくなる人々のイラスト'),
    ).toHaveAttribute('src', '/images/nbl-projects-tom-sawyer-wall-painting-hero-v1.png');
    expect(
      screen
        .getAllByRole('link')
        .every(
          (link) =>
            !(link.getAttribute('href') ?? '').startsWith(
              '/internal/axiom-next-nbl-public-candidate',
            ),
        ),
    ).toBe(true);
  });
});
